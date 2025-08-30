const pitch = document.getElementById("pitch");
const ctx = pitch.getContext("2d");

const pitchWidth = pitch.width;
const pitchHeight = pitch.height;

const form = document.getElementById("xgForm");
const result = document.getElementById("result");

// Scale pitch to 100x100 logic space
function drawPitch() {
  ctx.fillStyle = "#e0ffe0";
  ctx.fillRect(0, 0, pitchWidth, pitchHeight);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, pitchWidth, pitchHeight);
  ctx.beginPath();
  ctx.moveTo(pitchWidth - 60, pitchHeight / 2 - 40);
  ctx.lineTo(pitchWidth, pitchHeight / 2 - 40);
  ctx.lineTo(pitchWidth, pitchHeight / 2 + 40);
  ctx.lineTo(pitchWidth - 60, pitchHeight / 2 + 40);
  ctx.stroke();
}

drawPitch();

// Convert click to (x, y) in 0–100 scale
pitch.addEventListener("click", function (e) {
  const rect = pitch.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / pitchWidth) * 100;
  const y = ((e.clientY - rect.top) / pitchHeight) * 100;

  document.getElementById("x").value = x.toFixed(2);
  document.getElementById("y").value = y.toFixed(2);

  drawPitch();
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc((x / 100) * pitchWidth, (y / 100) * pitchHeight, 5, 0, 2 * Math.PI);
  ctx.fill();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);
  const bodyPart = document.getElementById("bodyPart").value;

  const distance = calculateDistance(x, y);
  const angle = calculateAngle(x, y);
  const xg = calculateXG(distance, angle, bodyPart);

  result.innerText = `xG: ${xg.toFixed(3)} (Distance: ${distance.toFixed(2)}m, Angle: ${angle.toFixed(2)}°)`;

  updateChart(xg, x, y);
});

// Distance from goal center (100, 50)
function calculateDistance(x, y) {
  const dx = 100 - x;
  const dy = 50 - y;
  return Math.sqrt(dx * dx + dy * dy);
}

function calculateAngle(x, y) {
  const goalLeftY = 44;
  const goalRightY = 56;
  const dx = 100 - x;
  const leftDY = goalLeftY - y;
  const rightDY = goalRightY - y;
  const leftAngle = Math.atan2(leftDY, dx);
  const rightAngle = Math.atan2(rightDY, dx);
  const angle = Math.abs(rightAngle - leftAngle);
  return angle * (180 / Math.PI);
}

function calculateXG(distance, angle, bodyPart) {
  let b0 = -1.5;
  let b1 = -0.1;
  let b2 = 0.05;
  let b3 = 0;

  if (bodyPart === "head") b3 = -0.4;
  else if (bodyPart === "other") b3 = -0.6;

  const z = b0 + b1 * distance + b2 * angle + b3;
  const prob = 1 / (1 + Math.exp(-z));
  return Math.min(prob, 0.97);
}

// Shot chart
const chartCtx = document.getElementById("xgChart").getContext("2d");
const shotLabels = [];
const shotData = [];

const shotChart = new Chart(chartCtx, {
  type: "bar",
  data: {
    labels: shotLabels,
    datasets: [{
      label: "xG per shot",
      data: shotData,
      backgroundColor: "rgba(0, 123, 255, 0.7)",
    }]
  },
  options: {
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  }
});

function updateChart(xg, x, y) {
  const shotLabel = `(${x.toFixed(0)}, ${y.toFixed(0)})`;
  shotLabels.push(shotLabel);
  shotData.push(xg.toFixed(3));
  shotChart.update();
}
