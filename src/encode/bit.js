
const ENUM = require('../util/enum.js');

class Bit {

	constructor(data) {
		this.extraBytes = data.extraBytes;
		this.width = data.width;
		this.height = data.height;
		this.pos = data.pos;
		this.endian = data.endian || false;
		this.bytesInColor = data.bytesInColor;
		this.palette = data.palette;
		this.colors = data.colors;
		this.data = data.data;
		this.buffer = data.buffer;
		this.bitPP = data.bitPP;
		if (ENUM.bitPP[this.bitPP]) {
			this.bytesInColor = ENUM.bitPP[this.bitPP];
		} else {
			this.bytesInColor = 3;
			this.bitPP = 24;
		}
	}

	writeUInt32LE(value) {
		return this.data.writeUInt32LE(value, this.pos.add(4));
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

	writeImage(writePixel) {
		const rowBytes = Math.ceil(this.extraBytes + this.width * this.bytesInColor);

		let i = 0;
		return this.forEndian(0, this.height, (y) => {
			for (let x = 0; x < this.width; x++) {
				const p = Math.floor(this.pos.current + (y * rowBytes) + (x * this.bytesInColor));
				if (p > this.data.length) {
					throw new Error(`postion "${p}" at x:${x},y${y} is outside of buffer "${this.data.length}"`);
				}
				i = writePixel(p, i, x, y);
			}
		});
	}

	initColors(bit) {
		const colors = [];

		if (this.palette.length) {
			for (let i = 0; i < this.colors; i++) {
				const rootColor = this.createColor(this.palette[i]);
				this.writeUInt32LE(rootColor);
				colors.push(rootColor);
			}
		} else {
			throw new Error(`${bit}-bit BMPs a pallette is needed. Please choose up to ${this.colors} colors.`
			);
		}

		return colors;
	}

	createInteger(numbers) {
		return numbers.reduce((final, n) => (final << 1) | n, 0);
	}

	createColor(color) {
		return (color.quad << 24) | (color.red << 16) | (color.green << 8) | color.blue;
	}

}

module.exports = Bit;
