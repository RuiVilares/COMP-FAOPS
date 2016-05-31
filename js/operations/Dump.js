var Dump = function Dump(DFA) {
  this.dfa = this.parseDFA(DFA);
  console.log(this.dfa);
}//var content= dump(DFA);

Dump.prototype.compute = function(){
  var content='dinetwork{\n';
  var nodes = this.dfa.data.nodes;
  var edges = this.dfa.data.edges;

  for(var i=0; i < nodes.length; i++){
    content+= '  '+nodes[i].id +"[color="+ nodes[i].color.background +", shape="+nodes[i].shape+ "]\n";
  }

  for(var i=0; i< edges.length; i++){
    content+='  '+edges[i].from + "->"+ edges[i].to + "[label="+ edges[i].label+"];\n"
  }
  content+='}';
  return content;

}

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
