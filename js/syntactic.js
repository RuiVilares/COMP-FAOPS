var SyntacticAnalysis = function(sequence) {
	this.sequence = sequence;
	this.tree = null;
	this.syntacticAnalysis();
	console.log(this.tree);
}

SyntacticAnalysis.prototype.syntacticAnalysis = function() {
	if(this.sequence.tokens.length == 0)
		return;

	if(this.S(this.sequence))
		console.log("Correct Syntactic construction of the statement.");
	else 
		console.error("Error on statement's construction.");
};

SyntacticAnalysis.prototype.S = function() {
	if(this.A(this.sequence)) 
		return true;
	else if(this.DUMP(this.sequence))
		return true;
	else return false;
}

SyntacticAnalysis.prototype.A = function() {
	var rootId = 'A';
	this.tree = new Tree(rootId);
	if(TOKENS[this.sequence.peek().id] == TOKENS.DECLARATION) {
		this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
			this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
			this.sequence.nextToken();
			if(TOKENS[this.sequence.peek().id] == TOKENS.EQUAL) {
				this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
				this.sequence.nextToken();
				var index = this.sequence.i;
				if(this.New(rootId))
					return true;
				else if(this.Exp(rootId, index))
					return true;
			}
		}
	}

	this.tree = null;
	return false;
};

SyntacticAnalysis.prototype.New = function(parent) {
	var nodeId = 'NEW';
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.NEW) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.OPEN) {
			this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
			this.sequence.nextToken();
			if(TOKENS[this.sequence.peek().id] == TOKENS.QUOTE) {
				this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
				this.sequence.nextToken();
				if(TOKENS[this.sequence.peek().id] == TOKENS.FILENAME) {
					this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
					this.sequence.nextToken();
					if(TOKENS[this.sequence.peek().id] == TOKENS.QUOTE) {
						this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
						this.sequence.nextToken();
						if(TOKENS[this.sequence.peek().id] == TOKENS.CLOSE) {
							this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
							return true;
						}
					}
				}
			}
		}
	}	

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
};

SyntacticAnalysis.prototype.Exp = function(parent, index) {
	this.sequence.i = index;
	var nodeId = 'EXP';
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.OPEN) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		var newIndex = this.sequence.i;
		if(this.Exp(nodeId, newIndex)) {
			this.sequence.nextToken();
			if(TOKENS[this.sequence.peek().id] == TOKENS.CLOSE) {
				this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
				return true;
			}
		}
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	this.sequence.i = index;
	if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		return this.Op(nodeId, this.sequence.i);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	this.sequence.i = index;
	if(TOKENS[this.sequence.peek().id] == TOKENS.COMPLEMENT) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.OPEN) {
			this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
			this.sequence.nextToken();
			if(this.Exp(nodeId, this.sequence.i)) {
				this.sequence.nextToken();
				if(TOKENS[this.sequence.peek().id] == TOKENS.CLOSE) {
					this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
					return true;
				}
			}
		}
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
};

SyntacticAnalysis.prototype.Op = function(parent, index) {
	this.sequence.i = index;

	if(this.sequence.peek() == null) {
		this.sequence.i--;
		return true;
	}

	var nodeId = 'OP';
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.INTERSECTION) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		return this.Exp(nodeId, this.sequence.i);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.MULTIPLY) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		return this.Exp(nodeId, this.sequence.i);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.CONCATENATE) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		return this.Exp(nodeId, this.sequence.i);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.UNION) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		return this.Exp(nodeId, this.sequence.i);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.REVERSE) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		return this.Exp(nodeId, this.sequence.i);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
};

SyntacticAnalysis.prototype.DUMP = function() {
	this.sequence.reinit();
	var rootId = 'DUMP';
	this.tree = new Tree(rootId);
	if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
		this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.CONCATENATE) {
			this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
			this.sequence.nextToken();
			if(TOKENS[this.sequence.peek().id] == TOKENS.DUMP) {
				this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
				this.sequence.nextToken();
				if(TOKENS[this.sequence.peek().id] == TOKENS.OPEN) {
					this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
					this.sequence.nextToken();
					if(TOKENS[this.sequence.peek().id] == TOKENS.QUOTE) {
						this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
						this.sequence.nextToken();
						if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
							this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
							this.sequence.nextToken();
							if(TOKENS[this.sequence.peek().id] == TOKENS.QUOTE) {
								this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
								this.sequence.nextToken();
								if(TOKENS[this.sequence.peek().id] == TOKENS.CLOSE) {
									this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
									this.sequence.nextToken();
									if(TOKENS[this.sequence.peek().id] == TOKENS.SEMI_COLON) {
										this.tree.add(this.sequence.peek().img, rootId, this.tree.traverseDF);
										return true;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	this.tree = null;
	return false;
}