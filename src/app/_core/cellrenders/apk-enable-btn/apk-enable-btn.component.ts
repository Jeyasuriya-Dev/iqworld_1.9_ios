import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ClientService } from '../../services/client.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-apk-enable-btn',
  templateUrl: './apk-enable-btn.component.html',
  styleUrls: ['./apk-enable-btn.component.scss']
})
export class ApkEnableBtnComponent implements OnInit, ICellRendererAngularComp {
  isChecked: any = false;
  ota: any
  dev: any
  constructor(private clientService: ClientService, private alertService: AlertService, private storageService: StorageService) { }
  agInit(params: ICellRendererParams): void {
    // console.log(params.data);
    this.ota = params.data;

  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

  ngOnInit(): void {
    this.dev = this.storageService.getDev();
    if (this.ota.isactive) {

      this.isChecked = this.ota.isactive
    } else {
      this.isChecked = false;
    }
  }
  enableOta(ota: any) {
    // console.log(ota.checked);
    this.isChecked = ota.checked

    this.clientService.updateOtaStatus(this.ota.id, ota.checked).subscribe((res: any) => {
      // console.log(res.message);
      this.alertService.showSuccess(res.message);
      window.location.reload();
    })
  }

  downloadApk() {
    // this.ota.path();
    // console.log(this.ota.path);
    download(this.ota.path, this.ota.apk)

  }
}

function download(dataurl: any, filename: any) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}