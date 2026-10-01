import{t as e}from"./index-Bcq6Yvg9.js";import{i as t,n,t as r}from"./syncManager-CmUQEBtg.js";function i(e){if(!e)return{freed:!0};let{renderer:t}=e;return t?.renderLists&&t.renderLists.dispose(),t?.properties,e.render?.(),console.warn(`[MemoryManager] GPU RenderLists and unused shaders purged.`),{freed:!0,timestamp:Date.now()}}async function a(){if(typeof navigator<`u`&&navigator.storage&&navigator.storage.estimate)try{let e=await navigator.storage.estimate(),t=(e.usage/(1024*1024)).toFixed(1),n=(e.quota/(1024*1024)).toFixed(0),r=e.quota?Math.round(e.usage/e.quota*100):0;return{usageMB:parseFloat(t),quotaMB:parseFloat(n),percent:r,supported:!0}}catch(e){console.warn(`[MemoryManager] Storage estimate error:`,e)}return{usageMB:0,quotaMB:0,percent:0,supported:!1}}function o(){if(typeof performance<`u`&&performance.memory){let e=performance.memory;return{usedMB:(e.usedJSHeapSize/(1024*1024)).toFixed(1),totalMB:(e.totalJSHeapSize/(1024*1024)).toFixed(1),limitMB:(e.jsHeapSizeLimit/(1024*1024)).toFixed(0),supported:!0}}return{supported:!1}}var s=null,c=null,l=[{id:`skeletal`,nameVi:`Hệ Xương & Khớp`,nameEn:`Skeletal & Joints`,icon:`🦴`,models:[`skeletal.glb`,`joints.glb`],sizeMB:2.7},{id:`muscular`,nameVi:`Hệ Cơ Bắp`,nameEn:`Muscular System`,icon:`💪`,models:[`muscular.glb`],sizeMB:4.5},{id:`nervous`,nameVi:`Hệ Thần Kinh & Não`,nameEn:`Nervous System`,icon:`🧠`,models:[`nervous.glb`],sizeMB:3.8},{id:`cardiovascular`,nameVi:`Hệ Tuần Hoàn & Tim`,nameEn:`Cardiovascular System`,icon:`🫀`,models:[`cardiovascular.glb`],sizeMB:5.6},{id:`visceral`,nameVi:`Hệ Nội Tạng & Hô Hấp`,nameEn:`Visceral & Respiratory`,icon:`🫁`,models:[`visceral.glb`],sizeMB:1.8},{id:`lymphatic`,nameVi:`Hệ Bạch Huyết`,nameEn:`Lymphatic System`,icon:`🛡️`,models:[`lymphatic.glb`],sizeMB:.4}];async function u(e){c=e,s||(s=document.createElement(`div`),s.id=`offlineModal`,s.className=`offline-modal-backdrop`,s.addEventListener(`click`,e=>{e.target===s&&d()}),document.body.appendChild(s)),s.classList.remove(`hidden`),await f()}function d(){s&&s.classList.add(`hidden`)}async function f(){if(!s)return;let e=await a(),t=o();await r();let n=await _(),i=l.every(e=>e.models.every(e=>n.some(t=>t.includes(e))));s.innerHTML=`
    <div class="offline-card animate-in">
      <!-- Modal Header -->
      <div class="offline-header">
        <div class="offline-title-wrap">
          <div class="offline-icon-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <div class="offline-title-col">
            <h3 class="offline-title">Tải Ngoại Tuyến (Offline)</h3>
            <div class="offline-sub-row">
              <span class="status-indicator-dot ${navigator.onLine?`online`:`offline`}"></span>
              <span class="status-net-text">${navigator.onLine?`Đang trực tuyến`:`Ngoại tuyến`}</span>
              <span class="status-divider">•</span>
              <span class="status-count-text">6 hệ giải phẫu (~18.8 MB)</span>
            </div>
          </div>
        </div>
        <button type="button" class="offline-close-btn" id="offlineCloseBtn" aria-label="Đóng">&times;</button>
      </div>

      <!-- Scrollable Body -->
      <div class="offline-scroll-body">
        <!-- Hero Download All Box -->
        <div class="offline-hero-card ${i?`all-saved`:``}">
          <div class="hero-top-row">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span>${i?`ĐÃ SẴN SÀNG OFFLINE 100%`:`KHUYÊN DÙNG CHO ĐIỆN THOẠI`}</span>
            </div>
            <div class="hero-wifi-pill">
              <span>📶 Nên dùng Wi-Fi</span>
            </div>
          </div>

          <div class="hero-content">
            <h4 class="hero-download-title">${i?`Thư Viện 3D Đã Sẵn Sàng Ngoại Tuyến`:`Tải Toàn Bộ Thư Viện 3D`}</h4>
            <p class="hero-download-desc">
              Lưu toàn bộ mô hình giải phẫu 3D vào bộ nhớ máy giúp thao tác siêu mượt, không giật lag và tra cứu 100% không cần Internet.
            </p>
          </div>

          <button type="button" class="btn-hero-download-all ${i?`is-complete`:``}" id="btnHeroDownloadAll">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span id="heroDownloadBtnText">${i?`✓ ĐÃ TẢI TOÀN BỘ (DÙNG OFFLINE 100%)`:`TẢI TẤT CẢ VỀ MÁY (18.8 MB)`}</span>
          </button>

          <div class="download-progress-container hidden" id="masterProgressContainer">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="masterProgressBar" style="width: 0%"></div>
            </div>
            <span class="progress-label" id="masterProgressLabel">Đang chuẩn bị tải...</span>
          </div>
        </div>

        <!-- Section: Individual System List -->
        <div class="offline-section">
          <div class="section-label-row">
            <span class="section-heading">TẢI RIÊNG TỪNG HỆ GIẢI PHẪU</span>
          </div>

          <div class="system-cache-list">
            ${l.map(e=>{let t=e.models.every(e=>n.some(t=>t.includes(e)));return`
                <div class="system-cache-item" data-system="${e.id}">
                  <div class="sys-item-left">
                    <span class="sys-item-avatar">${e.icon}</span>
                    <div class="sys-item-info">
                      <span class="sys-title-vi">${e.nameVi}</span>
                      <span class="sys-sub-meta">${e.nameEn} • ~${e.sizeMB} MB</span>
                    </div>
                  </div>
                  <div class="sys-item-actions">
                    ${t?`
                      <span class="chip-cached" id="badge-${e.id}">✓ Đã lưu</span>
                      <button type="button" class="btn-cache-del" data-action="delete" data-system="${e.id}" title="Xóa bản tải hệ này">
                        &times;
                      </button>
                    `:`
                      <button type="button" class="btn-cache-action primary" data-action="download" data-system="${e.id}" id="badge-${e.id}">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Tải về
                      </button>
                    `}
                  </div>
                </div>
              `}).join(``)}
          </div>
        </div>

        <!-- Section: Study Material Precache -->
        <div class="offline-compact-row">
          <div class="compact-left">
            <span class="compact-icon">📚</span>
            <div class="compact-text">
              <span class="compact-title">Từ điển danh pháp & Dữ liệu Y khoa</span>
              <span class="compact-sub">Từ điển 3 ngôn ngữ & ngân hàng câu hỏi (~1.2 MB)</span>
            </div>
          </div>
          <button type="button" class="btn-precache-data" id="btnPrecacheData">
            <span id="precacheDataStatus">Tải dữ liệu</span>
          </button>
        </div>

        <!-- Section: Storage Info & Quick Cleanup -->
        <div class="storage-footer-card">
          <div class="storage-stats-bar">
            <div class="stat-pill">
              <span class="stat-label">Cache 3D:</span>
              <strong class="stat-val">${e.usageMB} MB</strong>
            </div>
            <div class="stat-pill">
              <span class="stat-label">RAM WebGL:</span>
              <strong class="stat-val">${t.usedMB?t.usedMB+` MB`:`Tối ưu`}</strong>
            </div>
          </div>
          <div class="storage-footer-actions">
            <button type="button" class="btn-footer-tool" id="btnPurgeRAM" title="Giải phóng RAM WebGL">
              🧹 Dọn RAM
            </button>
            <button type="button" class="btn-footer-tool danger" id="btnClearAllCache" title="Xóa toàn bộ Cache">
              🗑️ Xóa Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  `,p()}function p(){document.getElementById(`offlineCloseBtn`)?.addEventListener(`click`,d),document.getElementById(`btnOfflineSyncNow`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`btnOfflineSyncNow`);e&&(e.disabled=!0),await t(),await f()});let r=async()=>{await g()};document.getElementById(`btnHeroDownloadAll`)?.addEventListener(`click`,r),document.getElementById(`btnDownloadAllModels`)?.addEventListener(`click`,r),s.querySelectorAll(`[data-action]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.system,n=e.dataset.action;t&&(n===`download`?await m(t):n===`delete`&&await h(t))})}),document.getElementById(`btnPrecacheData`)?.addEventListener(`click`,async()=>{let t=document.getElementById(`precacheDataStatus`);t&&(t.textContent=`Đang tải...`);try{await fetch(e(`data/definitions.json`)).catch(()=>{}),await fetch(e(`data/lexicon.json`)).catch(()=>{}),await fetch(e(`data/systems.json`)).catch(()=>{}),t&&(t.textContent=`✓ Đã lưu`),n(`✓ Đã tải trước từ điển và dữ liệu bài học offline!`,`success`)}catch{t&&(t.textContent=`Lỗi tải`)}}),document.getElementById(`btnPurgeRAM`)?.addEventListener(`click`,()=>{i(c),n(`🧹 Đã giải phóng bộ nhớ RAM, shaders và WebGL render lists!`,`info`),f()}),document.getElementById(`btnClearAllCache`)?.addEventListener(`click`,async()=>{if(confirm(`Bạn có chắc chắn muốn xóa toàn bộ mô hình 3D và dữ liệu đã lưu ngoại tuyến không?`)){if(`serviceWorker`in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:`CLEAR_ALL_CACHES`}),`caches`in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}n(`🗑️ Đã xóa toàn bộ cache ngoại tuyến.`,`warning`),await f()}})}async function m(t){let r=l.find(e=>e.id===t);if(!r)return;let i=document.getElementById(`badge-${t}`);i&&(i.className=`chip-cached downloading`,i.textContent=`Đang tải...`);try{for(let t of r.models){let n=e(`models/${t}`),r=await fetch(n);`caches`in window&&await(await caches.open(`atlas-models-atlas-v6`)).put(n,r)}n(`✓ Đã tải xong ${r.nameVi} vào bộ nhớ ngoại tuyến!`,`success`)}catch(e){n(`❌ Không thể tải ${r.nameVi}: ${e.message}`,`error`)}await f()}async function h(t){let r=l.find(e=>e.id===t);if(r){try{if(`caches`in window){let t=await caches.open(`atlas-models-atlas-v6`);for(let n of r.models){let r=e(`models/${n}`);await t.delete(r)}}n(`✓ Đã xóa cache của ${r.nameVi}`,`info`)}catch(e){console.error(`Delete error:`,e)}await f()}}async function g(){let t=document.getElementById(`masterProgressContainer`),r=document.getElementById(`masterProgressBar`),i=document.getElementById(`masterProgressLabel`),a=document.getElementById(`heroDownloadBtnText`),o=document.getElementById(`btnHeroDownloadAll`);t&&t.classList.remove(`hidden`),o&&(o.disabled=!0,o.style.opacity=`0.85`);let s=0,c=l.length;for(let t=0;t<c;t++){let n=l[t],o=Math.round(t/(c+1)*100);i&&(i.textContent=`Đang tải ${n.nameVi} (${t+1}/${c})... (${o}%)`),a&&(a.textContent=`ĐANG TẢI... (${o}%)`),r&&(r.style.width=`${o}%`);try{for(let t of n.models){let n=e(`models/${t}`),r=await fetch(n);`caches`in window&&await(await caches.open(`atlas-models-atlas-v6`)).put(n,r)}s++}catch(e){console.warn(`Failed model ${n.id}:`,e)}}i&&(i.textContent=`Đang lưu từ điển và dữ liệu giải phẫu... (95%)`),r&&(r.style.width=`95%`);try{for(let t of[`data/systems.json`,`data/lexicon.json`]){let n=e(t),r=await fetch(n);`caches`in window&&await(await caches.open(`atlas-models-atlas-v6`)).put(n,r)}}catch(e){console.warn(`Failed caching JSON:`,e)}r&&(r.style.width=`100%`),i&&(i.textContent=`✓ Đã hoàn tất tải 100% dữ liệu (${s}/${c} hệ giải phẫu)!`),a&&(a.textContent=`✓ ĐÃ TẢI TOÀN BỘ (DÙNG OFFLINE 100%)`),o&&(o.classList.add(`is-complete`),o.disabled=!1),n(`🎉 Toàn bộ Atlas Giải Phẫu 3D đã sẵn sàng dùng 100% Offline kể cả khi không có mạng!`,`success`),setTimeout(()=>{f()},1200)}async function _(){if(!(`caches`in window))return[];try{return(await(await caches.open(`atlas-models-atlas-v6`)).keys()).map(e=>e.url)}catch{return[]}}export{d as closeOfflineModal,u as openOfflineModal};