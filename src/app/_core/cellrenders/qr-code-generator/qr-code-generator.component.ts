import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { clienturl } from 'src/app/api-base';
import { ClientService } from '../../services/client.service';
import { AlertService } from '../../services/alert.service';
const BASE_API = clienturl.WEB_URL();

declare var QRCode: any;
@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.scss']
})
export class QrCodeGeneratorComponent implements OnInit, ICellRendererAngularComp {
  distributor: any;
  constructor(private matDialog: MatDialog, private clientService: ClientService, private alertService: AlertService) { }
  agInit(params: ICellRendererParams<any, any, any>): void {
    // console.log(params);
    this.distributor = params.data;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }
  generateQrCode() {
    this.generateQRCode();
  }
  copyText() {
    this.isCopied = true;
    this.clientService.getRegistrationFormExpirycode().subscribe((res: any) => {
      console.log(res);
      let val = BASE_API + "/#/newcustomerregistration/" + this.distributor.id + "/" + res?.code;
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      let c = document.execCommand('copy');
      if (c) {
        this.alertService.showSuccess('copied to clipboard')
      } else {
        this.alertService.showError('Try after some Time')
      }
      document.body.removeChild(selBox);
      const myTimeout = setTimeout(() => {
        this.isCopied = false;
        clearTimeout(myTimeout);
      }, 5000);
    }, err => {
      this.alertService.showError(err?.error?.message);
      this.alertService.showError('Please, Try after some Time');
    })

  }

  isCopied = false;
  generateQRCode() {
    if (this.distributor.id) {
      this.clientService.getRegistrationFormExpirycode().subscribe((res: any) => {
        console.log(res);
        const qrCodeCanvas = document.createElement('qrcode') as HTMLCanvasElement;
        let a = new QRCode(qrCodeCanvas, {
          text: BASE_API + "/#/newcustomerregistration/" + this.distributor.id + "/" + res?.code,
          // width: 128,
          // height: 128,
          // colorDark: "#5868bf",
          // colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        // console.log(a._oDrawing)
        // console.log(a._oDrawing._elImage);
        Swal.fire({
          title: "<b style='text-transform: capitalize;' >" + this.distributor.distributor + "</b>",
          html: a._oDrawing._elImage,
        })
      })
    } else {
      console.warn('QR code data is empty.');
    }


  }


}
