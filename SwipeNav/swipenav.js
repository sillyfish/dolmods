(() => {
  /* ============ 可调设置 ============ */
  const CONFIG = {
    position: 'center',      // 'left' = 左上角箭头旁边；'center' = 顶部中间
    minDistance: 80,       // 横向至少滑多少px才算翻页
    directionRatio: 2,     // 横向位移要大于纵向位移的几倍（越大越严格，越不容易误触）
    maxTime: 600           // 滑动要在多少毫秒内完成，太慢的拖动不算
  };
  /* ================================== */

  const ICON_BACK = '<svg viewBox="0 0 24 24"><polyline points="15 5 8 12 15 19"/></svg>';
  const ICON_FWD  = '<svg viewBox="0 0 24 24"><polyline points="9 5 16 12 9 19"/></svg>';

  let bar, btnBack, btnFwd;

  // mod脚本里拿不到全局的 Engine，要从 SugarCube 命名空间里取
  const SC = () => window.SugarCube || {};
  const getState  = () => SC().State  || window.State;
  const getEngine = () => SC().Engine || window.Engine;
  const getDialog = () => SC().Dialog || window.Dialog;

  function canBack() { const S = getState(); return !!S && S.length >= 2; }
  function canFwd()  { const S = getState(); return !!S && S.length < S.size; }

  function step(dir) {
    const E = getEngine();
    if (E && typeof E[dir] === 'function') { E[dir](); return; }
    // 兜底：直接点侧栏里原生的前进/后退按钮
    const native = document.getElementById(dir === 'backward' ? 'history-backward' : 'history-forward');
    if (native) native.click();
  }

  function goBack() { if (canBack()) step('backward'); }
  function goFwd()  { if (canFwd())  step('forward'); }

  function updateButtons() {
    if (!bar) return;
    btnBack.disabled = !canBack();
    btnFwd.disabled  = !canFwd();
  }

  // 固定在主界面左上角：只在侧栏收起的状态下量一次箭头位置，之后不再跟着侧栏跑
  let placed = false;
  function placeBar() {
    if (!bar || placed) return;
    const uiBar = document.getElementById('ui-bar');
    const toggle = document.getElementById('ui-bar-toggle');
    if (!toggle || (uiBar && !uiBar.classList.contains('stowed'))) return;
    const r = toggle.getBoundingClientRect();
    if (r.width === 0) return;
    bar.style.top = r.top + 'px';
    bar.style.height = r.height + 'px';
    if (CONFIG.position !== 'center') bar.style.left = (r.right + 4) + 'px';
    placed = true;
  }

  function buildBar() {
    bar = document.createElement('div');
    bar.id = 'swipenav-bar';
    if (CONFIG.position === 'center') bar.classList.add('swipenav-center');

    btnBack = document.createElement('button');
    btnBack.type = 'button';
    btnBack.setAttribute('aria-label', '回到上一步');
    btnBack.innerHTML = ICON_BACK;
    btnBack.addEventListener('click', goBack);

    btnFwd = document.createElement('button');
    btnFwd.type = 'button';
    btnFwd.setAttribute('aria-label', '前进到下一步');
    btnFwd.innerHTML = ICON_FWD;
    btnFwd.addEventListener('click', goFwd);

    bar.append(btnBack, btnFwd);
    document.body.appendChild(bar);

    placeBar();
    updateButtons();
  }

  /* ---------- 滑动手势 ---------- */
  let sx = 0, sy = 0, st = 0, tracking = false, isSwipe = false;

  function shouldIgnore(target) {
    // 弹窗打开时、在输入框/滑条上操作时不触发
    const D = getDialog();
    if (D && D.isOpen && D.isOpen()) return true;
    if (target && target.closest &&
        target.closest('input, textarea, select, [contenteditable="true"], #swipenav-bar')) return true;
    return false;
  }

  function onStart(e) {
    if (e.touches.length !== 1 || shouldIgnore(e.target)) { tracking = false; return; }
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY; st = Date.now();
    tracking = true; isSwipe = false;
  }

  function onMove(e) {
    if (!tracking) return;
    if (e.touches.length !== 1) { tracking = false; return; }
    const t = e.touches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    // 一旦判定为横向滑动，就拦住原版的侧栏滑出
    if (Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy) * CONFIG.directionRatio) {
      isSwipe = true;
    }
    if (isSwipe) e.stopPropagation();
  }

  function onEnd(e) {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    const dt = Date.now() - st;

    const horizontal = Math.abs(dx) > Math.abs(dy) * CONFIG.directionRatio;
    if (isSwipe || horizontal) e.stopPropagation();   // 原版侧栏收不到这次滑动

    if (!horizontal || Math.abs(dx) < CONFIG.minDistance || dt > CONFIG.maxTime) return;

    if (dx > 0) goBack();   // 从左往右滑：回到上一步
    else        goFwd();    // 从右往左滑：前进到下一步
  }

  $(document).one(':storyready', function () {
    buildBar();

    // 捕获阶段监听，比原版的处理先一步拿到事件
    window.addEventListener('touchstart', onStart, { capture: true, passive: true });
    window.addEventListener('touchmove',  onMove,  { capture: true, passive: true });
    window.addEventListener('touchend',   onEnd,   { capture: true, passive: true });

    $(document).on(':passagedisplay :historyupdate', () => {
      updateButtons();
      placeBar();
    });

    // 屏幕旋转/尺寸变化时重新量一次
    window.addEventListener('resize', () => { placed = false; placeBar(); });
  });
})();
