// 0/1 Knapsack implementation (Dynamic Programming)
// Each task can be chosen at most once. We maximize total impactScore

/**
 * Optimize tasks using 0/1 Knapsack DP.
 * tasks: [{ vehicleId, duration, impactScore }, ...]
 * capacityHours: integer available mechanic-hours
 */
function optimize(tasks, capacityHours) {
  const n = tasks.length;
  const W = Math.max(0, Math.floor(Number(capacityHours)));
  if (n === 0 || W === 0) {
    return { selectedTasks: [], totalHours: 0, totalImpact: 0 };
  }

  // Convert durations to integer weights (hours). Use Math.ceil to be conservative.
  const weights = tasks.map(t => Math.max(0, Math.ceil(Number(t.duration) || 0)));
  const values = tasks.map(t => Math.max(0, Math.floor(Number(t.impactScore) || 0)));

  // DP table: (n+1) x (W+1)
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  let w = W;
  let res = dp[n][W];
  const pickedIndexes = [];
  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      pickedIndexes.push(i - 1);
      res -= values[i - 1];
      w -= weights[i - 1];
    }
  }

  // Build selected tasks using original durations/impactScore (not rounded)
  const selectedTasks = pickedIndexes
    .reverse()
    .map(idx => ({
      vehicleId: tasks[idx].vehicleId,
      duration: tasks[idx].duration,
      impactScore: tasks[idx].impactScore,
    }));

  const totalImpact = selectedTasks.reduce((s, t) => s + Number(t.impactScore), 0);
  const totalHours = selectedTasks.reduce((s, t) => s + Number(t.duration), 0);

  return { selectedTasks, totalHours, totalImpact };
}

module.exports = { optimize };
