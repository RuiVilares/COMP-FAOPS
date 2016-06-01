var CrossProduct = function(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
	this.newDFA = new DFA();
};

CrossProduct.prototype.execute = function() {
	var newSetOfStates = this.crossStates();
	var alphabet = this.getAlphabet();
	this.processEdges(newSetOfStates, alphabet);

	return this.newDFA;
};

CrossProduct.prototype.crossStates = function() {
	var result = [];
	var L = this.left.data.nodes;
	var R = this.right.data.nodes;

	for (var i = 0; i < L.length; i++) {
		for (var j = 0; j < R.length; j++) {
			if (L[i].shape == 'triangle' && R[j].shape == 'triangle')
				this.newDFA.insertNode('triangle', L[i].id + R[j].id, L[i].label + R[j].label, 'blue');
			else
				this.newDFA.insertNode('circle', L[i].id + R[j].id, L[i].label + R[j].label, 'blue');
		}
	}
	return result;
};

CrossProduct.prototype.getAlphabet = function() {
	var result = [];
	var L = this.left.data.edges;

	for (var i = 0; i < L.length; i++) {
		if (L[i].label.length > 1)
		{
			var subResult = null;

			var pattern = new RegExp(', ')
			if(pattern.test(L[i].label))
				subResult = L[i].label.split(', ');
			else
				subResult = L[i].label.split(',');

			for(var j = 0; j < subResult.length; j++)
				result[subResult[j]] = subResult[j];
		}
		else result[L[i].label] = L[i].label;
	}
	return result;
};

CrossProduct.prototype.processEdges = function(dfa, alphabet) {
	var L = this.left.data.nodes;
	var R = this.right.data.nodes;

	for(var i = 0; i < L.length; i++) {
		for(var j = 0; j < R.length; j++) {
			var fromObj = L[i].id + R[j].id;

			for (param in alphabet) {
				var destinationL = this.searchEdge(this.left, L[i].id, param);
				var destinationR = this.searchEdge(this.right, R[j].id, param);
				var toObj = destinationL + destinationR;
				this.newDFA.insertEdge(fromObj, toObj, param);
			}
		}
	}
};


CrossProduct.prototype.searchEdge = function(dfa, id, param) {
	var edges = dfa.data.edges;
	var pattern = new RegExp(param);

	for(var i = 0; i < edges.length; i++) {
		if (id == edges[i].from && pattern.test(edges[i].label))
			return edges[i].to;
	}

	return "";
};
