import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { QrCodeGeneratorComponent } from 'src/app/_core/cellrenders/qr-code-generator/qr-code-generator.component';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { EditCustomerComponent } from 'src/app/_core/popups/edit-customer/edit-customer.component';
import { EditDistributorComponent } from 'src/app/_core/popups/edit-distributor/edit-distributor.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { ExportService } from 'src/app/_core/services/export.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';
declare var QRCode: any
@Component({
  selector: 'app-distributor-info',
  templateUrl: './distributor-info.component.html',
  styleUrls: ['./distributor-info.component.scss']
})
export class DistributorInfoComponent implements OnInit {
  gridApi: any;
  panelOpenState = false;
  rowData: any;
  rowDatafilter: any;
  signInForm!: UntypedFormGroup;
  isMoblie = false;
  maxDate = new Date();
  fromdate: any = "null";
  todate: any = 'null';
  columnDefs!: ColDef[];
  complaintTypes: any
  filterComplaintTypes: any = [];
  targetDistributor: any
  @ViewChild('ComplaintType') ComplaintTypeTemplate: any;
  constructor(private clientService: ClientService, private excelService: ExcelService, private exportService: ExportService, private observer: BreakpointObserver, private matDialog: MatDialog, private fb: UntypedFormBuilder, private authService: AuthService, private tokenStorage: StorageService, private router: Router, private alertToaster: AlertService) { }

