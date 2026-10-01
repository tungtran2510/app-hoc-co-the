import fs from 'fs';
import path from 'path';

export interface QCErrorItem {
  check: string;
  message: string;
}

export interface QCReport {
  timestamp: string;
  version: string;
  status: 'PASS' | 'FAIL';
  score: number;
  totalChecks: number;
  passedChecks: number;
  criticalErrors: QCErrorItem[];
  warnings: QCErrorItem[];
  metrics: {
    totalModelsSizeMB?: number;
    totalStructuresInLexicon?: number;
    [key: string]: any;
  };
}

const BUDGETS = {
  MAX_MODEL_SIZE_MB: 8.0, // Alert if single GLB exceeds 8MB
  MAX_TOTAL_MODELS_MB: 25.0, // Alert if all models exceed 25MB
  REQUIRED_SYSTEMS: ['skeletal', 'muscular', 'nervous', 'cardiovascular', 'visceral', 'joints', 'lymphatic']
};

export async function runAnatomyQC(options: { silent?: boolean } = {}): Promise<QCReport> {
  const silent = options.silent || false;
  const ROOT_DIR = process.cwd();

  const report: QCReport = {
    timestamp: new Date().toISOString(),
    version: '1.2.0',
    status: 'PASS',
    score: 100,
    totalChecks: 0,
    passedChecks: 0,
    criticalErrors: [],
    warnings: [],
    metrics: {}
  };

  function check(name: string, condition: boolean, errorMsg: string, isCritical = true) {
    report.totalChecks++;
    if (condition) {
      report.passedChecks++;
    } else {
      if (isCritical) {
        report.criticalErrors.push({ check: name, message: errorMsg });
        report.status = 'FAIL';
      } else {
        report.warnings.push({ check: name, message: errorMsg });
      }
    }
  }

  // Helper to resolve public assets located in public/3d/ or public/
  const resolvePublicPath = (...subpaths: string[]) => {
    const p3d = path.join(ROOT_DIR, 'public', '3d', ...subpaths);
    if (fs.existsSync(p3d)) return p3d;
    return path.join(ROOT_DIR, 'public', ...subpaths);
  };

  // 1. PERFORMANCE & MODEL FILE SIZE QC
  const modelsDir = resolvePublicPath('models');
  check('MODELS_DIR_EXISTS', fs.existsSync(modelsDir), `Models directory missing: ${modelsDir}`, true);

  let totalModelsSize = 0;
  if (fs.existsSync(modelsDir)) {
    for (const sysId of BUDGETS.REQUIRED_SYSTEMS) {
      const glbPath = path.join(modelsDir, `${sysId}.glb`);
      const exists = fs.existsSync(glbPath);
      check(`MODEL_EXISTS_${sysId.toUpperCase()}`, exists, `Missing GLB model file for system: ${sysId}.glb`, true);

      if (exists) {
        const stats = fs.statSync(glbPath);
        const sizeMB = stats.size / (1024 * 1024);
        totalModelsSize += sizeMB;

        check(
          `BUDGET_${sysId.toUpperCase()}`,
          sizeMB <= BUDGETS.MAX_MODEL_SIZE_MB,
          `Model ${sysId}.glb exceeds size budget (${sizeMB.toFixed(2)} MB > ${BUDGETS.MAX_MODEL_SIZE_MB} MB)`,
          false
        );
      }
    }
  }

  check(
    'TOTAL_MODELS_BUDGET',
    totalModelsSize <= BUDGETS.MAX_TOTAL_MODELS_MB,
    `Total model size (${totalModelsSize.toFixed(2)} MB) exceeds budget (${BUDGETS.MAX_TOTAL_MODELS_MB} MB)`,
    false
  );
  report.metrics.totalModelsSizeMB = parseFloat(totalModelsSize.toFixed(2));

  // Check Draco WASM decoders
  const dracoDir = resolvePublicPath('draco');
  check('DRACO_DIR_EXISTS', fs.existsSync(dracoDir), 'Draco decoder directory public/draco missing', true);
  if (fs.existsSync(dracoDir)) {
    check('DRACO_WASM_EXISTS', fs.existsSync(path.join(dracoDir, 'draco_decoder.wasm')), 'draco_decoder.wasm missing', true);
    check('DRACO_JS_EXISTS', fs.existsSync(path.join(dracoDir, 'draco_wasm_wrapper.js')), 'draco_wasm_wrapper.js missing', true);
  }

  // 2. TERMINOLOGY & DATA INTEGRITY QC
  const dataDir = resolvePublicPath('data');
  const systemsPath = path.join(dataDir, 'systems.json');
  const lexiconPath = path.join(dataDir, 'lexicon.json');
  const defsPath = path.join(dataDir, 'definitions.json');

  check('DATA_SYSTEMS_EXISTS', fs.existsSync(systemsPath), 'systems.json missing', true);
  check('DATA_LEXICON_EXISTS', fs.existsSync(lexiconPath), 'lexicon.json missing', true);
  check('DATA_DEFINITIONS_EXISTS', fs.existsSync(defsPath), 'definitions.json missing', true);

  let lexiconData: Record<string, any> = {};
  let systemsData: Record<string, any> = {};
  if (fs.existsSync(lexiconPath)) {
    try {
      lexiconData = JSON.parse(fs.readFileSync(lexiconPath, 'utf8'));
    } catch (e: any) {
      check('LEXICON_JSON_PARSE', false, `Invalid JSON in lexicon.json: ${e.message}`, true);
    }
  }
  if (fs.existsSync(systemsPath)) {
    try {
      systemsData = JSON.parse(fs.readFileSync(systemsPath, 'utf8'));
    } catch (e: any) {
      check('SYSTEMS_JSON_PARSE', false, `Invalid JSON in systems.json: ${e.message}`, true);
    }
  }

  const structureKeys = Object.keys(lexiconData);
  report.metrics.totalStructuresInLexicon = structureKeys.length;
  check('STRUCTURES_COUNT', structureKeys.length > 500, `Structure count suspiciously low: ${structureKeys.length}`, true);

  let missingLatinCount = 0;
  const entries = Object.entries(lexiconData).slice(0, 500);
  for (const [, item] of entries) {
    if (!item.la && !item.latin && !item.name_latin) missingLatinCount++;
  }
  check('LATIN_TERMINOLOGY_COVERAGE', missingLatinCount < 50, `Too many structures missing Latin TA2 names (${missingLatinCount}/500 sampled)`, false);

  // 3. HIERARCHY & SYSTEM INTEGRITY QC
  let orphanPointers = 0;
  if (systemsData && typeof systemsData === 'object') {
    for (const [, items] of Object.entries(systemsData)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.parentId && !items.some((p: any) => p.id === item.parentId) && !structureKeys.includes(item.parentId)) {
            orphanPointers++;
          }
        }
      }
    }
  }
  check('HIERARCHY_INTEGRITY', orphanPointers === 0, `Detected ${orphanPointers} orphan parent pointers in hierarchy`, false);

  // 4. LICENSE & COMPLIANCE QC
  const licensePath = path.join(ROOT_DIR, 'LICENSE');
  const noticePath = path.join(ROOT_DIR, 'NOTICE');
  const modelsLicensePath = path.join(modelsDir, 'License.txt');

  check('LICENSE_FILE_EXISTS', fs.existsSync(licensePath), 'Root LICENSE file missing', true);
  check('NOTICE_FILE_EXISTS', fs.existsSync(noticePath), 'Root NOTICE file missing', true);

  if (fs.existsSync(modelsLicensePath)) {
    const licContent = fs.readFileSync(modelsLicensePath, 'utf8');
    const hasNCViolation = (licContent.includes('CC-BY-NC') || licContent.includes('CC-NC')) && !licContent.includes('replaced with CC-BY 4.0');
    check('NO_NON_COMMERCIAL_RESTRICTIONS', !hasNCViolation, 'Detected Non-Commercial (NC) restrictions in model license', true);
  }

  // 5. PWA & OFFLINE INFRASTRUCTURE QC
  const swPath = fs.existsSync(path.join(ROOT_DIR, 'public', '3d', 'sw.js'))
    ? path.join(ROOT_DIR, 'public', '3d', 'sw.js')
    : path.join(ROOT_DIR, 'public', 'sw.js');
  const manifestPath = fs.existsSync(path.join(ROOT_DIR, 'public', '3d', 'manifest.json'))
    ? path.join(ROOT_DIR, 'public', '3d', 'manifest.json')
    : path.join(ROOT_DIR, 'public', 'manifest.json');

  check('SW_EXISTS', fs.existsSync(swPath), 'sw.js missing', true);
  check('MANIFEST_EXISTS', fs.existsSync(manifestPath), 'manifest.json missing', true);

  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      check('MANIFEST_STANDALONE', manifest.display === 'standalone', 'PWA display is not standalone', true);
      check('MANIFEST_SHORTCUTS', Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 2, 'PWA shortcuts missing or < 2', false);
    } catch (e: any) {
      check('MANIFEST_JSON_VALID', false, `Invalid JSON in manifest: ${e.message}`, true);
    }
  }

  // Summary
  const score = Math.round((report.passedChecks / report.totalChecks) * 100);
  report.score = score;

  return report;
}
