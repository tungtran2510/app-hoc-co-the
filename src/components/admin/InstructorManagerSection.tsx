'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Phone,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { InstructorAccount } from '../../lib/types';
import { getInstructorAccountsApi, saveInstructorAccountApi } from '../../lib/apiAdmin';

interface TopicOption {
  id: string;
  title: string;
  slug: string;
}

export default function InstructorManagerSection() {
  const [accounts, setAccounts] = useState<InstructorAccount[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State (Thêm mới hoặc Chỉnh sửa)
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formAllTopics, setFormAllTopics] = useState(false);
  const [formSelectedTopics, setFormSelectedTopics] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load danh sách
  const loadAccounts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/manage-accounts', {
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('app_admin_token') || '' : '',
        },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Chưa tải được danh sách tài khoản');
        return;
      }
      setAccounts(data.accounts || []);
      setTopics(data.topics || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingAccountId(null);
    setFormName('');
    setFormPhone('');
    setFormPassword('');
    setFormAllTopics(false);
    setFormSelectedTopics([]);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleOpenEdit = (acc: InstructorAccount) => {
    setEditingAccountId(acc.id);
    setFormName(acc.name);
    setFormPhone(acc.phone);
    setFormPassword(''); // Không hiện mật khẩu cũ vì lý do an toàn, chỉ nhập nếu muốn đổi
    const hasAll = acc.allowed_topic_ids.includes('*');
    setFormAllTopics(hasAll);
    setFormSelectedTopics(hasAll ? [] : acc.allowed_topic_ids);
    setIsEditing(true);
  };

  const handleToggleTopic = (topicIdOrSlug: string) => {
    if (formSelectedTopics.includes(topicIdOrSlug)) {
      setFormSelectedTopics(formSelectedTopics.filter((id) => id !== topicIdOrSlug));
    } else {
      setFormSelectedTopics([...formSelectedTopics, topicIdOrSlug]);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formName.trim()) {
      setErrorMsg('Vui lòng nhập tên giảng viên');
      return;
    }
    const cleanPhone = formPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Số điện thoại không hợp lệ');
      return;
    }
    if (!editingAccountId && (!formPassword || formPassword.trim().length < 4)) {
      setErrorMsg('Mật khẩu tạo mới phải có ít nhất 4 ký tự');
      return;
    }

    const finalAllowedTopics = formAllTopics ? ['*'] : formSelectedTopics;
    if (!formAllTopics && finalAllowedTopics.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 chủ đề/khóa học bàn giao cho giảng viên');
      return;
    }

    try {
      setSubmitting(true);
      if (editingAccountId) {
        // Cập nhật
        const res = await saveInstructorAccountApi('update', {
          accountId: editingAccountId,
          account: {
            name: formName.trim(),
            phone: cleanPhone,
            password: formPassword.trim() || undefined,
            allowed_topic_ids: finalAllowedTopics,
          },
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Cập nhật tài khoản thất bại');
          return;
        }
        setAccounts(res.accounts || []);
        setSuccessMsg(`Đã cập nhật tài khoản cho "${formName.trim()}" thành công!`);
      } else {
        // Tạo mới
        const res = await saveInstructorAccountApi('create', {
          account: {
            name: formName.trim(),
            phone: cleanPhone,
            password: formPassword.trim(),
            allowed_topic_ids: finalAllowedTopics,
          },
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Tạo tài khoản thất bại');
          return;
        }
        setAccounts(res.accounts || []);
        setSuccessMsg(`Đã cấp tài khoản giảng viên mới cho "${formName.trim()}" thành công!`);
      }
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi lưu tài khoản');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (acc: InstructorAccount) => {
    try {
      const res = await saveInstructorAccountApi('toggle', { accountId: acc.id });
      if (res.success) {
        setAccounts(res.accounts || []);
      } else {
        alert(res.error || 'Không thể đổi trạng thái');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (acc: InstructorAccount) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản giảng viên "${acc.name}" (${acc.phone})?`)) {
      return;
    }
    try {
      const res = await saveInstructorAccountApi('delete', { accountId: acc.id });
      if (res.success) {
        setAccounts(res.accounts || []);
        setSuccessMsg(`Đã xóa tài khoản "${acc.name}"`);
      } else {
        alert(res.error || 'Không thể xóa tài khoản');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối');
    }
  };

  // Helper hiển thị tên các chủ đề được cấp quyền
  const renderTopicBadge = (allowedIds: string[]) => {
    if (allowedIds.includes('*')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
          <ShieldCheck size={12} />
          Toàn quyền tất cả chủ đề
        </span>
      );
    }
    const matched = topics.filter((t) => allowedIds.includes(t.id) || allowedIds.includes(t.slug));
    if (matched.length === 0) {
      return (
        <span className="text-[11px] text-muted italic">
          Chưa gán chủ đề nào
        </span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {matched.map((t) => (
          <span
            key={t.id}
            className="px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-surface-2 text-ink border border-line"
          >
            {t.title}
          </span>
        ))}
      </div>
    );
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
              Tài khoản Giảng viên ({accounts.length})
            </span>
            <p className="text-[12px] text-muted">
              Cấp quyền quản lý và biên tập từng khóa học riêng biệt
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-primary text-white font-bold text-[13px] hover:bg-primary-dark cursor-pointer shadow-xs transition-colors"
          >
            <UserPlus size={15} />
            <span>Thêm giảng viên</span>
          </button>
        </div>
      )}

      {/* FORM THÊM / SỬA GIẢNG VIÊN */}
      {isEditing ? (
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-3.5 p-4 rounded-[16px] bg-surface-2 border border-line animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="text-[14px] font-extrabold text-ink">
              {editingAccountId ? 'Chỉnh sửa tài khoản Giảng viên' : 'Cấp tài khoản Giảng viên mới'}
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="text-[13px] text-muted hover:text-ink font-semibold"
            >
              Hủy
            </button>
          </div>

          {/* Tên */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              Tên Giảng viên / Bác sĩ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ví dụ: Bs. Minh Tuấn (Chuyên gia Cột sống)"
              className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
              required
            />
          </div>

          {/* SĐT đăng nhập */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              Số điện thoại đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white font-mono"
                required
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">
              {editingAccountId ? 'Mật khẩu mới (bỏ trống nếu giữ nguyên)' : 'Mật khẩu đăng nhập'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder={editingAccountId ? 'Nhập nếu muốn đổi mật khẩu' : 'Tối thiểu 4 ký tự'}
                className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
              />
            </div>
          </div>

          {/* Phân quyền Chủ đề / Khóa học */}
          <div className="flex flex-col gap-2 pt-2 border-t border-line">
            <label className="text-[12px] font-bold text-ink">
              Chủ đề / Khóa học được phân quyền biên tập <span className="text-red-500">*</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-[10px] bg-white border border-line cursor-pointer hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={formAllTopics}
                onChange={(e) => setFormAllTopics(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-[13px] font-bold text-ink">
                Toàn quyền tất cả các chủ đề trong hệ thống
              </span>
            </label>

            {!formAllTopics && (
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto p-2 bg-white rounded-[10px] border border-line">
                {topics.length === 0 ? (
                  <span className="text-[12px] text-muted italic">Đang tải danh sách chủ đề...</span>
                ) : (
                  topics.map((t) => {
                    const isChecked = formSelectedTopics.includes(t.id) || formSelectedTopics.includes(t.slug);
                    return (
                      <label
                        key={t.id}
                        className="flex items-center gap-2 p-1.5 hover:bg-surface rounded-[6px] cursor-pointer text-[13px]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTopic(t.id)}
                          className="w-3.5 h-3.5 text-primary rounded"
                        />
                        <span className="text-ink font-medium">{t.title}</span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Nút lưu */}
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
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{editingAccountId ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}</span>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* DANH SÁCH GIẢNG VIÊN HIỆN CÓ */
        <div className="flex flex-col gap-2.5">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted text-[13px]">
              <Loader2 size={18} className="animate-spin mr-2" />
              Đang tải danh sách tài khoản...
            </div>
          ) : accounts.length === 0 ? (
            <div className="p-6 text-center rounded-[16px] bg-surface-2 border border-line text-muted">
              <Users size={28} className="mx-auto mb-2 text-muted/60" />
              <p className="text-[13px] font-bold text-ink">Chưa có tài khoản giảng viên nào</p>
              <p className="text-[12px] mt-0.5">
                Bấm &quot;Thêm giảng viên&quot; ở trên để tạo tài khoản con quản lý từng khóa học.
              </p>
            </div>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className={`p-3.5 rounded-[16px] border transition-all ${
                  acc.is_active !== false
                    ? 'bg-white border-line shadow-xs'
                    : 'bg-surface border-line opacity-65'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-extrabold text-ink">
                        {acc.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          acc.is_active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {acc.is_active !== false ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[12px] text-muted mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {acc.phone}
                      </span>
                    </div>

                    {/* Danh sách chủ đề được giao */}
                    <div className="mt-2">
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                        Phân quyền khóa học:
                      </span>
                      {renderTopicBadge(acc.allowed_topic_ids || [])}
                    </div>
                  </div>

                  {/* Hành động */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(acc)}
                      title={acc.is_active !== false ? 'Tạm khóa tài khoản' : 'Kích hoạt lại'}
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      {acc.is_active !== false ? <Unlock size={14} /> : <Lock size={14} className="text-amber-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(acc)}
                      title="Chỉnh sửa tài khoản"
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted hover:text-primary hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(acc)}
                      title="Xóa tài khoản"
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
