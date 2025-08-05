import { math } from '@amcharts/amcharts4/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpVerificationComponent } from 'src/app/_core/cellrenders/otp-verification/otp-verification.component';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { SweetAlertService } from 'src/app/_core/services/sweet-alert.service';
import { VistaComponent } from 'src/app/_core/vista/vista.component';
import Swal from 'sweetalert2';
import { PreviewComponent } from 'src/app/_core/popups/preview/preview.component';
import { CompactType, DisplayGrid, Draggable, GridType, GridsterConfig, GridsterItem, PushDirections, Resizable } from 'angular-gridster2';
// import 'swiper/swiper-bundle.css';
import { MatTabGroup } from '@angular/material/tabs';
import { ChangeMediafileOrderComponent } from 'src/app/client/_core/change-mediafile-order/change-mediafile-order.component';
import { ScrollerDesignComponent } from 'src/app/client/_core/scroller-design/scroller-design.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { map, Observable, startWith } from 'rxjs';
import { error } from 'console';
import { GooglePickerService } from 'src/app/_core/services/google-picker.service';
declare var Swiper: any;

// import SwiperCore, {
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
//   Virtual,
//   Zoom,
//   Autoplay,
//   Thumbs,
//   Controller
// } from "swiper/core";

// // install Swiper components
// SwiperCore.use([
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
//   Virtual,
//   Zoom,
//   Autoplay,
//   Thumbs,
//   Controller
// ]);

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}
interface ImagePreview {
  file: File;
  url: string;
  height: any;
  width: any;
  aspectRatioFlag: string;
}


interface bothPreview {
  file: File;
  url: string;
  type: string;
  rotate: string;
  repeat: number;
}
interface VideoPreview {
  file: File;
  url: string;
  height: number;
  width: number;
}
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-store-media-upload',
  templateUrl: './store-media-upload.component.html',
  styleUrls: ['./store-media-upload.component.scss'],
  animations: [
    trigger('showActions', [
      state('hidden', style({
        opacity: 0,
        pointerEvents: 'none',
      })),
      state('shown', style({
        opacity: 1,
        pointerEvents: 'all',
      })),
      transition('hidden => shown', animate('100ms ease-in')),
      transition('shown => hidden', animate('100ms ease-out')),
    ])]
})

