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
	const obstacles = [],balls = [];
	const init = function(){
		draw.prepareIfNot(opt);
		for (let i = 0; i < 15; i++) {
			for (let i2 = 0; i2 < 8; i2++) {
				// if (i2 === 1) continue;
				obstacles.push(obstacleStamp({
					x: 41*i, y: 41*i2, hits: Math.round(Math.random()*10)
				}));
			}
		}
		draw.obstacles(obstacles);
	};
	this.start = () => {
		init();
		itteratorStamp(120, (delta,fps) => {
			balls.map(function(ball){
				ball.ballupdate(delta);
			});
			update.updateAll(balls,obstacles,opt);
			update.ballWithObstacles(balls,obstacles);
			draw.balls(balls);
			// draw.obstacles(obstacles);
		},opt.fpsNode);
		console.log("run");
	};
	
	launchBall(opt,ball=>balls.push(ball));
	
});


export {okayStamp};