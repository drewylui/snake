var gridLength = 1;
var gridHeight = 1;

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
			cellID = rowNum + "," + String(i); // co-ordinates of the cell (e.g. 3,4 = 3rd row, 4th column)
			rowDiv = rowDiv + "<div class='cell' id='" + cellID + "'>" + gridObj[row][i] + "</div>"
		}

		rowDiv = rowDiv + "</div>"
		gridMarkup = gridMarkup + rowDiv; // Add row to grid
		rowNum++; // increment index, next row
	}

	$(parentDiv).append(gridMarkup);

	setHeadLocation(20,20);

}

function setHeadLocation (x,y) {
	var location = "#" + x + "," + y;
	console.log(location);
}


$(document).ready(function() {	
	gridLength = 40;
	gridHeight = 40;

	renderGrid (" ","#grid");

})