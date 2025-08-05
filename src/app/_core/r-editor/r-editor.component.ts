import { Component, OnInit } from '@angular/core';
declare var Konva: any;
@Component({
  selector: 'app-r-editor',
  templateUrl: './r-editor.component.html',
  styleUrls: ['./r-editor.component.scss']
})
export class REditorComponent implements OnInit {

  constructor() { }

  ngAfterViewInit(): void {
    // Create a stage
    var stage = new Konva.Stage({
      container: 'konva', // HTML container element
      width: window.innerWidth, // Set the width to the window's width (100%)
      height: 843, // Fixed height of 843 pixels
    });

    // Create a layer
    var layer = new Konva.Layer();


    // Create an image
    var imageObj = new Image();
    imageObj.src = 'http://ds.iqtv.in/iqsignage/iqworld/8/ALL/Both%20mediatype/IQ_WORLD_293.png';

    imageObj.onload = function () {
      var konvaImage = new Konva.Image({
        x: 50,
        y: 50,
        image: imageObj,
        width: 200, // specify the width of the image
        height: 100  // specify the height of the image
      });

      // Add the image to the layer
      layer.add(konvaImage);

      // Add the layer to the stage
      stage.add(layer);

      // Draw the stage
      stage.draw();
    }
  }
  ngOnInit(): void {

  }

}