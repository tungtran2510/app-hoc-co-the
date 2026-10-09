import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Đọc .env.local thủ công
const envPath = path.resolve('.env.local');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const env = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = val;
    }
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
const ADMIN_PHONE = env.ADMIN_PHONE || '0974248716';

const BASE_URL = 'http://localhost:3270';

async function runTests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ AN NINH BẢO MẬT ===\n');

  let passCount = 0;
  let totalCount = 5;

  // TEST 1: Đăng nhập bằng mật khẩu Tung@2510 phải BỊ TỪ CHỐI 100%
  console.log('1. Kiểm tra mật khẩu cũ "Tung@2510":');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: ADMIN_PHONE, password: 'Tung@2510' }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 400) {
      console.log(`   [PASS] Mật khẩu Tung@2510 bị TỪ CHỐI (Status ${res.status}: ${data.error})`);
      passCount++;
    } else {
      console.error(`   [FAIL] Mật khẩu Tung@2510 không bị từ chối! Status: ${res.status}`);
    }
  } catch (err) {
    console.error(`   [ERROR] ${err.message}`);
  }

  // TEST 2: Đăng nhập không có số điện thoại phải BỊ TỪ CHỐI 100%
  console.log('\n2. Kiểm tra đăng nhập chỉ bằng mật khẩu (không có SĐT):');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD || 'test' }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 400) {
      console.log(`   [PASS] Bắt buộc có SĐT (Status 400: ${data.error})`);
      passCount++;
    } else {
      console.error(`   [FAIL] Không chặn đăng nhập thiếu SĐT! Status: ${res.status}`);
    }
  } catch (err) {
    console.error(`   [ERROR] ${err.message}`);
  }

  // TEST 3: Dùng anon key đọc bảng settings và admin_accounts
  console.log('\n3. Kiểm tra rò rỉ mật khẩu qua Supabase ANON KEY:');
  try {
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Đọc settings
    const { data: settingsData, error: stErr } = await supabaseAnon
      .from('settings')
      .select('*')
      .eq('workspace_id', 'default')
      .maybeSingle();

    if (stErr) {
      console.log(`   [NOTE] Lỗi đọc settings từ anon: ${stErr.message}`);
    }

    let hasPasswordInSettings = false;
    if (settingsData) {
      if (settingsData.admin_password) {
        hasPasswordInSettings = true;
        console.error('   [FAIL] settings.admin_password vẫn còn giá trị công khai!');
      }
      if (settingsData.block_styles?.admin_accounts && settingsData.block_styles.admin_accounts.length > 0) {
        hasPasswordInSettings = true;
        console.error('   [FAIL] settings.block_styles.admin_accounts vẫn chứa danh sách tài khoản!');
      }
    }

    // Đọc admin_accounts bằng anon
    const { data: accountsData, error: accErr } = await supabaseAnon
      .from('admin_accounts')
      .select('*');

    const accountsBlocked = accErr || !accountsData || accountsData.length === 0;

    if (!hasPasswordInSettings && accountsBlocked) {
      console.log('   [PASS] Anon key KHÔNG THỂ đọc được bất kỳ mật khẩu nào (settings sạch, admin_accounts bị RLS chặn).');
      passCount++;
    } else {
      console.error(`   [FAIL] Phát hiện nguy cơ rò rỉ credentials qua anon key!`);
    }
  } catch (err) {
    console.error(`   [ERROR] ${err.message}`);
  }

  // TEST 4: Trang chủ hiển thị bình thường
  console.log('\n4. Kiểm tra trang chủ hiển thị bình thường:');
  try {
    const res = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
    if (res.ok) {
      const html = await res.text();
      const hasTitle = html.includes('Qbiz') || html.includes('chủ đề') || html.includes('học');
      if (hasTitle) {
        console.log(`   [PASS] Trang chủ phản hồi HTTP ${res.status}, tải nội dung bình thường.`);
        passCount++;
      } else {
        console.error(`   [FAIL] Trang chủ tải nội dung không đúng định dạng.`);
      }
    } else {
      console.error(`   [FAIL] Trang chủ trả về HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`   [ERROR] ${err.message}`);
  }

  // TEST 5: Đăng nhập bằng ADMIN_PASSWORD mới và Lưu Settings
  console.log('\n5. Kiểm tra đăng nhập với ADMIN_PASSWORD và lưu Settings:');
  try {
    if (!ADMIN_PASSWORD) {
      console.log('   [CHƯA KIỂM CHỨNG] Chưa có biến ADMIN_PASSWORD trong môi trường.');
    } else {
      const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: ADMIN_PHONE, password: ADMIN_PASSWORD }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.token) {
        console.log('   [PASS] Đăng nhập quản trị với ADMIN_PASSWORD thành công.');
        
        // Kiểm tra lưu Settings
        const saveRes = await fetch(`${BASE_URL}/api/admin/save-settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': loginData.token,
          },
          body: JSON.stringify({
            settings: {
              app_name: 'Học Hiểu Cơ Thể & Giải Phẫu',
            },
          }),
        });
        const saveData = await saveRes.json();
        if (saveRes.ok && saveData.success) {
          console.log('   [PASS] Admin lưu Settings thành công.');
          passCount++;
        } else {
          console.error(`   [FAIL] Lưu Settings thất bại: ${saveData.error}`);
        }
      } else {
        console.log(`   [NOTE] Đăng nhập với ADMIN_PASSWORD chưa khớp: ${loginData.error}`);
      }
    }
  } catch (err) {
    console.error(`   [ERROR] ${err.message}`);
  }

  console.log(`\n=== TỔNG KẾT: ${passCount}/${totalCount} TIÊU CHÍ ĐẠT ===`);
}

runTests();
