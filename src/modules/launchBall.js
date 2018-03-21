"use strict";

import draw from "./draw";
import update from "./update";
import {ballStamp} from "./modelsStamps";

const setEvent = (cb=()=>{})=>{
	let startPoint,aim,tempBall;

	window.addEventListener("mousedown", function(e){
		const {offsetX,offsetY}=e;
		startPoint = [offsetX, offsetY];
	});

	window.addEventListener("mousemove", function(e){
		if (!startPoint) return;
		const dx = startPoint[0]-e.offsetX;
		const dy = startPoint[1]-e.offsetY;
		let length = Math.hypot(dx,dy);
		if (length > 150) length = 150;
		if (aim) draw.deleteAim(aim);
		if (tempBall) draw.deleteBall(tempBall);

		const startX = startPoint[0]+(dx*0.4);
		const startY = startPoint[1]+(dy*0.4);
		const ballX = e.offsetX+(dx*0.2);
		const ballY = e.offsetY+(dy*0.2);

		tempBall = {
			x:ballX,y:ballY,
			r:4
		};

		aim = draw.aim(ballX, ballY, startX, startY);

		draw.balls([tempBall]);
	});

	window.addEventListener("mouseup", function(e){
		const {offsetX,offsetY}=e;
		const endPoint = [offsetX, offsetY];
		const dx = startPoint[0]-endPoint[0];
		const dy = startPoint[1]-endPoint[1];
		let length = Math.hypot(dx,dy);
		if (length > 150) length = 150;
		const sin = dx/length;
		const cos = dy/length;

		const ball = ballStamp({
			x:endPoint[0]+(dx*0.4),y:endPoint[1]+(dy*0.4),
			speed:0.3*(length/150),
			r:4,
			vec: {
				dx: sin,
				dy: cos
			}
		});

		cb(ball);

		draw.deleteAim(aim);
		draw.deleteBall(tempBall);
		startPoint = undefined;
	});
}


const launchBall = function({container},cb){
	container.addEventListener('selectstart', function(e){
		e.preventDefault();
	});
	
	setEvent(cb);
};

export default launchBall