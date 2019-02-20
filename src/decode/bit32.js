
const mask = require('../util/mask.js');

class Bit32 extends require('./bit.js') {

	constructor(data) {
		super(data);
		this.mask = mask(this);
		this.read = 4;
	}

	parse() {
		return this.scan((b, location) => {
			this.add(location, {
				red: this.mask.shiftRed(b),
				green: this.mask.shiftGreen(b),
				blue: this.mask.shiftBlue(b),
				alpha: this.mask.shiftAlpha(b)
			});
		});
	}

}

module.exports = Bit32;
