
class Bit4 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	toBuffer() {
		const colors = this.initColors(4);

		let integerPair = [];
		this.writeImage((p, index, x) => {
			let i = index;

			const colorInt = this.createColor({
				quad: this.buffer[i++],
				blue: this.buffer[i++],
				green: this.buffer[i++],
				red: this.buffer[i++]
			});
			const colorExists = colors.findIndex((c) => c === colorInt);

			if (colorExists !== -1) {
				integerPair.push(colorExists);
			} else {
				integerPair.push(0);
			}

			if ((x + 1) % 2 === 0) {
				this.data[p] = (integerPair[0] << 4) | integerPair[1];
				integerPair = [];
			}

			return i;
		});
	}

}

module.exports = Bit4;
