import { BreakpointObserver } from "@angular/cdk/layout";
import { AfterViewInit, Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CompactType, DisplayGrid, Draggable, GridType, GridsterConfig, GridsterItem, PushDirections, Resizable } from "angular-gridster2";
import { LoaderComponent } from "src/app/_core/loader/loader.component";
import { AlertService } from "src/app/_core/services/alert.service";
import { ClientService } from "src/app/_core/services/client.service";
// import 'swiper/swiper-bundle.css';
import { math } from "@amcharts/amcharts4/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { StoreMediaUploadComponent } from "src/app/store/_features/store-media-upload/store-media-upload.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
import { MediaUploadComponent } from "../../_features/media-upload/media-upload.component";
import { StorageService } from "src/app/_core/services/storage.service";



declare var Swiper: any;
interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}
interface mediaObj {
  file: File;
  type: string;
  url: string;

}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],

})
export class LayoutComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  layoutname: any;
  isMoblie: any = false;
  options!: Safe | any;
  isVertical = '9:16';
  dashboard!: Array<GridsterItem> | any;
  playlist: any;
  isExistLayout: any = true;
  layout: any;
  swiperSlider: any;
  client: any;
  exampleForm!: FormGroup;
  brandList: any = [];
  tagList: any = [];
  myControl = this.fb.control('', Validators.required);
  filteredOptions: Observable<string[]> | undefined;
  userRole: any;
  masterSettings: any;
  currentUser: any;
  allowedMediaList: any = [];
  constructor(private _location: Location, private storageService: StorageService, private matDialog: MatDialog, private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private mediaUploadComponentC: MediaUploadComponent, private mediaUploadComponent: StoreMediaUploadComponent, private observer: BreakpointObserver, private alertService: AlertService, private clientService: ClientService, private sanitizer: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    // let v = this.activatedRoute.snapshot.paramMap.get('id');
    data = this.router?.getCurrentNavigation()?.extras.state;
    // console.log(data);
    this.playlist = data;

    if (!data) {
      sessionStorage.setItem("loaded", 'true');
      _location.back();
    }
    this.isVertical = data?.type;
    this.exampleForm = this.fb.group({
      chooseContentTag: ['', Validators.required],
      myControl: this.myControl,
      layoutname: ['', Validators.required]
    });
    if (data?.layout) {
      this.isExistLayout = false;
      this.dashboard = data?.layout?.zonelist;
      this.layoutname = data?.layout?.layoutname;
      this.layout = data?.layout
      this.exampleForm.patchValue({
        chooseContentTag: data?.layout?.tagid,
        myControl: data?.layout?.brandname,
        layoutname: data?.layout?.layoutname
      })
    }
    if (this.playlist) {
      // console.log(this.playlist);

      this.clientService.getClientByUsername(data?.playlist?.clientname).subscribe((res: any) => {
        this.client = res
        if (this.client?.ismbc) {
          if (this.playlist?.playlist?.storeid) {
            this.clientService.getMasterSettingsByStoreId(this.playlist?.playlist?.storeid).subscribe((data: any) => {
              this.masterSettings = data;
            })
          } else {
            // window.location.reload();
          }
        }

      })
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.brandList.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }
  onBackClick() {
    sessionStorage.setItem("loaded", 'true');
    this._location.back();
  }
  ngOnInit(): void {
    // console.log(this.exampleForm);
    this.userRole = this.storageService.getUserRole();
    this.currentUser = this.storageService.getUser();
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      if (res.matches) {
        this.isMoblie = true;
      } else {
        this.isMoblie = false;
      }
    });
    // const swiper = new Swiper('.swiper-slider', {
    //   // spaceBetween: 30,
    //   // centeredSlides: true,
    //   // autoplay: {
    //   //   delay: 1000,
    //   //   disableOnInteraction: false,
    //   // },
    //   // loop: true,

    //   // speed: 1000, // Set the transition speed in milliseconds
    //   // on: {
    //   //   slideChangeTransitionEnd: () => {
    //   //     const activeSlide = swiper.slides[swiper.activeIndex];
    //   //     const isVideo = activeSlide.querySelector('video');
    //   //     console.log(isVideo);

    //   //     if (isVideo) {
    //   //       isVideo.addEventListener('ended', () => {
    //   //         swiper.slideNext();
    //   //       });
    //   //     }
    //   //   },
    //   // },
    //   // pagination: {
    //   //   el: ".swiper-pagination",
    //   //   clickable: true,
    //   // },
    //   // navigation: {
    //   //   nextEl: ".swiper-button-next",
    //   //   prevEl: ".swiper-button-prev",
    //   // },
    //   loop: true,
    //   autoplay: {
    //     delay: 2000,
    //     disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
    //   },
    //   speed: 1000,
    //   on: {
    //     slideChangeTransitionStart: () => {
    //       const activeSlide = swiper.slides[swiper.activeIndex];
    //       const isVideo = activeSlide.querySelector('video');
    //       console.log(isVideo);
    //       if (isVideo) {
    //         // Disable autoplay when a video slide is active
    //         isVideo.play();
    //         // swiper.autoplay.stop();
    //         swiper.autoplay = "false"

    //         // this.autoplayEnabled = false;
    //         isVideo.addEventListener('ended', () => {
    //           // Enable autoplay after the video ends
    //           swiper.autoplay = "true";
    //           // this.autoplayEnabled = true;
    //           isVideo.pause();
    //           // Move to the next slide
    //           swiper.slideNext();
    //         });
    //       }
    //     },
    //   },
    // });
    this.getAllContentTags();
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
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'drag-handler',
        stop: function (event: any) {
          // console.log(event);
        }
      },
      resizable: {
        // enabled: true,
        // enabled: false
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
    if (this.layout) {
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
    } else {
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true
    }
    // console.log(this.layout);

    if (this.isExistLayout) {
      this.dashboard = [
        { id: 0, cols: 1, rows: 1, y: 0, x: 0, isMuted: true, height: '', width: '', medialist: [{ file: File, type: 'image', url: this.isVertical == '9:16' ? 'assets/images/split/vertical.png' : 'assets/images/split/horizontal.png' }] },
      ];
    }
    // this.dashboard = [
    //   { cols: 1, rows: 1, y: 0, x: 0 },
    //   // { cols: 2, rows: 2, y: 0, x: 2, hasContent: true },
    //   { cols: 1, rows: 1, y: 1, x: 1 },
    //   { cols: 1, rows: 1, y: 2, x: 1 },
    //   { cols: 1, rows: 1, y: 2, x: 2 },
    //   // { cols: 1, rows: 1, y: 1, x: 0 },
    //   // {
    //   //   cols: 2,
    //   //   rows: 2,
    //   //   y: 3,
    //   //   x: 5,
    //   //   minItemRows: 2,
    //   //   minItemCols: 2,
    //   //   label: 'Min rows & cols = 2'
    //   // },
    //   // {
    //   //   cols: 2,
    //   //   rows: 2,
    //   //   y: 2,
    //   //   x: 0,
    //   //   maxItemRows: 2,
    //   //   maxItemCols: 2,
    //   //   label: 'Max rows & cols = 2'
    //   // },
    //   // {
    //   //   cols: 2,
    //   //   rows: 1,
    //   //   y: 2,
    //   //   x: 2,
    //   //   dragEnabled: true,
    //   //   resizeEnabled: true,
    //   //   label: 'Drag&Resize Enabled'
    //   // },
    //   // {
    //   //   cols: 1,
    //   //   rows: 1,
    //   //   y: 2,
    //   //   x: 4,
    //   //   dragEnabled: false,
    //   //   resizeEnabled: false,
    //   //   label: 'Drag&Resize Disabled'
    //   // },
    //   // { cols: 1, rows: 1, y: 2, x: 6 }
    // ];

    // var swiper = new Swiper(".mySwiper", {
    //   spaceBetween: 30,
    //   centeredSlides: true,
    //   autoplay: {
    //     delay: 2500,
    //     disableOnInteraction: false,
    //   },
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    // });

    this.getAllowedUploadMediaFiles();
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item: any): void {
    // console.log(item);
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    // let v = this.dashboard?.length;
    // console.log(v);
    let videoexist: any = [];
    this.dashboard.forEach((e: any) => {
      if (e.medialist.length != 0) {
        if (e.isVideo) {
          videoexist.push(true)
        }
      }
    })
    // console.log(videoexist);

    const rndInt = Math.floor(Math.random() * 100) + 1;
    var inputString = "abcdefghijklmnopqrstuvwxyz";
    let str = generateUniqueRandomFromString(inputString, 6);
    this.dashboard.push({ id: str + "-" + rndInt, x: 0, y: 0, isVideo: videoexist.length == 0 ? null : videoexist.includes(true) ? false : true, isMuted: true, cols: 1, rows: 1, height: '', width: '', medialist: [{ file: File, type: 'image', url: this.isVertical == '9:16' ? 'assets/images/split/vertical.png' : 'assets/images/split/horizontal.png' }] });
  }
  unMuteZone(item: any) {
    // console.log(item);
    // console.log(this.layout);

    let ismedia = false;
    let isFalse: any = [];
    item.medialist.forEach((m: any) => {
      // console.log(m.type.includes('video'));
      if (m.type.includes('video') || m.type.includes('youtube')) {
        isFalse.push(true);
      } else {
        isFalse.push(false);
      }
    })
    if (isFalse.includes(true)) {

      this.dashboard.forEach((e: any) => {
        if (!e.isMuted) {
          if (e != item) {
            e.isMuted = true;
          }
        }

      })
      if (item.id != 0 && this.isIntConvertible(item.id) && !this.layout?.isDefault) {
        this.clientService.updateZoneMuteStatus(item.id, !item.isMuted).subscribe((res: any) => {
          this.alertService.showSuccess(res?.message)
          item.isMuted = !item.isMuted;
        }, err => {
          this.alertService.showError(err?.error?.message)
        });
      } else {
        item.isMuted = !item.isMuted;
      }
    }
  }
  isIntConvertible(str: any) {
    return !isNaN(parseInt(str));
  }
  onclickAdfiles(event: any) {
    // console.log(event);
  }
  baba($event: MouseEvent | TouchEvent): void {
    // console.log($event);
    $event.preventDefault();
    $event.stopPropagation();
  }

  selectedSize: any = 0;
  onFileChangeFile(event: Event, item: any) {
    // console.log(this.client);

    const files = (event.target as HTMLInputElement).files;
    // console.log(files);
    if (files && files.length) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      });
      if (this.userRole === 'STORE' || this.userRole === 'SUBUSER') {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = () => {
            // console.log(this.selectedSize);
            if ((this.playlist?.playlist?.storage?.store_totalmemory - this.playlist?.playlist?.storage?.store_usedmemory) >= (files[i].size / 1000) && (files[i].size / 1000) <= this.playlist?.playlist?.storage?.store_totalmemory) {
              // console.log("a");
              if ((this.playlist?.playlist?.storage?.playlist_totalmemory - this.playlist?.playlist?.storage?.playlist_usedmemory) >= (files[i].size / 1000)) {
                // console.log("b");
                if ((Math.round(files[i].size / 1000000)) <= 500) {
                  // console.log("c");
                  this.selectedSize = this.selectedSize + (files[i].size / 1000);

                  let obj = {
                    file: files[i],
                    url: reader.result as string,
                    type: files[i].type,
                    // rotate: '0deg'
                  };
                  const { isImage, isValid, isPdf, isVideo } = this.isValidFileType(files[i]);

                  // Check if the zone has any videos
                  let videoZone = this.dashboard.find((zone: any) => zone.medialist.some((media: any) => media.type.includes('video')));
                  if (item?.medialist?.length == 1 && item?.medialist[0]?.url.includes('assets')) {
                    item.medialist.splice(item.medialist.indexOf(item.medialist[0]), 1);
                  }
                  // If there's no designated video zone, choose the current item to be the video zone
                  // if ( obj.type.includes('video')) {
                  if (isValid && isVideo) {
                    // If the file is a video, set it to the video zone
                    if (this.client?.ismbc) {
                      let video = document.createElement("video");
                      video.addEventListener('loadeddata', () => {
                        if (Math.round(video.duration) == timeStringToSeconds(this.masterSettings?.fileduration)) {
                          if (videoZone) {
                            // Only push if it's the video zone
                            if (item === videoZone) {
                              item.medialist.push(obj);
                              this.dashboard.forEach((zone: any) => {
                                if (videoZone) {
                                  if (zone !== videoZone) {
                                    // if (zone?.medialist[0]?.url.includes('assets')) {
                                    zone.isVideo = false;
                                    // }
                                  }
                                }

                              });
                              item.isVideo = true; // Set isVideo to true for the video zone
                            } else {
                              this.alertService.showInfo("Videos can only be added to the designated zone.");
                            }
                          } else {
                            if (item.medialist.length == 0) {
                              item.medialist.push(obj);
                              this.dashboard.forEach((zone: any) => {
                                // if (videoZone) {
                                // if (zone !== videoZone) {
                                zone.isVideo = false;
                                // }
                                // }
                              });
                              item.isVideo = true;
                            } else {
                              this.alertService.showInfo("There's no designated video zone in the dashboard.");
                            }
                          }
                        } else {
                          this.alertService.showInfo("File duration is must be " + this.masterSettings?.fileduration)
                        }
                      }, false);
                      video.src = reader.result as string;


                    } else if (isImage && isValid) {
                      if (videoZone) {
                        // Only push if it's the video zone
                        if (item === videoZone) {
                          item.medialist.push(obj);
                          this.dashboard.forEach((zone: any) => {
                            if (videoZone) {
                              if (zone !== videoZone) {
                                // if (zone?.medialist[0]?.url.includes('assets')) {
                                zone.isVideo = false;
                                // }
                              }
                            }

                          });
                          item.isVideo = true; // Set isVideo to true for the video zone
                        } else {
                          this.alertService.showInfo("Videos can only be added to the designated zone.");
                        }
                      } else {
                        if (item.medialist.length == 0) {
                          item.medialist.push(obj);
                          this.dashboard.forEach((zone: any) => {
                            // if (videoZone) {
                            // if (zone !== videoZone) {
                            zone.isVideo = false;
                            // }
                            // }
                          });
                          item.isVideo = true;
                        } else {
                          this.alertService.showInfo("There's no designated video zone in the dashboard.");
                        }
                      }
                    }

                  } else if (obj.type.includes('image')) {
                    // If the file is not a video, add it to the non-video zones
                    if (item !== videoZone) {
                      item.medialist.push(obj);
                      item.isVideo = false; // Set isVideo to false for non-video zones
                    }
                  } else {
                    this.alertService.showInfo("Invalid File");
                  }
                } else {
                  this.alertService.showInfo("Please Choose the File below 500mb");
                }
                this.swiperSlider = new Swiper('.swiper-slider', {
                  centeredSlides: true,
                  slidesPerView: 1, // Adjust this value
                  slidesPerGroup: 1, // Adjust this value
                  autoplay: {
                    delay: 2200,
                    disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
                  },
                  loop: item?.medialist?.length >= 2 ? true : false,
                  speed: 1000,

                });
                // console.log(this.dashboard);
              } else {
                if ((files[i].size / 1000) <= this.playlist?.playlist?.storage?.playlist_totalmemory) {
                  this.alertService.showInfo("Your playlist Limit is Reached, kindly use Another playlist");
                } else {
                  this.alertService.showInfo("Please choose the file below 500mb");
                }
              }
            } else {
              this.alertService.showInfo("Storage is Full");
            }

            if (files.length == i + 1) {
              // console.log(i);
              loader.close();
              // this.ngAfterViewInit();
            }
          };
          reader.readAsDataURL(files[i]);
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = () => {
            // console.log(this.selectedSize);
            if ((this.playlist?.playlist?.storage?.client_totalmemory - this.playlist?.playlist?.storage?.client_usedmemory) >= (files[i].size / 1000) && (files[i].size / 1000) <= this.playlist?.playlist?.storage?.client_totalmemory) {
              // console.log("a");
              if ((this.playlist?.playlist?.storage?.playlist_totalmemory - this.playlist?.playlist?.storage?.playlist_usedmemory) >= (files[i].size / 1000)) {
                // console.log("b");
                if ((Math.round(files[i].size / 1000000)) <= 500) {
                  // console.log("c");
                  this.selectedSize = this.selectedSize + (files[i].size / 1000);
                  const { isImage, isValid, isPdf, isVideo } = this.isValidFileType(files[i]);
                  let obj = {
                    file: files[i],
                    url: reader.result as string,
                    type: files[i].type,
                    // rotate: '0deg'
                  };
                  // Check if the zone has any videos
                  let videoZone = this.dashboard.find((zone: any) => zone.medialist.some((media: any) => media.type.includes('video')));
                  if (item?.medialist?.length == 1 && item?.medialist[0]?.url.includes('assets')) {
                    item.medialist.splice(item.medialist.indexOf(item.medialist[0]), 1);
                  }
                  // If there's no designated video zone, choose the current item to be the video zone
                  if (isValid && isVideo) {
                    // If the file is a video, set it to the video zone
                    if (videoZone) {
                      // Only push if it's the video zone
                      if (item === videoZone) {
                        item.medialist.push(obj);
                        this.dashboard.forEach((zone: any) => {
                          if (videoZone) {
                            if (zone !== videoZone) {
                              // if (zone?.medialist[0]?.url.includes('assets')) {
                              zone.isVideo = false;
                              // }
                            }
                          }

                        });
                        item.isVideo = true; // Set isVideo to true for the video zone
                      } else {
                        this.alertService.showInfo("Videos can only be added to the designated zone.");
                      }
                    } else {
                      if (item.medialist.length == 0) {
                        item.medialist.push(obj);
                        this.dashboard.forEach((zone: any) => {
                          // if (videoZone) {
                          // if (zone !== videoZone) {
                          zone.isVideo = false;
                          // }
                          // }
                        });
                        item.isVideo = true;
                      } else {
                        this.alertService.showInfo("There's no designated video zone in the dashboard.");
                      }
                    }
                  } else if (isValid && isImage) {
                    // If the file is not a video, add it to the non-video zones
                    if (item !== videoZone) {
                      item.medialist.push(obj);
                      item.isVideo = false; // Set isVideo to false for non-video zones
                    }
                  } else {
                    this.alertService.showInfo("Invalid File");
                  }

                  // Set isVideo to false for all items that are not the video zone

                  // this.dashboard.forEach((zone: any) => {
                  //   if (videoZone) {
                  //     if (zone !== videoZone) {
                  //       console.log(zone?.medialist[0]?.url.includes('assets'));
                  //       if (zone?.medialist[0]?.url.includes('assets')) {
                  //         zone.isVideo = false;
                  //       }
                  //     }
                  //   }

                  // });

                  // Remaining code...
                } else {
                  this.alertService.showInfo("Please Choose the File below 500mb");
                }
                this.swiperSlider = new Swiper('.swiper-slider', {
                  centeredSlides: true,
                  slidesPerView: 1, // Adjust this value
                  slidesPerGroup: 1, // Adjust this value
                  autoplay: {
                    delay: 2200,
                    disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
                  },
                  loop: item?.medialist?.length >= 2 ? true : false,
                  speed: 1000,
                  // on: {
                  //   // slideChangeTransitionStart: () => {
                  //   //   swiper.loop = "true";
                  //   //   // console.log(swiper.activeIndex);
                  //   //   const activeSlide = swiper.slides[swiper.activeIndex];
                  //   //   const isVideo = activeSlide.querySelector('video');
                  //   //   console.log(isVideo);
                  //   //   if (isVideo) {
                  //   //     // Disable autoplay when a video slide is active
                  //   //     isVideo.play();
                  //   //     // swiper.autoplay.stop();
                  //   //     swiper.autoplay = "false"
                  //   //     // this.autoplayEnabled = false;
                  //   //     isVideo.addEventListener('ended', () => {
                  //   //       // Enable autoplay after the video ends
                  //   //       swiper.autoplay = "true";
                  //   //       // this.autoplayEnabled = true;
                  //   //       isVideo.pause();
                  //   //       // Move to the next slide
                  //   //       swiper.slideNext();
                  //   //     });
                  //   //   } else {
                  //   //     if (!swiper.autoplay) {
                  //   //       swiper.autoplay = "true";
                  //   //       swiper.slideNext();
                  //   //       swiper.autoplay.paused = false;
                  //   //     }
                  //   //   }
                  //   // },
                  // },
                });
                // console.log(this.dashboard);
              } else {
                if ((files[i].size / 1000) <= this.playlist?.playlist?.storage?.playlist_totalmemory) {
                  this.alertService.showInfo("Your playlist Limit is Reached, kindly use Another playlist");
                } else {
                  this.alertService.showInfo("Please choose the file below 500mb");
                }
              }
            } else {
              this.alertService.showInfo("Storage is Full");
            }

            if (files.length == i + 1) {
              // console.log(i);
              loader.close();
              // this.ngAfterViewInit();
            }
          };
          reader.readAsDataURL(files[i]);
        }
      }
    }
  }


  // onFileChangeFile(event: Event, item: any) {
  //   const files = (event.target as HTMLInputElement).files;
  //   // console.log(files);
  //   if (files && files.length) {
  //     let loader = this.matDialog.open(LoaderComponent, {
  //       panelClass: 'loader-upload'
  //     })
  //     for (let i = 0; i < files.length; i++) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         // console.log(this.selectedSize);
  //         if ((this.playlist?.playlist?.storage?.client_totalmemory - this.playlist?.playlist?.storage?.client_usedmemory) >= (files[i].size / 1000) && (files[i].size / 1000) <= this.playlist?.playlist?.storage?.client_totalmemory) {
  //           // console.log("a");
  //           if ((this.playlist?.playlist?.storage?.playlist_totalmemory - this.playlist?.playlist?.storage?.playlist_usedmemory) >= (files[i].size / 1000)) {
  //             // console.log("b");
  //             if ((Math.round(files[i].size / 1000000)) <= 500) {
  //               // console.log("c");
  //               this.selectedSize = this.selectedSize + (files[i].size / 1000);
  //               let obj = {
  //                 file: files[i],
  //                 url: reader.result as string,
  //                 type: files[i].type,
  //                 // rotate: '0deg'
  //               };
  //               if (item?.medialist?.length == 1 && item?.medialist[0]?.url.includes('assets')) {
  //                 item.medialist.splice(item.medialist.indexOf(item.medialist[0]), 1);
  //               }
  //               item.medialist?.push(obj);
  //               let videoexist: any = []
  //               if (obj.type.includes('video')) {
  //                 this.dashboard.forEach((e: any) => {
  //                   e.isVideo = false;
  //                 })
  //                 item.isVideo = true;
  //               } else {
  //                 item.isVideo = false;
  //               }

  //               // item?.medialist?.forEach((e: any) => {
  //               //   // console.log(e);
  //               //   if (e.type.includes('video')) {
  //               //     videoexist.push(true)
  //               //   }
  //               // })

  //               // if (videoexist.includes(true)) {
  //               //   item.isVideo = true;
  //               // }
  //               // console.log(item?.medialist);
  //               // if (this.swiperSlider && typeof this.swiperSlider.destroy === 'function') {
  //               //   this.swiperSlider.destroy();
  //               //   // console.log("red");
  //               // }
  //               this.swiperSlider = new Swiper('.swiper-slider', {
  //                 centeredSlides: true,
  //                 slidesPerView: 1, // Adjust this value
  //                 slidesPerGroup: 1, // Adjust this value
  //                 autoplay: {
  //                   delay: 2200,
  //                   disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
  //                 },
  //                 loop: item?.medialist?.length >= 2 ? true : false,
  //                 speed: 1000,
  //                 // on: {
  //                 //   // slideChangeTransitionStart: () => {
  //                 //   //   swiper.loop = "true";
  //                 //   //   // console.log(swiper.activeIndex);
  //                 //   //   const activeSlide = swiper.slides[swiper.activeIndex];
  //                 //   //   const isVideo = activeSlide.querySelector('video');
  //                 //   //   console.log(isVideo);
  //                 //   //   if (isVideo) {
  //                 //   //     // Disable autoplay when a video slide is active
  //                 //   //     isVideo.play();
  //                 //   //     // swiper.autoplay.stop();
  //                 //   //     swiper.autoplay = "false"
  //                 //   //     // this.autoplayEnabled = false;
  //                 //   //     isVideo.addEventListener('ended', () => {
  //                 //   //       // Enable autoplay after the video ends
  //                 //   //       swiper.autoplay = "true";
  //                 //   //       // this.autoplayEnabled = true;
  //                 //   //       isVideo.pause();
  //                 //   //       // Move to the next slide
  //                 //   //       swiper.slideNext();
  //                 //   //     });
  //                 //   //   } else {
  //                 //   //     if (!swiper.autoplay) {
  //                 //   //       swiper.autoplay = "true";
  //                 //   //       swiper.slideNext();
  //                 //   //       swiper.autoplay.paused = false;
  //                 //   //     }
  //                 //   //   }
  //                 //   // },
  //                 // },
  //               });
  //               // console.log(this.swiperSlider);
  //               // if (this.swiperSlider!.hostEl!) {
  //               //   this.swiperSlider!.hostEl!.style!.height = 'inherit';
  //               // }
  //             } else {
  //               this.alertService.showInfo("Please Choose the File below 500mb")
  //             }
  //           } else {
  //             if ((files[i].size / 1000) <= this.playlist?.playlist?.storage?.playlist_totalmemory) {
  //               this.alertService.showInfo("Your playlist Limit is Reached, kindly use Another playlist")
  //             } else {
  //               this.alertService.showInfo("Please choose the file below 500mb")
  //             }
  //           }
  //         } else {
  //           this.alertService.showInfo("Storage is Full")
  //         }

  //         if (files.length == i + 1) {
  //           // console.log(i);
  //           loader.close();
  //           // this.ngAfterViewInit();
  //         }
  //       };
  //       reader.readAsDataURL(files[i]);
  //     }

  //     // const files = (event.target as HTMLInputElement).files;
  //     // if (files && files.length) {
  //     //   for (let i = 0; i < files.length; i++) {
  //     //     const reader = new FileReader();
  //     //     reader.onload = () => {
  //     //       // console.log(files[i]);
  //     //       let obj = {
  //     //         file: files[i],
  //     //         url: reader.result as string,
  //     //         type: files[i].type
  //     //       };

  //     //       if (item.medialist.length == 1 && item.medialist[0].url.includes('assets')) {
  //     //         item.medialist.splice(item.medialist.indexOf(item.medialist[0]), 1);
  //     //       }
  //     //       item.medialist?.push(obj);
  //     // const swiper = new Swiper('.swiper-slider', {
  //     //   centeredSlides: true,
  //     //   slidesPerView: 1, // Adjust this value
  //     //   slidesPerGroup: 1, // Adjust this value
  //     //   autoplay: {
  //     //     delay: 2200,
  //     //     disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
  //     //   },
  //     //   loop: true,
  //     //   speed: 1000,
  //     //   on: {
  //     //     // slideChangeTransitionStart: () => {
  //     //     //   swiper.loop = "true";
  //     //     //   // console.log(swiper.activeIndex);
  //     //     //   const activeSlide = swiper.slides[swiper.activeIndex];

  //     //     //   const isVideo = activeSlide.querySelector('video');
  //     //     //   console.log(isVideo);
  //     //     //   if (isVideo) {
  //     //     //     // Disable autoplay when a video slide is active
  //     //     //     isVideo.play();
  //     //     //     // swiper.autoplay.stop();
  //     //     //     swiper.autoplay = "false"

  //     //     //     // this.autoplayEnabled = false;

  //     //     //     isVideo.addEventListener('ended', () => {
  //     //     //       // Enable autoplay after the video ends
  //     //     //       swiper.autoplay = "true";
  //     //     //       // this.autoplayEnabled = true;
  //     //     //       isVideo.pause();
  //     //     //       // Move to the next slide
  //     //     //       swiper.slideNext();
  //     //     //     });
  //     //     //   } else {
  //     //     //     if (!swiper.autoplay) {
  //     //     //       swiper.autoplay = "true";
  //     //     //       swiper.slideNext();
  //     //     //       swiper.autoplay.paused = false;
  //     //     //     }
  //     //     //   }
  //     //     // },
  //     //   },
  //     // });

  //     //     }
  //     //     reader.readAsDataURL(files[i]);
  //     //   }
  //   }

  //   // console.log(item);

  // }
  public delete(item: any, obj: any) {
    // console.log(obj);
    // console.log(item);
    if (obj.id) {
      this.clientService.deleteZoneFiles(item.id, obj.id).subscribe((res: any) => {
        // console.log(res);
        this.alertService.showSuccess(res?.message)
        item.medialist.splice(item.medialist.indexOf(obj), 1);
        let videoexist: any = [];
        this.dashboard.forEach((e: any) => {
          // e.isVideo = false;
          e?.medialist?.forEach((b: any) => {
            // console.log(e);
            if (b.type.includes('video')) {
              videoexist.push(true);
            }
          })
        })
        if (item?.medialist.length == 0) {
          if (videoexist.includes(true)) {
            item.isVideo = false;
          } else {
            delete item.isVideo;
          }
        }
        if (obj?.file?.size) {
          this.selectedSize = ((this.selectedSize * 1000) - obj?.file?.size) / 1000;
        }
        // if (this.swiperSlider && typeof this.swiperSlider.destroy === 'function') {
        //   this.swiperSlider.destroy();
        // }
        this.swiperSlider = new Swiper('.swiper-slider', {
          centeredSlides: true,
          autoplay: {
            delay: 2200,
            disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
          },
          loop: item?.medialist?.length >= 2 ? true : false,
          speed: 1000,
          slidesPerView: 1, // Adjust this value
          slidesPerGroup: 1, // Adjust this value
        });
        // if (this.swiperSlider!.hostEl!) {
        //   this.swiperSlider!.hostEl!.style!.height = 'inherit'
        // }
      }, err => {
        this.alertService.showSuccess(err?.error?.message)
      })
    } else {
      item.medialist.splice(item.medialist.indexOf(obj), 1);
      let videoexist: any = [];
      this.dashboard.forEach((e: any) => {
        // e.isVideo = false;
        e?.medialist?.forEach((b: any) => {
          // console.log(e);
          if (b.type.includes('video')) {
            videoexist.push(true);
          }
        })
      })
      if (item?.medialist.length == 0) {
        if (videoexist.includes(true)) {
          item.isVideo = false;
        } else {
          delete item.isVideo;
          this.dashboard.forEach((e: any) => {
            if (e?.medialist?.length == 1 && e?.medialist[0]?.url.includes('assets')) {
              delete e.isVideo;
            } else if (e?.medialist?.length == 0) {
              delete e.isVideo;
            }
          })
        }
      }
      this.selectedSize = ((this.selectedSize * 1000) - obj?.file?.size) / 1000;
    }


    // // item.url = null;

  }

  ngAfterViewInit(): void {

    this.swiperSlider = new Swiper('.swiper-slider', {
      centeredSlides: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
      },
      // loop: true,
      speed: 1000,
      slidesPerView: 1, // Adjust this value
      slidesPerGroup: 1, // Adjust this value
      on: {

      },
    });
  }
  async saveSplitScreen() {
    let v: any;
    if (this.client.ismbc) {
      if (this.exampleForm.invalid) {
        this.alertService.showInfo('Please Fill the Fields');

        return
      } else {
        this.layoutname = this.exampleForm.value.layoutname;
        v = {
          layoutname: this.exampleForm.value.layoutname,
          zonecount: this.dashboard?.length,
          clientname: this.playlist?.playlist?.clientname,
          isvertical: this.isVertical == '9:16' ? true : false,
          playlistid: this.playlist?.playlist?.id,
          mediatype: this.playlist?.playlist.mediainfo?.id,
          brandname: this.exampleForm.value.myControl,
          tagid: this.exampleForm.value.chooseContentTag
        };
      }
    } else {
      v = {
        layoutname: this.layoutname,
        zonecount: this.dashboard?.length,
        clientname: this.playlist?.playlist?.clientname,
        isvertical: this.isVertical == '9:16' ? true : false,
        playlistid: this.playlist?.playlist?.id,
        mediatype: this.playlist?.playlist.mediainfo?.id,
        createdby: this.currentUser?.username
      };
    }

    let falselist: any = [];
    let isEmpty = false;

    // Checking for empty or local media lists
    this.dashboard.forEach((e: any, index: any) => {
      if (e?.medialist.length == 0) {
        isEmpty = true;
      } else if (e?.medialist[0]?.url.includes('assets')) {
        falselist.push(true);
      }
    });

    // Proceed if layout name is provided and there are no empty or local media lists
    if (this.layoutname && !falselist.includes(true) && !isEmpty) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      });

      try {
        // Check if it's an existing layout
        if (this.layout && !this.layout?.isDefault) {
          // Loop through each zone and save/update data
          for (const e of this.dashboard) {
            const v: any = new FormData();
            v.append('zoneid', e.id);
            v.append('isMuted', e.isMuted ? 1 : 0);
            v.append('playlistid', this.playlist?.playlist?.id);
            v.append('createdby', this.currentUser?.username);
            // Check if media files exist for the zone
            let isSize = e.medialist.some((d: any) => d?.file?.size);
            // add new media to zone
            e.medialist.forEach((d: any) => {
              if (d?.file?.size) {
                v.append('medialist', d?.file);
              }
            })
            if (isSize) {
              // Open loader if media files exist
              loader = this.matDialog.open(LoaderComponent, {
                panelClass: 'loader-upload'
              });
              // Save/update zone data
              await this.clientService.editSplitScreenZone(v).toPromise();
              this.alertService.showSuccess('Zone data saved/updated successfully');
            }
          }
        } else {
          // Save new layout and zones data
          const res: any = await this.clientService.saveLayout(v).toPromise();
          const layoutid = res?.message.substring(res?.message.lastIndexOf("-") + 1);

          // Loop through each zone to save zone data
          for (const e of this.dashboard) {
            const v: any = new FormData();
            // Append zone data
            v.append('id', e.id);
            v.append('layoutid', layoutid);
            v.append('cols', e.cols);
            v.append('rows', e.rows);
            v.append('y', e.y);
            v.append('x', e.x);
            v.append('playlistid', this.playlist?.playlist?.id);
            v.append('isMuted', e.isMuted ? 1 : 0);
            v.append('height', e.height ? e.height : 0);
            v.append('width', e.width ? e.width : 0);
            e.medialist.forEach((d: any) => {
              v.append('medialist', d.file);
            });
            // Save zone data
            await this.clientService.saveSplitScreenZone(v).toPromise();
            this.alertService.showSuccess('Zone data saved successfully');
          }
        }

        // Close loader and refresh data
        loader.close();
        this.matDialog.closeAll();
        if (this.client.ismbc) {
          this.mediaUploadComponent.refreshSplitLayoutsPlaylist(this.playlist?.playlist?.id, this.isVertical);
        } else {
          this.mediaUploadComponentC.refreshSplitLayoutsPlaylist(this.playlist?.playlist?.id, this.isVertical);
        }
      } catch (error: any) {
        // Handle errors
        loader.close();
        this.alertService.showError(error?.error?.message || 'An error occurred');
      }
    } else if (!this.layoutname) {
      this.alertService.showInfo('Please enter a layout name');
    } else {
      this.alertService.showInfo('Please choose at least one media file for each zone');
    }
  }

  // saveSplitScreen() {
  //   console.log(this.dashboard);
  //   let v: any = {
  //     layoutname: this.layoutname,
  //     zonecount: this.dashboard?.length,
  //     clientname: this.playlist?.playlist?.clientname,
  //     isvertical: this.isVertical == '9:16' ? true : false,
  //     playlistid: this.playlist?.playlist?.id,
  //     mediatype: this.playlist?.playlist.mediainfo?.id,
  //   };
  //   let falselist: any = [];
  //   let isEmpty = false;
  //   this.dashboard.forEach((e: any, index: any) => {
  //     if (e?.medialist.length == 0) {
  //       isEmpty = true;
  //     } else if (e?.medialist[0]?.url.includes('assets')) {
  //       falselist.push(true);
  //     }
  //   })
  //   // console.log(falselist);
  //   if (this.layoutname && !falselist.includes(true) && !isEmpty) {
  //     let loader = this.matDialog.open(LoaderComponent, {
  //       panelClass: 'loader-upload'
  //     })
  //     if (this.layout && !this.layout?.isDefault) {
  //       // this.dashboard.forEach(async (e: any, index: any) => {
  //       //   const v: any = new FormData();
  //       //   v.append('id', e.id);
  //       //   v.append('layoutid', this.layout?.id);
  //       //   // v.append('cols', e.cols);
  //       //   // v.append('rows', e.rows);
  //       //   // v.append('y', e.y);
  //       //   // v.append('x', e.x);
  //       //   v.append('playlistid', this.playlist?.playlist?.id)
  //       //   // v.append('isMuted', e.isMuted ? 1 : 0);
  //       //   // v.append('height', e.height ? e.height : 0);
  //       //   // v.append('width', e.width ? e.width : 0);
  //       //   e.medialist.forEach((d: any) => {
  //       //     if (d?.file?.size) {
  //       //       v.append('medialist', d?.file);
  //       //     }
  //       //   })
  //       //   await (await this.clientService.saveSplitScreenZone(v)).subscribe((zres: any) => {
  //       //     if (this.dashboard?.length == (index + 1)) {
  //       //       loader.close();
  //       //       // this.alertService.showSuccess(res?.message.substring(0, res?.message.lastIndexOf("-")));
  //       //       this.matDialog.closeAll();
  //       //       this.mediaUploadComponent.refreshSplitLayoutsPlaylist(this.playlist?.playlist?.id, this.isVertical);
  //       //     }
  //       //   }, err => {
  //       //     loader.close();
  //       //     this.alertService.showError(err?.error?.message);
  //       //   })
  //       // })

  //       this.dashboard.forEach((e: any, index: any) => {
  //         const v: any = new FormData();
  //         // console.log(e);
  //         // console.log(e.isMuted ? 1 : 0);

  //         v.append('zoneid', e.id);
  //         v.append('isMuted', e.isMuted ? 1 : 0);
  //         v.append('playlistid', this.playlist?.playlist?.id)
  //         let isSize: any = [];
  //         e.medialist.forEach((d: any) => {
  //           if (d?.file?.size) {
  //             isSize.push(true);
  //             v.append('medialist', d?.file);
  //           }
  //         })
  //         // if (e.medialist.length != 0) {
  //         //   this.alertService.showInfo('please choose at least one media file for each zone');
  //         // }

  //         if (isSize.includes(true)) {
  //           let loader = this.matDialog.open(LoaderComponent, {
  //             panelClass: 'loader-upload'
  //           })
  //           this.clientService.editSplitScreenZone(v).subscribe((zres: any) => {
  //             this.alertService.showSuccess(zres.message)
  //             // if (this.dashboard?.length == (index + 1)) {
  //             loader.close();
  //             // this.alertService.showSuccess(res?.message.substring(0, res?.message.lastIndexOf("-")));
  //             //   this.matDialog.closeAll();
  //             //   this.mediaUploadComponent.refreshSplitLayoutsPlaylist(this.playlist?.playlist?.id, this.isVertical);
  //             // }
  //           }, err => {
  //             loader.close();
  //             this.alertService.showError(err?.error?.message);
  //           })
  //         }
  //         if (this.dashboard?.length == (index + 1)) {
  //           loader.close();
  //           // this.alertService.showSuccess(res?.message.substring(0, res?.message.lastIndexOf("-")));
  //           this.matDialog.closeAll();
  //           this.mediaUploadComponent.refreshSplitLayoutsPlaylist(this.playlist?.playlist?.id, this.isVertical);
  //         }
  //       })
  //     }
  //     else {
  //       // console.log("nno layout");
  //       this.clientService.saveLayout(v).subscribe((res: any) => {
  //         // console.log(res);
  //         let layoutid = res?.message.substring(res?.message.lastIndexOf("-") + 1);
  //         this.dashboard.forEach((e: any, index: any) => {
  //           // console.log(e);
  //           const v: any = new FormData();
  //           v.append('id', e.id);
  //           v.append('layoutid', layoutid);
  //           v.append('cols', e.cols);
  //           v.append('rows', e.rows);
  //           v.append('y', e.y);
  //           v.append('x', e.x);
  //           v.append('playlistid', this.playlist?.playlist?.id)
  //           v.append('isMuted', e.isMuted ? 1 : 0);
  //           v.append('height', e.height ? e.height : 0);
  //           v.append('width', e.width ? e.width : 0);
  //           e.medialist.forEach((d: any) => {
  //             v.append('medialist', d.file);
  //           })
  //           this.clientService.saveSplitScreenZone(v).subscribe((zres: any) => {
  //             // console.log(zres);
  //             this.alertService.showSuccess(zres.message);
  //             if (this.dashboard?.length == (index + 1)) {
  //               loader.close();
  //               this.alertService.showSuccess(res?.message.substring(0, res?.message.lastIndexOf("-")));
  //               this.matDialog.closeAll();
  //               this.mediaUploadComponent.refreshSplitLayoutsPlaylist(this.playlist?.playlist?.id, this.isVertical);
  //             }
  //           }, err => {
  //             loader.close();
  //             this.alertService.showError(err?.error?.message);
  //           })
  //         })
  //       }, err => {
  //         this.alertService.showError(err?.error?.message)
  //       })
  //     }

  //   } else if (!this.layoutname) {
  //     this.alertService.showInfo('please enter layout name')
  //   } else {
  //     this.alertService.showInfo('please choose at least one media file for each zone')
  //   }

  // }
  round(e: any) {
    return Math.round(e) + 'px';
  }
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  getAllContentTags() {
    this.clientService.getAllContentTags().subscribe(res => {
      this.tagList = res;
    })
    this.clientService.getBrandList().subscribe(res => {
      this.brandList = res;
    })

  }
  getAllowedUploadMediaFiles() {
    this.clientService.getAllowedUploadMediaFiles().subscribe(res => {
      this.allowedMediaList = res;
    })
  }
  // isValidFileType(file: any) {
  //   const validMimeTypes = [
  //     "image/png",
  //     "image/jpeg",
  //     "video/mp4",
  //     "video/quicktime",
  //     "video/x-matroska",
  //     "application/pdf"
  //   ];

  //   const validExtensions = [
  //     "png",
  //     "jpg",
  //     "jpeg",
  //     "mp4",
  //     "mov",
  //     "mkv",
  //     "pdf"
  //   ];

  //   const mimeType = file.type;
  //   const fileExtension = file.name.split('.').pop().toLowerCase();
  //   const isValidMimeType = validMimeTypes.includes(mimeType);
  //   const isValidExtension = validExtensions.includes(fileExtension);
  //   const isValid = isValidMimeType && isValidExtension;

  //   // Determine file type category
  //   const isImage = ["image/png", "image/jpeg"].includes(mimeType);
  //   const isVideo = ["video/mp4", "video/quicktime", "video/x-matroska"].includes(mimeType);
  //   const isPdf = mimeType === "application/pdf";

  //   // Return the object with validation status and file type info
  //   return {
  //     isValid: isValid,
  //     isImage: isImage,
  //     isVideo: isVideo,
  //     isPdf: isPdf
  //   };
  // }
  isValidFileType(file: any) {
    const mimeType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const matchingType = this.allowedMediaList.find(
      (type: any) =>
        type.mimetype === mimeType &&
        type.filetype.toLowerCase() === fileExtension
    );

    const isValid = !!matchingType;
    const isImage = matchingType?.mediatype.mediatype === "image";
    const isVideo = matchingType?.mediatype.mediatype === "video";
    const isPdf = matchingType?.mediatype.mediatype === "pdf";

    return {
      isValid: isValid,
      isImage: isImage,
      isVideo: isVideo,
      isPdf: isPdf
    };
  }
}

function generateUniqueRandomFromString(inputString: any, length: any) {
  // Convert the input string to an array of characters
  var chars = inputString.split('');

  // Shuffle the array
  for (var i = chars.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
  }

  // Join the shuffled array to form a string and slice to the desired length
  var shuffledString = chars.join('').slice(0, length);

  return shuffledString;
}

function timeStringToSeconds(timeString: any): number {
  // console.log(timeString);

  const timeParts = timeString.split(':').map(Number);
  const [hours, minutes, seconds] = timeParts;
  return Math.round((hours * 3600) + (minutes * 60) + seconds);
}