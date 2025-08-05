import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-device-analytics',
  templateUrl: './device-analytics.component.html',
  styleUrls: ['./device-analytics.component.scss']
})
export class DeviceAnalyticsComponent implements OnInit {
  public columnDefs: any = [];
  constructor(private clientService: ClientService, private storageService: StorageService) { }
  public paginationPageSize = 5;
  rowData: any;
  clientUsername: any;
  defaultColDef = {
    // flex: 1,
    resizable: true,
    filter: true,
    floatingFilter: true,
    sortable: true,
  };
  tablevalue: any;
  // this.tablevalue = data;
  // this.tablevalue.paginator = this.paginator;
  domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  ngOnInit(): void {
    this.clientUsername = this.storageService.getClientUsername();
    this.clientService.getDeviceDetailsByState(this.clientUsername).subscribe(res => {
      this.tablevalue = res;
    })
    this.columnDefs = [
      { headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', maxWidth: 80, suppressNavigable: true, sortable: false, filter: false },
      { headerName: "STATE", field: 'state_name', },
      { headerName: "ONLINE", field: 'online', },
      { headerName: "OFFLINE", field: 'offline' },
      { headerName: "NOT WORKING", field: 'notWorking' },
      { headerName: "TOTAL", field: 'total', }]
  }
}
