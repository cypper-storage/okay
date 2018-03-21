"use strict";

import draw from "./draw";
import util from "../utils";
import {ballStamp} from "./modelsStamps";

const aimOffsetX = 0.4;
const aimOffsetY = 0.4;
const setEvent = (cb=()=>{})=>{
	let sPoint,aim,tempBall;

	window.addEventListener("mousedown", function({offsetX:oX,offsetY:oY}){
		sPoint = new util.Point(oX, oY);
	});

	window.addEventListener("mousemove", function({offsetX:oX,offsetY:oY}){
		if (!sPoint) return;
		const dx = sPoint.x-oX;
		const dy = sPoint.y-oY;
		let length = Math.hypot(dx,dy);
		if (length > 150) length = 150;
		if (aim) draw.deleteAim(aim);
		if (tempBall) draw.deleteBalls([tempBall]);

		const startX = sPoint.x+(dx*0.4);
		const startY = sPoint.y+(dy*0.4);
		const ballX = oX+(dx*aimOffsetX);
		const ballY = oY+(dy*aimOffsetY);

		tempBall = ballStamp({
			coord: new util.Point(ballX, ballY),
			r:4
		});

		aim = draw.aim(ballX, ballY, startX, startY);

		draw.balls([tempBall]);
	});

	window.addEventListener("mouseup", function({offsetX:oX,offsetY:oY}){
		const ePoint = new util.Point(oX, oY);
		const dx = sPoint.x-ePoint.x;
		const dy = sPoint.y-ePoint.y;
		const length = Math.hypot(dx,dy);
		const sin = dx/length;
		const cos = dy/length;

		const ball = ballStamp({
			coord: new util.Point(ePoint.x+(dx*aimOffsetX), ePoint.y+(dy*aimOffsetY)),
			speed:0.3*(length/150),
			r:4,
			vec: {
				dx: sin,
				dy: cos
			}
		});

		cb(ball);

		draw.deleteAim(aim);
		draw.deleteBalls([tempBall]);
		sPoint = undefined;
	});
};


const launchBall = function({container},cb){
	container.addEventListener('selectstart', function(e){
		e.preventDefault();
	});
	
	setEvent(cb);
};

export default launchBall;