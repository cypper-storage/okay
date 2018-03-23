"use strict";

import util from "../utils";
import draw from "./draw";
import update from "./update";
import launchBall from "./launchBall";
import {itteratorStamp} from "./itterator";
import {ballStamp, rectStamp, sectionStamp} from "./modelsStamps";

const stampit = require("stampit");


// let angle1 = Math.PI*2;
// console.log(new util.Vector(2,1).rotate(Math.sin(angle1),Math.cos(angle1)))
// angle1 = Math.PI;
// console.log(new util.Vector(2,1).rotate(Math.sin(angle1),Math.cos(angle1)))
// angle1 = Math.PI/2;
// console.log(new util.Vector(2,1).rotate(Math.sin(angle1),Math.cos(angle1)))



const okayStamp = stampit().init(function(opt,{instance}){
	// return;
	this.opt = opt;
	let obstacles = [],balls = [];
	const init = function(){
		draw.prepareIfNot(opt);
		obstacles.push(sectionStamp({
			coord: new util.Point(100,100),
			coord2: new util.Point(200,200)
		}))
		// for (let i = 0; i < 1; i++) {
		// 	for (let i2 = 0; i2 < 1; i2++) {
		// 		if (i2 === 3) continue;
				// obstacles.push(rectStamp({
				// 	coord: new util.Point(41*5, 41*5),
				// 	hits: Math.round(1000)
				// 	// hits: Math.round(Math.random()*1000)
				// }));
		// 	}
		// }
		draw.obstacles(obstacles);
	};
	this.start = () => {
		init();
		itteratorStamp(120, (delta,fps) => {
			update.updateAll(balls,obstacles,delta,opt);
			draw.balls(balls);
		},opt.fpsNode);
		console.log("run");
	};
	
	launchBall(opt,ball=>{
		if (!update.ballInObstacles(ball,obstacles)) {
			// draw.deleteBalls(balls);
			// balls = [ball];
			balls.push(ball);
		}
	});
	
});


export {okayStamp};