
class Bit24 extends require('./bit.js') {

	constructor(data) {
		super(data);
		this.read = 2;
	}

	parse() {
		const padding = (this.width % 4);
		return this.scan((b, location) => {
			this.add(location, {
				blue: (b & 0x00ff),
				green: (b & 0xff00) >> 8,
				red: this.readUInt8()
			}).pos.add(padding);
		});
	}

}

module.exports = Bit24;
