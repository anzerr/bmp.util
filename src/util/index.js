
class Index {

	constructor(n = 0) {
		this.set(n);
	}

	get current() {
		return this._n;
	}

	set(n) {
		this._n = n;
		return this._n;
	}

	add(n) {
		return this.next(n);
	}

	next(a) {
		let n = this._n;
		this._n += a;
		return n;
	}

}

module.exports = Index;
