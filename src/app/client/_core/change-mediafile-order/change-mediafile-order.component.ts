import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose } from '@angular/material/dialog';
import { CompactType, DisplayGrid, GridType, GridsterConfig, GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-change-mediafile-order',
  templateUrl: './change-mediafile-order.component.html',
  styleUrls: ['./change-mediafile-order.component.scss']
})
export class ChangeMediafileOrderComponent implements OnInit {
  dashboard!: Array<GridsterItem> | any;
  type: any = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private clientService: ClientService, private alertService: AlertService, private matDialog: MatDialog) {
    this.type = data?.type;
    console.log(data);

    // if (data?.type == 'split') {
    if (this.type == 'zone') {
      this.dashboard = data.files.medialist;
    } else {
      this.dashboard = data.files;
      // console.log(data.files);
    }

    // }
  }

  ngOnInit() {
  }

  saveSplitScreen() {
    console.log(this.dashboard);
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    if (this.type == 'split') {
      this.clientService.editLayoutOrder(this.dashboard).subscribe((res: any) => {
        // console.log(res);
        this.alertService.showSuccess(res?.message);
        // this.mat._matDialogClose();
        this.matDialog.closeAll();
      }, err => {
        this.alertService.showError(err?.error?.message);
        this.matDialog.closeAll();
      })
    } else if (this.type == 'zone') {
      this.matDialog.closeAll();
    } else {
      this.clientService.editMediaFilesOrder(this.dashboard).subscribe((res: any) => {
        // console.log(res);
        this.alertService.showSuccess(res?.message);
        // this.mat._matDialogClose();
        this.matDialog.closeAll();
      }, err => {
        this.alertService.showError(err?.error?.message);
        this.matDialog.closeAll();
      })
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dashboard, event.previousIndex, event.currentIndex);

    // Get the current indices of all items after the drop
    const currentIndices = this.dashboard.map((item: any, index: any) => ({
      item,
      currentIndex: index
    }));
    // Log the current indices to the console

    // console.log('Current indices after drop:', currentIndices);
    currentIndices.forEach((e: any) => {
      this.dashboard.forEach((d: any) => {
        if (e.item == d) {
          d.order_id = e.currentIndex;
        }
      })
    })
  }
  closeMatDailog() {
    this.matDialog.closeAll();
  }
}
