async function loadCommonLayout() {
    const headerContainer = document.getElementById('header-menu');
    const footerContainer = document.getElementById('footer-menu');

    const requests = [];

    if (headerContainer) {
        requests.push(
            fetch('header-menu.html')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Failed to load header-menu.html');
                    }
                    return response.text();
                })
                .then(function (html) {
                    headerContainer.innerHTML = html;
                })
        );
    }

    if (footerContainer) {
        requests.push(
            fetch('footer-menu.html')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Failed to load footer-menu.html');
                    }
                    return response.text();
                })
                .then(function (html) {
                    footerContainer.innerHTML = html;
                })
        );
    }

    if (requests.length) {
        try {
            await Promise.all(requests);
        } catch (error) {
            console.error(error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCommonLayout();

    if (typeof ace === 'undefined') {
        return;
    }

    var inputElement = document.getElementById('htmlInput');
    var outputElement = document.getElementById('beautifiedHtml');
    var fileInput = document.getElementById('fileInput');

    if (!inputElement || !outputElement || !fileInput) {
        return;
    }

    window.Inputeditor = ace.edit('htmlInput');
    window.FileName = undefined;
    window.Inputeditor.session.setMode('ace/mode/html');
    window.Inputeditor.setOption('showGutter', true);
    var content = "<html><head></head><body><h1 id='sample'>My First Heading</h1><p>My first paragraph.</p></body></html>";
    window.Inputeditor.setValue(content, -1);
    window.Inputeditor.setOption('fontSize', '17px');

    window.editor = ace.edit('beautifiedHtml');
    window.editor.session.setMode('ace/mode/html');
    window.editor.setOption('showGutter', true);

    fileInput.addEventListener('change', function (event) {
        var file = event.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var fileContent = e.target.result;
            window.Inputeditor.setValue(fileContent, -1);
            window.FileName = file.name.replace(/\.[^/.]+$/, '');
        };
        reader.readAsText(file);
    });
});

function beautifyHTML() {
    if (!window.Inputeditor || !window.editor || typeof html_beautify === 'undefined') {
        return;
    }
    var htmlInput = window.Inputeditor.getValue();
    var doc = html_beautify(htmlInput);
    window.editor.setValue(doc, -1);
}

function toolMaximizestate() {
    var container = document.getElementById('editor_wrapper_id');
    var opContainer = document.getElementById('beautifiedHtml');
    var ipContainer = document.getElementById('htmlInput');
    var iconStateMax = document.getElementById('toolMaximized');
    var iconStateMin = document.getElementById('toolMinimized');

    if (!container || !opContainer || !ipContainer || !iconStateMax || !iconStateMin) {
        return;
    }

    if (container.classList.contains('editor_maxwidth')) {
        container.classList.remove('editor_maxwidth');
        opContainer.classList.remove('tollMaxHeight');
        ipContainer.classList.remove('tollMaxHeight');
        iconStateMax.classList.remove('dN');
        iconStateMin.classList.add('dN');
    } else {
        container.classList.add('editor_maxwidth');
        opContainer.classList.add('tollMaxHeight');
        ipContainer.classList.add('tollMaxHeight');
        iconStateMax.classList.add('dN');
        iconStateMin.classList.remove('dN');
    }
}

function downloadHTML() {
    if (!window.editor) {
        return;
    }
    var content = window.editor.getValue();
    var blob = new Blob([content], { type: 'text/html' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);

    if (window.FileName === undefined) {
        window.FileName = 'index';
    }

    a.download = window.FileName + '_formatted.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function copyHTML() {
    if (!window.editor) {
        return;
    }
    var content = window.editor.getValue();
    navigator.clipboard.writeText(content)
        .then(function () {
            alert('Content copied to clipboard!');
        })
        .catch(function (error) {
            alert('Failed to copy content: ' + error);
        });
}

function triggerFileUpload() {
    var fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    }
}