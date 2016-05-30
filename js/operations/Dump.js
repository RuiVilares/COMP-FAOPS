new function writeToFile(DFA){
  var nodes = this.dfa.data.nodes;
  var edges = this.dfa.data.edges;
  var content;
  //teste
  var DOTstring = 'dinetwork {' +
      'A -> B [label="a"];' +
      'A -> C [label="b"];' +
      'B -> B [label="a"];' +
      'B -> B [label="b"];' +
      'C -> C [label="a"];' +
      'C -> C [label="b"];' +
      'A[ color=blue, shape=triangle]' +
      'B[ color=red, shape=circle]' +
      'C[ color=red, shape=circle]' +
      '}';
  this.dfa = this.parseDFA(DOTstring);

  for(var i=0; i < nodes.length; i++){
    content= nodes.id +"[nodes="+nodes.color +", shape="+nodes.shape "]\\n";
  }

  for(var i=0; i< edges.length; i++){
    content=edges.from + "->"+ edges.to + "[label="+edges.label"];\\n"
  }
  return content;
}//var content= writeToFile(DFA);
