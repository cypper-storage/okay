"use strict";

import util from "../utils";
import draw from "./draw";

var updFuncs = {
	updateAll(balls, obs, delta, opt) {
		this.updateBalls(balls, delta, opt);
		this.ballWithObstacles(balls, obs);
		this.updateObs(obs);
	},
	updateObs(obs) {
		obs.map(function (ob, i, obj) {
			if (ob.hits <= 0) {
				obj.splice(i, 1);
				draw.deleteObs([ob]);
			}
		});
	},
	updateBalls(balls, delta, {width,height}) {
		balls.map(function (ball, i, obj) {
			if (ball.speed <= 0.005 || !util.inArea(ball.coord,{
				x1: 0, x2: width,
				y1: 0, y2: height
			})) {
				obj.splice(i, 1);
				draw.deleteBalls([ball]);
			} else {
				ball.ballupdate(delta);
			}
		});
	},
	ballInObstacle(ball,ob) {
		if (ob.name() === "section") {
			return (util.circleHitSection(ball,ob.coord,ob.coord2));
		} else if (ob.name() === "rect") {
			return (util.circleHitArea(ball,{
				x1: ob.coord.x,
				x2: ob.coord.x + ob.width,
				y1: ob.coord.y,
				y2: ob.coord.y + ob.height,
			}));
		}
	},
	ballInObstacles(ball,obs) {
		return obs.some((ob) => {
			if (this.ballInObstacle(ball,ob) !== null) return true;
			else return false;
		});
	},
	ballWithObstacles(balls, obs) {
		balls.map((ball) => {
			for(const ob of obs) {
				const newVec = this.ballInObstacle(ball,ob);
				if (newVec !== null) {
					// if (util.inBtw(ob.coord.y, ob.coord.y + ob.height, ball.pCoord.y)) ball.vec.dx = -ball.vec.dx;
					// else ball.vec.dy = -ball.vec.dy;
					ball.vec = newVec;
					ob.hitted();
					draw.obstacles([ob]);
					break;
				}
			}
		});
	}
};

export default updFuncs;