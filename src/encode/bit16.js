
class Bit16 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	toBuffer() {
		this.writeImage((p, index) => {
			let i = index + 1;

			const b = this.buffer[i++] / 8; // b
			const g = this.buffer[i++] / 8; // g
			const r = this.buffer[i++] / 8; // r

			const color = (r << 10) | (g << 5) | b;

			this.data[p] = color & 0x00ff;
			this.data[p + 1] = (color & 0xff00) >> 8;

			return i;
		});
	}

}

module.exports = Bit16;
