"use strict";

class Point {
	constructor(x,y) {
		this[0] = this.x = x;
		this[1] = this.y = y;
	}
	copy({x,y}) {
		this.x = x;
		this.y = y;
		return this;
	}
	add({x,y}) {
		this.x += x;
		this.y += y;
	}
	arr() {
		return [this.x,this.y];
	}
	get ["0"]() {return this.x;}
	set ["0"](v) {this.x = v;}
	get ["1"]() {return this.y;}
	set ["1"](v) {this.y = v;}
}

const utils = {
	circleInArea({coord:{x,y},r},{x1,y1,x2,y2}){
		return (this.inBtw(...this.narrow(x1, x2, r), x) && this.inBtw(...this.narrow(y1, y2, r), y));
	},
	inArea({x,y},{x1,y1,x2,y2}){
		return (this.inBtw(x1, x2, x) && this.inBtw(y1, y2, y));
	},
	narrow(a1,a2,r) {
		if (a1<a2) {a1-=r;a2+=r;}
		else {a2-=r;a1+=r;}
		return [a1,a2];
	},
	inBtw(min,max,val) {
		if (typeof min !== "number" || typeof max !== "number" || typeof val !== "number") throw "Error need number";
		return min < val && max > val;
	},
	Point
};

export default utils;