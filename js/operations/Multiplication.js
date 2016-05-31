var Multiplication = function Multiplication(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
};

Multiplication.prototype.compute = function(){
  var crossOperation = new CrossProduct(this.left, this.right);
  return crossOperation.execute();
};
