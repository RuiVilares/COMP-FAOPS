var SyntacticAnalysis = function(sequence) {
	this.declarationIndex = 0;
	this.newIndex = 0;
	this.expIndex = 0;
	this.termIndex = 0;
	this.term_Index = 0;
	this.factorIndex = 0;
	this.factor_Index = 0;
	this.sequence = sequence;
	this.tree = null;
	this.syntacticAnalysis();
	console.log(this.tree);
}

SyntacticAnalysis.prototype.syntacticAnalysis = function() {
	if(this.sequence.tokens.length == 0)
		return;

	if(this.S())
		console.log("Correct Syntactic construction of the statement.");
	else 
		console.error("Error on statement's construction.");
};

SyntacticAnalysis.prototype.S = function() {
	this.tree = new Tree('START');
	var loop = true;
	do {
		if(!this.A())
			return false;
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.SEMI_COLON) 
			this.sequence.nextToken();
		else loop = false;
	} while(loop);
	
	return this.DUMP();
};

SyntacticAnalysis.prototype.A = function() {
	var nodeId = 'DECLARATION' + this.declarationIndex++;
	this.tree.add(nodeId, 'START', this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.DECLARATION) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
			this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
			this.sequence.nextToken();
			if(TOKENS[this.sequence.peek().id] == TOKENS.EQUAL) {
				this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
				this.sequence.nextToken();
				var sequenceIndex = this.sequence.i;
				if(this.New(nodeId))
					return true;
				else if(this.Exp(nodeId, sequenceIndex))
					return true;
			}
		}
	}

	this.tree.remove(nodeId, 'START', this.tree.traverseDF);
	return false;
};

SyntacticAnalysis.prototype.New = function(parent) {
	var nodeId = 'NEW' + this.newIndex++;
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

SyntacticAnalysis.prototype.Exp = function(parent, sequenceIndex) {
	this.sequence.i = sequenceIndex;
	var nodeId = 'EXPRESSION' + this.expIndex++;
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(this.Term(nodeId)) {
		this.sequence.nextToken();
		return this.Term_(nodeId);
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
};

SyntacticAnalysis.prototype.Term_ = function(parent) {
	var nodeId = 'TERM_' + this.term_Index++;
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(this.OP1(nodeId)) {
		this.sequence.nextToken();
		if(this.Term(nodeId)) {
			this.sequence.nextToken();
			if(this.Term_(nodeId)) {
				return true;
			}
		}
	}
	else {
		this.tree.remove(nodeId, parent, this.tree.traverseDF);
		this.sequence.i--;
		return true;
	}
};

SyntacticAnalysis.prototype.Term = function(parent) {
	var nodeId = 'TERM' + this.termIndex++;
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(this.Factor(nodeId)) {
		this.sequence.nextToken();
		if(this.Factor_(nodeId)) {
			return true;
		}
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
};

SyntacticAnalysis.prototype.Factor_ = function(parent) {
	var nodeId = 'FACTOR_' + this.factor_Index++;
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(this.OP2(nodeId)) {
		this.sequence.nextToken();
		if(this.Factor(nodeId)) {
			this.sequence.nextToken();
			if(this.Factor_(nodeId)) {
				return true;
			}
		}
	}
	else {
		this.tree.remove(nodeId, parent, this.tree.traverseDF);
		this.sequence.i--;
		return true;
	}
};

SyntacticAnalysis.prototype.Factor = function(parent) {
	var nodeId = 'FACTOR' + this.factorIndex++;
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER){
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		return true;
	}
	else if(TOKENS[this.sequence.peek().id] == TOKENS.OPEN) {
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
	else if(TOKENS[this.sequence.peek().id] == TOKENS.COMPLEMENT) {
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
	else if(TOKENS[this.sequence.peek().id] == TOKENS.REVERSE) {
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

SyntacticAnalysis.prototype.OP1 = function(parent) {
	var nodeId = 'OP1';
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.CONCATENATE 
		|| TOKENS[this.sequence.peek().id] == TOKENS.UNION) {

		this.tree.add(this.sequence,peek().img, nodeId, this.tree.traverseDF);
		return true;
	}

	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
}

SyntacticAnalysis.prototype.OP2 = function(parent) {
	var nodeId = 'OP1';
	this.tree.add(nodeId, parent, this.tree.traverseDF);

	if(TOKENS[this.sequence.peek().id] == TOKENS.INTERSECTION 
		|| TOKENS[this.sequence.peek().id] == TOKENS.MULTIPLY) {

		this.tree.add(this.sequence,peek().img, nodeId, this.tree.traverseDF);
		return true;
	}
	
	this.tree.remove(nodeId, parent, this.tree.traverseDF);
	return false;
}

SyntacticAnalysis.prototype.DUMP = function() {
	var nodeId = 'DUMP';
	this.tree.add(nodeId, 'START', this.tree.traverseDF);
	if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
		this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
		this.sequence.nextToken();
		if(TOKENS[this.sequence.peek().id] == TOKENS.CONCATENATE) {
			this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
			this.sequence.nextToken();
			if(TOKENS[this.sequence.peek().id] == TOKENS.DUMP) {
				this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
				this.sequence.nextToken();
				if(TOKENS[this.sequence.peek().id] == TOKENS.OPEN) {
					this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
					this.sequence.nextToken();
					if(TOKENS[this.sequence.peek().id] == TOKENS.QUOTE) {
						this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
						this.sequence.nextToken();
						if(TOKENS[this.sequence.peek().id] == TOKENS.IDENTIFIER) {
							this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
							this.sequence.nextToken();
							if(TOKENS[this.sequence.peek().id] == TOKENS.QUOTE) {
								this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
								this.sequence.nextToken();
								if(TOKENS[this.sequence.peek().id] == TOKENS.CLOSE) {
									this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
									this.sequence.nextToken();
									if(TOKENS[this.sequence.peek().id] == TOKENS.SEMI_COLON) {
										this.tree.add(this.sequence.peek().img, nodeId, this.tree.traverseDF);
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
	
	return false;
}