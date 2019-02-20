
class Bit32 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	toBuffer() {
		this.writeImage((p, index) => {
			let i = index;

			this.data[p + 3] = this.buffer[i++]; // a
			this.data[p + 0] = this.buffer[i++]; // b
			this.data[p + 1] = this.buffer[i++]; // g
			this.data[p + 2] = this.buffer[i++]; // r

			return i;
		});
	}

}

module.exports = Bit32;