export class StoreMediaUploadComponent implements OnInit {
  reloadIndex = 1;
  isEditable = false;
  imgSrc: any = "";
  tagList: any;
  chooseContentTag = "";
  isautorotate: any = false;
  selected = new UntypedFormControl(2);
  @ViewChild('tabGroup', { static: false }) tab!: MatTabGroup;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  isScrollBtnClicked = false;
  options!: Safe | any;
  split: Array<GridsterItem> | any;
  images: ImagePreview[] = [];
  isProVertical = '9:16'
  selectedSize: any = 0;
  both: bothPreview[] = [];
  ScrollerTypeList: any = [];
  selectedScroller: any = null;
  selectedStateOptions: any = [];
  videos: VideoPreview[] = [];
  selectedSplitview: any;
  playListId: any;
  isVertical = true;
  isMoblie = false;
  stateList: any = [];
  filteredStateList: any = []
  selectStateList: any = [];
  selectedStateList: any = [];
  playlist: any;
  currentDate: any;
  endDate: any = null;
  startDate: any
  isScheduled = false;
  isstateSelected = false;
  isDistrictSelected = false;
  currentTime: any = new Date();
  currentDate1: any = new Date().toISOString().slice(0, 16);
  masterSettings: any;
  client: any;
  exampleForm: FormGroup;
  brandList: any;
  scheduleInfo: any
  myControl = this.fb.control('', Validators.required);
  filteredOptions: Observable<string[]> | undefined;
  repeatFileCount = 1;
  constructor(private formBuilder: UntypedFormBuilder, private fb: FormBuilder, private googlePickerService: GooglePickerService, private renderer: Renderer2, private cdr: ChangeDetectorRef, private observer: BreakpointObserver, private router: Router, private vista: VistaComponent, private storageService: StorageService, private Alert: SweetAlertService, private alertService: AlertService, private activatedRoute: ActivatedRoute, private clientService: ClientService, private matDialog: MatDialog) {
    this.playListId = this.activatedRoute.snapshot.paramMap.get('id');
    // this.currentDate = new Date().toISOString().slice(0, 16);
    if (!googlePickerService.tokenClient) {
      this.googlePickerService.loadScripts();
    }
    setInterval(() => {
      if (this.progress < 100) {
        this.progress = this.progress + 0.1;
      }
      else {
        this.progress = 0;
      }
    }, 1000);

    this.exampleForm = this.fb.group({
      chooseContentTag: ['', Validators.required],
      myControl: this.myControl
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.brandList.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }
  isScheduleDone() {
    // console.log(this.currentTime);
    let current = new Date(this.currentTime).getTime();
    // let current = this.currentTime;
    // console.log(this.isScheduled);
    var sch_start_time = new Date(this.playlist?.sch_start_time).getTime();
    var sch_end_time = new Date(this.playlist?.sch_end_time).getTime();
    // console.log(sch_start_time < current && current < sch_end_time);
    // if (this.playlist.file_count != 0) {
    if (sch_start_time < current && current < sch_end_time) {
      this.isScheduled = true;
      return true;
    }
    else {
      this.isScheduled = false;
      return false;
    }
  }
  close() {
    this.matDialog.closeAll();
  }
  forceList: any = [];
  // clientname: any;
  mediatype: any;
  videoFd: any;
  Fd: any;
  selectedOptions: any = [];
  clientUsername: any;
  currentUser: any;
  scrollList: any = [];
  scrollList1: any = [];
  customer: any;
  isBaseUser: any = true;
  iscitySelected = false;
  isLocationSelected = false;
  isDeviceselected = false;
  checkedForm!: FormGroup;
  checkedMediaForm!: FormGroup;
  isNeedVerification = false;
  filteredBrand: Observable<string[]> | undefined;
  labelForm!: FormGroup;
  userRole: any;
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    console.log('Current User:', this.currentUser);
    this.checkedMediaForm = this.formBuilder.group({
      media: this.formBuilder.array([]),
    });
    if (this.storageService.getUserRole() === "STORE") {
      this.userRole = 'STORE';
      this.clientService.getStoreByUsername(this.currentUser.username).subscribe((res: any) => {
        this.getCategoryBystoreId(res.id);
        this.clientUsername = res.clientname;
        // Code that depends on clientUsername
        this.initializeComponents();
        this.getClientByUsername(this.clientUsername);
      })
    } else if (this.storageService.getUserRole() === "SUBUSER") {
      this.userRole = 'SUBUSER';
      this.clientService.getSuserByUsername(this.currentUser.username).subscribe((res: any) => {
        this.getCategoryBystoreId(res.storeid);
        this.clientUsername = res.clientname;
        // Code that depends on clientUsername
        this.initializeComponents();
        this.getClientByUsername(this.clientUsername);
      })
    } else {
      this.userRole = 'CLIENT';
      this.clientUsername = this.storageService.getClientUsername();
      // Code that depends on clientUsername
      this.initializeComponents();
      this.getClientByUsername(this.clientUsername);

    }
    this.getAllContentTags()
  }
  initializeComponents() {
    this.getSplitLayoutsByPlaylistId();
    let myVar = setInterval(async () => {
      this.currentTime = sessionStorage.getItem('currentTime');
      this.currentDate = new Date(this.currentTime).toISOString().slice(0, 19);
    }, 1000);
    this.optionsGridster();
    const swiper = new Swiper('.swiper-slider', {
      centeredSlides: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false,
      },
      speed: 1000,
      slidesPerView: 1,
      slidesPerGroup: 1,
    });
    this.getStateAllList();
    this.getScrollerList();
    this.getAllMediaInfoByPlaylistId("true");
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      const sidebar = document.querySelector(".sidebar");
      if (res.matches) {
        this.isMoblie = true;
        sidebar!.classList.add("close");
      } else {
        this.isMoblie = false;
        sidebar!.classList.remove("close");
      }
    });
    this.clientService.getPlaylistScheduleDetailsByPlaylistId(this.playListId).subscribe((res: any) => {
      this.scheduleInfo = res;
      if (this.scheduleInfo.isapproved && (this.userRole != 'SUBUSER' && this.userRole != 'STORE')) {
        // this.getCategoryBystoreId();
        history.back();
      }
    })
    this.clientService.getplaylistByplaylistIdNdclientUsername(this.playListId, this.clientUsername).subscribe((res: any) => {
      this.playlist = res;
      // geocode(res);
      this.selectedScroller = res?.scrollTypeMaster?.id;
      this.selectedSplitview = res.splitview;
      this.mediatype = this.playlist.mediainfo.id;
      this.startDate = this.playlist.sch_start_time;
      this.endDate = this.playlist.sch_end_time;
      this.selectedOptions = this.playlist.scrollid_list;
      this.selectedCategories = this.playlist?.category_list;
      this.selectedDevices = this.playlist?.device_listIds;
      if (this.playlist.scheduletype == "STATE") {
        this.isstateSelected = true;
      } else if (this.playlist.scheduletype == "DISTRICT" && !this.isstateSelected) {
        this.isDistrictSelected = true;
      } else if (this.playlist.scheduletype == "CITY" && !this.isstateSelected && !this.isDistrictSelected) {
        this.iscitySelected = true;
      } else if (this.playlist.scheduletype == "LOCATION" && !this.isstateSelected && !this.iscitySelected && !this.isDistrictSelected) {
        this.isLocationSelected = true;
      } else {
        this.isDeviceselected = true;
      }
      console.log(this.selectedCategories);
      console.log(this.selectedDevices);
      this.getDevicesByCategory();
      this.getScheduleDetails();
      if (this.storageService.getUserRole() != "STORE" && this.storageService.getUserRole() != "SUBUSER") {
        this.getCategoryBystoreId(res?.store.id);
        this.getDevicesByCategory();
      }

    });
    this.clientService.getScrollerType().subscribe(res => {
      this.ScrollerTypeList = res;
    });
    this.clientService.getClientByUsername(this.clientUsername).subscribe((res: any) => {
      this.customer = res;
      if (res.versionMaster.version == "BASIC") {
        this.isBaseUser = true;
      } else {
        this.isBaseUser = false;
      }
    });
    this.clientService.getScrollerByClientnameNdPlaylistid(this.clientUsername, "0").subscribe((res: any) => {
      this.scrollList = res;
    });

  }

  formatSizeUnits1(kb: any) {
    let bytes: any = kb * 1024;
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { bytes = bytes + " bytes"; }
    else if (bytes == 1) { bytes = bytes + " byte"; }
    else { bytes = "0 bytes"; }


    return bytes;
  }
  formatSizeUnits(kb: any) {
    let bytes: any = kb * 1024;
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { bytes = bytes + " bytes"; }
    else if (bytes == 1) { bytes = bytes + " byte"; }
    else if (bytes < 1) { bytes = - math.round((bytes / 1000000)) + " MB"; }
    else { bytes = "0 bytes"; }

    if (bytes < 1) {

      return - bytes;
    }
    return bytes;
  }
  selectedTabValue(tab: any) {
    this.checkedMediaForm = this.formBuilder.group(
      {
        media: this.formBuilder.array([]),
      }
    );
    this.checkedForm = this.formBuilder.group(
      {
        device: this.formBuilder.array([]),
      }
    )
    this.selectedAllMedia = false;
    let reloadIndex = sessionStorage.getItem('reloadIndex');
    let loaded = sessionStorage.getItem('loaded');
    let isProVertical: any = sessionStorage.getItem('isProVertical');
    if (isProVertical) {
      this.isProVertical = isProVertical;
    }
    if (reloadIndex && loaded) {
      this.tab.selectedIndex = reloadIndex;
      sessionStorage.removeItem('reloadIndex');
    }
    this.both = [];
    // if (reloadIndex) {
    //   if (tab.index == 2) {
    //     this.tab.selectedIndex = reloadIndex;
    //     // sessionStorage.setItem('reloadIndex', tab.index);
    //     sessionStorage.removeItem("loaded");
    //     sessionStorage.removeItem("isProVertical");
    //     this.getSplitLayoutsByPlaylistId();
    //   }
    // } else {
    if (tab.index == 0) {
      if (!loaded) {
        sessionStorage.removeItem('reloadIndex');
      }
      this.isVertical = true;
      this.getAllMediaInfoByPlaylistId("true");
    }
    if (tab.index == 1) {
      this.isVertical = false;
      this.getAllMediaInfoByPlaylistId("false");
      if (!loaded) {
        sessionStorage.removeItem('reloadIndex');
      }
    }
    if (tab.index == 2) {
      this.getSplitLayoutsByPlaylistId();
      sessionStorage.setItem('reloadIndex', tab.index);
      sessionStorage.removeItem("loaded");
      sessionStorage.removeItem("isProVertical");
    }
    // }
    this.exampleForm.reset();
  }

  applyForce(event: any, device: any) {
    // console.log(event);
    if (!event.checked) {
      this.forceList.push(device.id)
    } else {
      this.forceList.forEach((e: any) => {
        this.forceList = this.forceList.filter((item: any) => item !== device.id);
      })
    }
    // console.log(this.forceList);

  }

  scheduleFormater(): any {

    let current = new Date(this.currentTime).getTime();
    // let current = this.currentTime
    var sch_start_time = new Date(this.playlist.sch_start_time).getTime();
    var sch_end_time = new Date(this.playlist.sch_end_time).getTime();

    // console.log(sch_start_time > current);
    // console.log(sch_start_time < current && current < sch_end_time);
    // console.log(current > sch_end_time);
    if (sch_start_time != 0 && sch_end_time != 0) {
      if (sch_start_time > current) {
        return 'Scheduled';
      } else if (sch_start_time < current && current < sch_end_time) {
        return 'Onprogress';
      } else if (current > sch_end_time) {
        return 'Finished';
      }
      else {
        return "Not-scheduled";
      }
    }

    else {
      return "Not-scheduled";
    }
  }
  getScheduleDetails() {
    let current = new Date(this.currentTime).getTime();

    // console.log(this.isScheduled);
    var sch_start_time = new Date(this.playlist.sch_start_time).getTime();
    var sch_end_time = new Date(this.playlist.sch_end_time).getTime();
    // console.log(sch_start_time < current && current < sch_end_time);
    // if (this.playlist.file_count != 0) {
    if (sch_start_time < current && current < sch_end_time) {
      this.isScheduled = true;
    }
    else {
      this.isScheduled = false;
    }
    // console.log(this.isScheduled);
    // }
  }
  isNotComplete: any = []
  getAllMediaInfoByPlaylistId(isvertical: any) {

    this.clientService.getmediafilesByPlaylistNdOrientation(this.playListId, this.isVertical).subscribe((res: any) => {
      // console.log(res);
      let existedImage: any[] = res;
      // this.existedImages = res;
      this.existedImages.length = 0;
      existedImage.map(e => {
        e.rotate = 0;
        if (e?.mediainfo?.mediatype) {
          if (e?.mediainfo?.mediatype === 'url') {
            e.type = "youtube";
            this.existedImages.push(e);
          } else {
            e.type = e?.mediainfo?.mediatype
            this.existedImages.push(e);
          }
        }

        // let v: any = this.isImage(e.filename);
        // let pdf: any = this.isPdf(e.filename);
        // // console.log(v);
        // e.isCheck = false;
        // if (v) {
        //   e.type = "image";
        //   e.rotate = '0';
        //   this.existedImages.push(e);
        // } else if (pdf) {
        //   e.type = "pdf";
        //   e.rotate = '0';
        //   this.existedImages.push(e);
        // } else {
        //   e.type = "video";
        //   e.rotate = '0';
        //   this.existedImages.push(e);
        // }
      })
      this.existedImages.forEach((element: any) => {
        // console.log(element.iscomplete);
        if (!element.iscomplete) {
          // let v = setInterval(() => {
          //   // Math.round(number * 100) / 100;
          //   // if (element.converted_percentage >= 100) {
          //   //   clearInterval(v);
          //   //   element.iscomplete = true;
          //   // } else {
          //   // element.converted_percentage = Math.round((element.converted_percentage + Math.random()) * 100) / 100;
          //   // this.getAllMediaInfoByPlaylistId("");
          //   if (element.converted_percentage >= 100) {
          //     clearInterval(v);
          //     element.iscomplete = true;
          //   } else {
          //     clearInterval(v);
          //     // this.ngOnInit();
          //   }
          // }, 10000);
          this.isNotComplete.push(true);
        }
      });
      if (this.isNotComplete.includes(true)) {
        let v = setInterval(() => {
          this.ngOnInit();
          this.isNotComplete = [];
          clearInterval(v);
        }, 10000);
      }
    })
  }
  scrollerList: any;
  getScrollerList() {

    this.clientService.getScrollerByClientnameNdPlaylistid(this.clientUsername, this.playListId).subscribe((res: any) => {
      // console.log(res);
      this.scrollerList = res;
      // console.log(this.scrollerList);

      // let v;
      // for (let o of this.scrollerList) {
      //   let x = document.createElement("SPAN");
      //   x.style.color=o.fncolor
      // }
    })
  }

  setDefault(setdefault: any, p: any) {
    // console.log(setdefault.checked);
    // console.log(playlist);
    Swal.fire({
      title: 'Do you want to set Default content?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.setPlaylistAsDefault(this.clientUsername, setdefault.checked, this.playlist.state.id, this.playlist.id, this.playlist.isvertical, this.storageService.getUsername()).subscribe((res: any) => {
          const myTimeout = setTimeout(() => {
            Swal.fire('Saved!', res.message, 'success');
            // window.location.reload();
            this.ngOnInit();
            loader.close();
          }, 5000);

        }, err => {
          console.log(p);

          this.alertService.showError(err?.error?.message);
          p.isactive = !p.isactive
          p.isverified = !p.isverified
          this.ngOnInit();
          loader.close();
        })
      } else if (result.isDenied) {
        // console.log("ooooooooooo");
        p.isactive = !p.isactive
        p.isverified = !p.isverified
        setdefault.checked = !setdefault.checked
        this.ngOnInit();
        Swal.fire('Changes are not saved', '', 'info');
      }
    })
  }
  checkAspectRatio(image: any): void {
    image.is16_9 = Math.abs(image.width / image.height - 16 / 9) < 0.01;
  }
  isPdf(v: any) {
    const imageExtensions = ['.PDF', '.pdf']
    let status = false;
    let up = v.toUpperCase();
    // console.log(up);
    imageExtensions.map((e: any) => {
      let c = up.includes(e);
      if (c) {
        status = c;
      }
    })

    return status;
  };
  openPdf(url: string) {
    if (url) {
      const newWindow = window.open('', '_blank', 'fullscreen=yes');
      if (newWindow) {
        newWindow.document.write('<iframe width="100%" height="100%" src="' + url + '"></iframe>');
      } else {
        console.error('Failed to open new window');
      }
    } else {
      console.error('PDF URL is not available');
    }
  }
  isImage(v: any) {
    const imageExtensions = ['.GIF', '.PNG', '.JPG', '.JPEG']
    let status = false;
    let up = v.toUpperCase();
    // console.log(up);
    imageExtensions.map((e: any) => {
      let c = up.includes(e);
      if (c) {
        status = c;
      }
    })

    return status;
  };
  onFileChange(event: Event) {
    // this.images=[];
    const files = (event.target as HTMLInputElement).files;
    // console.log(files);

    // this.filesList = files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          const image = new Image();
          image.onload = () => {
            this.images.push({
              file: files[i],
              url: reader.result as string,
              height: image.height,
              width: image.width,
              aspectRatioFlag: Math.abs(image.height / image.width - 16 / 9) < 0.01
                ? '16:9 Aspect Ratio'
                : 'Aspect Ratio Mismatch'
            });
          };
          image.src = reader.result as string;
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  updatePreview(image: ImagePreview) {
    if (image.height > 0 && image.width > 0) {
      const aspectRatio = 9 / 16; // 9:16 aspect ratio (portrait)
      if (image.height / image.width !== aspectRatio) {
        if (image.height > image.width) {
          // Adjust width based on height
          image.width = Math.round(image.height / aspectRatio);
        } else {
          // Adjust height based on width
          image.height = Math.round(image.width * aspectRatio);
        }
      }
    }
  }

  removeImage(image: ImagePreview) {
    const index = this.images.indexOf(image);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

  removeFile(image: bothPreview) {
    const index = this.both.indexOf(image);
    if (index !== -1) {
      this.both.splice(index, 1);
    }
    // console.log(image);
    // console.log(this.selectedSize);

    this.selectedSize = ((this.selectedSize * 1000) - image?.file?.size) / 1000;
  }

  uploadImages() {

    this.Fd = []
    const fd = new FormData();
    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      fd.append('file', image.file);

    }
    fd.append('username', this.currentUser.username);
    fd.append('mediatype', '1');
    fd.append('playlist_id', this.playListId);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.sendOtp(this.clientUsername).subscribe((res: any) => {
      // console.log(res);
      loader.close();
      if (res.message == "success") {
        this.verifyOtp("image", fd);
      }
    }, err => {
      loader.close();
      this.alertService.showError(err?.error?.message);
    })
    // this.clientService.uploadImages(fd).subscribe((res: any) => {
    //   console.log(res);
    //   this.Alert.successAlert(res.message);
    //   this.getAllMediaInfoByPlaylistId();
    // })
  }

  onFileChangeVideo(event: Event) {
    // this.videos=[];
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          this.videos.push({
            file: files[i],
            url: reader.result as string,
            height: 500, // Default height
            width: 1020, // Default width
          });
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  onFileChangeFile(event: Event) {
    // this.videos=[];
    const files = (event.target as HTMLInputElement).files;
    // console.log(files);
    console.log(this.masterSettings);

    if (files && files.length) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          // console.log(this.selectedSize);
          if ((this.playlist?.storage?.store_totalmemory - this.playlist?.storage?.store_usedmemory) >= (files[i].size / 1000) && (files[i].size / 1000) <= this.playlist?.storage?.store_totalmemory) {
            // console.log("a");
            if ((this.playlist?.storage?.playlist_totalmemory - this.playlist?.storage?.playlist_usedmemory) >= (files[i].size / 1000)) {
              // console.log("b");
              if ((Math.round(files[i].size / 1000000)) <= 500) {
                // console.log("c");
                // let minutes: any;
                // var media = new Audio(reader.result as string);
                // media.onloadedmetadata = function () {
                //   minutes = Math.floor(media.duration / 60);
                // };
                this.selectedSize = this.selectedSize + (files[i].size / 1000);
                // if (this.isValidFileType(files[i])) {
                //   this.both.push({
                //     file: files[i],
                //     url: reader.result as string,
                //     type: files[i].type,
                //     rotate: '0',
                //     // duration: minutes
                //   });
                // } else {
                //   this.alertService.showInfo("Invalid file " + files[i].name)
                // }
                const validationObj = this.isValidFileType(files[i])
                if (validationObj.isValid && (validationObj.isImage || validationObj.isPdf)) {
                  this.both.push({
                    file: files[i],
                    url: reader.result as string,
                    type: files[i].type,
                    rotate: '0',
                    repeat: 1
                    // duration: minutes
                  });
                } else if (validationObj.isValid && validationObj.isVideo) {
                  let video = document.createElement("video");
                  video.addEventListener('loadeddata', () => {
                    if (Math.round(video.duration) == timeStringToSeconds(this.masterSettings?.fileduration)) {
                      this.both.push({
                        file: files[i],
                        url: reader.result as string,
                        type: files[i].type,
                        rotate: '0',
                        repeat: 1
                        // duration: minutes
                      });
                    } else {
                      this.alertService.showInfo("File duration is must be  " + this.masterSettings?.fileduration)
                    }
                  }, false);
                  video.src = reader.result as string;
                } else {
                  this.alertService.showInfo("invalid file format...")
                }
              } else {
                this.alertService.showInfo("Please Choose the File below 500mb")
              }
            } else {
              if ((files[i].size / 1000) <= this.playlist?.storage?.playlist_totalmemory) {
                this.alertService.showInfo("Your playlist Limit is Reached, kindly use Another playlist")
              } else {
                this.alertService.showInfo("Please choose the file below 500mb")
              }
            }
          } else {
            this.alertService.showInfo("Storage is Full")
          }
          if (files.length == i + 1) {
            loader.close();
            this.matDialog.closeAll();
          }
        };
        reader.readAsDataURL(files[i]);



      }
    }
    // console.log(this.both);

  }

  updatePreviewVideo(video: VideoPreview) {
    const aspectRatio = 9 / 16; // 9:16 aspect ratio (portrait)
    if (video.height > 0 && video.width > 0) {
      if (video.height / video.width !== aspectRatio) {
        if (video.height > video.width) {
          // Adjust width based on height
          video.width = Math.round(video.height / aspectRatio);
        } else {
          // Adjust height based on width
          video.height = Math.round(video.width * aspectRatio);
        }
      }
    }
  }
  deleteImage(image: any) {

  }
  deleteVideo(video: any) {

  }
  removeVideo(video: VideoPreview) {
    const index = this.videos.indexOf(video);
    if (index !== -1) {
      this.videos.splice(index, 1);
    }
  }

  uploadVideos() {

    this.Fd = []
    const fd = new FormData();
    for (let i = 0; i < this.videos.length; i++) {
      const video = this.videos[i];
      fd.append('file', video.file);
    }
    fd.append('username', this.currentUser.username);
    fd.append('mediatype', '2');
    fd.append('playlist_id', this.playListId);
    // console.log('FormData:', fd);

    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.sendOtp(this.clientUsername).subscribe((res: any) => {
      // console.log(res);
      loader.close();
      if (res.message == "success") {
        this.verifyOtp("video", fd);
      }
    }, err => {
      loader.close();
      this.alertService.showError(err?.error?.message);
    })

  }
  uploadBoth() {
    // console.log(this.isVertical);
    if (this.exampleForm.valid) {
      // Process form data
      console.log(this.exampleForm.value);

      this.Fd = []
      const fd = new FormData();
      for (let i = 0; i < this.both.length; i++) {
        const both = this.both[i];
        fd.append('file', both.file);
      }
      fd.append('username', this.currentUser.username);
      fd.append('mediatype', this.playlist.mediainfo.id);
      fd.append('playlist_id', this.playListId);
      fd.append('isautorotate', this.isautorotate);
      fd.append('tagid', this.exampleForm.value.chooseContentTag)
      fd.append('brandname', this.exampleForm.value.myControl)
      // console.log('FormData:', fd);
      if (this.isVertical) {
        fd.append('isvertical', "true");
      } else {
        fd.append('isvertical', "false");
      }

      if (this.isBaseUser) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.uploadFiles(fd).subscribe((res: any) => {
          this.Alert.successAlert(res.message);
          loader.close();
          this.both = [];
          window.location.reload();
          // this.ngOnInit();
        }, err => {
          this.Alert.errorAlert(err?.error?.message);
          loader.close();
        })
      } else {
        this.closeDailog('true', '', fd);
        // this.clientService.sendOtp(this.clientUsername).subscribe((res: any) => {
        //   // console.log(res);
        //   loader.close();
        //   if (res.message == "success") {
        //     this.verifyOtp("both", fd);
        //   }
        // }, err => {
        //   this.Alert.errorAlert(err?.error?.message);
        //   loader.close();
        // })

      }
    } else {
      // Validate and display error messages
      this.exampleForm.markAllAsTouched();
    }

  }
  isAspectRatio16_9(width: number, height: number): boolean {
    const aspectRatio = width / height;
    // console.log(width, height);
    let w = 1080;
    let h = 1920;
    // return Math.abs(aspectRatio - (16 / 9)) < 0.01;
    if (width >= w && height >= h) {
      return true;
    } else {
      return false;
    }
  }
  onEdit(image: any) {
    // Implement edit functionality here
    // console.log('Edit clicked for image:', image);
    let v = this.vista.editeOnVista(this.playlist, image);

  }
  addMore() {
    let v = this.vista.editeOnVistaCreatePlan(this.playlist);

  }
  onDelete(image: any) {
    // Implement delete functionality here
    // console.log('Delete clicked for image:', image);

    Swal.fire({
      title: "Are you sure to delete ?",
      // text: "Do You Want To Delete Content? , If You Would, You Won't Be Able To Revert This!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      // console.log(result);

      if (result.isConfirmed) {
        this.clientService.deleteMediafile(image.id).subscribe((res: any) => {
          // console.log(res);
          Swal.fire(
            'Deleted!',
            res?.message,
            'success'
          )
          // this.getAllMediaInfoByPlaylistId("");
          // window.location.reload();
          this.ngOnInit();

        }, err => {
          Swal.fire(
            'error!',
            err?.error?.message,
            'error'
          )
        })

      } else {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )

      }
    })


  }
  existedImages: any = []
  selectedImage: any = null;


  onMouseEnter(image: any) {
    // console.log(image);
    this.selectedImage = image;
  }

  onMouseLeave(image: any) {
    this.selectedImage = null;
  }

  dateTimePicker() {
    // console.log(this.endDate);
    // console.log(this.startDate);
    // console.log(this.choosedPlaylist);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.setScheduleForPlaylist(this.playListId, this.startDate, this.endDate, this.currentUser.username).subscribe((res: any) => {
          // console.log(res);
          Swal.fire('Saved!', '', 'success');
          window.location.reload();
          loader.close();
        }, (err) => {
          // console.log(err.error.message == "Text '2023-07-27 14:40:00' could not be parsed at index 10");
          let dynamicHTML;
          // let Text = err.error.message;
          // let isIncludes = Text.length
          // console.log(isIncludes);
          loader.close();
          if (err.error.message.length == 58) {
            dynamicHTML = "<h4>Please choose Valid Date and Time </h4>"
          } else {
            dynamicHTML = "<h4>" + err.error.message + "</h4>"
          }

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: dynamicHTML,
            text: "",
            footer: '<a style="color:#76b2e3; font-weight:600;"> <span style="color: blue; font-weight:600;">Note:</span> Please Check Playlist has data Or Not</a>'
          })

        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  openSchedulePopUp(template: any) {
    this.matDialog.open(template, {
      minWidth: "350px"
    })
  }
  stopSchedule() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to stop schedule?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Stop it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.stopPlaylistSchedule(this.playListId, this.currentUser.username).subscribe(res => {
          // console.log(res);
          window.location.reload();
          Swal.fire(
            'Stopped!',
            'Your playlist has been Stopped.',
            'success'
          )
        }, err => {
          loader.close();
          this.alertService.showError(err?.error?.message)
        })

      }
    })
  }
  stopScheduleByUser() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Cancel schedule?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Stop it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.cancelPlaylistSchedule(this.playListId, this.currentUser.username).subscribe(res => {
          // console.log(res);
          window.location.reload();
          Swal.fire(
            'Stopped!',
            'Your playlist has been Stopped.',
            'success'
          )
        }, err => {
          loader.close();
          this.alertService.showError(err?.error?.message)
        })

      }
    })
  }
  verifyOtp(type: any, fd: any) {
    // let Dailog = this.matDialog.open(OtpVerificationComponent, {
    //   disableClose: true,
    //   data: { type: type, fd: fd, clientname: this.clientUsername }
    // });
    // Dailog.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //     // console.log("Result is TRUE!");
    //   }
    // });
    this.closeDailog(true, "", fd)
  }
  isVerified = false;
  closeDailog(data: any, mediatype: any, fd: any) {
    this.isVerified = data;
    // console.log(fd);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    if (this.isVerified) {
      this.clientService.uploadFiles(fd).subscribe((res: any) => {
        // console.log(res);
        this.Alert.successAlert(res.message);
        loader.close();
        window.location.reload();
      }, err => {
        this.Alert.errorAlert(err?.error?.message);
        loader.close();
      })
    }


  }
  @ViewChild('selectScroller') select!: MatSelect;
  allSelected = false;
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  @ViewChild('stateselect') stateselect!: MatSelect;
  allStateSelected = false;
  toggleAllStateSelection() {
    if (this.allStateSelected) {
      this.stateselect.options.forEach((item: MatOption) => item.select());
    } else {
      this.stateselect.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionStateClick() {
    let newStatus = true;
    this.stateselect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allStateSelected = newStatus;
  }
  getStateAllList() {
    // this.clientService.getStateListWithoutAll().subscribe(res => {
    //   // console.log(res);
    //   this.stateList = res;
    // })

    this.clientService.getStateListbyClientdeviceLocation(this.clientUsername).subscribe(res => {
      // console.log(res);
      this.stateList = res;
      this.filteredListState = res;


    })
  }
  onSaveClick(): void {
    // console.log(this.selectedOptions);
    // console.log(this.params.data.id);
    let payload = {
      playlist_id: this.playListId,
      statelist: this.selectedStateOptions
    }
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.editPlaylistStateList(payload).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          Swal.fire('Saved!', res.message, 'success')
        }, err => {
          loader.close();
          Swal.fire('error!!', err?.error?.message, "error");
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  btnClickedHandler() {
    // console.log(this.stateList);
    // console.log(this.selectStateList);
    this.selectedStateList = []

    for (let state of this.stateList) {

      // console.log(this.selectStateList);
      let StateInstant = { id: state.id, statename: state.statename, isSelected: false }

      if (this.selectStateList.includes(state.statename)) {
        StateInstant = { id: state.id, statename: state.statename, isSelected: true }
        if (state.id != 0) {
          this.selectedStateOptions.push(StateInstant.id)
        }
        // console.log(state);

      }
      if (state.id != 0) {
        this.selectedStateList.push(StateInstant);
      }
    }

    // console.log(this.selectedStateList);
    // console.log(this.selectedStateOptions);

    // this.matDailog.open(event, {

    // });

  }
  enableScroller(data: any) {
    // console.log(data.checked);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.enablesScroller(this.playListId, data.checked, this.storageService.getUsername()).subscribe((res1: any) => {
      // console.log(res);
      this.clientService.getplaylistByplaylistIdNdclientUsername(this.playListId, this.clientUsername).subscribe((res: any) => {
        console.log(res);
        this.playlist = res;
        this.mediatype = this.playlist.mediainfo.id;
        this.startDate = this.playlist.sch_start_time;
        this.endDate = this.playlist.sch_end_time;
        this.isScrollBtnClicked = true;
        const myTimeout = setTimeout(() => {
          this.alertService.showSuccess(res1.message);
          this.getScheduleDetails();
          this.isScrollBtnClicked = false;
          clearTimeout(myTimeout);
          loader.close();
        }, 5000);
      });
    }, err => {
      this.isScrollBtnClicked = true;
      const myTimeout = setTimeout(() => {
        this.alertService.showError(err?.error?.message);
        // this.alertService.showSuccess(res1.message);
        this.getScheduleDetails();
        this.isScrollBtnClicked = false;
        clearTimeout(myTimeout);
        loader.close();
      }, 5000);
    })
  }
  addScrollListToPlaylist(selectScroller: any) {
    // console.log(selectScroller);
    let payload = {
      playlist_id: this.playListId,
      scrollid: this.selectedOptions,
      createdby: this.storageService.getUsername()
    }
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.addScrollerToPlaylist(payload).subscribe((res: any) => {
      // console.log(res);
      // loader.close();
      // Swal.fire('Saved!!', res?.message, 'success')
      this.isScrollBtnClicked = true;
      const myTimeout = setTimeout(() => {
        this.alertService.showSuccess(res.message);
        this.isScrollBtnClicked = false;
        clearTimeout(myTimeout);
        loader.close();
        this.ngOnInit();
        window.location.reload();
      }, 5000);
    }, err => {
      // loader.close();
      // Swal.fire('error', err?.error?.message, 'error');
      this.isScrollBtnClicked = true;
      const myTimeout = setTimeout(() => {
        this.alertService.showError(err?.error?.message);
        // this.alertService.showSuccess(res1.message);
        this.isScrollBtnClicked = false;
        clearTimeout(myTimeout);
        loader.close();
      }, 5000);
    })
  }

  changeScrollerPosition() {

    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.changeScrollerPosition(this.playListId, this.selectedScroller, this.storageService.getUsername()).subscribe((res: any) => {
      // console.log(res);
      // loader.close();
      // this.alertService.showSuccess(res?.message)
      // window.location.reload();
      this.isScrollBtnClicked = true;
      const myTimeout = setTimeout(() => {
        this.alertService.showSuccess(res.message);
        this.ngOnInit();
        this.isScrollBtnClicked = false;
        clearTimeout(myTimeout);
        loader.close();
      }, 5000);
    }, err => {
      // loader.close();
      // this.alertService.showError(err?.error?.message);
      this.isScrollBtnClicked = true;
      const myTimeout = setTimeout(() => {
        this.alertService.showError(err?.error?.message);
        // this.alertService.showSuccess(res1.message);
        this.isScrollBtnClicked = false;
        clearTimeout(myTimeout);
        loader.close();
      }, 5000);
    })
  }
  updateSplitview(data: any) {
    // console.log(data);
    this.clientService.updateSplitview(this.playListId, data).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
    })
  }




  anyOneChecked: any = false;
  // checkConfigure(event: any) {
  //   console.log(event.target.checked);
  //   // if (event.target.checked) {
  //   //   this.anyOneChecked = true;
  //   // } else {
  //   //   this.anyOneChecked = false;
  //   // }
  //   var clickedId = event.target.id
  //   let selectlist: any = document.getElementsByClassName("formSelect");
  //   // console.log(selectlist);
  //   var elementsArray = [...selectlist];
  //   // Use forEach to iterate over the array of elements
  //   elementsArray.forEach((element) => {
  //     // Do something with each element
  //     // console.log(element.id == clickedId);
  //     if (event.target.checked) {
  //       if (element.id == clickedId) {
  //         // console.log(clickedId);
  //         if (clickedId == "allstate") {
  //           this.isstateSelected = true;
  //           this.isDeviceselected = false;
  //           this.isLocationSelected = false;
  //           this.iscitySelected = false;
  //         } else if (clickedId == "allcity") {
  //           this.isstateSelected = false;
  //           this.isDeviceselected = false;
  //           this.isLocationSelected = false;
  //           this.iscitySelected = true;
  //         } else if (clickedId == "alllocation") {
  //           this.isstateSelected = false;
  //           this.isDeviceselected = false;
  //           this.isLocationSelected = true;
  //           this.iscitySelected = false;
  //         } else if (clickedId == "alldevice") {
  //           this.isstateSelected = false;
  //           this.isDeviceselected = true;
  //           this.isLocationSelected = false;
  //           this.iscitySelected = false;
  //         }
  //       }
  //       // element.checked = !element.checked;
  //     } else {
  //       // element.checked = false;
  //       this.isstateSelected = false;
  //       this.isDeviceselected = false;
  //       this.isLocationSelected = false;
  //       this.iscitySelected = false;
  //     }
  //   });

  // }
  enableScrollerFreeze(event: any) {
    // console.log(event?.checked);

    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.freezeScroller(event?.checked, this.playListId).subscribe((res: any) => {
      loader.close();
      Swal.fire('Saved!!', res?.message, 'success')
      // window.location.reload();
      this.ngOnInit();
    }, err => {
      loader.close();
      Swal.fire('Saved!!', err?.error?.message, 'error')

    })
  }
  checkConfigure(event: any) {
    var clickedId = event.target.id
    let selectlist: any = document.getElementsByClassName("formSelect");
    // console.log(selectlist);
    var elementsArray = [...selectlist];
    // Use forEach to iterate over the array of elements
    elementsArray.forEach((element) => {
      // Do something with each element
      // console.log(element.id == clickedId);
      if (element.id == clickedId) {
        // console.log(clickedId);
        if (clickedId == "allstate") {

          this.isstateSelected = !this.isstateSelected;
          this.isDistrictSelected = false;
          this.iscitySelected = false;
          this.isLocationSelected = false;
          this.isDeviceselected = false;
        } else if (clickedId == "allDistrict") {
          this.isstateSelected = false;
          this.isDistrictSelected = !this.isDistrictSelected;
          this.iscitySelected = false;
          this.isLocationSelected = false;
          this.isDeviceselected = false;
        } else if (clickedId == "allcity") {
          this.isstateSelected = false;
          this.isDistrictSelected = false;
          this.iscitySelected = !this.iscitySelected;
          this.isDeviceselected = false;
          this.isLocationSelected = false;
        } else if (clickedId == "alllocation") {
          this.isstateSelected = false;
          this.isDistrictSelected = false;
          this.iscitySelected = false;
          this.isLocationSelected = !this.isLocationSelected;
          this.isDeviceselected = false;
        } else if (clickedId == "alldevice") {
          this.isstateSelected = false;
          this.isDistrictSelected = false;
          this.iscitySelected = false;
          this.isLocationSelected = false;
          this.isDeviceselected = !this.isDeviceselected;
        }
        element.checked = true;
      } else {
        element.checked = false;
      }
    });

  }



  filteredListDevice: any = [];
  filteredListCity: any = [];
  filteredListLocation: any = [];
  filteredListState: any = [];
  filteredListDistrict: any = [];

  createNewScroller() {
    this.matDialog.open(ScrollerDesignComponent, {
      maxHeight: '90vh',
      data: {
        id: this.playListId
      }
    })
  }
  preview() {
    let data;
    // console.log(this.isVertical);

    if (this.isVertical) {
      data = { width: "400", height: "700", data: this.existedImages, playlist: this.playlist }
    } else {
      data = { width: "700", height: "400", data: this.existedImages, playlist: this.playlist }
    }
    let v = this.matDialog.open(PreviewComponent, {
      data: data,
      panelClass: 'custom-dialog-container',
      width: this.isVertical ? data?.width + "px" : (parseInt(data?.width) + 50) + 'px',
      height: this.isVertical ? (parseInt(data?.height) + 22) + "px" : (parseInt(data?.height) + 22) + "px"
    })
    // console.log(data?.width+ + 10);

  }
  round(e: any) {
    return Math.round(e) + 'px';
  }
  public delete(item: any, obj: any) {
    // console.log(item);
    item?.medialist.splice(item?.medialist.indexOf(obj), 1);
    // item.url = null;
    const swiper = new Swiper('.swiper-slider', {
      centeredSlides: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
      },
      // loop: true,
      speed: 1000,
      slidesPerView: 1, // Adjust this value
      slidesPerGroup: 1, // Adjust this value

    });
  }
  selectedScreenValue: any;
  onFileChangeFileG(event: Event, item: any) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          // console.log(files[i]);
          let obj = {
            file: files[i],
            url: reader.result as string,
            type: files[i].type
          };

          if (item.medialist?.length == 1 && item?.medialist[0]?.url.includes('assets')) {
            item?.medialist.splice(item?.medialist.indexOf(item?.medialist[0]), 1);
          }
          item?.medialist?.push(obj);
          const swiper = new Swiper('.swiper-slider', {
            centeredSlides: true,
            slidesPerView: 1, // Adjust this value
            slidesPerGroup: 1, // Adjust this value
            autoplay: {
              delay: 2200,
              disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
            },
            // loop: true,
            speed: 1000,
            on: {
              // slideChangeTransitionStart: () => {
              //   swiper.loop = "true";
              //   // console.log(swiper.activeIndex);
              //   const activeSlide = swiper.slides[swiper.activeIndex];

              //   const isVideo = activeSlide.querySelector('video');
              //   console.log(isVideo);
              //   if (isVideo) {
              //     // Disable autoplay when a video slide is active
              //     isVideo.play();
              //     // swiper.autoplay.stop();
              //     swiper.autoplay = "false"

              //     // this.autoplayEnabled = false;

              //     isVideo.addEventListener('ended', () => {
              //       // Enable autoplay after the video ends
              //       swiper.autoplay = "true";
              //       // this.autoplayEnabled = true;
              //       isVideo.pause();
              //       // Move to the next slide
              //       swiper.slideNext();
              //     });
              //   } else {
              //     if (!swiper.autoplay) {
              //       swiper.autoplay = "true";
              //       swiper.slideNext();
              //       swiper.autoplay.paused = false;
              //     }
              //   }
              // },
            },
          });

        }
        reader.readAsDataURL(files[i]);
      }
    }

    // console.log(item);

  }
  sendOtp() {
    this.createSplitScreen(true, this.playlist, this.isProVertical)
    // let loader = this.matDialog.open(LoaderComponent, {
    //   panelClass: 'loader-upload'
    // })
    // this.clientService.sendOtp(this.clientUsername).subscribe((res: any) => {
    //   loader.close();
    //   if (res.message == "success") {
    //     let Dailog = this.matDialog.open(OtpVerificationComponent, {
    //       disableClose: true,
    //       data: { playlist: this.playlist, clientname: this.clientUsername, isProVertical: this.isProVertical }
    //     });
    //     Dailog.afterClosed().subscribe((result: any) => {
    //       if (result) {
    //         // console.log("Result is TRUE!");
    //         // this.createSplitScreen();
    //       }
    //     });
    //   }
    // }, err => {
    //   loader.close();
    //   this.alertService.showError(err?.error?.message);
    // })
  }
  createSplitScreen(type: any, playlist: any, isProVertical: any) {
    // console.log(type);
    if (type) {

      this.router.navigate(['/store/lay-out', playlist.id],
        { state: { playlist: playlist, type: isProVertical } })

      // this.matDialog.open(LayoutComponent, {
      //   disableClose: true,
      //   data: { playlist: playlist, type: isProVertical }
      // });
    }
    // this.layoutComponent.ngAfterViewInit();
  }
  optionsGridster() {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: 2.5,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 160,
      useBodyForBreakpoint: false,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 213,
      fixedRowHeight: 120,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        // enabled: true
        enabled: false
      },
      resizable: {
        // enabled: true
        enabled: false
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
    const swiper = new Swiper('.swiper-slider', {
      centeredSlides: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
      },
      // loop: true,
      speed: 1000,
      slidesPerView: 1, // Adjust this value
      slidesPerGroup: 1, // Adjust this value
    });
  }
  rotateMedia(template: any, media: any) {
    this.matDialog.open(template, {
      disableClose: true,
      panelClass: "rotateMedia",
      data: media
    })
  }
  rotatePopUp(media: any) {
    media.rotate = parseInt(media?.rotate) + 90;
    if (media?.rotate == '360') {
      media.rotate = 0
    }
  }
  matDialogClose() {
    this.matDialog.closeAll();
    this.ngOnInit();
  }
  getSplitLayoutsByPlaylistId() {
    this.clientService.getSplitLayoutsByPlaylistId(this.playListId, this.isProVertical == '9:16' ? true : false).subscribe((res: any) => {
      // console.log(res);
      this.split = res;
      const myTimeout = setTimeout(() => {
        const swiper = new Swiper('.swiper-slider', {
          centeredSlides: true,
          autoplay: {
            delay: 2200,
            disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
          },
          // loop: true,
          speed: 1000,
          slidesPerView: 1, // Adjust this value
          slidesPerGroup: 1, // Adjust this value
        });
        clearTimeout(myTimeout);
      }, 5000);


    }, err => {
      // console.log(err?.error?.message);
      this.alertService.showError(err?.error?.message)
    })
  }

  refreshSplitLayoutsPlaylist(playlistId: any, isProVertical: any) {
    this.isProVertical = isProVertical;
    this.playListId = playlistId;
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.getSplitLayoutsByPlaylistId(playlistId, isProVertical == '9:16' ? true : false).subscribe((res: any) => {
      // console.log(res);
      sessionStorage.setItem("loaded", 'true');
      sessionStorage.setItem("isProVertical", isProVertical);
      this.split = res;
      const refresh = setTimeout(() => {
        this.getSplitLayoutsByPlaylistId();
        loader.close();
        let v = sessionStorage.getItem('clientid');
        if (v) {
          this.router.navigate(["/client-mobile/playlist/uploadmedia/", playlistId]).then(() => {
            this.ngOnInit();
          });
        } else {
          this.router.navigate(["/store/mediaupload/", playlistId]).then(() => {
            this.ngOnInit();
          });
        }

      }, 2000);
      const myTimeout = setTimeout(() => {
        const swiper = new Swiper('.swiper-slider', {
          centeredSlides: true,
          autoplay: {
            delay: 2200,
            disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
          },
          // loop: true,
          speed: 1000,
          slidesPerView: 1, // Adjust this value
          slidesPerGroup: 1, // Adjust this value
        });
        clearTimeout(myTimeout);
      }, 5000);
    }, err => {
      // console.log(err?.error?.message);
      this.alertService.showError(err?.error?.message)
    })
  }
  onEditSplit(layout: any) {
    // console.log(layout);
    // let loader = this.matDialog.open(LoaderComponent, {
    //   panelClass: 'loader-upload'
    // })
    // this.clientService.sendOtp(this.clientUsername).subscribe((res: any) => {
    //   loader.close();
    //   if (res.message == "success") {
    //     let Dailog = this.matDialog.open(OtpVerificationComponent, {
    //       disableClose: true,
    //       data: { playlist: this.playlist, layout: layout, clientname: this.clientUsername, isProVertical: this.isProVertical }
    //     });

    //   }
    // }, err => {
    //   loader.close();
    //   this.alertService.showError(err?.error?.message);
    // })
    this.conformEdit(true, this.playlist, this.isProVertical, layout);
    this.matDialog.closeAll();
  }
  conformEdit(type: any, playlist: any, isProVertical: any, layout: any) {
    if (type) {
      this.router.navigate(['/store/lay-out', layout.id],
        { state: { playlist: playlist, type: isProVertical, layout: layout } });
    }

  }
  onRemoveSplit(layout: any) {
    // console.log(layout);
    Swal.fire({
      title: "Are you sure to delete ?",
      // text: "Do You Want To Delete Content? , If You Would, You Won't Be Able To Revert This!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteSplitLayout(layout?.id).subscribe((res: any) => {
          // console.log(res);
          Swal.fire({
            title: "Deleted!",
            text: res?.message,
            icon: "success"
          });
          this.getSplitLayoutsByPlaylistId();
        })

      }
    });


  }
  onchangeList(refresh: any) {
    // return item.layoutname;
    this.getSplitLayoutsByPlaylistId();
    refresh?.classList.add('rotate')
    const myTimeout = setTimeout(() => {
      refresh?.classList.remove('rotate');
      clearTimeout(myTimeout)
    }, 2000)
  }
  changeMediaFilesOrder(files: any, type: any) {
    this.matDialog.open(ChangeMediafileOrderComponent, {
      height: '600px',
      // width: '80vw',
      disableClose: true,
      panelClass: 'order-class',
      data: { files: files, type: type }
    })
  }
  changeMediaFilesOrderForZone(zone: any) {
    // console.log(zone);
    this.matDialog.open(ChangeMediafileOrderComponent, {
      height: '600px',
      // width: '80vw',
      disableClose: true,
      panelClass: 'order-class',
      data: { files: zone, type: 'zone' }
    })
  }
  previewLayout(event: any, item: any) {
    // console.log(item);
    // console.log(event);

    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      imageUrl: item.url,
      imageWidth: 230,
      imageHeight: 350,
      imageAlt: "Custom image"
    });
  }

  showDefaultLayouts(e: any) {
    this.clientService.getDefaultLayOutByOrientation(this.isProVertical == "9:16" ? true : false).subscribe((res: any) => {
      console.log(res);
      this.matDialog.open(e, {
        height: '90vh',
        width: "90vw",
        data: res
      });
    })
  }
  onChooseLayout(layout: any) {
    // console.log(layout);
    layout!.isDefault = true;
    this.onEditSplit(layout)
  }

  saveFile(file: any) {
    // console.log(file);
    let payload = {
      path: file.url,
      angle: file.rotate,
      createdby: this.currentUser?.username
    }
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.rotateFile(payload).subscribe((res: any) => {
      console.log(res);
      this.alertService.showSuccess(res.message);
      // loader.close();
      this.matDialog.closeAll();
      this.ngOnInit();
    }, err => {
      this.alertService.showError(err?.error?.message);
      loader.close();
    })
  }
  onMediaCheckboxChangeForAllSelect(e: any, b: any) {
    const service: UntypedFormArray = this.checkedMediaForm?.get('media') as UntypedFormArray;
    console.log(e);
    console.log(b);
    b.forEach((element: any) => {
      element.isCheck = e.checked ? true : false;
      if (element?.iscomplete) {
        if (e.checked) {
          this.selectedAllMedia = true;
          if (!service.value.includes(element.id)) {
            service.push(new UntypedFormControl(element.id));
          }
        } else {
          this.selectedAllMedia = false;
          let i: number = 0;
          service.controls.forEach((item: any) => {
            service.removeAt(i);
            return;
            i++;
          });
        }
      }
      // console.log(element);
    });
    // console.log(service);
  }
  selectedAllMedia: any = false;
  onMediaCheckboxChange(e: any, b: any) {
    const service: UntypedFormArray = this.checkedMediaForm?.get('media') as UntypedFormArray;
    console.log(e);
    console.log(b);
    if (e.checked) {
      if (!service.value.includes(b.id)) {
        service.push(new UntypedFormControl(b.id));
      }
    } else {
      this.selectedAllMedia = false;
      let i: number = 0;
      service.controls.forEach((item: any) => {
        if (item.value == b.id) {
          service.removeAt(i);
          return;
        }
        i++;
      });
    }
    // console.log(service);
  }
  deleteOrRotateFile(type: any) {
    console.log(type);
    Swal.fire({
      title: type == 'delete' ? "Are you sure to delete ?" : 'Do you want to rotate the files ?',
      // text: type == 'delete' ? "Do You Want To Delete Content? , If You Would, You Won't Be Able To Revert This!" : 'Do you want to rotate the files?',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, " + type + " it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        let payload = {
          type: type,
          angle: 90,
          playlistid: this.playListId,
          mediafiles: (this.checkedMediaForm?.get('media') as UntypedFormArray).value,
          createdby: this.currentUser?.username
        }
        console.log(payload);

        this.clientService.deleteOrRotateFilesBytype(payload).subscribe((res: any) => {
          Swal.fire({
            title: type + "!",
            text: res?.message,
            icon: "success"
          });
          this.ngOnInit();
          loader.close();
          this.selectedAllMedia = false;
        }, err => {
          Swal.fire({
            title: type + "!",
            text: err?.error?.message,
            icon: "error"
          });
          loader.close();
        })
        // console.log(this.checkedMediaForm);
      }
    });

  }
  onCheckboxChange(e: any, b: any) {
    const service: UntypedFormArray = this.checkedForm?.get('device') as UntypedFormArray;
    console.log(e);
    console.log(b);
    let isEmptyZone: any = []
    b.zonelist.forEach((element: any) => {
      console.log(element);
      if (element?.medialist.length == 0) {
        isEmptyZone.push(true)
      }
      // element?.zonelist.forEach((e: any) => {
      // });
    });

    if (e.checked) {
      if (!isEmptyZone.includes(true)) {
        if (!service.value.includes(b.id)) {
          service.push(new UntypedFormControl(b.id));
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select at least one media file for each zone!!, otherwise it will not be verified.",
        }).then((result) => {
          if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
            e.checked = false;
            b.isactive = false
          }
        });

        // this.alertService.showWarning('please choose at least one media file for each zone!!');
        // console.log(e);

      }
    } else {
      let i: number = 0;
      service.controls.forEach((item: any) => {
        if (item.value == b.id) {
          service.removeAt(i);
          return;
        }
        i++;
      });
    }
    let DeviceList = this.checkedForm.controls['device'].value;
    this.isNeedVerification = this.checkedForm.controls['device'].value.length != 0 ? true : false;
    console.log(DeviceList);
    if (!e.checked) {
      // this.isNeedVerification = true;
      this.deactivateLayout(b.id, this.playListId, e);
    }
  }
  deactivateLayout(layoutid: any, playListId: any, e: any) {
    this.clientService.deactivateLayout(layoutid, playListId).subscribe((res: any) => {
      this.alertService.showSuccess(res?.message);
    }, err => {
      this.alertService.showError(err?.error?.message);
      e.checked = true;
    })

  }

  verifyLayOuts() {
    // let loader = this.matDialog.open(LoaderComponent, {
    //   panelClass: 'loader-upload'
    // })
    // this.clientService.sendOtp(this.clientUsername).subscribe((res: any) => {
    //   loader.close();

    //   if (res.message == "success") {
    //     let Dailog = this.matDialog.open(OtpVerificationComponent, {
    //       disableClose: true,
    //       data: { playlist: this.playlist, clientname: this.clientUsername, layoutList: this.checkedForm.controls['device'].value, isNeedVerification: this.isNeedVerification, isProVertical: this.isProVertical }
    //     });
    //   }
    // }, err => {
    //   loader.close();
    //   this.alertService.showError(err?.error?.message);
    // })
    this.activateLayout(this.checkedForm.controls['device'].value, this.playListId, this.isProVertical);
  }



  activateLayout(layoutlist: any, playlistid: any, isProVertical: any) {
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.activateLayout(layoutlist, playlistid).subscribe((res: any) => {
      // console.log(res);
      loader.close();
      this.playListId = playlistid;
      this.isProVertical = isProVertical;
      this.getSplitLayoutsByPlaylistId();
      this.alertService.showSuccess(res?.message);
      window.location.reload();
      this.checkedForm = this.formBuilder.group(
        {
          device: this.formBuilder.array([]),
        }
      )

      sessionStorage.setItem("loaded", 'true');
      sessionStorage.setItem("isProVertical", this.isProVertical);
      this.isNeedVerification = this.checkedForm.controls['device'].value.length != 0 ? true : false;
      // console.log(this.isNeedVerification);
      // console.log(this.customer?.versionMaster?.version);
    }, err => {
      loader.close();
      this.alertService.showError(err?.error?.message);
    })
  }
  progress = 0;
  progressWithBar(media: any, timeleft: any, timetotal: any) {
    const elem: any = document.querySelector('#myBar' + media.id);
    let width = 10;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width++;
        this.renderer.setStyle(elem, 'width', width + '%');
        elem.innerHTML = width + '%';
      }
    }, 1000);
  }

  setIsEditableTrue(e: any) {
    this.isEditable = e;
  }
  savePlaylistname(e: any) {
    let v: any = document.getElementById('playlistnameedited');
    const numberOfSpaces = v.innerText.trim().length;
    // console.log(numberOfSpaces);

    if (e) {
      if (!v.innerText) {
        this.alertService.showInfo('please enter playlist name')
      } else if (numberOfSpaces === 0) {
        this.alertService.showInfo('Invalid playlist name')
      }
      else {
        let payload = {
          playlist_id: this.playlist.id,
          name: v.innerText
        }
        this.clientService.updatePlaylistName(payload).subscribe((res: any) => {
          console.log(res);
          this.alertService.showSuccess(res.message);
          this.ngOnInit();
          this.isEditable = !e;
        }, err => {
          this.alertService.showError(err?.error?.message);
          v.innerText = this.playlist?.filename
          this.isEditable = !e;
        })
      }
    } else {
      v.innerText = this.playlist?.filename
      this.isEditable = e;
    }

  }
  enforceMaxLength(event: any) {
    const maxLength = 20;
    console.log(event);
    if (event.target.innerText.length >= maxLength) {
      if (event.key !== "Backspace" && event.key !== "Delete") {
        event.preventDefault();
        return false;
      }
    }
    return true; // Allow other keys
  }
  editMedia(image: any) {
    console.log(image);
    this.router.navigateByUrl(`/client/r-editor/${image.id}`);

  }


  @ViewChild('selectCategory') selectCategory!: MatSelect;
  @ViewChild('selectDevice') selectDevice!: MatSelect;

  selectedCategories: any[] = [];
  selectedDevices: any[] = [];
  allCategoriesSelected = false;
  allDevicesSelected = false;
  isDeviceSelected = false;

  filteredCategoryList: any[] = [];
  filteredDeviceList: any[] = [];
  allCategoryList: any[] = []; // Placeholder for all categories
  allDeviceList: any[] = []; // Placeholder for all devices

  filterCategories(searchText: string): void {
    this.filteredCategoryList = this.allCategoryList.filter((category: any) =>
      this.isSelectedCategory(category.id) || category.categoryname.toLowerCase().includes(searchText.toLowerCase()) || category.categorycode.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  filterDevices(searchText: string): void {
    this.filteredListDevice = this.allDeviceList.filter((state: any) =>
      this.isSelectedDevice(state.id) || state.username.toLowerCase().includes(searchText.toLowerCase())
    );


  }
  isSelectedDevice(stateId: any): boolean {
    return this.selectedDevices.some((selectedId: any) => selectedId === stateId);
  }

  isSelectedCategory(categoryId: any): boolean {
    return this.selectedCategories.some((selectedId: any) => selectedId === categoryId);
  }



  toggleAllCategorySelection() {
    if (this.allCategoriesSelected) {
      this.selectCategory.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectCategory.options.forEach((item: MatOption) => item.deselect());
    }
    this.getDevicesByCategory()
  }

  categoryOptionClick() {
    let newStatus = true;
    this.selectCategory.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allCategoriesSelected = newStatus;
    this.getDevicesByCategory();
  }

  toggleAllDeviceSelection() {
    if (this.allDevicesSelected) {
      this.selectDevice.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDevice.options.forEach((item: MatOption) => item.deselect());
    }
  }

  deviceOptionClick() {
    let newStatus = true;
    this.selectDevice.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allDevicesSelected = newStatus;
  }

  submitSelection() {
    let payload = {
      "playlist_id": this.playListId,
      "categorylist": this.selectedCategories,
      "devicelist": this.selectedDevices,
      createdby: this.storageService.getUsername()
    }
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.editPlaylistStateLists(payload).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          Swal.fire('Saved!', res.message, 'success')
        }, err => {
          loader.close();
          Swal.fire('error!!', err?.error?.message, "error");
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  getCategoryBystoreId(id: any) {
    this.clientService.getCategoryListByStoreId(id).subscribe((res: any) => {
      this.filteredCategoryList = res;
      this.allCategoryList = res;
    })
  }
  getDevicesByCategory() {
    this.clientService.getDeviceListByCategoryListNdStatus(this.selectedCategories, 'all').subscribe((res: any) => {
      this.filteredDeviceList = res;
      this.allDeviceList = res;
    })
  }

  getClientByUsername(data: any) {
    this.clientService.getClientByUsername(data).subscribe((res: any) => {
      // console.log(res);
      this.client = res;
      if (this.client?.ismbc) {
        this.clientService.getMasterSettingsByStoreId(this.playlist?.storeid).subscribe((data: any) => {
          this.masterSettings = data;
          console.log(this.masterSettings);

        })
      }

    })
  }
  chooseFilesUploadType(template: any) {
    this.matDialog.open(template)
  }
  getAllContentTags() {
    this.clientService.getAllContentTags().subscribe(res => {
      this.tagList = res;
    })
    this.clientService.getBrandList().subscribe(res => {
      this.brandList = res;
    })

  }
  approvePlaylistSchedule(type: any) {
    let v = this.scheduleInfo;
    this.currentUser = this.storageService.getUser();

    if (this.storageService.getUserRole() === "STORE") {
      v.approvedby = this.currentUser.username;
    } else {
      v.approvedby = this.storageService.getClientUsername();
    }

    if (type) {
      Swal.fire({
        text: "Do you want to Approve the Schedule?",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          let loader = this.matDialog.open(LoaderComponent, {
            panelClass: 'loader-upload'
          })
          v.isapproved = true;
          this.clientService.approvePlaylistSchedule(v).subscribe((res: any) => {
            this.alertService.showSuccess(res?.message);
            loader.close();
            history.back()
          }, err => {
            this.alertService.showError(err?.error?.message);
            loader.close();
          })
        } else {
          v.isapproved = false;
        }
      });

    } else {
      Swal.fire({
        text: "Do you want to Reject the Schedule?",
        input: 'text',
        inputPlaceholder: 'Give me a good reason, why the schedule is rejected?',
        showCancelButton: true,
        cancelButtonText: 'Close',
        confirmButtonText: "Yes, Reject",
      }).then((result) => {
        if (result.isConfirmed) {
          let loader = this.matDialog.open(LoaderComponent, {
            panelClass: 'loader-upload'
          })
          v.isapproved = false;
          console.log("Result: " + result.value);
          v.comments = result.value;
          this.clientService.approvePlaylistSchedule(v).subscribe((res: any) => {
            this.alertService.showSuccess(res?.message);
            history.back()
            loader.close();
          }, err => {
            this.alertService.showError(err?.error?.message);
            loader.close();
          })
        }
      });
    }

  }

  openChooseFilePopUp(FilesUpload: any) {
    let dialogRef = this.matDialog.open(FilesUpload, {
      panelClass: 'loader-upload'
    });
    dialogRef.afterClosed().subscribe((fileList: any) => {
      if (this.googlePickerService.FileList.length > 0) {
        this.googlePickerService.FileList.forEach(e => {
          this.both.push(e);
        })
        this.googlePickerService.FileList = [];
      }
    });
  }

  handleAuthClick(): void {
    this.googlePickerService.handleAuthClick();
  }

  handleSignoutClick(): void {
    this.googlePickerService.handleSignoutClick();
  }
  plusOrMinus(change: number) {
    if (this.repeatFileCount + change >= 1) {
      this.repeatFileCount += change;
    }
  }
  duplicateMedia(mediaRepeat: any) {
    let dialogRef = this.matDialog.open(mediaRepeat, {
      panelClass: 'loader-upload'
    });
    dialogRef.afterClosed().subscribe((e: any) => {
      this.repeatFileCount = 1;
    })
  }

  duplicateMediaFiles() {
    let payload = {
      mediafileid: this.checkedMediaForm.value?.media,
      createdby: this.storageService.getUsername(),
      count: this.repeatFileCount
    }
    this.clientService.duplicateMediaFiles(payload).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
      this.ngOnInit();
    }, err => {
      this.alertService.showError(err?.error?.message);
    })
  }

  isValidFileType(file: any) {
    const validMimeTypes = [
      "image/png",
      "image/jpeg",
      "video/mp4",
      "video/quicktime",
      "video/x-matroska",
      "application/pdf"
    ];

    const validExtensions = [
      "png",
      "jpg",
      "jpeg",
      "mp4",
      "mov",
      "mkv",
      "pdf"
    ];

    const mimeType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidMimeType = validMimeTypes.includes(mimeType);
    const isValidExtension = validExtensions.includes(fileExtension);
    const isValid = isValidMimeType && isValidExtension;

    // Determine file type category
    const isImage = ["image/png", "image/jpeg"].includes(mimeType);
    const isVideo = ["video/mp4", "video/quicktime", "video/x-matroska"].includes(mimeType);
    const isPdf = mimeType === "application/pdf";

    // Return the object with validation status and file type info
    return {
      isValid: isValid,
      isImage: isImage,
      isVideo: isVideo,
      isPdf: isPdf
    };
  }

}

