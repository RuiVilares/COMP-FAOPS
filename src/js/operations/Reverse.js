/**
 * Reverse - constructor of the reverse operation
 *
 * @param  {DFA} dfa dfa to be complemented
 */
var Reverse = function reverse(dfa) {
	this.dfa = new DFA(dfa.options);
	this.dfa.clone(dfa);
};

/**
 * Reverse.prototype.compute - performs the reverse operation
 *
 * @return {DFA}  return of the DFA
 */
Reverse.prototype.compute = function() {
  var nodes = this.dfa.data.nodes;
  var edges = this.dfa.data.edges;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].shape == "triangle") {
      nodes[i].shape = "circle";
      nodes[i].color = {
        background: finalStateColorGlobal,
        border: finalStateColorGlobal
      }
    }
    else if (nodes[i].color.background == finalStateColorGlobal) {
      nodes[i].shape = "triangle";
      nodes[i].color = {
        background: normalStateColorGlobal,
        border: normalStateColorGlobal
      }
    }
  }

  var temp;
  for (var i = 0; i < edges.length; i++) {
    temp = edges[i].from;
    edges[i].from = edges[i].to;
    edges[i].to = temp;
  }

  this.dfa.insertNode("triangle", "Start", "Start", normalStateColorGlobal);

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
