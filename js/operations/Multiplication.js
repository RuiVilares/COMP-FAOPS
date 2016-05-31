var Multiplication = function Multiplication(left, right) {
    this.left = left;
    this.right = right;
};

Multiplication.prototype.compute = function(){
  var crossOperation = new CrossProduct(this.left, this.right);
  return crossOperation.execute();
};
