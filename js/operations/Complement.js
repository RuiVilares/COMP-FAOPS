//Constructor (only one dfa are parsed)
var Complement = function complement(DFA) {
  var DOTstring = 'dinetwork {' +
      'A -> B [label="a"];' +
      'A -> A [label="b"];' +
      'B -> B [label="b"];' +
      'B -> A [label="a"];' +
      'A[ color=red, shape=triangle]' +
      'B[ color=blue, shape=circle]' +
      '}';
  this.DFA = this.parseDFA(DOTstring);
};

Complement.prototype.compute = function() {
  var nodes = this.DFA.data.nodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color != null && nodes[i].color.background == "red") {
      this.DFA.data.nodes[i].color.background = "blue";
    }
    if (nodes[i].color != null && nodes[i].color.background == "blue") {
      this.DFA.data.nodes[i].color.background = "red";
    }
  }

  return this.DFA;

}

//parse a string to dfa
Complement.prototype.parseDFA = function(str) {
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
