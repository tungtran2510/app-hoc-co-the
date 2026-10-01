'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  Stethoscope,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Sliders,
  ShieldAlert,
  Info,
  Activity,
  Crosshair,
} from 'lucide-react';
import {
  CLINICAL_CASES,
  ClinicalCase,
  ImageAnnotationHotspot,
  ImagingModality,
  MEDICAL_ACADEMIC_DISCLAIMER,
} from '@/lib/imagingClinicalData';

export default function ChanDoanHinhAnhPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINICAL_CASES[0].id);
  const [selectedModality, setSelectedModality] = useState<ImagingModality | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(
    CLINICAL_CASES[0].hotspots[0]?.id || null
  );

  // Imaging Controls State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(true);

  // 3D Correlative Slice State
  const [slicePlane, setSlicePlane] = useState<'coronal' | 'axial' | 'sagittal'>('coronal');
  const [sliceDepth, setSliceDepth] = useState<number>(15.0);
  const [activeTab, setActiveTab] = useState<'split' | 'imaging' | '3d'>('split');

  // Quiz State per Case
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Active Case
  const activeCase = useMemo<ClinicalCase>(() => {
    return CLINICAL_CASES.find((c) => c.id === selectedCaseId) || CLINICAL_CASES[0];
  }, [selectedCaseId]);

  // When switching case, update defaults
  const handleSelectCase = (c: ClinicalCase) => {
    setSelectedCaseId(c.id);
    setActiveHotspotId(c.hotspots[0]?.id || null);
    setSlicePlane(c.plane);
    setSliceDepth(c.sliceDepthCm);
    setZoomLevel(1);
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
  };

  // Filtered cases
  const filteredCases = useMemo(() => {
    return CLINICAL_CASES.filter((c) => {
      const matchModality = selectedModality === 'all' || c.modality === selectedModality;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.targetPartNameVi.toLowerCase().includes(q) ||
        c.nameLatin.toLowerCase().includes(q) ||
        c.modalityName.toLowerCase().includes(q) ||
        c.regionName.toLowerCase().includes(q);
      return matchModality && matchSearch;
    });
  }, [selectedModality, searchQuery]);

  // Active Hotspot
  const activeHotspot = useMemo(() => {
    return activeCase.hotspots.find((h) => h.id === activeHotspotId) || activeCase.hotspots[0];
  }, [activeCase, activeHotspotId]);

  // Quiz submission
  const handleSelectOption = (caseId: string, optIndex: number) => {
    if (quizSubmitted[caseId]) return;
    setQuizAnswers((prev) => ({ ...prev, [caseId]: optIndex }));
  };

  const handleSubmitQuiz = (caseId: string) => {
    if (quizAnswers[caseId] === undefined || quizAnswers[caseId] === null) return;
    setQuizSubmitted((prev) => ({ ...prev, [caseId]: true }));
  };

  // Reset adjustments
  const handleResetAdjustments = () => {
    setZoomLevel(1);
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
  };

  // Build 3D atlas deep-link URL
  const atlasDeepLink = `/giai-phau-3d${activeCase.view3DHash || ''}`;

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e6edf3] font-sans pb-24 select-none">
      {/* 1. TOP HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#111827]/95 backdrop-blur border-b border-[#1f2937] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-slate-300 hover:text-white transition-colors text-xs font-semibold"
            >
              <ArrowLeft size={16} />
              <span>Trang chủ</span>
            </Link>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Stethoscope size={18} />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 leading-tight">
                  <span>Chẩn Đoán Hình Ảnh & Lâm Sàng</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    LỆNH #09
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Đối chiếu X-quang, CT, MRI, Siêu âm & Lát cắt Giải phẫu với Mô hình 3D
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={atlasDeepLink}
              prefetch={true}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              title="Mở toàn màn hình trong Atlas 3D"
            >
              <Layers size={15} />
              <span className="hidden sm:inline">Mở Atlas 3D</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. ACADEMIC MEDICAL DISCLAIMER BANNER (BẮT BUỘC) */}
      <section className="bg-amber-950/40 border-b border-amber-600/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-[11.5px] sm:text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-bold block sm:inline mr-1">
              {MEDICAL_ACADEMIC_DISCLAIMER.title}:
            </strong>
            {MEDICAL_ACADEMIC_DISCLAIMER.content}
          </div>
        </div>
      </section>

      {/* 3. MODALITY FILTER & CASE SELECTOR */}
      <nav className="max-w-7xl mx-auto px-4 pt-4">
        {/* Modality Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          <button
            type="button"
            onClick={() => setSelectedModality('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedModality === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tất cả ({CLINICAL_CASES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedModality('xray')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedModality === 'xray'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            X-quang (X-Ray)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModality('ct')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedModality === 'ct'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            CT Scanner
          </button>
          <button
            type="button"
            onClick={() => setSelectedModality('mri')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedModality === 'mri'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Cộng hưởng từ (MRI)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModality('ultrasound')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedModality === 'ultrasound'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Siêu âm FAST
          </button>
          <button
            type="button"
            onClick={() => setSelectedModality('cross_section')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedModality === 'cross_section'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Lát cắt Giải phẫu
          </button>
        </div>

        {/* Case Selector Carousel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
          {filteredCases.map((c) => {
            const isSelected = c.id === activeCase.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCase(c)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#162032] border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-lg'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                        c.modality === 'xray'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : c.modality === 'ct'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : c.modality === 'mri'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : c.modality === 'ultrasound'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {c.modality.toUpperCase()}
                    </span>
                    <span className="text-[10.5px] text-slate-400 font-medium">
                      {c.regionName}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                    {c.title}
                  </h3>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold truncate max-w-[200px]">
                    {c.targetPartNameVi}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    {c.plane}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. MAIN WORKSPACE: CORRELATIVE DUAL VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 mt-5">
        {/* Mobile View Switcher (Visible only on small screens) */}
        <div className="lg:hidden flex rounded-lg bg-slate-900 border border-slate-800 p-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'split' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Đối chiếu đôi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('imaging')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'imaging' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Phim chụp ({activeCase.modality.toUpperCase()})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === '3d' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Mô hình 3D
          </button>
        </div>

        {/* Dual Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* COLUMN 1: MEDICAL IMAGING WORKSTATION */}
          <div
            className={`flex flex-col bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl ${
              activeTab === '3d' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Workstation Header Bar */}
            <div className="bg-[#1e293b] px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  {activeCase.modalityName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Hotspot Toggle */}
                <button
                  type="button"
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={`p-1.5 rounded-md transition-colors ${
                    showHotspots
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title={showHotspots ? 'Ẩn điểm giải phẫu' : 'Hiện điểm giải phẫu'}
                >
                  {showHotspots ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                {/* Crosshair Toggle */}
                <button
                  type="button"
                  onClick={() => setShowCrosshair(!showCrosshair)}
                  className={`p-1.5 rounded-md transition-colors ${
                    showCrosshair
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Tâm đối chiếu lâm sàng"
                >
                  <Crosshair size={15} />
                </button>
                {/* Reset button */}
                <button
                  type="button"
                  onClick={handleResetAdjustments}
                  className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Khôi phục góc nhìn gốc"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Diagnostic Image Display Area */}
            <div
              className="relative w-full aspect-[4/3] bg-black flex items-center justify-center overflow-hidden"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) ${
                  isInverted ? 'invert(1)' : ''
                }`,
              }}
            >
              {/* Orientation DICOM Watermarks */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/40 pointer-events-none">
                SUPERIOR (S)
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/40 pointer-events-none">
                INFERIOR (I)
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white/40 pointer-events-none">
                RIGHT (R)
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white/40 pointer-events-none">
                LEFT (L)
              </span>

              {/* Crosshair Lines */}
              {showCrosshair && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/25 border-dashed border-t border-emerald-400/40" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/25 border-dashed border-l border-emerald-400/40" />
                </div>
              )}

              {/* SVG Medical Illustration / Radiographic Rendering */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-150"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {activeCase.modality === 'xray' && (
                  <svg
                    className="w-full h-full max-h-full p-4"
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Dark Radiography Background */}
                    <rect width="400" height="300" fill="#080a0f" />
                    {/* Pelvic Bone Silhouette */}
                    <path
                      d="M100 80 Q150 50 200 60 Q250 50 300 80 Q330 140 280 180 Q240 190 200 170 Q160 190 120 180 Q70 140 100 80 Z"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    {/* Acetabulum Cup */}
                    <path
                      d="M170 140 Q200 130 220 150 Q210 180 180 175 Z"
                      fill="#0f172a"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    {/* Femoral Head (Caput femoris) */}
                    <circle cx="195" cy="155" r="28" fill="#cbd5e1" opacity="0.85" />
                    {/* Fracture Line across Femoral Neck */}
                    <path
                      d="M190 180 L230 195"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                    />
                    {/* Greater Trochanter & Femoral Shaft */}
                    <path
                      d="M230 195 Q260 205 250 240 L235 300 L195 300 L205 210 Q195 190 190 180 Z"
                      fill="#94a3b8"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                    {/* Shenton's Line (Interrupted - Gãy khúc) */}
                    <path
                      d="M160 185 Q175 195 190 180"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M205 210 Q215 200 230 195"
                      stroke="#f87171"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                )}

                {activeCase.modality === 'ct' && (
                  <svg
                    className="w-full h-full max-h-full p-4"
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="400" height="300" fill="#030712" />
                    {/* Chest Wall & Ribs Oval */}
                    <ellipse
                      cx="200"
                      cy="150"
                      rx="160"
                      ry="120"
                      fill="#111827"
                      stroke="#475569"
                      strokeWidth="3"
                    />
                    {/* Vertebra at posterior */}
                    <circle cx="200" cy="245" r="18" fill="#e2e8f0" />
                    {/* Sternum at anterior */}
                    <rect x="185" y="35" width="30" height="12" rx="4" fill="#e2e8f0" />
                    {/* Right Hemithorax: Tension Pneumothorax (Jet Black air space) */}
                    <path
                      d="M70 150 Q70 80 170 70 L170 230 Q70 220 70 150 Z"
                      fill="#000000"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    {/* Collapsed Right Lung */}
                    <path
                      d="M165 120 Q180 140 170 180 Q155 170 155 130 Z"
                      fill="#334155"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    {/* Shifted Mediastinum & Heart (Deviated to Left) */}
                    <ellipse
                      cx="245"
                      cy="150"
                      rx="38"
                      ry="55"
                      fill="#475569"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      transform="rotate(15 245 150)"
                    />
                    {/* Normal Left Lung (Aerated Gray) */}
                    <path
                      d="M285 100 Q335 120 335 160 Q325 210 280 220 Q285 170 285 100 Z"
                      fill="#1e293b"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </svg>
                )}

                {activeCase.modality === 'mri' && (
                  <svg
                    className="w-full h-full max-h-full p-4"
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="400" height="300" fill="#05070a" />
                    {/* Lumbar Vertebral Bodies or Knee Condyles */}
                    {activeCase.id === 'case_lumbar_disc_herniation' ? (
                      <>
                        {/* L3 Body */}
                        <rect
                          x="150"
                          y="40"
                          width="65"
                          height="40"
                          rx="4"
                          fill="#475569"
                          stroke="#94a3b8"
                          strokeWidth="2"
                        />
                        {/* L4 Body */}
                        <rect
                          x="150"
                          y="95"
                          width="65"
                          height="42"
                          rx="4"
                          fill="#475569"
                          stroke="#94a3b8"
                          strokeWidth="2"
                        />
                        {/* L5 Body */}
                        <rect
                          x="150"
                          y="155"
                          width="65"
                          height="44"
                          rx="4"
                          fill="#475569"
                          stroke="#94a3b8"
                          strokeWidth="2"
                        />
                        {/* Sacrum S1 */}
                        <polygon
                          points="150,215 215,215 200,285 160,285"
                          fill="#334155"
                          stroke="#64748b"
                          strokeWidth="2"
                        />
                        {/* Spinal Canal (T2 Bright CSF) */}
                        <path
                          d="M225 35 Q225 150 225 285 L245 285 Q245 150 245 35 Z"
                          fill="#38bdf8"
                          opacity="0.35"
                        />
                        {/* Herniated Disc L4-L5 protruding posteriorly */}
                        <path
                          d="M152 140 L213 140 Q228 144 228 148 Q228 152 213 153 L152 153 Z"
                          fill="#ef4444"
                          stroke="#f87171"
                          strokeWidth="2"
                        />
                        {/* Compressed Cauda Equina root */}
                        <circle cx="230" cy="148" r="4" fill="#fbbf24" />
                      </>
                    ) : (
                      <>
                        {/* Knee Joint ACL Sagittal MRI */}
                        {/* Femoral Condyle */}
                        <ellipse
                          cx="200"
                          cy="95"
                          rx="65"
                          ry="50"
                          fill="#334155"
                          stroke="#94a3b8"
                          strokeWidth="2"
                        />
                        {/* Tibial Plateau */}
                        <path
                          d="M130 180 Q200 170 270 180 L260 280 L140 280 Z"
                          fill="#334155"
                          stroke="#94a3b8"
                          strokeWidth="2"
                        />
                        {/* Torn ACL fibers with edema */}
                        <line
                          x1="185"
                          y1="175"
                          x2="215"
                          y2="125"
                          stroke="#ef4444"
                          strokeWidth="5"
                          strokeDasharray="6 3"
                        />
                        {/* Patella Anteriorly */}
                        <polygon
                          points="110,85 130,95 125,135 105,120"
                          fill="#64748b"
                          stroke="#cbd5e1"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </svg>
                )}

                {activeCase.modality === 'ultrasound' && (
                  <svg
                    className="w-full h-full max-h-full p-4"
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="400" height="300" fill="#020408" />
                    {/* Ultrasound Fan Beam Sector */}
                    <path
                      d="M200 20 L50 280 Q200 300 350 280 Z"
                      fill="#0b1120"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                    {/* Spleen Contour */}
                    <path
                      d="M130 90 Q220 70 270 130 Q240 180 150 160 Z"
                      fill="#1f2937"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    {/* Free Fluid (Anechoic Jet Black Strip in Splenorenal space) */}
                    <path
                      d="M170 165 Q220 175 250 155 Q245 190 180 185 Z"
                      fill="#000000"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    {/* Upper pole of Left Kidney */}
                    <ellipse
                      cx="210"
                      cy="225"
                      rx="45"
                      ry="35"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  </svg>
                )}

                {activeCase.modality === 'cross_section' && (
                  <svg
                    className="w-full h-full max-h-full p-4"
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="400" height="300" fill="#090d16" />
                    {/* Cross-section Body Outer Contour */}
                    <ellipse
                      cx="200"
                      cy="150"
                      rx="160"
                      ry="115"
                      fill="#1e1b4b"
                      stroke="#6366f1"
                      strokeWidth="2"
                    />
                    {/* Vertebra T4 at back */}
                    <circle cx="200" cy="240" r="16" fill="#cbd5e1" stroke="#475569" />
                    {/* Aortic Arch (Curving anterior-to-posterior) */}
                    <path
                      d="M185 105 Q210 90 225 125 Q220 160 195 165"
                      stroke="#ef4444"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    {/* Trachea Bifurcation (Carina) */}
                    <ellipse cx="205" cy="180" rx="10" ry="8" fill="#000000" stroke="#38bdf8" strokeWidth="2" />
                    {/* Superior Vena Cava (SVC) */}
                    <circle cx="160" cy="120" r="11" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
                    {/* Lungs Lateral Bilateral */}
                    <path d="M70 150 Q90 100 130 110 L130 200 Q80 200 70 150 Z" fill="#0f172a" />
                    <path d="M330 150 Q310 100 270 110 L270 200 Q320 200 330 150 Z" fill="#0f172a" />
                  </svg>
                )}
              </div>

              {/* Hotspot Interactive Pins */}
              {showHotspots &&
                activeCase.hotspots.map((hs, idx) => {
                  const isActive = hs.id === activeHotspotId;
                  return (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => setActiveHotspotId(hs.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                      title={hs.label}
                    >
                      <span className="relative flex h-7 w-7 items-center justify-center">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isActive ? 'bg-emerald-400' : 'bg-sky-400'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center text-[10px] font-black shadow-lg ${
                            isActive
                              ? 'bg-emerald-500 text-slate-950 ring-2 ring-white'
                              : 'bg-sky-500 text-white hover:scale-110'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </span>
                    </button>
                  );
                })}
            </div>

            {/* Workstation Bottom Adjuster Toolbar */}
            <div className="bg-[#111827] p-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Sliders size={13} /> Chỉnh ảnh:
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                  className="p-1 rounded bg-slate-800 text-slate-200 hover:text-white"
                  title="Phóng to"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
                  className="p-1 rounded bg-slate-800 text-slate-200 hover:text-white"
                  title="Thu nhỏ"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsInverted(!isInverted)}
                  className={`px-2 py-1 rounded text-[10.5px] font-semibold transition-colors ${
                    isInverted ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}
                  title="Đảo âm bản / dương bản"
                >
                  Đảo âm bản
                </button>
              </div>

              {/* Window/Level Quick Presets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(120);
                    setContrast(140);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                >
                  Cửa sổ Xương
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                >
                  Mô mềm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(85);
                    setContrast(160);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                >
                  Cửa sổ Phổi
                </button>
              </div>
            </div>

            {/* Active Hotspot Inspector Card */}
            {activeHotspot && (
              <div className="bg-[#162032] p-3 border-t border-slate-800/80">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300">
                        {activeHotspot.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-serif italic text-slate-400 block mt-0.5">
                      Latin: {activeHotspot.nameLatin}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Hệ: {activeHotspot.system}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-300 mt-2 leading-relaxed bg-[#0b1322] p-2 rounded-lg border border-slate-800/80">
                  <strong className="text-slate-200">Ý nghĩa lâm sàng:</strong>{' '}
                  {activeHotspot.clinicalSignificance}
                </p>
              </div>
            )}
          </div>

          {/* COLUMN 2: SYNCHRONIZED 3D ANATOMY & SLICE CORRELATOR */}
          <div
            className={`flex flex-col bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl ${
              activeTab === 'imaging' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* 3D Correlative Header Bar */}
            <div className="bg-[#1e293b] px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers size={15} className="text-indigo-400" />
                  <span>Đối chiếu 3D Giải phẫu tương ứng</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={atlasDeepLink}
                  prefetch={true}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-[11px] font-bold transition-colors"
                >
                  <span>Mở 3D Riêng</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>

            {/* Slicing Plane Controller (Coronal / Axial / Sagittal) */}
            <div className="bg-[#111827] px-3.5 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-medium">Mặt cắt:</span>
                <button
                  type="button"
                  onClick={() => setSlicePlane('coronal')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    slicePlane === 'coronal'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Coronal (Đứng ngang)
                </button>
                <button
                  type="button"
                  onClick={() => setSlicePlane('axial')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    slicePlane === 'axial'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Axial (Ngang)
                </button>
                <button
                  type="button"
                  onClick={() => setSlicePlane('sagittal')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    slicePlane === 'sagittal'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Sagittal (Đứng dọc)
                </button>
              </div>

              {/* Slicing Depth Slider */}
              <div className="flex items-center gap-2 flex-1 max-w-[220px]">
                <span className="text-[10px] text-slate-400 font-mono">Độ sâu:</span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={sliceDepth}
                  onChange={(e) => setSliceDepth(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10.5px] font-mono text-emerald-400 w-12 text-right">
                  {sliceDepth.toFixed(1)}cm
                </span>
              </div>
            </div>

            {/* Synchronized 3D Viewer Container */}
            <div className="relative w-full aspect-[4/3] bg-[#070b12] flex items-center justify-center overflow-hidden">
              <iframe
                src={`/3d/index.html${activeCase.view3DHash || ''}`}
                title={`Mô hình 3D đối chiếu ${activeCase.targetPartNameVi}`}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
              />

              {/* Live Overlay Badge on 3D Viewport */}
              <div className="absolute top-2 left-2 z-10 bg-slate-950/80 backdrop-blur px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-[11px] flex flex-col pointer-events-none">
                <span className="font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {activeCase.targetPartNameVi}
                </span>
                <span className="text-[10px] text-slate-400 font-serif italic">
                  {activeCase.nameLatin}
                </span>
              </div>

              {/* Live Clipping Plane Watermark Indicator */}
              <div className="absolute bottom-2 right-2 z-10 bg-slate-950/80 backdrop-blur px-2 py-1 rounded border border-slate-800 text-[10px] font-mono text-emerald-400 pointer-events-none">
                CLIP: {slicePlane.toUpperCase()} @ {sliceDepth}cm
              </div>
            </div>

            {/* 3D Anatomical Correlation Summary Footer */}
            <div className="bg-[#111827] p-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Hệ cơ quan:</span>
                <span className="font-bold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-slate-800">
                  {activeCase.targetSystem}
                </span>
              </div>
              <Link
                href={atlasDeepLink}
                prefetch={true}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 text-[11.5px]"
              >
                <span>Mở trong không gian 3D</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* 5. CLINICAL CASE STUDY & DIAGNOSTIC REASONING DOSSIER */}
        <section className="mt-8 bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                Hồ Sơ Ca Lâm Sàng & Phân Tích Liên Hệ Giải Phẫu
              </h2>
              <p className="text-[11px] text-slate-400">
                Tổng hợp bệnh sử, triệu chứng, dấu hiệu hình ảnh & cơ chế giải phẫu bệnh lý
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {/* Left Block: Bệnh sử & Triệu chứng */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Bệnh sử & Cơ chế chấn thương
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#162032] p-3 rounded-xl border border-slate-800/80">
                  {activeCase.patientHistory}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Triệu chứng lâm sàng điển hình
                </h4>
                <ul className="space-y-1.5">
                  {activeCase.symptoms.map((sym, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-start gap-2 bg-[#162032] p-2.5 rounded-lg border border-slate-800/60"
                    >
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Block: Dấu hiệu hình ảnh & Phân tích giải phẫu */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Dấu hiệu hình ảnh học ({activeCase.modality.toUpperCase()})
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#162032] p-3 rounded-xl border border-slate-800/80">
                  {activeCase.imagingFindings}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Liên hệ Giải phẫu – Triệu chứng – Hình ảnh
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#162032] p-3 rounded-xl border border-slate-800/80">
                  {activeCase.anatomicalCorrelation}
                </p>
              </div>

              {activeCase.commonPitfalls && (
                <div className="bg-rose-950/20 border border-rose-800/30 p-3 rounded-xl">
                  <h4 className="text-[11px] font-bold text-rose-300 uppercase flex items-center gap-1 mb-1">
                    <AlertTriangle size={13} />
                    Cạm bẫy lâm sàng thường gặp (Pitfalls)
                  </h4>
                  <p className="text-[11.5px] text-rose-200/90 leading-relaxed">
                    {activeCase.commonPitfalls}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 6. CLINICAL REASONING QUIZ */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="bg-[#111827] rounded-xl border border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={16} className="text-purple-400" />
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Câu hỏi suy luận lâm sàng & Giải phẫu ứng dụng
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed mb-3">
                {activeCase.clinicalQuiz.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {activeCase.clinicalQuiz.options.map((opt, optIdx) => {
                  const isSelected = quizAnswers[activeCase.id] === optIdx;
                  const isSubmitted = quizSubmitted[activeCase.id];
                  const isCorrect = optIdx === activeCase.clinicalQuiz.correctIndex;

                  let optClass =
                    'bg-[#162032] border-slate-800 text-slate-300 hover:border-slate-700';
                  if (isSelected && !isSubmitted) {
                    optClass = 'bg-purple-950/40 border-purple-500 text-white';
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(activeCase.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action & Explanation */}
              <div className="mt-3 flex items-center justify-between">
                {!quizSubmitted[activeCase.id] ? (
                  <button
                    type="button"
                    disabled={quizAnswers[activeCase.id] === undefined}
                    onClick={() => handleSubmitQuiz(activeCase.id)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Kiểm tra câu trả lời
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    {quizAnswers[activeCase.id] === activeCase.clinicalQuiz.correctIndex
                      ? '✓ Chính xác!'
                      : '✕ Chưa chính xác, hãy xem phân tích bên dưới:'}
                  </span>
                )}
              </div>

              {quizSubmitted[activeCase.id] && (
                <div className="mt-3 p-3 rounded-lg bg-[#162032] border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in duration-200">
                  <strong className="text-emerald-300 font-bold block mb-1">
                    Giải thích chuyên môn:
                  </strong>
                  {activeCase.clinicalQuiz.explanation}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 7. STRICT ACADEMIC DISCLAIMER FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-1">
        <p>
          Tài liệu tham khảo chuyên môn: Netter&apos;s Clinical Anatomy, Gray&apos;s Anatomy for Students,
          Fleischner Society Guidelines, ACR Appropriateness Criteria.
        </p>
        <p>© 2026 Medica Learn - Học Cơ Thể. Bản quyền đào tạo giải phẫu và chẩn đoán hình ảnh học thuật.</p>
      </footer>
    </div>
  );
}
