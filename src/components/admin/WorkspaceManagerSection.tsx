'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Phone,
  KeyRound,
  Copy,
  Layers,
} from 'lucide-react';
import { WorkspaceTenant } from '../../lib/types';
import { getWorkspacesApi, saveWorkspaceApi } from '../../lib/apiAdmin';

export default function WorkspaceManagerSection() {
  const [workspaces, setWorkspaces] = useState<WorkspaceTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formOwnerPhone, setFormOwnerPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formCustomDomain, setFormCustomDomain] = useState('');
  const [formCopyTemplate, setFormCopyTemplate] = useState(true);
  const [formNote, setFormNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await getWorkspacesApi();
      if (!res.success) {
        setErrorMsg(res.error || 'Chưa tải được danh sách khách hàng');
        return;
      }
      setWorkspaces(res.workspaces || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingWorkspaceId(null);
    setFormName('');
    setFormId('');
    setFormOwnerName('');
    setFormOwnerPhone('');
    setFormPassword('');
    setFormCustomDomain('');
    setFormCopyTemplate(true);
    setFormNote('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleOpenEdit = (w: WorkspaceTenant) => {
    setEditingWorkspaceId(w.id);
    setFormId(w.id);
    setFormName(w.name);
    setFormOwnerName(w.owner_name || w.name);
    setFormOwnerPhone(w.owner_phone);
    setFormPassword(''); // Không hiện mật khẩu cũ vì an toàn
    setFormCustomDomain(w.custom_domain || '');
    setFormCopyTemplate(false);
    setFormNote(w.note || '');
    setIsEditing(true);
  };

  // Tự động tạo slug khi gõ tên
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingWorkspaceId && !formId) {
      const slug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormId(slug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formName.trim()) {
      setErrorMsg('Vui lòng nhập tên ứng dụng / phòng khám');
      return;
    }
    const cleanId = formId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!cleanId || cleanId.length < 2) {
      setErrorMsg('Mã cơ sở (Slug) không hợp lệ');
      return;
    }
    const cleanPhone = formOwnerPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Số điện thoại chủ sở hữu không hợp lệ');
      return;
    }
    if (!editingWorkspaceId && (!formPassword || formPassword.trim().length < 4)) {
      setErrorMsg('Mật khẩu quản trị phải có ít nhất 4 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      if (editingWorkspaceId) {
        // Cập nhật
        const res = await saveWorkspaceApi('update', {
          workspaceId: editingWorkspaceId,
          workspace: {
            name: formName.trim(),
            owner_name: formOwnerName.trim() || formName.trim(),
            owner_phone: cleanPhone,
            admin_password: formPassword.trim() || undefined,
            custom_domain: formCustomDomain.trim() || null,
            note: formNote.trim(),
          },
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Cập nhật thất bại');
          return;
        }
        setWorkspaces(res.workspaces || []);
        setSuccessMsg(`Đã cập nhật cơ sở "${formName.trim()}" thành công!`);
      } else {
        // Tạo mới
        const res = await saveWorkspaceApi('create', {
          workspace: {
            id: cleanId,
            name: formName.trim(),
            owner_name: formOwnerName.trim() || formName.trim(),
            owner_phone: cleanPhone,
            admin_password: formPassword.trim(),
            custom_domain: formCustomDomain.trim() || null,
            copy_template: formCopyTemplate,
            note: formNote.trim(),
          },
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Khởi tạo cơ sở thất bại');
          return;
        }
        setWorkspaces(res.workspaces || []);
        setSuccessMsg(`Đã khởi tạo thành công App riêng cho "${formName.trim()}"!`);
      }
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi lưu cơ sở');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (w: WorkspaceTenant) => {
    try {
      const res = await saveWorkspaceApi('toggle', { workspaceId: w.id });
      if (res.success) {
        setWorkspaces(res.workspaces || []);
      } else {
        alert(res.error || 'Không thể đổi trạng thái');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (w: WorkspaceTenant) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cơ sở "${w.name}" (Mã: ${w.id})?`)) {
      return;
    }
    try {
      const res = await saveWorkspaceApi('delete', { workspaceId: w.id });
      if (res.success) {
        setWorkspaces(res.workspaces || []);
        setSuccessMsg(`Đã xóa cơ sở "${w.name}"`);
      } else {
        alert(res.error || 'Không thể xóa cơ sở');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Thông báo */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Danh sách & Nút thêm */}
      {!isEditing && (
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <div>
            <span className="text-[15px] font-bold text-ink">
              Cơ sở Khách hàng / App riêng ({workspaces.length})
            </span>
            <p className="text-[12px] text-muted">
              Phân phối ứng dụng độc lập cho nhiều bác sĩ, phòng khám
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-primary text-white font-bold text-[13px] hover:bg-primary-dark cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <PlusCircle size={15} />
            <span>Cấp App mới</span>
          </button>
        </div>
      )}

      {/* FORM TẠO / SỬA CƠ SỞ */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 p-4 rounded-[16px] bg-surface-2 border border-line animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="text-[14px] font-extrabold text-ink">
              {editingWorkspaceId ? 'Chỉnh sửa cơ sở khách hàng' : 'Cấp ứng dụng riêng cho khách hàng mới'}
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="text-[13px] text-muted hover:text-ink font-semibold"
            >
              Hủy
            </button>
          </div>

          {/* Tên App / Phòng khám */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              Tên Ứng dụng / Phòng khám / Bác sĩ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ví dụ: Cột Sống Khỏe - Bs. Tuấn"
              className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white font-semibold"
              required
            />
          </div>

          {/* Mã Slug */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              Mã hệ thống (Slug định danh URL) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-[13px] text-muted font-mono select-none">/w/</span>
              <input
                type="text"
                value={formId}
                onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                disabled={!!editingWorkspaceId}
                placeholder="bs-tuan"
                className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white font-mono disabled:opacity-60"
                required
              />
            </div>
            <span className="text-[11px] text-muted">
              Khách hàng sẽ truy cập qua link: <code>/?ws={formId || 'ma-co-so'}</code>
            </span>
          </div>

          {/* Người đại diện & SĐT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-ink">
                Tên Chủ sở hữu / Bác sĩ
              </label>
              <input
                type="text"
                value={formOwnerName}
                onChange={(e) => setFormOwnerName(e.target.value)}
                placeholder="Bs. Nguyễn Văn Tuấn"
                className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-ink">
                SĐT đăng nhập quản trị <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-2.5 text-muted" />
                <input
                  type="tel"
                  value={formOwnerPhone}
                  onChange={(e) => setFormOwnerPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              {editingWorkspaceId ? 'Mật khẩu quản trị mới (bỏ trống nếu giữ nguyên)' : 'Mật khẩu quản trị khởi tạo'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder={editingWorkspaceId ? 'Nhập nếu muốn đổi mật khẩu' : 'Mật khẩu riêng cho khách (vd: Tuan@2026)'}
                className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
              />
            </div>
          </div>

          {/* Tùy chọn sao chép khóa học mẫu */}
          {!editingWorkspaceId && (
            <div className="p-3 rounded-[12px] bg-white border border-line">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formCopyTemplate}
                  onChange={(e) => setFormCopyTemplate(e.target.checked)}
                  className="w-4 h-4 text-primary rounded mt-0.5"
                />
                <div>
                  <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                    <Layers size={14} className="text-primary" />
                    Tự động sao chép 8 chuyên đề mẫu sang app này
                  </span>
                  <p className="text-[12px] text-muted mt-0.5">
                    Khách hàng sẽ có sẵn toàn bộ kho bài học, video và tài liệu chuẩn để sử dụng ngay mà không phải gõ lại.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Tên miền riêng (Tùy chọn) */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              Tên miền riêng của khách (Tùy chọn)
            </label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                value={formCustomDomain}
                onChange={(e) => setFormCustomDomain(e.target.value)}
                placeholder="Ví dụ: bacsituancotsong.com"
                className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              Ghi chú hợp đồng / Thu phí
            </label>
            <input
              type="text"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              placeholder="Ghi chú: Đã thanh toán gói 1 năm..."
              className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
            />
          </div>

          {/* Nút submit */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="h-9 px-4 rounded-[10px] bg-surface text-ink text-[13px] font-bold hover:bg-line cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 h-9 px-5 rounded-[10px] bg-primary text-white text-[13px] font-bold hover:bg-primary-dark cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Đang khởi tạo...</span>
                </>
              ) : (
                <span>{editingWorkspaceId ? 'Cập nhật cơ sở' : 'Khởi tạo App Khách hàng'}</span>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* DANH SÁCH CÁC CƠ SỞ HIỆN CÓ */
        <div className="flex flex-col gap-2.5">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted text-[13px]">
              <Loader2 size={18} className="animate-spin mr-2" />
              Đang tải danh sách cơ sở...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-6 text-center rounded-[16px] bg-surface-2 border border-line text-muted">
              <Building2 size={28} className="mx-auto mb-2 text-muted/60" />
              <p className="text-[13px] font-bold text-ink">Chưa có ứng dụng khách hàng nào</p>
              <p className="text-[12px] mt-0.5">
                Bấm &quot;Cấp App mới&quot; ở trên để khởi tạo app riêng biệt cho từng khách hàng hoặc phòng khám.
              </p>
            </div>
          ) : (
            workspaces.map((w) => (
              <div
                key={w.id}
                className={`p-3.5 rounded-[16px] border transition-all ${
                  w.is_active !== false
                    ? 'bg-white border-line shadow-xs'
                    : 'bg-surface border-line opacity-65'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-extrabold text-ink">
                        {w.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          w.is_active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.is_active !== false ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted mt-1 font-mono">
                      <span>Mã: <strong>{w.id}</strong></span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {w.owner_phone}
                      </span>
                    </div>

                    {/* Link truy cập */}
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`/?ws=${w.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-primary/10 text-primary text-[12px] font-bold hover:bg-primary/20 transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>Xem App khách: /?ws={w.id}</span>
                      </a>
                    </div>
                  </div>

                  {/* Hành động */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(w)}
                      title={w.is_active !== false ? 'Tạm khóa cơ sở' : 'Kích hoạt lại'}
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      {w.is_active !== false ? <Unlock size={14} /> : <Lock size={14} className="text-amber-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(w)}
                      title="Chỉnh sửa thông tin"
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted hover:text-primary hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(w)}
                      title="Xóa cơ sở"
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
