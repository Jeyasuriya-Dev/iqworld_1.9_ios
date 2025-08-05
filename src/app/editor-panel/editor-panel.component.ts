import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../_core/services/storage.service';
import { ClientService } from '../_core/services/client.service';
import { LoaderComponent } from '../_core/loader/loader.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../_core/services/alert.service';
import { SweetAlertService } from '../_core/services/sweet-alert.service';
import { clienturl } from '../api-base';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, filter, fromEvent } from 'rxjs';
import { FormControl } from '@angular/forms';
import { VistaComponent } from '../_core/vista/vista.component';

// import * as ffmpeg from 'fluent-ffmpeg';



declare var fabric: any;
declare var Konva: any;
interface bothPreview {
  // file: File;
  url: string;
  type: string,
  id: string
}
@Component({
  selector: 'app-editor-panel',
  templateUrl: './editor-panel.component.html',
  styleUrls: ['./editor-panel.component.scss']
})


export class EditorPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('inputSearch', { static: true }) input!: ElementRef;
  private inputSubject = new Subject<string>();
  canvas: any;
  image: any;
  isText: any = false;
  ImageList: any = []
  both: bothPreview[] = [];
  private stage: any;
  private layer: any;
  private transformer: any;
  isVertical = "true";
  konvaImage: any;
  selectedObject: any;
  backgroundRect: any;
  addedtext: any;
  editTextIndex: number = -1;
  inputField!: HTMLInputElement;
  totalFrames = 300;
  clientUsername: any
  Playlist: any = [];
  convertData: any = [];
  // shapesList = clienturl.getShapes();
  colorsList = clienturl.getColors();
  @ViewChild('canvas') fabricCanvas!: ElementRef;
  choosePlaylist: any = "none";
  konvaHeight: any = "1080"
  konvaWidth: any = "1920";
  backgroundColor = "#ffffff";
  fontList: any = []
  newfontList: any = [];
  selectedFont: any = 'Poppins';
  selectedFontSize: any;
  templateid: any;
  mediafileid: any = null;
  template: any;
  templateList: any = [];
  templatename: any;
  choosedTemplateType: any = "none";


  ismobileview: boolean = false;
  isSystemview: boolean = false;


  constructor(private alert: AlertService, private router: Router, private activatedRoute: ActivatedRoute, private storageService: StorageService, private Alert: SweetAlertService, private clientService: ClientService, private matDialog: MatDialog) {
    this.inputSubject.pipe(
      debounceTime(1000) // Adjust debounce time as needed
    ).subscribe(value => {
      console.log(value);
      // Here you can perform further actions with the debounced value
      let payload = {
        templatename: value,
        clientname: this.clientUsername
      }
      clientService.searchTemplatesByNameNdClientName(payload).subscribe((res: any) => {
        this.templateList = res;
      })
    });
    this.mediafileid = this.activatedRoute.snapshot.paramMap.get('id');
    let payload = {
      mediafile: [this.mediafileid],
      template: []
    }
    this.clientService.getTemplateByMediaId(payload).subscribe((res: any) => {
      console.log(res);
      this.template = res;
      if (res?.properties) {
        this.retrievePlayground(res.properties);
      } else {
        this.mediafileid = null;
      }
    }, err => {

      alert.showError(err?.error?.message)
    });
    console.log(this.mediafileid);

    // clientService.getAllTemplates().subscribe(res => {
    //   // console.log(res);
    //   this.templateList = res;
    // }, err => {
    //   alert.showError(err?.error?.message)
    // })

    if (window.innerWidth >= 360 && window.innerWidth <= 450) {
      this.ismobileview = true;
    } else {
      this.isSystemview = true;
    }

  }

  onInput(event: any) {
    // console.log(event.target.value);
    this.inputSubject.next(event.target.value);
  }
  async tempalete(e: any) {
    const response = await fetch(e);
    const movies = await response.json();
    console.log(movies);
  }
  ngOnInit(): void {
    this.clientUsername = this.storageService.getClientUsername();
    // console.log(this.clientUsername);
    this.clientService.getFontList().subscribe(res => {
      this.fontList = res;
      // console.log(this.fontList);
      this.fontList.forEach((element: any) => {
        // console.log(element);
        // console.log(
        this.clientService.convertUrlToDataUri(element?.url)
        // );
        // const fontDataUri = `data:application/font-woff;charset=utf-8;base64,${btoa(element.url)}`;
        this.applyFontStyle1(element?.url, element.fontname)
      });
    })
    this.clientService.getEditorUploadFiles(this.clientUsername).subscribe((res: any) => {
      // res.forEach((e: any) => {
      //   if (!this.both.some((item: any) => item.id === e.id)) {
      //     this.both.push(e);
      //   }
      // });
      this.both = res
    });
    this.changeTab('tab-upload', 'upload');
    let payload1 = {
      templatename: '',
      clientname: this.clientUsername
    }
    this.clientService.searchTemplatesByNameNdClientName(payload1).subscribe((res: any) => {
      this.templateList = res;
    })
  }
  fitToPage() {
    // console.log(this.selectedObject);
    // console.log(this.stage);
    this.selectedObject.attrs.width = this.stage.attrs.width
    this.selectedObject.attrs.height = this.stage.attrs.height
    this.selectedObject.attrs.x = 1;
    this.selectedObject.attrs.y = 1;
    // this.ngOnInit();
    this.stage.batchDraw();
  }
  makeBold() {
    this.stage.batchDraw();
  }
  makeItalic() {
    if (this.selectedObject?.attrs?.fontStyle == 'Italic') {
      this.selectedObject.attrs.fontStyle = 'Normal'
    } else {
      this.selectedObject.attrs.fontStyle = 'Italic'
    }
    this.stage.batchDraw();
  }
  onFileChange(event: any) {
    // console.log(event);
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      // console.log(file);
      // this.readFontFile(file);
      let fd = new FormData();
      fd.set("file", file);
      fd.set('clientname', this.clientUsername);
      fd.set('filename', file.name)
      fd.set('fontname', file.name.split(".")[0])
      this.readFontFile(file);
      this.clientService.uploadFontFile(fd).subscribe((res: any) => {
        // console.log(res);
        this.fontList.push(res);
        this.newfontList.push(res);
        // this.fontList = res?.list;
      })
    }
  }
  readFontFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Read the font file data as a base64-encoded string
      const fontData = e.target.result;
      // Create a data URI for the font file
      const fontDataUri = `data:application/font-woff;charset=utf-8;base64,${btoa(fontData)}`;
      // Apply the font using @font-face
      this.applyFontStyle(fontDataUri, file.name.split(".")[0]);
    };
    reader.readAsBinaryString(file);
  }
  applyFontStyle(fontDataUri: string, Fontname: string) {
    this.selectedFont = Fontname; // You can use any font name here
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(`
      @font-face {
        font-family: '${Fontname}';
        src: url('${fontDataUri}') format('truetype');
      }
    `));

    document.head.appendChild(style);
  }
  applyFontStyle1(fontFileUrl: string, Fontname: string) {
    // this.selectedFont = Fontname; // You can use any font name here
    fetch(fontFileUrl)
      .then(response => response.arrayBuffer())
      .then(fontDataArrayBuffer => {
        const fontDataBlob = new Blob([fontDataArrayBuffer]);
        const fontDataUri = URL.createObjectURL(fontDataBlob);

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(`
        @font-face {
          font-family: '${Fontname}';
          src: url('${fontDataUri}') format('truetype');
        }
      `));

        document.head.appendChild(style);
      })
      .catch(error => {
        console.error('Error fetching font:', error);
      });
  }
  changeKonvaResolution(w: number, h: number) {
    // console.log(w);
    // console.log(h)

    this.konvaHeight = Math.round(h / 3);
    this.konvaWidth = Math.round(w / 3);
    this.stage?.width(this.konvaWidth);
    this.stage?.height(this.konvaHeight);
  }
  ngAfterViewInit() {

    this.canvas = new fabric.Canvas("canvas", {
      width: 500,
      height: 500,
      selection: false

    });

    // konva
    this.stage = new Konva.Stage({
      container: "konva",
      width: this.konvaHeight / 3,
      height: this.konvaWidth / 3,
      background: 'black'
    });
    this.stage.container().style.backgroundColor = 'white';
    this.backgroundColor = 'white'
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    // this.retrievePlayground(this.o)
    this.stage.on("click", (e: any) => {
      const clickedObject = e.target;
      // console.log(clickedObject);
      // Check if the clicked object is different from the currently selected one
      if (this.selectedObject !== clickedObject) {
        // Deselect the currently selected object
        if (this.selectedObject) {
          this.transformer.detach();
        }

        // Set the selected object
        this.selectedObject = clickedObject;

        if (this.selectedObject instanceof Konva.Text) {
          this.isText = true;
          // this.transformer = new Konva.Transformer({
          //   nodes: [this.selectedObject],
          //   anchorSize: 8,
          //   borderStroke: 'blue',
          //   anchorStroke: 'blue',
          //   anchorFill: 'white',
          //   keepRatio: true, // Enable maintaining aspect ratio during scaling
          //   centeredScaling: false, // Allow scaling from the edges
          //   // rotationSnaps: [0, 90, 180, 270], // Rotation snaps
          // });

        } else {
          this.transformer = new Konva.Transformer({
            nodes: [this.selectedObject],
            keepRatio: true, // Maintain the aspect ratio while resizing
          });
          this.isText = false;
        }
        // Attach the transformer to the selected object

        // Add the transformer to the layer
        const layer = this.selectedObject.getLayer();
        layer.add(this.transformer);
        this.transformer.attachTo(this.selectedObject);
        // this.transformer.nodes(this.selectedObject)
        layer.draw();
      } else {
        // if (!this.selectedObject) {
        //   this.transformer.detach();

        // }
      }
      if (this.selectedObject) {
        let playgroundOptions = document.querySelectorAll(".playground-undo button");
        // console.log(playgroundOptions);
        [].forEach.call(playgroundOptions, (obj: any) => {
          obj.classList.remove("bp4-disabled")
          obj.style.color = "white"
          obj.style.cursor = "pointer"
          obj.disabled = false;
        })
      }
      if (e.target) {
        // this.enableTextEditing();
      }
    })
    this.transformer.on('transform', () => {
      // Remove the old layer after the transform is complete
      this.stage.remove(this.layer);
      this.stage.draw();
    });
    this.addedtext.on('transform', () => {
      // reset scale, so only with is changing by transformer
      this.addedtext.setAttrs({
        width: this.addedtext.width() * this.addedtext.scaleX(),
        scaleX: 1,
      });
    });

    this.transformer = new Konva.Transformer({
    });
    this.layer.add(this.transformer);
    this.stage.draw();

  }
  drag(event: DragEvent | any) {
    // console.log(event.target.children[0].children);
    // console.log(event?.target.textContent);

    if (event.target.textContent) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer?.setData("text", event.target.textContent)
      event.currentTarget.style.border = "dashed";
    }
    else {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer?.setData("text", event.target.id)
      event.currentTarget.style.border = "dashed";
    }

    // else if (event.target.children[0]?.tagName == "svg") {
    //   event.dataTransfer.effectAllowed = "move";
    //   event.dataTransfer?.setData("text", event.target.children[0].id)
    //   event.currentTarget.style.border = "dashed";
    // }
  }

  allowDrop(event: Event) {
    // console.log("allowDrop");
    event.preventDefault();
  }

  drop(event: DragEvent | any) {
    // console.log(event);
    // console.log(this.transformer);
    event.preventDefault();

    // console.log(imageId);
    if (event.dataTransfer) {

      var imageId = event.dataTransfer.getData('text');
      if (imageId == "Create header") {
        this.addText(imageId, "25")
      } else if (imageId == "Create sub header") {
        this.addText(imageId, "18")
      } else if (imageId == "Create body text") {
        this.addText(imageId, "14")
      } else if (imageId.includes("shape")) {
        this.addShapes(document.getElementById(imageId))
      }
      else {
        this.addObjectsToStage(event, imageId)
      }
    } else {
      this.addObjectsToStage(event, event.target.id)
    }

  }
  addObjectsToStage(event: any, objectId: any) {
    console.log(event);
    const videoElement: any = document.getElementById(objectId) as HTMLVideoElement;

    if (!videoElement) {
      console.error(`Video element with id ${objectId} not found.`);
      return;
    }
    if (this.selectedObject) {
      if (this.selectedObject instanceof Konva.Image) {
        console.log("Replacing selected image with new video");

        // Remove the selected image from the layer
        this.selectedObject.remove();
        // Create a new Konva image from the video element
        const newVideoObject = new Konva.Image({
          image: videoElement,
          x: this.selectedObject.x(),
          y: this.selectedObject.y(),
          width: this.selectedObject.width(),
          height: this.selectedObject.height(),
          draggable: true,
          unique: objectId // or use objectId if unique is not necessary
        });
        // Add the new video object to the layer
        this.layer.add(newVideoObject);
        this.stage.draw();
        // this.selectedObject = '';
        // Play the video
        console.log(videoElement);
        videoElement.muted = true;
        if (videoElement.tagName === "VIDEO") {
          videoElement.play().catch((error: any) => console.error("Failed to play video:", error));
        }
        // videoElement.play().catch((error: any) => console.error("Failed to play video:", error));
      } else {
        console.error("Selected object is not an image.");
        const width = 1080 / 6;
        const height = 1920 / 6;
        const videoImage = new Konva.Image({
          image: videoElement,
          x: event.offsetX / 3,
          y: event.offsetY / 3,
          width: width,
          height: height,
          draggable: true,
          unique: objectId // or use objectId if unique is not necessary
        });

        this.layer.add(videoImage);
        this.stage.draw();
        if (videoElement.tagName === "VIDEO") {
          videoElement.play().catch((error: any) => console.error("Failed to play video:", error));
        }
      }
    } else {
      console.log("Creating new Konva image from video element");
      const width = 1080 / 6;
      const height = 1920 / 6;
      const videoImage = new Konva.Image({
        image: videoElement,
        x: 0,
        y: 0,
        width: this.konvaHeight / 3,
        height: this.konvaWidth / 3,
        draggable: true,
        unique: objectId // or use objectId if unique is not necessary
      });

      this.layer.add(videoImage);
      this.stage.draw();
      if (videoElement.tagName === "VIDEO") {
        videoElement.play().catch((error: any) => console.error("Failed to play video:", error));
      }
    }

  }
  addTextColor(color: any) {
    // console.log(color);
    // console.log(this.selectedObject);
    this.selectedObject.attrs.fill = color;
    this.stage.batchDraw();
  }
  changeFontFamily(fontname: any) {
    this.selectedFont = fontname?.target?.value;
    this.selectedObject.attrs.fontFamily = fontname?.target?.value;
    this.stage.batchDraw();
  }
  changeFontsize(fontsize: any) {
    // console.log(fontsize);
    this.selectedFontSize = fontsize;
    this.selectedObject.attrs.fontSize = fontsize;
    this.stage.batchDraw();
  }
  addBackgroundColor(color: any) {

    if (this.backgroundRect) {
      this.backgroundRect.remove(); // Remove the rectangle from the layer
      this.stage.batchDraw(); // Redraw the stage to apply the changes
    }

    // const backgroundLayer = new Konva.Layer();
    // this.stage.add(backgroundLayer);

    // Create a background rectangle with a color
    this.backgroundRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: color, // Set the background color here
    });
    // Add the background rectangle to the background layer
    this.layer.add(this.backgroundRect);

    this.moveLayerToLast(this.backgroundRect);
    // this.stage.draw(); // Redraw the stage to
    this.stage.container().style.backgroundColor = color;
    this.backgroundColor = color;
  }
  openFontUploadDialog(id: any) {
    const fileInput: any = document.getElementById(id) as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Programmatically trigger the file input dialog
    }
    // console.log(fileInput.target);

  }
  addText(text: any, fontSize: any) {
    this.selectedFontSize = fontSize
    this.selectedFont = text;
    var textNode = new Konva.Text({
      text: text,
      x: 50,
      y: 80,
      fontSize: fontSize,
      fontFamily: text,
      draggable: true,
      width: 100,
    });

    this.layer.add(textNode);
    this.transformer = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      boundBoxFunc: function (oldBox: any, newBox: any) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    // this.transformer = tr;
    textNode.on('transform', function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    this.layer.add(this.transformer);
    // text = new Konva.Text({
    //   x: 100, // X-coordinate
    //   y: 100, // Y-coordinate
    //   text: text, // Text content
    //   fontSize: fontSize, // Font size
    //   fontFamily: text,
    //   fill: 'black',// Text color
    //   editable: true,
    //   draggable: true,
    //   width: 200
    // });
    // text.on('dblclick', (event: any) => {
    //   // console.log(event);
    //   this.addedtext = text
    //   this.enableTextEditing()
    // });
    textNode.on('dblclick dbltap', () => {
      // hide text node and transformer:
      textNode.hide();
      this.transformer.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = textNode.absolutePosition();
      // console.log(textPosition);
      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: this.stage.container().offsetLeft + textPosition.x,
        y: this.stage.container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      var textarea: any = document.createElement('textarea');
      // document.body.appendChild(textarea);
      document.getElementById('konva')!.appendChild(textarea);
      // console.log(this.stage.container().offsetLeft);
      // console.log(this.stage.container().offsetTop);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      const rotation = textNode.rotation();
      var transform = '';
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
      }

      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += 'translateY(-' + px + 'px)';

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = 'auto';
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px';

      textarea.focus();

      const removeTextarea = () => {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        this.transformer.show();
        this.transformer.forceUpdate();
      }

      function setTextareaWidth(newWidth: any) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge =
          document.DOCUMENT_NODE || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + 'px';
      }

      textarea.addEventListener('keydown', function (e: any) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener('keydown', function (e: any) {
        var scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + 'px';
      });

      function handleOutsideClick(e: any) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
    });
    // this.layer.add(text);
    this.stage.draw();

  }
  setFontFamily(font: any) {

  }
  editText(event: any) {
    // Get the clicked text element
    const textIndex = this.addedtext.indexOf(event.target);

    if (textIndex >= 0) {
      // Set the index of the text element to edit
      this.editTextIndex = textIndex;
    }
  }

  saveEditText() {
    if (this.editTextIndex >= 0) {
      // Update the text content
      this.addedtext[this.editTextIndex].text(this.addedtext[this.editTextIndex].getText());
      this.layer.batchDraw();
      this.editTextIndex = -1; // Deselect the text element
    }
  }
  moveLayerToLast(layer: any) {
    if (layer) {
      layer.moveToBottom();
      this.stage.batchDraw(); // Redraw  // Redraw the stage to reflect the layer order
    }
  }

  enableTextEditing() {
    // Create an input field for editing
    this.inputField = document.createElement('input');
    this.inputField.value = this.addedtext.text();
    this.inputField.style.position = 'absolute';
    this.inputField.style.left = this.addedtext.x() + 'px';
    this.inputField.style.top = this.addedtext.y() + 'px';
    this.inputField.style.fontSize = this.addedtext.fontSize() + 'px';

    // Append the input field to the stage container
    document.getElementById('konva')!.appendChild(this.inputField);

    // Focus on the input field for editing
    this.inputField.focus();

    // Handle input changes
    this.inputField.addEventListener('input', () => {
      this.addedtext.text(this.inputField.value);
      this.layer.draw();
    });

    // Handle input blur (when user is done editing)
    this.inputField.addEventListener('blur', () => {
      // Remove the input field
      this.inputField.remove();
      this.layer.draw();
    });
  }
  saveAsPNG(format: any) {
    // console.log(this.stage);
    // console.log(this.backgroundColor);
    this.convertData = [];
    let stage = { Stage: { stageHeight: Math.round(this.stage.attrs.height * 3), stageWidth: Math.round(this.stage.attrs.width * 3), backgroundColor: this.backgroundColor } }
    this.convertData.push(stage);
    Array.from(this.stage.children[0].children).forEach((element: any) => {
      // console.log(element);
      if (element instanceof Konva.Transformer) {
      } else if (element instanceof Konva.Image) {
        let NewWidth;
        let NewHeight;
        if (element.attrs.scaleX || element.attrs.scaleY) {
          NewWidth = Math.round((element.attrs.width * 3) * element.attrs.scaleX);
          NewHeight = Math.round((element.attrs.height * 3) * element.attrs.scaleY);
        } else {
          NewWidth = Math.round(element.attrs.width * 3);
          NewHeight = Math.round(element.attrs.height * 3);
        }
        let v;
        if (element.attrs.image.src.includes('mp4')) {
          v = {
            Video: {
              height: NewHeight,
              width: NewWidth,
              x: Math.round(element.attrs.x * 3),
              y: Math.round(element.attrs.y * 3),
              file: element.attrs.image.src
            }
          }
        } else {
          v = {
            Image: {
              height: NewHeight,
              width: NewWidth,
              x: Math.round(element.attrs.x * 3),
              y: Math.round(element.attrs.y * 3),
              file: element.attrs.image.src
            }
          }
        }
        this.convertData.push(v)
      } else if (element instanceof Konva.Text) {
        console.log(element);
        let v = {
          Text: {
            x: Math.round(element.attrs.x * 3),
            y: Math.round(element.attrs.y * 3),
            fill: element.attrs.fill,
            text: element.attrs.text,
            TW: Math.round(element.attrs.width / 13),
            fontSize: element.attrs.fontSize * 3,
            fontFamily: element.attrs.fontFamily,
            fontStyle: element.attrs.fontStyle
          }
        }
        this.convertData.push(v);
      } else if (element instanceof Konva.Rect) {
        // let w = element.attrs.width * 3;
        // let h = element.attrs.height * 3;
        // let v = {
        //   Bg: {
        //     height: h,
        //     width: w,
        //     x: element.attrs.x * 3,
        //     y: element.attrs.y * 3,
        //     // file: element.attrs.image.src,
        //     color: element.attrs.fill
        //   }
        // }
        // this.convertData.push(v)
      }
    });
    if (this.mediafileid) {
      var playlistObj = this.template?.properties.find((item: { playlist: any; }) => item.playlist);
      console.log(playlistObj.playlist);
    }
    let playlist = {
      playlist: { playlistId: this.mediafileid ? playlistObj?.playlist.playlistId : this.choosePlaylist, isVertical: this.mediafileid ? playlistObj?.playlist.isVertical : this.isVertical, format: this.mediafileid ? playlistObj?.playlist.format : format, isEdit: this.mediafileid ? true : false, mediafile: this.mediafileid, filename: this.templatename ? this.templatename : 'none', templatetype: this.choosedTemplateType ? this.choosedTemplateType : 'none', clientname: this.clientUsername }
    }
    this.convertData.push(playlist)
    console.log(this.convertData);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.convertDataToVideo(this.convertData).subscribe((res: any) => {
      loader.close();
      if (res.message == "Media uploaded Successfully!!") {
        this.alert.showSuccess(res.message);
        // window.location.reload();
      } else {
        this.alert.showError(res.message);
      }

    }, err => {
      loader.close();
      this.alert.showError(err.error.message);
      // window.location.reload();
    })

  }
  saveAsImage(format: string) {
    // Create a new temporary canvas for exporting
    // console.log(format);
    // console.log(this.choosePlaylist);
    // if (format == "MP4") {
    this.saveAsPNG(format);
    // } else {
    //   const tempCanvas = document.createElement('canvas');
    //   tempCanvas.width = this.stage.width();
    //   tempCanvas.height = this.stage.height();

    //   const tempContext: any = tempCanvas.getContext('2d');

    //   // Clear the temporary canvas
    //   tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    //   // Draw the stage onto the temporary canvas
    //   this.stage.toImage({
    //     x: 0,
    //     y: 0,
    //     width: this.stage.width(),
    //     height: this.stage.height(),
    //     callback: (image: any) => {
    //       tempContext.drawImage(image, 0, 0, this.stage.width(), this.stage.height());
    //       // Convert the canvas to a data URL with the desired format
    //       const dataURL = tempCanvas.toDataURL(`image/${format}`);

    //       this.downloadDataURL(dataURL, `stage.${format}`);
    //     },
    //   });
    // }

  }
  downloadDataURL(dataURL: string, fileName: string) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    let obj = dataURItoBlob(dataURL);

    const file = new File(
      [obj],
      fileName,
    );
    // this.uploadMediaFile(file);
  }
  isChecked(inputId: any, textId: any) {
    // Get the checkbox
    var checkBox: any = document.getElementById(inputId);
    // Get the output text
    var text: any = document.getElementById(textId);

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
  }
  removeObjects() {
    // console.log(this.selectedObject);

    if (this.selectedObject) {
      if (this.selectedObject.attrs.container) {
        let playgroundOptions = document.querySelectorAll(".playground-undo button");
        // console.log(playgroundOptions);
        [].forEach.call(playgroundOptions, (obj: any) => {
          obj.classList.add("bp4-disabled")
          obj.style.color = "white"
          obj.style.cursor = "not-allowed"
          obj.disabled = true;
        })
      } else {
        this.selectedObject.destroy();
        this.transformer.detach();
        this.stage.batchDraw();
      }
      this.selectedObject = null
    }
  }
  getlaylistByClient() {
    let payload = {
      "clientname": this.clientUsername,
      "state": "null",
      "city": "null",
      "mediatype": "null",
      "vertical": "null"
    }
    this.clientService.getplaylistdetailsbyclientforeditor(this.clientUsername).subscribe((res: any) => {
      // console.log(res);
      this.Playlist = res;
    })
  }
  openEffects(event: any) {
    // 180px auto auto 712px
    // console.log(event.y + " " + event.x);
    // this.openPosition("event")
    let positionTab = document.getElementById("effect-dropdown");
    // console.log(positionTab?.style);
    if (positionTab) {
      const computedStyle = positionTab.getAttribute("style");
      if (computedStyle) {
        positionTab.removeAttribute('style');
      } else {
        positionTab.style.position = "absolute";
        positionTab.style.inset = (event.y + 35) + "px" + " auto auto " + (event.x - 100) + "px";
      }

    }
  }
  openPosition(event: any) {
    // console.log(event);
    // console.log(event.y + " " + event.x);
    // this.openEffects("event")
    let positionTab = document.getElementById("position-dropdown");
    // console.log(positionTab?.style);
    if (positionTab) {
      const computedStyle = positionTab.getAttribute("style");
      if (computedStyle) {
        positionTab.removeAttribute('style');
      } else {
        positionTab.style.position = "absolute";
        positionTab.style.inset = (event.y + 50) + "px" + " auto auto " + (event.x - 50) + "px";
      }
    }
  }

  showUploadDropdown: boolean = false;

  openUploadDropdown(event: any, e: any) {

    this.showUploadDropdown = !this.showUploadDropdown;
    let positionTab1 = document.getElementById('template-dropdown');
    let positionTab2 = document.getElementById('upload-dropdown')
    this.templatename = '';
    this.choosedTemplateType = 'none';
    this.choosePlaylist = 'none';
    // console.log(positionTab?.style);
    if (e === 'upload-dropdown') {
      if (positionTab2) {
        const computedStyle = positionTab2.getAttribute("style");
        if (computedStyle) {
          positionTab2.removeAttribute('style');
        } else {
          positionTab2.style.position = "absolute";
          positionTab2.style.inset = (event.y + 30) + "px" + " auto auto " + (event.x - 180) + "px";
        }
        const computedStyle1 = positionTab1?.getAttribute("style");
        if (computedStyle1) {
          positionTab1?.removeAttribute('style');
        }
        this.getlaylistByClient()
      }
    } else if (e === 'template-dropdown') {
      if (positionTab1) {
        const computedStyle = positionTab1.getAttribute("style");
        if (computedStyle) {
          positionTab1.removeAttribute('style');
        } else {
          positionTab1.style.position = "absolute";
          positionTab1.style.inset = (event.y + 30) + "px" + " auto auto " + (event.x - 180) + "px";
        }
        const computedStyle2 = positionTab2?.getAttribute("style");
        if (computedStyle2) {
          positionTab2?.removeAttribute('style');
        }
        this.getlaylistByClient()
      }
    }
    // if (positionTab) {
    //   const computedStyle = positionTab.getAttribute("style");
    //   if (computedStyle) {
    //     positionTab.removeAttribute('style');
    //   } else {
    //     positionTab.style.position = "absolute";
    //     positionTab.style.inset = (event.y + 30) + "px" + " auto auto " + (event.x - 280) + "px";
    //   }
    //   this.getlaylistByClient()
    // }
  }
  layerArrangement(movement: any) {
    // console.log(movement);
    // console.log(this.selectedObject);

    if (this.selectedObject) {
      if (movement == "up") {
        this.selectedObject.moveUp();
      } else if (movement == "down") {
        this.selectedObject.moveDown();
      }
      this.stage.batchDraw();
    }
  }


  changeEffect(event: any, effect: any) {
    // console.log(effect);
    // console.log(event.target.value);
    if (this.selectedObject) {
      // Apply the blur effect to the selected shape
      this.selectedObject.cache();
      this.selectedObject.filters([Konva.Filters.Blur]);
      this.selectedObject.blurRadius(10); // Adjust the blur radius as needed
    }
  }



  addShapes(shape: any) {
    // console.log(shape);

    let konvaShape;
    switch (shape.shapeType) {
      case 'Rectangle':
        konvaShape = new Konva.Rect({
          x: shape.x, // Set the X position as needed
          y: shape.y, // Set the Y position as needed
          width: shape.width,
          height: shape.height,
          fill: shape.fill,
          draggable: true
        });
        break;

      case 'Circle':
        konvaShape = new Konva.Circle({
          x: 100, // Set the X position as needed
          y: 100, // Set the Y position as needed
          radius: shape.radius,
          fill: shape.fill,
          draggable: true
        });
        break;
      case 'Triangle':
        konvaShape = new Konva.Line({
          points: [50, 0, 100, 100, 0, 100], // Define the coordinates for the triangle vertices
          fill: 'yellow',
          closed: true, // Set to true to close the shape
          draggable: true, // Make the triangle draggable
        });
        break;

      case 'Ellipse':
        konvaShape = new Konva.Line({
          points: [50, 0, 100, 100, 0, 100], // Define the coordinates for the triangle vertices
          fill: 'yellow',
          closed: true, // Set to true to close the shape
          draggable: true, // Make the triangle draggable
        });
        break;
      case 'Polygon':
        konvaShape = new Konva.Line({
          points: [50, 0, 100, 25, 100, 75, 50, 100, 0, 75, 0, 25], // Define the coordinates for the triangle vertices
          fill: shape.fill,
          closed: true, // Set to true to close the shape
          draggable: true, // Make the triangle draggable
        });
        break;

      default:
        console.log('Unknown shape type: ' + shape.shapeType);
        return;
    }

    this.layer.add(konvaShape);
    this.stage.draw();
  }
  // ----------------------


  onFileChangeFile(event: Event) {
    // this.videos=[];
    const files = (event.target as HTMLInputElement).files;
    let fd = new FormData();
    fd.set('username', this.clientUsername);
    fd.set('editor_type', 'collage');
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        console.log(i);
        reader.onload = () => {
          fd.set('file', files[i]);
          this.both.push({
            // file: files[i],
            url: reader.result as string,
            type: files[i].type,
            id: this.setId(files[i].type) + this.both?.length
          });
          if (files.length == (i + 1)) {
            this.clientService.uploadEditorFiles(fd).subscribe((res: any) => {
              // console.log(res);
              this.both = res;
              // res.forEach((e: any) => {
              //   if (!this.both.some((item: any) => item.id === e.id)) {
              //     this.both.push(e);
              //   }
              // });
            })
          }
        };
        reader.readAsDataURL(files[i]);

      }
    }
    console.log(this.both);
  }

  setId(type: any) {
    console.log(type);

    // console.log(type.includes("video"));
    if (type.includes("video")) {
      return "iqworldvideo"
    }
    return "iqworldimage";
  }
  // Editor

  closePrpperties() {
    let propertyPanel = document.getElementById("propertyPanel");
    // console.log(propertyPanel);

    propertyPanel?.classList.add("close");
  }
  changeTab(data: any, tabid: any) {

    this.showUploadDropdown = !this.showUploadDropdown;

    let propertyPanel = document.getElementById("propertyPanel");
    if (propertyPanel?.classList.contains("close")) {
      propertyPanel?.classList.remove("close");
    }
    // console.log(tabid.classList);
    let tabs: any = document.getElementsByClassName("sidebar-panel-tab");
    // console.log(tabs);
    let tabContent = document.getElementsByClassName("sidebar-panel-tab-properties-content");
    Array.from(tabContent).forEach((element: any) => {
      if (element.getAttribute('id') == data) {
        element.classList.add("active");
      } else {
        if (element.classList.contains("active")) {
          element.classList.remove("active")
        }
      }
    });
    Array.from(tabs).forEach((element: any) => {
      // console.log(element.classList.contains("active"));

      if (element.getAttribute('id') == tabid) {
        element.classList.add("active");

      } else {
        if (element.classList.contains("active")) {
          element.classList.remove("active")
        }
      }
      // console.log();
    });
    // tabid?.classList.add("active");
  }

  // editorPart
  addShadow() {
    this.selectedObject.shadowColor('black');
    this.selectedObject.shadowBlur(10);
    this.selectedObject.shadowOffsetX(5);
    this.selectedObject.shadowOffsetY(5);

  }


  uploadMediaFile(file: any,) {
    // console.log(file);

    const fd = new FormData();

    fd.append('file', file);
    fd.append('username', this.clientUsername);
    fd.append('mediatype', '3');
    fd.append('playlist_id', this.choosePlaylist);

    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.uploadFiles(fd).subscribe((res: any) => {
      // console.log(res);
      this.Alert.successAlert(res.message);
      loader.close();
      window.location.reload();
    })


  }

  changeValueZero(data: any) {
    let input: any = document.getElementById("numericInput-0");
    if (data == "increment") {
      input.value++;
    } else {
      if (input.value == 0) {
        input.value = 0
      } else {
        input.value--;
      }
    }
    this.stage.width(input.value / 3);
  }
  changeValueOne(data: any) {
    let input: any = document.getElementById("numericInput-1");
    if (data == "increment") {
      input.value++;

    } else {
      if (input.value == 0) {
        input.value = 0
      } else {
        input.value--;
      }
    }
    this.stage.height(input.value / 3);
  }
  openTemplate() {
    this.router.navigate(['/client/canvas/', '10'])
  }
  retrievePlayground(data: any) {
    console.log(data);
    if (this.stage.getChildren()) {
      this.stage.getChildren().forEach((layer: any) => {
        layer.removeChildren();
      });
      this.stage.draw();
    }

    // this.ngAfterViewInit();
    data.forEach((e: any) => {
      // console.log(e.contains('Stage'));
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          // console.log(`Key: ${key}, Value:`, e[key]);
          if (key === 'Stage') {
            // console.log(e[key]);
            let obj = e[key];
            this.changeKonvaResolution(obj.stageWidth, obj.stageHeight);
            this.addBackgroundColor(obj.backgroundColor)
          } else if (key == 'Image') {
            var randomValue = getRandomNumberWithSuffix();
            e[key].id = randomValue;
            e[key].type = 'image';
            // this.both.push(e[key])
            // console.log(e[key]);
            this.addVideoOrImagesToStage(e[key], key);
          } else if (key === 'Text') {
            setTimeout(() => {
              this.addTextByRetrieve(e[key]);
            }, 1000)
          } else if (key == 'Video') {
            console.log(e[key]);
            var randomValue = getRandomNumberWithSuffix();
            e[key].type = 'video';
            e[key].id = randomValue;
            // this.both.push(e[key])

            this.addVideoOrImagesToStage(e[key], key)
          }
        }
      }
    });
    // this.clientService.getEditorUploadFiles(this.clientUsername).subscribe((res: any) => {
    //   res.forEach((e: any) => {
    //     if (!this.both.some((item: any) => item.id === e.id)) {
    //       this.both.push(e);
    //     }
    //   });
    // });
  }

  addTextByRetrieve(e: any) {
    this.selectedFontSize = e.fontSize
    this.selectedFont = e.fontFamily;
    var textNode = new Konva.Text({
      text: e.text,
      x: e.x / 3,
      y: e.y / 3,
      fill: e.fill,
      fontSize: e.fontSize / 3,
      fontFamily: e.fontFamily,
      draggable: true,
      width: 100,
    });
    this.layer.add(textNode);
    this.transformer = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      boundBoxFunc: function (oldBox: any, newBox: any) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    // this.transformer = tr;
    textNode.on('transform', function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    this.layer.add(this.transformer);
    // text = new Konva.Text({
    //   x: 100, // X-coordinate
    //   y: 100, // Y-coordinate
    //   text: text, // Text content
    //   fontSize: fontSize, // Font size
    //   fontFamily: text,
    //   fill: 'black',// Text color
    //   editable: true,
    //   draggable: true,
    //   width: 200
    // });
    // text.on('dblclick', (event: any) => {
    //   // console.log(event);
    //   this.addedtext = text
    //   this.enableTextEditing()
    // });
    textNode.on('dblclick dbltap', () => {
      // hide text node and transformer:
      textNode.hide();
      this.transformer.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = textNode.absolutePosition();
      // console.log(textPosition);
      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: this.stage.container().offsetLeft + textPosition.x,
        y: this.stage.container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      var textarea: any = document.createElement('textarea');
      // document.body.appendChild(textarea);
      document.getElementById('konva')!.appendChild(textarea);
      // console.log(this.stage.container().offsetLeft);
      // console.log(this.stage.container().offsetTop);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      const rotation = textNode.rotation();
      var transform = '';
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
      }

      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += 'translateY(-' + px + 'px)';

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = 'auto';
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px';

      textarea.focus();

      const removeTextarea = () => {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        this.transformer.show();
        this.transformer.forceUpdate();
      }

      function setTextareaWidth(newWidth: any) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge =
          document.DOCUMENT_NODE || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + 'px';
      }

      textarea.addEventListener('keydown', function (e: any) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener('keydown', function (e: any) {
        var scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + 'px';
      });

      function handleOutsideClick(e: any) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
    });
    // this.layer.add(text);
    this.stage.draw();

  }

  Videolists: any = [];
  addVideoOrImagesToStage(e: any, type: any) {
    console.log(e);
    // width = 1080 / 6;
    // height = 1920 / 6;
    // setTimeout(() => {
    //   const videoElement = document.getElementById(e.id) as HTMLVideoElement;
    //   console.log(videoElement);
    //   // videoElement.muted = true;
    //   // videoElement.play();
    //   // document.body.appendChild(v);
    //   const videoImage = new Konva.Image({
    //     image: videoElement,
    //     x: e.x / 3,
    //     y: e.y / 3,
    //     width: e.width / 3,
    //     height: e.height / 3,
    //     draggable: true,
    //     unique: e.id
    //   });
    //   this.layer.add(videoImage);

    //   console.log(this.stage);
    // }, 1000)
    // this.stage.draw();

    // =============================================
    console.log(this.stage);
    if (e.type === 'image') {
      var imageObj = new Image();
      imageObj.onload = () => {
        console.log(e);
        var yoda = new Konva.Image({
          image: imageObj,
          x: e.x / 3,
          y: e.y / 3,
          width: e.width / 3,
          height: e.height / 3,
          draggable: true,
          unique: e.id
        });

        // add the shape to the layer
        this.layer.add(yoda);
      };
      imageObj.src = e.file;
    } else {
      var video: any = document.createElement('video');
      video.src = e.file;
      var image = new Konva.Image({
        image: video,
        x: e.x / 3,
        y: e.y / 3,
        width: e.width / 3,
        height: e.height / 3,
        draggable: true,
        unique: e.id
      });
      // video.preload = true;
      this.layer.add(image);
      video.addEventListener('loadedmetadata', function (e: any) {
        video.play()
        video.muted = true;
        // image.width(video.videoWidth);
        // image.height(video.videoHeight);
      });

    }
    this.stage.draw();
  }


  // navgetToUrl(type: any) {
  //   console.log(type);
  //   window.location.assign("https://ds.iqtv.in/reditor_mobile/#/customer/" + this.clientUsername)
  // }

  navgetToUrl1(type: any) {
    console.log(type);
    this.matDialog.open(VistaComponent, {
      data: this.clientUsername,
      width: '100%',
      height: '100%'
    })
  }
  navgetToUrl(type: any) {
    this.router.navigateByUrl('client/canvas123/' + type + "/" + this.clientUsername)
  }
  // navgetToUrl(type: any) {
  //   console.log(type);
  //   // window.location.assign("http://192.168.1.103:4200/#/customer/" + type + '/' + this.clientUsername)
  //   // window.location.assign("https://ds.iqtv.in/reditor/#/customer/" + type + '/' + this.clientUsername)
  //   window.location.assign(clienturl.WEB_URL() + "/reditor/#/customer/" + type + '/' + this.clientUsername)
  // }
}

