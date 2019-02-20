
const ENUM = require('../util/enum.js');

class Bit4 extends require('./bit.js') {

	constructor(data) {
		super(data);
		this.rate = 2;
	}

	parse() {
		if (this.compress === ENUM.Compression.BI_RLE4) {
			let nyble = false;
			return this.scanCompress((type, location, b, a) => {
				if (type === 0) {
					return nyble = false;
				}
				if (type === 2) {
					let c = this.buffer.readUInt8(this.pos.add(1));
					for (let i = 0; i < b; i++) {
						this.add(location.add(4), (nyble) ? c & 0x0f : (c & 0xf0) >> 4);
						if ((i & 1) && (i + 1 < b)){
							c = this.buffer.readUInt8(this.pos.add(1));
						}
						nyble = !nyble;
					}

					if ((((b + 1) >> 1) & 1) === 1) {
						this.pos.add(1);
					}
					return;
				}
				if (type === 3) {
					for (let i = 0; i < a; i++) {
						this.add(location.add(4), (nyble) ? b & 0x0f : (b & 0xf0) >> 4);
					}
					return;
				}
			});
		}

		return this.scan((b, location, x) => {
			this.add(location, b >> 4);
			if (x * 2 + 1 >= this.width) {
				return true;
			}
			this.add(location + 4, b & 0x0F);
		});
	}

}

module.exports = Bit4;
