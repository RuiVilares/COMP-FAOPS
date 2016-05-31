/*<div class="col-md-12">
  <div id="dropzone">Drop file here (txt)</div>
  <output id="list"></output>
</div>

var imported = document.createElement('script');
document.head.appendChild(imported);

var data = [];

var currentInput = 0;

var inputs = [];

var breakpoints = [];

function handleFileSelect(evt) {

    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var file = files[0];
    var textType = /text.*///;
/*
    if (file.type.match(textType)) {
        var reader = new FileReader();

        // FAZER AQUI A VERIFICAÇÃO DO FICHEIRO -----------------------------------------------------------------------------------------------------
        reader.onload = function (e) {
            readerResult = reader.result;

            //read file line by line
            var lines = readerResult.trim().split("\r\n");

            $('#editor').val(readerResult);

            /*

            //FAZER AQUI AS VERIFICAÇÕES TAGS

            var i = 0;
            while (i < lines.length) {
                // Condições linha a linha
                i++;
            }

            */
        /*};


        reader.readAsText(file);
        var dropZone = document.getElementById('dropzone');
        dropZone.innerHTML = "File upload successfully!";
    } else {
        window.alert("File not supported!");
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('dropzone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

*/

var automata = new Array();
var index = 1;

var inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
  var files = this.files;
  var file = files[0];
  var textType = /^[a-zA-Z][a-zA-Z0-9_\- \.]*\.dot/g;

  if (textType.test(file.name)) {
    var reader = new FileReader();
    reader.onload = function (e) {
      readerResult = reader.result;
      automata[index] = {id:"file"+index, name:file.name, dot:readerResult};

      document.getElementById("input").value = "";
      var listFiles = document.getElementsByClassName("listFiles").innerHTML;
      var buttonToAdd = "<li data-id='" + index +"' class='fileItem btn btn-success col-md-11'>" + automata[index].name + "</li><button data-id='" + index +"' class='btn btn-danger pull-right'>X</button>";
      var navTabToAdd = "<li><a data-toggle='tab' href='#file" + index + "'>" + automata[index].name + "</a></li>";
      var tabToAdd = "<div id='file" + index + "' class='tab-pane fade in'><div id='mynetwork" + index + "'></div></div>";
      $(".listFiles").append(buttonToAdd);
      $("#navtabs").append(navTabToAdd);
      $("#contentTabs").append(tabToAdd);
      $('#navtabs a:last').tab('show');
      read(readerResult, "mynetwork" + index);

      var nfa = new NFA_to_DFA(readerResult);
      TreeProcess.hashmapFiles[file.name] = nfa.convert();

      index++;
      fileListener();
    }
    textType.lastIndex = 0;
    reader.readAsText(file);
    swal("Success!", "File successfully uploaded!", "success");
  } else {
    swal("Error!", "File not supported!", "error");
  }
}

function fileListener(){
  id = $(this).attr("data-id");
  $( ".listFiles li" ).click(function() {
    id = $(this).attr("data-id");
    swal(automata[id].name, automata[id].dot);
  });
  $( ".listFiles button" ).click(function() {
    id = $(this).attr("data-id");
    $(".listFiles li[data-id='" + id + "']").remove();
    $(".listFiles button[data-id='" + id + "']").remove();
    $("#navtabs a[href='#file" + id +"']").remove();
    $("#contentTabs #file" + id).remove();
    if($('#navtabs >li').size() > 0)
      $('#navtabs a:last').tab('show');
    automata.splice(id, 1);
  });
}

function read(DOTstring, mynetwork){
  var parsedData = vis.network.convertDot(DOTstring);
  var container = document.getElementById(mynetwork);
  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  var options = parsedData.options;

  //change canvas size
  options.height = '400px';
  options.interaction = {hover: true};

  // you can extend the options like a normal JSON variable:
  options.nodes = {
    color: 'blue'
  }

  // create a network
  var network = new vis.Network(container, data, options);

  checkNodes(data.nodes);
};

//ve se tem estado inicial e final
function checkNodes(nodes){
  if (!checkValidFA(nodes)) {
    //TODO change error message
    window.alert('The finite automata is required to have a initial state and at least one final.\n' +
                  'Epsilon states require the label $ (dollar sign). Each transition can have multiple inputs. ' +
                  'Therefore, multiple inputs can be represented by being separated by a comma.\n' +
                  'Valid NFA (Non-Deterministic Finite Automata) example:\n' +
                  'dinetwork { '+
                  'A -> B [label="$"]; ' +
                  'A -> C [label="0"]; ' +
                  'B -> C [label="1"]; ' +
                  'A[ color=blue, shape=triangle] '+
                  'B[ color=blue, shape=circle] '+
                  'C[ color=red, shape=circle] '+
                  '}');
  }
	if(!checkInitial(nodes)){
		//TODO change error message
		window.alert('Initial state is not correctly defined. Its shape is a triangle.');
	}
  if (!checkFinal(nodes)) {
    //TODO change error message
		window.alert('Final state is not correctly defined. Its color is red.');
  }
};

function checkValidFA(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (!(validShape(nodes[i]) && validTransition(nodes[i]) && validColor(nodes[i]))) {
      return false;
    }
  }

  return true;
};

function validShape(node) {
  return node.shape == "triangle" || node.shape == "circle";
};

function validTransition(node) {
  return node.to != null && node.from != null;
};

function validColor(node) {
  return node.color != null && (checkColor(node, "red") || checkColor(node, "blue"));
};

function checkColor(node, color) {
  return node.background == color && node.border == color;
};

function checkInitial(nodes) {
  var cnt = 0;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].shape == "triangle")
      cnt++;
  }

  return cnt == 1;
};

function checkFinal(nodes) {
  var cnt = 0;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color != null && nodes[i].color.background == "red" && nodes[i].color.border == "red")
      cnt++;
  }

  return cnt > 0;
};
