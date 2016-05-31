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

//insert a state to the dfa
DFA.prototype.clone = function(dfa) {
  for (var i = 0; i < dfa.data.nodes.length; i++) {
    var node = dfa.data.nodes[i];
    this.insertNode(node.shape, node.id, node.label, node.color.background);
  }

  for (var i = 0; i < dfa.data.edges.length; i++) {
    var edge = dfa.data.edges[i];
    this.insertNode(edge.from, edge.to, edge.label);
  }
};
