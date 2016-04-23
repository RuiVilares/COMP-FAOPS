var Concatenation = function concatenation(left, right) {

  var DOTstring =  'dinetwork {'+
  'A -> B [label="0"];' +
  'A[ color=blue, shape=triangle]'+
  'B[ color=red, shape=circle]'+
  '}';
	this.left = this.parseDFA(DOTstring);


  DOTstring =  'dinetwork {'+
  'C -> D [label="1"];' +
  'C[ color=blue, shape=triangle]'+
  'D[ color=red, shape=circle]'+
  '}';
	this.right = this.parseDFA(DOTstring);
};

Concatenation.prototype.compute = function() {
	var startR = this.getInitialR();

	var nodes = this.left.data.nodes;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].color != null && nodes[i].color.background == "red") {
			this.left.data.nodes[i].color.background = "blue";
			this.left.data.edges.push(this.createEdge(this.left.data.nodes[i].label, startR, "$"));
		}
	}

	this.compressToL();

  var nfa = new NFA_to_DFA(this.left);
  this.left = nfa.convert();

	return this.left;
};

Concatenation.prototype.compressToL = function() {

	//copy nodes
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		var info = nodes[i];

		var color = "blue";
		if (info.color != null && info.color.background != null) {
			color = info.color.background;
		}
		this.left.data.nodes.push(this.createNode("circle", info.id, info.label, color));
	}


	//copy edges
	var edges = this.right.data.edges;

	for (var i = 0; i < edges.length; i++) {
		var info = edges[i];

		this.left.data.edges.push(this.createEdge(info.from, info.to, info.label));
	}

};

Concatenation.prototype.getInitialR = function() {
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].shape != null && nodes[i].shape == "triangle") {
			this.right.data.nodes[i].shape = "circle";
			return nodes[i].label;
		}
	}
};

Concatenation.prototype.parseDFA = function(str) {
	var parsedData = vis.network.convertDot(str);

  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  var options = parsedData.options;

  options.nodes = {
    color: 'red'
  }

  var dfa_test = new DFA(options);
  dfa_test.setData(data);

  return dfa_test;
};

Concatenation.prototype.createEdge = function(fromObj, toObj, labelObj) {
  return {
    from: fromObj,
    to: toObj,
    label: labelObj
  };
};

Concatenation.prototype.createNode = function(shapeObj, idObj, labelObj, colorObj) {
  return {
    shape: shapeObj,
    id: idObj,
    label: labelObj,
    color: {
      background: colorObj,
      border: colorObj
    }
  };
};
