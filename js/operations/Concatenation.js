//Constructor (both arguments are dfa parsed)
var Concatenation = function Concatenation(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
};

//Performs the concatenation between the two dfas
//http://math.stackexchange.com/questions/657868/combining-two-dfas-into-an-nfa-to-recognize-concatenation
Concatenation.prototype.compute = function() {
	var startR = this.getInitialR();

	var nodes = this.left.data.nodes;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].color != null && nodes[i].color.background == "red") {
			this.left.data.nodes[i].color.background = "blue";
			this.left.insertEdge(this.left.data.nodes[i].label, startR, "$");
		}
	}

	this.compressToL();

  var nfa = new NFA_to_DFA(this.left);
  this.left = nfa.convert();

	return this.left;
};

//Copy the dfa from the right to the dfa from the left
Concatenation.prototype.compressToL = function() {

	//copy nodes
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		var info = nodes[i];

		var color = "blue";
		if (info.color != null && info.color.background != null) {
			color = info.color.background;
		}
		this.left.insertNode("circle", info.id, info.label, color);
	}


	//copy edges
	var edges = this.right.data.edges;

	for (var i = 0; i < edges.length; i++) {
		var info = edges[i];

		this.left.insertEdge(info.from, info.to, info.label);
	}

};

//get initial state from the dfa of the right
Concatenation.prototype.getInitialR = function() {
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].shape != null && nodes[i].shape == "triangle") {
			this.right.data.nodes[i].shape = "circle";
			return nodes[i].label;
		}
	}
};

//parse a string to dfa
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