  ispinned(s: any) {
    return s ? null : 'left';
  }
  distributorIdList: any = []
  isAnyRowSelected: any = false;
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      if (this.isAnyRowSelected) {
        selectedRows.forEach((e: any) => {
          this.distributorIdList.push(e?.id)
        });
      }
    }
  }
  ngOnInit(): void {
    this.getAllDistibutor();
    this.getStateForDistributor();
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      const sidebar = document.querySelector(".sidebar");
      if (res.matches) {
        this.isMoblie = true;

      } else {
        this.isMoblie = false;

      }
    });
    //  headerCheckboxSelection: true, checkboxSelection: true, 
    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', width: 120 },
      {
        headerName: 'Actions', width: 150,
        cellRenderer: (params: any) => {
          const editButton = document.createElement('button');
          const deleteButton = document.createElement('button');
          const permissionButton = document.createElement('button');
          permissionButton.innerHTML = '<i class="fa fa-shield fa-lg"></i>';
          permissionButton.style.backgroundColor = 'transparent';
          permissionButton.style.color = '#718496';
          permissionButton.style.border = 'none';
          permissionButton.style.cursor = 'pointer';
          permissionButton.style.marginLeft = '6px';
          // permissionButton.style.fontSize = "17px";
          permissionButton.title = "Permissions";
          permissionButton.addEventListener('click', () => {
            const rowData = params.data;
            this.allSelectedComplaintTypes = rowData?.permission_list;
            this.openPermissionPopUp(rowData);
          });

          editButton.innerHTML = '<i class="fa fa-edit fa-lg"></i>';
          editButton.style.backgroundColor = 'transparent';
          editButton.style.color = '#378cee';
          editButton.style.border = 'none';
          editButton.style.cursor = 'pointer';
          // editButton.style.fontSize = "20px";
          editButton.title = "Edit The Distributor";
          const input = document.createElement('input');
          input.type = 'checkbox';
          editButton.addEventListener('click', () => {
            const rowData = params.data;
            this.matDialog.open(EditDistributorComponent, {
              data: rowData
            })
          });
          if (params?.data?.isdelete) {
            editButton.disabled = !params?.data?.isactive
            deleteButton.style.marginRight = '-6px';
            deleteButton.innerHTML = '<i class="fa fa-user-times fa-lg"></i>';
            deleteButton.style.color = '#F55C47';
            deleteButton.title = 'Inacive Distributor';
          } else {
            editButton.disabled = !params?.data?.isactive;
            deleteButton.innerHTML = '<i class="fa fa-user fa-lg"></i>';
            deleteButton.style.color = '#9EDE73';
            deleteButton.title = 'Acive Distributor';
          }

          if (params?.data?.isactive) {
            editButton.disabled = false;
            deleteButton.disabled = false
          } else {
            editButton.disabled = true;
            deleteButton.disabled = true
          }
          deleteButton.style.backgroundColor = 'transparent';
          deleteButton.style.border = 'none';
          deleteButton.style.marginLeft = '6px';
          deleteButton.style.cursor = 'pointer';
          // deleteButton.style.fontSize = "20px"
          deleteButton.addEventListener('click', () => {
            const rowData = params.data;
            console.log(rowData);
            let c = (params?.data?.isdelete ? "active " : "inactive ") + rowData?.distributor;

            Swal.fire({
              title: "Are you sure?",
              text: "Do you want to be " + c,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: params?.data?.isdelete ? "Yes, active!" : "Yes, inactive!"
            }).then((result) => {
              if (result.isConfirmed) {
                this.clientService.activateDistributorByAdmin(rowData?.username, !params?.data?.isdelete).subscribe((res: any) => {
                  Swal.fire({
                    title: params?.data?.isdelete ? "activated" : "inactivated",
                    text: res.message,
                    icon: "success"
                  });
                  this.filterDistributorListByMultiple()
                }, err => {
                  Swal.fire({
                    title: "Opps",
                    text: err?.error?.message,
                    icon: "error"
                  });
                })
              }
            });

          });
          const div = document.createElement('div');
          // div.classList.add('d-flex');
          div.appendChild(editButton);
          div.appendChild(permissionButton);
          div.appendChild(deleteButton);
          return div;
        }
      },
      {
        headerName: 'Name', field: 'distributor', pinned: this.ispinned(this.isMoblie), onCellClicked: (event) => {
          this.cellClickedEvent(event)
        }
      },
      { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
      { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },
      { headerName: 'Distributor Code', field: 'distributorcode', cellStyle: { "text-transform": "none" } },
      {
        headerName: 'QR Code', field: '', cellRenderer: QrCodeGeneratorComponent
      },
      { headerName: 'GST Number', field: 'gst_no' },
      { headerName: 'TAN Number', field: 'tan_no' },
      {
        headerName: 'type', field: 'ispremium', valueGetter: (params) => {
          // console.log(params.data);

          if (params?.data?.ispremium) {
            return "Premium"
          } else {
            return "N/A"
          }

        }, cellStyle: params => {
          if (params.data.ispremium) {
            return { color: '#378ced' };
          } else {
            return { color: '#eb9834' };
          }
          return null;
        }
      },
      {
        headerName: 'Country', field: 'country', valueGetter: (e) => {
          return e.data?.country?.countryname;
        }
      },
      {
        headerName: 'State', field: 'state', minWidth: 250, valueGetter: (e) => {
          return e.data?.state?.statename;
        }
      },
      {
        headerName: 'District', field: 'district', minWidth: 250, valueGetter: (e) => {
          return e.data?.district?.name;
        }
      },
      {
        headerName: 'City', field: 'city', valueGetter: (e) => {
          return e.data?.city?.cityname;
        }
      },
      {
        headerName: 'Location', field: 'location', valueGetter: (e) => {
          return e.data?.location?.area;
        }
      },
      // { headerName: 'Postal', field: 'zipcode' },
      { headerName: 'Mobile1', field: 'phone' },
      { headerName: 'Mobile2', field: 'phone2' },
      { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
      { headerName: 'Creationdate', field: 'creationdate' },
      { headerName: 'Updatedate', field: 'updatedate' },
      // { headerName: 'IsActiveStatus', field: 'isactive' }
    ];
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 13,
    pagination: true,
  }
  onclickEdit(rowData: any) {
    this.matDialog.open(EditDistributorComponent, {
      data: rowData
    })
  }
  // /complaint/getcomplainttypes
  getComplaintTypes() {
    this.clientService.getComplaintTypes().subscribe((res: any) => {
      this.complaintTypes = res;
      this.filterComplaintTypes = res;
    })
  }
  openPermissionPopUp(rowData: any) {
    this.targetDistributor = rowData;
    // if (!rowData) {
    //   this.matDialog.open(PermissionsComponent, {
    //     data: { list: this.distributorIdList, isMulti: true },
    //     minWidth: 320
    //   })
    // } else {
    this.matDialog.open(this.ComplaintTypeTemplate, {
      data: rowData,
      minWidth: 320
    })
    // }

  }

  inactivateDistrubutor(rowData: any) {
    let c = (rowData?.isdelete ? "active " : "inactive ") + rowData?.distributor;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to be " + c,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: rowData?.isdelete ? "Yes, active!" : "Yes, inactive!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.activateDistributorByAdmin(rowData?.username, !rowData?.isdelete).subscribe((res: any) => {
          Swal.fire({
            title: rowData?.isdelete ? "activated" : "inactivated",
            text: res.message,
            icon: "success"
          });
          this.filterDistributorListByMultiple()
        }, err => {
          Swal.fire({
            title: "Opps",
            text: err?.error?.message,
            icon: "error"
          });
        })
      }
    });
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.clientService.getDistibutor().subscribe((data) => {
      this.gridApi.setRowData(data);
    });
  }
  cellClickedEvent(client: any) {
    // console.log(client.data);
    // console.log("cellClickedEvent");
    this.signInForm = this.fb.group({
      username: [client.data.username, Validators.required],
      password: [client.data.password, Validators.required],
    });
    this.authService.login(this.signInForm.value).subscribe((res: any) => {
      // console.log(res);
      this.tokenStorage.saveDistributor(res);
      const user = this.tokenStorage.getDistributor();
      let roles = user.roles;
      // console.log(roles);
      let isDistrubutor = roles.includes('ROLE_DISTRIBUTOR');
      // console.log(isClient);
      if (isDistrubutor) {
        this.router.navigate(['distributor/distributor-dashboard']).then(() => {
          window.location.reload();
        });
      } else {

        alert("Invalid User");
      }

    }, err => {
      // console.log(err);

      this.alertToaster.showError(err?.error?.message);
    });
  }
  signintoDistributor(client: any) {
    // console.log(client.data);
    // console.log("cellClickedEvent");
    this.signInForm = this.fb.group({
      username: [client.username, Validators.required],
      password: [client.password, Validators.required],
    });
    this.authService.login(this.signInForm.value).subscribe((res: any) => {
      // console.log(res);
      this.tokenStorage.saveDistributor(res);
      const user = this.tokenStorage.getDistributor();
      let roles = user.roles;
      // console.log(roles);
      let isDistrubutor = roles.includes('ROLE_DISTRIBUTOR');
      if (this.isMoblie) {
        sessionStorage.getItem('loaded') ? sessionStorage.removeItem('loaded') : '';
        sessionStorage.getItem('loadedDevice') ? sessionStorage.removeItem('loadedDevice') : '';
      }
      // console.log(isClient);
      if (isDistrubutor) {
        this.router.navigate(['distributor/distributor-dashboard']).then(() => {
          window.location.reload();
        });
      } else {

        alert("Invalid User");
      }

    }, err => {
      // console.log(err);

      this.alertToaster.showError(err?.error?.message);
    });
  }
  getAllDistibutor() {
    this.clientService.getDistibutor().subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      this.rowDatafilter = res;
    })

    this.getComplaintTypes();
  }

  exportPdf() {
    // let selectedDistributor = this.rowData[0]?.distributor;
    let selectedState = this.rowData[0]?.state?.statename;
    let selectedDistrict = this.rowData[0]?.district?.name;
    let selectedCity = this.rowData[0]?.city?.cityname;
    let selectedLocation = this.rowData[0]?.location?.area;
    // let selectedVersion = this.rowData[0]?.versionMaster?.version;
    let filterList: any = {
      // distributor: this.selectedDistributor?.distributor,
      state: this.allSelectedStateList.length == 1 ? selectedState : this.allSelectedStateList.length == 0 ? "" : "Multiple",
      district: this.allSelectedDistrictList.length == 1 ? selectedDistrict : this.allSelectedDistrictList.length == 0 ? "" : "Multiple",
      city: this.allSelectedCityList.length == 1 ? selectedCity : this.allSelectedCityList.length == 0 ? "" : "Multiple",
      location: this.allSelectedLocationList.length == 1 ? selectedLocation : this.allSelectedLocationList.length == 0 ? "" : "Multiple",
      // isactive: this.selectedActive?.value,
      // plan: this.selectedVersion?.version,
      fromdate: this.fromdate,
      todate: this.todate
    }

    const title = 'Distributor Information';
    let dataFields = [
      'Distributor',
      'Username',
      'Password',
      'Code',
      "Phone",
      'Email',
      'State',
      'District',
      'City',
      "Location",
      'Creationdate',
      'Updatedate'
    ];
    let field: any = [];
    for (let e of dataFields) {

      // if (e === "State") {
      //   if (this.selectedState.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "District") {
      //   if (this.selectedDistrict.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "City") {
      //   if (this.selectedCity.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "Location") {
      //   if (this.selectedLocation.id != 0) {
      //     continue;
      //   }
      // }
      field.push(e);
    }

    let data1: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Distributor': obj?.distributor,
        'Username': obj?.username,
        'Password': obj?.password,
        'Code': obj?.distributorcode,
        "Phone": obj?.phone,
        'Email': obj?.email,
        // 'country': obj?.country?.countryname,
        'State': obj?.state?.statename,
        'District': obj?.district?.name,
        'City': obj?.city?.cityname,
        "Location": obj?.location?.area,
        // 'Zipcode': obj?.zipcode,
        "Status": obj?.isactive,
        'Creationdate': obj?.creationdate,
        'Updatedate': obj?.updatedate,
      }
      data1.push(g)
    }
    let column_width = ['5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%']
    let data = {
      action: "download",
      fdate: this.fromdate,
      tdate: this.todate,
      column_width: column_width,
      history: data1,
      reportname: title,
      columns: field,
      columnsdataFields: field,
      filterList: filterList
    }
    this.exportService.generateDestributorPDF(data);
  }

  exportAsExcelFile() {
    const title = 'Distributor Information';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Distributor': obj?.distributor,
        'Username': obj?.username,
        'Password': obj?.password,
        'Code': obj?.distributorcode,
        "Phone": obj?.phone,
        'Email': obj?.email,
        // 'country': obj?.country?.countryname,
        'State': obj?.state?.statename,
        'District': obj?.district?.name,
        'City': obj?.city?.cityname,
        "Location": obj?.location?.area,
        // 'zipcode': obj?.zipcode,
        "Status": obj?.isactive ? 'active' : 'inactive',
        'Creationdate': obj?.creationdate,
        'Updatedate': obj?.updatedate,
      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "15", c: "15", d: "15", e: "15", f: "35", g: "35", h: "25", i: "25", j: "25", k: "35", l: "15", m: "15", n: "15" }
    let titleMerge = "'B1':'K4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'L1':'M4'";
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
  // Multiselect===
  getStateForDistributor() {
    this.clientService.getStateForDistributor().subscribe(res => {
      this.stateList = res;
      this.filteredStateList = res;
    })
    // this.filterDistributorList();
  }
  allSelectedStateList: any = [];
  allSelectedDistrictList: any = [];
  allSelectedCityList: any = [];
  allSelectedLocationList: any = [];
  allSelectedState = false;
  allSelectedDistrict = false;
  allSelectedCity = false;
  allSelectedLocation = false;
  @ViewChild('selectState') selectState!: MatSelect;
  @ViewChild('selectCity') selectCity!: MatSelect;
  @ViewChild('selectLocation') selectLocation!: MatSelect;
  @ViewChild('selectDistrict') selectDistrict!: MatSelect;
  selectedState: any;
  selectedDistrict: any;
  selectedCity: any;
  selectedLocation: any;
  selectStateTemp: any = []
  openedChange(e: any) {
    console.log(e);
    if (e == true) {
      e.source.input.nativeElement.focus();
    }
  }
  toggleAllSelectionForState() {
    if (this.allSelectedState) {
      this.selectState.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectState.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedDistrictList = [];
      this.allSelectedLocationList = [];
    }
    this.getAllDistrictByStateListByMultipleForDestributor();
    this.filterDistributorListByMultiple();
  }
  optionClickState(event: any, state: any) {
    console.log(event);
    let newStatus = true;
    this.selectState.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    // if (event.isUserInput && event.source.selected == false) {
    //   let index = this.selectStateTemp.indexOf(event.source.value);
    //   this.selectStateTemp.splice(index, 1);
    // }
    // this.filteredStateList.forEach((element: any) => {
    //   // console.log(element);
    //   if (element.id === event.source.value) {
    //     if (event.source._selected) {
    //       element.isChecked = true;

    //     } else {
    //       element.isChecked = false;

    //     }
    //   }
    //   // if (event.isUserInput) {
    //   if (element.isChecked) {
    //     if (!this.allSelectedStateList.includes(element.id)) {
    //       this.allSelectedStateList.push(element.id);
    //     }
    //   } else {
    //     if (this.allSelectedStateList.includes(element.id) && element.id === event.source.value) {
    //       let v = this.allSelectedStateList.indexOf(element.id);
    //     }
    //   }
    //   // }
    // });
    console.log(this.allSelectedStateList);
    this.allSelectedCityList = [];
    this.allSelectedDistrictList = [];
    this.allSelectedLocationList = [];
    this.selectedState = state;
    this.allSelectedState = newStatus;
    this.getAllDistrictByStateListByMultipleForDestributor();
    this.filterDistributorListByMultiple();
  }

  toggleAllSelectionForDistrict() {
    if (this.allSelectedDistrict) {
      this.selectDistrict.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDistrict.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];
    }
    this.getAllCityByDestrictListByMultipleForDestributor()
    this.filterDistributorListByMultiple();
  }
  optionClickDistrict(district: any) {
    let newStatus = true;
    this.selectDistrict.options.forEach((item: MatOption) => {
      // console.log(item);
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedCityList = [];
    this.allSelectedLocationList = [];
    this.selectedDistrict = district;
    this.allSelectedDistrict = newStatus;
    this.getAllCityByDestrictListByMultipleForDestributor()
    this.filterDistributorListByMultiple();
  }
  toggleAllSelectionForCity() {
    if (this.allSelectedCity) {
      this.selectCity.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectCity.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedLocationList = [];
    }
    this.getAllLocationByCityListByMultipleForDestributor()
    this.filterDistributorListByMultiple();
  }
  optionClickCity(city: any) {
    let newStatus = true;
    this.selectCity.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedLocationList = [];
    this.selectedCity = city;
    this.allSelectedCity = newStatus;
    this.getAllLocationByCityListByMultipleForDestributor()
    this.filterDistributorListByMultiple();
  }
  toggleAllSelectionForLocation() {
    if (this.allSelectedLocation) {
      this.selectLocation.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectLocation.options.forEach((item: MatOption) => item.deselect());
    }
    this.filterDistributorListByMultiple();
  }
  optionClickLocation(location: any) {
    let newStatus = true;
    this.selectLocation.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.selectedLocation = location;
    this.allSelectedLocation = newStatus;
    this.filterDistributorListByMultiple();
  }
  getAllDistrictByStateListByMultipleForDestributor() {
    let v = {
      statelist: this.allSelectedStateList
    }
    this.clientService.getAllDistrictByStateListByMultipleForDestributor(v).subscribe(res => {
      this.districtList = res;
      this.filteredDistrictList = res;
    })
  }

  getAllCityByDestrictListByMultipleForDestributor() {
    let v = {
      districtlist: this.allSelectedDistrictList
    }
    this.clientService.getAllCityByDestrictListByMultipleForDestributor(v).subscribe(res => {
      this.cityList = res;
      this.filteredCityList = res;
    })
  }

  getAllLocationByCityListByMultipleForDestributor() {
    let v = {
      citylist: this.allSelectedCityList
    }
    this.clientService.getAllLocationByCityListByMultipleForDestributor(v).subscribe(res => {
      this.locationList = res;
      this.filteredLocationList = res;
    })
  }

  filterDistributorListByMultiple() {
    let payload = {
      "statelist": this.allSelectedStateList,
      "districtlist": this.allSelectedDistrictList,
      "citylist": this.allSelectedCityList,
      "locationlist": this.allSelectedLocationList,
      "fromdate": this.fromdate,
      "todate": this.todate
    }
    this.clientService.getAllDistributorListByList(payload).subscribe(res => {
      // console.log(res);
      this.rowData = res;
      this.rowDatafilter = res;
    })
  }
  // Filter========================
  // public variables = ['One', 'Two', 'County', 'Three', 'Zebra', 'XiOn'];
  // public filteredList1 = this.variables.slice();
  // selectedState: any = { id: 0 };
  // selectedDistrict: any = { id: 0 };
  // selectedCity: any = { id: 0 }
  // selectedLocation: any = { id: 0 };

  stateList: any = [];
  public filteredStateList = this.stateList.slice();
  districtList: any = [];
  public filteredDistrictList = this.districtList.slice();
  cityList: any = [];
  public filteredCityList = this.cityList.slice();
  versionList: any = [];
  public filteredVersionList = this.versionList.slice();
  locationList: any = [];
  public filteredLocationList = this.locationList.slice();
  // getStateForDistributor() {
  //   this.clientService.getStateForDistributor().subscribe(res => {
  //     this.stateList = res;
  //     this.filteredStateList = res;
  //   })
  //   this.filterDistributorList();
  // }
  // getDistrictbyStateForDistributor(state: any) {
  //   this.selectedState = state;
  //   this.clientService.getDistrictbyStateForDistributor(state?.id).subscribe(res => {
  //     this.districtList = res;
  //     this.filteredDistrictList = res;
  //   })
  //   this.filterDistributorList();
  // }
  // getCitybyDistrictForDistibutor(district: any) {
  //   this.selectedDistrict = district;
  //   this.clientService.getCitybyDistrictForDistibutor(district?.id).subscribe(res => {
  //     this.cityList = res;
  //     this.filteredCityList = res;
  //   })
  //   this.filterDistributorList();
  // }
  // getLocationbyCityForDistibutor(city: any) {
  //   this.selectedCity = city;
  //   this.clientService.getLocationbyCityForDistibutor(this.selectedCity?.id).subscribe(res => {
  //     this.locationList = res;
  //     this.filteredLocationList = res;
  //   })
  //   this.filterDistributorList();
  // }
  // getLocation(location: any) {
  //   this.selectedLocation = location;
  //   this.filterDistributorList();
  // }
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
    // this.filterDistributorList()
    this.filterDistributorListByMultiple()
  }



  // filterDistributorList() {
  //   let payload = {
  //     stateid: this.selectedState?.id,
  //     districtid: this.selectedDistrict?.id,
  //     cityid: this.selectedCity?.id,
  //     locationid: this.selectedLocation?.id,
  //     fromdate: this.fromdate,
  //     todate: this.todate,

  //   }
  //   this.clientService.getAllDistributorList(payload).subscribe(res => {
  //     // console.log(res);
  //     this.rowData = res;
  //   })
  // }

  // : any = [];
  filterStates(searchText: string): void {
    this.filteredStateList = this.stateList.filter((state: any) =>
      this.isSelectedState(state.id) || state.statename.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedState(stateId: any): boolean {
    return this.allSelectedStateList.some((selectedId: any) => selectedId === stateId);
  }
  filterDistricts(searchText: string): void {
    this.filteredDistrictList = this.districtList.filter((state: any) =>
      this.isSelectedDistrict(state.id) || state.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedDistrict(stateId: any): boolean {
    return this.allSelectedDistrictList.some((selectedId: any) => selectedId === stateId);
  }

  filterCities(searchText: string): void {
    this.filteredCityList = this.cityList.filter((state: any) =>
      this.isSelectedcity(state.id) || state.cityname.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedcity(stateId: any): boolean {
    return this.allSelectedCityList.some((selectedId: any) => selectedId === stateId);
  }

  filterLocations(searchText: string): void {
    this.filteredLocationList = this.locationList.filter((state: any) =>
      this.isSelectedlocation(state.id) || state.area.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedlocation(stateId: any): boolean {
    return this.allSelectedLocationList.some((selectedId: any) => selectedId === stateId);
  }

  filterRowData1(searchText: any) {
    console.log(searchText);
    this.rowData = this.rowDatafilter.filter((e: any) =>
      e.gst_no.toLowerCase().includes(searchText.toLowerCase()) || e.distributor.toLowerCase().includes(searchText.toLowerCase()) || e.distributorcode.toLowerCase().includes(searchText.toLowerCase()) || e.phone.toLowerCase().includes(searchText.toLowerCase()) || e.email.toLowerCase().includes(searchText.toLowerCase()) || e.username.toLowerCase().includes(searchText.toLowerCase()) || e?.state?.statename.toLowerCase().includes(searchText.toLowerCase()) || e.city.cityname.toLowerCase().includes(searchText.toLowerCase()) || e.location.area.toLowerCase().includes(searchText.toLowerCase()) || e.district.name.toLowerCase().includes(searchText.toLowerCase())

    );
    console.log(this.rowData);

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
  @ViewChild('selectContaint') selectContaint!: MatSelect;
  allSelectedComplaintTypes: any = 0;
  allSelectedComplaint = false;
  toggleAllSelectionComplaint() {
    if (this.allSelectedComplaint) {
      this.selectContaint.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectContaint.options.forEach((item: MatOption) => item.deselect());
    }

  }
  optionClickComplaint(event: any, state: any) {
    let newStatus = true;
    this.selectContaint.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedComplaint = newStatus;

  }

  filterComplaints(searchText: string): void {
    this.filterComplaintTypes = this.complaintTypes.filter((compiant: any) =>
      this.isSelectedGroup(compiant.id) || compiant.type.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedGroup(stateId: any): boolean {
    return this.allSelectedComplaintTypes.some((selectedId: any) => selectedId === stateId);
  }
  savePermission() {
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    let payload = {
      username: this.targetDistributor.username,
      permission: this.allSelectedComplaintTypes
    }
    this.clientService.changeDistributorPermission(payload).subscribe((res: any) => {
      this.alertToaster.showSuccess(res?.message);
      this.matDialog.closeAll();
      this.filterDistributorListByMultiple();
    }, err => {
      loader.close();
      this.alertToaster.showError(err?.error?.message)
    })
  }
}
// 
