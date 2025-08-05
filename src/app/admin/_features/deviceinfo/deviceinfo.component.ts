import { colors } from '@amcharts/amcharts4/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Injectable, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ColDef, ISelectCellEditorParams } from 'ag-grid-community';
import { Observable, map, startWith } from 'rxjs';
import { DeviceActivateBtnComponent } from 'src/app/_core/cellrenders/device-activate-btn/device-activate-btn.component';
import { ModelnameDropdownComponent } from 'src/app/_core/cellrenders/modelname-dropdown/modelname-dropdown.component';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { EditDeviceComponent } from 'src/app/_core/popups/edit-device/edit-device.component';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { ExportService } from 'src/app/_core/services/export.service';
import { PdfService } from 'src/app/_core/services/pdf.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';

export class Client {
  constructor(public username: string, public id: string) { }
}
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.scss']
})
export class DeviceinfoComponent implements OnInit {
  length!: number;
  distributor: any;
  selectClient: any = "All";
  countryCtrl!: UntypedFormControl;
  maxDate = new Date();
  filteredClients!: Observable<any[]>;
  gridApi: any;
  isDistributor = false;
  clientList!: Client[] | any;
  isMoblie = false;
  constructor(private clientService: ClientService, private exportService: ExportService, private renderer: Renderer2, private observer: BreakpointObserver, private matDialog: MatDialog, private excelService: ExcelService, private pdfService: PdfService, private tokenStorage: StorageService) {
  }
  public rowSelection: any = "multiple";
  ispinned(s: any) {
    if (s) {
      return null;
    } else {
      return "left";
    }
  }
  isAnyRowSelected: any = false;
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;

    }
  }
  ngOnInit(): void {
    this.getCustomerVersion();
    this.clientService.getStateListWithoutAll().subscribe(res => {
      // console.log(res);
      this.stateList = res;
      this.filteredStateList = res;

    })
    // console.log(this.tokenStorage.getUserRole());
    // console.log(this.tokenStorage.getDistributor()?.roles);
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      const sidebar = document.querySelector(".sidebar");
      if (res.matches) {
        this.isMoblie = true;

      } else {
        this.isMoblie = false;

      }
    });
    if (this.tokenStorage.getUserRole() == "DISTRIBUTOR" || this.tokenStorage.getDistributor()?.roles) {
      this.isDistributor = true;
    } else {
      this.isDistributor = false;
    }
    // console.log(this.isDistributor);

    this.getAllDeviceList();
    this.getAllClientList();
    this.getAllDeviceModel();

    this.countryCtrl = new UntypedFormControl();
    this.filteredClients = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((client: any) =>
        client ? this.filterClients(client) : this.clientList
      )
    );
    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', width: 100 },
      {
        headerName: 'Actions', width: this.isDistributor ? 100 : 140,
        cellRenderer: (params: any) => {
          const rowData = params.data;
          const editButton = document.createElement('button');
          editButton.innerHTML = '<i class="fa fa-edit fa-lg"></i>';
          editButton.style.backgroundColor = 'transparent';
          editButton.style.color = '#3085d6';
          editButton.style.border = 'none';
          editButton.style.cursor = 'pointer';
          // editButton.style.fontSize = "22px"
          editButton.addEventListener('click', () => {

            rowData.isDistributor = this.isDistributor;
            this.matDialog.open(EditDeviceComponent, {
              data: rowData
            })
          });
          const deleteButton = document.createElement('button');
          deleteButton.style.backgroundColor = 'transparent';
          deleteButton.style.border = 'none';
          deleteButton.style.marginLeft = '2px';
          deleteButton.style.marginBottom = '-12px';
          deleteButton.style.cursor = 'pointer';
          deleteButton.style.fontSize = "20px !important"
          if (!params.data.isdelete) {
            deleteButton.innerHTML = '<span class="material-icons" style="font-size:20px;">desktop_windows</span>';
            deleteButton.style.color = '#9EDE73';
          } else {
            deleteButton.innerHTML = '<span class="material-icons" style="font-size:20px;">desktop_access_disabled</span>';
            // deleteButton.style.color = '#9EDE73';
            deleteButton.style.color = '#F55C47';
          }
          deleteButton.addEventListener('click', () => {
            // console.log(rowData);
            let c = (params?.data?.isdelete ? "active " : "inactive ") + rowData?.username + '?';
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
                this.clientService.activateOrDeactivatedevice([rowData.id], !params?.data?.isdelete).subscribe((res: any) => {
                  Swal.fire({
                    title: !params?.data?.isdelete ? "activated" : "inactivated",
                    text: res.message,
                    icon: "success"
                  });
                  this.ngOnInit();
                  this.isAnyRowSelected = false;
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
          const otaTriggerBtn = document.createElement('button');
          otaTriggerBtn.style.backgroundColor = 'transparent';
          otaTriggerBtn.style.border = 'none';
          otaTriggerBtn.style.marginLeft = '2px';
          // otaTriggerBtn.style.marginBottom = '-12px';
          otaTriggerBtn.style.cursor = 'pointer';
          // otaTriggerBtn.style.fontSize = "20px !important";
          otaTriggerBtn.innerHTML = "<i class='fa fa-android fa-lg' ></i>";
          if (!params.data.is_ota_active) {
            otaTriggerBtn.style.color = '#F55C47';
          } else {
            otaTriggerBtn.style.color = '#32a85c';
          }
          otaTriggerBtn.addEventListener('click', () => {
            // console.log(rowData);
            let c = (!params?.data?.is_ota_active ? "Enable " : "Disable ") + rowData?.username + '?';
            Swal.fire({
              title: "Are you sure?",
              text: "Do you want to be Ota " + c,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: !params?.data?.is_ota_active ? "Yes, Enable!" : "Yes, Disable!"
            }).then((result) => {
              if (result.isConfirmed) {
                let v: any = [];
                v.push(rowData.id);
                let loader = this.matDialog.open(LoaderComponent, {
                  panelClass: 'loader-upload'
                })
                this.clientService.changeOtaStatusForDevice([rowData.id], !params?.data?.is_ota_active).subscribe((res: any) => {
                  Swal.fire({
                    title: !params?.data?.is_ota_active ? "Enabled" : "Disabled",
                    text: res.message,
                    icon: "success"
                  });
                  this.isAnyRowSelected = false;
                  loader.close();
                  this.ngOnInit();
                }, err => {
                  loader.close();
                  Swal.fire({
                    title: "Opps",
                    text: err?.error?.message,
                    icon: "error"
                  });
                })
              }
            });
          })
          const div = document.createElement('div');
          div.classList.add('d-flex')
          // div.classList.add('justify-content-between')
          div.appendChild(editButton);

          if (this.isDistributor) {

          } else {
            div.appendChild(deleteButton);
            div.appendChild(otaTriggerBtn)
          }
          return div;

        }
      },
      {
        headerName: 'Unique Number', field: 'username', pinned: this.ispinned(this.isMoblie), headerCheckboxSelection: this.isDistributor ? false : true, checkboxSelection: this.isDistributor ? false : true,
        cellStyle: params => {
          if (params.data.isandroid) {
            return { color: 'green' };
            //mark police cells as red
          } else {
            return { color: 'red' };
          }

        }, cellRenderer: (params: any) => {
          let v = `<span>${params.data.username}</span>`;

          if (params.data.expiration) {
            const expiration = new Date(params.data.expiration);
            const now = new Date();
            if (!isNaN(expiration.getTime()) && expiration >= now) {
              v = `<i title="subscribed the device" class='bx bx-lock'></i> <span>${params.data.username}</span>`;
            }
          }

          return v;
        }
      }, {
        headerName: 'Model-name',
        field: 'modelname',
        minWidth: 200,
        // editable: true,
        // cellEditor: 'agSelectCellEditor',
        // cellEditorParams: {
        //   values: this.modellist,
        //   valueListMaxHeight: 50,

        // },
        // onCellValueChanged: (event) => {
        //   // console.log(event);
        //   this.updateDeviceModelname(event.data.username, event.newValue)
        // }
      },

      {
        headerName: 'plan', field: 'area', valueGetter: (e) => {
          return e.data?.versionMaster?.version;
        },
        cellStyle: params => {
          if (params.data?.versionMaster?.version == "BASIC") {
            return { color: '#8ac926' };
          } else if (params.data?.versionMaster?.version == "LITE") {
            return { color: '#e83f6f' };
          } else {
            return { color: '#2274a5' };
          }
        }
      },
      // { headerName: 'Activity', field: 'isactive', cellRenderer: DeviceActivateBtnComponent },
      {
        headerName: 'Status', field: 'isactive', valueGetter: (params) => {
          // console.log(params.data);

          if (params?.data?.isactive) {
            return "approved"
          } else {
            return "pending"
          }

        }, cellStyle: params => {
          if (params.data.isactive) {
            return { color: '#378ced' };
          } else {
            return { color: '#eb9834' };
          }
          return null;
        }
      },
      // { headerName: 'Password', field: 'password' },
      { headerName: 'Client Name', field: 'clientname' },

      {
        headerName: 'Country', field: 'cityname', valueGetter: (params: any) => {
          if (params.data.country) {

            return params.data.country.countryname;
          } else {
            return "No Country";
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
      }, {
        headerName: 'District', field: 'district', minWidth: 250, valueGetter: (e) => {
          return e.data?.district?.name;
        }
      },
      {
        headerName: 'City', field: 'cityname', valueGetter: (params: any) => {

          if (params.data.city) {

            return params.data.city.cityname;
          } else {
            return "No City";
          }
        }
      },
      // { headerName: 'Pincode', field: 'pincode' },
      // { headerName: 'Mobile', field: 'mobile' },
      // { headerName: 'Android Id', field: 'androidId' },
      {
        headerName: 'Location', field: 'cityname', valueGetter: (params: any) => {
          if (params.data.location) {
            return params?.data?.location?.area;
          } else {
            return "N/A";
          }
        }
      },
      {
        headerName: 'Device Location', field: 'landmark', valueGetter: (params: any) => {

          if (params.data.landmark) {
            return params.data.landmark;
          } else {
            return "N/A";
          }
        }
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
      },
      {
        headerName: 'Status', field: 'isonline', valueGetter: (params: any) => {

          if (params.data.isonline) {
            return 'Online';
          } else {
            return "Offline";
          }
        }, cellStyle: params => {
          if (params.data.isonline) {
            //mark police cells as red
            return { color: 'green' };
          } else {
            return { color: 'red' };
          }

        }
      },
      { headerName: 'Expires on', field: 'expiration' },
      {
        headerName: 'Apk', field: 'apk',
      },
      {
        headerName: 'Apk updated on', field: 'apkupdate',
      },
      { headerName: 'Creationdate', field: 'creationdate' },
      { headerName: 'Updationdate', field: 'updateddate' },
      { headerName: 'Log Out', field: 'isandroid', cellRenderer: this.CellRendererBtn.bind(this) }
      // { headerName: 'isDeleted', field: 'isdelete' }
    ];
    if (!sessionStorage.getItem('loadedDevice')) {
      window.location.reload();
    }
    sessionStorage.setItem('loadedDevice', 'true');
  }

  modelnamelist: any = [];
  modellist: any = [];
  getAllDeviceModel() {
    this.clientService.getAllDeviceModel().subscribe((res: any) => {

      this.modelnamelist = res
      this.modelnamelist.forEach((element: any) => {
        // console.log(element);
        this.modellist.push(element.modelname)
      });
      // console.log(this.modellist);
    });



  }
  manageOtaTrigger(rowData: any) {
    let c = (!rowData?.is_ota_active ? "Enable " : "Disable ") + rowData?.username + '?';
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to be Ota " + c,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: !rowData?.is_ota_active ? "Yes, Enable!" : "Yes, Disable!"
    }).then((result) => {
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.changeOtaStatusForDevice([rowData.id], !rowData?.is_ota_active).subscribe((res: any) => {
          Swal.fire({
            title: !rowData?.is_ota_active ? "Enabled" : "Disabled",
            text: res.message,
            icon: "success"
          });
          loader.close();
          this.ngOnInit();
        }, err => {
          loader.close();
          Swal.fire({
            title: "Opps",
            text: err?.error?.message,
            icon: "error"
          });
        })
      }
    });
  }
  manageActivityNdOtaTrigger(type: any) {
    console.log(type);
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log("Selected Rows:", selectedRows);
      let DeviceIdList: any = [];
      selectedRows.forEach((e: any) => {
        DeviceIdList.push(e.id);
      });

      Swal.fire({
        title: "Are you sure?",
        html: `
          <style>
            .swal2-html-container {
              margin-bottom: 20px;
              display: block !important;
            }
            .custom-radio-group {
              text-align: center;
              display: flex !important;
              justify-content: center;
            }
            .custom-radio-group input[type="radio"] {
              margin-right: 10px;
            }
            .custom-radio-group label {
              margin-right: 20px;
              font-size: 16px;
            }
          </style>
          <p>${type === 'ota' ? 'Do you want to enable/disable OTA for selected devices?' : 'Do you want to activate/deactivate selected devices?'}</p>
          <div class="custom-radio-group">
          <div>
          <input type="radio" id="enable" name="status" value="${type === 'ota' ? 'true' : 'false'}" checked>
            <label for="enable">${type === 'ota' ? 'Enable' : 'Activate'}</label><br>
          </div>
          <div>
          <input type="radio" id="disable" name="status" value="${type === 'ota' ? 'false' : 'true'}">
            <label for="disable">${type === 'ota' ? 'Disable' : 'Inactivate'}</label>
          </div>
            
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Do It",
        preConfirm: () => {
          const selectedOption = (document.querySelector('input[name="status"]:checked') as HTMLInputElement);
          if (!selectedOption) {
            Swal.showValidationMessage('Please select an option');
            return false;
          }
          return selectedOption.value;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(result);
          let loader = this.matDialog.open(LoaderComponent, {
            panelClass: 'loader-upload'
          });
          const selectedOption = result.value;

          if (type === 'ota') {
            this.clientService.changeOtaStatusForDevice(DeviceIdList, selectedOption).subscribe((res: any) => {
              console.log(res);
              loader.close();
              Swal.fire({
                title: "Success",
                text: res?.message,
                icon: "success"
              });
              this.isAnyRowSelected = false;
              this.ngOnInit();
            }, err => {
              loader.close();
              Swal.fire({
                title: "Oops",
                text: err?.error?.message,
                icon: "error"
              });
            });
          } else if (type === 'activity') {
            this.clientService.activateOrDeactivatedevice(DeviceIdList, selectedOption).subscribe((res: any) => {
              console.log(res);
              loader.close();
              Swal.fire({
                title: "Success",
                text: res?.message,
                icon: "success"
              });
              this.isAnyRowSelected = false;
              this.ngOnInit();
            }, err => {
              loader.close();
              Swal.fire({
                title: "Oops",
                text: err?.error?.message,
                icon: "error"
              });
            });
          }
        }
      });
    }


  }

  onclickEdit(rowData: any) {
    rowData.isDistributor = this.isDistributor;
    this.matDialog.open(EditDeviceComponent, {
      data: rowData
    })
  }
  getAllClientList() {
    if (this.isDistributor) {
      const user = this.tokenStorage.getUser();
      if (user.roles[0] == "ROLE_DISTRIBUTOR") {
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
          // console.log(res);
          this.selectDistributor = res;
          this.getAllClientByDistributor(this.selectDistributor);
          this.clientService.getClientListByDistributorId(res?.id).subscribe((res: any) => {
            // console.log(res);
            this.clientList = res;
            this.clientList1 = res;
            this.filteredListClient = res;
            this.filteredClients = this.countryCtrl.valueChanges.pipe(
              startWith(''),
              map((client: any) =>
                client ? this.filterClients(client) : Slice(this.clientList)
              )
            );
          })
        })
      }
      else {
        const di = this.tokenStorage.getDistributor();
        this.clientService.getdistributorByUsername(di.username).subscribe((res: any) => {
          // console.log(res);
          this.selectDistributor = res;
          this.getAllClientByDistributor(this.selectDistributor);
          this.clientService.getClientListByDistributorId(res?.id).subscribe((res: any) => {
            // console.log(res);
            this.clientList1 = res;
            this.filteredListClient = res;
            this.clientList = res;
            this.filteredClients = this.countryCtrl.valueChanges.pipe(
              startWith(''),
              map((client: any) =>
                client ? this.filterClients(client) : Slice(this.clientList)
              )
            );
          })
        })
      }
    } else {
      this.clientService.getAllClientList().subscribe((res: any) => {
        // console.log(res);
        this.clientList1 = res;
        this.filteredListClient = res;
        this.clientList = res;
        this.filteredClients = this.countryCtrl.valueChanges.pipe(
          startWith(''),
          map((client: any) =>
            client ? this.filterClients(client) : Slice(this.clientList)
          )
        );
      })
    }

  }
  onChooseClient(clientname: any) {
    this.selectClient = clientname;
    this.clientService.getdeviceListbyclientusername(clientname).subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      this.rowDatafilter = res;

    })
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, cellClass: 'locked-col', width: 100 },
    {
      headerName: 'Edit', minWidth: 80,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-edit"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'blue';
        editButton.style.border = 'none';
        editButton.style.cursor = 'pointer';
        editButton.style.fontSize = "24px"
        editButton.addEventListener('click', () => {
          const rowData = params.data;
          rowData.isDistributor = this.isDistributor;
          this.matDialog.open(EditDeviceComponent, {
            data: rowData
          })
        });
        return editButton;
      }
    },
    {
      headerName: 'Unique Number', field: 'username',
      cellStyle: params => {
        if (params.data.isandroid) {
          return { color: 'green' };
          //mark police cells as red
        } else {
          return { color: 'red' };
        }

      },cellRenderer: (params: any) => {
        let v = `<span>${params.data.username}</span>`;

        if (params.data.expiration) {
          const expiration = new Date(params.data.expiration);
          const now = new Date();
          if (!isNaN(expiration.getTime()) && expiration >= now) {
            v = `<i title="subscribed the device" class='bx bxl-sketch'></i> <span>${params.data.username}</span>`;
          }
        }
        
        return v;
      }
    }, {
      headerName: 'Model-name',
      field: 'modelname',
      minWidth: 200,
      // editable: true,
      // cellEditor: 'agSelectCellEditor',
      // cellEditorParams: {
      //   values: this.modellist,
      //   valueListMaxHeight: 50,

      // },
      // onCellValueChanged: (event) => {
      //   // console.log(event);
      //   this.updateDeviceModelname(event.data.username, event.newValue)
      // }
    },

    {
      headerName: 'plan', field: 'area', valueGetter: (e) => {
        return e.data?.versionMaster?.version;
      },
      cellStyle: params => {
        if (params.data?.versionMaster?.version == "BASIC") {
          return { color: '#8ac926' };
        } else if (params.data?.versionMaster?.version == "LITE") {
          return { color: '#e83f6f' };
        } else {
          return { color: '#2274a5' };
        }
      }
    },
    // { headerName: 'Activity', field: 'isactive', cellRenderer: DeviceActivateBtnComponent },
    {
      headerName: 'Status', field: 'isactive', valueGetter: (params) => {
        // console.log(params.data);

        if (params?.data?.isactive) {
          return "approved"
        } else {
          return "pending"
        }

      }, cellStyle: params => {
        if (params.data.isactive) {
          return { color: '#378ced' };
        } else {
          return { color: '#eb9834' };
        }
        return null;
      }
    },
    // { headerName: 'Password', field: 'password' },
    { headerName: 'Client Name', field: 'clientname' },
    {
      headerName: 'Country', field: 'cityname', valueGetter: (params: any) => {
        if (params.data.country) {

          return params.data.country.countryname;
        } else {
          return "No Country";
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
    {
      headerName: 'District', field: 'district', minWidth: 250, valueGetter: (e) => {
        return e.data?.district?.name;
      }
    },
    {
      headerName: 'City', field: 'cityname', valueGetter: (params: any) => {

        if (params.data.city) {

          return params.data.city.cityname;
        } else {
          return "No City";
        }
      }
    },
    // { headerName: 'Pincode', field: 'pincode' },
    // { headerName: 'Mobile', field: 'mobile' },
    // { headerName: 'Android Id', field: 'androidId' },
    {
      headerName: 'Location', field: 'cityname', valueGetter: (params: any) => {
        if (params.data.location) {
          return params?.data?.location?.area;
        } else {
          return "N/A";
        }
      }
    },
    {
      headerName: 'Landmark', field: 'landmark', valueGetter: (params: any) => {

        if (params.data.landmark) {
          return params.data.landmark;
        } else {
          return "N/A";
        }
      }
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
    },
    {
      headerName: 'Status', field: 'isonline', valueGetter: (params: any) => {

        if (params.data.isonline) {
          return 'Online';
        } else {
          return "Offline";
        }
      }, cellStyle: params => {
        if (params.data.isonline) {
          //mark police cells as red
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }

      }
    },

    {
      headerName: 'Apk', field: 'apk',
    },
    {
      headerName: 'Apk updated on', field: 'apkupdate',
    },
    { headerName: 'Creationdate', field: 'creationdate' },
    { headerName: 'Updationdate', field: 'updateddate' },
    { headerName: 'Log Out', field: 'isandroid', cellRenderer: this.CellRendererBtn.bind(this) }
    // { headerName: 'isDeleted', field: 'isdelete' }
  ];

  CellRendererBtn(params: any): HTMLElement {
    const button = this.renderer.createElement('button');

    this.renderer.addClass(button, 'mat-raised-button');
    this.renderer.setStyle(button, 'background', 'transparent');
    this.renderer.setStyle(button, 'margin', '0px 15%');
    this.renderer.setStyle(button, 'width', '50%');
    this.renderer.setStyle(button, 'line-height', '1.8');
    this.renderer.setStyle(button, "padding", "0px 5px")
    // this.renderer.setStyle(button, 'font-weight', '600');

    if (!params.data?.isandroid) {
      this.renderer.setStyle(button, 'color', 'RED');
      this.renderer.setStyle(button, 'border', '1px RED solid');
      this.renderer.setProperty(button, 'innerText', 'N/A');
      this.renderer.setAttribute(button, "disabled", "true");
    } else {
      this.renderer.setStyle(button, 'color', 'green');
      this.renderer.setStyle(button, 'border', '1px green solid');
      if (this.isDistributor) {
        this.renderer.setProperty(button, 'innerText', 'Logged In');
        button.disabled = true;

      } else {
        this.renderer.setProperty(button, 'innerText', 'Log out');
      }
    }
    this.renderer.listen(button, 'click', () => {
      this.logOutDevice(params?.data?.username);
    });
    const div = this.renderer.createElement('div');
    this.renderer.appendChild(div, button);

    return div;
  }
  logOutDevice(data: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.logOutDevice(data).subscribe((res: any) => {
          // console.log(res);
          Swal.fire({
            title: "logged Out!",
            text: res?.message,
            icon: "success"
          });
          this.ngOnInit();
        }, err => {
          Swal.fire({
            title: "Oops!",
            text: err?.error?.message,
            icon: "error"
          });
        })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Your Device is safe :)",
          icon: "error"
        });
      }
    });

  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 12,
    pagination: true,

  }
  rowData: any = []
  rowDatafilter: any = []
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    // this.getAllDeviceList();
    // this.getAllDeviceModel();
    // this.filterDeviceList();
  }
  updateDeviceModelname(deviceno: any, modelname: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change the model name!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.updateDeviceModelname(deviceno, modelname).subscribe((res: any) => {
          // console.log(res);
          Swal.fire({
            title: "Changed!",
            text: res.message,
            icon: "success"
          });
        })

      }
    });
  }
  getAllDeviceList() {
    if (this.isDistributor) {
      const user = this.tokenStorage.getUser();
      if (user.roles[0] == "ROLE_DISTRIBUTOR") {
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
          // console.log(res);
          this.distributor = res;
          this.selectedDistributor = this.distributor;
          this.allSelectedDistributorList = [this.distributor?.id];
          this.rowData = [];
          // this.filterDeviceList();
          this.getAllClientByDistributorList();
          this.clientService.getTotalDevicesByDistributorId(res.id).subscribe((res: any) => {
            // console.log(res);
            this.rowData = res;
            this.rowDatafilter = res;
            // this.gridApi.setRowData(res);
          })
        })
      } else {
        const di = this.tokenStorage.getDistributor();
        this.clientService.getdistributorByUsername(di.username).subscribe((res: any) => {
          // console.log(res);
          this.distributor = res;
          this.selectedDistributor = this.distributor;
          this.allSelectedDistributorList = [this.distributor?.id]
          this.rowData = [];
          // this.filterDeviceList();
          this.getAllClientByDistributorList();
          this.clientService.getTotalDevicesByDistributorId(res.id).subscribe((res: any) => {
            // console.log(res);
            this.rowData = res;
            this.rowDatafilter = res;
            // this.gridApi.setRowData(res);
          })
        })
      }
    } else {
      this.clientService.getAllDevicesList().subscribe((res: any) => {
        // console.log('res');
        this.rowData = res;
        this.rowDatafilter = res;
        // this.gridApi.setRowData(res);
      })
    }
    // this.userService.getDeviceByAdroidId().subscribe((res: any) => {
    //   console.log(res);
    //   // this.rowData = res;
    // })

    // console.log(this.allSelectedDistributorList);
    this.getDistibutorList();
  }
  onQuickFilterChanged() {
    // console.log(this.gridApi);
    this.gridApi.setQuickFilter((document.getElementById('quickFilter') as HTMLInputElement).value);
  }

  filterClients(username: string) {
    let arr = this.clientList.filter(
      (client: any) => client.username.toLowerCase().indexOf(username.toLowerCase()) === 0
    );

    return arr.length ? arr : [{ username: 'No Item found', code: 'null' }];
  }
  clearCountryCtrl() {
    this.countryCtrl.setValue("");
    this.getAllDeviceList();
  }
  fromdate: any = "null";
  todate: any = "null";
  fdate: any;
  tdate: any;

  exportAsExcelFile1() {
    const title = capitalize(this.selectClient) + ' Device Details';
    let data = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        "Unique Number": obj.username,
        "State": state(obj.state),
        "City": city(obj.city),
        "Location": getSomething(obj.location),
        "Landmark": getSomething(obj.landmark),
        "Orientation": getOrientation(obj.height_width),
        "Status": formatOnline(obj.isonline),
        // 'Active ': obj.isactive,
        "Creationdate": obj.creationdate,
        "Updateddate": obj.updateddate

      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "35", c: "15", d: "15", e: "15", f: "15", g: "10", h: "25", i: "25", }
    let titleMerge = "'B1':'H4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'I1':'I4'";
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
    // this.excelService.exportAsExcelFile(data,title);
  }

  exportPdf() {
    // console.log(this.selectedActive);
    let address;
    // console.log(this.isDistributor);
    if (this.isDistributor) {
      address = "\n" + this.distributor.location.area + ",\n" + this.distributor.city.cityname + ",\n" + this.distributor.district.name + ",\n" + this.distributor.state.statename + ",\n" + this.distributor?.country?.countryname + "."
    } else {
      address = ` \nYash Electronics,
      Babosa Industrial Park, BLDG.NO-A4,
      1 st Floor Unit No-100-108 Saravali village,
      Near Vatika Hotel, Nashik Highway(NH-3),
      Bhiwandi – 4121302.`
    }


    let selectedDistributor = this.rowData[0]?.distributor;
    let selectedClient = this.rowData[0]?.clientname;
    let selectedState = this.rowData[0]?.state?.statename;
    let selectedDistrict = this.rowData[0]?.district?.name;
    let selectedCity = this.rowData[0]?.city?.cityname;
    let selectedLocation = this.rowData[0]?.location?.area;
    let selectedVersion = this.rowData[0]?.versionMaster?.version;
    let filterList: any = {
      distributor: this.allSelectedDistributorList.length == 1 ? selectedDistributor : this.allSelectedDistributorList.length == 0 ? "" : "Multiple",
      client: this.allSelectedClientList.length == 1 ? selectedClient : this.allSelectedClientList.length == 0 ? "" : "Multiple",
      state: this.allSelectedStateList.length == 1 ? selectedState : this.allSelectedStateList.length == 0 ? "" : "Multiple",
      district: this.allSelectedDistrictList.length == 1 ? selectedDistrict : this.allSelectedDistrictList.length == 0 ? "" : "Multiple",
      city: this.allSelectedCityList.length == 1 ? selectedCity : this.allSelectedCityList.length == 0 ? "" : "Multiple",
      location: this.allSelectedLocationList.length == 1 ? selectedLocation : this.allSelectedLocationList.length == 0 ? "" : "Multiple",
      isactive: this.selectedActive?.name,
      isonline: this.selectedIsonline?.name,
      orientation: this.selectedOrientation?.name,
      plan: this.allSelectedVersionList.length == 1 ? selectedVersion : this.allSelectedVersionList.length == 0 ? "" : "Multiple",
      fromdate: this.fromdate,
      todate: this.todate
    }

    const title = 'Device Information';

    let dataFields = [
      "Distributor",
      "Clientname",
      "Unique",
      "Modelname",
      'State',
      'District',
      'City',
      "Location",
      "Plan",
      "Orientation",
      "Activity",
      "Status",
      "Apkupdate",
      "Createdby",
      "Creationdate",
    ];
    let field: any = [];
    for (let e of dataFields) {

      // if (e === "distributor") {
      //   if (this.selectDistributor.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "address") {
      //   if (this.selectedState.id != 0) {
      //     continue;
      //   }
      //   if (this.selectedDistrict.id != 0) {
      //     continue;
      //   }
      //   if (this.selectedCity.id != 0) {
      //     continue;
      //   }
      //   if (this.selectedLocation.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "Orientation") {
      //   if (this.selectedOrientation.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "status") {
      //   if (this.selectedIsonline.id != "null") {
      //     continue;
      //   }
      // }

      // if (e === "plan") {
      //   if (this.selectedVersion.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "activity") {
      //   if (this.selectedActive.id != "null") {
      //     continue;
      //   }
      // }
      field.push(e);
    }
    let data1: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Clientname': obj?.clientname,
        'Unique': obj?.password,
        // "Phone": obj?.phone,
        "Modelname": obj.modelname,
        "Orientation": obj.height_width == "9:16" ? "vertical" : "horizontal",
        'Email': obj?.email,
        'Plan': obj?.versionMaster?.version,
        'Createdby': obj?.createdby,
        'Distributor': obj?.distributor,
        // 'country': obj?.country?.countryname,
        // 'address': `State :` + obj?.state?.statename + " \n\n" + `district :` + obj?.district?.name + " \n\n" + `city :` + obj?.city?.cityname + " \n\n" + `location :` + obj?.location?.area,
        'State': obj?.state?.statename,
        'District': obj?.district?.name,
        'City': obj?.city?.cityname,
        "Location": obj?.location?.area,
        // 'zipcode': obj?.zipcode,
        "Activity": obj?.isactive,
        "Status": obj?.isonline ? "online" : "offline",
        "Apkupdate": obj?.apkupdate,
        'Creationdate': obj?.creationdate,
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
      columns: field,
      columnsdataFields: field,
      filterList: filterList,
      address: address
    }
    this.exportService.generateDevicePDF(data);
  }

  exportAsExcelFile() {
    const title = 'Device Information';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Distributor': obj?.distributor,
        'Clientname': obj?.clientname,
        'Unique': obj?.password,
        // "Phone": obj?.phone,
        "Modelname": obj.modelname,
        Orientation: obj.height_width == "9:16" ? "vertical" : "horizontal",
        // 'email': obj?.email,
        'Plan': obj?.versionMaster?.version,
        'Createdby': obj?.createdby,
        // 'country': obj?.country?.countryname,
        // 'address':  `State :` + obj?.state?.statename + " \n\n" + `district :` + obj?.district?.name + " \n\n" + `city :` + obj?.city?.cityname + " \n\n" + `location :` + obj?.location?.area,
        'State': obj?.state?.statename,
        'District': obj?.district?.name,
        'City': obj?.city?.cityname,
        "Location": obj?.location?.area,
        // 'zipcode': obj?.zipcode,
        "Activity": obj?.isactive ? "active" : "inactive",
        "Status": obj?.isonline ? "online" : "offline",
        "Apkupdate": obj?.apkupdate,
        'Creationdate': obj?.creationdate,
      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "15", c: "15", d: "20", e: "15", f: "15", g: "35", h: "25", i: "25", j: "25", k: "35", l: "15", m: "15", n: "15", o: "25", p: "25" }
    let titleMerge = "'B1':'N4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'O1':'P4'";
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
  activateOrDeactivatedevice(payload: any) {
    let c = (payload.isdelete ? "active " : "inactive ") + payload?.username + '?';
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to be " + c,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: payload?.isdelete ? "Yes, active!" : "Yes, inactive!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.activateOrDeactivatedevice([payload.id], !payload?.isdelete).subscribe((res: any) => {
          Swal.fire({
            title: !payload?.isdelete ? "activated" : "inactivated",
            text: res.message,
            icon: "success"
          });
          this.ngOnInit();
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
  // Mulltiple====
  allSelectedStateList: any = [];
  allSelectedDistributorList: any = [];
  allSelectedDistrictList: any = [];
  allSelectedCityList: any = [];
  allSelectedLocationList: any = [];
  allSelectedClientList: any = [];
  allSelectedVersionList = [];
  allSelectedState = false;
  allSelectedDistrict = false;
  allSelectedCity = false;
  allSelectedLocation = false;
  allSelectedDistributor = false;
  allSelectedVersion = false;
  allSelectedClient = false;
  @ViewChild('selectVersion') selectVersion!: MatSelect;
  @ViewChild('selectDistributor') selectDistributor!: MatSelect;
  @ViewChild('selectState') selectState!: MatSelect;
  @ViewChild('selectCity') selectCity!: MatSelect;
  @ViewChild('selectLocation') selectLocation!: MatSelect;
  @ViewChild('selectDistrict') selectDistrict!: MatSelect;
  @ViewChild('selectClient') selectClient1!: MatSelect;

  // selectedState: any;
  // selectedDistrict: any;
  // selectedCity: any;
  // selectedLocation: any;
  // selectedDistributor:any;
  toggleAllSelectionForVersion() {
    if (this.allSelectedVersion) {
      this.selectVersion.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectVersion.options.forEach((item: MatOption) => item.deselect());

    }

  }
  optionClickVersion(version: any) {
    let newStatus = true;
    this.selectVersion.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });

    this.selectedVersion = version;
    this.allSelectedVersion = newStatus;
    this.filterDeviceList();
  }
  toggleAllSelectionForClient() {
    if (this.allSelectedClient) {
      this.selectClient1.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectClient1.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedStateList = [];
      this.allSelectedDistrictList = [];
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];

    }
    // this.getStatelistByClient()
    this.getStatelistByClient();
    this.getDistrictbyStatelist();
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();

  }
  optionClickClient(client: any) {
    let newStatus = true;
    this.selectClient1.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });

    this.selectedClient = client;
    // console.log(this.selectedClient);
    // this.getStatelistByClient()
    this.allSelectedClient = newStatus;
    this.allSelectedStateList = [];
    this.allSelectedDistrictList = [];
    this.allSelectedCityList = [];
    this.allSelectedLocationList = [];
    this.getStatelistByClient();
    this.getDistrictbyStatelist();
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
  }
  toggleAllSelectionForDistributor() {
    if (this.allSelectedDistributor) {
      this.selectDistributor.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDistributor.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedClientList = [];
      this.allSelectedStateList = [];
      this.allSelectedCityList = [];
      this.allSelectedDistrictList = [];
      this.allSelectedLocationList = [];
    }
    this.getAllClientByDistributorList();
    this.getStatelistByClient();
    this.getDistrictbyStatelist();
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
  }
  optionClickDistributor(state: any) {
    let newStatus = true;
    this.selectDistributor.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedClientList = [];
    this.allSelectedStateList = [];
    this.allSelectedCityList = [];
    this.allSelectedDistrictList = [];
    this.allSelectedLocationList = [];
    this.selectedDistributor = state;
    this.allSelectedDistributor = newStatus;

    this.getAllClientByDistributorList();
    this.getStatelistByClient();
    this.getDistrictbyStatelist();
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();


  }
  toggleAllSelectionForState() {
    if (this.allSelectedState) {
      this.selectState.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectState.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedDistrictList = [];
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];
    }
    this.getDistrictbyStatelist();
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
  }
  optionClickState(state: any) {
    let newStatus = true;
    this.selectState.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });

    this.allSelectedDistrictList = [];
    this.allSelectedCityList = [];
    this.allSelectedLocationList = [];
    this.selectedState = state;
    this.getDistrictbyStatelist();
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
    this.allSelectedState = newStatus;

  }
  toggleAllSelectionForDistrict() {
    if (this.allSelectedDistrict) {
      this.selectDistrict.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDistrict.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedLocationList = [];
    }

    // this.getCityListByDistrictList();
    // this.getLocationListByCityList()
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
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
    // this.getLocationListByCityList();
    // this.getCityListByDistrictList();
    this.allSelectedDistrict = newStatus;
    this.getCitybyDistrictList();
    this.getLocationByStateAndCity();
  }
  toggleAllSelectionForCity() {
    if (this.allSelectedCity) {
      this.selectCity.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectCity.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedLocationList = [];
    }
    // this.getLocationListByCityList()
    this.getLocationByStateAndCity();
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
    // this.getAllLocationByCityListByMultipleForDestributor()
    this.getLocationByStateAndCity();
  }
  toggleAllSelectionForLocation() {
    if (this.allSelectedLocation) {
      this.selectLocation.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectLocation.options.forEach((item: MatOption) => item.deselect());
    }

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
    this.filterDeviceList();
  }
  // filter==============
  selectedDistributor: any = { id: 0 }
  selectedClient: any = { id: 0, username: 0 };
  selectedState: any = { id: 0 };
  selectedDistrict: any = { id: 0 };
  selectedCity: any = { id: 0 }
  selectedLocation: any = { id: 0 };
  selectedVersion: any = { id: 0 };
  selectedOrientation: any = { id: 0 }
  selectedActive: any = { id: '2' }
  selectedIsonline: any = { id: '2', value: "null" }
  public onlineList = [{ id: 2, name: 'All' }, { id: 1, name: 'online' }, { id: 0, name: 'offline' }];
  public filteredOnlineList = this.onlineList.slice();
  public orientationList = [{ id: 0, name: 'All' }, { id: "9:16", name: 'Vertical' }, { id: "16:9", name: 'Horizontal' }];
  public filteredOrientationList = this.orientationList.slice();
  public activeList = [{ id: 2, name: 'All' }, { id: 1, name: 'active', value: true }, { id: 0, name: 'inactive', value: false }];
  public filteredActiveList = this.activeList.slice();
  distributorList: any = [];
  public filteredDistributorList = this.distributorList.slice();
  clientList1: any = [];
  public filteredListClient = this.clientList1.slice();
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


  getDistibutorList() {
    this.clientService.getDistibutorForClientFilter().subscribe((res: any) => {
      // console.log(res);
      this.distributorList = res;
      this.filteredDistributorList = res;
    })
    // this.filterDeviceList();
  }
  getAllClientByDistributor(event: any) {
    // console.log(event);
    this.selectDistributor = event;
    this.clientService.getClientListByDistributorId(event.id).subscribe(res => {
      // console.log(res);
      this.clientList1 = res;
      this.filteredListClient = res;
    })
    this.filterDeviceList();
  }
  getAllClientByDistributorList() {

    let payload = {
      "distributorlist": this.allSelectedDistributorList
    }
    this.clientService.getClientListByDistributorList(payload).subscribe(res => {
      // console.log(res);
      this.clientList1 = res;
      this.filteredListClient = res;
    })
    this.filterDeviceList();
  }
  getStatelistByClient() {
    // this.selectedClient = client;
    // let payload = [client?.id]

    this.clientService.getStatelistByClient(this.allSelectedClientList).subscribe(res => {
      // console.log(res);
      this.stateList = res;
      this.filteredStateList = res;
    })
    this.filterDeviceList();
  }
  getDistrictbyStatelist() {

    let payload = {
      state_list: this.allSelectedStateList,
      client_list: this.allSelectedClientList
    }
    this.clientService.getDistrictListByStateIdList(payload).subscribe(res => {
      // console.log(res);
      this.districtList = res;
      this.filteredDistrictList = res;
    })
    this.filterDeviceList();
  }

  getCitybyDistrictList() {
    // this.selectedDistrict = district;
    let payload = {
      district_list: this.allSelectedDistrictList,
      client_list: this.allSelectedClientList
    }
    this.clientService.getCityListByDistrictList(payload).subscribe(res => {
      // console.log(res);
      this.cityList = res;
      this.filteredCityList = res;
    })
    this.filterDeviceList();
  }
  getLocationByStateAndCity() {
    let payload = {
      city_list: this.allSelectedCityList,
      client_list: this.allSelectedClientList
    }
    this.clientService.getLocationByStateAndCity(payload).subscribe(res => {
      // console.log(res);
      this.locationList = res;
      this.filteredLocationList = res;
    })
    this.filterDeviceList();
  }
  getCustomerVersion() {
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      this.versionList = res;
      // let v = { id: 0, version: "All" }
      // this.versionList.push(v);
      this.filteredVersionList = this.versionList;
    })
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
    this.filterDeviceList();
  }

  getLocation(location: any) {
    this.selectedLocation = location;
    this.filterDeviceList();
  }

  getOrientation(location: any) {

    this.selectedOrientation = location;
    this.filterDeviceList();
  }
  getActive(location: any) {
    this.selectedActive = location;
    this.filterDeviceList();
  }
  getVersion(location: any) {
    this.selectedVersion = location;
    this.filterDeviceList();
  }
  getOnline(e: any) {
    this.selectedIsonline = e;
    this.filterDeviceList();
  }
  filterDeviceList() {
    // console.log("asgjgf" + this.allSelectedDistributorList);

    let payload = {
      "distributorlist": this.allSelectedDistributorList,
      "statelist": this.allSelectedStateList,
      "districtlist": this.allSelectedDistrictList,
      "citylist": this.allSelectedCityList,
      "locationlist": this.allSelectedLocationList,
      "versionlist": this.allSelectedVersionList,
      "fromdate": this.fromdate,
      "todate": this.todate,
      "isactive": this.selectedActive?.id,
      "height_width": this.selectedOrientation?.id,
      "clientlist": this.allSelectedClientList,
      "isonline": this.selectedIsonline?.id

    }
    // console.log(payload);

    // let payload: any = {
    //   distributorid: this.selectDistributor?.id,
    //   clientname: this.selectedClient?.username,
    //   stateid: this.selectedState?.id,
    //   districtid: this.selectedDistrict?.id,
    //   cityid: this.selectedCity?.id,
    //   locationid: this.selectedLocation?.id,
    //   height_width: this.selectedOrientation?.id,
    //   isactive: this.selectedActive?.id,
    //   isonline: this.selectedIsonline?.id,
    //   versionid: this.selectedVersion?.id,
    //   fromdate: this.fromdate,
    //   todate: this.todate
    // }
    // console.log(payload);
    // this.clientService.filterDeviceList(payload).subscribe(res => {
    //   this.rowData = res;
    // })
    this.rowData = [];
    this.clientService.filterDeviceListByMultiple(payload).subscribe(res => {
      this.rowData = res;
      this.rowDatafilter = res;
    })
  }

  filterDistributors(searchText: string): void {
    this.filteredDistributorList = this.distributorList.filter((state: any) =>
      this.isSelectedDistributor(state.id) || state.distributor.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedDistributor(stateId: any): boolean {
    return this.allSelectedDistributorList.some((selectedId: any) => selectedId === stateId);
  }

  filterCustomers(searchText: string): void {
    console.log(searchText);
    console.log(this.clientList1);

    this.filteredListClient = this.clientList1.filter((state: any) =>
      this.isSelectedCustomer(state.id) || state.clientname.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedCustomer(stateId: any): boolean {
    return this.allSelectedClientList.some((selectedId: any) => selectedId === stateId);
  }
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

function Slice(list: any) {
  // console.log(list);onQuickFilterChanged

  let clientList: [] = list.slice()
  return clientList;
}

function capitalize(word: any) {
  return word
    .toLowerCase()
    .replace(/\w/, (firstLetter: any) => firstLetter.toUpperCase());
}

function city(params: any) {
  if (params.cityname) {
    return params.cityname;
  } else {
    return "No City";
  }
}
function state(params: any) {
  // console.log(params);

  if (params.statename) {

    return params.statename;
  } else {
    return "No State";
  }
}

function getOrientation(height_width: any) {

  if (height_width) {
    let v = height_width;
    v = v.substring(2);
    if (v == 16) {
      return 'Vertical';
    } else {
      return 'Horizental';
    }
  } else {
    return "N/A";
  }
}
function getSomething(data: any) {
  if (data) {
    return data;
  } else {
    return "N/A";
  }
}

function formatOnline(data: any) {
  if (data) {
    return "Online";
  } else {
    return "Offline";
  }
}
