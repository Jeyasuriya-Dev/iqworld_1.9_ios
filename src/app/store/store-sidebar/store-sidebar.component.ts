import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-store-sidebar',
  templateUrl: './store-sidebar.component.html',
  styleUrls: ['./store-sidebar.component.scss']
})
export class StoreSidebarComponent implements OnInit {
  isMoblie = false;
  store: any;
  clientname: any
  isOpened = true;
  userRole: any;
  count: any = 0;
  constructor(private authService: AuthService, private router: Router, private storageService: StorageService, private clientService: ClientService, private observer: BreakpointObserver) {

  }
  ngOnInit(): void {
    let v = this.storageService.getUser();
    this.userRole = this.storageService.getUserRole();
    if (this.storageService.getUserRole() === 'STORE') {
      this.clientService.getStoreByUsername(v.username).subscribe((res: any) => {
        this.store = res;
        this.clientService.getNotificationCountForScheduleApproval(this.store.id).subscribe((res: any) => {
          this.count = res;
        });

      });


    } else {
      this.clientService.getSuserByUsername(v.username).subscribe((res: any) => {
        this.store = res;
      });
    }
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
  }

  openSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar!.classList.toggle("close");
    this.isOpened = true;

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
  mouseEnter() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar!.classList.contains("hoverable")) {
      // sidebar!.classList.remove("close");
      // this.isOpened = true;
    }
  }
  signOut() {
    this.authService.signOut();
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  navgetToUrl(e: any, id: any) {
    if (id === 'REDITOR') {
      window.location.assign("http://localhost:4400/customer/" + this.store.username)
    } else {
      this.router.navigateByUrl("store/" + id);
    }
    // this.closeSidebar()
    if (this.isMoblie) {
      this.closeSidebar();
    }
    // console.log(e);
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
}
