this.TOKENS = {
  OPEN : {img: /^\(/g},
  CLOSE : {img: /^\)/g},
  MULTIPLY : {img: /^\*/g},
  CONCATENATE : {img: /^\./g},
  COMPLEMENT : {img: /^not/g},
  REVERSE : {img: /^rev/g},
  INTERSECTION : {img: /^int/g},
  UNION : {img: /^\+/g},
  EQUAL : {img: /^=/g},
  SEMI_COLON : {img: /^;/g},
  NEW : {img: /^new/g},
  QUOTE : {img: /^\"/g},
  DUMP : {img: /^dump/g},
  DECLARATION : {img: /^FA/g},
  IDENTIFIER : {img: /^[a-zA-Z][a-zA-Z0-9\-_]*/g},
  FILENAME : {img: /^[a-zA-Z][a-zA-Z0-9_\- \.]*\.dot/g}
};

var Token = function(id, img) {
  this.id = id;
  this.img = img;
};

Token.prototype.getId = function(code) {
  var biggestMatch = 0;
  var index;

  for (var tk in TOKENS) {
    var prop = TOKENS[tk];
    if (prop.img.test(code)) {
      if (biggestMatch < prop.img.lastIndex) {
        biggestMatch = prop.img.lastIndex;
        this.id = tk;
        this.img = code.substring(0, biggestMatch);
      }
    }
  }

  return biggestMatch;
};
