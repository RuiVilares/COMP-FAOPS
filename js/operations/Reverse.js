//Constructor (only one dfa are parsed)
var Reverse = function reverse(DFA) {
  this.dfa = DFA;
};

Reverse.prototype.compute = function() {
  var nodes = this.dfa.data.nodes;
  var edges = this.dfa.data.edges;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].shape == "triangle") {
      nodes[i].shape = "circle";
      nodes[i].color = {
        background: "red",
        border: "red"
      }
    }
    else if (nodes[i].color.background == "red") {
      nodes[i].shape = "triangle";
      nodes[i].color = {
        background: "blue",
        border: "blue"
      }
    }
  }

  var temp;
  for (var i = 0; i < edges.length; i++) {
    temp = edges[i].from;
    edges[i].from = edges[i].to;
    edges[i].to = temp;
  }

  this.dfa.insertNode("triangle", "Start", "Start", "blue");

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].shape == "triangle" && nodes[i].id != "Start") {
      nodes[i].shape = "circle";
      this.dfa.insertEdge("Start", nodes[i].id, "$");
    }
  }

  var nfa = new NFA_to_DFA(this.dfa);
  this.dfa = nfa.convert();
  return this.dfa;
}

//parse a string to dfa
Reverse.prototype.parseDFA = function(str) {
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
