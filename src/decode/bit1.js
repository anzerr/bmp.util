
class Bit1 extends require('./bit.js') {

	constructor(data) {
		super(data);
		this.rate = 8;
	}

	parse() {
		return this.scan((b, location, x) => {
			for (let i = 0; i < 8; i++) {
				if (x * 8 + i < this.width) {
					this.add(location + i * 4, (b >> (7 - i)) & 0x1);
				} else {
					break;
				}
			}
		});
	}

}

module.exports = Bit1;
