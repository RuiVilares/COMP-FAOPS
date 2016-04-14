var Syntactic = funtion(sequence) {
	this.sequence = sequence;
	this.tree = null;
	this.complementIndex = 0;

	this.syntacticAnalysis();
	console.log(this.tree);
};

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
	var i = 0;

	while(this.sequence.peek() != null){

		if(!this.expressionHandler(i++)) {
			this.tree = null;
			return false;
		}

		this.sequence.nextToken();
	};

	return true;
};

SyntacticAnalysis.prototype.expressionHandler = function(parent) {
	this.tree.add(parent, 'START', this.tree.traverseDF);

	if(this.sequence.peek().id == TOKENS.DECLARATION) {
		this.sequence.nextToken();
		return this.declaration(parent);
	}
	return this.dump(parent);
};

SyntacticAnalysis.prototype.declaration = function(parent) {
	var identifier = null;
	var equalsId = null;

	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		identifier = this.sequence.peek();
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.EQUAL) {
			equalsId = this.sequence.peek().img + parent;
			this.tree.add(equalsId, parent, this.tree.traverseDF);
			this.tree.add(identifier, equalsId, this.tree.traverseDF);
			return this.declarationHandler(equalsId);
		}
	}
	return false;
};

SyntacticAnalysis.prototype.declarationHandler = function(parent) {
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.NEW) {
		return this.newExpression(parent);
	}
	else{
		var data = this.operation(this.tree, parent);
		if(data != null)
			this.tree.addTree(data, parent, this.tree.traverseDF);
		else return false;
	}
};

SyntacticAnalysis.prototype.newExpression = function(parent) {
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.QUOTE) {
			this.sequence.nextToken();
			if(this.sequence.peek().id == TOKENS.FILENAME) {
				this.tree.add(this.sequence.peek(), parent, this.tree.traverseDF);
				this.sequence.nextToken();
				if(this.sequence.peek().id == TOKENS.QUOTE) {
					this.sequence.nextToken();
					if(this.sequence.peek().id == TOKENS.CLOSE) {
						this.sequence.nextToken();
						return this.sequence.peek().id == TOKENS.SEMI_COLON;
					}
				}
			}
		}
	}
	return false;
};

SyntacticAnalysis.prototype.dump = function(parent) {
	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		var filename = this.sequence.peek();
		this.sequence.nextToken();
		if(this.sequence.peel().id == TOKENS.CONCATENATE) {
			this.sequence.nextToken();
			if(this.sequence.peek().id == TOKENS.DUMP) {
				var dumpId = this.sequence.peek().img + parent;
				this.tree.add(dumpId, parent, this.tree.traverseDF);
				this.tree.add(filename, dumpId, this.tree.traverseDF);
				this.sequence.nextToken();
				if(this.sequence.peek().id == TOKENS.OPEN) {
					this.sequence.nextToken();
					if(this.sequence.peek().id == TOKENS.QUOTE) {
						this.sequence.nextToken();
						if(this.sequence.peek().id == TOKENS.FILENAME) {
							this.tree.add(this.sequence.peek(), dumpId, this.tree.traverseDF);
							this.sequence.nextToken();
							if(this.sequence.peek().id == TOKENS.QUOTE) {
								this.sequence.nextToken();
								if(this.sequence.peek().id == TOKENS.CLOSE) {
									this.sequence.nextToken();
									return this.sequence.peek().id == TOKENS.SEMI_COLON;
								}
							}
						}
					}
				}
			}
		}
	}

	return false;
};

SyntacticAnalysis.prototype.operation = function(tree, parent) {
	if(this.sequence.peek().id == TOKENS.COMPLEMENT) {
		var complementId = this.sequence.peek();
		complementId.img = complementId.img + this.complementIndex++;
		var complementTree = new Tree(complementIndex);
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.OPEN) {
			this.sequence.nextToken();
			complementTree = this.operation(complementTree, complementId); 
			if(data != null) {
				this.sequence.nextToken();
				if(this.sequence.peek().id == TOKENS.CLOSE){
					this.sequence.nextToken();
					return this.operationAux(complementTree, parent))
						return complementTree;
				}
			}
		}
	}


	return null;
};