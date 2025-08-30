document.getElementById("xgForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);
  const bodyPart = document.getElementById("bodyPart").value;

  const distance = calculateDistance(x, y);
  const angle = calculateAngle(x, y);

  const xg = calculateXG(distance, angle, bodyPart);

  document.getElementById("result").innerText = `Expected Goals (xG): ${xg.toFixed(3)}`;
});

// Calculate distance from goal (center at x = 100, y = 50)
function calculateDistance(x, y) {
  const dx = 100 - x;
  const dy = 50 - y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate approximate shot angle
function calculateAngle(x, y) {
  const goalLeftY = 44; // left post
  const goalRightY = 56; // right post

  const dx = 100 - x;
  const leftDY = goalLeftY - y;
  const rightDY = goalRightY - y;

  const leftAngle = Math.atan2(leftDY, dx);
  const rightAngle = Math.atan2(rightDY, dx);

  const angle = Math.abs(rightAngle - leftAngle); // in radians
  return angle * (180 / Math.PI); // convert to degrees
}

// Realistic xG model simulation using logistic function
function calculateXG(distance, angle, bodyPart) {
  // Weights (these are just example values)
  let b0 = -1.5; // base value
  let b1 = -0.1; // distance
  let b2 = 0.05; // angle
  let b3 = 0;    // body part adjustment

  // Adjust for body part
  if (bodyPart === "head") {
    b3 = -0.4; // headers are less likely
  } else if (bodyPart === "other") {
    b3 = -0.6; // other (shoulder, etc.)
  }

  const z = b0 + b1 * distance + b2 * angle + b3;
  const probability = 1 / (1 + Math.exp(-z));

  // Cap at 0.97 max for realism
  return Math.min(probability, 0.97);
}

