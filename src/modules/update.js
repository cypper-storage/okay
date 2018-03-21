"use strict";

import util from "../utils";
import draw from "./draw";

var updFuncs = {
	updateAll(balls, obs, opt) {
		this.updateBalls(balls, opt);
		this.updateObs(obs);
	},
	updateObs(obs) {
		obs.map(function (ob, i, obj) {
			// console.log(ob.hits);
			if (ob.hits <= 0) {
				obj.splice(i, 1);
				draw.deleteObs(ob);
			}
		});
	},
	updateBalls(balls,{width,height}) {
		balls.map(function (ball, i, obj) {
			if (!util.inBtw(0, width, ball.x) || !util.inBtw(0, height, ball.y)) {
				obj.splice(i, 1);
				draw.deleteBall(ball);
			}
		});
	},
	ballWithObstacles(balls, obstacles) {
		balls.map(function (ball) {
			obstacles.forEach(function (ob, i, object) {
				if (util.inBtw(ob.x, ob.x + ob.width, ball.x) && util.inBtw(ob.y, ob.y + ob.height, ball.y)) {
					if (util.inBtw(ob.y, ob.y + ob.height, ball.prev.y)) ball.vec.dx = -ball.vec.dx;
					else ball.vec.dy = -ball.vec.dy;
					ob.hitted();
					draw.obstacles([ob]);
				}
			});
		});
	}
};

export default updFuncs;