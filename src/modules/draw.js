"use strict";

const Snap = require("snapsvg");

let canvasCont, canvas;

const drawFuncs = {
	prepareIfNot({container,type,width=900,height=1600}) {
		if (!container) throw "Error1";
		if (type === "svg") {
			this.createSvgContainer(container);
		} else {
			throw "Error1";
		}
		canvasCont.setAttribute("width", (width));
		canvasCont.setAttribute("height", (height));
	},
	createSvgContainer(cont) {
		canvasCont = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		cont.appendChild(canvasCont);
		canvas = Snap(canvasCont);
	},
	deleteBall(ball) {
		if (ball.circle) ball.circle.remove();
	},
	deleteObs(obs) {
		if (obs.rect) obs.rect.remove();
		if (obs.text) obs.text.remove();
	},
	deleteAim(aim) {
		if (aim) aim.remove();
	},
	balls(balls) {
		balls.map((ball) => {
			this.deleteBall(ball);
			ball.circle = canvas.circle(ball.x, ball.y, ball.r);
			ball.circle.attr({
				fill: "red"
			});
			// ball.circle.transform("t"+ball.x+","+ball.y);
		});
	},
	aim(x1, y1, x2, y2) {
		var aim = canvas.path(`M${x1},${y1}L${x2},${y2}`);
		aim.attr({
			stroke: "gray",
			"stroke-dasharray": "5,5"
		});
		return aim;
	},
	obstacles(obstacles) {
		for (var i = 0; i < obstacles.length; i++) {
			var obstacle = obstacles[i];
			this.deleteObs(obstacle);
			obstacle.rect = canvas.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
			obstacle.rect.attr({
				fill: "blue"
			});
			var textX = (obstacle.x + obstacle.width / 2) - obstacle.hits.toString().length * 4;
			var textY = (obstacle.y + obstacle.height / 2) + 3;
			obstacle.text = canvas.text(textX, textY, obstacle.hits);
			obstacle.text.addClass("non-selectable");
			obstacle.text.attr({
				fill: "black",
				"pointer-events": "none",
			});
		}
	}
};

export default drawFuncs;