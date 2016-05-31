var TreeProcess = function(tree) {
  TreeProcess.tree = tree;
  TreeProcess.hashmapVar = new Map();
};

TreeProcess.tree = [];

//they are maps of DFAs
//map of the variables used
TreeProcess.hashmapVar = new Map();

//map of the files uploaded
TreeProcess.hashmapFiles = new Map();

TreeProcess.prototype.compute = function() {
  for (var i = 0; i < TreeProcess.tree._root.children.length; i++) {
    console.log(TreeProcess.tree._root.children[i].children[0]);
    this.traverseDF(TreeProcess.tree._root.children[i].children[0]);
  }
};

TreeProcess.prototype.decideLeaf = function(node) {
  if (node.token.id == TOKENS.FILENAME) {
    return TreeProcess.hashmapFiles[node.token.img];
  } else {
    if (TreeProcess.hashmapVar[node.token.img] != null) {
      return TreeProcess.hashmapVar[node.token.img];
    }
    return node.token.img;
  }
};

TreeProcess.prototype.decide1Arg = function(op, node) {

  if (op.token == null) {
    return node;
  }

  switch (op.token.id) {
    case TOKENS.COMPLEMENT:
      var dfa = new Complement(node);
      return dfa.compute();
    case TOKENS.REVERSE:
      var dfa = new Reverse(node);
      return dfa.compute();
    default:
      return node;
  }
};

TreeProcess.prototype.decide2Arg = function(op, left, right) {
  var dfa = null;
  switch (op.token.id) {
    case TOKENS.MULTIPLY:
      dfa = new Multiplication(left, right);
      return dfa.compute();
    case TOKENS.CONCATENATE:
      dfa = new Concatenation(left, right);
      return dfa.compute();
    case TOKENS.INTERSECTION:
      dfa = new Intersection(left, right);
      return dfa.compute();
    case TOKENS.UNION:
      dfa = new Union(left, right);
      return dfa.compute();
    case TOKENS.EQUAL:
      if (right == null) {
        errorMsg("File is probably missing...");
        return null;
      }
      TreeProcess.hashmapVar[left] = right;
      return null;
    case TOKENS.DUMP:
      dfa = new Dump(left, right);
      return dfa.compute();
    default:
      return null;
  }
};

TreeProcess.prototype.traverseDF = function(tree) {//, callback) {

  // this is a recurse and immediately-invoking function
  (function recurse(currentNode) {

    // step 4
    //callback(currentNode);

    switch (currentNode.children.length) {
      case 0:
      return TreeProcess.prototype.decideLeaf(currentNode);
      case 1:
      return TreeProcess.prototype.decide1Arg(currentNode, recurse(currentNode.children[0]));
      case 2:
      return TreeProcess.prototype.decide2Arg(currentNode, recurse(currentNode.children[0]), recurse(currentNode.children[1]));
      default:
      errorMsg("Too many childrens of the node: "+currentNode);
      return null;
    }

    // step 2
    /*for (var i = 0, length = currentNode.children.length; i < length; i++) {
    // step 3
    recurse(currentNode.children[i]);
  }*/

  // step 4
  //callback(currentNode);

  // step 1
})(tree);

};
