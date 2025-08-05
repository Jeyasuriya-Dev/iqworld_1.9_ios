
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_core/services/storage.service';
import { ClientService } from '../_core/services/client.service';
import { LoaderComponent } from '../_core/loader/loader.component';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';


var OTP: any;
@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],



})
export class ForgetPassComponent implements OnInit {
  clientname: any;
  submitted = false;
  expiry: any
  restpass: UntypedFormGroup = new UntypedFormGroup({
    clientname: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    code: new UntypedFormControl(''),
    confirmpassword: new UntypedFormControl('')
  });
  constructor(private formBuilder: UntypedFormBuilder, private alertService: AlertService, private router: Router, private activatedRoute: ActivatedRoute, private clientService: ClientService, private matDialog: MatDialog) {
    this.clientname = this.activatedRoute.snapshot.paramMap.get('username');
    this.expiry = this.activatedRoute.snapshot.paramMap.get('expiry');
    if (this.expiry) {
      clientService.checkRegistrationFormStatusByCode(this.expiry).subscribe((res: any) => {
        // console.log(res);
        if (res?.isexpired) {
          router.navigate(['/expired'])
        }
      }, err => {
        router.navigate(['/expired'])
      })
    }


  }
  ngOnInit(): void {
    let newpassword: any = document.getElementById('newpassword');
    let form: any = document.querySelector('.username');
    if (this.clientname) {
      newpassword.style.display = 'block';
      form.style.display = 'none'
    } else {
      newpassword.style.display = 'none';
      form.style.display = 'block'
      // verifyOtp();
    }
    this.restpass = this.formBuilder.group({
      clientname: [this.clientname],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
      code: [this.expiry],
      confirmpassword: [
        '',
        [
          Validators.required,
          // Validators.minLength(6),
          // Validators.maxLength(10),
        ],
      ]
    }, {
      validator: this.ConfirmedValidator('password', 'confirmpassword'),
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.restpass.controls;
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl?.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  email:any;
 
  sendResetOtp(data: any) {
    // console.log(data.value);
    this.clientname = data.value;
    let emailEle: any = document.querySelector('.email');
    let form: any = document.querySelector('.username');
    let verfEle: any = document.querySelector('.verification');
    let successEle: any = document.querySelector('.success');
    let errorEle: any = document.querySelector('.error');
    let emailpartialEle: any = document.querySelector('.emailpartial');
    if (data.value && data.value.includes('@')) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      this.clientService.sendForgotRequest(data.value).subscribe((res: any) => {
        // console.log(res);
        loader.close();
        this.email = "****" + data.value.substring(4);
        // loader.close();
        errorEle.style.display = 'none';
        if (res.message === "success") {
          verfEle.style.display = 'block';
          form.style.display = 'none';
          // emailpartialEle.value = "***" + res.email.slice(3);
          // emailpartialEle.innerHTML = "***" + res.email.slice(3);
          // emailEle.value = ''
        } else {
          errorEle.style.display = 'block';
          errorEle.innerHTML = "Email not exist";
          successEle.style.display = 'none';

        }
      }, err => {
        // console.log(err);
        errorEle.style.display = 'block';
        errorEle.innerHTML = "Email not exist";
        successEle.style.display = 'none';
        loader.close();
      })
    } else {
      errorEle.style.display = 'block';
      if (data.value.includes('@')) {
        errorEle.innerHTML = "Email not exist";
      } else {
        errorEle.innerHTML = "Enter Valid Email ID";
      }
      successEle.style.display = 'none';
    }


  }

  confirmOtp() {
    let newpassword: any = document.getElementById('newpassword');
    let verfEle: any = document.querySelector('.verification');
    let successEle: any = document.querySelector('.success');
    let errorEle: any = document.querySelector('.error');
    // console.log(OTP);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.verifyOtp(OTP, this.clientname).subscribe((res: any) => {
      OTP = ""
      loader.close();
      if (res.message == "Verification Completed Successfully") {
        verfEle.style.display = 'none';
        successEle.style.display = 'block';
        errorEle.style.display = 'none';
        newpassword.style.display = 'block';

      } else {
        errorEle.style.display = 'block';
        errorEle.innerHTML = "Invalid OTP";
        successEle.style.display = 'none';

      }

    }, err => {
      // console.log(err);
      errorEle.style.display = 'block';
      errorEle.innerHTML = "Invalid OTP";
      successEle.style.display = 'none';
      loader.close();
    })
  }
  onSubmit() {
    this.submitted = true;
    // console.log(this.restpass.value);
    // console.log(this.clientname);
    if (this.restpass.invalid || this.restpass.value.password != this.restpass.value.confirmpassword) {
      return;
    }
    this.clientService.changePasswordByUsername(this.clientname, this.restpass.value.password, this.expiry).subscribe((res: any) => {
      // console.log(res);
      this.router.navigateByUrl("/").then(() => {
        this.alertService.showSuccess(res.message);
      });
    });
  }
  ispassConfirmed: any;
  passConfirm() {
    if (this.restpass.value.password != this.restpass.value.confirmpassword) {
      this.ispassConfirmed = false;
    } else {
      this.ispassConfirmed = true;
    }
  }
}

function verifyOtp() {
  let otp_inputs: any = document.querySelectorAll('.otp_num');
  otp_inputs.forEach(
    (ip: any) => {
      ip.addEventListener('keyup', moveNext)
    }
  )
  otp_inputs[0].addEventListener("paste", function (event: any) {
    event.preventDefault();

    const pastedValue = (event.clipboardData || window.Clipboard).getData(
      "text"
    );
    // console.log(pastedValue);
    const otpLength = otp_inputs.length;

    for (let i = 0; i < otpLength; i++) {
      if (i < pastedValue.length) {
        otp_inputs[i].value = pastedValue[i];
        otp_inputs[i].removeAttribute("disabled");
        otp_inputs[i].focus;
      } else {
        otp_inputs[i].value = ""; // Clear any remaining inputs
        otp_inputs[i].focus;
      }
    }
  });

}
function moveNext(event: any) {
  // otp_num_4
  let otp_inputs: any = document.querySelectorAll('.otp_num');
  let otp_check = '';
  let current = event.target;
  let index = current.classList[1].slice(-1);
  if (event.keyCode == 8 && index > 1) {
    current.previousElementSibling.focus()
  }
  else if (index < 4) {
    current.nextElementSibling.focus()

  }
  otp_check = '';
  for (let ip of otp_inputs) {
    otp_check += ip.value
  }
  if (otp_check.length == 4) {
    // verifyOTP()
    // console.log(otp_check);
    OTP = otp_check;
  }

}
function password(control: UntypedFormControl): any {
  // console.log(control.parent?.value.password);
  console.log(control.value.password);
  // let formGroup: any = control.parent?.value;
  let password = control?.value?.password;
  let confirmPassword = control?.value?.confirmpassword
  console.log(password);
  console.log(confirmPassword);
  return password === confirmPassword ? { password: true } : null;
}