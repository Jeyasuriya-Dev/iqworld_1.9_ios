import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from './_core/services/date.service';
import Swal from 'sweetalert2';
const { App: CapacitorApp } = Plugins;//capacitor-backpress
import { Plugins, Capacitor } from '@capacitor/core';//capacitor-backpress
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';


declare var $: any;
export interface User {
	name: string;
	city: string;
}
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	@ViewChild('confDialog') confDialog = {} as TemplateRef<User>;
	title = 'iqword';
	showNavbarBackBtn = false;
	previousUrl: string = '';
	private shouldShowConfirm = false;
	router1: any;




	constructor(private router: Router, private dateService: DateService, private dialog: MatDialog,
		private location: Location
	) {
		// console.log(router);
		this.router1 = router;
	}


	goBack(): void {
		// this.location.back();  // Goes back to the previous page in history

		if (this.router.url !== '/' && this.router.url !== '/login') {
			// Check if the current URL is the dashboard
			if (this.router.url === '/admin/dashboard') {
				// Open dialog here
				this.openDialog();
			} else {
				// Go back to the previous page
				window.history.back();
				// this.location.back();  // Goes back to the previous page in history

			}
		}
	}



	ngOnInit(): void {
		// 1. Manual check for initial load
		// const currentUrl = this.router.url;
		// this.showNavbarBackBtn = currentUrl !== '/login' && currentUrl !== '/';

		// //Show back button on all pages except login or root 
		// this.router.events.subscribe(event => {
		// 	if (event instanceof NavigationEnd) {
		// 		this.showNavbarBackBtn = !['/login', '/'].includes(event.urlAfterRedirects);
		// 		const newUrl = event.urlAfterRedirects;
		// 		if (this.router.url !== newUrl) {
		// 			this.previousUrl = this.router.url;
		// 		}

		// 		if (newUrl === '/admin/dashboard') {
		// 			history.pushState(null, '', this.router.url);
		// 		}


		// 	}
		// });

		// window.addEventListener('popstate', (event) => {
		// 	const currentUrl = this.router.url;

		// 	//  Handle only dashboard case
		// 	if (currentUrl === '/admin/dashboard') {
		// 		event.preventDefault();
		// 		this.openDialog();

		// 		// Swal.fire({
		// 		// 	title: "Are you sure?",
		// 		// 	text: "Do you want to logout?",
		// 		// 	showCancelButton: true,
		// 		// 	confirmButtonColor: "#3085d6",
		// 		// 	cancelButtonColor: "#d33",
		// 		// 	confirmButtonText: "OK"
		// 		// }).then((result) => {
		// 		// 	if (result.isConfirmed) {
		// 		// 		this.router.navigate(['/login']);
		// 		// 	} else {
		// 		// 		// Stay on dashboard
		// 		// 		history.pushState(null, '', '/admin/dashboard');
		// 		// 	}
		// 		// });

		// 	}
		// });
		


		let myVar = setInterval(() => {
			let today: any = new Date();
			let v = today.toLocaleString()
			sessionStorage.setItem('currentTime', today);
			sessionStorage.setItem('currentDateTime', v)
		}, 1000);

		if (Capacitor.isNative) {
			(Plugins as any)['App'].addListener('backButton', async () => {
				// If the current URL is not the root URL or login page
				if (this.router.url !== '/' && this.router.url !== '/login') {
					// Check if the current URL is the dashboard
					if (this.router.url === '/admin/dashboard') {
						// Open dialog here
						this.openDialog();
					} else {
						// Go back to the previous page
						// this.location.back()
						window.history.back();
					}
				}
			});
		}


	}
	dialogRef: any;
	openDialog() {
		this.dialogRef = this.dialog.open(this.confDialog, {
			// panelClass:'wallettransfer'
		})
		// Code to open the dialog
		// For example:
		// showDialogFunction();
	}

	onConfirm() {
		// this.dialogRef.close();
		// this.shouldShowConfirm = false;
		// this.router.navigate(['/login']);
		window.history.back();
	}

	onDismiss() {
		this.dialogRef.close();
		// this.shouldShowConfirm = false;
	}


}
function loader() {
	window.addEventListener("load", (event) => {
		setTimeout(function () {
			$('#loading').hide();
		}, 2000);
	});
}