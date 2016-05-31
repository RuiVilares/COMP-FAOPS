var Dump = function Dump() {
//  var nodes = this.dfa.data.nodes;
//  var edges = this.dfa.data.edges;
  var content;
  //teste
  var DOTstring = 'dinetwork {' +
      'A -> B [label="a"];' +
      'A -> A [label="b"];' +
      'B -> B [label="b"];' +
      'B -> A [label="a"];' +
      'A[ color=red, shape=triangle]' +
      'B[ color=blue, shape=circle]' +
      '}';
  this.left = this.parseDFA(DOTstring);

  for(var i=0; i < nodes.length; i++){
    content= nodes.id +"[nodes="+nodes.color +", shape="+nodes.shape+ "]\\n";
  }

  for(var i=0; i< edges.length; i++){
    content=edges.from + "->"+ edges.to + "[label="+edges.label+"];\\n"
  }
  return content;
}//var content= dump(DFA);

//parse a string to dfa
Dump.prototype.parseDFA = function (str) {
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
