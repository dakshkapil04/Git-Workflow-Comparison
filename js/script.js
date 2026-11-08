const SAMPLE = {
  gitFlow: { label: "Git Flow", conflicts: 8, integrationHours: 12, commitsPerDay: 4, reviewHours: 6, failedDeployments: 3, totalDeployments: 20 },
  githubFlow: { label: "GitHub Flow", conflicts: 5, integrationHours: 5, commitsPerDay: 8, reviewHours: 3, failedDeployments: 2, totalDeployments: 20 },
  trunkBased: { label: "Trunk-Based", conflicts: 2, integrationHours: 2, commitsPerDay: 15, reviewHours: 1, failedDeployments: 1, totalDeployments: 20 }
};
const KEYS = ["gitFlow", "githubFlow", "trunkBased"];
const LABELS = ["Git Flow", "GitHub Flow", "Trunk-Based"];
const COLORS = ["#b49aff", "#6ea8fe", "#66d6a2"];
let metrics = loadMetrics();

function loadMetrics() {
  try {
    const saved = localStorage.getItem("gitWorkflowMetrics");
    return saved ? JSON.parse(saved) : structuredClone(SAMPLE);
  } catch { return structuredClone(SAMPLE); }
}
function failureRate(item) {
  return item.totalDeployments > 0 ? (item.failedDeployments / item.totalDeployments) * 100 : 0;
}
function renderCards() {
  const values = [
    ["Total merge conflicts", item => item.conflicts, "Count across the experiment"],
    ["Average integration time", item => `${item.integrationHours} h`, "Lower time means faster integration"],
    ["Average commits per day", item => item.commitsPerDay, "Per developer, per day"],
    ["Average deployment failure", item => `${failureRate(item).toFixed(1)}%`, "Failed / total deployments"]
  ];
  document.getElementById("metricCards").innerHTML = values.map(([title, fn, note]) => {
    const average = KEYS.reduce((sum, key) => sum + Number(fn(metrics[key]).toString().replace(/[^\d.]/g, "")), 0) / KEYS.length;
    return `<article class="metric-card"><small>${title}</small><strong>${typeof fn(metrics.gitFlow) === "string" && fn(metrics.gitFlow).includes("%") ? average.toFixed(1) + "%" : average.toFixed(1)}</strong><span>${note}</span></article>`;
  }).join("");
}
function drawBarChart(canvasId, title, values, suffix = "") {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const left = 48, right = 18, top = 18, bottom = 48;
  const plotH = h - top - bottom, plotW = w - left - right;
  const max = Math.max(1, ...values) * 1.18;
  ctx.font = "12px Segoe UI, Arial";
  ctx.strokeStyle = "#26334e"; ctx.fillStyle = "#9aa8c2"; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = top + plotH - (plotH * i / 4);
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(w - right, y); ctx.stroke();
    ctx.fillText((max * i / 4).toFixed(0), 8, y + 4);
  }
  const slot = plotW / 3, barW = Math.min(75, slot * .52);
  values.forEach((value, i) => {
    const bh = (value / max) * plotH, x = left + slot * i + (slot - barW) / 2, y = top + plotH - bh;
    ctx.fillStyle = COLORS[i]; ctx.beginPath(); ctx.roundRect(x, y, barW, bh, 6); ctx.fill();
    ctx.fillStyle = "#edf2ff"; ctx.textAlign = "center"; ctx.font = "bold 12px Segoe UI, Arial";
    ctx.fillText(`${Number(value).toFixed(1)}${suffix}`, x + barW / 2, Math.max(13, y - 8));
    ctx.fillStyle = "#9aa8c2"; ctx.font = "11px Segoe UI, Arial";
    ctx.fillText(["Git Flow", "GitHub", "Trunk"][i], x + barW / 2, h - 17);
  });
  ctx.textAlign = "left";
}
function renderCharts() {
  drawBarChart("conflictChart", "", KEYS.map(k => metrics[k].conflicts));
  drawBarChart("integrationChart", "", KEYS.map(k => metrics[k].integrationHours), "h");
  drawBarChart("commitChart", "", KEYS.map(k => metrics[k].commitsPerDay));
  drawBarChart("failureChart", "", KEYS.map(k => failureRate(metrics[k])), "%");
}
function fillForm() {
  const form = document.getElementById("metricsForm");
  KEYS.forEach(key => Object.entries(metrics[key]).forEach(([field, value]) => {
    const input = form.elements.namedItem(`${key}.${field}`);
    if (input) input.value = value;
  }));
}
function render() { renderCards(); renderCharts(); fillForm(); }
document.getElementById("metricsForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const next = {};
  for (const key of KEYS) {
    next[key] = { label: SAMPLE[key].label };
    ["conflicts", "integrationHours", "commitsPerDay", "reviewHours", "failedDeployments", "totalDeployments"].forEach(field => {
      const input = form.elements.namedItem(`${key}.${field}`);
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 0 || (field === "totalDeployments" && value < 1)) {
        input.focus(); throw new Error(`Invalid value for ${key} ${field}`);
      }
      next[key][field] = value;
    });
    if (next[key].failedDeployments > next[key].totalDeployments) {
      document.getElementById("formMessage").textContent = "Failed deployments cannot exceed total deployments.";
      return;
    }
  }
  metrics = next;
  localStorage.setItem("gitWorkflowMetrics", JSON.stringify(metrics));
  render();
  document.getElementById("formMessage").textContent = "Results saved in this browser and dashboard updated.";
});
document.getElementById("resetButton").addEventListener("click", () => {
  metrics = structuredClone(SAMPLE);
  localStorage.removeItem("gitWorkflowMetrics");
  render();
  document.getElementById("formMessage").textContent = "Illustrative sample data restored.";
});
document.getElementById("exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "workflow-results.json"; a.click();
  URL.revokeObjectURL(url);
});
render();
