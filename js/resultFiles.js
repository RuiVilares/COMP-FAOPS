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
  readResult(automataResult[indexResult].dot, "mynetworkResult" + indexResult);
  indexResult++;
}

function deleteAutomataResult(){
  automataResult = new Array();
  indexResult = 1;

  $("#navtabsResult").empty();
  $("#contentTabsResult").empty();
}

function readResult(DOTstring, mynetwork){
  var parsedData = vis.network.convertDot(DOTstring);
  var container = document.getElementById(mynetwork);
  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  var options = parsedData.options;

  options.height = '400px';

  // you can extend the options like a normal JSON variable:
  options.nodes = {
    color: 'blue'
  }

  // create a network
  var network = new vis.Network(container, data, options);
};
