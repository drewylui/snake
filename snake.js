var gridLength = 1;
var gridHeight = 1;
var snakeObj = {
	"startPos": [20,20],
	"body": [[20,20]],
	"direction": "r"
};
var food = [0,0];
var keyCodes = {
	"37": "l",
	"38": "u",
	"39": "r",
	"40": "d"
}
var speed = 200;
var timeoutId;
var score = 0;
var foodPoints = 10;
var gameOver = false;


/* Builds a grid object of strings based on the input string, length and height parameters passed to it
	gridObj = {
		row1: ["string", "string", "string"]
		row2: {}
	}
*/
function buildGrid (inputString) {
	var gridObj = {};
	var gridRow = [];
	var rowKey = "";

	// build the row
	for (i=0; i<gridLength; i++) {
		gridRow.push(inputString);
	}	

	// build grid of rows
	for (i=0; i<gridHeight; i++) {
		rowKey = "row" + i;
		gridObj[rowKey] = gridRow;
	}

	return gridObj;
}

// Creates a grid of divs on the page, based on a JS object. Appends it to the parent div specified.
function renderGrid (inputString, parentDiv) {
	var gridMarkup = "";
	var rowDiv = "";
	var rowNum = 0;
	var cellID = ""; 

	gridObj = buildGrid (inputString); // build a JS object with grid data

	for (var row in gridObj) {		
		rowDiv = "<div class='row'>"
		for (i=0; i<gridObj[row].length; i++) {
			cellID = rowNum + "x" + String(i); // co-ordinates of the cell (e.g. 3,4 = 3rd row, 4th column)
			rowDiv = rowDiv + "<div class='cell' id='" + cellID + "'>" + gridObj[row][i] + "</div>"
		}

		rowDiv = rowDiv + "</div>"
		gridMarkup = gridMarkup + rowDiv; // Add row to grid
		rowNum++; // increment index, next row
	}

	$(parentDiv).append(gridMarkup);

	setLocation(snakeObj.startPos, "O");
	placeFood();
}

function placeFood() {
	food[0] = Math.floor(Math.random()*39);
	food[1] = Math.floor(Math.random()*39);
	setLocation(food,"X");
}

// moves the snake in the current direction, until it moves off the end of the board
function move () {

	timeoutId = setTimeout(function(){
		console.log("snake: " + snakeObj.body[0][0] + "," + snakeObj.body[0][1]);
		// proceed if an arrow key is pressed
		if ((snakeObj.body[0][0]>=0) && (snakeObj.body[0][0]<=39) && (snakeObj.body[0][1]>=0) && (snakeObj.body[0][1]<=39)) {		

			setLocation(snakeObj.body[snakeObj.body.length-1]," "); // erase the current position of the tail

			// move every body cell to the position of the body cell in front of it
			for (i=snakeObj.body.length-1; i>0; i--) {
				snakeObj.body[i][0] = snakeObj.body[i-1][0];	
				snakeObj.body[i][1] = snakeObj.body[i-1][1];	
			}

			// move the head to a new position
			if (snakeObj.direction === "l") {
				snakeObj.body[0][1]--;	
			}
			else if (snakeObj.direction === "u") {
				snakeObj.body[0][0]--;	

			}
			else if (snakeObj.direction === "r") {
				snakeObj.body[0][1]++;	
			}
			else if (snakeObj.direction === "d") {
				snakeObj.body[0][0]++;	
			}	
			else {
				console.log("Unrecognised direction")
			}

			// check if snake has eaten food. if so, grow the body by one.
			if ((snakeObj.body[0][0] === food[0]) && (snakeObj.body[0][1] === food[1])) {
				growSnake();
				placeFood();
				score = score + foodPoints;
				foodPoints = foodPoints + 10;
				$("#instructions").text("Score: " + score);
			}
			
			// draw the head in its new position
			setLocation(snakeObj.body[0],"O");

			// check for a collision, if no collision then keep going
			if (checkCollision() === true) {
				clearTimeout(timeoutId);
				$("#instructions").text("GAME OVER! Your final score is: " + score + ". Press Escape to start again.");
				$("#instructions").css("color","red");
				gameOver = true;
			}
			else {
				move(); // loop
			}
		}
		else {
			clearTimeout(timeoutId);
			$("#instructions").text("GAME OVER! Your final score is: " + score + ". Press Escape to start again.");
			$("#instructions").css("color","red");	
			gameOver = true;
		}

	}, speed)

}