function timeStringToSeconds(timeString: any): number {
  const timeParts = timeString.split(':').map(Number);
  const [hours, minutes, seconds] = timeParts;
  return Math.round((hours * 3600) + (minutes * 60) + seconds);
}

// function timeStringToSeconds(timeString: any) {
//   const [hours, minutes, seconds] = timeString.split(':').map(Number);
//   return (hours * 3600) + (minutes * 60) + seconds;
// }


async function geocode1(address: any) {

  const endpoint = 'https://nominatim.openstreetmap.org/search';
  const query = encodeURIComponent(address);
  const url = `${endpoint}?q=${query}&format=json&addressdetails=1&extratags=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const resultDiv = document.getElementById('geocodeResult');

    if (data.length > 0) {
      const location = data[0];
      console.log(location);
    } else {

    }
  } catch (error) {
    console.error('Error:', error);

  }
}

async function geocode(data: any) {
  // Construct the address from JSON data
  const area = data.location.area.toLowerCase();
  const city = data.city.cityname.toLowerCase();
  const district = data.district.name.toLowerCase();
  const state = data.state.statename.toLowerCase();
  // const country = data.country.countryname.toLowerCase();

  const address = `${area}`;
  const endpoint = 'https://nominatim.openstreetmap.org/search';
  const query = encodeURIComponent(address);
  const url = `${endpoint}?q=${query}&format=json&addressdetails=1&extratags=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const resultDiv = document.getElementById('geocodeResult');

    if (data.length > 0) {
      const location = data[0];

    } else {
      console.log('No results found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}