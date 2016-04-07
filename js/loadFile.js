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
    var textType = /text.*/;

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
        };


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