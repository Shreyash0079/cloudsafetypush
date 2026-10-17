// ── Severity colour palette (matches new CSS vars) ───────────
const SEVERITY_COLORS = {
  normal  : '#00e5a0',
  medium  : '#3b9eff',
  high    : '#ffaa2c',
  critical: '#ff4d6a',
};

const SEVERITY_GLOW = {
  normal  : 'rgba(0,229,160,0.35)',
  medium  : 'rgba(59,158,255,0.35)',
  high    : 'rgba(255,170,44,0.35)',
  critical: 'rgba(255,77,106,0.35)',
};

const SEVERITY_DIM = {
  normal  : 'rgba(0,229,160,0.12)',
  medium  : 'rgba(59,158,255,0.12)',
  high    : 'rgba(255,170,44,0.12)',
  critical: 'rgba(255,77,106,0.12)',
};

const SEVERITY_LABEL = {
  normal  : '🟢 Normal',
  medium  : '🔵 Medium',
  high    : '🟠 High',
  critical: '🔴 Critical',
};

// ── Formatters ────────────────────────────────────────────────
function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', {
    hour  : '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatCost(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return '$0.000';
  return '$' + n.toFixed(3);
}

function formatProb(val) {
  return (parseFloat(val) * 100).toFixed(1) + '%';
}

function formatBigNumber(val) {
  const n = parseInt(val);
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

// ── Colour helpers ────────────────────────────────────────────
function severityColor(sev) {
  return SEVERITY_COLORS[sev] || '#7aa2c8';
}

function severityGlow(sev) {
  return SEVERITY_GLOW[sev] || 'rgba(122,162,200,0.3)';
}

function severityDim(sev) {
  return SEVERITY_DIM[sev] || 'rgba(122,162,200,0.1)';
}

function severityLabel(sev) {
  return SEVERITY_LABEL[sev] || sev;
}

// ── Math helpers ──────────────────────────────────────────────
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ── String helpers ────────────────────────────────────────────
function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

// ── DOM helpers ───────────────────────────────────────────────
function flashElement(el, cls = 'flash-blue') {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth; // reflow
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}

function setTextAnimated(el, newText) {
  if (!el) return;
  if (el.textContent === newText) return;
  el.textContent = newText;
  flashElement(el, 'flash-blue');
}

// ── Chart.js global defaults ──────────────────────────────────
if (typeof Chart !== 'undefined') {
  Chart.defaults.color          = '#7aa2c8';
  Chart.defaults.borderColor    = 'rgba(99,179,237,0.08)';
  Chart.defaults.font.family    = "'JetBrains Mono', monospace";
  Chart.defaults.font.size      = 11;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10,18,30,0.95)';
  Chart.defaults.plugins.tooltip.borderColor     = 'rgba(99,179,237,0.2)';
  Chart.defaults.plugins.tooltip.borderWidth     = 1;
  Chart.defaults.plugins.tooltip.padding         = 10;
  Chart.defaults.plugins.tooltip.titleColor      = '#e8f4fd';
  Chart.defaults.plugins.tooltip.bodyColor       = '#7aa2c8';
  Chart.defaults.plugins.tooltip.cornerRadius    = 8;
  Chart.defaults.plugins.tooltip.displayColors   = true;
}
