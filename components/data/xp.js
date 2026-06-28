export function getLevel(totalXP) {
  return Math.floor(totalXP / 100) + 1;
}

export function getCurrentXP(totalXP) {
  return totalXP % 100;
}