var DFA = function(options) {
  this.data = {nodes: [], edges: []};
  this.options = options;
};

DFA.prototype.setData = function(data1) {
  this.data = data1;
};
