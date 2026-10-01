import{openOfflineModal as e}from"./offlineModal-BMP9vxpK.js";var t=null;function n(e){typeof window>`u`||localStorage.getItem(`offline_prompt_dismissed`)!==`1`&&setTimeout(()=>{r(e)},2500)}function r(n){if(t||document.getElementById(`offlinePromptBanner`))return;t=document.createElement(`div`),t.id=`offlinePromptBanner`,t.className=`offline-prompt-banner animate-in`,t.innerHTML=`
    <div class="prompt-main">
      <div class="prompt-icon-badge">⚡</div>
      <div class="prompt-content">
        <strong class="prompt-headline">Tải về máy để xem siêu mượt & chạy Offline 100%?</strong>
        <span class="prompt-subline">Lưu mô hình 3D vào bộ nhớ máy giúp lướt cực nhanh, triệt tiêu giật lag. Khuyên dùng Wi-Fi khi tải!</span>
      </div>
    </div>
    <div class="prompt-actions">
      <button type="button" class="btn-prompt-primary" id="btnPromptDownloadAll">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Tải về máy ngay
      </button>
      <button type="button" class="btn-prompt-dismiss" id="btnPromptDismiss" title="Để sau">Để sau</button>
    </div>
  `,document.body.appendChild(t);let r=t.querySelector(`#btnPromptDownloadAll`),a=t.querySelector(`#btnPromptDismiss`);r?.addEventListener(`click`,()=>{i(),localStorage.setItem(`offline_prompt_dismissed`,`1`),e(n)}),a?.addEventListener(`click`,()=>{i(),localStorage.setItem(`offline_prompt_dismissed`,`1`)})}function i(){t||=document.getElementById(`offlinePromptBanner`),t&&(t.classList.remove(`animate-in`),t.classList.add(`fade-out`),setTimeout(()=>{t?.remove(),t=null},350))}export{n as initOfflinePrompt};