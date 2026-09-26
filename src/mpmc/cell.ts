// Cell layout in Int32Array:
// Each cell occupies 2 Int32s (8 bytes):
// [0]: sequence ticket
// [1]: value payload
export const CELL_INTS = 2;
export const CELL_BYTES = CELL_INTS * 4;

export const SEQ_OFFSET = 0;
export const VAL_OFFSET = 1;
