
class Bit1 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	toBuffer() {
		if (this.palette.length && this.colors === 2) {
			this.initColors(1);
		} else {
			this.writeUInt32LE(0x00ffffff); // Black
			this.writeUInt32LE(0x00000000); // White
		}

		this.pos.add(1);
		let lineArr = [];
		this.writeImage((p, index, x) => {
			let i = index + 1;

			const b = this.buffer[i++];
			const g = this.buffer[i++];
			const r = this.buffer[i++];
			const brightness = r * 0.2126 + g * 0.7152 + b * 0.0722;

			lineArr.push(brightness > 127 ? 0 : 1);

			if ((x + 1) % 8 === 0) {
				this.data[p - 1] = this.createInteger(lineArr);
				lineArr = [];
			} else if (x === this.width - 1 && lineArr.length > 0) {
				this.data[p - 1] = this.createInteger(lineArr) << 4;
				lineArr = [];
			}

			return i;
		});
	}

}

module.exports = Bit1;
