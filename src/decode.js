
const Index = require('./util/index.js'),
	ENUM = require('./util/enum.js');

const bit = {
	bit1: require('./decode/bit1.js'),
	bit4: require('./decode/bit4.js'),
	bit8: require('./decode/bit8.js'),
	bit15: require('./decode/bit15.js'),
	bit16: require('./decode/bit16.js'),
	bit24: require('./decode/bit24.js'),
	bit32: require('./decode/bit32.js')
};

class Decoder {

	constructor(buffer, isAlpha = false) {
		this.buffer = buffer;
		this.isAlpha = isAlpha;
		this.endian = false;
		this.header = {};
		this.header.flag = this.buffer.toString('utf-8', 0, 2);
		if (this.header.flag !== 'BM') {
			throw new Error('Invalid BMP File');
		}
		this.data = this.parse(this.getHeader());
		this.height = this.header.height;
		this.width = this.header.width;
	}

	getHeader() {
		let pos = new Index(2);
		for (let i in ENUM.HEADER) {
			let h = ENUM.HEADER[i];
			this.header[h.key] = this.buffer.readUIntLE(pos.current, h.size, pos.next(h.size));
		}

		if (this.header.bitPP === 16 && this.isAlpha) {
			this.header.bitPP = 15;
		}

		if (this.header.bitPP <= 8 || this.header.colors > 0) {
			let len = this.header.colors === 0 ? 1 << this.header.bitPP : this.header.colors;
			this.header.palette = new Array(len);
			for (let i = 0; i < len; i++) {
				this.header.palette[i] = ({
					red: this.buffer.readUInt8(pos.current + 2),
					green: this.buffer.readUInt8(pos.current + 1),
					blue: this.buffer.readUInt8(pos.current + 0),
					quad: this.buffer.readUInt8(pos.current + 3),
				});
				pos.next(4);
			}
		}
		if (this.header.height < 0) {
			this.header.height *= -1;
			this.endian = false;
		}
		return pos;
	}

	parse(pos) {
		let t = new bit['bit' + this.header.bitPP]({
			buffer: this.buffer,
			height: this.header.height,
			width: this.header.width,
			endian: this.endian,
			palette: this.header.palette,
			headerSize: this.header.headerSize,
			compress: this.header.compress,
			bitPP: this.header.bitPP,
			pos: pos
		});
		t.parse();
		return t.data;
	}

}

module.exports = Decoder;
