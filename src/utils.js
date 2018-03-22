"use strict";

class Vector {
	constructor(arg1,arg2) {
		if (typeof arg1 === "object" || typeof arg2 === "object") {
			this.dx = arg2.x - arg1.x;
			this.dy = arg2.y - arg1.y;
		} else if (typeof arg1 === "number" || typeof arg2 === "number") {
			this.dx = arg1;
			this.dy = arg2;
		} else {
			throw "Error wrong vector construct params";
		}
	}
	scalar(vec) {
		return this.dx*vec.dx + this.dy*vec.dy;
	}
	module() {
		return Math.hypot(this.dx,this.dy);
	}
	cos(vec) {
		return this.scalar(vec)/(this.module()*vec.module());
	}
	rotate(arg1,arg2) {
		if (arg2 === undefined) {
			const tempDx = this.dx*Math.cos(arg1) - this.dy*Math.sin(arg1);
			this.dy = this.dx*Math.sin(arg1) + this.dy*Math.cos(arg1);
			this.dx = tempDx;
		} else {
			const tempDx = this.dx*arg2 - this.dy*arg1;
			this.dy = this.dx*arg1 + this.dy*arg2;
			this.dx = tempDx;
		}
		return this;
	}
	changeDirection() {
		this.dx = -this.dx;
		this.dy = -this.dy;
		return this;
	}
}
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
	len(point) {
		return Math.hypot(this.x-point.x,this.y-point.y);
	}
	get ["0"]() {return this.x;}
	set ["0"](v) {this.x = v;}
	get ["1"]() {return this.y;}
	set ["1"](v) {this.y = v;}
}

const utils = {
	cross2VecWithP({dx,dy},{x,y},{dx:dx2,dy:dy2},{x:x2,y:y2}){

	},
	crossVecWithPAnd2Ps({dx,dy},{x,y},{x:x1,y:y1},{x:x2,y:y2}){
		let xN,yN;
		if (dx === 0) {
			xN = x1;
			yN = y;
			// yN = ((y2-y1)*(xN-x1))/(x2-x1) + y1;
		} else if (dy === 0) {
			yN = y1;
			xN = x;
			// if (y2 - y1 === 0) {

			// }
			// xN = x1-((y1*(x2-x1))/(y2-y1));
		} else {
			const k1 = y2 - y1;
			const k2 = y - y1;
			const k3 = x2 - x1;
			const k4 = k2*k3 + k1*x1;
			const k5 = ((dy*k3)/dx) - k1;
			xN = ((x*dy*k3)/dx - k4)/k5;
			yN = ((xN-x)*dy)/dx + y;
		}
		return new Point(xN,yN);
	},
	circleInArea({coord,vec,r},{x1,y1,x2,y2}){
		const {x,y} = coord;
		const {dx,dy} = vec;
		const p1 = new Point(x1,y1);
		const p2 = new Point(x2,y1);
		const p3 = new Point(x2,y2);
		const p4 = new Point(x1,y2);
		// yN = (xN-x)*dy/dx + y;
		// yN = ((side[1].y-side[0].y)*(xN-side[0].x)/(side[1].x-side[0].x))+side[0].y
		for(const side of [[p1,p2],[p2,p3],[p3,p4],[p4,p1]]) {
		// for(const side of [[p3,p4]]) {
			const sideVec = new Vector(side[0],side[1]);
			const n = new Vector(1,(sideVec.dy === 0 ? 0 : sideVec.dx/sideVec.dy));
			const Op = this.crossVecWithPAnd2Ps(n,coord,...side);
			console.log(Op);
			if (!this.inBtwLines(side[0].x, side[1].x, Op.x) &&
				!this.inBtwLines(side[0].y, side[1].y, Op.y)) return null;

			const D = this.crossVecWithPAnd2Ps(vec,coord,...side);
			const l = D.len(coord);


			const cosVecs = sideVec.cos(vec);
			const alpha = Math.acos(cosVecs);
			const z = Math.sqrt(Math.pow(l,2) - Math.pow(cosVecs*l,2) );
			console.log(z);

			if (z < r) {
				vec.rotate(-2*alpha);
				return vec;
			}
		}
		return null;
		// return (this.inBtw(...this.narrow(x1, x2, r), x) && this.inBtw(...this.narrow(y1, y2, r), y));
	},
	sinToDeg(value) {
		return Math.asin(value)*57.2957795;
	},
	cosToDeg(value) {
		return Math.acos(value)*57.2957795;
	},
	cosToSin(value){
		return Math.sqrt(1-(Math.pow(value,2)));
	},
	inArea({x,y},{x1,y1,x2,y2}){
		return (this.inBtw(x1, x2, x) && this.inBtw(y1, y2, y));
	},
	narrow(a1,a2,r) {
		if (a1<a2) {a1-=r;a2+=r;}
		else {a2-=r;a1+=r;}
		return [a1,a2];
	},
	inBtwLines(l1,l2,val) {
		if (typeof l1 !== "number" || typeof l2 !== "number" || typeof val !== "number") throw "Error need number";
		return (l1 < val && l2 > val) || (l2 < val && l1 > val);
	},
	inBtw(min,max,val) {
		if (typeof min !== "number" || typeof max !== "number" || typeof val !== "number") throw "Error need number";
		return min < val && max > val;
	},
	Point,
	Vector
};

export default utils;