function stopTimeout() {
	clearTimeout(timeoutId);
}

// draw character at specified location (array)
function setLocation (location, character) {
	var locationID = "#" + location[0] + "x" + location[1];
	$(locationID).text(character);			
}

// add a cell to the snake
function growSnake () {
	var bodyPosStr = "bodyPos" + String(snakeObj.body.length); // omit the startpos and direction properties
	var tail = snakeObj.body[snakeObj.body.length-1];
	var newtail = [];

	if (snakeObj.direction === "l") {
		newtail = [tail[0],tail[1]+1];
	}
	else if (snakeObj.direction === "u") {
		newtail = [tail[0]+1,tail[1]];
	}
	else if (snakeObj.direction === "r") {
		newtail = [tail[0],tail[1]-1];
	}
	else if (snakeObj.direction === "d") {
		newtail = [tail[0]-1,tail[1]];
	}
	else {
		console.log("Invalid direction");
	}
	
	snakeObj.body.push(newtail);
}

// returns true, if the snake head has hit any of the body cells
function checkCollision () { 	
	var	tail = snakeObj.body.slice(1,snakeObj.body.length); // get the body minus the head
	var tailStr = tail.join("|");
	var headStr = snakeObj.body[0].toString();

	console.log("headStr: " + headStr + " | " + "tailStr: " + tailStr);

	if (snakeObj.body.length > 1) { // only check if the snake is longer than 1 cell
		console.log("indexOf:" + tailStr.indexOf(headStr));
		if (tailStr.indexOf(headStr) === -1) {
			return false; // head not found in a body cell location
		}
		else {
			return true; // head found in a body cell location
			console.log("bingo")
		}
	}
	else {
		return false;
	}
}

// main function
$(document).ready(function() {	
	gridLength = 40;
	gridHeight = 40;

	renderGrid (" ","#grid");

	$("html").on('keydown',function(event) {
		// if arrow keys are pressed, change snake's direction, but don't let the snake change to the opposite direction	
		console.log(event.keyCode);	
		if (event.keyCode===37) { // turn left
			if (snakeObj.direction!="r") { 
				snakeObj.direction = keyCodes[event.keyCode];
			}
			return false;
		}
		else if (event.keyCode===38) { // turn up
			if (snakeObj.direction!="d") { 
				snakeObj.direction = keyCodes[event.keyCode];
			}
			return false;
		} 
		else if (event.keyCode===39) { // turn right
			if (snakeObj.direction!="l") { 
				snakeObj.direction = keyCodes[event.keyCode];
			}
			return false;
		}
		else if (event.keyCode===40)  { // turn down
			if (snakeObj.direction!="u") { 
				snakeObj.direction = keyCodes[event.keyCode];
			}
			return false;
		}		
		// press '-' or '=' to decrease/increase speed of snake
		else if (event.keyCode===187) {
			if ((speed-100) > 0) {
				speed = speed-100;
			}		
			return false;	
		}	
		else if (event.keyCode===189) {
			speed = speed+100;			
			return false;	
		}		
		// press Enter to start the snake game						
		else if (event.keyCode===13) {
			$("#instructions").text("Score: " + score);
			$("#instructions").css("font-size","18px");
			$("#instructions").css("color","black");			
			move();		
			return false;			
		}		
		// press Escape to reset the game, if it has ended
		else if (event.keyCode===27) {
			if (gameOver === true) { 
				$("#grid").empty();
				renderGrid (" ","#grid");
				snakeObj.startPos = [20,20];
				snakeObj.body = [[20,20]];
				snakeObj.direction = "r";
				score = 0;
				foodPoints = 10;
				$("#instructions").text("Score: " + score);
				$("#instructions").css("font-size","18px");
				$("#instructions").css("color","black");
				gameOver = false;
			}	
			return false;	
		}	
		else {
			console.log("Invalid input");
		}		
	})

})