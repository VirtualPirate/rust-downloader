export class TransferStats {
  accumulatedChunkLen: number; // Total length of chunks transferred in the current period
  accumulatedTime: number; // Total time taken for the transfers in the current period (in ms)
  transferSpeed: number; // Calculated transfer speed in bytes per second
  startTime: number; // Time when the current period started (in ms)
  granularity: number; // Time period (in milliseconds) over which the transfer speed is calculated

  constructor(granularity: number) {
    this.accumulatedChunkLen = 0;
    this.accumulatedTime = 0;
    this.transferSpeed = 0;
    this.startTime = performance.now();
    this.granularity = granularity;
  }

  // Records the transfer of a data chunk and updates the transfer speed if the granularity period has elapsed.
  recordChunkTransfer(chunkLen: number): void {
    const now = performance.now();
    const timeElapsed = now - this.startTime;
    this.accumulatedChunkLen += chunkLen;
    this.accumulatedTime += timeElapsed;

    // If the accumulated time exceeds the granularity, calculate the transfer speed.
    if (this.accumulatedTime >= this.granularity) {
      this.transferSpeed = Math.floor(
        this.accumulatedChunkLen / (this.accumulatedTime / 1000)
      ); // bytes per second
      this.accumulatedChunkLen = 0;
      this.accumulatedTime = 0;
    }

    // Reset the start time for the next period.
    this.startTime = now;
  }

  // Provides a default instance of TransferStats with a granularity of 500 milliseconds.
  static default(): TransferStats {
    return new TransferStats(500); // Default granularity is 500ms
  }
}
