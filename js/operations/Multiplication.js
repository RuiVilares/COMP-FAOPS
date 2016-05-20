//TODO VER A MULTIPLICACAO


var Multiplication = function multiplication(node) {
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
