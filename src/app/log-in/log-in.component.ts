import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_core/services/alert.service';
import { AuthService } from '../_core/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../_core/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { clienturl } from '../api-base';
import { LoaderComponent } from '../_core/loader/loader.component';
import { ClientService } from '../_core/services/client.service';
const CURRENT_VERSION = clienturl.CURRENT_VERSION();


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  signInForm!: UntypedFormGroup;
  roles: any;
  CURRENT_VERSION = CURRENT_VERSION;
  passLength = false;
  isRememberMeChecked: any = false
  currentDate = new Date().getFullYear();
  RELEASE_DATE = clienturl.RELEASE_DATE();
  username: any = '';
  password: any = ''
  constructor(private fb: UntypedFormBuilder, private clientService: ClientService, private breakpointObserver: BreakpointObserver, private alertToaster: AlertService, private authService: AuthService, private router: Router, private tokenStorage: StorageService, private matDialog: MatDialog) {
    window.sessionStorage.clear();
    let v: any = localStorage.getItem('isRememberMeChecked');
    if (v) {
      this.username = localStorage.getItem('username');
      this.password = localStorage.getItem('password');
      this.isRememberMeChecked = v;
      this.passLength = v;
    }
    // sessionStorage.setItem("isNeedInspect", 'false');
    this.breakpointChanged();
  }
  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: [this.username, Validators.required],
      password: [this.password, Validators.required],
      isRememberMeChecked: [this.isRememberMeChecked]
    });
    // if (this.isRememberMeChecked) {
    //   localStorage.getItem('username');
    //   localStorage.getItem('password');
    //   this.signInForm.value.username = localStorage.getItem('username');
    //   this.signInForm.value.password = localStorage.getItem('password');
    // }
    this.breakpointChanged()
  }
  getPass(parameter: any) {
    // console.log(parameter.target.value);
    let value = parameter.target.value;
    if (value.length > 0) {
      this.passLength = true;
    } else {
      this.passLength = false;
    }
  }

  onSignInSubmit(form: UntypedFormGroup): any {
    //  alert(form.valid);
    // console.log(form);
    console.log(form.value);

    if (form.valid) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      // .trim()
      let v = {
        username: form.value.username.trim(),
        password: form.value.password.trim(),
      }

      this.authService.login(v).subscribe(res => {
        // console.log(res);
        // console.log(res.roles.includes('ROLE_ADMIN'));
        // console.log(res.roles.includes('ROLE_CLIENT'));
        if (form.value.isRememberMeChecked) {
          localStorage.setItem('username', v.username);
          localStorage.setItem('password', v.password);
          localStorage.setItem('isRememberMeChecked', 'true');
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          localStorage.setItem('isRememberMeChecked', 'false');
        }

        if (!res.roles.includes('ROLE_USER')) {
          this.alertToaster.showSuccess("You Have Successfully Logged In")
          // alert(res)
          this.tokenStorage.saveToken(res.accessToken);
          this.tokenStorage.saveUser(res);
          this.tokenStorage.saveLoggerName(res.username);
          this.tokenStorage.saveLoggerPass(form.value.password);
          this.roles = this.tokenStorage.getUser().roles;
          const user = this.tokenStorage.getUser();
          this.roles = user.roles;
          console.log(this.roles);
          let isAdmin = this.roles.includes('ROLE_ADMIN');
          let isClient = this.roles.includes('ROLE_CLIENT');
          let isStore = this.roles.includes('ROLE_STORE');
          let isStoreUser = this.roles.includes('ROLE_SUSER');
          console.log("isStore " + isStore);
          console.log("isStoreUser " + isStoreUser);
          let isUser = this.roles.includes('ROLE_USER');
          let isDistrubutor = this.roles.includes('ROLE_DISTRIBUTOR');
          let isDeveloper = this.roles.includes('ROLE_DEVELOPER');
          // console.log(isDistrubutor);

          loader.close();
          if (isAdmin) {
            this.router.navigate(['admin/dashboard']).then(() => {
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'success',
              //   title: 'You are successfully logged in',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              // window.location.reload();
            });
          } else if (isClient) {

            this.clientService.getClientByUsername(user.username).subscribe((res: any) => {
              // console.log(res);
              if (res.versionMaster.version == "BASIC") {
                this.router.navigate(['client/screen']).then(() => {
                  // Swal.fire({
                  //   position: 'top-end',
                  //   icon: 'success',
                  //   title: 'You are successfully logged in',
                  //   showConfirmButton: false,
                  //   timer: 2500
                  // })
                  // window.location.reload();
                });
              } else {
                this.router.navigate(['client/client-dashboard']).then(() => {
                  // Swal.fire({
                  //   position: 'top-end',
                  //   icon: 'success',
                  //   title: 'You are successfully logged in',
                  //   showConfirmButton: false,
                  //   timer: 2500
                  // })
                  // window.location.reload();
                });
              }

            })

          } else if (isStore || isStoreUser) {
            console.log(";;;;;;;;;;;;;;;;");

            this.router.navigate(['store/dashboard']).then(() => {
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'success',
              //   title: 'You are successfully logged in',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              // window.location.reload();
            });

          } else if (isDistrubutor) {
            this.router.navigate(['distributor/distributor-dashboard']).then(() => {
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'success',
              //   title: 'You are successfully logged in',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              window.location.reload();
            });

          } else if (isDeveloper) {
            this.alertToaster.showSuccess("You Have Successfully Logged In")
            this.tokenStorage.saveToken(res.accessToken);
            this.tokenStorage.saveDev(res);
            this.tokenStorage.saveLoggerName(res.username);
            this.tokenStorage.saveLoggerPass(form.value.password);
            this.roles = this.tokenStorage.getDev().roles;
            const user = this.tokenStorage.getDev();
            this.roles = user.roles;
            // console.log(this.roles);
            let isDeveloper = this.roles.includes('ROLE_DEVELOPER');
            if (isDeveloper) {
              this.router.navigate(['developer/ota-update']).then(() => {
                // Swal.fire({
                //   position: 'top-end',
                //   icon: 'success',
                //   title: 'You are successfully logged in',
                //   showConfirmButton: false,
                //   timer: 2500
                // })
                window.location.reload();
              });
            }
            loader.close();
          }
          else {
            this.alertToaster.showInfo("Sorry, User Not Allowed!!");
          }
        }
        else {
          loader.close();
          this.alertToaster.showInfo("Sorry, Invalid credentials!!");
        }
      }, (err) => {
        this.alertToaster.showError(err.error.message);
        loader.close();
        // this.alertToaster.showError("Invalid Credentials,Please Enter valid Username and Password");

      })
    } else {
      return form.valid;
    }

  }
  isShow = false
  showPassword() {
    let doc: any = document.getElementById('password');
    // console.log(doc);
    doc.type = "text";
    this.isShow = true;
  }
  hidePassword() {
    let doc: any = document.getElementById('password');
    // console.log(doc);
    doc.type = "password";
    this.isShow = false;
  }

  navgetToUrl(id: any) {
    this.router.navigateByUrl(id);
  }

  Breakpoints = Breakpoints;
  currentBreakpoint: string = '';
  isMobile = false;
  private breakpointChanged() {
    if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.currentBreakpoint = Breakpoints.Large;
      // console.log(this.currentBreakpoint);
      this.isMobile = false;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.currentBreakpoint = Breakpoints.Medium;
      // console.log(this.currentBreakpoint);
      this.isMobile = false;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.currentBreakpoint = Breakpoints.Small;
      // console.log(this.currentBreakpoint);
      this.isMobile = false;
    } else if (this.breakpointObserver.isMatched('(min-width: 500px)')) {
      this.currentBreakpoint = '(min-width: 500px)';
      // console.log(this.currentBreakpoint);
      this.isMobile = true;
    } else {
      this.isMobile = true;
    }
    console.log(this.isMobile);

  }
}
