var TreeProcess = function(tree) {
  this.tree = tree;

  //they are maps of DFAs
  //map of the variables used
  this.hashmapVar = new Map();

  //map of the files uploaded
  this.hashmapFiles = new Map();
};

TreeProcess.prototype.compute = function() {
  for (var i = 0; i < this.tree._root.children.length; i++) {
    this.traverseDF(this.tree._root.children[i].children[0]);
  }
};

TreeProcess.prototype.decideLeaf = function(node) {
  if (node.token.id == TOKENS.FILENAME) {
    return this.hashmapFiles[node.token.img];
  } else {
    return this.hashmapVar[node.token.img];
  }
};

TreeProcess.prototype.decide1Arg = function(op, node) {

  if (op.token == null) {
    return node;
  }

  switch (op.token.id) {
    case TOKENS.COMPLEMENT:
      return complement(node);
    case TOKENS.REVERSE:
      return reverse(node);
    default:
      return node;
  }
};

TreeProcess.prototype.decide2Arg = function(op, left, right) {

  switch (op.token.id) {
    case TOKENS.MULTIPLY:
      return multiply(left, right);
    case TOKENS.CONCATENATE:
      return concatenate(left, right);
    case TOKENS.INTERSECTION:
      return intersection(left, right);
    case TOKENS.EQUAL:
      if (right == null) {
        //TODO different error message
        window.alert("File is probably missing...");
        return null;
      }
      this.hashmapVar.set(left, right);
      return null;
    case TOKENS.DUMP:
      return dump(left, right);
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
      //TODO remove this message. Only useful for debug
      window.alert("Too many childrens of the node: "+currentNode);
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
