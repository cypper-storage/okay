"use strict";

const stampit = require("stampit");

var ballStamp = stampit()
	.deepProps({
		vec: {
			dx: 1,
			dy: 1
		},
		prev: {
			x: 0, y: 0
		},
	})
	.methods({
		x: 0, y: 0, r: 1, speed: 0.1, friction: 0.05,
		setVec: function(direct){
			if (typeof direct !== "number") throw "Error direct";
			direct = (direct%1)*2*Math.PI;
			console.log(direct);
			this.vec.dx = Math.sin(direct);
			this.vec.dy = Math.cos(direct);
			console.log(this.vec);

		},
		ballupdate: function(delta){
			this.speed -= this.speed*this.friction*(delta/1000);
			this.prev.x = this.x;
			this.prev.y = this.y;
			this.x += this.speed*delta*this.vec.dx;
			this.y += this.speed*delta*this.vec.dy;
		}
	})
	.init(function(opt){
		Object.assign(this,opt);
	});


var obstacleStamp = stampit()
	.methods({
		x: 0, y: 0, width: 40, height: 40, hits: 40,
		hitted: function(){
			this.hits--;
			if (this.hits - 1 <= 0) this.hits = 0;
		}
	})
	.init(function(opt){
		Object.assign(this,opt);
	});

export {ballStamp, obstacleStamp};