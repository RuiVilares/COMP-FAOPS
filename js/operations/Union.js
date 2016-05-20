var Union = function union(node) {
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

    var crossOperation = new CrossProduct(this.left, this.right);
    this.crossResult = crossOperation.execute();
};

Union.prototype.compute = function () {
    var L = this.left.data.nodes;
    var R = this.right.data.nodes;

    for (var i = 0; i < L.length; i++) {
        if (L[i].color.background == "red") {
            var pattern = new RegExp(L[i].id);
            for (var j = 0; j < this.crossResult.data.nodes.length; j++) {
                if(pattern.test(this.crossResult.data.nodes[j].id))
                {
                    this.crossResult.data.nodes[j].color.background = "red";
                    this.crossResult.data.nodes[j].color.border = "red";
                }
            }
        }
    }

    for (var i = 0; i < R.length; i++) {
        if (R[i].color.background == "red") {
            var pattern = new RegExp(R[i].id);
            for (var j = 0; j < this.crossResult.data.nodes.length; j++) {
                if(pattern.test(this.crossResult.data.nodes[j].id))
                {
                    this.crossResult.data.nodes[j].color.background = "red";
                    this.crossResult.data.nodes[j].color.border = "red";
                }
            }
        }
    }
    
    return this.crossResult;
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
