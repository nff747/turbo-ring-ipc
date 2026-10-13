export class ChannelMultiplexer {
  private channels = new Map<number, (data: Uint8Array) => void>();

  registerChannel(channelId: number, handler: (data: Uint8Array) => void): void {
    this.channels.set(channelId, handler);
  }

  dispatch(channelId: number, payload: Uint8Array): boolean {
    const handler = this.channels.get(channelId);
    if (handler) {
      handler(payload);
      return true;
    }
    return false;
  }
}
