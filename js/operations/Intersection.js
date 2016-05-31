var Intersection = function Intersection(left, right) {
    this.left = left;
    this.right = right;

    var crossOperation = new CrossProduct(this.left, this.right);
    this.crossResult = crossOperation.execute();
};

Intersection.prototype.compute = function () {
    var rightFinalStates = [];
    var leftFinalStates = [];

    var nodes = this.left.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].color != null && nodes[i].color.background == "red") {
            leftFinalStates.push(nodes[i]);
        }
    }

    nodes = this.right.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].color != null && nodes[i].color.background == "red") {
            rightFinalStates.push(nodes[i]);
        }
    }

    this.intersectFinalStates(leftFinalStates, rightFinalStates);
    return this.crossResult;
};


//Intersecting the states where the id is composed by at least one final state from left dfa and one final state from right dfa
Intersection.prototype.intersectFinalStates = function (leftFinalStates, rightFinalStates) {
    var nodes = this.crossResult.data.nodes;
    for (var i = 0; i < nodes.length; i++) {

        var setToFinal = false;
        var pattern = null;

        //comparing id's with the original final states from the left dfa
        for (var l = 0; l < leftFinalStates.length; l++) {
            pattern = new RegExp(leftFinalStates[l].id);
            if (pattern.test(nodes[i].id)) {
                this.crossResult.data.nodes[i].color.background = "red";
                this.crossResult.data.nodes[i].color.border = "red";
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
                 this.crossResult.data.nodes[i].color.background = "blue";
                 this.crossResult.data.nodes[i].color.border = "blue";
            }
            else break;
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
