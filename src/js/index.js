import * as $ from 'jquery';
import Radio from "./Radio";
let file = [];
function readFile(object) {
  file = object.files[0];
  let reader = new FileReader();
  reader.onload = function() {
    let text = reader.result.split('\n');
    let staticCoordinate = text[0];
    staticCoordinate = staticCoordinate.split(',');
    text.splice(0, 1);
    staticCoordinate  = staticCoordinate.map(function(item) {
      let number = parseInt(item);
      return isNaN(number)? item : number;
    });
    new Radio('#main', {
      coordinateRadio: [
        { x: staticCoordinate[0], y: staticCoordinate[1] },
        { x: staticCoordinate[2], y: staticCoordinate[3] },
        { x: staticCoordinate[4], y: staticCoordinate[5] }
      ],
      signalReceivingTime: [
        { dt1: text }
      ]
    });
  };
  reader.readAsText(file)
}
document.getElementById('render').onclick = function () {
  readFile(document.getElementById('file'));
};



