// physics.js
console.log("entering physics");

var highScore = 0;
var score = 0;

var xVel = 9;
var yVel = 3;	

var delay = 30;
var height = 0;
var Hoffset = 0;
var Woffset = 0;
var pause = true;
var interval;
var name = navigator.appName;

if(name == "Microsoft Internet Explorer") name = true;
else name = false;

var xPos = 20;
var yPos = 0;
// generate original spikes
var leftSpikes = generateSpikeArray();
var rightSpikes = generateSpikeArray();

function changePos() {

	// update score header
	var scoreheader = "Score: " + score;
	$("#score").text(scoreheader);	

	if (score >= highScore) {
		highScore = score;
		var highScoreHeader = "High Score: " + highScore;
		$("#highScore").text(highScoreHeader);	
	}

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
	yVel += 1;
	// terminal velocity
	if (Math.yVel > 8) {
		yVel = 8;
	}

	// handle direction change

	// move in y direction
	yPos += yVel;

	// change y direction
	if (yPos < 0) {
		yVel *= -1;
		score = 0;
	}

	if (yPos >= (height - Hoffset)) {
		yVel *= -1;
		yPos = (height - Hoffset);
		score = 0;
	}

	// move in x direction
	xPos += xVel;

	// change x direction
	if (xPos < 0) {
		score++;
		xVel *= -1;
		rightSpikes = generateSpikeArray();
		updateRightSpikes();
	}

	if (xPos >= (width - Woffset)) {
		score++;
		xVel *= -1;
		xPos = (width - Woffset);
		leftSpikes = generateSpikeArray();
		updateLeftSpikes();
	}
	
	if (xPos <= 50) {
		collisionDetect(yPos);
	}

}

function updateRightSpikes() {
	console.log("updating right spikes");
	for (var i = 0; i < 10; i++) {
		var spikeName = '#rightFrog' + i;
		console.log(spikeName);
		if (rightSpikes[i] == 1) {
			$(spikeName).css('background-color', 'blue');
		}
		else {
			$(spikeName).css('background-color', 'transparent');
		}			
	}
}

function collisionDetect(yPos) {
	// check each spike
	for (var i=0; i<10; i++) {
		if (Math.abs(yPos-(50*i)) <= 50 && (leftSpikes[i] == 1)) {
			console.log("collision with ", i);
		}	
	}	
}

function updateLeftSpikes() {
	console.log("updating left spikes");
	for (var i = 0; i < 10; i++) {
		var spikeName = '#leftFrog' + i;
		console.log(spikeName);
		if (leftSpikes[i] == 1) {
			$(spikeName).css('background-color', 'blue');
		}
		else {
			$(spikeName).css('background-color', 'transparent');
		}			
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

function generateSpikeArray() {
	// get number of spikes
	var numSpikes = Math.floor((Math.random() * 4) + 1);

	// assign each spike a random location
	var spikeArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	for (var i = 0; i < numSpikes; i++) {
		var foundASpot = 0;
		while (foundASpot == 0) {
			var spikeIndex = Math.floor((Math.random() * 10) + 1);

			// no spike there yet, add one to that spot
			if (spikeArr[spikeIndex] == 0) {
				spikeArr[spikeIndex] = 1;
				foundASpot = 1;
			}
		}
	}
	console.log(spikeArr);
	return spikeArr;
}

$(document).ready(function(){
		console.log("fake stuff");
		$("#big").click(function(){
			yVel = -15; 
		});
});




start();
