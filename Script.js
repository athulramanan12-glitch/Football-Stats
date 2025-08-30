// Advanced xG Calculator function
function calculateXG(distance, angle, shotType, defenderPressure) {
  // Base xG score based on distance (closer = better)
  let baseXG = Math.max(0, 0.97 * (1 - distance / 40)); // max distance of 40 meters

  // Adjust based on angle (more central = higher chance)
  const angleFactor = Math.max(0, 1 - Math.abs(angle - 90) / 90); // 0-180 degrees
  baseXG *= angleFactor;

  // Modify based on shot type
  let typeMultiplier = 1;
  if (shotType === 'head') typeMultiplier = 0.5; // Header has lower chance
  else if (shotType === 'other') typeMultiplier = 0.6; // Other shots (e.g., shoulder)

  // Modify based on defender pressure (Low, Medium, High)
  let pressureMultiplier = 1;
  if (defenderPressure === 'low') pressureMultiplier = 1; // No reduction
  else if (defenderPressure === 'medium') pressureMultiplier = 0.75; // Slight reduction
  else if (defenderPressure === 'high') pressureMultiplier = 0.5; // Significant reduction

  // Final xG
  const finalXG = baseXG * typeMultiplier * pressureMultiplier;
  return finalXG.toFixed(3);
}

// Handle form submission
document.getElementById('xgForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get values from form
  const distance = parseInt(document.getElementById('distance').value);
  const angle = parseInt(document.getElementById('angle').value);
  const shotType = document.getElementById('shotType').value;
  const defenderPressure = document.getElementById('defenderPressure').value;

  // Validate inputs
  if (distance < 0 || angle < 0 || angle > 180) {
    alert('Please enter valid values for all fields.');
    return;
  }

  // Calculate xG
  const xg = calculateXG(distance, angle, shotType, defenderPressure);

  // Display the result
  document.getElementById('result').textContent = `Estimated xG: ${xg}`;
});
