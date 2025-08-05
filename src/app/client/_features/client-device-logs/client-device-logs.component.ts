import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ColDef } from 'ag-grid-community';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { ExportService } from 'src/app/_core/services/export.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-client-device-logs',
  templateUrl: './client-device-logs.component.html',
  styleUrls: ['./client-device-logs.component.scss']
})
export class ClientDeviceLogsComponent implements OnInit {
  gridApi: any;
  rowData: any=[];
  rowDatafilter:any=[]
  clientname: any;
  client: any;
  deviceList: any = [];
  fromdate: any = "null";
  todate: any = "null";
  selectedClientname: any = "null";
  deviceusername: any = "null";
  maxDate = new Date();
  filterDeviceList: any = this.deviceList.slice();
  isMobile=false;
  constructor(private clientService: ClientService, private exportService: ExportService, private excelService: ExcelService, private observer:BreakpointObserver,private storage: StorageService) { }

  ngOnInit(): void {
    let username1 = this.storage.getUser();
    // console.log(username1);

    if (username1.roles[0] == 'ROLE_CLIENT') {
      this.clientname = this.storage.getUser();
    }
    else if (username1.roles[0] == 'ROLE_ADMIN') {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
    }
    else {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
    }

    this.onChooseClient(this.clientname);
    this.clientService.getClientByUsername(this.clientname.username).subscribe((res: any) => {
      this.client = res;
    })
    // this.filterLog();
    this.filterDeviceLog();

    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      const sidebar = document.querySelector(".sidebar");
      if (res.matches) {
        this.isMobile = true;

      } else {
        this.isMobile = false;

      }
    });
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    // this.getAllDeviceList();
    // this.getAllDeviceModel();
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, cellClass: 'locked-col', width: 100 },
    {
      headerName: 'Unique Number', field: 'username',

    }, { headerName: 'Client Name', field: 'clientname' },
    {
      headerName: 'Model-name',
      field: 'modelname',
    },

    {
      headerName: "Orientation", field: "height_width", valueGetter: (params: any) => {
        // console.log(params.data.height_width);
        let v = params.data.height_width
        v = v.substring(2);
        // console.log(v);

        if (params.data.height_width) {
          if (v == 16) {
            return 'Vertical';
          } else {
            return 'Horizental';
          }
        } else {
          return "UnDefined";
        }
      }
    }, { headerName: 'Screen Time (Hr:Min:Sec)', field: 'timeperiod' },
    { headerName: 'loged in', field: 'logindate' },
    { headerName: 'loged Out', field: 'logoutdate' }
    // { headerName: 'isDeleted', field: 'isdelete' }
  ];
  onChooseClient(event: any) {
    // console.log(event);
    this.selectedClientname = event?.username;
    this.deviceusername = "null"
    this.clientService.getdeviceListbyclientusername(event.username).subscribe(res => {
      // console.log(res);
      this.deviceList = res;
      this.filterDeviceList = res;
    })
    this.filterDeviceLog();
    // this.filterLog();
  }
  onChooseDevice(device: any) {
    // console.log(device);
    this.deviceusername = device?.username;
    // this.filterLog();
    this.filterDeviceLog();
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 180,
      floatingFilter: true
    },
    paginationPageSize: 12,
    pagination: true,

  }
  exportAsExcelFile() {
    const title = 'Device Logs Information ';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'clientname': obj?.clientname,
        'Unique': obj?.username,
        "modelname": obj.modelname,
        "Orientation": obj.height_width == "9:16" ? "vertical" : "horizontal",
        "timeperiod": obj?.timeperiod,
        'logindate': obj?.logindate,
        'logoutdate': obj?.logoutdate,

      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "15", c: "15", d: "15", e: "15", f: "35", g: "35" }
    let titleMerge = "'B1':'F4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'G1':'G4'";
    let reportData = {
      title: title,
      data: data,
      headers: Object.keys(data[0]),
      cellSize: cellSize,
      titleMerge: titleMerge,
      imgMerge: imgMerge,
      dateMerge: dateMerge
    };

    this.excelService.exportExcel(reportData);
  }
  exportPdf() {
    // console.log(this.selectedActive);
    let address;
    if (this.clientname) {
      address = "\n" + this.client.location.area + ",\n" + this.client.city.cityname + ",\n" + this.client.district.name + ",\n" + this.client.state.statename + "-" + this.client?.zipcode + ",\n" + this.client?.country?.countryname + "."
    } else {
      address = ` \nYash Electronics,
      Babosa Industrial Park, BLDG.NO-A4,
      1 st Floor Unit No-100-108 Saravali village,
      Near Vatika Hotel, Nashik Highway(NH-3),
      Bhiwandi – 4121302.`
    }
    let filterList: any = {

      fromdate: this.fromdate,
      todate: this.todate
    }

    const title = 'Device Logs Info';

    let dataFields = [
      "clientname",
      "Unique",
      "modelname",
      "Orientation",
      "Screen Time",
      "Log in",
      "Log Out",
    ];
    let field: any = ['clientname',
      'Unique',
      "modelname",
      "Orientation",
      "timeperiod",
      'logindate',
      'logoutdate'];

    let data1: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'clientname': obj?.clientname,
        'Unique': obj?.username,
        "modelname": obj.modelname,
        "Orientation": obj.height_width == "9:16" ? "vertical" : "horizontal",
        "timeperiod": obj?.timeperiod,
        'logindate': obj?.logindate,
        'logoutdate': obj?.logoutdate,

      }
      data1.push(g)
    }
    let column_width = ['5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%',]
    let data = {
      action: "download",
      fdate: this.fromdate,
      tdate: this.todate,
      column_width: column_width,
      history: data1,
      reportname: title,
      columns: dataFields,
      columnsdataFields: field,
      filterList: filterList,
      address: address
    }
    this.exportService.generateDeviceLogsPDF(data);
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  getFromDate(event: any) {
    // console.log(event.value);
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date

  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    // console.log(this.fromdate + "---" + this.todate);
    this.filterDeviceLog();
  }
  @ViewChild('selectDevice') selectDevice!: MatSelect;
  allSelectedDeviceList: any = [];
  selecetedDevice: any;
  allSelectedDevice = false;
  toggleAllSelectionForDevice() {
    if (this.allSelectedDevice) {
      this.selectDevice.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDevice.options.forEach((item: MatOption) => item.deselect());

    }
    this.filterDeviceLog();
  }


  onChooseDevice1(device: any) {
    // console.log(device);
    let newStatus = true;
    this.selectDevice.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedDevice = newStatus;
    this.selecetedDevice = device;
    // this.deviceusername = device?.username;
    this.filterDeviceLog();
  }
  // filterLog() {
  //   this.clientService.filterLog(this.selectedClientname, this.deviceusername, this.fromdate, this.todate).subscribe(res => {
  //     this.rowData = res;
  //   })
  // }

  filterDeviceLog() {
    let payload = {
      "clientname": [this.selectedClientname],
      "device_username": this.allSelectedDeviceList,
      distributorlist: [],
      "fromdate": this.fromdate,
      "todate": this.todate
    }
    this.clientService.filterDeviceLog(payload).subscribe(res => {
      this.rowData = res;
      this.rowDatafilter=res;
    })
  }

  filterDevices(searchText: string): void {
    this.filterDeviceList = this.deviceList.filter((state: any) =>
      this.isSelectedDevice(state.username) || state.username.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedDevice(stateId: any): boolean {
    return this.allSelectedDeviceList.some((selectedId: any) => selectedId === stateId);
  }


  filterRowData(searchText: any) {
    this.rowData = this.rowDatafilter.filter((obj: any) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
          }
          if (typeof value === 'object' && value !== null) {
            if (this.objectIncludesValue(value, searchText)) {
              return true;
            }
          }
          if (key === 'isactive') {
            let v1 = "pending";
            let v2 = "approved";
            if (v1.includes(searchText.toLowerCase())) {
              if (!value) {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (value) {
                return true;
              } else {
                return false;
              }
            }
          }
          if (key === 'height_width') {
            let v1 = "horizontal";
            let v2 = "vertical";
            if (v1.includes(searchText.toLowerCase())) {
              if (value === '16:9') {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (value === '9:16') {
                return true;
              } else {
                return false;
              }
            }
          }
          if (key === 'isonline') {
            let v1 = "online";
            let v2 = "offline";
            if (v1.includes(searchText.toLowerCase())) {
              if (value) {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (!value) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
      return false;
    }
    )
  }

  objectIncludesValue(obj: any, searchText: any) {
    return Object.keys(obj).some(key => {
      const value = obj[key];
      if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
      return false;
    });
  }
}
