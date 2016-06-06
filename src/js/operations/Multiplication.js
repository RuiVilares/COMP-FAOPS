/**
 * Multiplication - constructor of the multiplication operation
 *
 * @param  {DFA} dfa dfa to be multiplicated
 */
var Multiplication = function Multiplication(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
};

/**
 * Multiplication.prototype.compute - performs the multiplication operation
 */
Multiplication.prototype.compute = function(){
  var crossOperation = new CrossProduct(this.left, this.right);
  return crossOperation.execute();
};
