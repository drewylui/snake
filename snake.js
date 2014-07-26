var gridLength = 1;
var gridHeight = 1;
var snakeObj = {
	"startPos": [20,20],
	"currPos": [20,20],
	"direction": "r"
};
var food = [0,0];
var keyCodes = {
	"37": "l",
	"38": "u",
	"39": "r",
	"40": "d"
}


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
	food[0] = Math.floor(Math.random()*39);
	food[1] = Math.floor(Math.random()*39);
	setLocation(food,"X");
	console.log(food);

}


// moves the snake in the current direction, until it moves off the end of the board
var counter = 0;
function move () {

	setTimeout(function(){
		if ((snakeObj.currPos[0]>=0) && (snakeObj.currPos[0]<=39) && (snakeObj.currPos[1]>=0) && (snakeObj.currPos[1]<=39)) {
			setLocation(snakeObj.currPos," ");

			if (snakeObj.direction === "l") {
				snakeObj.currPos[1]--;
			}
			else if (snakeObj.direction === "u") {
				snakeObj.currPos[0]--;
			}
			else if (snakeObj.direction === "r") {
				snakeObj.currPos[1]++;
			}
			else if (snakeObj.direction === "d") {
				snakeObj.currPos[0]++;
			}	
			else {
				console.log("Unrecognised direction")
			}

			setLocation(snakeObj.currPos,"O");

			if ((snakeObj.currPos[0] === food[0]) && (snakeObj.currPos[1] === food[1])) {
				console.log("nomnomnon");
			}

			move(); // loop
		}
		else {
			alert("GAME OVER");
		}
	}, 200)

}

// draw character at specified location (array)

function setLocation (location, character) {
	var locationID = "#" + location[0] + "x" + location[1];
	$(locationID).text(character);				
}

$(document).ready(function() {	
	gridLength = 40;
	gridHeight = 40;

	renderGrid (" ","#grid");

	$("html").on('keydown',function(event) {
		// if arrow keys are pressed, change snake's direction		
		if ((event.keyCode===37) || (event.keyCode===38) || (event.keyCode===39) || (event.keyCode===40))  {	
			snakeObj.direction = keyCodes[event.keyCode];
			console.log(snakeObj.direction);
			console.log(snakeObj.currPos);
			return false;
		}
		else if (event.keyCode===13) {
			console.log("go");
			move();						
		}
		else {
			console.log("Invalid input");
		}		
	})

})