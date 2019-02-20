
const fs = require('fs'),
	path = require('path'),
	bmp = require('../index.js'),
	crypto = require('crypto');

let hash = (data) => {
	let h = crypto.createHash('sha1');
	h.update(data);
	return h.digest('hex');
};

try {
	fs.mkdirSync(path.join(__dirname, '/out'));
} catch (e) {
	//
}

const files = {
	bit1: ['bit1'],
	bit4: ['bit4'],
	bit8: ['bit8'],
	bit16: ['bit16'],
	bit24: ['bit24'],
	bit32: ['bit32']
};

let bmps = [];
Object.keys(files).map((a) => bmps = bmps.concat(files[a]));

for (let i in bmps) {
	const src = path.join(__dirname, '/data/', bmps[i] + '.bmp'),
		out = path.join(__dirname, '/out/', bmps[i]);

	let hashs = {};
	let bufferData = fs.readFileSync(src);
	hashs.raw = hash(bufferData);
	let decode1 = bmp.decode(bufferData);
	let encode1 = bmp.encode(decode1);
	hashs.encode1 = hash(encode1.data);
	let decode2 = bmp.decode(encode1.data);
	let encode2 = bmp.encode(decode2);
	hashs.encode2 = hash(encode2.data);

	console.log(bmps[i], 'hash:', hashs);
	console.log(bmps[i], '1 :', decode1.header);
	console.log(bmps[i], '2 :', decode2.header);
	// fs.unlinkSync(src + '_out.bmp');
	fs.writeFileSync(out + '_1.bmp', encode1.data);
	fs.writeFileSync(out + '_2.bmp', encode2.data);
	console.log('--------------');
}
