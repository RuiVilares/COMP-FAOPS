var Union = function Union(left, right) {
    this.left = new DFA(left.options);
    this.left.clone(left);
    this.right = new DFA(right.options);
    this.right.clone(right);
  var crossOperation = new CrossProduct(this.left, this.right);
  this.crossResult = crossOperation.execute();
};

//This method automatically determines if a state is final. a state is final if it contains a reference to an id of a node that was a final state on the previous FA
Union.prototype.compute = function () {
    var L = this.left.data.nodes;
    var R = this.right.data.nodes;

    for (var i = 0; i < L.length; i++) {
        if (L[i].color.background == "red") {
            console.log("pattern: " + L[i].id);
            var pattern = new RegExp(String(L[i].id));
            for (var j = 0; j < this.crossResult.data.nodes.length; j++) {
                console.log(this.crossResult.data.nodes[j].id);
                if(pattern.test(String(this.crossResult.data.nodes[j].id)))
                {
                    this.crossResult.data.nodes[j].color.background = "red";
                }
            }
        }
    }

    for (var i = 0; i < R.length; i++) {
        if (R[i].color.background == "red") {
            var pattern = new RegExp(String(R[i].id));
            for (var j = 0; j < this.crossResult.data.nodes.length; j++) {
                if(pattern.test(this.crossResult.data.nodes[j].id))
                {
                    this.crossResult.data.nodes[j].color.background = "red";
                }
            }
        }
    }


    return this.crossResult;
};