function getVideoElement(url: any, canvas: any) {
  // console.log(url);
  getVideoDimensions(url);
  var videoE = document.createElement('video');
  // videoE.width = 500;
  // videoE.height = 500;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  videoE.width = canvasWidth;
  videoE.height = canvasHeight;
  videoE.controls = true;
  videoE.muted = true;
  videoE.crossOrigin = "anonymous";
  videoE.autoplay = true;
  videoE.style.zIndex = "1000";
  videoE.style.objectFit = "fill";
  var source = document.createElement('source');
  source.src = url;
  source.type = 'video/mp4';

  videoE.appendChild(source);
  return videoE;
}
function getVideoDimensions(videoUrl: any) {
  const videoElement = document.createElement('video');
  videoElement.src = videoUrl;
  videoElement.load();
}


function handleDragStart(img: any, e: any) {
  // console.log(e);

  var images = document.querySelectorAll('.images img');
  [].forEach.call(images, function (img: any) {
    img.classList.remove('img_dragging');
  });
  // console.log("pewiopeiw");
  img.add('img_dragging')
  // this.classList.add('img_dragging');

}
function handleDragEnd(e: any) {
  // $(e.target).removeClass('img_dragging');
}
function handleClick(img: any, e: any, canvas: any) {
  // console.log(img);
  // console.log(e);
  // console.log(canvas);
  var img = e.target;

  fabric.Image.fromURL(img.src, (img: any) => {
    // Calculate the scale factors to fit the image within the canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageWidth = img.width;
    const imageHeight = img.height;
    const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

    // Set the image's width and height to fit within the canvas
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: 0,
      top: 0,
    });
    canvas.add(img);
  });
}
function dataURItoBlob(dataURI: any) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], { type: mimeString });


}

function hexToRgb(hex: any) {
  // Remove any leading "#" from the hex code
  hex = hex.replace(/^#/, '');

  // Parse the hex code into its individual red, green, and blue components
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

function getRandomNumberWithSuffix(): string {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const randomSuffix = String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Random lowercase letter from 'a' to 'z'
  return `${randomNumber}${randomSuffix}`;
}

function tap(arg0: (event: KeyboardEvent) => void): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}

// function toggleDropdown() {
//   var dropdown = document.getElementById('upload-dropdown');
//   if (dropdown) {
//     dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
//   } else {
//     console.error('Dropdown element not found.');
//   }
// }

