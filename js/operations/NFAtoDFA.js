var NFA_to_DFA = function nfa_to_dfa(dfa) {
  // provide data in the DOT language
  var DOTstring =  'dinetwork {'+
  'A1 -> B1 [label="sd"];' +
  'A1 -> A1 [label="sda"]; ' +
  'B1 -> A1 [label="dfs"];'+
  'A1[ color=red, shape=triangle]'+
  '}';
  var parsedData = vis.network.convertDot(DOTstring);

  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  var options = parsedData.options;

  // you can extend the options like a normal JSON variable:
  options.nodes = {
    color: 'red'
  }

  var dfa_test = new DFA(data, options);

  console.log(dfa_test);

  //TODO every above this comment should be deleted
  //TODO replace the word dfa_test by dfa
  this.dfa = dfa_test;
  this.createSamples();
  this.getAllInputs();
};

NFA_to_DFA.prototype.convert = function() {
  var retDFA = this.createDFA(data, options);
  var initial = this.getInitialState(this.dfa.data.nodes);

  return this.convert(retDFA, [initial]);
};

NFA_to_DFA.prototype.compute = function(retDFA, statesToVisit) {
  if (statesToVisit.length == 0) {
    return retDFA;
  }

  //TODO closure
  //TODO goto

  /*
  Perform closure on the current state set
  For each input symbol do the GOTO operation on the closure set.
     If the state set you get from the GOTO is not empty
        Do a closure of the state set.
        If it is a new set of states:
           add a transition between the state sets on the input
           repeat the entire operation on this new set
        Else
           add a transition between the state sets on the input
  */

  var currentState = statesToVisit[0].split(", ");
  var edges = this.dfa.data.edges;

  for (var j = 0; j < this.allEdges.length; j++) {
    var stateNew = null;
    for (var i = 0; i < currentState.length; i++) {
      for (var k = 0; k < edges.length; k++) {
        if (edges[k].label == this.allEdges[j] && edges[k].from == currentState[i]) {
          if (stateNew == null) {
            stateNew = edges[k].to;
          } else {
            stateNew = stateNew + ", " + edges[k].to;
          }
        }
      }
    }
  }

  statesToVisit.shift();
  return this.convert(retDFA, statesToVisit);
};

NFA_to_DFA.prototype.closureEpsilon = function(state) {

  var edges = this.dfa.data.edges;
  var out = state;

  for (var i = 0; i < edges.length; i++) {
    if (edges[i].from == state && edges[i].label == "$") {
      out = out + ", " + closureEpsilon(edges[i].to);
    }
  }

  return out;
};

NFA_to_DFA.prototype.getAllInputs = function() {

  var edges = this.dfa.data.edges;
  this.allEdges = [];

  for (var i = 0; i < edges.length; i++) {
    var ip = edges[i].label.split(", ");
    for (var j = 0; j < ip.length; j++) {
      if (ip[j] != "$" && (this.allEdges.indexOf(ip[j]) == -1)) {
        this.allEdges.push(ip[j]);
      }
    }
  }
};

NFA_to_DFA.prototype.getInitialState = function(states) {
  for (var i = 0; i < states.length; i++) {
    if (states[i].shape != null && states[i].shape == "triangle") {
      return states[i];
    }
  }
};

NFA_to_DFA.prototype.createDFA = function(data, options) {
  var retDFA = new DFA(data, options);
  retDFA.data.edges = [];
  retDFA.data.nodes = [];

  retDFA.data.nodes.push(this.sampleState);
  retDFA.data.nodes[0].shape = "circle";
  retDFA.data.nodes[0].id = "DS"; //Dead State
  retDFA.data.nodes[0].label = "DS"; //Dead State

  retDFA.data.edges.push(this.sampleEdge);
  retDFA.data.edges[0].from = "DS";
  retDFA.data.edges[0].to = "DS";
  retDFA.data.edges[0].label = this.allEdges.join(", ");

  return retDFA;
};

NFA_to_DFA.prototype.createSamples = function() {
  // provide data in the DOT language
  var DOTstring =  'dinetwork {'+
  'A1 -> B1 [label=1];' +
  'A1[ color=red, shape=triangle]'+
  '}';
  var parsedData = vis.network.convertDot(DOTstring);

  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  this.sampleEdge = data.edges[0];
  this.sampleState = data.nodes[0];
};
