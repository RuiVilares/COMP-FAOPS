function openEditor() {
    $('#editorW').slideToggle("fast");
    $('#openEditor').slideToggle("fast");
}


var imported = document.createElement('script');
document.head.appendChild(imported);

function loadEditor() {

    read(automata[1].dot,"mynetworkResult")

    $(function () {
        lines = [];
        lines = document.getElementById("editor").value.split(/(?:\\[rn]|[\r\n]+)+/g);

        $(':input:not(#editor)').val('');
        $('#in').val('');
        $('#intable').empty();
        $('#rowToClone tr:not(:first)').not(function () {
            if ($(this).has('th').length) {
                return true
            }
        }).remove();

        // FAZER A ANALISE LEXICAL ---------------------------------------------------
        //for debug for now
        var code = "FA A = new(\"ola.dot\");\n"
                  +"FA B = (O + P) + rev(K+C) + L;\n"
                  +"B.dump(\"dot\");";

        //Start the lexical analysis
        //start(lines);
        start(code);

        $('#output').html("");

        $('#visualization').html("");

        variableName = '';
        data = [];
        data = [];
        //var lines = document.getElementById("editor").value.split(/(?:\\[rn]|[\r\n]+)+/g);


        //FAZER AQUI AS VERIFICAÇÕES TAGS

        // FAZER AQUI A VERIFICAÇÃO DO FICHEIRO ----------------------------------------------------------------------------------------------------- (tal como no ficheiro loadFile.js)
    });
}
