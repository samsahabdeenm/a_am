var Inputeditor = ace.edit("htmlInput");
var FileName;
Inputeditor.session.setMode("ace/mode/html");
Inputeditor.setOption("showGutter", true);
var content = "<html><head></head><body><h1 id='sample'>My First Heading</h1><p>My first paragraph.</p></body></html>";
Inputeditor.setValue(content, -1);
Inputeditor.setOption("fontSize", "17px");

var editor = ace.edit("beautifiedHtml");
editor.session.setMode("ace/mode/html");
editor.setOption("showGutter", true);

function beautifyHTML() {
    debugger;
    var htmlInput = Inputeditor.getValue();
    var doc = beautify(htmlInput);
    editor.setValue(doc, -1);
    //document.getElementById("beautifiedHtml").innerText = doc;
}
function beautify(htmlInput) {
    return html_beautify(htmlInput);
}
function toolMaximizestate()
{
    var Container = document.getElementById('editor_wrapper_id');
    var opContainer = document.getElementById('beautifiedHtml');
    var ipContainer = document.getElementById('htmlInput');
    var iconStateMax = document.getElementById('toolMaximized');
    var iconStateMin = document.getElementById('toolMinimized');
    if(Container.classList.contains('editor_maxwidth'))
        {
            Container.classList.remove('editor_maxwidth');
            opContainer.classList.remove('tollMaxHeight');
            ipContainer.classList.remove('tollMaxHeight');
            iconStateMax.classList.remove('dN');
            iconStateMin.classList.add('dN');
        }

        else
        {
            Container.classList.add('editor_maxwidth');
            opContainer.classList.add('tollMaxHeight');
            ipContainer.classList.add('tollMaxHeight');
            iconStateMax.classList.add('dN');
            iconStateMin.classList.remove('dN');
        }

}
function downloadHTML()
{
  var content = editor.getValue();
  var blob = new Blob([content], {type: "text/html"});
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  if(FileName == undefined)
  {
    FileName = 'index'
  }
  a.download = FileName+"_formatted.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function copyHTML()
{
  var content = editor.getValue();
  navigator.clipboard.writeText(content)
      .then(function() {
          alert("Content copied to clipboard!");
      })
      .catch(function(error) {
          alert("Failed to copy content: " + error);
      });
}
function triggerFileUpload() {
    document.getElementById('fileInput').click();
}
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      Inputeditor.setValue(content, -1);
      FileName = file.name.replace(/\.[^/.]+$/, "");
    };
    reader.readAsText(file);
  });