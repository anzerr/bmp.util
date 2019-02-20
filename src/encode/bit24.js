
class Bit24 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	toBuffer() {
		this.writeImage((p, index) => {
			let i = index + 1;

			this.data[p + 0] = this.buffer[i++]; // b
			this.data[p + 1] = this.buffer[i++]; // g
			this.data[p + 2] = this.buffer[i++]; // r

			return i;
		});
	}

}

module.exports = Bit24;
