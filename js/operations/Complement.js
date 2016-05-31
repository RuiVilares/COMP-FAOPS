//Constructor (only one dfa are parsed)
var Complement = function Complement(dfa) {
	this.dfa = new DFA(dfa.options);
	this.dfa.clone(dfa);
};

Complement.prototype.compute = function() {
  var nodes = this.DFA.data.nodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color.background == "red") {
      nodes[i].color = {
        background: "blue",
        border: "blue"
      }
    }
    else if (nodes[i].color.background == "blue") {
      nodes[i].color = {
        background: "red",
        border: "red"
      }
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
