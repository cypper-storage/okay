"use strict";

const stampit = require("stampit");
const Stats = require("stats.js");

const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const initStats = function(fpsNode){
	const stats = new Stats();

	stats.dom.style.position = "static";
	[...stats.dom.children].map((el,i)=>{
		if (i === 2) return;
		el.style.display = "inline-block";
	})
	fpsNode.appendChild(stats.dom);
	return stats;
}

const itteratorStamp = stampit().init(function(_,{args}){
	const [fps=60,itteree,context,fpsNode] = args;
	const stats = initStats(fpsNode);
	const spf = 1000/fps;

	let frame = 0;
	let start = Date.now();
	let realFPS = 0;

	function step(timestamp) {
		stats.begin();
		let delta = Date.now() - start;
		if (delta > spf) {
			start = Date.now();
			realFPS = (realFPS+(1000/delta))/2;
			itteree.call(context,delta,realFPS);
			stats.end();
			requestAnimationFrame(step);
		} else {
			setTimeout(function(){
				step(timestamp);
			},spf-delta);
		}
		frame++;
	}
	step(Date.now());
});

export {itteratorStamp};