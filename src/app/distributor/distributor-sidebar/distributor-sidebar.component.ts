import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import * as moment from 'moment';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { ClientListComponent } from 'src/app/admin/_features/client-list/client-list.component';
import { DeviceinfoComponent } from 'src/app/admin/_features/deviceinfo/deviceinfo.component';
import { clienturl } from 'src/app/api-base';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-distributor-sidebar',
  templateUrl: './distributor-sidebar.component.html',
  styleUrls: ['./distributor-sidebar.component.scss']
})
export class DistributorSidebarComponent implements OnInit {
  isDark = false;
  isMoblie = false;
  isOpened = true;
  notificatons: any;
  total: any;
  newnotificatons: any = 0;
  complaintBox: any;
  isDistributor = false;
  distributorName: any;
  distributor: any;
  isAdmin = false;
  distributorCode: any;
  Complaint_count: any;
  Request_count: any;
  currentDateTime = sessionStorage.getItem('currentDateTime');
  currentVersion = clienturl.CURRENT_VERSION();
  constructor(private observer: BreakpointObserver, private deviceinfoComponent: DeviceinfoComponent, private clientListComponent: ClientListComponent, private authService: AuthService, private router: Router, private storageService: StorageService, private clientService: ClientService, private matDialog: MatDialog) { }
  getAgo(date: any) {
    // console.log(date);
    const date1: any = new Date(date);
    const date2: any = new Date();
    // console.log(date1);

    const diffTime = Math.abs(date2 - date1);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffTime + " milliseconds");
    // console.log(diffDays + " days");
    return msToTime(diffTime) + " ago";
  }
  ngOnInit(): void {
    let myVar = setInterval(() => {
      this.currentDateTime = sessionStorage.getItem('currentDateTime');
      // let myVar = setInterval(() => {
      //   if(this.distributor?.country?.countryname!='INDIA'){
      //     let timezone: any = document.getElementById("timezone");
      //     let tokyoTime = moment().tz(this.distributor.timezone).format('YYYY-MM-DDTHH:mm:ss.SSSSSS+00:00');
      //     timezone.innerHTML = moment(tokyoTime).tz(this.distributor.timezone).utc().format('MM/DD/YYYY HH:mm:ss');
      //   }
      // }, 1000);
     
  
    }, 1000);
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

    const submenuItems = document.querySelectorAll(".submenu_item");
    submenuItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        item.classList.toggle("show_submenu");
        submenuItems.forEach((item2, index2) => {
          if (index !== index2) {
            item2.classList.remove("show_submenu");
          }
        });
      });
    });

    const user = this.storageService.getUser();
    // console.log(user);

    if (user.roles[0] == "ROLE_DISTRIBUTOR") {
      this.clientService.getdistributorByUsername(user.username).subscribe(res => {
        console.log(res);

        this.distributor = res;
        this.distributorName = this.distributor?.distributor;
        this.distributorCode = this.distributor?.distributorcode;
        this.getComplaintList(this.distributor?.username);
      })
    } else {
      const di = this.storageService.getDistributor();
      // console.log(di);
      this.clientService.getdistributorByUsername(di.username).subscribe(res => {
        this.distributor = res;
        this.distributorName = this.distributor?.distributor;
        this.distributorCode = this.distributor?.distributorcode;
        this.getComplaintList(this.distributor?.username);
      })
    }
    let roles = user.roles;
    this.isAdmin = roles.includes('ROLE_ADMIN');

  }

  openSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar!.classList.toggle("close");
    this.isOpened = true;
  }
  getComplaintList(username: any) {
    this.clientService.getComplaintCountByDistributorOrAdmin(username).subscribe((res: any) => {
      this.notificatons = res;
      // console.log(res);
      this.total = res.length;
      this.Complaint_count = res.Complaint_count;
      this.Request_count = res.Request_count;
    })

    // this.clientService.getComplaintDetailsByView().subscribe((res: any) => {
    //   this.newnotificatons = res.length;
    //   // console.log(res);
    // })
  }
  closeSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar!.classList.add("close", "hoverable");
    this.isOpened = false;
  }
  expandSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar!.classList.remove("close", "hoverable");
    this.isOpened = true;
  }
  mouseLeave() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar!.classList.contains("hoverable")) {
      // sidebar!.classList.add("close");
      // this.isOpened = false;
    }
  }
  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
  showProfile() {
    const profile: any = document.querySelector(".profile-hover");
    if (profile!.style.display == "none") {

      profile!.style.display = "block";
    } else {
      profile!.style.display = "none";
    }
  }
  mouseEnter() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar!.classList.contains("hoverable")) {
      // sidebar!.classList.remove("close");
      // this.isOpened = true;
    }
  }
  changeMode() {
    const body = document.querySelector("body");
    body!.classList.toggle("dark");
    const darkLight = document.querySelector("#darkLight");
    sessionStorage.setItem("isDark", "true");
    if (sessionStorage.getItem("isDark") == "true") {
      if (body!.classList.contains("dark")) {
        // document.setI;
        darkLight!.classList.replace("bx-sun", "bx-moon");
      } else {
        darkLight!.classList.replace("bx-moon", "bx-sun");
      }
    }
  }
  menuItem() {
    const submenuItems = document.querySelectorAll(".submenu_item");
  }
  onClickItem() {

  }
  updateViewStatus(noti: any, complaint: any) {
    // console.log(noti);

    this.clientService.updateIsViewed(noti.id).subscribe((res: any) => {
      // console.log(res);
      this.getComplaintList(this.distributor?.username);
    })
    this.complaintBox = this.matDialog.open(complaint, {
      data: noti
    })

  }
  navgetToUrl(e: any, id: any) {
    this.router.navigateByUrl("distributor/" + id);
    if (this.isMoblie) {
      this.closeSidebar()
    }

    let nav_links = document.getElementsByClassName('nav_link');
    let nav_links_array = Array.from(nav_links);
    nav_links_array.forEach((element) => {

      if (element.classList.contains('active')) {
        element.classList.remove('active')
      }
    });
    if (e.target.classList.contains('navlink_icon')) {
      e.target.parentElement.classList.add('active')
    } else if (e.target.classList.contains('fa')) {
      e.target.parentElement.parentElement.classList.add('active');
    } else {
      e.target.classList.add('active')
    }
  }
  goToComplaintPage(id: any) {
    this.router.navigateByUrl("distributor/" + id);
    this.complaintBox.close();
  }
  goToDevicePage(id: any, unq: any) {
    // console.log(id + " " + unq);
    this.router.navigateByUrl("distributor/" + id).then(e => {

    });
    this.complaintBox.close();
  }
  updateComplaint(e: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "you want to activate/upgrade!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.complaintBox.close();
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.updateComplaint(e).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          Swal.fire({
            title: "Success!",
            text: res?.message,
            icon: "success"
          });
        }, err => {
          loader.close();
          Swal.fire({
            title: "Failed!",
            text: err?.error?.message,
            icon: "error"
          });
        })

      }
    });

  }

  goToCustomerPage(id: any, unq: any) {
    // console.log(id + " " + unq);
    this.router.navigateByUrl("distributor/" + id).then(e => {

    });
    this.complaintBox.close();
  }
  returnToAdmin() {
    this.router.navigate(['admin/dashboard']).then(() => {
      sessionStorage.removeItem("auth-distributor")
      window.location.reload();
    });
  }


}
// const body = document.querySelector("body");
// const darkLight = document.querySelector("#darkLight");
// const submenuItems = document.querySelectorAll(".submenu_item");

