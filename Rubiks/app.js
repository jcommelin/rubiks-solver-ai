// 1) CUBE OBJECT WITH ALLOWED MOVES
//// how to define the cube data?
//// cube > face > cell?
//// {-1, 1}x[3x3] x {-1, 1}x[3x3] x {-1, 1}x[3x3] = cells
////
// 2) cmds for moves
// 3) scramble
// 4) Win condition


// Many 3×3×3 Rubik's Cube enthusiasts use a notation developed by David
 // Singmaster to denote a sequence of moves, referred to as "Singmaster
 // notation".[53] Its relative nature allows algorithms to be written in
 // such a way that they can be applied regardless of which side is
 // designated the top or how the colours are organised on a particular cube.
//     F (Front): the side currently facing the solver
//     B (Back): the side opposite the front
//     U (Up): the side above or on top of the front side
//     D (Down): the side opposite the top, underneath the Cube
//     L (Left): the side directly to the left of the front
//     R (Right): the side directly to the right of the front
//     f (Front two layers): the side facing the solver and the corresponding middle layer
//     b (Back two layers): the side opposite the front and the corresponding middle layer
//     u (Up two layers): the top side and the corresponding middle layer
//     d (Down two layers): the bottom layer and the corresponding middle layer
//     l (Left two layers): the side to the left of the front and the corresponding middle layer
//     r (Right two layers): the side to the right of the front and the corresponding middle layer
//     x (rotate): rotate the entire Cube on R
//     y (rotate): rotate the entire Cube on U
//     z (rotate): rotate the entire Cube on F
// When a prime symbol ( ′ ) follows a letter, it denotes an anticlockwise
 // face turn; while a letter without a prime symbol denotes a clockwise turn.
 // These directions are as one is looking at the specified face. A letter
 // followed by a 2 (occasionally a superscript 2) denotes two turns, or a
 // 180-degree turn. R is right side clockwise, but R′ is right side
 // anticlockwise. The letters x, y, and z are used to indicate that the
 // entire Cube should be turned about one of its axes, corresponding to R,
 //  U, and F turns respectively. When x, y, or z are primed, it is an
 //  indication that the cube must be rotated in the opposite direction.
 //  When they are squared, the cube must be rotated 180 degrees.




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

const matrixRotation90 = {'1/1': '1/3', '1/3' : '3/3', '3/3' : '3/1', '3/1' : '1/1',
'1/2' : '2/3', '2/3' : '3/2', '3/2' : '2/1', '2/1' : '1/2' };

const selectedRotation = {
  'f':'ltrd',
  'l':'btfd',
  'b':'rtld',
  'r':'ftbd',
  't':'lbrf',
  'd':'lfrb',
};

const edgeIds = {
  1:'fl',
  2:'ft',
  3:'fr',
  4:'fd',
  5:'lt',
  6:'tr',
  7:'rd',
  8:'dl',
  9:'lb',
  10:'tb',
  11:'rb',
  12:'db'
}

const faceIds = {
  1:'f',
  2:'l',
  3:'t',
  4:'r',
  5:'d',
  6:'b',
};

const makeEdgeId = function (number, faceId) {
  return "edge-" + faceId + selectedRotation[faceId][number];
};

const makeEdge = function (edgeId) {
  var faces = [theCube.getFace('face-' + edgeId[5]),
  theCube.getFace('face-' + edgeId[6])];
  return new Edge(edgeId, faces);
};

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
  this.id = id;
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

  this.addCube = function (cube) {
    this.cube = cube;
  };
}

function Edge (id, faces) {
  this.id = id;
  this.faces = faces;
  // this.cells = cells;

  this.addFace = function (face) {
    this.faces.push(face);
  };

  this.makeFaceIds = function () {
    var ret = [];
    for (face of this.faces) {
      ret.push(face.id);
    };
    this.faceIds = ret;
  };

  this.getFace = function (id) {
    if ( this.faceIds.includes(id) ) {
      return this.faces.find(face => face.id === id );
    } else {
      return 'no such face';
    };
  };

  this.getCell = function (id) {
    return this.cells.find(cell => cell.id === id );
  };

  this.getOtherFace = function (faceId) {
    if (this.faces[0].id === faceId) {
      return this.faces[1];
    } else {
      return this.faces[0];
    };
  };

  this.makeFaceIds();
}

