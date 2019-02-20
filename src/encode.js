
const Index = require('./util/index.js'),
	ENUM = require('./util/enum.js');

const bit = {
	bit1: require('./encode/bit1.js'),
	bit4: require('./encode/bit4.js'),
	bit8: require('./encode/bit8.js'),
	bit16: require('./encode/bit16.js'),
	bit24: require('./encode/bit24.js'),
	bit32: require('./encode/bit32.js')
};

class Encode {

	constructor(data) {
		this.buffer = data.data;
		this.endian = data.endian !== false;
		const header = data.header || data;
		const bitPP = header.bitPP || 24;
		this.header = {
			flag: 'BM',
			reserved: header.reserved || 0,
			offset: 54,
			headerSize: ENUM.HeaderTypes.BITMAP_INFO_HEADER,
			height: header.height,
			width: header.width,
			planes: 1,
			bitPP: bitPP,
			compress: 0,
			hr: header.hr || 0,
			vr: header.vr || 0,
			colors: Math.min(2 ** (bitPP - 1 || 1), header.colors || Infinity),
			importantColors: header.importantColors || 0,
			palette: header.palette || []
		};

		if (this.header.colors && this.header.bitPP < 16) {
			this.header.offset += this.header.colors * 4;
		} else {
			this.header.colors = 0;
		}

		const rowWidth = (this.header.width * this.header.bitPP) / 32;
		const rowBytes = Math.ceil(rowWidth);
		let bytesInColor = Math.ceil(ENUM.bitPP[this.header.bitPP] ? ENUM.bitPP[this.header.bitPP] : 3);

		this.extraBytes = Math.floor((rowBytes - rowWidth) * 4);
		this.rawSize = this.header.height * (bytesInColor * this.header.width + this.extraBytes);
		this.header.fileSize = this.rawSize + this.header.offset + (this.header.colors * 8);
	}

	encode() {
		let data = Buffer.alloc(this.header.fileSize);
		data.write(this.header.flag, 0, 2);
		let pos = new Index(2);
		for (let i in ENUM.HEADER) {
			let h = ENUM.HEADER[i];
			if (h.key === 'height') {
				// data.writeIntLE(-this.header.height, pos.current, h.size, pos.next(h.size));
				data.writeUIntLE(this.header[h.key], pos.current, h.size, pos.next(h.size));
			} else {
				data.writeUIntLE(this.header[h.key], pos.current, h.size, pos.next(h.size));
			}
		}
		if (!bit['bit' + this.header.bitPP]) {
			throw new Error(`${this.header.bitPP} is not handled for encoding`);
		}
		let t = new bit['bit' + this.header.bitPP]({
			buffer: this.buffer,
			data: data,
			pos: pos,
			bitPP: this.header.bitPP,
			endian: this.endian,
			palette: this.header.palette,
			colors: this.header.colors,
			width: this.header.width,
			height: this.header.height,
			extraBytes: this.extraBytes
		});
		t.toBuffer();
		return t.data;
	}

}

module.exports = Encode;
