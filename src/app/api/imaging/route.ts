import { NextResponse } from 'next/server';
import { getClinicalCases, getClinicalCaseById, MEDICAL_ACADEMIC_DISCLAIMER } from '@/lib/imagingClinicalData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get('id');
  const modality = searchParams.get('modality');

  if (caseId) {
    const singleCase = getClinicalCaseById(caseId);
    if (!singleCase) {
      return NextResponse.json({ error: 'Clinical case not found' }, { status: 404 });
    }
    return NextResponse.json({
      disclaimer: MEDICAL_ACADEMIC_DISCLAIMER,
      case: singleCase,
    });
  }

  let cases = getClinicalCases();
  if (modality && modality !== 'all') {
    cases = cases.filter((c) => c.modality === modality);
  }

  return NextResponse.json({
    disclaimer: MEDICAL_ACADEMIC_DISCLAIMER,
    total: cases.length,
    cases,
  });
}
