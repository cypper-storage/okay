"use strict";

import util from "../utils";

const stampit = require("stampit");

const ballStamp = stampit()
	.deepProps({
		vec: new util.Vector(1, 1),
		pCoord: new util.Point(0, 0),
		coord: new util.Point(0, 0),
	})
	.props({
		r: 1, friction: 0.05, maxSpeed: 0.2
	})
	.methods({
		setVec: function(direct){
			if (typeof direct !== "number") throw "Error direct";
			direct = (direct%1)*2*Math.PI;
			console.log(direct);
			this.vec.dx = Math.sin(direct);
			this.vec.dy = Math.cos(direct);
			console.log(this.vec);

		},
		ballupdate: function(delta){
			// if (this.maxSpeed < this.vec.module()) this.vec = ;
			// this.speed -= this.speed*this.friction*(delta/1000);
			this.pCoord.copy(this.coord);
			this.coord.add({
				x: delta*this.vec.dx,
				y: delta*this.vec.dy
			});
		}
	})
	.init(function(opt){
		Object.assign(this,opt);
		this.pCoord.copy(opt.coord);
	});


const obstacleStamp = stampit()
	.deepProps({
		coord: new util.Point(0, 0),
	})
	.props({
		width: 40, height: 40, hits: 40
	})
	.methods({
		hitted: function(){
			if (this.hits <= 0) return (this.hits = 0);
			return --this.hits;
		}
	})
	.init(function(opt){
		Object.assign(this,opt);
	});

export {ballStamp, obstacleStamp};