"use strict";

import util from "../utils";
import draw from "./draw";
import update from "./update";
import launchBall from "./launchBall";
import {itteratorStamp} from "./itterator";
import {ballStamp, obstacleStamp} from "./modelsStamps";

const stampit = require("stampit");


const okayStamp = stampit().init(function(opt,{instance}){
	this.opt = opt;
	let obstacles = [],balls = [];
	const init = function(){
		draw.prepareIfNot(opt);
		for (let i = 0; i < 15; i++) {
			for (let i2 = 0; i2 < 8; i2++) {
				if (i2 === 3) continue;
				obstacles.push(obstacleStamp({
					coord: new util.Point(41*i, 41*i2),
					hits: Math.round(Math.random()*10)
				}));
			}
		}
		draw.obstacles(obstacles);
	};
	this.start = () => {
		init();
		itteratorStamp(120, (delta,fps) => {
			update.updateAll(balls,obstacles,delta,opt);
			update.ballWithObstacles(balls,obstacles);
			draw.balls(balls);
		},opt.fpsNode);
		console.log("run");
	};
	
	launchBall(opt,ball=>{
		if (!update.ballInObstacles(ball,obstacles)) {
			draw.deleteBalls(balls);
			balls = [ball];
		}
	});
	
});


export {okayStamp};