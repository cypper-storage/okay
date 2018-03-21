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
	deleteBalls(balls) {
		balls.map(ball=>{
			if (ball.circle) ball.circle.remove();
		});
	},
	deleteObs(obs) {
		obs.map(ob=>{
			if (ob.rect) ob.rect.remove();
			if (ob.text) ob.text.remove();
		});
	},
	deleteAim(aim) {
		if (aim) aim.remove();
	},
	balls(balls) {
		balls.map((ball) => {
			this.deleteBalls([ball]);
			ball.circle = canvas.circle(...ball.coord.arr(), ball.r);
			ball.circle.attr({
				fill: "red"
			});
			// ball.circle.transform("t"+ball.x+","+ball.y);
		});
	},
	aim(x1, y1, x2, y2) {
		const aim = canvas.path(`M${x1},${y1}L${x2},${y2}`);
		aim.attr({
			stroke: "gray",
			"stroke-dasharray": "5,5"
		});
		return aim;
	},
	obstacles(obstacles) {
		for (let i = 0; i < obstacles.length; i++) {
			const ob = obstacles[i];
			this.deleteObs([ob]);
			ob.rect = canvas.rect(...ob.coord.arr(), ob.width, ob.height);
			ob.rect.attr({
				fill: "blue"
			});
			const textX = (ob.coord.x + ob.width / 2) - ob.hits.toString().length * 4;
			const textY = (ob.coord.y + ob.height / 2) + 3;
			ob.text = canvas.text(textX, textY, ob.hits);
			ob.text.addClass("non-selectable");
			ob.text.attr({
				fill: "black",
				"pointer-events": "none",
			});
		}
	}
};

export default drawFuncs;