
class Bit8 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	toBuffer() {
		const colors = this.initColors(8);

		this.writeImage((p, index) => {
			let i = index;

			const colorInt = this.createColor({
				quad: this.buffer[i++],
				blue: this.buffer[i++],
				green: this.buffer[i++],
				red: this.buffer[i++]
			});
			const colorExists = colors.findIndex((c) => c === colorInt);
			if (colorExists !== -1) {
				this.data[p] = colorExists;
			} else {
				this.data[p] = 0;
			}

			return i;
		});
	}

}

module.exports = Bit8;
