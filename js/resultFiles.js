var automataResult = new Array();
var indexResult = 1;

function newAutomataResult(newResult, nameResult){
  automataResult[indexResult] = {dot:newResult, name:nameResult};
  
  var navTabToAdd = "<li><a data-toggle='tab' href='#fileResult" + indexResult + "'>" + automataResult[indexResult].name + "</a></li>";
  var tabToAdd =  "<div id='fileResult" + indexResult + "' class='tab-pane fade in'>\n"+
                    "<div id='mynetworkResult" + indexResult + "'></div>\n"+
                    "<button class='btn btn-info footer col-md-3' onclick='downloadFile(" + indexResult + ")'>Download DOT file</button>\n"+
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
