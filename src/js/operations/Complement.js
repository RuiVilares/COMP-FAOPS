/**
 * Complement - constructor of the complement operation
 *
 * @param  {DFA} dfa dfa to be complemented
 */
var Complement = function Complement(dfa) {
	this.dfa = new DFA(dfa.options);
	this.dfa.clone(dfa);
};

/**
 * Complement.prototype.compute - performs the complement operation
 *
 * @return {DFA}  return of the DFA
 */
Complement.prototype.compute = function() {
  var nodes = this.dfa.data.nodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color.background == finalStateColorGlobal) {
      nodes[i].color = {
        background: normalStateColorGlobal,
        border: normalStateColorGlobal
      }
    }
    else if (nodes[i].color.background == normalStateColorGlobal) {
      nodes[i].color = {
        background: finalStateColorGlobal,
        border: finalStateColorGlobal
      }
    }
  }
  return this.dfa;
};
