/* LEC · điều khiển audio chung: bấm lại nút đang phát để dừng, thanh "Dừng" nổi, tự tắt khi chuyển tab */
(function () {
  var media = new Set(), starter = null, lastClick = null, lastClickT = 0, hideT = null, bar = null, active = false;
  var origPlay = HTMLMediaElement.prototype.play;

  function anyPlaying() { var p = false; media.forEach(function (m) { if (!m.paused && !m.ended) p = true; }); return p; }
  function stopAll() { try { if (typeof window.stopSay === 'function') window.stopSay(); } catch (e) {} media.forEach(function (m) { try { m.pause(); } catch (e) {} }); }
  function swapIcon(el, on) {
    if (!el) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (on && n.nodeValue.indexOf('▶') > -1) { n.nodeValue = n.nodeValue.replace('▶', '⏸'); return; }
      if (!on && n.nodeValue.indexOf('⏸') > -1) { n.nodeValue = n.nodeValue.replace('⏸', '▶'); return; }
    }
  }
  function ensureBar() {
    if (bar || !document.body) return;
    var st = document.createElement('style');
    st.textContent = '#lecStop{display:none;position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#2D1B45;color:#fff;border-radius:99px;padding:8px 8px 8px 18px;gap:12px;align-items:center;box-shadow:0 6px 24px rgba(0,0,0,.25);z-index:9999;font:700 15px Montserrat,system-ui,sans-serif;white-space:nowrap}' +
      '#lecStop button{border:0;background:#F28C28;color:#fff;font:800 15px Montserrat,system-ui,sans-serif;padding:10px 18px;border-radius:99px;cursor:pointer}' +
      '.lec-on{outline:3px solid #F28C28;outline-offset:2px}';
    document.head.appendChild(st);
    bar = document.createElement('div'); bar.id = 'lecStop';
    bar.innerHTML = '<span>🔊 Đang phát…</span><button type="button">⏹ Dừng</button>';
    bar.querySelector('button').addEventListener('click', function (e) { e.stopPropagation(); stopAll(); active = false; bar.style.display = 'none'; swapIcon(starter, false); if (starter) starter.classList.remove('lec-on'); });
    document.body.appendChild(bar);
  }
  function show(on) {
    ensureBar(); if (!bar) return;
    clearTimeout(hideT);
    if (on) { active = true; bar.style.display = 'flex'; }
    else hideT = setTimeout(function () { if (!anyPlaying()) { active = false; bar.style.display = 'none'; swapIcon(starter, false); if (starter) starter.classList.remove('lec-on'); } }, 700);
  }
  function track(m) {
    if (media.has(m)) return; media.add(m);
    m.addEventListener('play', function () {
      if (lastClick && Date.now() - lastClickT < 1500 && lastClick !== starter) {
        swapIcon(starter, false); if (starter) starter.classList.remove('lec-on'); starter = lastClick;
      }
      swapIcon(starter, true); if (starter) starter.classList.add('lec-on');
      show(true);
    });
    m.addEventListener('pause', function () { show(false); });
    m.addEventListener('ended', function () { show(false); });
  }
  HTMLMediaElement.prototype.play = function () { track(this); return origPlay.apply(this, arguments); };
  document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('audio,video').forEach(track); ensureBar(); });

  function isTab(el) { return el.closest('nav button, nav a, [role="tab"], .tab, .tabs button, [data-t], [data-tab]'); }
  function clickable(el) { return el.closest('button, a, [onclick], .play, .card, li, .item, .row, div'); }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!(t instanceof Element)) return;
    if (bar && bar.contains(t)) return;
    if (t.closest('input, textarea, select, label')) return;
    if (isTab(t)) { stopAll(); if (bar) { active = false; bar.style.display = 'none'; } return; }
    var el = clickable(t);
    if (starter && (active || anyPlaying()) && el && (el === starter || starter.contains(t))) {
      e.preventDefault(); e.stopImmediatePropagation(); stopAll(); active = false; bar.style.display = 'none'; swapIcon(starter, false); starter.classList.remove('lec-on'); return;
    }
    lastClick = t.closest('button, [onclick], a, .play') || el; lastClickT = Date.now();
  }, true);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopAll(); });
  window.lecStopAudio = stopAll;
})();
