var Syntactic = function(sequence) {
	this.sequence = sequence;
	this.tree = null;
	this.opIndex = 0;

	this.syntacticAnalysis();
	console.log(this.tree);
};

Syntactic.prototype.syntacticAnalysis = function() {
	if(this.sequence.tokens.length == 0)
		return;

	if(this.S())
		console.log("Correct Syntactic construction of the statement.");
	else
		console.error("Error on statement's construction.");
};

Syntactic.prototype.S = function() {
	this.tree = new Tree('START');
	var loop = true;
	var i = 0;

	while(this.sequence.peek() != null){

		if(!this.expressionHandler(i++)) {
			this.tree = null;
			return false;
		}

		this.sequence.nextToken();
	}

	return true;
};

Syntactic.prototype.expressionHandler = function(parent) {
	this.tree.add(parent, 'START', this.tree.traverseDF);

	if(this.sequence.peek().id == TOKENS.DECLARATION) {
		this.sequence.nextToken();
		return this.declaration(parent);
	}
	return this.dump(parent);
};

Syntactic.prototype.declaration = function(parent) {
	var identifier = null;
	var equalsId = null;
	console.log("DECLARATION");
	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		identifier = this.sequence.peek();
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.EQUAL) {
			equalsId = this.sequence.peek().img + parent;
			this.tree.add(equalsId, parent, this.tree.traverseDF);
			if (!this.declarationHandler(equalsId)) {
				return false;
			}
			this.tree.addBegining(identifier, equalsId, this.tree.traverseDF);
			return true;
		}
	}
	return false;
};

Syntactic.prototype.declarationHandler = function(parent) {
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.NEW) {
		return this.newExpression(parent);
	}
	else{
		var data = this.operation(parent, this.tree);
		console.log("Data :" );
		console.log(data);
		if (data != null) {
			if (this.sequence.peek().id == TOKENS.SEMI_COLON) {
			  return data;
		  }
		}

		//should never happen
		return false;
	}

	return false;
};

Syntactic.prototype.newExpression = function(parent) {
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

Syntactic.prototype.dump = function(parent) {
	console.log(this.sequence.peek().img);
	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		var filename = this.sequence.peek();
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.CONCATENATE) {
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
						if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
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


//retorna arvore modificada ou null em caso de erro
Syntactic.prototype.operation = function(parent, tree_) {
	console.log("OPERATION");
	if (this.sequence.peek().id == TOKENS.COMPLEMENT) {

		newTree = this.checkComplement(parent);
		if(newTree != null){
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);

				tree_.addTree(newTree, parent, tree_.traverseDF);
				return tree_;
			}
		}

	} else if (this.sequence.peek().id == TOKENS.REVERSE) {

		newTree = this.checkReverse(parent);
		if(newTree != null){
			var newParentTree = this.operationR(parent, tree_);
			//TODO operationR só retorna null em caso de erro
			//corrigir isto
			if(newParentNode != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				return newParentTree;
			}

			tree_.addTree(newTree, parent, tree_.traverseDF);
			return tree_;
		}

	} else if (this.sequence.peek().id == TOKENS.IDENTIFIER) {
		console.log("IDENTIFIER");
		var ident = this.sequence.peek().img;
		this.sequence.nextToken();
		var newParentNode = this.operationR(parent, tree_);
		if (newParentNode != null){
			tree_.addTree(newParentNode, parent, tree_.traverseDF);
			tree_.addBegining(ident, newParentNode._root.data, tree_.traverseDF);
			tree_.add(ident, parent, tree_.traverseDF);
			return tree_;
		}

	} else if (this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		newTree = this.checkParenteses(parent);
		if(newTree != null){
			var newParentTree = this.operationR(parent, tree_);
			if(newParentNode != null)
			{
				newParentTree.addTree(newTree, newParentTree._root, tree_.traverseDF);

				tree_.addTree(newTree, parent, tree_.traverseDF);
				return tree_;
			}
		}
	}

	return null;
};

Syntactic.prototype.checkReverse = function(parent) {
	if(this.sequence.peek().id == TOKENS.REVERSE) {
		var complementId = this.sequence.peek().img + this.opIndex++;
		var newTree = new Tree(complementId);
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.OPEN) {
			this.sequence.nextToken();
			var newTree_ = this.operation(complementId, newTree); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
			if (newTree_ != null) {
				if (this.sequence.peek().id == TOKENS.CLOSE) {
					this.sequence.nextToken();
					return newTree_;
				}
			}
		}
	}

	return null;
};

Syntactic.prototype.checkComplement = function(parent) {
	if(this.sequence.peek().id == TOKENS.COMPLEMENT) {
		var complementId = this.sequence.peek().img + this.opIndex++;
		var newTree = new Tree(complementId);
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.OPEN) {
			this.sequence.nextToken();
			var newTree_ = this.operation(complementId, newTree); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
			if (newTree_ != null) {
				if (this.sequence.peek().id == TOKENS.CLOSE) {
					this.sequence.nextToken();
					return newTree_;
				}
			}
		}
	}

	return null;
};


Syntactic.prototype.checkParenteses = function(parent) {
		var newTree_ = this.operation(parent, null); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
		if (newTree_ != null) {
			if (this.sequence.peek().id == TOKENS.CLOSE) {
				this.sequence.nextToken();
				return newTree_;
			}
		}

	return null;
};


// retorna o novo parentNode respetivo à OPC detetada. se nao houver qualquer OPC, retorna null
Syntactic.prototype.operationR = function(parent) {
	var tokenOP = this.checkOPC();
	var tokenOPId = "operationR" + this.opIndex++;
	var newTree = new Tree(tokenOPId);

	if (tokenOP != null) {
		tokenOPId = tokenOP.img + this.opIndex++;
		newTree = new Tree(tokenOPId);
		this.sequence.nextToken();
		data = this.operation(tokenOPId, newTree);
		return data;
	}

	return newTree;
};

Syntactic.prototype.checkOPC = function() {
	if (this.sequence.peek().id == TOKENS.MULTIPLY
		|| this.sequence.peek().id == TOKENS.CONCATENATE
		|| this.sequence.peek().id == TOKENS.INTERSECTION
		|| this.sequence.peek().id == TOKENS.UNION) {
			return this.sequence.peek();
		}

		return null;
};
