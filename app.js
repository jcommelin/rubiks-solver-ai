// 1) CUBE OBJECT WITH ALLOWED MOVES
//// how to define the cube data?
//// cube > face > cell?
//// {-1, 1}x[3x3] x {-1, 1}x[3x3] x {-1, 1}x[3x3] = cells
////
// 2) cmds for moves
// 3) scramble
// 4) Win condition


// FACE OF THE CUBE LAYOUT

//      _____________
//      |1/1|1/2|1/3|
//      _____________
//      |2/1|2/2|2/3|
//      _____________
//      |3/1|3/2|3/3|
//      _____________
//

// CUBE LAYOUT ??

// 1/1 -> 1/3, 1/3 -> 3/3, 3/3 -> 3/1, 3/1 -> 1/1
// 1/2 -> 2/3, 2/3 -> 3/2, 3/2 -> 2/1, 2/1 -> 1/2

////////////////////////////// AUXILIARY FUNCTIONS

matrixRotation90 = {'1/1': '1/3', '1/3' : '3/3', '3/3' : '3/1', '3/1' : '1/1',
'1/2' : '2/3', '2/3' : '3/2', '3/2' : '2/1', '2/1' : '1/2' };

const makeCellId = function(num1, num2) {
  return 'cell-' + num1.toString() + '/' + num2.toString();
};

const sequence = function (start, finish, jump) {
  var iter = 1;
  var ret = {};
  var current = start;

  while (current < finish) {
    ret[iter] = current;
    iter += 1;
    current += jump;
  };

  return ret;
};

////////////////////////////// Objects

function Cell (id, state) {
  this.id = id;
  this.state = state;

  this.getId = function () {
    return this.id;
  };

  this.getState = function () {
    return this.state;
  };

  this.setState = function (newState) {
    this.state = newState;
  };


}

function Face (id, cells) {
  this.cells = cells;

  this.addCell = function (id, state) {
    this.cells.push(new Cell(id, state))
  };

  this.getCell = function (id) {
    return this.cells.find(cell => cell.id === id );
  };

  this.fill = function (state) {
    for (number1 in sequence(1, 4, 1)) {
      for (number2 in sequence(1, 4, 1)) {
          this.addCell("cell-" + number1.toString() +
          "/" + number2.toString(), state);
      }
    };
  };
}

function Edge (faces, cells) {
  this.faces = faces;
  this.cells = cells;

  this.addFace = function (face) {
    this.faces.push(face);
  };

  this.getFace = function (id) {
    return this.faces.find(face => face.id === id );
  };

  this.getCell = function (id) {
    return this.cells.find(cell => cell.id === id );
  };

}

function Transformation (id, face, orientation) {
  this.id = id;
  this.face = face;
  this.orientation = orientation;


  this.getCells = function () {
    this.cells1 = this.face.cells;
    console.log(this.cells1);
  };

  this.changeCellStates = function () {

  };

  this.addCube = function () {
    this.cube = theCube;
  }

}

function Vertex (id, edges) {

}

function Cube (faces, edges) {

}



// var testCell = new Cell("cell-1", "a");
var rightFace = new Face("face-r", []);
var frontFace = new Face("face-f", []);

var cells = []
// for (i in sequence(1, 4, 1)) {
//   var letter = i.toString();
//   console.log('cell-' + letter + '|' + '1' === testFace.cells[6].id);
//   cells.push(testFace.getCell('cell-' + letter + '|' + '1'));
//   console.log(cells);
// };

rightFace.fill("red");
frontFace.fill("blue");

cells.push(rightFace.getCell('cell-1/1'));
cells.push(rightFace.getCell('cell-2/1'));
cells.push(rightFace.getCell('cell-3/1'));
cells.push(frontFace.getCell('cell-1/3'));
cells.push(frontFace.getCell('cell-2/3'));
cells.push(frontFace.getCell('cell-3/3'));

var testEdge = new Edge([rightFace, frontFace], cells)

var testTransform = new Transformation('test', rightFace, '+');
testTransform.getCells();
console.log(testTransform.cells1[3].state);
rightFace.cells[3].setState('blue');
console.log(testTransform.cells1[3].state);
