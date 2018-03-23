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
			if (this.maxSpeed < this.vec.module()) this.vec.toLen(this.maxSpeed);
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
		hits: 40
	})
	.methods({
		hitted(){
			if (this.hits <= 0) return (this.hits = 0);
			return --this.hits;
		},
		name(){return "obstacle";}
	})
	.init(function(opt){
		Object.assign(this,opt);
	});

const rectStamp = stampit()
	.compose(obstacleStamp)
	.deepProps({
		width: 140, height: 140
	})
	.methods({name(){return "rect";}});

const lineStamp = stampit()
	.compose(obstacleStamp)
	.deepProps({
		vec: new util.Vector(1,1)
	})
	.methods({name(){return "line";}});

const sectionStamp = stampit()
	.compose(obstacleStamp)
	.deepProps({
		coord2: new util.Point(100,100)
	})
	.methods({name(){return "section";}});


export {ballStamp, rectStamp, lineStamp, sectionStamp};