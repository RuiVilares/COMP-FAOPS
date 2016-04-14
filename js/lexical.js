function start() {
  var sequence = new Seq();

  var initial = 0;

  var code = "FA A = new(\"ola.dot\");\nFA B = T + not(A+C) * Y;\nB.dump(\"dot\");";
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

  //to display the information
  //can be deleted
  //for debug only
  for (var i = 0; i < sequence.tokens.length; i++) {
    console.log(sequence.tokens[i]);
  }

  var syntax = new Syntactic(sequence);
};
