var Intersection = function intersection(node) {
    var DOTstring = 'dinetwork {' +
        'A -> B [label="a"];' +
        'A -> A [label="b"];' +
        'B -> B [label="b"];' +
        'B -> A [label="a"];' +
        'A[ color=red, shape=triangle]' +
        'B[ color=blue, shape=circle]' +
        '}';
    this.left = this.parseDFA(DOTstring);


    DOTstring = 'dinetwork {' +
        'C -> D [label="b"];' +
        'C -> C [label="a"];' +
        'D -> D [label="a"];' +
        'D -> C [label="b"];' +
        'C[ color=blue, shape=triangle]' +
        'D[ color=red, shape=circle]' +
        '}';
    this.right = this.parseDFA(DOTstring);
};

Intersection.prototype.compute = function () {
    var startR = this.getInitialR();
    var rightFinalStates = [];
    var leftFinalStates = [];

    var nodes = this.left.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].color != null && nodes[i].color.background == "red") {
            leftFinalStates.push(nodes[i]);
        }
        
        if (nodes[i].shape != null && nodes[i].shape == "triangle") {
			this.left.insertEdge(this.left.data.nodes[i].label, startR, "$");
        }
        
    }
    
    nodes = this.right.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].color != null && nodes[i].color.background == "red") {
            rightFinalStates.push(nodes[i]);
        }
    }
    

    this.compressToL();

    var nfa = new NFA_to_DFA(this.left);
    this.left = nfa.convert();
    
    this.intersectFinalStates(leftFinalStates, rightFinalStates);
    
    return this.left;
};


//Copy the dfa from the right to the dfa from the left
Intersection.prototype.compressToL = function () {

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

//Intersecting the states where the id is composed by at least one final state from left dfa and one final state from right dfa
Intersection.prototype.intersectFinalStates = function (leftFinalStates, rightFinalStates) {
    var nodes = this.left.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        
        //resets all nodes to non-final states
        this.left.data.nodes[i].color.background = "blue";
        this.left.data.nodes[i].color.border = "blue";
        
        var setToFinal = false;
        var pattern = null;
        
        //comparing id's with the original final states from the left dfa
        for (var l = 0; l < leftFinalStates.length; l++) {
            pattern = new RegExp(leftFinalStates[l].id);
            if (pattern.test(nodes[i].id)) {
                this.left.data.nodes[i].color.background = "red";
                this.left.data.nodes[i].color.border = "red";
                setToFinal = true;
                break;
            }
        }
        
        //only proceeds to compare with right dfa if the left the node matched one of the left dfa final states
        if(!setToFinal)
            continue;
        
        pattern = null;
        
        //comparing id's with the original final states from the right dfa
        for (var r = 0; r < rightFinalStates.length; r++) {
            pattern = new RegExp(rightFinalStates[r].id);
            if (!pattern.test(nodes[i].id)) {
                 this.left.data.nodes[i].color.background = "blue";
                 this.left.data.nodes[i].color.border = "blue";
            }
            else break;
        }
    }  
};

//get initial state from the dfa of the right
Intersection.prototype.getInitialR = function () {
    var nodes = this.right.data.nodes;

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].shape != null && nodes[i].shape == "triangle") {
            this.right.data.nodes[i].shape = "circle";
            return nodes[i].label;
        }
    }
};

//parse a string to dfa
Intersection.prototype.parseDFA = function (str) {
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
