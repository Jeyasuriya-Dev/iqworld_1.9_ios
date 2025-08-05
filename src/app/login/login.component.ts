import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_core/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../_core/services/storage.service';
import { AlertService } from '../_core/services/alert.service';
import { clienturl } from '../api-base';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../_core/loader/loader.component';
const CURRENT_VERSION = clienturl.CURRENT_VERSION();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signInForm!: UntypedFormGroup
  roles: any;
  CURRENT_VERSION = CURRENT_VERSION;
  passLength = false;
  constructor(private fb: UntypedFormBuilder, private alertToaster: AlertService, private authService: AuthService, private router: Router, private tokenStorage: StorageService, private matDialog: MatDialog) { 
    
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

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
    if (form.valid) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      this.authService.login(form.value).subscribe(res => {
        // console.log(res);
        // console.log(res.roles.includes('ROLE_ADMIN'));
        // console.log(res.roles.includes('ROLE_CLIENT'));

        if (res.roles.includes('ROLE_ADMIN') || res.roles.includes('ROLE_CLIENT') || res.roles.includes('ROLE_DISTRIBUTOR')) {

          this.alertToaster.showSuccess("You Have Successfully Logged In")

          // alert(res)
          this.tokenStorage.saveToken(res.accessToken);
          this.tokenStorage.saveUser(res);
          this.tokenStorage.saveLoggerName(res.username);
          this.tokenStorage.saveLoggerPass(form.value.password);
          this.roles = this.tokenStorage.getUser().roles;
          const user = this.tokenStorage.getUser();
          this.roles = user.roles;
          // console.log(this.roles);

          let isAdmin = this.roles.includes('ROLE_ADMIN');
          let isClient = this.roles.includes('ROLE_CLIENT');
          let isUser = this.roles.includes('ROLE_USER');
          let isDistrubutor = this.roles.includes('ROLE_DISTRIBUTOR');
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
              window.location.reload();
            });
          } else if (isClient) {
            this.router.navigate(['client/client-dashboard']).then(() => {
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'success',
              //   title: 'You are successfully logged in',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              window.location.reload();
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
          }
          else {
            this.alertToaster.showInfo("Sorry, User Not Allowed!!");
          }

        } else {
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
}
