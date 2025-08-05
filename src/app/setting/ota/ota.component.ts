import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ColDef } from 'ag-grid-community';
import { ApkEnableBtnComponent } from 'src/app/_core/cellrenders/apk-enable-btn/apk-enable-btn.component';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { ExportService } from 'src/app/_core/services/export.service';
import { PdfService } from 'src/app/_core/services/pdf.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ota',
  templateUrl: './ota.component.html',
  styleUrls: ['./ota.component.scss']
})
export class OtaComponent implements OnInit {
  ota: any;
  userIp: any
  alldistrictlist: any;
  currentDate: any;
  startDate: any;
  endDate: any;
  currentUser: any;
  otaId: any;
  dev: any;
  groupInfo: any
  constructor(private clientService: ClientService, private exportService: ExportService, private authService: AuthService, private excelService: ExcelService, private renderer: Renderer2, private alertService: AlertService, private matDialog: MatDialog, private storageService: StorageService) {
    this.currentDate = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.dev = this.storageService.getDev();
    this.clientService.getIPAddress().subscribe((res: any) => {
      // console.log(res);
      this.clientService.getUserIp().subscribe((res1: any) => {
        this.userIp = res.ipString + "/" + res1.userip;
        // console.log(this.userIp);
      })
    })
    this.getAllDistributorList();
    this.getCustomerVersion();
    this.clientService.getOtalistAll().subscribe(res => {
      // console.log(res);
      this.rowData = res;
    })
    this.clientService.getOtaGroupInfo().subscribe(res => {
      // console.log(res);
      this.groupInfo = res;
    })

  }
  dateTimePicker() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        });
        this.clientService.setScheduleForOta(this.otaId, this.startDate, this.endDate, "").subscribe((res: any) => {
          // console.log(res);
          loader.close();
          Swal.fire('Saved!', res.message, 'success');
          // window.location.reload();
          this.ngOnInit();
          this.matDialogRef.close();
        }, (err) => {
          let dynamicHTML;
          if (err.error.message.length == 58) {
            dynamicHTML = "<h4>Please choose Valid Date and Time </h4>"
          } else {
            dynamicHTML = "<h4>" + err.error.message + "</h4>"
          }
          loader.close();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: dynamicHTML,
            text: "",
          })

        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          let p = {
            file: files[i],
            apk: files[i].name
          }

          // console.log(p);
          this.ota = p;
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  onSubmit(name: any, ver: any) {
    console.log(this.selectedTarget);
    if (!this.selectedTarget) {
      this.alertService.showWarning("Please choose group name");
      return;
    }
    // console.log(this.ota);
    // console.log(ver);
    // console.log(this.selectId);

    const fd = new FormData();
    fd.append("uploadedBy", name.value);
    // fd.append("id", this.selectId);
    fd.append("uploadedIp", this.userIp);
    fd.append("groupid", this.selectedTarget);
    fd.append("ver", ver.value);
    // fd.append("distributorid", this.selectDistributorId);
    // fd.append("clientlist", this.allSelectedClientList);
    // fd.append("statelist", this.allSelectedStateList);
    // fd.append("districtlist", this.allSelectedDistrictList);
    // fd.append("citylist", this.allSelectedCityList);
    // fd.append("locationlist", this.allSelectedLocationList);
    // fd.append("devicelist", this.allselectedDeviceList);
    fd.append("isvertical", this.selectedVertical);
    // fd.append("planid", this.selectedVersion);
    if (this.ota) {
      fd.append("file", this.ota.file);
      fd.append("apk", this.ota.apk);
    } else if (this.selectId == 0) {
      this.alertService.showWarning("Please choose the apk file")
    }

    if (this.selectId == 0) {
      let ul: any = document.getElementById("input-container");
      // console.log();
      var v = Array.from(ul.children);
      let features: any;
      v.forEach((e: any) => {
        // console.log(e.innerText);
        if (e.innerText != "Edit This Line") {
          if (features) {
            features = features + "&" + e.innerText
          } else {
            features = e.innerText
          }

        }
      })

      if (features) {
        fd.append("features", features);
      }
    }

    // console.log(this.selectId);

    if (this.selectId == 0) {
      if (this.ota?.file && name.value && ver.value) {
        // console.log(fd.get("uploadedBy"));
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        });
        // console.log(fd.get('uploadedBy'));

        this.clientService.uploadApkFile(fd).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          this.ngOnInit();
          this.alertService.showSuccess(res.message);
          this.allSelectedCityList = [];
          this.allSelectedClientList = [];
          this.allselectedDeviceList = [];
          this.allSelectedDistrictList = [];
          this.allSelectedLocationList = [];
          this.allSelectedStateList = [];
          // window.location.reload();
        }, err => {
          loader.close();
          this.alertService.showError(err.error.message);
        })
      } else {
        this.alertService.showWarning("Please Fill The All Fields")

      }
    } else {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      });
      this.clientService.uploadApkFile(fd).subscribe((res: any) => {
        // console.log(res);
        loader.close();
        this.alertService.showSuccess(res.message);
        // window.location.reload();
        this.ngOnInit();
        this.matDialogRef.close();
      }, err => {
        loader.close();
        this.alertService.showSuccess(err.error.message);
      })
    }


  }
  addInput() {
    const container: any = document.getElementById('input-container');
    // console.log(container);
    let input: any = document.createElement('li');
    input.contentEditable = "true";
    input.setAttribute("contenteditable", "true");
    input.style.margin = "10px";
    container.style.color = "green"; // Change text color
    container.style.fontSize = "16px"; // Change font size
    container.style.paddingLeft = "10px";
    input.innerText = "Edit This Line"
    container.appendChild(input);
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 60 },
    // { headerName: 'Edit', field: 'apk', cellRenderer: this.CellRendererBtn.bind(this) },
    // {
    //   headerName: 'Schedule', cellRenderer: this.CellRendererBtnSchedule.bind(this)
    // },
    // { headerName: 'Start Time', field: 'sch_start_time' },
    // { headerName: 'End Time', field: 'sch_end_time' },
    { headerName: 'APK', field: 'apk' },
    {
      headerName: 'Release', cellRenderer: ApkEnableBtnComponent
    },
    {
      headerName: 'Version', field: 'ver', valueGetter: (e) => {
        return "v" + e.data.ver;
      }
    },
    {
      headerName: 'Group name', field: 'groupname'
    },
    {
      headerName: 'Orientation', field: 'isvertical', valueGetter: (params: any) => {

        if (params.data.isvertical) {
          return 'vertical';
        } else {
          return "Horizontal";
        }
      }, cellStyle: params => {
        if (params.data.isvertical) {
          //mark police cells as red
          return { color: '' };
        } else {
          return { color: '' };
        }

      }
    },
    // {
    //   headerName: 'Plan', field: 'planname'
    // },
    {
      headerName: 'Uploaded By', field: 'uploadedby'
    },
    {
      headerName: 'Uploaded Ip', field: 'uploadedip',
    },
    {
      headerName: 'Features', field: 'featureList', width: 250, cellRenderer: (e: any) => {
        // console.log(e.value);
        let st = "";
        if (e.value) {


          for (let index = 0; index < e.value.length; index++) {
            const element = e.value[index];
            if (st) {
              st = st + "," + (index + 1) + "." + element;
            } else {
              st = (index + 1) + "." + element
            }
          }
        }

        return st;

      }
    },

    { headerName: 'Creationdate', field: 'creationdate' },
    { headerName: 'Updationdate', field: 'updateddate' },




  ];
  gridApi: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 200,
      floatingFilter: true
    },
    pagination: true,
    paginationPageSize: 10

  }
  rowData: any = []

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  exportPdf() {
    // console.log(this.selectedActive);
    const title = 'OTA Information';

    let dataFields = [
      // "plan",
      'Apk Name',
      'ver',
      'uploaded by',
      // 'status',
      // "sch start time",
      // 'sch end time',
      "Activity",
      'creationdate',
      'updatedate',
      'uploadedip'
    ];
    let field: any = [
      // "plan",
      'Apk',
      'ver',
      'uploadedby',
      // 'status',
      // "sch_start_time",
      // 'sch_end_time',
      "Activity",
      'creationdate',
      'updatedate',
      'uploadedip'];

    let data1: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        // plan: obj?.planname,
        'Apk': obj?.apk,
        'ver': "V" + obj?.ver,
        'uploadedby': obj?.uploadedby,
        // 'status': this.scheduleFormater(obj),
        // "sch_start_time": obj?.sch_start_time,
        // 'sch_end_time': obj?.sch_end_time,
        "Activity": obj?.isactive ? 'active' : 'inactive',
        'creationdate': obj?.creationdate,
        'updatedate': obj?.updateddate,
        'uploadedip': obj?.uploadedip
      }
      data1.push(g)
    }
    let column_width: any = []
    let data = {
      action: "download",
      fdate: "N/A",
      tdate: "N/A",
      column_width: column_width,
      history: data1,
      reportname: title,
      columns: dataFields,
      columnsdataFields: field,
      filterList: ""
    }
    this.exportService.generateDeviceLogsPDF(data);
  }



  exportAsExcelFile() {
    const title = 'Ota Information';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        // plan: obj?.planname,
        'Apk': obj?.apk,
        'ver': "V" + obj?.ver,
        'uploadedby': obj?.uploadedby,
        // 'status': this.scheduleFormater(obj),
        // "sch_start_time": obj?.sch_start_time,
        // 'sch_end_time': obj?.sch_end_time,
        "Activity": obj?.isactive ? 'active' : 'inactive',
        'creationdate': obj?.creationdate,
        'updatedate': obj?.updateddate,
        'uploadedip': obj?.uploadedip
      }
      data.push(g)
    }
    let cellSize = { a: "15", b: "25", c: "25", d: "25", e: "25", f: "35", g: "35", h: "25", i: "25", j: "25", k: "30" }
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
  getPlan(event: any) {
    // console.log(event);
    let payload = {
      planid: event?.id
    }
    this.filterOTA(payload);
  }
  filterOTA(payload: any) {
    this.clientService.filterOta(payload).subscribe(res => {
      this.rowData = res;

    })
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  CloseMatDialog() {
    this.matDialog.closeAll();
  }
  CellRendererBtn(params: any): HTMLElement {
    const button = this.renderer.createElement('button');
    // console.log(params.data);
    this.renderer.addClass(button, 'mat-raised-button');
    this.renderer.setStyle(button, 'background', 'transparent');
    this.renderer.setStyle(button, 'margin', '0px 15%');
    this.renderer.setStyle(button, 'width', '50%');
    this.renderer.setStyle(button, 'line-height', '1.8');
    this.renderer.setStyle(button, "padding", "0px 5px")
    this.renderer.setProperty(button, 'innerText', 'Edit');
    this.renderer.setStyle(button, 'color', '#42aaf5');
    this.renderer.setStyle(button, 'border', '1px #42aaf5 solid');
    this.renderer.listen(button, 'click', (e) => {
      // console.log(params.data);
      // this.matDialog.open(this.editee)
      // console.log(this.editee);
      this.getOtaGroupMasterByOtaId(params?.data?.id);
    });
    const div = this.renderer.createElement('div');
    this.renderer.appendChild(div, button);

    return div;
  }
  scheduleFormater(data: any): any {

    let current = new Date().getTime();
    var sch_start_time = new Date(data.sch_start_time).getTime();
    var sch_end_time = new Date(data.sch_end_time).getTime();

    // console.log(sch_start_time > current);
    // console.log(sch_start_time < current && current < sch_end_time);
    // console.log(current > sch_end_time);
    if (sch_start_time != 0 && sch_end_time != 0) {
      if (sch_start_time > current) {
        return 'Scheduled';
      } else if (sch_start_time < current && current < sch_end_time) {
        return 'Onprogress';
      } else if (current > sch_end_time) {
        return 'Finished';
      }
      else {
        return "Not-scheduled";
      }
    }

    else {
      return "Not-scheduled";
    }
  }
  CellRendererBtnSchedule(params: any): HTMLElement {

    const button = this.renderer.createElement('button');
    // console.log(params.data);
    this.renderer.addClass(button, 'mat-raised-button');
    this.renderer.setStyle(button, 'background', 'transparent');
    this.renderer.setStyle(button, 'margin', '0px 15%');
    this.renderer.setStyle(button, 'line-height', '1.8');
    this.renderer.setStyle(button, "padding", "0px 5px")

    let res = this.scheduleFormater(params.data);

    if (res == "Scheduled") {
      this.renderer.setStyle(button, 'width', '50%');
      this.renderer.setProperty(button, 'innerText', 'Scheduled');
      this.renderer.setStyle(button, 'color', '#3d1df0');
      this.renderer.setStyle(button, 'border', '1px #3d1df0 solid');
      this.renderer.listen(button, 'click', (e) => {
        // console.log(params.data);
        this.startDate = params.data?.sch_start_time;
        this.endDate = params.data?.sch_end_time;
        this.otaId = params.data?.id;
        this.matDialogRef = this.matDialog.open(this.schedule, {
          minWidth: '300px'
        });
      });
    } else if (res == "Onprogress") {
      this.renderer.setStyle(button, 'width', '50%');
      this.renderer.setProperty(button, 'innerText', 'Onprogress');
      this.renderer.setStyle(button, 'color', '#08d43f');
      this.renderer.setStyle(button, 'border', '1px #08d43f solid');
      this.renderer.listen(button, 'click', (e) => {
        // console.log(params.data);
        this.startDate = params.data?.sch_start_time;
        this.endDate = params.data?.sch_end_time;
        this.otaId = params.data?.id;
        this.stopSchedule()
        // this.matDialogRef = this.matDialog.open(this.schedule);
      });
    } else if (res == "Finished") {
      this.renderer.setStyle(button, 'width', '50%');
      this.renderer.setProperty(button, 'innerText', 'Finished');
      this.renderer.setStyle(button, 'color', '#eb2310');
      this.renderer.setStyle(button, 'border', '1px #eb2310 solid');
      this.renderer.listen(button, 'click', (e) => {
        // console.log(params.data);
        this.startDate = params.data?.sch_start_time;
        this.endDate = params.data?.sch_end_time;
        this.otaId = params.data?.id;
        this.matDialogRef = this.matDialog.open(this.schedule, {
          minWidth: '300px'
        });
      });
    } else if (res == "Not-scheduled") {
      this.renderer.setStyle(button, 'width', '70%');
      this.renderer.setProperty(button, 'innerText', 'Not-scheduled');
      this.renderer.setStyle(button, 'color', '#4b5e51');
      this.renderer.setStyle(button, 'border', '1px #4b5e51 solid');
      this.renderer.listen(button, 'click', (e) => {
        // console.log(params.data);
        this.startDate = params.data?.sch_start_time;
        this.endDate = params.data?.sch_end_time;
        this.otaId = params.data?.id;
        this.matDialogRef = this.matDialog.open(this.schedule, {
          minWidth: '300px'
        });
      });
    }

    const div = this.renderer.createElement('div');
    this.renderer.appendChild(div, button);

    return div;
  }
  stopSchedule() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Stop it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.stopOtaSchedule(this.otaId).subscribe((res: any) => {
          // console.log(res);
          // window.location.reload();
          Swal.fire(
            'Stopped!',
            res.message,
            'success'
          )
          this.ngOnInit();
          this.matDialogRef.close();
        })

      }
    })
  }
  matDialogRef: any;
  getOtaGroupMasterByOtaId(e: any) {
    this.clientService.getOtaGroupMasterByOtaId(e).subscribe((res: any) => {
      // console.log(res);
      this.matDialogRef = this.matDialog.open(this.editee);
      this.allSelectedClientList = res?.clientlist
      this.allSelectedStateList = res?.statelist;
      this.allSelectedCityList = res?.citylist;
      this.allSelectedDistrictList = res?.districtlist;
      this.allSelectedLocationList = res?.locationlist;
      this.allselectedDeviceList = res?.devicelist;
      this.selectDistributorId = res?.distributorid;
      this.selectedVersion = res?.planid;
      this.selectId = res?.otaid;
      if (res.isvertical) {
        this.selectedVertical = "true";
      } else {
        this.selectedVertical = "false";
      }
      // console.log(this.selectedVertical);

      this.clientService.getClientListByDistributorId(res.distributorid).subscribe(res => {
        // console.log(res);
        this.ClientList = res;
        this.getStatelistByClient();
        this.getDistrictbyStatelist();
        this.getCitybyStatelist();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
      });

    })
  }
  // Grouping---------------------
  distributorList: any = [];
  ClientList: any = [];
  selectId: any = 0;

  selectDistributorId: any
  selectedVertical: any = 'true';
  stateList: any = [];
  selectedVersion: any;
  public distributorList2 = this.distributorList.slice();
  allSelectedStateList: any = [];
  allSelectedDistrictList: any = [];
  allSelectedCityList: any = [];
  allSelectedLocationList: any = [];
  allSelectedClientList: any = []
  allcitylist: any = [];
  alldevicelist: any = [];
  alllocationlist: any = [];
  allselectedDeviceList: any = [];
  @ViewChild('selectState') selectState!: MatSelect;
  @ViewChild('selectCity') selectCity!: MatSelect;
  @ViewChild('selectLocation') selectLocation!: MatSelect;
  @ViewChild('selectDistrict') selectDistrict!: MatSelect;
  @ViewChild('selectDevice') selectDevice!: MatSelect;
  @ViewChild('selectClient') selectClient!: MatSelect;
  @ViewChild('editee1') editee!: HTMLElement | any;
  @ViewChild('schedule1') schedule!: HTMLElement | any;
  allSelectedState = false;
  allSelectedDistrict = false;
  allSelectedCity = false;
  allSelectedLocation = false;
  allselectedDevice = false;
  allSelectedClient = false;
  planVersionList: any;
  toggleAllSelectionForClient() {
    if (this.allSelectedClient) {
      this.selectClient.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectClient.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];
      this.allselectedDeviceList = [];
    }
    this.getStatelistByClient()


  }
  optionClickClient() {
    let newStatus = true;
    this.selectClient.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.getStatelistByClient()
    this.allSelectedClient = newStatus;


  }
  toggleAllSelectionForState() {
    if (this.allSelectedState) {
      this.selectState.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectState.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];
      this.allselectedDeviceList = [];
    }
    this.getDistrictbyStatelist();
    this.getCitybyStatelist();
    this.getLocationByStateAndCity();
    this.getDeviceByLocation();
  }
  optionClickState() {
    let newStatus = true;
    this.selectState.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedState = newStatus;
    this.getDistrictbyStatelist();
    this.getCitybyStatelist();
    this.getLocationByStateAndCity();
    this.getDeviceByLocation();
  }
  toggleAllSelectionForDistrict() {
    if (this.allSelectedDistrict) {
      this.selectDistrict.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDistrict.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];
      this.allselectedDeviceList = [];
    }
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
    this.getDeviceByLocation();
  }
  optionClickDistrict() {
    let newStatus = true;
    this.selectDistrict.options.forEach((item: MatOption) => {
      // console.log(item);

      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedState = newStatus;
    this.allSelectedCityList = [];
    this.allSelectedLocationList = [];
    this.allselectedDeviceList = [];
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
    this.getDeviceByLocation();
  }
  toggleAllSelectionForCity() {
    if (this.allSelectedCity) {
      this.selectCity.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectCity.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedLocationList = [];
      this.allselectedDeviceList = [];
    }
    this.getLocationByStateAndCity();
    this.getDeviceByLocation();
  }
  optionClickCity() {
    let newStatus = true;
    this.selectCity.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedCity = newStatus;
    this.getLocationByStateAndCity();
    this.getDeviceByLocation();
  }


  toggleAllSelectionForLocation() {
    if (this.allSelectedLocation) {
      this.selectLocation.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectLocation.options.forEach((item: MatOption) => item.deselect());
      this.allselectedDeviceList = [];
    }

    this.getDeviceByLocation();

  }
  optionClickLocation() {
    let newStatus = true;
    this.selectLocation.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedLocation = newStatus;
    this.getDeviceByLocation();
  }
  demo1TabIndex: any;

  toggleAllSelectionForDevice() {
    if (this.allselectedDevice) {
      this.selectDevice.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDevice.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClickDiveice() {
    let newStatus = true;
    this.selectDevice.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allselectedDevice = newStatus;
  }

  //  checkConfigure(event: any) {
  //    var clickedId = event.target.id
  //    let selectlist: any = document.getElementsByClassName("formSelect");
  //    // console.log(selectlist);
  //    var elementsArray = [...selectlist];
  //    // Use forEach to iterate over the array of elements
  //    elementsArray.forEach((element) => {
  //      // Do something with each element
  //      // console.log(element.id == clickedId);
  //      if (element.id == clickedId) {
  //        console.log(clickedId);
  //        if (clickedId == "allstate") {
  //          this.isstateSelected = true;
  //          this.isDeviceselected = false;
  //          this.isLocationSelected = false;
  //          this.iscitySelected = false;
  //        } else if (clickedId == "allcity") {
  //          this.isstateSelected = false;
  //          this.isDeviceselected = false;
  //          this.isLocationSelected = false;
  //          this.iscitySelected = true;
  //        } else if (clickedId == "alllocation") {
  //          this.isstateSelected = false;
  //          this.isDeviceselected = false;
  //          this.isLocationSelected = true;
  //          this.iscitySelected = false;
  //        } else if (clickedId == "alldevice") {
  //          this.isstateSelected = false;
  //          this.isDeviceselected = true;
  //          this.isLocationSelected = false;
  //          this.iscitySelected = false;
  //        }
  //        element.checked = true;
  //      } else {
  //        element.checked = false;
  //      }
  //    });

  //  }
  getStatelistByClient() {
    // console.log(this.allSelectedClientList);

    this.clientService.getStatelistByClient(this.allSelectedClientList).subscribe(res => {
      // console.log(res);
      this.stateList = res;
      this.filteredListState = res;
    })
  }
  getDistrictbyStatelist() {
    let payload = {
      state_list: this.allSelectedStateList,
      client_list: this.allSelectedClientList
    }
    this.clientService.getDistrictListByStateIdList(payload).subscribe(res => {
      // console.log(res);
      this.alldistrictlist = res;
      this.filteredListCity = res;
    })
  }
  getCitybyDistrictList() {
    let payload = {
      district_list: this.allSelectedDistrictList,
      client_list: this.allSelectedClientList
    }
    this.clientService.getCityListByDistrictList(payload).subscribe(res => {
      // console.log(res);
      this.allcitylist = res;
      this.filteredListCity = res;
    })
  }
  getCitybyStatelist() {
    // console.log(this.allSelectedStateList);
    let payload = {
      state_list: this.allSelectedStateList,
      client_list: this.allSelectedClientList
    }
    // this.clientService.getCitybyStatelist(this.allSelectedStateList).subscribe(res => {
    //   // console.log(res);
    //   this.allcitylist = res;
    //   this.filteredListCity=res;
    // })

    this.clientService.getCitybyStatelist(payload).subscribe(res => {
      // console.log(res);
      this.allcitylist = res;
      this.filteredListCity = res;
    })
  }

  getLocationByStateAndCity() {
    // console.log(this.allSelectedCityList);
    let payload = {
      city_list: this.allSelectedCityList,
      client_list: this.allSelectedClientList
    }
    this.clientService.getLocationByStateAndCity(payload).subscribe(res => {
      // console.log(res);
      this.alllocationlist = res;
      this.filteredListLocation = res;
    })
  }

  getDeviceByLocation() {
    // console.log(this.allselectedDeviceList);
    let payload = {
      location_list: this.allSelectedLocationList,
      client_list: this.allSelectedClientList,
      isvertical: this.selectedVertical,
      version: this.selectedVersion,
      // district_list: this.allSelectedDistrictList,
    }
    // console.log(payload);

    this.clientService.getDeviceByLocationAndClientByPlanAndVertical(payload).subscribe(res => {
      // console.log(res);
      this.alldevicelist = res;
      this.filteredListDevice = res;
    })
  }
  getAllDistributorList() {
    this.clientService.getDistibutor().subscribe((res: any) => {
      // console.log(res);
      this.distributorList = res;
      this.distributorList2 = res;
    })
  }

  getAllClientByDistributor(event: any) {
    // console.log(event);
    this.selectDistributorId = event.value;
    this.clientService.getClientListByDistributorId(event.value).subscribe(res => {
      // console.log(res);
      this.ClientList = res;
      this.filteredListClient = res;
    })
  }
  getCustomerVersion() {
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      this.planVersionList = res;
    })
  }
  filteredListDevice: any = this.alldevicelist.slice();
  filteredListCity: any = this.allcitylist.slice();
  filteredListLocation: any = this.alllocationlist.slice();
  filteredListState: any = this.stateList.slice();
  filteredListClient: any = this.ClientList.slice();

  signout() {
    this.authService.signOut();
  }

  selectedTarget: any = 1;

}


