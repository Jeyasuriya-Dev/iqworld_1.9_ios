import { Component, Injectable, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ClientService } from '../../services/client.service';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { OtpVerificationComponent } from '../otp-verification/otp-verification.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../services/storage.service';
import { LoaderComponent } from '../../loader/loader.component';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-device-activate-btn',
  templateUrl: './device-activate-btn.component.html',
  styleUrls: ['./device-activate-btn.component.scss']
})
export class DeviceActivateBtnComponent implements OnInit, ICellRendererAngularComp {
  isactive: any;
  device: any;
  userRole: any;
  selectedVersion: any = 1;
  customer: any;
  constructor(private clientService: ClientService, private matDialog: MatDialog, private storageService: StorageService) { }
  agInit(params: ICellRendererParams<any, any, any>): void {
    // console.log(params.data);
    this.device = params.data;
    this.isactive = params.data.isactive;
    this.clientUsername = params.data.clientname;
    this.selectedVersion = params.data?.versionMaster?.id;

    this.clientService.getClientByUsername(params.data.clientname).subscribe((res: any) => {
      // console.log(res);
      this.customer = res;
      // console.log(this.customer.versionMaster.id);
      this.clientService.getCustomerVersion().subscribe((res: any) => {
        // console.log(res);
        res.forEach((element: any) => {
          // console.log(element);
          if (!this.versionList.hasOwnProperty(element.id)) {
            // console.log(element.id <= this.customer.versionMaster.id);
            if (element.id == this.customer?.versionMaster?.id) {
              this.versionList[element.id] = element.version;
            }
          }
        })
      })
    });
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }
  versionList: any = {}
  clientUsername: any;
  ngOnInit(): void {
    let user = this.storageService.getUser();
    // console.log(user);
    this.userRole = user.roles[0];
    


  }


  activate(data: any) {
    let btn!: string;
    // console.log(data);
    // console.log(this.versionList);

    if (data == "true") {
      btn = "activate";
      Swal.fire({
        title: 'Are you sure?',
        text: "Do You Want " + btn + " " + this.device.username + " !",
        icon: 'warning',
        input: 'select',
        inputOptions: this.versionList,
        inputPlaceholder: 'choose Customer version',
        inputValue: this.selectedVersion,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + btn + '!'
      }).then((result) => {
        if (result.isConfirmed) {
          // this.verifyOtp(btn);
          if (this.userRole == "ROLE_ADMIN") {
            this.conformation(this.device.clientname, this.device.username, data, result.value)
          } else {
            let loader = this.matDialog.open(LoaderComponent, {
              panelClass: 'loader-upload'
            })
            this.clientService.sendOtpForDeviceActivation(this.device.clientname, this.userRole).subscribe(res => {
              // console.log(res);
              loader.close()
              this.verifyOtp(data)

            })
          }


        }
      })
    } else {
      btn = "deactivate";
      Swal.fire({
        title: 'Are you sure?',
        text: "Do You Want " + btn + " " + this.device.username + " !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + btn + '!'
      }).then((result) => {
        if (result.isConfirmed) {
          // this.verifyOtp(btn);
          if (this.userRole == "ROLE_ADMIN") {
            this.conformation(this.device.clientname, this.device.username, data, this.selectedVersion)
          } else {
            let loader = this.matDialog.open(LoaderComponent, {
              panelClass: 'loader-upload'
            })
            this.clientService.sendOtpForDeviceActivation(this.device.clientname, this.userRole).subscribe(res => {
              // console.log(res);
              loader.close()
              this.verifyOtp(data)

            })
          }


        }
      })
    }



  }
  verifyOtp(data: any,) {
    let Dailog = this.matDialog.open(OtpVerificationComponent, {
      disableClose: true,
      data: { scope: data, clientname: this.device.clientname, versionId: this.selectedVersion, username: this.device.username }
    });
    Dailog.afterClosed().subscribe((result: any) => {
      if (result) {
        // console.log("Result is TRUE!");
      }
    });
  }

  conformation(clientname: any, username: any, data: any, version: any) {
    // console.log(data);
    // console.log(this.device);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    this.clientService.activateDevice(clientname, username, data, version).subscribe((res: any) => {
      Swal.fire(
        'Activated!',
        res.message,
        'success'
      )
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, err => {
      // console.log(err);
      loader.close()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message,
        // footer: '<a href="">Why do I have this issue?</a>'
      })
    })

  }
}
