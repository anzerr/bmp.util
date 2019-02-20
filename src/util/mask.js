
const ENUM = require('./enum.js');

class Mask {

	constructor(maskRed, maskGreen, maskBlue, maskAlpha) {
		this.maskRed = maskRed;
		this.maskGreen = maskGreen;
		this.maskBlue = maskBlue;
		this.maskAlpha = maskAlpha;

		this.maskRedR = (~this.maskRed + 1) & this.maskRed;
		this.maskGreenR = (~this.maskGreen + 1) & this.maskGreen;
		this.maskBlueR = (~this.maskBlue + 1) & this.maskBlue;
		this.maskAlphaR = (~this.maskAlpha + 1) & this.maskAlpha;

		this.shiftedMaskRedL = this.maskRed / this.maskRedR + 1;
		this.shiftedMaskGreenL = this.maskGreen / this.maskGreenR + 1;
		this.shiftedMaskBlueL = this.maskBlue / this.maskBlueR + 1;
		this.shiftedMaskAlphaL = this.maskAlpha / this.maskAlphaR + 1;
	}

	shiftRed(x) {
		return (((x & this.maskRed) / this.maskRedR) * 0x100) / this.shiftedMaskRedL;
	}

	shiftGreen(x) {
		return (((x & this.maskGreen) / this.maskGreenR) * 0x100) / this.shiftedMaskGreenL;
	}

	shiftBlue(x) {
		return (((x & this.maskBlue) / this.maskBlueR) * 0x100) / this.shiftedMaskBlueL;
	}

	shiftAlpha(x) {
		if (this.maskAlpha !== 0) {
			return (((x & this.maskAlpha) / this.maskAlphaR) * 0x100) / this.shiftedMaskAlphaL;
		}
		return 255;
	}

}

module.exports = (bit) => {
	let mask = {};
	if (bit.bitPP === 32) {
		mask.Alpha = 0;
		mask.Red = 0x00ff0000;
		mask.Green = 0x0000ff00;
		mask.Blue = 0x000000ff;
	} else if (bit.bitPP === 16) {
		mask.Alpha = 0;
		mask.Red = 0x7c00;
		mask.Green = 0x03e0;
		mask.Blue = 0x001f;
	}
	let h = ENUM.HeaderTypes, c = ENUM.Compression;
	if (bit.headerSize > h.BITMAP_INFO_HEADER || bit.compress === c.BI_BIT_FIELDS || bit.compress === c.BI_ALPHA_BIT_FIELDS) {
		mask.Red = bit.readUInt32LE();
		mask.Green = bit.readUInt32LE();
		mask.Blue = bit.readUInt32LE();
	}
	return new Mask(mask.Red, mask.Green, mask.Blue, mask.Alpha);
};
