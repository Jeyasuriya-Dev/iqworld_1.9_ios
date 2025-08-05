
import { string } from '@amcharts/amcharts4/core';
import { Component, DoCheck, Inject, Injectable, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { log } from 'console';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
interface ImagePreview {
  file: File;
  url: string;
  type: string
}
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-scroller-design',
  templateUrl: './scroller-design.component.html',
  styleUrls: ['./scroller-design.component.scss']
})
export class ScrollerDesignComponent implements OnInit, DoCheck {
  clientUsername: any;
  marqueeMessage = "Enter your text here";
  logoToggle = 'No';
  logos: ImagePreview[] = [];
  logoList: any = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUyrUpM-LHcjj8j3CGr5H7KPZPDE0ALXQhlw&s']
  isPreviouslogo = false;
  direction = "left";
  newScroller = "Add new Scroller";
  selectedFont: any = "Poppins-Regular";
  fontList: any = []
  scrollname = "";
  scrollObj: any = {
    "id": "",
    "name": "",
    "clientname": "",
    "message": "",
    "isactive": true,
    "creationdate": "",
    "updateddate": "",
    "fncolor": "",
    "bgcolor": "",
    "fnsize": "",
    "width": "",
    "height": "",
    "behavior": "",
    "scrlspeed": "5",
    "direction": "",
    "x": "0",
    "y": "0"
  };

  selectedLogo: any = 'none';
  scrollList: any = []
  isExist = false;
  behavior = "scroll";
  height: any = "auto";
  width: any = "auto";
  right: any = 0;
  top: any = 0;
  background = "#00000000";
  fontSize: any = 35;
  color: any = "#000000";
  scrollamount = 10;
  mStyle = {
    position: '',
    top: "",
    right: '',
    background: "",
    'font-size': "",
    color: "",
    height: "",
    width: "",
    padding: "inherit",
    "font-family": ""
  }
  playlistid: any = 0;
  constructor(private storageService: StorageService, private matDialog: MatDialog, private clientService: ClientService, private alertService: AlertService, @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    if (data) {
      this.playlistid = data?.id
    }
  }

