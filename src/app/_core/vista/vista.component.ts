import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { AlertService } from '../services/alert.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { StorageService } from '../services/storage.service';
import { LoaderComponent } from '../loader/loader.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

declare var VistaCreateEditor: any;

interface BaseExportResult {
  id: string;
  format: 'jpg' | 'png' | 'svg' | 'pdf' | 'gif' | 'mp4' | 'webp';
  projectName: string;
  width: number;
  height: number;
  measureUnits: string;
}
export interface PartnerExportResult extends BaseExportResult {
  url: string;
  extension: 'jpg' | 'jpeg' | 'png' | 'gif' | 'mp4' | 'zip';
}

export interface PartnerExportLowResResult extends BaseExportResult {
  downloadId: string;
  previews: { url: string; mime: string }[];
  licensableItems: { id: string }[];
}

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss']
})
export class VistaComponent implements OnInit {
  playList: any;
  clientUsername: any;
  username: any;
  type: any;
  iframeSrc: string = '';
  constructor(private activatedRoute: ActivatedRoute, private clientService: ClientService, private matDialog: MatDialog, private Alert: SweetAlertService, private storageService: StorageService, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    if (data) {
      this.username = data;
    }
    console.log(this.username);
  }


  ngOnInit(): void {
    let v: any = document.getElementById('iframe');
    console.log(v);
    this.clientUsername = this.storageService.getClientUsername();
    if (this.type) {
      v.src = 'https://ds.iqtv.in/reditor/#/customer/' + this.type + "/" + this.clientUsername;
    } else {
      v.src = 'https://ds.iqtv.in/reditor_mobile/#/customer/' + this.clientUsername;
    }
    console.log(v);
  }
 
  async editeOnVista(playlist: any, data: any) {
    let cu: any = this.storageService.getCurrentUser();
    // console.log(cu);

    // console.log(data);

    // console.log(playlist);

    this.playList = playlist;
    // console.log(data.url);
    let v = data.url;

    const api = await VistaCreateEditor.init({
      apiKey: "GATVAC0-B61MCJM-PYKW2DG-0ZM12JE",
      designType: "instagramSM",
      // logoUrl: "http://localhost/iqsignage/iqworld/1/ALL/Om%20Namo%20Venkateshaya/IQ_WORLD_668.png",
      customDimensions: {
        width: 1080,
        height: 1920,
        measureUnits: "px"
      },
      sidebarTabsConfig: {
        video: true,
        designs: [
          "crello",
          "partner"
        ],
        background: [
          "videos",
          "photos",
          "colors"
        ],
        text: [
          "fonts",
          "styles"
        ],
        styles: true,
        library: [
          "uploads",
          "purchased"
        ],
        photos: [
          "partner",
          "premium",
          "stock"
        ],
        objects: [
          "static",
          "animated"
        ],
        music: [
          "explore",
          "myMusic"
        ]
      },
      sidebarTabs: [
        "designs",
        "photos",
        "video",
        "music",
        "text",
        "styles",
        "objects",
        "background",
        "library"
      ],
      fitImageMode: "contain",
      tabsContentCategories: [
        "charts",
        "animals",
        "food",
        "animationsMusic",
        "animationsPeople"
      ],
      user: {
        email: cu.email,
        externalUserId: cu.username
      },
      translations: {
        en: [
          {
            key: "headerButtonPublish",
            value: "Upload"
          },]
      },
      onPublishAction: async (data: any) => {
        // console.log(data);
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        });
        let obj = await dataURItoBlob(data.url);
        // console.log(loader);

        this.uploadFiles(obj);
      }
    });

    enum FitImageMode {
      cover = 'cover',
      contain = 'contain',
    }
    // console.log(api);

    // console.log(data.type == "image");

    if (data.type == "image") {
      let obj = await api.addImages({
        images: [data.url],
        fitImageMode: "cover"
      })
      // console.log(obj);

    }


  }

  async editeOnVistaCreatePlan(playlist: any) {
    // console.log(playlist);

    let cu: any = this.storageService.getCurrentUser();
    this.playList = playlist;
    const api = await VistaCreateEditor.init({
      apiKey: "GATVAC0-B61MCJM-PYKW2DG-0ZM12JE",
      designType: "instagramSM",
      customDimensions: {
        width: 1080,
        height: 1920,
        measureUnits: "px"
      },
      sidebarTabsConfig: {
        video: true,
        designs: [
          "crello",
          "partner"
        ],
        background: [
          "videos",
          "photos",
          "colors"
        ],
        text: [
          "fonts",
          "styles"
        ],
        styles: true,
        library: [
          "uploads",
          "purchased"
        ],
        photos: [
          "partner",
          "premium",
          "stock"
        ],
        objects: [
          "static",
          "animated"
        ],
        music: [
          "explore",
          "myMusic"
        ]
      },
      sidebarTabs: [
        "designs",
        "photos",
        "video",
        "music",
        "text",
        "styles",
        "objects",
        "background",
        "library"
      ],
      fitImageMode: "contain",
      tabsContentCategories: [
        "charts",
        "animals",
        "food",
        "animationsMusic",
        "animationsPeople"
      ],
      user: {
        email: cu.email,
        externalUserId: cu.username
      },
      translations: {
        en: [
          {
            key: "headerButtonPublish",
            value: "Upload"
          },]
      },
      onPublishAction: async (data: any) => {
        // console.log(data);
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        });
        let obj = await dataURItoBlob(data.url);
        this.uploadFiles(obj)
      },
    });
  }
  uploadFiles(file: any) {
    const fd = new FormData();
    fd.append('username', this.playList.clientname);
    if (file.type.startsWith("image")) {
      fd.append('mediatype', "3");
    } else if (file.type.startsWith("video")) {
      fd.append('mediatype', "3");
    }
    // fd.append('mediatype', this.playList.mediainfo.id);
    fd.append('playlist_id', this.playList.id);
    fd.append('file', file);
    // console.log("fd" + fd);

    this.clientService.uploadFiles(fd).subscribe((res: any) => {
      // console.log(res);
      this.Alert.successAlert(res.message);
      window.location.reload();

    })
  }

}

async function dataURItoBlob(dataURI: any) {


  // const urlToObject= async()=> {
  const response = await fetch(dataURI);
  // here image is url/location of image
  const blob = await response.blob();
  let s = blob.type.split("/");
  const file = new File([blob], 'image.' + s[1], { type: blob.type });
  // console.log(file);
  // }
  if (blob.type.startsWith("image")) {
    download(dataURI, 'image.' + s[1]);
  } else {
    download(dataURI, 'video.' + s[1]);
  }
  return file;
}

function download(dataurl: any, filename: any) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}