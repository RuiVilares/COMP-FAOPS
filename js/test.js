

function read(){
// provide data in the DOT language
var DOTstring = 'dinetwork {'+
  'A1 -> B1 [label=f];' + 
  'A2 -> B2 [label=f]; ' + 
  'A1 -> A2 [label=f]}';

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