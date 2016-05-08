var Union = function union(node) {
    var DOTstring = 'dinetwork {' +
        'A -> B [label="0"];' +
        'A[ color=blue, shape=triangle]' +
        'B[ color=red, shape=circle]' +
        '}';
    this.left = this.parseDFA(DOTstring);


    DOTstring = 'dinetwork {' +
        'C -> D [label="1"];' +
        'C[ color=blue, shape=triangle]' +
        'D[ color=red, shape=circle]' +
        '}';
    this.right = this.parseDFA(DOTstring);
};

Union.prototype.compute = function () {
    var startR = this.getInitialR();

    var nodes = this.left.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].shape != null && nodes[i].shape == "triangle") {
			this.left.insertEdge(this.left.data.nodes[i].label, startR, "$");
        }
    }
    
    this.compressToL();

    var nfa = new NFA_to_DFA(this.left);
    this.left = nfa.convert();
    
    return this.left;
};


//Copy the dfa from the right to the dfa from the left
Union.prototype.compressToL = function () {

	//copy nodes
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		var info = nodes[i];

		var color = "blue";
		if (info.color != null && info.color.background != null) {
			color = info.color.background;
		}
		this.left.insertNode("circle", info.id, info.label, color);
	}
	
	
	//copy edges
	var edges = this.right.data.edges;

	for (var i = 0; i < edges.length; i++) {
		var info = edges[i];

		this.left.insertEdge(info.from, info.to, info.label);
	}

};

//get initial state from the dfa of the right
Union.prototype.getInitialR = function () {
    var nodes = this.right.data.nodes;

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].shape != null && nodes[i].shape == "triangle") {
            this.right.data.nodes[i].shape = "circle";
            return nodes[i].label;
        }
    }
};

//parse a string to dfa
Union.prototype.parseDFA = function (str) {
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
