function downloadFile(indexRes) {

  var dfa = new Dump(automataResult[indexRes].dot);
  var newdfa = dfa.compute();

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(newdfa));
  element.setAttribute('download', automataResult[indexRes].name);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}
