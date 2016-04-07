var Seq = function () {
  this.clear();
};

Seq.prototype.clear = function() {
  this.tokens= [];
  this.reinit();
};

Seq.prototype.reinit = function() {
  this.i = 0;
};

Seq.prototype.add = function(token) {
  this.tokens.push(token);
};

Seq.prototype.nextToken = function() {
  if (this.i >= tokens.length) {
    return null;
  }

  return this.tokens[this.i++];
};

Seq.prototype.peek = function() {
  if (this.i >= tokens.length) {
    return null;
  }

  return this.tokens[this.i];
};

var Token = function(id, img) {
  this.id = id;
  this.img = img;
}

function start() {
  window.alert("ola");
}
