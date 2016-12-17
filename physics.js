// physics.js
console.log("entering physics");

var highScore = 0;
var score = 0;

var xVel = 8;
var yVel = 2;	

var delay = 30;
var height = 0;
var Hoffset = 0;
var Woffset = 0;
var pause = true;
var interval;
var name = navigator.appName;

var numFrogs = 10;
var frogWidth = 25;
var frogHeight = 100;
var frogAlmostWidth = 25;

var prevPositions = [];

if(name == "Microsoft Internet Explorer") name = true;
else name = false;

var xPos = 20;
var yPos = 0;


// generate original spikes
var leftSpikes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // because starting on left
var rightSpikes = generateSpikeArray();
updateLeftSpikes();
updateRightSpikes();


function startOver() {
	// make score and high score appear
	$("#score").css('visibility', 'visible');
	$("#highScore").css('visibility', 'visible');
	
	// get rid of death menu	
	$("#deathMenu").css('visibility', 'hidden');
	$("#profile").css('visibility', 'hidden');
	
	// resurrect fly
	$("#fly").css('visibility', 'visible');

	var xVel = 6;
	var yVel = 2;	
	score = 0;
	xPos = 0; 
	yPos = 300;
	
	leftSpikes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // because starting on left
	updateLeftSpikes();

	var rightSpikes = generateSpikeArray();
	updateRightSpikes();

	// actually resume
	interval = setInterval('changePos()',delay);
	pause = true;
}



function changePos() {

	// update score header
	var scoreheader = score;
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
		//score = 0;
	}

	if (yPos >= (height - Hoffset)) {
		// friction
		yVel *= .75;
	
		yVel *= -1;
		yPos = (height - Hoffset);
		//score = 0;
	}

	// move in x direction
	xPos += xVel;

	// change x direction
	if (xPos < 0) {
		score++;
		xVel *= -1;
		$('#fly').attr("src", "fly-right.png"); 
		rightSpikes = generateSpikeArray();
		updateRightSpikes();
	}

	if (xPos >= (width - Woffset)) {
		score++;
		xVel *= -1;
		$('#fly').attr("src", "fly-left.png"); 
		xPos = (width - Woffset);
		leftSpikes = generateSpikeArray();
		updateLeftSpikes();
	}
	
	if (xPos <= 125) {
		updateLeftSpikes();
		collisionDetectAlmostLeft(yPos);
	}
	else {
		closeLeftMouths();
	}

	if (xPos >= (width - Woffset - (frogWidth+2*frogAlmostWidth))) {
		console.log("almost right val:", width - Woffset - (frogWidth+frogAlmostWidth));
		console.log("screen width: ", width);
		updateRightSpikes();
		collisionDetectAlmostRight(yPos);
	}
	else {
		closeRightMouths();
	}

	if (xPos <= 50) {
		updateLeftSpikes();
		collisionDetectLeft(yPos);
	}

	if (xPos >= (width - Woffset - frogWidth)) {
		updateRightSpikes();
		collisionDetectRight(yPos);
	}
	

	handleTrail(xPos, yPos);
}


function handleTrail(xPos, yPos) {
	// keep track of prev positions
	prevPositions.push([xPos, yPos]);		
	//console.log(prevPositions);
	if (prevPositions.length >= 50) {
		prevPositions.shift(); // aka pop first element
	}

	for (var i=0; i<prevPositions.length/3; i++) {
		var trailName = 'trail' + i;
		//console.log("trailName", trailName);
		document.getElementById(trailName).style.top = prevPositions[i*3][1] + window.pageYOffset;
		document.getElementById(trailName).style.left = prevPositions[i*3][0] + window.pageXOffset;
	}
}


function handleCollision() {
	console.log("COLLISION");
	
	//$("#collision").css('visibility', 'visible');	
	$("#deathScore").text("Score: " + score);
	$("#deathMenu").css('visibility', 'visible');
	$("#menuContent").css("visibility", 'visible');	
	$("#score").css('visibility', 'hidden');
	$("#scoreBox").css('visibility', 'hidden');
	$("#highScore").css('visibility', 'hidden');

	// pause game
	clearInterval(interval);
	pause = false;

	score = 0;
}

function handleAlmostCollision() {
	//console.log("almost collision...");
}



function closeRightMouths() {
	for (var i=0; i<numFrogs; i++) {
		if (rightSpikes[i] == 1) {
			var frogName = '#rightFrogImg' + i;
			$(frogName).css('width', '140px');
			$(frogName).css('background-image', 'url(frogTransClosed-right.png)');
		}
		else {
			var frogName = '#rightFrogImg' + i;
			$(frogName).css('background-image', 'url()');
		}
	}	
}

function closeLeftMouths() {
	for (var i=0; i<numFrogs; i++) {
		if (leftSpikes[i] == 1) {
			var frogName = '#leftFrogImg' + i;
			$(frogName).css('background-image', 'url(frogTransClosed-left.png)');
		}
		else {
			var frogName = '#leftFrogImg' + i;
			$(frogName).css('background-image', 'url()');
		}
	}	
}




