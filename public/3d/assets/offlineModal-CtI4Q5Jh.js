import{t as e}from"./index-BkIkE0cN.js";import{checkPendingCount as t,showSyncToast as n,triggerManualSync as r}from"./syncManager-BhoKUuR_.js";function i(e){if(!e)return{freed:!0};let{renderer:t}=e;return t?.renderLists&&t.renderLists.dispose(),t?.properties,e.render?.(),console.warn(`[MemoryManager] GPU RenderLists and unused shaders purged.`),{freed:!0,timestamp:Date.now()}}async function a(){if(typeof navigator<`u`&&navigator.storage&&navigator.storage.estimate)try{let e=await navigator.storage.estimate(),t=(e.usage/(1024*1024)).toFixed(1),n=(e.quota/(1024*1024)).toFixed(0),r=e.quota?Math.round(e.usage/e.quota*100):0;return{usageMB:parseFloat(t),quotaMB:parseFloat(n),percent:r,supported:!0}}catch(e){console.warn(`[MemoryManager] Storage estimate error:`,e)}return{usageMB:0,quotaMB:0,percent:0,supported:!1}}function o(){if(typeof performance<`u`&&performance.memory){let e=performance.memory;return{usedMB:(e.usedJSHeapSize/(1024*1024)).toFixed(1),totalMB:(e.totalJSHeapSize/(1024*1024)).toFixed(1),limitMB:(e.jsHeapSizeLimit/(1024*1024)).toFixed(0),supported:!0}}return{supported:!1}}var s=null,c=null,l=[{id:`skeletal`,nameVi:`Hệ Xương & Khớp`,nameEn:`Skeletal & Joints System`,icon:`🦴`,models:[`skeletal.glb`,`joints.glb`],sizeMB:2.7},{id:`muscular`,nameVi:`Hệ Cơ Bắp`,nameEn:`Muscular System`,icon:`💪`,models:[`muscular.glb`],sizeMB:4.5},{id:`nervous`,nameVi:`Hệ Thần Kinh & Não`,nameEn:`Nervous System`,icon:`🧠`,models:[`nervous.glb`],sizeMB:3.8},{id:`cardiovascular`,nameVi:`Hệ Tuần Hoàn & Tim`,nameEn:`Cardiovascular System`,icon:`🫀`,models:[`cardiovascular.glb`],sizeMB:5.6},{id:`visceral`,nameVi:`Hệ Nội Tạng, Hô Hấp & Tiêu Hóa`,nameEn:`Visceral & Respiratory System`,icon:`🫁`,models:[`visceral.glb`],sizeMB:1.8},{id:`lymphatic`,nameVi:`Hệ Bạch Huyết`,nameEn:`Lymphatic System`,icon:`🛡️`,models:[`lymphatic.glb`],sizeMB:.4}];async function u(e){c=e,s||(s=document.createElement(`div`),s.id=`offlineModal`,s.className=`offline-modal-backdrop`,s.addEventListener(`click`,e=>{e.target===s&&d()}),document.body.appendChild(s)),s.classList.remove(`hidden`),await f()}function d(){s&&s.classList.add(`hidden`)}async function f(){if(!s)return;let e=await a(),n=o(),r=await t(),i=await _();s.innerHTML=`
    <div class="offline-card animate-in">
      <!-- Modal Header -->
      <div class="offline-header">
        <div class="offline-title-wrap">
          <div class="offline-icon-avatar">⚡</div>
          <div>
            <h3 class="offline-title">Quản Lý Ngoại Tuyến & Bộ Nhớ</h3>
            <span class="offline-sub">Tải trước 3D Model từng hệ • Học tập không cần mạng Internet</span>
          </div>
        </div>
        <button type="button" class="offline-close-btn" id="offlineCloseBtn">&times;</button>
      </div>

      <!-- Sync & Connectivity Status Banner -->
      <div class="offline-status-banner ${navigator.onLine?`online`:`offline`}">
        <div class="status-left">
          <span class="status-indicator-dot"></span>
          <span class="status-title-text">${navigator.onLine?`Đang kết nối Internet`:`Đang hoạt động Ngoại Tuyến (Offline)`}</span>
          <span class="status-sub-text">${r>0?`• Có ${r} thay đổi chờ đồng bộ`:`• Dữ liệu học tập đã đồng bộ`}</span>
        </div>
        <button type="button" class="btn-sync-now" id="btnOfflineSyncNow" ${navigator.onLine?``:`disabled`}>
          🔄 Đồng bộ ngay
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="offline-scroll-body">
        <!-- Hero Download All Box (Mobile-first, high priority) -->
        <div class="offline-hero-download-card">
          <div class="hero-download-badge">
            <span class="pulse-dot"></span>
            KHUYÊN DÙNG CHO TRẢI NGHIỆM MƯỢT NHẤT
          </div>
          <h4 class="hero-download-title">📥 Tải Toàn Bộ Thư Viện Về Máy (Offline 100%)</h4>
          <p class="hero-download-desc">
            Lưu toàn bộ 7 hệ cơ quan giải phẫu 3D (~18.8 MB), từ điển danh pháp y học và các câu hỏi trắc nghiệm vào bộ nhớ máy để học tập mọi lúc mọi nơi mà không cần mạng Internet.
          </p>

          <div class="wifi-advisory-box">
            <span class="wifi-advisory-icon">📶</span>
            <div class="wifi-advisory-content">
              <strong class="wifi-advisory-headline">Lưu ý quan trọng: Nên kết nối Wi-Fi khi tải</strong>
              <p class="wifi-advisory-desc">
                Vui lòng kết nối mạng <strong>Wi-Fi</strong> khi tải để tải nhanh, mượt mà và không tốn dung lượng 4G/5G. Sau khi tải xong, phần mềm sẽ <strong>hoạt động Offline 100%</strong> kể cả khi không có mạng!
              </p>
            </div>
          </div>

          <button type="button" class="btn-hero-download-all" id="btnHeroDownloadAll">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span id="heroDownloadBtnText">TẢI TẤT CẢ VỀ MÁY (DÙNG OFFLINE 100%)</span>
          </button>

          <div class="download-progress-container hidden" id="masterProgressContainer">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="masterProgressBar" style="width: 0%"></div>
            </div>
            <span class="progress-label" id="masterProgressLabel">Đang chuẩn bị tải...</span>
          </div>
        </div>

        <!-- Section 1: Per-System Model Caching -->
        <div class="offline-section">
          <div class="section-header-row">
            <div>
              <h4 class="section-title">📦 Tải Riêng Từng Hệ Mô Hình 3D</h4>
              <p class="section-desc">Hoặc chọn tải riêng từng hệ bạn đang học để tiết kiệm dung lượng điện thoại:</p>
            </div>
            <button type="button" class="btn-download-all" id="btnDownloadAllModels">
              ⚡ Tải tất cả (~18.8 MB)
            </button>
          </div>

          <div class="system-cache-list">
            ${l.map(e=>{let t=e.models.every(e=>i.some(t=>t.includes(e)));return`
                <div class="system-cache-item" data-system="${e.id}">
                  <div class="sys-item-left">
                    <span class="sys-item-icon">${e.icon}</span>
                    <div class="sys-item-text">
                      <strong>${e.nameVi}</strong>
                      <span class="sys-size">${e.nameEn} • ~${e.sizeMB} MB</span>
                    </div>
                  </div>
                  <div class="sys-item-actions">
                    <span class="cache-status-badge ${t?`cached`:`not-cached`}" id="badge-${e.id}">
                      ${t?`✓ Sẵn sàng offline`:`Chưa tải`}
                    </span>
                    <button type="button" class="btn-cache-action ${t?`danger`:`primary`}" data-action="${t?`delete`:`download`}" data-system="${e.id}">
                      ${t?`Xóa cache`:`Tải về`}
                    </button>
                  </div>
                </div>
              `}).join(``)}
          </div>
        </div>

        <!-- Section 2: Pre-cache Study Material -->
        <div class="offline-section">
          <h4 class="section-title">📚 Tải Trước Nội Dung Học Tập</h4>
          <p class="section-desc">Lưu toàn bộ từ điển giải phẫu, liên quan 4 hệ (Cơ-Xương-Thần kinh-Mạch máu) và ngân hàng Quiz thích ứng vào máy:</p>
          <div class="precache-row">
            <button type="button" class="btn-precache-data" id="btnPrecacheData">
              📥 Lưu Từ điển & Dữ liệu Y khoa Offline (~1.2 MB)
            </button>
            <span class="precache-status" id="precacheDataStatus">Đã kích hoạt lưu cục bộ</span>
          </div>
        </div>

        <!-- Section 3: Storage & RAM Management -->
        <div class="offline-section">
          <h4 class="section-title">💾 Dung Lượng & Quản Lý RAM Thiết Bị</h4>
          <div class="storage-stats-grid">
            <div class="stat-card">
              <span class="stat-num">${e.usageMB} MB</span>
              <span class="stat-label">Cache Storage Đã Dùng</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">${e.quotaMB>0?(e.quotaMB/1024).toFixed(1)+` GB`:`Không giới hạn`}</span>
              <span class="stat-label">Dung Lượng Trống Còn Lại</span>
            </div>
            ${n.supported?`
              <div class="stat-card">
                <span class="stat-num">${n.usedMB} MB</span>
                <span class="stat-label">RAM WebGL Hiện Tại</span>
              </div>
            `:``}
          </div>

          <div class="storage-actions-row">
            <button type="button" class="btn-storage-tool" id="btnPurgeRAM">
              🧹 Giải phóng RAM & Buffer WebGL
            </button>
            <button type="button" class="btn-storage-tool danger" id="btnClearAllCache">
              🗑️ Xóa toàn bộ Cache ngoại tuyến
            </button>
          </div>
        </div>
      </div>
    </div>
  `,p()}function p(){document.getElementById(`offlineCloseBtn`)?.addEventListener(`click`,d),document.getElementById(`btnOfflineSyncNow`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`btnOfflineSyncNow`);e&&(e.disabled=!0),await r(),await f()});let t=async()=>{await g()};document.getElementById(`btnHeroDownloadAll`)?.addEventListener(`click`,t),document.getElementById(`btnDownloadAllModels`)?.addEventListener(`click`,t),s.querySelectorAll(`.btn-cache-action`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.system;e.dataset.action===`download`?await m(t):await h(t)})}),document.getElementById(`btnPrecacheData`)?.addEventListener(`click`,async()=>{let t=document.getElementById(`precacheDataStatus`);t&&(t.textContent=`⏳ Đang tải từ điển & ngân hàng câu hỏi...`);try{await fetch(e(`data/definitions.json`)).catch(()=>{}),await fetch(e(`data/lexicon.json`)).catch(()=>{}),await fetch(e(`data/systems.json`)).catch(()=>{}),t&&(t.textContent=`✓ Đã sẵn sàng học tập ngoại tuyến 100%!`),n(`✓ Đã tải trước từ điển và dữ liệu bài học offline!`,`success`)}catch{t&&(t.textContent=`⚠️ Đã lưu một phần dữ liệu`)}}),document.getElementById(`btnPurgeRAM`)?.addEventListener(`click`,()=>{i(c),n(`🧹 Đã giải phóng bộ nhớ RAM, shaders và WebGL render lists!`,`info`),f()}),document.getElementById(`btnClearAllCache`)?.addEventListener(`click`,async()=>{if(confirm(`Bạn có chắc chắn muốn xóa toàn bộ mô hình 3D và dữ liệu đã lưu ngoại tuyến không?`)){if(`serviceWorker`in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:`CLEAR_ALL_CACHES`}),`caches`in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}n(`🗑️ Đã xóa toàn bộ cache ngoại tuyến.`,`warning`),await f()}})}async function m(t){let r=l.find(e=>e.id===t);if(!r)return;let i=document.getElementById(`badge-${t}`);i&&(i.className=`cache-status-badge downloading`,i.textContent=`⏳ Đang tải...`);try{for(let t of r.models){let n=e(`models/${t}`),r=await fetch(n);`caches`in window&&await(await caches.open(`atlas-models-atlas-v6`)).put(n,r)}n(`✓ Đã tải xong ${r.nameVi} vào bộ nhớ ngoại tuyến!`,`success`)}catch(e){n(`❌ Không thể tải ${r.nameVi}: ${e.message}`,`error`)}await f()}async function h(t){let r=l.find(e=>e.id===t);if(r){try{if(`caches`in window){let t=await caches.open(`atlas-models-atlas-v6`);for(let n of r.models){let r=e(`models/${n}`);await t.delete(r)}}n(`✓ Đã xóa cache của ${r.nameVi}`,`info`)}catch(e){console.error(`Delete error:`,e)}await f()}}async function g(){let t=document.getElementById(`masterProgressContainer`),r=document.getElementById(`masterProgressBar`),i=document.getElementById(`masterProgressLabel`),a=document.getElementById(`heroDownloadBtnText`),o=document.getElementById(`btnHeroDownloadAll`);t&&t.classList.remove(`hidden`),o&&(o.disabled=!0,o.style.opacity=`0.85`);let s=0,c=l.length;for(let t=0;t<c;t++){let n=l[t],o=Math.round(t/(c+1)*100);i&&(i.textContent=`Đang tải ${n.nameVi} (${t+1}/${c})... (${o}%)`),a&&(a.textContent=`ĐANG TẢI... (${o}%) - KHUYÊN DÙNG WI-FI`),r&&(r.style.width=`${o}%`);try{for(let t of n.models){let n=e(`models/${t}`),r=await fetch(n);`caches`in window&&await(await caches.open(`atlas-models-atlas-v6`)).put(n,r)}s++}catch(e){console.warn(`Failed model ${n.id}:`,e)}}i&&(i.textContent=`Đang lưu từ điển và dữ liệu giải phẫu... (95%)`),r&&(r.style.width=`95%`);try{for(let t of[`data/systems.json`,`data/lexicon.json`]){let n=e(t),r=await fetch(n);`caches`in window&&await(await caches.open(`atlas-models-atlas-v6`)).put(n,r)}}catch(e){console.warn(`Failed caching JSON:`,e)}r&&(r.style.width=`100%`),i&&(i.textContent=`✓ Đã hoàn tất tải 100% dữ liệu (${s}/${c} hệ giải phẫu)!`),a&&(a.textContent=`✓ ĐÃ TẢI TOÀN BỘ (SẴN SÀNG OFFLINE 100%)`),o&&(o.style.background=`linear-gradient(135deg, #10b981, #059669)`,o.disabled=!1),n(`🎉 Toàn bộ Atlas Giải Phẫu 3D đã sẵn sàng dùng 100% Offline kể cả khi không có mạng!`,`success`),setTimeout(()=>{f()},1200)}async function _(){if(!(`caches`in window))return[];try{return(await(await caches.open(`atlas-models-atlas-v6`)).keys()).map(e=>e.url)}catch{return[]}}export{d as closeOfflineModal,u as openOfflineModal};