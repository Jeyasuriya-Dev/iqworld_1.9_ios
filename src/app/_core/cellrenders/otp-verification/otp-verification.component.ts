import { Component, Inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MediaUploadComponent } from 'src/app/client/_features/media-upload/media-upload.component';
import { AlertService } from '../../services/alert.service';
import { DeviceActivateBtnComponent } from '../device-activate-btn/device-activate-btn.component';
import { StorageService } from '../../services/storage.service';
import { LoaderComponent } from '../../loader/loader.component';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
  OTP: any = '';
  mediatype: any;
  fd: any;
  clientname: any;
  scope: any;
  client: any;;
  username: any;
  selectedVersion = 1;
  email: any;
  isReloaded: any = false;
  playlist: any;
  isProVertical: any;
  layout: any;
  layoutList: any = [];
  isNeedVerification: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private clientService: ClientService, private storageService: StorageService, private deviceActivateBtnComponent: DeviceActivateBtnComponent, private matDialog: MatDialog, private mediaUploadComponent: MediaUploadComponent, private alert: AlertService) {
    if (data?.type && data?.fd) {
      this.mediatype = data.type;
      this.fd = data.fd;
    } else {
      this.scope = data.scope
    }
    if (data?.playlist) {
      this.playlist = data.playlist;
    }
    if (data?.isProVertical) {
      this.isProVertical = data.isProVertical
    }
    if (data?.layout) {
      this.layout = data.layout;
    }
    if (data?.layoutList && data?.isNeedVerification) {
      this.layoutList = data?.layoutList;
      this.isNeedVerification = data?.isNeedVerification;
    }
    this.clientname = data.clientname;
    this.username = data.username;
    this.selectedVersion = data.versionId;
    this.clientService.getClientByUsername(this.clientname).subscribe((res: any) => {
      // console.log(res);
      this.client = res;
      this.email = "****" + res.email.substring(4);
    })
  }

  ngOnInit(): void {
    verify();
  }
  close() {
    this.matDialog.closeAll();
  }
  confirmOtpForDeviceActivation() {
    const inputs: any = document.querySelectorAll(".otp-field > input");
    // console.log(inputs);
    let otp;
    inputs.forEach((e: any) => {
      // console.log(e.value);
      otp = e.value
      this.OTP = this.OTP + otp;
    })
    // console.log(this.OTP);
    this.clientService.verifyOtp(this.OTP, this.clientname).subscribe((res: any) => {
      this.matDialog.closeAll();
      if (res.message == "Verification Completed Successfully") {
        // this.alert.showSuccess(res.message);
        this.deviceActivateBtnComponent.conformation(this.clientname, this.username, this.scope, this.selectedVersion)
      } else {
        this.alert.showError(res.message);
      }
    }, err => {
      this.OTP = '';
      const inputs: any = document.querySelectorAll(".otp-field > input");
      inputs.forEach((e: any, index: any) => {
        e.value = '';
        if (index != 0) {
          e.disabled = true
        }
      })
    })
  }
  resendOtp() {
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    });
    this.clientService.sendOtp(this.clientname).subscribe((res: any) => {
      loader.close();
      this.OTP = '';
      const inputs: any = document.querySelectorAll(".otp-field > input");
      inputs.forEach((e: any, index: any) => {
        e.value = '';
        if (index != 0) {
          e.disabled = true
        }
      })
      // this.alert.showSuccess(res.message);
      verify();
    }, err => {
      loader.close();
      this.alert.showError(err?.error?.message);
    })
  }
  confirmOtp() {
    const inputs: any = document.querySelectorAll(".otp-field > input");
    // console.log(inputs);
    let otp;
    inputs.forEach((e: any) => {
      console.log(e.value);
      otp = e.value
      this.OTP = this.OTP + otp;
    })
    this.isReloaded = sessionStorage.getItem('reloadIndex');
    // console.log(this.isReloaded);
    if (this.isReloaded == 2 && !this.isNeedVerification) {
      let clientname = this.storageService.getClientUsername();
      this.clientService.verifyOtp(this.OTP, clientname).subscribe((res: any) => {
        if (res.message == "Verification Completed Successfully") {
          this.matDialog.closeAll();
          // this.alert.showSuccess(res.message);
          if (this.layout) {
            this.mediaUploadComponent.conformEdit(true, this.playlist, this.isProVertical, this.layout);
          } else {
            this.mediaUploadComponent.createSplitScreen(true, this.playlist, this.isProVertical);
          }
        } else {
          this.OTP = '';
          const inputs: any = document.querySelectorAll(".otp-field > input");
          inputs.forEach((e: any, index: any) => {
            e.value = '';
            if (index != 0) {
              e.disabled = true
            }
          })
          this.alert.showError(res.message);
        }
      }, err => {
        // loader.close();
        this.OTP = '';
        const inputs: any = document.querySelectorAll(".otp-field > input");
        inputs.forEach((e: any, index: any) => {
          e.value = '';
          if (index != 0) {
            e.disabled = true
          }
        })
        this.alert.showError(err?.error?.message);
      })
    } else if (this.isNeedVerification && this.layoutList.length != 0) {
      this.clientService.verifyOtp(this.OTP, this.clientname).subscribe((res: any) => {
        if (res.message == "Verification Completed Successfully") {
          this.matDialog.closeAll();
          // this.alert.showSuccess(res.message);
          sessionStorage.setItem("loaded", 'true');
          sessionStorage.setItem("isProVertical", this.isProVertical);
          this.mediaUploadComponent.activateLayout(this.layoutList, this.playlist?.id, this.isProVertical);
        } else {
          this.OTP = '';
          const inputs: any = document.querySelectorAll(".otp-field > input");
          inputs.forEach((e: any, index: any) => {
            e.value = '';
            if (index != 0) {
              e.disabled = true
            }
          })
          this.alert.showError(res.message);
        }
      }, err => {
        // loader.close();
        this.OTP = '';
        const inputs: any = document.querySelectorAll(".otp-field > input");
        inputs.forEach((e: any, index: any) => {
          e.value = '';
          if (index != 0) {
            e.disabled = true
          }
        })
        this.alert.showError(err?.error?.message);
      })
    }
    else {
      this.clientService.verifyOtp(this.OTP, this.clientname).subscribe((res: any) => {
        this.matDialog.closeAll();
        if (res.message == "Verification Completed Successfully") {
          // this.alert.showSuccess(res.message);
          if (this.username) {
            this.deviceActivateBtnComponent.conformation(this.clientname, this.username, this.scope, this.selectedVersion)
          } else {
            this.mediaUploadComponent.closeDailog('true', this.mediatype, this.fd);
          }
        } else {
          this.OTP = '';
          const inputs: any = document.querySelectorAll(".otp-field > input");
          inputs.forEach((e: any, index: any) => {
            e.value = '';
            if (index != 0) {
              e.disabled = true
            }
          })
          this.alert.showError(res.message);
        }
      }, err => {
        // loader.close();
        this.OTP = '';
        const inputs: any = document.querySelectorAll(".otp-field > input");
        inputs.forEach((e: any, index: any) => {
          e.value = '';
          if (index != 0) {
            e.disabled = true
          }
        })
        this.alert.showError(err?.error?.message);
      })
    }

  }

  // confirmOtpForSplit() {
  //   const inputs: any = document.querySelectorAll(".otp-field > input");
  //   // console.log(inputs);
  //   let otp;
  //   inputs.forEach((e: any) => {
  //     // console.log(e.value);
  //     otp = e.value
  //     this.OTP = this.OTP + otp;
  //   })
  //   // console.log(this.OTP);

  // }
}
function verify() {
  const inputs: any = document.querySelectorAll(".otp-field > input");
  // const button: any = document.querySelector(".btn");

  // window.addEventListener("load", () => inputs[0].focus());
  // button.setAttribute("disabled", "disabled");

  inputs[0].addEventListener("paste", function (event: any) {
    event.preventDefault();

    const pastedValue = (event.clipboardData || window.Clipboard).getData(
      "text"
    );
    // console.log(pastedValue);
    const otpLength = inputs.length;

    for (let i = 0; i < otpLength; i++) {
      if (i < pastedValue.length) {
        inputs[i].value = pastedValue[i];
        inputs[i].removeAttribute("disabled");
        inputs[i].focus;
      } else {
        inputs[i].value = ""; // Clear any remaining inputs
        inputs[i].focus;
      }
    }
  });

  inputs.forEach((input: any, index1: any) => {
    input.addEventListener("keyup", (e: any) => {
      const currentInput = input;
      const nextInput = input.nextElementSibling;
      const prevInput = input.previousElementSibling;

      if (currentInput.value.length > 1) {
        currentInput.value = "";
        return;
      }

      if (
        nextInput &&
        nextInput.hasAttribute("disabled") &&
        currentInput.value !== ""
      ) {
        nextInput.removeAttribute("disabled");
        nextInput.focus();
      }

      if (e.key === "Backspace") {
        inputs.forEach((input: any, index2: any) => {
          if (index1 <= index2 && prevInput) {
            input.setAttribute("disabled", true);
            input.value = "";
            prevInput.focus();
          }
        });
      }

      // button.classList.remove("active");
      // button.setAttribute("disabled", "disabled");

      // const inputsNo = inputs.length;
      // if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
      //   button.classList.add("active");
      //   button.removeAttribute("disabled");

      //   return;
      // }
    });
    // console.log(inputs);
  });

}