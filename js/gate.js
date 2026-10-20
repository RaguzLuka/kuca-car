// Obiteljska kuća Car · the way in (css/gate.css). As soon as the first panorama is in, the walk is set up
// behind the title at its first point and swings slowly to either side; the title sits over it on a veil.
// The button fills while tour.js loads (it reports its steps through progress()) and, once pressed, the
// title fades and the walk is simply there. (The earlier way in, list A360, is kept in ../_gate_a360/.)
export function initGate() {
  const $ = (id) => document.getElementById(id);
  const gate = $('gate'), card = gate.querySelector('.card'), go = $('go'), statusEl = $('status'), view = $('view');
  const Q = new URLSearchParams(location.search);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEPS = { 'Učitavam…': .34, 'Učitavam šetnju…': .67 };
  let app = null;
  document.body.classList.add('gate-on');

  function progress(t) {
    statusEl.textContent = t;
    if (t in STEPS) go.style.setProperty('--fill', STEPS[t]);
    go.classList.toggle('err', /^Greška/.test(t));
  }
  function ready(a) {
    app = a;
    app.begin('setnja');                             // the walk, behind the still-closed title
    if (!calm && !Q.has('skip')) app.sway(true);
    gate.classList.add('lit');
    statusEl.textContent = 'Pokreni šetnju 360°';
    go.style.setProperty('--fill', 1);
    go.disabled = false;
  }
  function done() {
    gate.classList.add('gone');
    if (gate.contains(document.activeElement) || document.activeElement === document.body) view.focus({ preventScroll: true });
  }
  function leave() {
    if (!app || gate.classList.contains('leaving')) return;
    gate.classList.add('leaving');
    document.body.classList.remove('gate-on');
    app.enter();
    if (calm) { done(); return; }
    card.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-16px)', opacity: 0 }], { duration: 420, easing: 'ease-in', fill: 'forwards' });
    gate.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 760, easing: 'ease', fill: 'forwards' }).finished.then(done, done);
  }
  go.addEventListener('click', () => { if (!go.disabled) leave(); });

  function skip() {
    document.body.classList.remove('gate-on');
    if (app) { app.sway(false); if (Q.get('m') && Q.get('m') !== 'setnja') app.begin(Q.get('m')); }
    done();
  }
  return { progress, ready, skip };
}