// const sidebarOpen = document.querySelector("#sidebarOpen");
// const sidebarClose = document.querySelector(".collapse_sidebar");
// const sidebarExpand = document.querySelector(".expand_sidebar");

function msToTime(ms: any) {
  let seconds: any = (ms / 1000).toFixed(0);
  let minutes: any = (ms / (1000 * 60)).toFixed(0);
  let hours: any = (ms / (1000 * 60 * 60)).toFixed(0);
  let days: any = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Mins";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days"
}
function myTimer() {
  //   var today = new Date();
  //   var month = today.getMonth() + 1;
  //   var day = today.getDate();
  //   const d = new Date();
  //   if (month < 10 && day < 10) {
  //     var date = today.getFullYear() + '/' + "0" + month + '/' + "0" + today.getDate();
  //   }
  //   else if (month < 10 && day > 10) {
  //     var date = today.getFullYear() + '/' + "0" + month + '/' + today.getDate();
  //   } else if (month > 10 && day < 10) {
  //     var date = today.getFullYear() + '/' + month + '/' + "0" + today.getDate();
  //   }
  //   else {
  //     var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  //   }
  //   // var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
  //  var datetime=  date + ' ' + d.toLocaleTimeString();

  //   let v: any = document.getElementById("timer");
  //   v!.innerHTML = datetime;

  let v: any = document.getElementById("timer");
  let time: any = sessionStorage.getItem('currentTime');
  // let v2 = data.datetime;
  let a = time.split('.');
  let T = a[0].replace('T', '&nbsp;&nbsp;');
  let T1 = T.replaceAll('-', '/');
  // let T2 = T1.replace('-', '/')
  v!.innerHTML = T1;
}