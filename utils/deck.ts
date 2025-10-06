export function clampIndex(i: number, total: number) {
  return Math.min(Math.max(1, i), Math.max(1, total))
}
export function nextIndex(i: number, total: number) {
  return clampIndex(i + 1, total)
}
export function prevIndex(i: number, total: number) {
  return clampIndex(i - 1, total)
}
