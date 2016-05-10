

function read(){
// provide data in the DOT language
var DOTstring = 'dinetwork {'+
  'A1 -> B1 [label=1];' +
  'A1 -> A1 [label=0]; ' +
  'B1 -> A1 [label=0];'+
 'A1[ color=red, shape=triangle]'+
'}';

var DOTstringB = 'dinetwork {'+
  'A1 -> B1 [label=0];' +
  'A1 -> A1 [label=1]; ' +
  'B1 -> A1 [label=1];'+
 'A1[ color=red, shape=triangle]'+
'}';

var parsedData = vis.network.convertDot(DOTstring);
var container = document.getElementById('mynetwork');
var data = {
  nodes: parsedData.nodes,
  edges: parsedData.edges
}

var options = parsedData.options;

// you can extend the options like a normal JSON variable:
options.nodes = {
  color: 'blue'
}

// create a network
var network = new vis.Network(container, data, options);
};

//ve se tem estado inicial e final
function checkNodes(){
	var initialState=searchStringInArray('shape: triangle',nodes);
	if(searchStringInArray!=1){
		// TODO
		window.alert('Sem estado inicial');
	}
	var finalState=searchStringInArray('shape: circle',nodes);
	var finalState1=searchStringInArray('shapeProperties:{borderDashes:true}',nodes);
	if(finalState!=1 &&	finalState1!=1){
		window.alert('Sem estado final');
	}

};
function searchStringInArray (str, strArray) {
	var count=0;
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
        count++;
    }
    return count;
};
