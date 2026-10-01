function e(){typeof window>`u`||!(`serviceWorker`in navigator)||navigator.serviceWorker.ready.then(e=>{e.addEventListener(`updatefound`,()=>{let n=e.installing;n&&n.addEventListener(`statechange`,()=>{n.state===`installed`&&navigator.serviceWorker.controller&&t(n)})})})}function t(e){if(document.getElementById(`pwaUpdateBanner`))return;let t=document.createElement(`div`);t.id=`pwaUpdateBanner`,t.className=`pwa-update-banner animate-in`,t.innerHTML=`
    <div class="banner-content">
      <span class="banner-icon">🚀</span>
      <div class="banner-text">
        <strong>Đã có phiên bản Atlas 3D mới!</strong>
        <span>Tối ưu hiệu năng, bổ sung mô hình & cập nhật kiến thức y khoa.</span>
      </div>
    </div>
    <div class="banner-actions">
      <button type="button" class="btn-update-apply" id="btnApplyUpdate">Cập nhật ngay</button>
      <button type="button" class="btn-update-dismiss" id="btnDismissUpdate">&times;</button>
    </div>
  `,document.body.appendChild(t),document.getElementById(`btnApplyUpdate`)?.addEventListener(`click`,()=>{e.postMessage({type:`SKIP_WAITING`}),window.location.reload()}),document.getElementById(`btnDismissUpdate`)?.addEventListener(`click`,()=>{t.classList.add(`fade-out`),setTimeout(()=>t.remove(),400)})}export{e as initPWAUpdateBanner};