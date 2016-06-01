var Syntactic = function(sequence) {
	this.sequence = sequence;
	this.tree = null;
	this.opIndex = 0;

	this.variables = [];

	this.syntacticAnalysis();
};

Syntactic.prototype.syntacticAnalysis = function() {
	if(this.sequence.tokens.length == 0)
		return;

	if(this.S())
		console.log("Correct Syntactic construction of the statement.");
	else
		console.error("Error on statement's construction.");
};

/**
 * @return {boolean} [Returns true is the tree was successfuly created or false, otherwise]
 */
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

/**
 * @param  {[Node]} [Parent Node to which the new subtree will be added]
 * @return {[Tree]} [New generated subTree]
 */
Syntactic.prototype.expressionHandler = function(parent) {
	this.tree.add(parent, 'START', this.tree.traverseDF, null);

	if(this.sequence.peek().id == TOKENS.DECLARATION) {
		this.sequence.nextToken();
		return this.declaration(parent);
	}
	return this.dump(parent);
};

Syntactic.prototype.declaration = function(parent) {
	var identifier = null;
	var equalsId = null;

	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		if (this.variables[this.sequence.peek().img] != null) {
			warningMsg("Variable '" + this.sequence.peek().img + "' is already defined.");
		}
		identifier = this.sequence.peek();
		this.variables[this.sequence.peek().img] = true;
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.EQUAL) {
			equalsId = this.sequence.peek().img + parent;
			this.tree.add(equalsId, parent, this.tree.traverseDF, this.sequence.peek());
			this.tree.add(identifier.img, equalsId, this.tree.traverseDF, identifier);
			return this.declarationHandler(equalsId);
		}
	}
	return false;
};

Syntactic.prototype.declarationHandler = function(parent) {
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.NEW) {
		return this.newExpression(parent);
	}
	else
	{
		var data = this.operation(parent, this.tree);
		if (data != null)
		{
			if (this.sequence.peek().id == TOKENS.SEMI_COLON)
			  return true;
		}
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
				if (!this.fileExists(this.sequence.peek().img)) {
					errorMsg("File '" + this.sequence.peek().img +"' does not exist.");
					return null;
				}
				this.tree.add(this.sequence.peek().img, parent, this.tree.traverseDF, this.sequence.peek());
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

Syntactic.prototype.fileExists = function(filename) {
	for (var i = 1; i < automata.length; i++) {
		if (automata[i].name == filename)
			return true;
	}

	return false;
};

Syntactic.prototype.dump = function(parent) {
	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		if (this.variables[this.sequence.peek().img] == null) {
			errorMsg("Variable '" + this.sequence.peek().img + "' is used but not defined.");
			return false;
		}
		var dfa = this.sequence.peek();
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.CONCATENATE) {
			this.sequence.nextToken();
			if(this.sequence.peek().id == TOKENS.DUMP) {
				var dump = this.sequence.peek().img + parent;
				this.tree.add(dump, parent, this.tree.traverseDF, this.sequence.peek());
				this.tree.add(dfa.img, dump, this.tree.traverseDF, dfa);
				this.sequence.nextToken();
				if(this.sequence.peek().id == TOKENS.OPEN) {
					this.sequence.nextToken();
					if(this.sequence.peek().id == TOKENS.QUOTE) {
						this.sequence.nextToken();
						if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
							this.tree.add(this.sequence.peek().img, dump, this.tree.traverseDF, this.sequence.peek());
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
	if (this.sequence.peek().id == TOKENS.COMPLEMENT) {

		var newTree = this.checkComplement();
		if(newTree != null)
		{
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);
			}
			else tree_.addTree(newTree, parent, tree_.traverseDF);
			return tree_;
		}

	} else if (this.sequence.peek().id == TOKENS.REVERSE) {

		var newTree = this.checkReverse();
		if(newTree != null)
		{
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);
			}
			else tree_.addTree(newTree, parent, tree_.traverseDF);

			return tree_;
		}

	} else if (this.sequence.peek().id == TOKENS.IDENTIFIER) {

		if (this.variables[this.sequence.peek().img] == null) {
			errorMsg("Variable '" + this.sequence.peek().img + "' is used but not defined.");
			return false;
		}

		var ident = this.sequence.peek();
		this.sequence.nextToken();
		var newParentTree = this.operationR(parent, tree_);
		if (newParentTree != null){
			tree_.addTree(newParentTree, parent, tree_.traverseDF);
			tree_.addBegining(ident.img, newParentTree._root.data, tree_.traverseDF, ident);
		}
		else tree_.add(ident.img, parent, tree_.traverseDF, ident);

		return tree_;

	} else if (this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		newTree = this.checkParenteses(parent);
		if(newTree != null)
		{
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);
			}
			else tree_.addTree(newTree, parent, tree_.traverseDF);

			return tree_;
		}
	}

	return null;
};


Syntactic.prototype.checkReverse = function() {
	var reverseId = this.sequence.peek().img + this.opIndex++;
	var newTree = new Tree(reverseId, this.sequence.peek());
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		var newTree_ = this.operation(reverseId, newTree); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
		if (newTree_ != null) {
			if (this.sequence.peek().id == TOKENS.CLOSE) {
				this.sequence.nextToken();
				return newTree_;
			}
		}

	}
	return null;
};


Syntactic.prototype.checkComplement = function() {
	var complementId = this.sequence.peek().img + this.opIndex++;
	var newTree = new Tree(complementId, this.sequence.peek());
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
	return null;
};


Syntactic.prototype.checkParenteses = function() {
	var	parent = "precedence" + this.opIndex++;
	var tree_ = new Tree(parent);
	var newTree_ = this.operation(parent, tree_); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
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

	if (tokenOP != null) {
		var tokenOPId = tokenOP.img + this.opIndex++;
		var newTree = new Tree(tokenOPId, tokenOP);
		this.sequence.nextToken();
		var data = this.operation(tokenOPId, newTree);
		return data;
	}

	return null;
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
