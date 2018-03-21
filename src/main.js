"use strict";

import {okayStamp} from "./modules/okayStamp";

var okay1 = okayStamp({
	container: document.getElementById('okay-wrapper'),
	fpsNode: document.getElementById('fps'),
	type: "svg",
	width: 9*50,
	height: 16*50
});
okay1.start();
console.log(okay1);




