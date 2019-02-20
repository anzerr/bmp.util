
const Decode = require('./src/decode.js'),
	Encode = require('./src/encode.js');

module.exports = {
	decode: (...arg) => {
		return new Decode(...arg);
	},

	encode: (data) => {
		return {
			data: new Encode(data).encode(),
			width: data.width,
			height: data.height
		};
	}
};
