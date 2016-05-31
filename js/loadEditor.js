function openEditor() {
    $('#editorW').slideToggle("fast");
    $('#openEditor').slideToggle("fast");
}

var imported = document.createElement('script');
document.head.appendChild(imported);

function loadEditor() {

    if (automata == null || automata.length <= 0) {
      errorMsg("So the code can work, it's necessary to upload at least one file.");
      return;
    }
    //read(automataResult.dot,"mynetworkResult");

    $(function () {
        //lines = [];
        lines = document.getElementById("editor").value;//.split(/(?:\\[rn]|[\r\n]+)+/g);

        $(':input:not(#editor)').val('');
        $('#in').val('');
        $('#intable').empty();
        $('#rowToClone tr:not(:first)').not(function () {
            if ($(this).has('th').length) {
                return true;
            }
        }).remove();

        // FAZER A ANALISE LEXICAL ---------------------------------------------------

        //Start the lexical and syntatic analysis
        start(lines);

        //TODO compute the tree

        //Start

        $('#output').html("");

        $('#visualization').html("");

        variableName = '';
        data = [];
        //var lines = document.getElementById("editor").value.split(/(?:\\[rn]|[\r\n]+)+/g);


        //FAZER AQUI AS VERIFICAÇÕES TAGS

        // FAZER AQUI A VERIFICAÇÃO DO FICHEIRO ----------------------------------------------------------------------------------------------------- (tal como no ficheiro loadFile.js)
    });
}
