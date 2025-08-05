import { Component, Inject, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import Swiper from 'swiper';
// import 'swiper/swiper-bundle.css';
import { ClientService } from '../../services/client.service';
import { StorageService } from '../../services/storage.service';

declare var Swiper: any
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('marquee') marquee!: ElementRef | any;
  address: any;
  filesData: any = [];
  scrollerList: any = []
  autoplayEnabled = true; // Control autoplay dynamically
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private clientService: ClientService, private token: StorageService) {
    console.log(data);
    this.filesData = data;
    if (data) {
      this.getScrollerList();
      this.address = geocode(this.filesData?.playlist);
    }
  }
  ngOnInit(): void {
    this.clientService.getFontList().subscribe(res => {
      let fontList: any = res;
      // console.log(fontList);
      fontList.forEach((element: any) => {
        // console.log(element);
        // console.log(
        this.clientService.convertUrlToDataUri(element?.url)

        // const fontDataUri = `data:application/font-woff;charset=utf-8;base64,${btoa(element.url)}`;
        this.applyFontStyle1(element?.url, element.fontname)
      });
    })


    this.startUpdatingCurrentItem();
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

  getScrollerList() {
    this.token.getClientUsername()
    this.clientService.getScrollerByClientnameNdPlaylistid(this.token.getClientUsername(), this.filesData?.playlist?.id).subscribe((res: any) => {
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
  ngAfterViewInit(): void {
    // const swiper = new Swiper(".mySwiper", {
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
    //   keyboard: {
    //     enabled: true,
    //   },
    //   loop: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
    //   },
    //   speed: 1000,
    //   on: {
    //     slideChangeTransitionStart: () => {
    //       const activeSlide = swiper.slides[swiper.activeIndex];
    //       const isVideo = activeSlide.querySelector('video');
    //       // console.log(isVideo);
    //       if (isVideo) {
    //         // Disable autoplay when a video slide is active
    //         isVideo.play();
    //         // swiper.autoplay.stop();
    //         swiper.autoplay = "false";
    //         isVideo.muted = !isVideo.muted;
    //         // this.autoplayEnabled = false;

    //         isVideo.addEventListener('ended', () => {
    //           // Enable autoplay after the video ends
    //           swiper.autoplay = "true";
    //           isVideo.muted = !isVideo.muted;
    //           // this.autoplayEnabled = true;
    //           isVideo.pause();
    //           // Move to the next slide
    //           swiper.slideNext();
    //         });
    //       } else {
    //         setTimeout(() => {
    //           swiper.slideNext();
    //         }, 5000);
    //       }
    //     },
    //   },
    // });

    //   // const swiper = new Swiper(this.swiperContainer.nativeElement, {
    //   //   loop: true,
    //   //   autoplay: {
    //   //     delay: 5000, // Set the autoplay delay in milliseconds
    //   //   },
    //   //   speed: 1000, // Set the transition speed in milliseconds
    //   //   on: {
    //   //     slideChangeTransitionEnd: () => {
    //   //       const activeSlide = swiper.slides[swiper.activeIndex];
    //   //       const isVideo = activeSlide.querySelector('video');

    //   //       if (isVideo) {
    //   //         isVideo.addEventListener('ended', () => {
    //   //           swiper.slideNext();
    //   //         });
    //   //       }
    //   //     },
    //   //   },
    //   // });
    // Set the initial current item index
    let v: any = document.getElementById("marquee");
    let v1: any = document.getElementById("currentimage");
    let v2: any = document.getElementById("swiperHide");
    let v3: any = document.getElementById("appLoader");
    const list = v?.classList;
    const list1 = v1?.classList;
    const list2 = v2?.classList;
    const list3 = v3?.classList;
    if (this.filesData?.height > this.filesData?.width) {
      setTimeout(() => {
        if (list.contains('hide')) {
          v.classList.remove('hide');
        }
        if (list1.contains('hide')) {
          v1.classList.remove('hide');
        }
        if (list2.contains('hide')) {
          v2.classList.remove('hide');
        }
        this.swipe()
        v3.classList.add('DisplayNone')
      }, 6000);
    } else {
      setTimeout(() => {

        if (list.contains('hide')) {
          v.classList.remove('hide');
        }
        if (list1.contains('hide')) {
          v1.classList.remove('hide');
        }
        if (list2.contains('hide')) {
          v2.classList.remove('hide');

        }
        this.swipe()
        v3.classList.add('DisplayNone')
      }, 11000);
    }
  }

  swipe() {
    const swiper = new Swiper(".mySwiper", {
      // spaceBetween: 30,
      // centeredSlides: true,
      // autoplay: {
      //   delay: 1000,
      //   disableOnInteraction: false,
      // },
      // loop: true,

      // speed: 1000, // Set the transition speed in milliseconds
      // on: {
      //   slideChangeTransitionEnd: () => {
      //     const activeSlide = swiper.slides[swiper.activeIndex];
      //     const isVideo = activeSlide.querySelector('video');
      //     console.log(isVideo);

      //     if (isVideo) {
      //       isVideo.addEventListener('ended', () => {
      //         swiper.slideNext();
      //       });
      //     }
      //   },
      // },
      // pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      // },
      // navigation: {
      //   nextEl: ".swiper-button-next",
      //   prevEl: ".swiper-button-prev",
      // },
      keyboard: {
        enabled: true,
      },
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false, // Allow interaction (like clicking on the slide) without stopping autoplay
      },
      speed: 1000,
      on: {
        slideChangeTransitionStart: () => {
          const activeSlide = swiper.slides[swiper.activeIndex];
          const isVideo = activeSlide.querySelector('video');
          // console.log(isVideo);
          if (isVideo) {
            // Disable autoplay when a video slide is active
            isVideo.play();
            // swiper.autoplay.stop();
            swiper.autoplay = "false";
            isVideo.muted = !isVideo.muted;
            // this.autoplayEnabled = false;

            isVideo.addEventListener('ended', () => {
              // Enable autoplay after the video ends
              swiper.autoplay = "true";
              isVideo.muted = !isVideo.muted;
              // this.autoplayEnabled = true;
              isVideo.pause();
              // Move to the next slide
              swiper.slideNext();
            });
          } else {
            setTimeout(() => {
              swiper.slideNext();
            }, 5000);
          }
        },
      },
    });
  }

  currentItemIndex = 0;
  updateInterval: any;
  ngOnDestroy(): void {
    clearInterval(this.updateInterval);
  }

  startUpdatingCurrentItem(): void {
    this.updateInterval = setInterval(() => {
      this.updateCurrentItem();
    }, 1000); // Update the current item index every 1 second
  }

  updateCurrentItem(): void {
    const marqueeElement = this.marquee.nativeElement;
    const itemElements = marqueeElement.children;
    const marqueeRect = marqueeElement.getBoundingClientRect();

    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < itemElements.length; i++) {
      const item = itemElements[i] as HTMLElement;
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const marqueeCenter = marqueeRect.left + marqueeRect.width / 2;
      const distance = Math.abs(itemCenter - marqueeCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = parseInt(item.getAttribute('data-index') || '0', 10);
      }
    }

    this.currentItemIndex = closestIndex;
    console.log('Current Index:', this.currentItemIndex);
  }

  onMarqueeScroll(): void {
    this.updateCurrentItem();
  }
}
async function geocode(data: any): Promise<string | null> {
  const area = data?.location?.area?.toLowerCase();
  const pincode = data?.location?.pincode?.toLowerCase();
  const city = data?.city?.cityname?.toLowerCase();
  const district = data?.district?.name?.toLowerCase();
  const state = data?.state?.statename?.toLowerCase();
  // const country = data.country.countryname.toLowerCase();
  // ,${city},${district},${state}
  const address = `${pincode ? pincode : ''}   ${city ? city : ''}`;
  // const address = `${522659} ${'mukkellapadu'}`;
  const endpoint = 'https://nominatim.openstreetmap.org/search';
  const query = encodeURIComponent(address);
  const url = `${endpoint}?q=${query}&format=json&addressdetails=1&extratags=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const resultDiv = document.getElementById('geocodeResult');

    if (data.length > 0) {
      const location = data[0]; // Adjust if data is an array
      const lat = location.lat;
      const lon = location.lon;
      const address = location.address;

      // Construct the comprehensive location string
      const locationString = [
        address.town,
        address.county,
        address.state_district,
        address.state,
        address.country,
        address.postcode,
        `\nLat: ${lat}`,
        `Lon: ${lon}`
      ].filter(part => part).join(', ');

      updateMap(lat, lon);
      if (resultDiv) {
        resultDiv.textContent = location.display_name + ', Lat: ' + `${lat}` + ', Lon: ' + `${lon}`;
      }

      return locationString;
    } else {
      console.log('No results found');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null; // Ensure function returns null in case of an error
  }
}

function updateMap(lat: string, lon: string) {
  const iframe = document.getElementById('gmap_canvas') as HTMLIFrameElement;
  if (iframe) {
    const newSrc = `https://maps.google.com/maps?q=${lat},${lon}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    iframe.src = newSrc;
  }
}
