"use strict";

const utils = {
	inBtw: function(min,max,val) {
		return min < val && max > val;
	}
};

export default utils;