  ngDoCheck(): void {
    // console.log(this.selectedFont);
    this.mStyle = {
      position: 'relative',
      top: this.top + "px",
      right: this.right + 'px',
      background: this.background,
      'font-size': this.fontSize + 'px',
      color: this.color,
      height: this.height + "px",
      width: this.width + "px",
      padding: "inherit",
      "font-family": this.selectedFont
    }

    let doc: any = document.getElementById("marquee");
    doc!.scrollAmount = this.scrollamount;
    if (this.marqueeMessage.length >= 1) {
      doc.style.display = "block";
    } else {
      doc.style.display = "none";
      this.ngDoCheck();
    }
    // console.log(this.mStyle);
  }
  selectFont(event: any) {
    this.selectedFont = event.target.value;
  }
  ScrollerType: any = 2;
  ScrollerTypeList: any = []
  ngOnInit(): void {
    let v = this.storageService.getUser();
    if (this.storageService.getUserRole() === "STORE") {
      this.clientService.getStoreByUsername(v.username).subscribe((res: any) => {
        this.clientUsername = res.clientname
      })
    } else if (this.storageService.getUserRole() === "SUBUSER") {
      this.clientService.getSuserByUsername(v.username).subscribe((res: any) => {
        this.clientUsername = res.clientname
      })
    } else {
      this.clientUsername = this.storageService.getClientUsername();
    }
    this.clientService.getScrollerByClientnameNdPlaylistid(this.clientUsername, this.playlistid || 0).subscribe(res => {
      // console.log(res);
      this.scrollList = res;
    })
    this.clientService.getScrollerLogoByClient(this.clientUsername).subscribe(res => {
      console.log(res);
      this.logoList = res;

    })
    this.clientService.getScrollerType().subscribe(res => {
      this.ScrollerTypeList = res;
    })
    this.clientService.getFontList().subscribe(res => {

      this.fontList = res;
      // console.log(this.fontList);
      this.fontList.forEach((element: any) => {
        // console.log(element);
        // console.log(
        this.clientService.convertUrlToDataUri(element?.url);
        // );
        // const fontDataUri = `data:application/font-woff;charset=utf-8;base64,${btoa(element.url)}`;
        this.applyFontStyle1(element?.url, element.fontname)
      });
    })
  }
  addScroller(newsroller: any) {
    // console.log(newsroller.value);
    // let style = {
    //   name: newsroller.value,
    //   clientname: this.clientUsername,
    //   behavior: this.behavior,
    //   height: this.height,
    //   width: this.width,
    //   right: this.right,
    //   top: this.top,
    //   background: this.background,
    //   fontSize: this.fontSize,
    //   color: this.color,
    //   scrollamount: this.scrollamount,
    //   message: this.marqueeMessage,
    //   direction: this.direction
    // }
    let style = {
      name: this.scrollname,
      clientname: this.clientUsername,
      message: this.marqueeMessage,
      isactive: true,
      behavior: this.behavior,
      height: this.height,
      width: this.width,
      x: this.right,
      y: this.top,
      bgcolor: this.background,
      fnsize: this.fontSize,
      fontname: this.selectedFont,
      fncolor: this.color,
      scrlspeed: this.scrollamount,
      direction: this.direction,
      scroller_type: this.ScrollerType,
      playlistid: this.playlistid ? this.playlistid : "0"
    }
    // this.scroll.push(style);
    // console.log(style);
    let username: any = this.storageService.getUsername();
    let fd = new FormData();
    fd.append('name', this.scrollname)
    fd.append('clientname', this.clientUsername)
    fd.append('message', this.marqueeMessage)
    fd.append('isactive', 'true')
    fd.append('behavior', this.behavior)
    fd.append('height', this.height)
    fd.append('width', this.width)
    fd.append('x', this.right)
    fd.append('y', this.top)
    fd.append('bgcolor', this.background)
    fd.append('fnsize', this.fontSize)
    fd.append('fontname', this.selectedFont)
    fd.append('fncolor', this.color)
    fd.append('scrlspeed', this.scrollamount.toString())
    fd.append('direction', this.direction)
    fd.append('scroller_type', this.ScrollerType)
    fd.append('playlistid', this.playlistid ? this.playlistid : "0");
    fd.append('createdby', username);

    if (this.isPreviouslogo) {
      if (this.logoList[0]) {
        fd.append('logo_path', this.logoList[this.logoList.length - 1])
      } else {
        fd.append('logo_path', 'null')
      }
    } else if (this.selectedLogo != 'none') {
      fd.append('logo_path', this.selectedLogo)
    } else if (this.logos.length != 0) {
      fd.append('logo', this.logos[0].file);
    } else {
      fd.append('logo_path', 'null')
    }
    if (this.scrollname) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      });
      this.clientService.createScroller(fd).subscribe(res => {
        // console.log(res);
        this.clientService.getScrollerByClientnameNdPlaylistid(this.clientUsername, this.playlistid || 0).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          this.scrollList = res;
          this.alertService.showSuccess(res?.message);
          this.ngOnInit();
          if (this.playlistid != 0) {
            window.location.reload();
          }
        }, err => {
          this.alertService.showError(err?.error?.message);
          loader.close();
        })
      }, err => {
        this.alertService.showError(err?.error?.message);
        loader.close();
      })
    } else {
      this.alertService.showError("Please Enter The Name")
    }

  }
  saveStyle(marquee: any) {
    console.log(marquee);
    // let style = {
    this.scrollObj.name = this.scrollname;
    this.scrollObj.clientname = this.clientUsername;
    this.scrollObj.message = this.marqueeMessage;
    this.scrollObj.isactive = true;
    this.scrollObj.behavior = this.behavior;
    this.scrollObj.height = this.height;
    this.scrollObj.width = this.width;
    this.scrollObj.x = this.right;
    this.scrollObj.y = this.top;
    this.scrollObj.bgcolor = this.background;
    this.scrollObj.fnsize = this.fontSize;
    this.scrollObj.fncolor = this.color;
    this.scrollObj.scrlspeed = this.scrollamount;
    this.scrollObj.direction = this.direction;
    this.scrollObj.clientname = this.clientUsername;
    this.scrollObj.scroller_type = this.ScrollerType
    this.scrollObj.fontname = this.selectedFont
    this.scrollObj.playlistid = this.playlistid ? this.playlistid : "null"
    // console.log(this.scrollObj);

    let fd = new FormData();
    fd.append('name', this.scrollname)
    fd.append('id', this.scrollObj.id)
    fd.append('clientname', this.clientUsername)
    fd.append('message', this.marqueeMessage)
    fd.append('isactive', 'true')
    fd.append('behavior', this.behavior)
    fd.append('height', this.height)
    fd.append('width', this.width)
    fd.append('x', this.right)
    fd.append('y', this.top)
    fd.append('bgcolor', this.background)
    fd.append('fnsize', this.fontSize)
    fd.append('fontname', this.selectedFont)
    fd.append('fncolor', this.color)
    fd.append('scrlspeed', this.scrollamount.toString())
    fd.append('direction', this.direction)
    fd.append('scroller_type', this.ScrollerType)
    fd.append('playlistid', this.playlistid ? this.playlistid : "0");
    let username: any = this.storageService.getUsername();
    fd.append('createdby', username);
    if (this.isPreviouslogo) {
      if (this.logoList[0]) {
        fd.append('logo_path', this.logoList[this.logoList.length - 1])
      } else {
        fd.append('logo_path', 'null')
      }
    } else if (this.selectedLogo != 'none') {
      fd.append('logo_path', this.selectedLogo)
    } else if (this.logos.length != 0) {
      fd.append('logo', this.logos[0].file);
    } else {
      fd.append('logo_path', 'null')
    }
    if (this.scrollname) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      });
      this.clientService.updateScrollerByClientnameAndId(fd).subscribe((res: any) => {
        // console.log(res);
        this.alertService.showSuccess(res.message);
        loader.close();
        this.ngOnInit();
        if (this.playlistid != 0) {
          // window.location.reload();
        }

      })
    } else {
      this.alertService.showError("Please Enter the Name");
    }
  }
  editSroller(obj: any) {
    console.log(obj);
    console.log(this.scrollObj);

    this.scrollObj = obj;
    this.scrollname = obj.name;
    this.behavior = obj.behavior;
    this.height = obj.height;
    this.width = obj.width;
    this.right = obj.x;
    this.top = obj.y;
    this.background = obj.bgcolor;
    this.fontSize = obj.fnsize;
    this.color = obj.fncolor;
    this.scrollamount = obj.scrlspeed;
    this.marqueeMessage = obj.message;
    this.direction = obj.direction;
    this.ScrollerType = obj?.scrollTypeMaster?.id
    this.selectedFont = obj?.font_folder
    this.selectedLogo = obj?.logo
  }
  deleteScroller(id: any) {
    this.clientService.deletScrollerById(id, this.storageService.getUsername()).subscribe((res: any) => {
      // console.log(res);
      this.alertService.showSuccess(res?.message);
      this.ngOnInit();
    }, err => {
      this.alertService.showError(err?.error?.message);
    })
  }


  fontFile: File | null = null;
  fontFamily: string | null = null;

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
        // this.fontList = res?.list;
      })
    }
  }
  reset() {
    this.marqueeMessage = "Enter your text here";
    this.direction = "left";
    this.newScroller = "Add new Scroller";
    this.selectedFont = "none";
    this.scrollname = "";
    this.behavior = "scroll";
    this.scrollObj = {}
    this.background = "#000000";
    this.fontSize = 35;
    this.color = "#FFFFFF";
    this.scrollamount = 10;
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


  onLogoChange(event: any) {
    this.logos = [];
    this.selectedLogo = 'none'
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.isValidFileType(files[i])) {
            this.logos.push({
              file: files[i],
              url: reader.result as string,
              type: files[i].type
            });
          } else {
            this.alertService.showInfo("unsupported format file...")
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeLogo() {
    this.selectedLogo = 'none';
    this.logos = [];
    this.isPreviouslogo = false;
  }
  isValidFileType(file: any) {

    const validMimeTypes = [
      "image/png",
      "image/jpeg",
    ];
    const validExtensions = [
      "png",
      "jpg",
      "jpeg",
    ];

    const mimeType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidMimeType = validMimeTypes.includes(mimeType);
    const isValidExtension = validExtensions.includes(fileExtension);
    return isValidMimeType && isValidExtension;
  }
}
