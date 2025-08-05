import { round } from '@amcharts/amcharts4/.internal/core/utils/Math';
import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {

  onClick(fdata: any) {

  }


  date = new Date().toLocaleString();
  dueDate = new Date().toDateString();
  allnode: any = 0;
  online: any = 0;
  deactive: any = 0;
  active: any = 0;
  offline: any = 0;
  storage: any = 70;
  totalspace: any = "2GB";
  usedspace: any = "0MB";
  clientname: any
  gridApi: any;

  constructor(private clientService: ClientService, private storageService: StorageService) { }

  ngOnInit(): void {
    // this.start();
    let username1 = this.storageService.getUser();
    // console.log(username1.roles[0]);
    if (username1.roles[0] == 'ROLE_CLIENT') {
      this.clientname = this.storageService.getUser();
    }
    else if (username1.roles[0] == 'ROLE_ADMIN') {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
      // console.log(json_object);
      // console.log("clientname");
    }
    else {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
    }

    // console.log(this.clientname);
    this.clientService.getDeviceStatusByClient(this.clientname.username).subscribe((res: any) => {
      // console.log(res);
      this.allnode = res.total;
      this.online = res.online;
      this.deactive = res.deactive;
      this.active = res.active;
      this.offline = res.offline;

    })
    this.clientService.getStorageDetailsByClient(this.clientname.username).subscribe((res: any) => {
      // console.log(res);
      this.storage = percentage(res.totalspace, res.usedspace);
      this.totalspace = res.totalspace;
      this.usedspace = res.usedspace;
    })
    this.getAllDeviceList();
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
    { headerName: 'Unique Number', field: 'username' },
    // { headerName: 'Password', field: 'password' },

    {
      headerName: 'City', field: 'cityname', valueGetter: (params: any) => {

        if (params.data.city) {
          return params.data.city.cityname;
        } else {
          return "No City";
        }
      }
    },
    {
      headerName: 'State', field: 'statename', valueGetter: (params: any) => {

        if (params.data.state) {

          return params.data.state.statename;
        } else {
          return "No State";
        }
      }
    },
    // { headerName: 'Pincode', field: 'pincode' },
    // { headerName: 'Mobile', field: 'mobile' },
    { headerName: 'Android Id', field: 'androidId' },
    { headerName: "Height/Width", field: "height_width" },
    { headerName: 'Creationdate', field: 'creationdate' },
    { headerName: 'Updationdate', field: 'updateddate' },
    { headerName: 'Alive Status', field: 'isactive' },
    // { headerName: 'isDeleted', field: 'isdelete' }
  ];

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    pagination: true,
  }
  rowData = []
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.clientService.getdeviceListbyclientusername(this.clientname.username).subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      this.gridApi.setRowData(res);
    });
    // this.clientService.getAllDevicesList().subscribe((data) => {
    //   this.gridApi.setRowData(data);
    // });
  }

  getAllDeviceList() {
    this.clientService.getdeviceListbyclientusername(this.clientname.username).subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      // this.gridApi.setRowData(res);
    });
    // this.clientService.getAllDevicesList().subscribe((res: any) => {
    //   console.log(res);
    //   this.rowData = res;
    // })

    // this.userService.getDeviceByAdroidId().subscribe((res: any) => {
    //   console.log(res);
    //   // this.rowData = res;
    // })
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  intervalId = 0;
  message = '';
  seconds = 60;

  clearTimer() {
    clearInterval(this.intervalId);
  }
  ngOnDestroy() {
    this.clearTimer();
  }

  start() {
    this.countDown();
  }
  stop() {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;

      if (this.seconds < 0) {
        this.seconds = 60;
      } // reset
      this.message = `${this.seconds}s`;
      if (this.seconds === 0) {
        window.location.reload();
        // this.ngOnInit();
      }
    }, 1000);
  }
}
function percentage(totalspace: any, usedspace: any) {


  // console.log(totalspace.substring(0,totalspace.length-2));

  // console.log(totalspace);
  // console.log(usedspace.slice(-2));
  let space;
  if (usedspace.slice(-2) == "KB") {
    space = usedspace.substring(0, usedspace.length - 2)
  } else if (usedspace.slice(-2) == "MB") {
    space = usedspace.substring(0, usedspace.length - 2) * 1000
  }
  else if (usedspace.slice(-2) == "GB") {
    space = usedspace.substring(0, usedspace.length - 2) * 1000 * 1000
  }
  // console.log(totalspace.substring(0, totalspace.length - 2));

  const total = totalspace.substring(0, totalspace.length - 2) * 1000 * 1000;
  const used = space;
  // console.log(total);
  // console.log(used);



  const percentage = round((used / total) * 100);
  return percentage;
}