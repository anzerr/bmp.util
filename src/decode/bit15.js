
class Bit15 extends require('./bit.js') {

	constructor(data) {
		super(data);
		this.read = 2;
	}

	parse() {
		const padding = this.width % 3, n = 31;
		return this.scan((b, location) => {
			this.add(location, {
				blue: (b & n) / n * 255 | 0,
				green: (b >> 5 & n) / n * 255 | 0,
				red: (b >> 10 & n) / n * 255 | 0,
				alpha: (b >> 15) ? 0xFF : 0x00
			}).pos.add(padding);
		});
	}

}

module.exports = Bit15;
