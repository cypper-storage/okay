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
	copy({dx,dy}) {
		this.dx = dx;
		this.dy = dy;
		return this;
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
	toLen(len) {
		const k = len/this.module();
		this.dx *= k;
		this.dy *= k;
		return this;
	}
	paralel(vec) {
		if (this.isZero() || vec.isZero()) throw "One vector is zero";
		return util.equalPrec(vec.dy*this.dx, vec.dx*this.dy);
	}
	isZero(vec) {
		return (util.equalPrec(this.dx,0) && util.equalPrec(this.dy,0));
	}
	perpendicular(vec) {
		return util.equalPrec(this.scalar(vec), 0);
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
	toStr() {
		return `${this.x},${this.y}`;
	}
	get ["0"]() {return this.x;}
	set ["0"](v) {this.x = v;}
	get ["1"]() {return this.y;}
	set ["1"](v) {this.y = v;}
}

const util = {
	cross2VecWithP(vec1,{x:x1,y:y1},vec2,{x:x2,y:y2}){
		let x,y;
		const {dx:dx1,dy:dy1} = vec1;
		const {dx:dx2,dy:dy2} = vec2;
		const p1 = x1*dy1 - y1*dx1;
		const p2 = x2*dy2 - y2*dx2;
		if (vec1.isZero()) return null;
		if (vec2.isZero()) return null;
		if (vec1.paralel(vec2)) return null;

		if (this.equalPrec(dx1, 0) && this.equalPrec(dy2, 0)) {
			x = p1/dy1;
			y = -p2/dx2;
		} else if (this.equalPrec(dx2, 0) && this.equalPrec(dy1, 0)) {
			y = -p1/dx1;
			x = p2/dy2;
		} else if (this.equalPrec(dx1, 0)) {
			x = p1/dy2;
			y = (p1*dy2) / (dy1*dx2) - p2/dx2;
		} 
		else if (this.equalPrec(dx2, 0)) {
			x = p2/dy2;
			y = (x*dy1 - p1) / dx1 ;
		}
		else if (this.equalPrec(dy1, 0)) {
			y = -p1 / dx1;
			x = (p2 + y*dx2) / dy2;
		}
		else if (this.equalPrec(dy2, 0)) {
			y = -p2 / dx2;
			x = (p1 + y*dx1) / dy1;
		}
		else {
			// const p1 = (dx1*x1 - y1*dy1);
			// const p2 = (dx2*x2 - y2*dy2);
			// // y = (p1*dx2 - p2*dx1) / (dy2*dx1 - dy1*dx2);
			// // x = (p2*dy1 - p1*dy2) / (dy1*dx2 - dy2*dx1);
			// x = (p2/dy2 - p1/dy1) / (dx2/dy2 - dx1/dy1);
			// y = (p1/dx1 - p2/dx2) / (dy2/dx2 - dy1/dx1);

			x = (p1/dx1 - p2/dx2) / (dy1/dx1 - dy2/dx2);
			y = (p1/dy1 - p2/dy2) / (dx2/dy2 - dx1/dy1);
		}
		// x*dy1 - y*dx1 = p1;
		// x*dy2 - y*dx2 = p2;
		// y - x*dy1/dx1 = p1/dx1;
		// y - x*dy2/dx2 = p2/dx2;
		// x*dy1/dx1 - y = p1/dx1;
		// x*dy2/dx2 - y = p2/dx2;

		if ((x === Infinity || x === -Infinity) || (y === Infinity || y === -Infinity)) throw `Error coords is infinity ${x},${y}`;

		return new Point(x,y);
	},
	crossVecWithPAnd2Ps({dx,dy},{x,y},{x:x1,y:y1},{x:x2,y:y2}){

		let xN,yN;
		// if (dx === 0) {
		// 	xN = x1;
		// 	yN = y;
		// 	// yN = ((y2-y1)*(xN-x1))/(x2-x1) + y1;
		// } else if (dy === 0) {
		// 	yN = y1;
		// 	xN = x;
		// 	// if (y2 - y1 === 0) {

		// 	// }
		// 	// xN = x1-((y1*(x2-x1))/(y2-y1));
		// } else {
			const k1 = y2 - y1;
			const k2 = y - y1;
			const k3 = x2 - x1;
			const k4 = k2*k3 + k1*x1;
			const k5 = ((dy*k3)/dx) - k1;
			xN = ((x*dy*k3)/dx - k4)/k5;
			yN = ((xN-x)*dy)/dx + y;
		// }
		return new Point(xN,yN);
	},
	circleHitSection(ball,p1,p2){
		const {coord,vec,r} = ball;
		if (vec.isZero()) return null;
		const sideVec = new Vector(p1,p2);
		if (sideVec.isZero()) return null;
		const n = (new Vector(p1,p2)).rotate(Math.PI/2);
		// const Op = this.crossVecWithPAnd2Ps(n,coord,...side);
		const Op = this.cross2VecWithP(n,coord,sideVec,p1);
		if (Op === null) return null;
		// console.log(Op);
		if (!this.inBtwLines(p1.x, p2.x, Op.x) &&
			!this.inBtwLines(p1.y, p2.y, Op.y)) return null;

		const D = this.cross2VecWithP(vec,coord,sideVec,p1);
		if (D === null) return null;
		const l = D.len(coord);


		let cosVecs = sideVec.cos(vec);
		if (cosVecs < 0) cosVecs = -cosVecs;
		// if (cosVecs > 0) cosVecs = sideVec.changeDirection().cos(vec);
		const alpha = Math.acos(cosVecs);

		const z = Math.sqrt(Math.pow(l,2) - Math.pow(cosVecs*l,2) );
		// console.log(z);
		if (z < 0) console.log(z);
		if (z < r) {
			console.log(2*alpha*57.2957);
			vec.rotate(2*alpha);
			// ball.ballupdate(5);
			return vec;
			vec.copy(new Vector(0,0));
		}
		return null;
	},
	circleHitArea(ball,{x1,y1,x2,y2}){
		const {vec} = ball;
		if (vec.isZero()) return null;
		const p1 = new Point(x1,y1);
		const p2 = new Point(x2,y1);
		const p3 = new Point(x2,y2);
		const p4 = new Point(x1,y2);
		p3.add({
			x:0,
			y:0
		});
		// yN = (xN-x)*dy/dx + y;
		// yN = ((side[1].y-side[0].y)*(xN-side[0].x)/(side[1].x-side[0].x))+side[0].y
		console.log("-");
		// for(const side of [[p1,p2],[p2,p3],[p3,p4],[p4,p1]]) {
		for(const side of [[p2,p3]]) {
			if (this.circleHitSection(ball,...side) !== null) return vec;
		}
		return null;
		// return (this.inBtw(...this.narrow(x1, x2, r), x) && this.inBtw(...this.narrow(y1, y2, r), y));
	},
	// circleHitLine()
	equalPrec(num1,num2,prec=0.000001) {
		return (Math.abs(num1 - num2) <= prec);
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

export default util;