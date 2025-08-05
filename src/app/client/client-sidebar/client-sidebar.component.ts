
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import * as moment from 'moment-timezone';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { clienturl } from 'src/app/api-base';
import Swal from 'sweetalert2';


// Newely Added
import { Location } from '@angular/common';
import { NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-client-sidebar',
	templateUrl: './client-sidebar.component.html',
	styleUrls: ['./client-sidebar.component.scss']
})
export class ClientSidebarComponent implements OnInit {
	isDark = false;
	isMoblie = false;
	matDialogRef: any;
	notilist: any = []
	clientid: any
	isOpened = true;
	distributor: any;
	roles: any;
	isAdmin = false;
	badgeCount!: number;
	clientname: any;
	isDistributor = false;
	planName: any;
	isPro: any = false;
	isBasic: any = false;
	clientcode: any;
	client: any;
	kolkataTime!: string;
	currentVersion = clienturl.CURRENT_VERSION();
	currentDateTime = sessionStorage.getItem('currentDateTime');
	notifyCount: any = 0;
	public showNavbarBackBtn: boolean = false; // Declare a var for backButton

	constructor(
		private authService: AuthService,
		private observer: BreakpointObserver,
		private matDialog: MatDialog,
		private tokenStorage: StorageService,
		private router: Router,
		private clientService: ClientService,
		private location: Location  // <--Added location new
	) {
		this.badgeCount = 5;



	}
	utcDateTime: any;
	ngOnDestroy() {
		// Clear interval to avoid memory leaks

	}

	// New BACK BUTTON Added 
	goBack() {
		this.location.back();
	}

