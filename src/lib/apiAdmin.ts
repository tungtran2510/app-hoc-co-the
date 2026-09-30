import { Block, Page, Topic, Settings, AuthorProfile } from './types';

export async function saveBlockApi(block: Block): Promise<{ success: boolean; error?: string; block?: Block }> {
  try {
    const res = await fetch('/api/admin/save-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ block }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'Chưa lưu được khối, thử lại' };
    }
    return { success: true, block: data.block };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa lưu được khối' };
  }
}

export async function deleteBlockApi(blockId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/delete-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blockId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Chưa xóa được khối, thử lại' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa xóa được khối' };
  }
}

export async function savePageApi(page: Partial<Page> & { id?: string }): Promise<{ success: boolean; error?: string; page?: Page }> {
  try {
    const res = await fetch('/api/admin/save-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'Chưa lưu được trang, thử lại' };
    }
    return { success: true, page: data.page };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa lưu được trang' };
  }
}

export async function deletePageApi(pageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/delete-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Chưa xóa được trang, thử lại' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa xóa được trang' };
  }
}

export async function saveTopicApi(topic: Partial<Topic> & { id?: string }): Promise<{ success: boolean; error?: string; topic?: Topic }> {
  try {
    const res = await fetch('/api/admin/save-topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'Chưa lưu được chủ đề, thử lại' };
    }
    return { success: true, topic: data.topic };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa lưu được chủ đề' };
  }
}

export async function deleteTopicApi(topicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/delete-topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Chưa xóa được chủ đề, thử lại' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa xóa được chủ đề' };
  }
}

export async function saveSettingsApi(
  settings: Partial<Omit<Settings, 'author_profile'>> & { author_profile?: Partial<AuthorProfile> | null }
): Promise<{ success: boolean; error?: string; settings?: Settings }> {
  try {
    const res = await fetch('/api/admin/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'Chưa lưu được cài đặt, thử lại' };
    }
    return { success: true, settings: data.settings };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi mạng, chưa lưu được cài đặt' };
  }
}

