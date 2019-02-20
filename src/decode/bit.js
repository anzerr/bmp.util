
const Index = require('../util/index.js');

class Bit {

	constructor(data) {
		this.buffer = data.buffer;
		this.width = data.width;
		this.height = data.height;
		this.endian = data.endian;
		this.pos = data.pos;
		this.palette = data.palette;
		this.headerSize = data.headerSize;
		this.compress = data.compress;
		this.bitPP = data.bitPP;
		this.data = Buffer.alloc(this.width * this.height * 4);

		this.rate = 1;
		this.read = 1;
	}

	readUInt32LE() {
		return this.buffer.readUInt32LE(this.pos.add(4));
	}

	readUInt16LE() {
		return this.buffer.readUInt16LE(this.pos.add(2));
	}

	readUInt8() {
		return this.buffer.readUInt8(this.pos.add(1));
	}

	forEndian(start, end, cd) {
		for (let i = start; i < end; i++) {
			let a = cd(this.endian ? end - i - 1 : i);
			if (a) {
				break;
			}
		}
		return this;
	}

	add(l, index) {
		let rgb = (typeof index === 'object') ? index : this.palette[index];
		this.data[l + 0] = rgb.alpha || 0;
		this.data[l + 1] = rgb.blue;
		this.data[l + 2] = rgb.green;
		this.data[l + 3] = rgb.red;
		return this;
	}

	scan(cd) {
		const xlen = Math.ceil(this.width / this.rate),
			mode = xlen % 4,
			padding = mode !== 0 ? 4 - mode : 0,
			read = this['readUInt' + (8 * this.read) + (this.read === 1 ? '' : 'LE')].bind(this);

		return this.forEndian(0, this.height, (y) => {
			for (let x = 0; x < xlen; x++) {
				let a = cd(
					read(),
					y * this.width * 4 + x * this.rate * 4,
					x,
					y
				);
				if (a) {
					break;
				}
			}
			this.pos.add(padding);
		});
	}

	scanCompress(cd) {
		this.data.fill(0xff);

		let location = new Index(0);
		let lines = new Index(this.endian ? this.height - 1 : 0),
			increment = this.endian ? -1 : 1;

		while (location.current < this.data.length) {
			let a = this.readUInt8(), b = this.readUInt8();
			if (a === 0) {
				if (b === 0) {
					lines.add(increment);
					location.set(lines.current * this.width * 4);
					cd(0, location, b, a);
				} else if (b === 1) {
					break;
				} else if (b === 2) {
					let x = this.readUInt8(), y = this.readUInt8();
					lines.add(increment * y);
					location.add(y * this.width * 4 + x * 4);
					cd(1, location, b, a);
				} else {
					cd(2, location, b, a);
				}
			} else {
				cd(3, location, b, a);
			}
		}
	}

	parse() {
		return this.data;
	}

}

module.exports = Bit;
