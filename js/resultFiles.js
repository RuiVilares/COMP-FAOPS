var automataResult = new Array();
var indexResult = 1;

function newAutomataResult(newResult){
  automataResult[indexResult] = newResult;

  var navTabToAdd = "<li><a data-toggle='tab' href='#fileResult" + indexResult + "'>" + automataResult[indexResult].name + "</a></li>";
  var tabToAdd =  "<div id='fileResult" + indexResult + "' class='tab-pane fade in'>\n"+
                    "<div id='mynetworkResult" + indexResult + "'></div>\n"+
                    "<button class='btn btn-info footer col-md-3' onclick='downloadFile('teste.dot')'>Download DOT file</button>\n"+
                    "</div>";

  $("#navtabsResult").append(navTabToAdd);
  $("#contentTabsResult").append(tabToAdd);
  $('#navtabsResult a:last').tab('show');
  read(automataResult[indexResult].dot, "mynetworkResult" + indexResult);
  indexResult++;
}

function deleteAutomataResult(){
  automataResult = new Array();
  indexResult = 1;

  $("#navtabsResult").empty();
  $("#contentTabsResult").empty();

}
