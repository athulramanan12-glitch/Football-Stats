// Advanced xG Calculator function
function calculateXG(x, y, shotType, shotSpeed, defenderPressure) {
  // Calculate distance from goal center (100, 50)
  const dx = 100 - x;
  const dy = 50 - y;
  const distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem

  // Calculate angle from center (goal)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
  const angleFactor = Math.max(0, 1 - Math.abs(angle) / 90); // Factor decreases as angle increases

  // Base xG score (max 0.97)
  let baseXG = Math.max(0, 0.97 * (1 - distance / 100) * angleFactor);

  // Modify based on shot type
  let typeMultiplier = 1;
  if (shotType === 'head') typeMultiplier = 0.5; // Header has lower chance
  else if (shotType === 'other') typeMultiplier = 0.6; // Other shots (e.g., shoulder)

  // Modify based on shot speed (higher speed = better chance)
  const speedMultiplier = Math.min(1 + shotSpeed / 100, 1.5); // Shot speed factor (max 1.5)

  // Modify based on defender pressure (0 = no pressure, 100 = full pressure)
  const pressureMultiplier = Math.max(0, 1 - defenderPressure / 100); // More pressure lowers xG

  // Calculate final xG
  const finalXG = baseXG * typeMultiplier * speedMultiplier * pressureMultiplier;
  return finalXG.toFixed(3);
}

// Handle form submission
document.getElementById('xgForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get values from form
  const x = parseInt(document.getElementById('xPos').value);
  const y = parseInt(document.getElementById('yPos').value);
  const shotType = document.getElementById('shotType').value;
  const shotSpeed = parseInt(document.getElementById('shotSpeed').value);
  const defenderPressure = parseInt(document.getElementById('defenderPressure').value);

  // Validate inputs
  if (x < 0 || x > 100 || y < 0 || y > 100 || shotSpeed < 0 || defenderPressure < 0 || defenderPressure > 100) {
    alert('Please enter valid values for all fields.');
    return;
  }

  // Calculate xG
  const xg = calculateXG(x, y, shotType, shotSpeed, defenderPressure);

  // Display the result
  document.getElementById('result').textContent = `Estimated xG: ${xg}`;
});
