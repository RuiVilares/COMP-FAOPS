function downloadFile(filename) {
  var dfa = new Dump(automata[0]);
  var newdfa = dfa.compute();

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(newdfa));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}
