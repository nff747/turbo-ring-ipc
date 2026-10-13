export class TicketSpinlock {
  private view: Int32Array;

  constructor(sab: SharedArrayBuffer, offset = 0) {
    this.view = new Int32Array(sab, offset, 2); // [ticket, nowServing]
  }

  lock(): void {
    const myTicket = Atomics.add(this.view, 0, 1);
    while (Atomics.load(this.view, 1) !== myTicket) {
      // spin
    }
  }

  unlock(): void {
    Atomics.add(this.view, 1, 1);
  }
}
