const crypto = window.CryptoJS;
const int32OffsetsIn256Bits = [0, 4, 8, 12, 16, 20, 24, 28];
const int32MaxValue = 0b01111111111111111111111111111111; // equals 2147483647
const bsv = window.bsvjs;

class RNG {
  constructor(seed, ...moreSeeds) {
    this.currentSeed = bsv.Hash.sha256(
      Buffer.concat([
        Buffer.from(seed.toString()),
        ...moreSeeds.map((s) => Buffer.from(s.toString())),
      ])
    );
  }
  getNext() {
    this.currentSeed = bsv.Hash.sha256(this.currentSeed);
    return this.currentSeed;
  }

  getNextUInt32(o) {
    if (o) {
      return this.getNextUInt32Between(o);
    }
    const sha256Hash = this.getNext();
    const numbers = int32OffsetsIn256Bits.map((offset) =>
      sha256Hash.readUInt32BE(offset)
    );
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) result = result ^ numbers[i];
    result = result & int32MaxValue; // this will remove the sign from the result (-42 becomes 42)
    return result;
  }

  getNextUInt32Between(o) {
    if (!o) {
      //  console.log("no integer limits provided");
      return;
    }
    if (!o.max) {
      //  console.log("no integer max limit provided");
      return;
    }
    if (!o.min) o.min = 0;
    o.min = Math.floor(o.min);
    o.max = Math.floor(o.max);
    if (o.min < 0) {
      //  console.log(`min limit cannot be smaller than 0`);
      return;
    }
    if (o.min >= o.max) {
      // console.log(
      //   `max limit (${o.max}) must be greater than min limit (${o.min})`
      // );
      return;
    }
    const diff = o.max - o.min;
    const int = this.getNextUInt32();
    const m = int % diff;
    const result = o.min + m;
    return result;
  }
}