function Transformation (id, face, orientation) {
  this.id = id;
  this.face = face;
  this.orientation = orientation;
  // this.cube = cube;

  this.getCells = function () {
    this.faceCells = this.face.cells;
    this.otherCells = [];
    for (edge of this.cube.getIncidentEdges(this.face.id)) {
      this.otherCells.push(edge.getOtherFace(this.face.id));
    };
  };

  this.rotateCells = function (number) {
    var adjFaces = this.cube.getAdjFaces(this.face.id);
    var cellId = 'cell-3/' + number.toString();
    var tempStates = [];
    for (face of adjFaces) {
      tempStates.push(face.getCell(cellId).state);
      // console.log(face.getCell('cell-3/1').state);
    };
    tempStates.push(adjFaces[0].getCell(cellId).state)
    // while/
    console.log(tempStates);
  };

  this.changeCellStates = function () {

  };

  this.addCube = function () {
    this.cube = theCube;
  }

}

function Cube (faces, edges) {
  this.faces = faces;
  this.edges = edges;
  this.faceIds = ['face-f', 'face-l', 'face-t', 'face-r', 'face-d', 'face-b'];

  this.makeEdges = function () {
    for (key in edgeIds) {
      this.edges.push(new Edge('edge-' + edgeIds[key],
      [this.getFace('face-' + edgeIds[key][0]), this.getFace('face-' + edgeIds[key][1])]));
    };
  };

  this.makeTransforms = function () {

  };

  this.getIncidentEdges = function (faceId) {
    var ret = [];
    for (edge of this.edges) {
      if (edge.faceIds.includes(faceId) ) {
        ret.push(edge);
      }
    };
    return ret;
  };

  this.findIncidentFaces = function (edgeId) {
    // test
    return this.edges.find( edge => edge.id === edgeId).faces
  };

  this.getFace = function (id) {
    if ( this.faceIds.includes(id) ) {
      return this.faces.find(face => face.id === id );
    } else {
      return 'no such face';
    };
  };

  this.getAdjFaces = function (faceId) {
    var adjFaces = [];
    for (edge of this.edges) {
      // console.log(edge);
      if (edge.faceIds.includes(faceId)) {
        // console.log(edge);
        adjFaces.push(edge.getOtherFace(faceId));
        };
    };
    return adjFaces;
  };

}

////////////////////////////////INITFACES
const frontFace = new Face("face-f", []);
frontFace.fill('red');
const leftFace = new Face("face-l", []);
leftFace.fill('blue');
const topFace = new Face("face-t", []);
topFace.fill('yellow');
const rightFace = new Face("face-r", []);
rightFace.fill('white');
const downFace = new Face("face-d", []);
downFace.fill('orange');
const backFace = new Face("face-b", []);
backFace.fill('green');

// for (i in sequence(1, 4, 1)) {
//   var letter = i.toString();
//   console.log('cell-' + letter + '|' + '1' === testFace.cells[6].id);
//   cells.push(testFace.getCell('cell-' + letter + '|' + '1'));
//   console.log(cells);
// };

///////////// INIT
var theCube = new Cube ( [frontFace, leftFace, topFace, rightFace, downFace, backFace], [] );
theCube.makeEdges();

var testTransform = new Transformation('test', rightFace, '+', theCube);
var frontWTransform = new Transformation('R', frontFace, '+');
frontWTransform.addCube();

rightFace.addCube(theCube);
frontFace.addCube(theCube);

// console.log(testTransform.rotateCells(2));
// console.log(theCube.getIncidentEdges('face-r'));

frontWTransform.rotateCells('1');
