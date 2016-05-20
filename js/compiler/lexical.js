function start(code) {
  var sequence = new Seq();

  var initial = 0;

  try {
    while (initial < code.length) {
      if (code[initial] == ' ' || code[initial] == '\n') {
        initial++;
        continue;
      }
      var subText = code.substring(initial, code.length);
      var token = new Token();
      var step = token.create(subText);
      if (step != 0) {
        sequence.add(token);
        initial += step;
      } else {
        throw "Invalid token: " + subText;
      }
    }
  } catch (err) {
    //TODO: display message should be changed
    window.alert(err);
  }

  var syntax = new Syntactic(sequence);

  //compute
  var processTree = new TreeProcess(syntax.tree);
  //processTree.compute();
  //var nfa = new NFA_to_DFA("");
  //console.log(nfa.convert());

  var dfa = new Reverse("");
  var newdfa = dfa.compute();
  console.log(newdfa.data);
};
