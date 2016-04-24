//Constructor
var DFA = function(options) {
  this.data = {nodes: [], edges: []};
  this.options = options;
};

//Set the data of the dfa (states and edges)
DFA.prototype.setData = function(data1) {
  this.data = data1;
};

//insert an edge to the dfa
DFA.prototype.insertEdge = function(fromObj, toObj, labelObj) {
  this.data.edges.push({
    from: fromObj,
    to: toObj,
    label: labelObj
  });
};

//insert a state to the dfa
DFA.prototype.insertNode = function(shapeObj, idObj, labelObj, colorObj) {
  this.data.nodes.push({
    shape: shapeObj,
    id: idObj,
    label: labelObj,
    color: {
      background: colorObj,
      border: colorObj
    }
  });
};
