import { NextRequest, NextResponse } from 'next/server';
import {
  getAnatomyStructures,
  saveAnatomyStructure,
  deleteAnatomyStructure,
  createSnapshot,
  rollbackVersion,
  getAuditLogs,
  getVersionList,
  AnatomyStructure
} from '../../../../lib/anatomyAdminData';
import { runAnatomyQC } from '../../../../lib/anatomyQC';
import { checkIsAdminRequest } from '../../../../lib/authServer';

export async function GET(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }
  try {
    const structures = getAnatomyStructures();
    const auditLogs = getAuditLogs();
    const versions = getVersionList();

    const verified = structures.filter(s => s.curationStatus === 'da_kiem_duyet').length;
    const pending = structures.filter(s => s.curationStatus === 'cho_duyet').length;
    const needsReview = structures.filter(s => s.curationStatus === 'can_bo_sung').length;
    const totalWarnings = structures.reduce((acc, s) => acc + (s.warnings?.length || 0), 0);

    return NextResponse.json({
      success: true,
      activeVersion: versions[0]?.version || '1.0.0',
      stats: {
        total: structures.length,
        verified,
        pending,
        needsReview,
        totalWarnings
      },
      structures,
      auditLogs,
      versions
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi khi tải dữ liệu giải phẫu' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { action, structure, partId, version, description, author } = body;

    const currentAuthor = author || 'Bác sĩ Kiểm duyệt';

    if (action === 'SAVE_STRUCTURE') {
      if (!structure || !structure.partId) {
        return NextResponse.json({ error: 'Mã cấu trúc (partId) không được để trống' }, { status: 400 });
      }
      const result = saveAnatomyStructure(structure, currentAuthor);
      return NextResponse.json(result);
    }

    if (action === 'DELETE_STRUCTURE') {
      if (!partId) {
        return NextResponse.json({ error: 'Thiếu partId để xóa' }, { status: 400 });
      }
      const success = deleteAnatomyStructure(partId, currentAuthor);
      return NextResponse.json({ success });
    }

    if (action === 'CREATE_SNAPSHOT') {
      if (!version) {
        return NextResponse.json({ error: 'Vui lòng nhập số phiên bản (VD: 1.3.0)' }, { status: 400 });
      }
      const snapshot = createSnapshot(version, description || 'Bản cập nhật thuật ngữ y khoa', currentAuthor);
      return NextResponse.json({ success: true, snapshot });
    }

    if (action === 'ROLLBACK') {
      if (!version) {
        return NextResponse.json({ error: 'Vui lòng chọn phiên bản để rollback' }, { status: 400 });
      }
      const success = rollbackVersion(version, currentAuthor);
      return NextResponse.json({ success, version });
    }

    if (action === 'RUN_QC') {
      try {
        const report = await runAnatomyQC({ silent: true });
        return NextResponse.json({ success: true, report });
      } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Lỗi khi chạy bộ QC' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Hành động (action) không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu quản trị' }, { status: 500 });
  }
}
