function start() {
  var sequence = new Seq();

  var initial = 0;
  //var code = "FA A = new FA(\"ola.dot\");";
  var code = "FA A = A int B";
  while (initial < code.length) {
    var subText = code.substring(initial, code.length);
    if (subText[0] == ' ') {
      initial++;
      continue;
    }
    subText = subText.trim();
    var token = new Token();
    var step = token.getId(subText);
    if (step != 0) {
      sequence.add(token);
      initial += step;
    } else {
      //window.alert(subText);
    }
  }

  for (var i = 0; i < sequence.tokens.length; i++) {
    console.log(sequence.tokens[i]);
  }

  var syntax = new SyntacticAnalysis(sequence);
};