	ngOnInit(): void {

		// let myVar = setInterval(() => {
		//   this.currentDateTime = sessionStorage.getItem('currentDateTime');
		//   if(this.client?.country?.countryname!='INDIA'){
		//     let timezone: any = document.getElementById("timezone");
		//     let tokyoTime = moment().tz(this.client.timezone).format('YYYY-MM-DDTHH:mm:ss.SSSSSS+00:00');
		//     timezone.innerHTML = moment(tokyoTime).tz(this.client.timezone).utc().format('MM/DD/YYYY HH:mm:ss');
		//   }
		// }, 1000);

		// Detect route on initial load
		const currentUrl = this.router.url;
		this.showNavbarBackBtn = currentUrl !== '/login' && currentUrl !== '/';


		// // Watch route changes to decide when to show the back button
		// this.router.events.subscribe(event => {
		// 	if (event instanceof NavigationEnd) {
		// 		const currentUrl = event.urlAfterRedirects || event.url;

		// 		// Hide on login or root only — show elsewhere
		// 		this.showNavbarBackBtn = !(currentUrl === '/login');

		// 		// Debug log
		// 		// console.log('Current URL:', currentUrl);
		// 		// console.log('Show back button:', this.showNavbarBackBtn);
		// 	}
		// });

		let currentuser: any = this.tokenStorage.getClientUsername();
		// console.log(currentuser);
		this.clientService.getClientByUsername(currentuser).subscribe((res: any) => {
			console.log(res);
			this.client = res;

			// timezone.src = "https://free.timeanddate.com/clock/i999kz21/" + this.client.timezone + "/fcf5548a/tt0/tw0/tm3/th1/tb2"
			this.clientService.getPlaylistScheduleDetailsByClient(res.id).subscribe(res => {
				// console.log(res);
				this.notifyCount = res;
			})
			this.clientname = res.clientname;
			this.clientid = res.id;
			this.clientcode = res.clientcode;
			this.distributor = res.distributor;
			this.planName = res.versionMaster.version;
			if (this.planName == "PRO") {
				this.isPro = true;
			} else {
				this.isPro = false;
			}
			if (this.planName == "BASIC") {
				this.isBasic = true;
				// this.router.navigate(['/client/screen']);
			} else {
				this.isBasic = false;
			}
		});
		this.clientService.getNotificationForOtaUpgrade(currentuser).subscribe((res: any) => {
			this.notilist = res;
		})

		this.roles = this.tokenStorage.getUser().roles;
		const user = this.tokenStorage.getUser();
		const distributor = this.tokenStorage.getDistributor();
		// console.log(distributor);

		this.roles = user.roles;
		this.isAdmin = this.roles.includes('ROLE_ADMIN');
		this.isDistributor = this.roles.includes('ROLE_DISTRIBUTOR');

		if (distributor || distributor?.roles[0] == "ROLE_DISTRIBUTOR") {
			this.isDistributor = true;
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
		// console.log(this.isAdmin);
		// console.log(this.isDistributor);
		// console.log(distributor);


	}
	returnToAdmin() {
		this.router.navigate(['admin/dashboard']).then(() => {
			sessionStorage.removeItem("auth-distributor");
			sessionStorage.removeItem("auth-client");
			window.location.reload();
		});

	}
	setIsViewForClient() {
		let user = this.tokenStorage.getUser();
		if (user.roles.includes('ROLE_CLIENT')) {
			// console.log(user);
			this.clientService.setIsViewForClient(user.username).subscribe(res => {
				console.log(res);
				this.ngOnInit();
			})
		}
	}
	returnToDistributor() {
		this.router.navigate(['distributor/distributor-customer-list']).then(() => {
			sessionStorage.removeItem("auth-client");
			window.location.reload();
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
	signOut() {
		this.authService.signOut();
		window.sessionStorage.clear();
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
	navgetToUrl(e: any, id: any) {
		if (id === 'REDITOR') {
			window.location.assign("http://localhost:4400/customer/" + this.client.username)
		} else {
			this.router.navigateByUrl("client/" + id);
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
	isSearch = false;
	search() {
		const searchBox = document.getElementById('searchBox');
		var googleIcon = document.getElementById('googleIcon');
		searchBox?.classList.toggle('active');
		if (searchBox?.classList.contains("active")) {
			this.isSearch = true;
		} else {
			this.isSearch = false;
		}


	}
	getReportPrintTime() {
		var today = new Date();
		var month = today.getMonth() + 1;
		var day = today.getDate();
		var hours: any = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
		var am_pm = today.getHours() >= 12 ? "PM" : "AM";
		hours = hours < 10 ? "0" + hours : hours;
		var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
		var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();


		if (month < 10 && day < 10) {
			var date = today.getFullYear() + '/' + "0" + month + '/' + "0" + today.getDate();
		}
		else if (month < 10 && day > 10) {
			var date = today.getFullYear() + '/' + "0" + month + '/' + today.getDate();
		} else if (month > 10 && day < 10) {
			var date = today.getFullYear() + '/' + month + '/' + "0" + today.getDate();
		}
		else {
			var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
		}
		var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
		return date + ' ' + time;
	}

	onKeydown(e: any) {
		if (e.target.value.length === e.target.maxLength) {
			// e.stopPropagation();
			// e.preventDefault();
			if (e.keyCode === 8 ||
				e.keyCode === 46 ||
				e.keyCode === 39 ||
				e.keyCode === 37) {
				return true;
			}
			return false;
		}
		return true;
	}

	isPassword: any = true;

	eyePassword(input: any) {
		if (this.isPassword) {
			input.setAttribute("type", "text");
		} else {
			input.setAttribute("type", "password");
		}
		this.isPassword = !this.isPassword;
		// console.log(input?.type);
	}
	editCustomer(template: any) {
		// console.log(template);

		this.matDialogRef = this.matDialog.open(template, {
			data: this.client
		})
	}
	closePopup() {
		this.matDialogRef.close();
	}
	saveCustomer(email: any, phone: any, username: any) {
		let payload: any = {
			email: email?.value,
			username: username?.value,
			phone: phone?.value,
		}
		// console.log(payload);
		let loader = this.matDialog.open(LoaderComponent, {
			panelClass: 'loader-upload'
		})
		this.clientService.editClientBySelf(payload).subscribe((res: any) => {
			// console.log(res);
			Swal.fire({
				title: "Success!!",
				text: res?.message,
				icon: "success"
			});
			loader.close();
		}, err => {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: err?.error?.message,
				footer: '<a href="#">Why do I have this issue?</a>'
			});
			loader.close();
		})
	}

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



	// fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
	//   .then(response => response.json())
	//   .then(data => {
	//     let v: any = document.getElementById("timer");
	//     // console.log(data)
	//     let v2 = data.datetime;
	//     let a = v2.split('.');
	//     let T = a[0].replace('T', ' ');
	//     let T1 = T.replace('-', '/');
	//     let T2 = T1.replace('-', '/')
	//     v!.innerHTML = T2;
	//   })
	//   .catch(error => console.error('Error fetching data:', error));

	let v: any = document.getElementById("timer");
	let time: any = sessionStorage.getItem('currentTime');
	// let v2 = data.datetime;
	let a = time.split('.');
	let T = a[0].replace('T', '&nbsp;&nbsp;');
	let T1 = T.replaceAll('-', '/');
	v!.innerHTML = T1;
}