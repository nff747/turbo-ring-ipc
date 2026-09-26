export const CACHE_LINE_BYTES = 64;
export const CACHE_LINE_INTS = CACHE_LINE_BYTES / 4; // 16 Int32 elements

// Header layout offsets in Int32 indices
export const HEADER_HEAD_OFFSET = 0;                  // Cache Line 0: Head
export const HEADER_TAIL_OFFSET = CACHE_LINE_INTS;    // Cache Line 1: Tail (64 bytes away)
export const HEADER_STATE_OFFSET = CACHE_LINE_INTS * 2; // Cache Line 2: State
export const HEADER_TOTAL_BYTES = CACHE_LINE_BYTES * 4;
export const HEADER_TOTAL_INTS = HEADER_TOTAL_BYTES / 4;
