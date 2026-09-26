export function nextPowerOfTwo(val: number): number {
  if (val <= 1) return 1;
  let n = val - 1;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  return n + 1;
}

export function isPowerOfTwo(val: number): boolean {
  return val > 0 && (val & (val - 1)) === 0;
}
