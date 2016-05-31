function downloadFile(indexRes) {

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(automataResult[indexRes].dot));
  element.setAttribute('download', automataResult[indexRes].name);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);

}
