
const mask = require('../util/mask.js');

class Bit16 extends require('./bit.js') {

	constructor(data) {
		super(data);
		this.mask = mask(this);
		this.read = 2;
	}

	parse() {
		const padding = (this.width % 2) * 2;
		return this.scan((b, location) => {
			this.add(location, {
				red: this.mask.shiftRed(b),
				green: this.mask.shiftGreen(b),
				blue: this.mask.shiftBlue(b),
				alpha: this.mask.shiftAlpha(b)
			}).pos.add(padding);
		});
	}

}

module.exports = Bit16;
