"use strict";

import util from "../utils";
import {itteratorStamp} from "./itterator";
import {ballStamp, obstacleStamp} from "./modelsStamps";

const stampit = require("stampit");
const Snap = require("snapsvg");


var okayStamp = stampit()
	.deepProps({
		fpsNode: document.getElementById('fps')
	})
	.init(function update(_,{instance}){
		var updFuncs = {};

		updFuncs.updateAll = function(balls,obs) {
			updFuncs.updateBalls(balls);
			updFuncs.updateObs(obs);
		};
		updFuncs.updateObs = function(obs) {
			obs.map(function(ob,i,obj){
				// console.log(ob.hits);
				if (ob.hits <= 0) {
					obj.splice(i, 1);
					instance.draw.deleteObs(ob);
				}
			});
		};
		updFuncs.updateBalls = function(balls) {
			balls.map(function(ball,i,obj){
				if (!util.inBtw(0,instance.width,ball.x) ||
					!util.inBtw(0,instance.height,ball.y)) {
					obj.splice(i, 1);
					instance.draw.deleteBall(ball);
				}
			});
		};
		updFuncs.ballWithObstacles = function(balls,obstacles) {
			balls.map(function(ball){
				obstacles.forEach(function(ob, i, object) {
					if (util.inBtw(ob.x,ob.x+ob.width,ball.x) &&
						util.inBtw(ob.y,ob.y+ob.height,ball.y)) {
						if (util.inBtw(ob.y,ob.y+ob.height,ball.prev.y))
							ball.vec.dx = -ball.vec.dx;
						else
							ball.vec.dy = -ball.vec.dy;
						ob.hitted();
						instance.draw.obstacles([ob]);
					}
				});
			});
		};
		this.update = updFuncs;
	})
	.init(function draw(){
		var drawFuncs = {}, canvasCont, canvas, that = this;
		drawFuncs.prepareIfNot = function(){
			var opt = that;
			if (!opt.container) throw "Error1";
			if (opt.type === "svg") {
				drawFuncs.createSvgContainer(opt.container);
			} else {
				throw "Error1";
			}
			canvasCont.setAttribute("width", (opt.width || 900));
			canvasCont.setAttribute("height", (opt.height || 1600));
		};
		drawFuncs.createSvgContainer = function(cont) {
			canvasCont = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			cont.appendChild(canvasCont);
			canvas = Snap(canvasCont);
		};
		drawFuncs.deleteBall = function(ball) {
			if (ball.circle) ball.circle.remove();
		};
		drawFuncs.deleteObs = function(obs) {
			if (obs.rect) obs.rect.remove();
			if (obs.text) obs.text.remove();
		};
		drawFuncs.deleteAim = function(aim) {
			if (aim) aim.remove();
		};
		drawFuncs.balls = function(balls) {
			balls.map(function(ball){
				drawFuncs.deleteBall(ball);
				ball.circle = canvas.circle(ball.x,ball.y,ball.r);
				ball.circle.attr({
					fill: "red"
				});
				// ball.circle.transform("t"+ball.x+","+ball.y);
			});
		};
		drawFuncs.aim = function(x1,y1,x2,y2) {
			var aim = canvas.path(`M${x1},${y1}L${x2},${y2}`);
			aim.attr({
				stroke: "gray",
				"stroke-dasharray": "5,5"
			});
			return aim;
		};
		drawFuncs.obstacles = function(obstacles) {
			for (var i = 0; i < obstacles.length; i++) {
				var obstacle = obstacles[i];
				drawFuncs.deleteObs(obstacle);
				obstacle.rect = canvas.rect(obstacle.x,obstacle.y,obstacle.width,obstacle.height);
				obstacle.rect.attr({
					fill: "blue"
				});
				var textX = (obstacle.x+obstacle.width/2)-obstacle.hits.toString().length*4;
				var textY = (obstacle.y+obstacle.height/2)+3;
				obstacle.text = canvas.text(textX,textY,obstacle.hits);
				obstacle.text.addClass("non-selectable");
				obstacle.text.attr({
					fill: "black",
					"pointer-events": "none",
				});
			}
		};
		this.draw = drawFuncs;
	})
	.init(function(opt){
		Object.assign(this,opt);
	})
	.init(function game(_,{instance}){
		var obstacles = [],balls = [],
			draw = instance.draw, update = instance.update;
		var init = function(){
			draw.prepareIfNot();
			for (var i = 0; i < 15; i++) {
				for (var i2 = 0; i2 < 8; i2++) {
					// if (i2 === 1) continue;
					obstacles.push(obstacleStamp({
						x: 41*i, y: 41*i2, hits: Math.round(Math.random()*10)
					}));
				}
			}
			draw.obstacles(obstacles);
		};
		this.start = function(){
			init();
			itteratorStamp(120, function(delta,fps){
				balls.map(function(ball){
					ball.ballupdate(delta);
				});
				update.updateAll(balls,obstacles);
				update.ballWithObstacles(balls,obstacles);
				draw.balls(balls);
				// draw.obstacles(obstacles);
			},this,this.fpsNode);
			console.log("run");
		};
		var launchBall = function(){
			var startPoint,aim,tempBall;
			instance.container.addEventListener('selectstart', function(e){
				e.preventDefault();
			});
			window.addEventListener("mousedown", function(e){
				var {offsetX,offsetY}=e;
				startPoint = [offsetX, offsetY];
			});
			window.addEventListener("mousemove", function(e){
				if (!startPoint) return;
				var dx = startPoint[0]-e.offsetX;
				var dy = startPoint[1]-e.offsetY;
				var length = Math.hypot(dx,dy);
				if (length > 150) length = 150;
				if (aim) draw.deleteAim(aim);
				if (tempBall) draw.deleteBall(tempBall);

				var startX = startPoint[0]+(dx*0.4);
				var startY = startPoint[1]+(dy*0.4);
				var ballX = e.offsetX+(dx*0.2);
				var ballY = e.offsetY+(dy*0.2);

				tempBall = {
					x:ballX,y:ballY,
					r:4
				};

				aim = draw.aim(ballX, ballY, startX, startY);

				draw.balls([tempBall]);
			});
			window.addEventListener("mouseup", function(e){
				var {offsetX,offsetY}=e;
				var endPoint = [offsetX, offsetY];
				var dx = startPoint[0]-endPoint[0];
				var dy = startPoint[1]-endPoint[1];
				var length = Math.hypot(dx,dy);
				if (length > 150) length = 150;
				var sin = dx/length;
				var cos = dy/length;

				var ball = ballStamp({
					x:endPoint[0]+(dx*0.4),y:endPoint[1]+(dy*0.4),
					speed:0.3*(length/150),
					r:4,
					vec: {
						dx: sin,
						dy: cos
					}
				});

				balls.push(ball);

				draw.deleteAim(aim);
				draw.deleteBall(tempBall);
				startPoint = undefined;
			});
		};
		launchBall();
	});


export {okayStamp};