function collisionDetectAlmostRight(yPos) {
	// check each spike
	/*
	for (var i=0; i<numFrogs; i++) {
		var almostSpikeName = '#rightFrogAlmost' + i;
		if (Math.abs(yPos-(frogHeight*i + frogHeight/2)) <= 150 && (rightSpikes[i] == 1)) {
			handleAlmostCollision();
			$(almostSpikeName).css('background-color', 'red');
		}	
		else {
			$(almostSpikeName).css('background-color', 'transparent');
		}	
	}
	*/	

	for (var i=0; i<numFrogs; i++) {
		var frogImg = '#rightFrogImg' + i;
		if (Math.abs(yPos-(frogHeight*i + frogHeight/2)) <= 150 && (rightSpikes[i] == 1)) {
			$(frogImg).css('width', '225px');
			$(frogImg).css('background-image', 'url(./frogTransOpen3-right.png)');
			$(frogImg).css('background-size', 'contain');
			$(frogImg).css('background-repeat', 'no-repeat');
			handleAlmostCollision();
		}	
		else if (rightSpikes[i] == 1){
			$(frogImg).css('width', '140px');
			$(frogImg).css('background-image', 'url(./frogTransClosed-right.png)');
			$(frogImg).css('background-size', 'contain');
			$(frogImg).css('background-repeat', 'no-repeat');
		}	
		else {
			$(frogImg).css('background-image', 'url()');
		}	
	}
}

function collisionDetectAlmostLeft(yPos) {
	// check each spike
	for (var i=0; i<numFrogs; i++) {
		var frogImg = '#leftFrogImg' + i;
		if (Math.abs(yPos-(frogHeight*i + frogHeight/2)) <= 150 && (leftSpikes[i] == 1)) {
			$(frogImg).css('background-image', 'url(./frogTransOpen3-left.png)');
			$(frogImg).css('background-size', 'contain');
			$(frogImg).css('background-repeat', 'no-repeat');
			handleAlmostCollision();
		}	
		else if (leftSpikes[i] == 1){
			$(frogImg).css('background-image', 'url(./frogTransClosed-left.png)');
			$(frogImg).css('background-size', 'contain');
			$(frogImg).css('background-repeat', 'no-repeat');
		}	
		else {
			$(frogImg).css('background-image', 'url()');
		}	
	}	
}

function collisionDetectRight(yPos) {
	// check each spike
	for (var i=0; i<numFrogs; i++) {
		console.log("yPos:", yPos, "compared to ", frogHeight*i + frogHeight/2);
		if ((Math.abs(yPos-(frogHeight*i + frogHeight/2)) <= frogHeight/2) && (rightSpikes[i] == 1)) {
			handleCollision();
			var frogImg = '#rightFrogImg' + i;
			$("#fly").css('visibility', 'hidden');
			$(frogImg).css('background-image', 'url(./flyEatenRight.png)');
			console.log("right collision with ", i);
		}	
	}	
}

function collisionDetectLeft(yPos) {
	// check each spike
	for (var i=0; i<numFrogs; i++) {
		console.log("yPos:", yPos, "compared to ", ((frogHeight*i + frogHeight/2)));
		if ((Math.abs(yPos-(frogHeight*i + frogHeight/2)) <= frogHeight/2) && (leftSpikes[i] == 1)) {
			handleCollision();
			var frogImg = '#leftFrogImg' + i;
			$("#fly").css('visibility', 'hidden');
			$(frogImg).css('background-image', 'url(./flyEatenLeft.png)');
			console.log("left collision with ", i);
		}	
	}	
}

function updateRightSpikes() {
	//console.log("updating right spikes");
	for (var i = 0; i < numFrogs; i++) {
		var spikeName = '#rightFrog' + i;
		var frogImg = '#rightFrogImg' + i;
		if (rightSpikes[i] == 1) {
			$(frogImg).css('width', '140px');
			$(frogImg).css('background-image', 'url(./frogTransClosed-right.png)');
			$(frogImg).css('background-size', 'contain');
			$(frogImg).css('background-repeat', 'no-repeat');
			//$(spikeName).css('background-color', '#244224');
			$(spikeName).css('background-color', 'transparent');
		}
		else {
			$(frogImg).css('background-image', 'url()');
			$(spikeName).css('background-color', 'transparent');
		}			
	}
}

function updateLeftSpikes() {
	//console.log("updating left spikes");
	for (var i = 0; i < numFrogs; i++) {
		var spikeName = '#leftFrog' + i;
		var frogImg = '#leftFrogImg' + i;
		if (leftSpikes[i] == 1) {
			$(frogImg).css('background-image', 'url(./frogTransClosed-left.png)');
			$(frogImg).css('background-size', 'contain');
			$(frogImg).css('background-repeat', 'no-repeat');
			//$(spikeName).css('background-color', '#244224');
			$(spikeName).css('background-color', 'transparent');
		}
		else {
			$(frogImg).css('background-image', 'url()');
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
			var spikeIndex = Math.floor((Math.random() * numFrogs) + 1);

			// no spike there yet, add one to that spot
			if (spikeArr[spikeIndex] == 0) {
				spikeArr[spikeIndex] = 1;
				foundASpot = 1;
			}
		}
	}
	return spikeArr;
}

$(document).ready(function(){

		// start game for first time
		$("#startGame").click(function() {	
			start();
			$("#startMenu").css("visibility", "hidden");	
			$("#titlePage").css("visibility", "hidden");	
			$("#scoreBox").css('visibility', 'visible');
			console.log('started game');
		});

		// start over
		$("#replay").click(function() {	
			startOver();
			$("#menuContent").css("visibility", "hidden");	
			$("#scoreBox").css('visibility', 'visible');
			console.log('started over');
		});

		$("#about").click(function() {	
			$("#profile").css("visibility", "visible");	
			$("#menuContent").css("visibility", "hidden");	
		});
		
		$("#backButton").click(function() {	
			$("#profile").css("visibility", "hidden");	
			$("#menuContent").css("visibility", "visible");	
		});

		// jump
		$("#big").click(function(){
			yVel = -20; 
		});
});




