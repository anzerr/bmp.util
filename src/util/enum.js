
module.exports = {
	HEADER: [
		{key: 'fileSize', size: 4},
		{key: 'reserved', size: 4},
		{key: 'offset', size: 4},
		{key: 'headerSize', size: 4},
		{key: 'width', size: 4},
		{key: 'height', size: 4},
		{key: 'planes', size: 2},
		{key: 'bitPP', size: 2},
		{key: 'compress', size: 4},
		{key: 'rawSize', size: 4},
		{key: 'hr', size: 4},
		{key: 'vr', size: 4},
		{key: 'colors', size: 4},
		{key: 'importantColors', size: 4},
	],

	Palette: {
		WHITE: {blue: 0xFF, green: 0xFF, red: 0xFF}
	},

	bitPP: {
		32: 4,
		16: 2,
		8: 1,
		4: 1 / 2,
		1: 1 / 8
	},

	Compression: {
		NONE: 0,
		BI_RLE8: 1,
		BI_RLE4: 2,
		BI_BIT_FIELDS: 3,
		BI_ALPHA_BIT_FIELDS: 6
	},

	HeaderTypes: {
		BITMAP_INFO_HEADER: 40,
		BITMAP_V2_INFO_HEADER: 52,
		BITMAP_V3_INFO_HEADER: 56,
		BITMAP_V4_HEADER: 108,
		BITMAP_V5_HEADER: 124
	}
};
