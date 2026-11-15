/*
 * Touch controls for phones and tablets.
 * ADDED AFTER THE TEST by Future AI (Hashmatullah Zaher), 15 Nov 2026. NOT written by Claude Fable 5.2.
 * Fable's game code is unchanged: this file only turns taps into the same key presses the game already reads
 * (arrows, Space, C, R, P), and makes the HUD smaller on touch screens. Desktop players never see it.
 */
(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) return;

  const css = `
  body.touch { touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
  body.touch #tl { transform: scale(0.58); transform-origin: top left; left: 10px; top: 10px; }
  body.touch #minimap { transform: scale(0.55); transform-origin: top right; right: 10px; top: 10px; }
  body.touch #speedo { right: auto; left: 50%; bottom: 4px; transform: translateX(-50%) scale(0.5); transform-origin: bottom center; }
  body.touch #attrib { font-size: 10px; bottom: 4px; left: 50%; transform: translateX(-50%); white-space: nowrap; }
  body.touch #msg { font-size: 64px; }
  #tc { position: fixed; inset: 0; z-index: 30; pointer-events: none; }
  #tc.off .tb:not(.always) { display: none; }
  .tb { position: absolute; pointer-events: auto; touch-action: none; display: flex; align-items: center; justify-content: center;
        border-radius: 50%; border: 2px solid rgba(255,255,255,.55); background: rgba(16,20,32,.45); color: #fff;
        font: 800 26px "Segoe UI", system-ui, sans-serif; backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
        box-shadow: 0 4px 16px rgba(0,0,0,.35); transition: transform .06s, background .06s; }
  .tb.on { background: rgba(53,199,230,.55); transform: scale(.93); }
  .tb small { font-size: 12px; font-weight: 800; letter-spacing: .06em; }
  #tLeft  { left: calc(env(safe-area-inset-left) + 18px);  bottom: 30px; width: 88px; height: 88px; }
  #tRight { left: calc(env(safe-area-inset-left) + 120px); bottom: 30px; width: 88px; height: 88px; }
  #tGas   { right: calc(env(safe-area-inset-right) + 18px); bottom: 30px; width: 104px; height: 104px; background: rgba(46,158,91,.5); }
  #tGas.on { background: rgba(125,255,155,.6); }
  #tBrake { right: calc(env(safe-area-inset-right) + 136px); bottom: 24px; width: 76px; height: 76px; background: rgba(200,40,30,.45); }
  #tDrift { right: calc(env(safe-area-inset-right) + 136px); bottom: 112px; width: 66px; height: 66px; border-radius: 18px; }
  .tsm { width: 46px; height: 46px; font-size: 20px; top: calc(env(safe-area-inset-top) + 10px); border-radius: 14px; }
  #tCam { left: calc(50% - 80px); } #tReset { left: calc(50% - 23px); } #tPause { left: calc(50% + 34px); }
  @media (min-width: 901px) { .tsm { top: calc(env(safe-area-inset-top) + 104px); } }
  #tRotate { position: fixed; left: 50%; top: 42%; transform: translateX(-50%); z-index: 31; pointer-events: none; display: none;
             padding: 10px 16px; border-radius: 12px; background: rgba(16,20,32,.82); color: #fff; text-align: center;
             font: 700 15px "Segoe UI", Vazirmatn, Tahoma, sans-serif; line-height: 1.5; }
  .touchnote { color: #ffd166 !important; font-weight: 700; }
  @media (orientation: portrait) {
    body.touch.racing #tRotate { display: block; animation: tfade .6s 5s forwards; }
    body.touch #speedo { bottom: 120px; }
    #tLeft, #tRight { width: 72px; height: 72px; bottom: 26px; }
    #tRight { left: calc(env(safe-area-inset-left) + 100px); }
    #tGas { width: 88px; height: 88px; bottom: 26px; }
    #tBrake { width: 66px; height: 66px; right: calc(env(safe-area-inset-right) + 116px); bottom: 20px; }
    #tDrift { width: 60px; height: 60px; right: calc(env(safe-area-inset-right) + 32px); bottom: 128px; }
    .tsm { top: calc(env(safe-area-inset-top) + 196px); }
  }
  @keyframes tfade { to { opacity: 0; visibility: hidden; } }
  `;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  document.body.classList.add('touch');

  const send = (type, code) => window.dispatchEvent(new KeyboardEvent(type, { code, key: code, bubbles: true }));

  const tc = document.createElement('div');
  tc.id = 'tc';
  tc.className = 'off';
  document.body.appendChild(tc);

  // hold buttons: key down while the finger is on the button
  function hold(id, code, label, cls) {
    const b = document.createElement('div');
    b.id = id; b.className = 'tb' + (cls ? ' ' + cls : ''); b.innerHTML = label;
    let down = false;
    const on = (e) => { e.preventDefault(); if (down) return; down = true; b.classList.add('on'); send('keydown', code); if (navigator.vibrate) navigator.vibrate(8); try { b.setPointerCapture(e.pointerId); } catch (_) {} };
    const off = (e) => { e.preventDefault(); if (!down) return; down = false; b.classList.remove('on'); send('keyup', code); };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointercancel', off);
    b.addEventListener('lostpointercapture', off);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
    tc.appendChild(b);
    return b;
  }
  // tap buttons: one key press
  function tap(id, code, label, cls) {
    const b = document.createElement('div');
    b.id = id; b.className = 'tb tsm' + (cls ? ' ' + cls : ''); b.innerHTML = label;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.classList.add('on'); send('keydown', code); });
    const up = (e) => { e.preventDefault(); b.classList.remove('on'); send('keyup', code); };
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    tc.appendChild(b);
    return b;
  }

  hold('tLeft', 'ArrowLeft', '&#9664;');
  hold('tRight', 'ArrowRight', '&#9654;');
  hold('tGas', 'ArrowUp', '<div style="text-align:center;line-height:1">&#9650;<br><small>GAS</small></div>');
  hold('tBrake', 'ArrowDown', '<div style="text-align:center;line-height:1">&#9660;<br><small>BRAKE</small></div>');
  hold('tDrift', 'Space', '<small>DRIFT</small>');
  tap('tCam', 'KeyC', '&#128247;');
  tap('tReset', 'KeyR', '&#8634;');
  tap('tPause', 'KeyP', '&#10074;&#10074;', 'always');

  const rot = document.createElement('div');
  rot.id = 'tRotate';
  rot.innerHTML = '&#128241;&#8635; Turn your phone sideways<br><span dir="rtl">مبایل را افقی بگیرید</span>';
  document.body.appendChild(rot);

  // a tap on the pause screen continues the race
  const pause = document.getElementById('pause');
  if (pause) pause.addEventListener('pointerdown', (e) => { e.preventDefault(); send('keydown', 'KeyP'); send('keyup', 'KeyP'); });
  const pauseText = pause && pause.querySelector('p');
  if (pauseText) pauseText.innerHTML += '<br>Tap anywhere to continue.';

  // title screen: say how to play by touch
  const keysBox = document.querySelector('#menu .keys');
  if (keysBox) {
    const p = document.createElement('p');
    p.className = 'touchnote';
    p.innerHTML = 'On a phone: &#9664; &#9654; steer &middot; GAS &middot; BRAKE &middot; DRIFT &middot; &#128247; camera &middot; &#8634; reset<br>Best played with the phone sideways.';
    keysBox.after(p);
    keysBox.style.display = 'none';
  }

  // show the driving buttons only while a race is on screen (not over the menu, finish or pause cards)
  const vis = (id) => { const el = document.getElementById(id); return el && !el.classList.contains('hidden'); };
  setInterval(() => {
    const racing = vis('hud') && !vis('menu') && !vis('finish') && !vis('pause');
    tc.classList.toggle('off', !racing);
    document.getElementById('tPause').style.display = racing || vis('pause') ? '' : 'none';
    document.body.classList.toggle('racing', racing);
  }, 200);
})();
