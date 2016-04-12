var Syntactic = funtion(sequence) {
	this.sequence = sequence;
	this.tree = null;
	this.opIndex = 0;

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
		var data = this.operation(parent);
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

SyntacticAnalysis.prototype.operation = function(parent) {
	var operation = new Tree('OP' + this.opIndex++);
	var tree;

	if (this.sequence.peek().id == TOKENS.COMPLEMENT && (tree = this.checkComplement(parent)) != null) {
		//TODO juntar árvores

	} else if (this.sequence.peek().id == TOKENS.REVERSE && (tree = this.checkReverse(parent)) != null) {
		//TODO juntar árvores

	} else if (this.sequence.peek().id == TOKENS.IDENTIFIER && (tree = this.checkIdentifier(parent)) != null) {
		//TODO juntar árvores

	} else if (this.sequence.peek().id == TOKENS.OPEN && (tree = this.operation()) != null) {
		//TODO juntar árvores

		if (this.nextToken() != TOKENS.CLOSE) {
			return null;
		}

		var treeR = this.operationR();
		if (treeR != null) {
			//TODO juntar árvores

		}
	}

	return null;
};

SyntacticAnalysis.prototype.checkReverse = function(parent) {
	var operation = new Tree('OP' + this.opIndex++);

	if(this.sequence.peek().id == TOKENS.REVERSE) {
		var reverseId = this.sequence.peek().img + this.opIndex++;
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.OPEN) {
			this.sequence.nextToken();
			var tree = this.operation(reverseId);
			if (tree != null) {
				operation.addTree(tree, reverseId, operation.traverseDF);
				this.sequence.nextToken();
				if (this.sequence.peek().id == TOKENS.CLOSE) {
					this.sequence.nextToken();
					var r = this.sequence.peek().img + this.opIndex++;
					var treeR = this.operationR(r);
					//TODO é assim que se junta uma árvore?
					if (treeR != null) {
						treeR.addTree(operation, this.opIndex++, treeR.traverseDF);
					}

					return operation;
				}
			}
		}
	}

	return null;
};

SyntacticAnalysis.prototype.checkComplement = function(parent) {
	var operation = new Tree('OP' + this.opIndex++);

	if(this.sequence.peek().id == TOKENS.COMPLEMENT) {
		var complementId = this.sequence.peek().img + this.opIndex++;
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.OPEN) {
			this.sequence.nextToken();
			var tree = this.operation(complementId);
			if (tree != null) {
				operation.addTree(tree, this.opIndex++, operation.traverseDF);
				this.sequence.nextToken();
				if (this.sequence.peek().id == TOKENS.CLOSE) {
					this.sequence.nextToken();
					var r = this.sequence.peek().img + this.opIndex++;
					var treeR = this.operationR();
					//TODO é assim que se junta uma árvore?
					if (treeR != null) {
						treeR.addTree(operation, this.opIndex++, treeR.traverseDF);
					}

					return operation;
				}
			}
		}
	}

	return null;
};

SyntacticAnalysis.prototype.operationR = function(parent) {
	var operation = new Tree('OP' + this.opIndex++);
	var token;

	if((token = this.checkOPC(this.sequence.nextToken())) != null) {
		//TODO adicionar à árvore

		var op = this.operation();
		if (op != null) {
			//TODO juntar árvores

			var opr = this.operationR();
			if (opr != null) {
				//TODO juntar árvores

				return operation;
			}
		}

		return null;
	}

	return operation;
};

SyntacticAnalysis.prototype.checkOPC = function(token) {
	if (token.id == TOKENS.MULTIPLY
		|| token.id == TOKENS.CONCATENATE
		|| token.id == TOKENS.INTERSECTION
		|| token.id == TOKENS.UNION) {
			return token;
		}

		return null;
};
