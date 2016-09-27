// physics.js

var step = 6;
var delay = 30;
var height = 0;
var Hoffset = 0;
var Woffset = 0;
var ypos = 0;
var xpos = 0;
var pause = true;
var interval;
var name = navigator.appName;

if(name == "Microsoft Internet Explorer") name = true;
else name = false;

var xPos = 20;

if(name) var yPos = document.body.clientHeight;
else var yPos = window.innerHeight;

function changePos() {
	if(name) {
		width = document.body.clientWidth;
		height = document.body.clientHeight;
		Hoffset = img.offsetHeight;
		Woffset = img.offsetWidth;
		img.style.left = xPos + document.body.scrollLeft;
		img.style.top = yPos + document.body.scrollTop;
	}
	else {
		height = window.innerHeight;
		width = window.innerWidth;
		Hoffset =33;
		Woffset =30;
		document.getElementById('img').style.top = yPos + window.pageYOffset;
		document.getElementById('img').style.left = xPos + window.pageXOffset;
	}

 	// handle gravity
	var xvel;
	var yvel;	

	// handle direction change

	// move in y direction
	if (ypos) {
		yPos = yPos + step;
	}
	else {
		yPos = yPos - step;
	}

	// change y direction
	if (yPos < 0) {
		ypos = 1;
		yPos = 0;
	}

	if (yPos >= (height - Hoffset)) {
		ypos = 0;
		yPos = (height - Hoffset);
	}

	// move in x direction
	if (xpos) {
		xPos = xPos + step;
	}
	else {
		xPos = xPos - step;
	}

	if (xPos < 0) {
		xpos = 1;
		xPos = 0;
	}

	if (xPos >= (width - Woffset)) {
		xpos = 0;
		xPos = (width - Woffset);
	}
}

function start() {
	document.getElementById('img').style.visibility = "visible";
	interval = setInterval('changePos()',delay);
}

function pauseResume() {
	if(pause) {
		clearInterval(interval);
		pause = false;
	}
	else {
		interval = setInterval('changePos()',delay);
		pause = true;
	}
}
start();
