
const ENUM = require('../util/enum.js');

class Bit8 extends require('./bit.js') {

	constructor(data) {
		super(data);
	}

	parse() {
		if (this.compress === ENUM.Compression.BI_RLE8) {
			return this.scanCompress((type, location, b, a) => {
				if (type === 2) {
					for (let i = 0; i < b; i++) {
						this.add(location.add(4), this.buffer.readUInt8(this.pos.add(1)));
					}
					if ((b & 1) === 1) {
						this.pos.add(1);
					}
					return;
				}
				if (type === 3) {
					for (let i = 0; i < a; i++) {
						this.add(location.add(4), b);
					}
				}
			});
		}
		return this.scan((b, location) => {
			this.add(location, (b < this.palette.length) ? b : ENUM.Palette.WHITE);
		});
	}

}

module.exports = Bit8;
