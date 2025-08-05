import { Component, ElementRef, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { ColDef } from 'ag-grid-community';
import { AlertService } from 'src/app/_core/services/alert.service';
import { CostumerActivateBtnComponent } from 'src/app/_core/cellrenders/costumer-activate-btn/costumer-activate-btn.component';
import { MatDialog } from '@angular/material/dialog';
import { EditCustomerComponent } from 'src/app/_core/popups/edit-customer/edit-customer.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ExportService } from 'src/app/_core/services/export.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { map, Observable, startWith } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  @ViewChild('swap') swap: TemplateRef<any> | any;
  gridApi: any;
  groupname = new FormControl('', [Validators.required]);
  signInForm!: UntypedFormGroup;
  distributor: any;
  isDistributor = false;
  maxDate = new Date();
  swapdistributorList: any = [];
  swapFiletereddistributorList = this.swapdistributorList.slice();
  fromdate: any = "null";
  todate: any = "null";
  isDeveloper: any;
  constructor(private matDialog: MatDialog, private exportService: ExportService, private excelService: ExcelService, private observer: BreakpointObserver, private clientService: ClientService, private alertToaster: AlertService, private router: Router, private fb: UntypedFormBuilder, private authService: AuthService, private tokenStorage: StorageService) { }
  cellClickedEvent(client: any) {
    // console.log(client.data);
    // console.log("cellClickedEvent");
    let user = this.tokenStorage.getUser();
    // console.log(user.roles.includes('ROLE_ADMIN'));
    if (!user.roles.includes('ROLE_ADMIN')) {

    } else {
      this.signInForm = this.fb.group({
        username: [client.data.username, Validators.required],
        password: [client.data.password, Validators.required],
      });
      // console.log(this.signInForm.value);

      this.authService.login(this.signInForm.value).subscribe((res: any) => {
        // console.log(res);
        this.tokenStorage.saveClient(res);
        const user = this.tokenStorage.getClient();
        let roles = user.roles;
        // console.log(roles);
        let isClient = roles.includes('ROLE_CLIENT');
        // console.log(isClient);

        if (isClient) {
          this.clientService.getClientByUsername(user.username).subscribe((res: any) => {
            // console.log(res);
            if (res.versionMaster.version == "BASIC") {
              this.router.navigate(['client/screen']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['client/client-dashboard']).then(() => {
                window.location.reload();
              });
            }
          })
          // this.router.navigate(['client/client-dashboard']).then(() => {
          //   window.location.reload();
          // });
        } else {
          alert("Invalid User")
        }
      }, err => {
        this.alertToaster.showError(err?.error?.message);
        // this.alertToaster.showError("Costumer is Not Activated");
      });
    }
  }
  isMoblie = false;
  ispinned(s: any) {
    // console.log("ismo" + s);

    if (s) {
      return null;
    } else {
      return "left";
    }
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,

      minWidth: 180,
      floatingFilter: true
    },
    pagination: true,
    paginationPageSize: 13,
    autoHeight: true,
    onGridReady: (event: any) => event.api.sizeColumnsToFit()
  }
  rowData: any = []
  rowDatafilter: any = [];
  isAnyRowSelected: any = false;
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
    }
  }
  ngOnInit(): void {
    let v = this.tokenStorage.getDev();
    if (v?.username && v?.roles[0].includes('DEVELOPER')) {
      this.isDeveloper = true;
    } else {
      this.isDeveloper = false;
    }
    this.filteredGroupOptions = this.groupname.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.clientService.getStateListByDistributorid(this.selectedDistributor?.id).subscribe(res => {
      this.stateList = res;
      this.filteredStateList = res;
    })
    this.getCustomerVersion()
    if (this.tokenStorage.getUserRole() == "DISTRIBUTOR" || this.tokenStorage.getDistributor()?.roles) {
      this.isDistributor = true;
    } else {
      this.isDistributor = false;
    }
    // console.log(this.isDistributor);
    this.getAllClientList();
    // this.filterClientListByMultiple();
    this.getDistibutorList();
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      const sidebar = document.querySelector(".sidebar");
      if (res.matches) {
        this.isMoblie = true;

      } else {
        this.isMoblie = false;
      }
    });
    if (!this.isDistributor) {
      // headerCheckboxSelection: this.isDistributor ? false : true, checkboxSelection: this.isDistributor ? false : true,
      this.columnDefs = [
        { headerName: "S.No", headerCheckboxSelection: this.isDistributor ? false : true, checkboxSelection: this.isDistributor ? false : true, lockPosition: this.isMoblie ? false : true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', minWidth: 120 },
        {
          headerName: 'Name', field: 'clientname', cellClass: 'ag-customer', pinned: this.ispinned(this.isMoblie), width: 190, valueGetter: (e) => {
            if (this.isDeveloper) {
              return e?.data?.clientname + ' [' + e?.data?.ota_groupid + ']';
            }
            return e?.data?.clientname;
          }, onCellClicked: (event) => {
            if (!this.isDeveloper) {
              this.cellClickedEvent(event);
            }
          }
        }
        ,
        {
          headerName: 'Actions',
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            const swapButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa fa-edit fa-lg"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = '#3085d6';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            // editButton.style.marginRight = '2px';
            // editButton.style.fontSize = "21px";
            editButton.addEventListener('click', () => {
              const rowData = params.data;
              rowData.isDistributor = this.isDistributor;
              this.matDialog.open(EditCustomerComponent, {
                data: rowData
              })
            });
            if (params?.data?.isdelete) {
              editButton.disabled = true;
              swapButton.disabled = true;
              deleteButton.style.marginRight = '-5px';
              deleteButton.innerHTML = '<i class="fa fa-user-times fa-lg"></i>';
              deleteButton.style.color = '#F55C47';
            } else {
              editButton.disabled = false;
              swapButton.disabled = false;
              deleteButton.innerHTML = '<i class="fa fa-user fa-lg"></i>';
              deleteButton.style.color = '#9EDE73';
            }
            deleteButton.style.backgroundColor = 'transparent';
            deleteButton.style.border = 'none';
            deleteButton.style.marginLeft = '2px';

            deleteButton.title = 'Activate / Inactivate the Customer';
            deleteButton.style.cursor = 'pointer';
            // deleteButton.style.fontSize = "22px"
            deleteButton.addEventListener('click', () => {
              const rowData = params.data;
              console.log(rowData);
              let c = (params?.data?.isdelete ? "active " : "inactive ") + rowData?.clientname
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
                  this.clientService.activateClientByAdmin([rowData?.id], !params?.data?.isdelete).subscribe((res: any) => {
                    Swal.fire({
                      title: params?.data?.isdelete ? "activated" : "inactivated",
                      text: res.message,
                      icon: "success"
                    });
                    this.filterClientListByMultiple();
                  }, err => {
                    Swal.fire({
                      title: "Oops",
                      text: err?.error?.message,
                      icon: "error"
                    });
                  })
                }
              });
            });
            // src/assets/images/146031.png
            swapButton.innerHTML = '<i class="fa fa-retweet fa-lg" aria-hidden="true"></i>';
            // swapButton.innerHTML = ' <img src="/assets/images/swap1.jpg" height="27px"  alt="swap" srcset="">';
            // swapButton.innerHTML = ' <img src="/assets/images/swap.webp"  width="24px"  alt="swap" srcset="">';
            swapButton.style.backgroundColor = 'transparent';
            swapButton.style.color = '#41616088';
            swapButton.style.border = 'none';
            swapButton.title = 'Customer Swapping';
            swapButton.style.cursor = 'pointer';
            swapButton.style.marginLeft = '2px';
            // swapButton.style.fontSize = "22px"
            swapButton.addEventListener('click', () => {
              const rowData = params.data;
              console.log(rowData);
              this.selectedSwapDistributor = rowData?.distributorid;
              // Filter out the object you want to delete based on a condition
              this.clientService.getDistibutorForClientFilter().subscribe((res: any) => {
                this.swapdistributorList = res;
                // this.swapdistributorList = res.filter((e: any) => e.id != rowData.distributorid);
                console.log(this.swapFiletereddistributorList);
                this.matDialog.open(this.swap, {
                  data: rowData
                })
              })
            });
            const otaTriggerBtn = document.createElement('button');
            otaTriggerBtn.style.backgroundColor = 'transparent';
            otaTriggerBtn.style.color = '#3085d6';
            otaTriggerBtn.style.border = 'none';
            otaTriggerBtn.title = 'OTA Triggering';
            otaTriggerBtn.style.cursor = 'pointer';
            otaTriggerBtn.style.marginRight = '2px';
            // otaTriggerBtn.style.fontSize = "24px";
            otaTriggerBtn.innerHTML = "<i class='fa fa-android fa-lg' ></i>";
            if (!params.data.is_ota) {
              otaTriggerBtn.style.color = '#F55C47';
            } else {
              otaTriggerBtn.style.color = '#32a85c';
            }
            otaTriggerBtn.addEventListener('click', () => {
              // console.log(rowData);
              const rowData = params.data;
              let c = (!params?.data?.is_ota ? "Enable " : "Disable ") + rowData?.clientname + '?';
              Swal.fire({
                title: "Are you sure?",
                text: "Do you want to be an Ota " + c,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: !params?.data?.is_ota ? "Yes, Enable!" : "Yes, Disable!"
              }).then((result) => {
                if (result.isConfirmed) {
                  let v: any = [];
                  v.push(rowData.id);
                  let loader = this.matDialog.open(LoaderComponent, {
                    panelClass: 'loader-upload'
                  })
                  this.clientService.changeOtaStatusForClient([rowData.id], !params?.data?.is_ota).subscribe((res: any) => {
                    Swal.fire({
                      title: !params?.data?.is_ota ? "Enabled" : "Disabled",
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
            div.setAttribute('class', 'd-flex justify-content-center align-item-center')
            if (this.isDeveloper) {
              div.appendChild(otaTriggerBtn);
            } else {
              otaTriggerBtn.disabled = true;
              div.appendChild(editButton);
              div.appendChild(swapButton);
              div.appendChild(otaTriggerBtn);
              div.appendChild(deleteButton);
            }
            return div;
          }
        },
        { headerName: 'Distributor', field: 'distributor', cellStyle: { "text-transform": "none" } },
        { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
        { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },

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
        // { headerName: 'Status', field: 'isactive', cellRenderer: CostumerActivateBtnComponent },
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
        { headerName: 'Client Code', field: 'clientcode', cellStyle: { "text-transform": "none" } },
        { headerName: 'Company Profile', field: 'company' },
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
        { headerName: 'Mobile1', field: 'phone' },
        { headerName: 'Mobile2', field: 'phone2' },
        { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
        { headerName: 'Creationdate', field: 'creationdate' },
        { headerName: 'Updatedate', field: 'updatedate' },

        { headerName: 'Creationby', field: 'creationby' }

      ];
    }
    if (this.isMoblie) {
      if (!sessionStorage.getItem('loaded')) {
        window.location.reload();
        sessionStorage.setItem('loaded', 'true');
      }
    }

  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', minWidth: 80 },
    {
      headerName: 'Edit', minWidth: 120,
      cellRenderer: (params: any) => {
        let rowData = params.data;
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-edit fa-lg"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '#3085d6';
        // editButton.style.marginLeft = '6px';
        // editButton.style.marginRight = '6px';
        editButton.style.border = 'none';
        editButton.style.cursor = 'pointer';
        // editButton.style.fontSize = "22px";
        editButton.addEventListener('click', () => {
          // const rowData = params.data;
          rowData.isDistributor = this.isDistributor;
          this.matDialog.open(EditCustomerComponent, {
            data: rowData
          })
        });
        if (params?.data?.isdelete) {
          editButton.disabled = true;
          deleteButton.innerHTML = '<i class="fa fa-user-times fa-lg"></i>';
          deleteButton.style.color = '#F55C47';
          deleteButton.style.marginRight = '-6px';

        } else {
          editButton.disabled = false;
          deleteButton.innerHTML = '<i class="fa fa-user fa-lg"></i>';
          deleteButton.style.color = '#9EDE73';

        }
        deleteButton.style.backgroundColor = 'transparent';
        deleteButton.style.border = 'none';
        // deleteButton.style.marginLeft = '6px';
        // deleteButton.style.marginRight = '6px';
        deleteButton.style.marginTop = '-2px';
        deleteButton.title = 'Activate / Inactivate the Customer';
        deleteButton.style.cursor = 'pointer';
        // deleteButton.style.fontSize = "22px"
        deleteButton.addEventListener('click', () => {
          // console.log(rowData);
          let c = (params?.data?.isdelete ? "active " : "inactive ") + rowData?.clientname
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
              this.clientService.activateClientByAdmin(rowData?.id, !params?.data?.isdelete).subscribe((res: any) => {
                Swal.fire({
                  title: params?.data?.isdelete ? "activated" : "inactivated",
                  text: res.message,
                  icon: "success"
                });
                this.filterClientListByMultiple();
              }, err => {
                Swal.fire({
                  title: "Oops",
                  text: err?.error?.message,
                  icon: "error"
                });
              })
            }
          });
        });

        const div = document.createElement('div');
        div.setAttribute('class', 'd-flex justify-content-center align-item-center')
        div.appendChild(editButton);
        div.appendChild(deleteButton);
        return div;
      }
    },
    {
      headerName: 'Name', field: 'clientname', pinned: 'left', width: 190, onCellClicked: (event) => {
        // this.cellClickedEvent(event)
      }
    },

    { headerName: 'Client Code', field: 'clientcode', cellStyle: { "text-transform": "none" } },
    // { headerName: 'Distributor', field: 'distributor', cellStyle: { "text-transform": "none" } },
    // { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
    // { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },

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
    // { headerName: 'Status', field: 'isactive', cellRenderer: CostumerActivateBtnComponent },
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

    { headerName: 'Company Profile', field: 'company' },
    {
      headerName: 'type', field: 'ispremium', valueGetter: (params) => {
        // console.log(params.data);

        if (params?.data?.ispremium) {
          return "Premium"
        } else {
          return "N/A"
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
    { headerName: 'Mobile1', field: 'phone' },
    { headerName: 'Mobile2', field: 'phone2' },
    { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
    { headerName: 'Creationdate', field: 'creationdate' },
    { headerName: 'Updatedate', field: 'updatedate' },

    { headerName: 'Creationby', field: 'creationby' }

  ];
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;

  }
  getAllClientList() {
    if (this.isDistributor) {
      const user = this.tokenStorage.getUser();
      if (user.roles[0] == "ROLE_DISTRIBUTOR") {
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
          // console.log(res);
          this.selectedDistributor = res;
          this.distributor = res;

          this.getStateListByDistributor(res);
          // let payload = {
          //   "distributorlist": [this.distributor?.id],
          // }
          this.allSelectedDistributorList = [this.distributor?.id]
          this.getStateForDistributor();
          // this.clientService.getClientStateListbyDistributor(payload).subscribe(res => {
          //   this.stateList = res;
          // })
          this.filterClientListByMultiple();
          this.clientService.getClientListByDistributorId(res.id).subscribe((res: any) => {
            // console.log(res);
            this.rowData = res;
            this.rowDatafilter = res;
            this.gridApi.setRowData(res);
          })
        })
      } else {
        const di = this.tokenStorage.getDistributor();
        this.clientService.getdistributorByUsername(di.username).subscribe((res: any) => {
          this.selectedDistributor = res;
          this.distributor = res;
          this.allSelectedDistributorList = [this.distributor?.id]
          this.getStateForDistributor();
          this.getStateListByDistributor(res);
          this.filterClientListByMultiple();
          // let payload = {
          //   "distributorlist": [this.distributor?.id],
          // }
          // this.clientService.getClientStateListbyDistributor(payload).subscribe(res => {
          //   this.stateList = res;
          // })
          this.clientService.getClientListByDistributorId(res.id).subscribe((res: any) => {
            // console.log(res);
            this.rowData = res;
            this.rowDatafilter = res;
            this.gridApi.setRowData(res);
          })
        })
      }
      // console.log(this.isDistributor);


    } else {
      this.clientService.getAllClientList().subscribe((res: any) => {
        // console.log(res);
        this.rowData = res;
        this.rowDatafilter = res;
        this.gridApi.setRowData(res);
      })
    }
  }
  goClientPortal(client: any) {
    // console.log(client);

  }
  signintoCustomer(data: any) {
    let user = this.tokenStorage.getUser();
    if (!user.roles.includes('ROLE_ADMIN')) {

    } else {
      this.signInForm = this.fb.group({
        username: [data.username, Validators.required],
        password: [data.password, Validators.required],
      });
      // console.log(this.signInForm.value);

      this.authService.login(this.signInForm.value).subscribe((res: any) => {
        // console.log(res);
        this.tokenStorage.saveClient(res);
        const user = this.tokenStorage.getClient();
        let roles = user.roles;
        // console.log(roles);
        let isClient = roles.includes('ROLE_CLIENT');
        // console.log(isClient);

        if (isClient) {
          this.clientService.getClientByUsername(user.username).subscribe((res: any) => {
            // console.log(res);
            if (res.versionMaster.version == "BASIC") {
              this.router.navigate(['client/screen']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['client/client-dashboard']).then(() => {
                window.location.reload();
              });
            }
          })
          // this.router.navigate(['client/client-dashboard']).then(() => {
          //   window.location.reload();
          // });
        } else {
          alert("Invalid User")
        }
      }, err => {
        this.alertToaster.showError(err?.error?.message);
        // this.alertToaster.showError("Costumer is Not Activated");
      });
    }
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  onQuickFilter(id: any) {
    this.gridApi.setQuickFilter(id);
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

    const title = 'Customer Information';
    let dataFields = [
      'Distributor',
      'Clientname',
      "Company",
      'Username',
      'Password',
      'Clientcode',
      "Phone",
      'Email',
      'Plan',
      'State',
      'District',
      'City',
      "Location",
      'Zipcode',
      "Status",
      'Creationdate',
      'Updatedate'
    ];

    let field: any = [];
    for (let e of dataFields) {
      // if (e === "Distributor") {
      //   if (this.selectedDistributor.id != 0) {
      //     continue;
      //   }
      // }
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

      // if (e === "Plan") {
      //   if (this.selectedVersion.id != 0) {
      //     continue;
      //   }
      // }
      // if (e === "Status") {

      //   if (this.selectedActive.id != "null") {
      //     continue;
      //   }
      // }
      field.push(e);
    }
    let data1: any = [];

    let selectedDistributor = this.rowData[0]?.distributor;
    let selectedState = this.rowData[0]?.state?.statename;
    let selectedDistrict = this.rowData[0]?.district?.name;
    let selectedCity = this.rowData[0]?.city?.cityname;
    let selectedLocation = this.rowData[0]?.location?.area;
    let selectedVersion = this.rowData[0]?.versionMaster?.version;
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Distributor': obj?.distributor,
        'Clientname': obj?.clientname,
        "Company": obj?.company,
        'Username': obj?.username,
        'Password': obj?.password,
        'Clientcode': obj?.clientcode,
        "Phone": obj?.phone,
        'Email': obj?.email,
        'Plan': obj?.versionMaster?.version,
        // 'country': obj?.country?.countryname,
        'State': obj?.state?.statename,
        'District': obj?.district?.name,
        'City': obj?.city?.cityname,
        "Location": obj?.location?.area,
        'Zipcode': obj?.zipcode,
        "Status": obj?.isactive ? "active" : "inactive",
        'Creationdate': obj?.creationdate,
        'Updatedate': obj?.updatedate,
      }

      data1.push(g)
    }
    let filterList: any = {
      distributor: this.allSelectedDistributorList.length == 1 ? selectedDistributor : this.allSelectedDistributorList.length == 0 ? "" : "Multiple",
      state: this.allSelectedStateList.length == 1 ? selectedState : this.allSelectedStateList.length == 0 ? "" : "Multiple",
      district: this.allSelectedDistrictList.length == 1 ? selectedDistrict : this.allSelectedDistrictList.length == 0 ? "" : "Multiple",
      city: this.allSelectedCityList.length == 1 ? selectedCity : this.allSelectedCityList.length == 0 ? "" : "Multiple",
      location: this.allSelectedLocationList.length == 1 ? selectedLocation : this.allSelectedLocationList.length == 0 ? "" : "Multiple",
      isactive: this.selectedActive?.name,
      plan: this.allSelectedVersionList.length == 1 ? selectedVersion : this.allSelectedVersionList.length == 0 ? "" : "Multiple",
      fromdate: this.fromdate,
      todate: this.todate
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
      filterList: filterList,
      address: address
    }
    this.exportService.generateCustomerPDF(data);
  }

  exportAsExcelFile() {
    const title = 'Customer Information';
    let data1: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Clientname': obj?.clientname,
        "Company": obj?.company,
        'Username': obj?.username,
        'Password': obj?.password,
        'Clientcode': obj?.clientcode,
        "Phone": obj?.phone,
        'Email': obj?.email,
        'Plan': obj?.versionMaster?.version,
        'Distributor': obj?.distributor || this.selectedDistributor?.distributor,
        // 'country': obj?.country?.countryname,
        'State': obj?.state?.statename,
        'District': obj?.district?.name,
        'City': obj?.city?.cityname,
        "Location": obj?.location?.area,
        'Zipcode': obj?.zipcode,
        "Status": obj?.isactive ? "active" : "inactive",
        'Creationdate': obj?.creationdate,
        'Updatedate': obj?.updatedate,
      }
      data1.push(g)
    }
    let cellSize = { a: "25", b: "15", c: "15", d: "15", e: "15", f: "15", g: "35", h: "25", i: "25", j: "25", k: "35", l: "15", m: "15", n: "15", o: "15", p: "25", q: "25" }
    let titleMerge = "'B1':'O4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'P1':'Q4'";
    let reportData = {
      title: title,
      data: data1,
      headers: Object.keys(data1[0]),
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
    })
    // this.filterDistributorList();
  }
  allSelectedStateList: any = [];
  allSelectedDistributorList: any = [];
  allSelectedGroupList: any = 0;
  allSelectedDistrictList: any = [];
  allSelectedCityList: any = [];
  allSelectedLocationList: any = [];
  allSelectedVersionList = [];
  allSelectedState = false;
  allSelectedDistrict = false;
  allSelectedCity = false;
  allSelectedLocation = false;
  allSelectedDistributor = false;
  allSelectedVersion = false;
  allSelectedGroup = false;
  @ViewChild('selectVersion') selectVersion!: MatSelect;
  @ViewChild('selectDistributor') selectDistributor!: MatSelect;
  @ViewChild('selectState') selectState!: MatSelect;
  @ViewChild('selectCity') selectCity!: MatSelect;
  @ViewChild('selectLocation') selectLocation!: MatSelect;
  @ViewChild('selectDistrict') selectDistrict!: MatSelect;
  @ViewChild('selectGroup') selectGroup!: MatSelect;
  selectedState: any;
  selectedDistrict: any;
  selectedCity: any;
  selectedLocation: any;


  toggleAllSelectionGroup() {
    if (this.allSelectedGroup) {
      this.selectGroup.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectGroup.options.forEach((item: MatOption) => item.deselect());
    }
    this.filterClientListByMultiple();
  }
  optionClickGroup(event: any, state: any) {
    let newStatus = true;
    this.selectGroup.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedGroup = newStatus;
    this.filterClientListByMultiple();
  }

  toggleAllSelectionForVersion() {
    if (this.allSelectedVersion) {
      this.selectVersion.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectVersion.options.forEach((item: MatOption) => item.deselect());

    }

  }
  optionClickVersion(event: any, state: any) {
    let newStatus = true;
    this.selectVersion.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });

    this.allSelectedVersion = newStatus;
    // console.log(this.allSelectedVersionList);
    this.filterClientListByMultiple()

  }

  toggleAllSelectionForDistributor() {

    if (this.allSelectedDistributor) {
      this.selectDistributor.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDistributor.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedCityList = [];
      this.allSelectedStateList = [];
      this.allSelectedDistrictList = [];
      this.allSelectedLocationList = [];
    }
    this.getStateListByDistributorList();
    this.getDistrictListByStateList()
    this.getCityListByDistrictList();
    this.getLocationListByCityList()
  }
  optionClickDistributor(event: any, state: any) {
    let newStatus = true;
    this.selectDistributor.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedCityList = [];
    this.allSelectedDistrictList = [];
    this.allSelectedLocationList = [];
    this.allSelectedStateList = [];

    this.allSelectedDistributor = newStatus;
    if (!event.target.parentElement.children[0].classList.contains('mat-pseudo-checkbox-checked')) {
      this.selectedDistributor = state;
    }
    this.getStateListByDistributorList();
    this.getDistrictListByStateList()
    this.getCityListByDistrictList();
    this.getLocationListByCityList()

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
    this.getDistrictListByStateList()
    this.getCityListByDistrictList();
    this.getLocationListByCityList()
  }
  optionClickState(event: any, state: any) {
    let newStatus = true;
    this.selectState.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });

    this.allSelectedCityList = [];
    this.allSelectedDistrictList = [];
    this.allSelectedLocationList = [];

    if (!event.target.parentElement.children[0].classList.contains('mat-pseudo-checkbox-checked')) {
      this.selectedState = state;
    }
    this.getDistrictListByStateList()
    this.getCityListByDistrictList();
    this.getLocationListByCityList()
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

    this.getCityListByDistrictList();
    this.getLocationListByCityList()
  }
  optionClickDistrict(event: any, district: any) {
    let newStatus = true;
    this.selectDistrict.options.forEach((item: MatOption) => {
      // console.log(item);
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedCityList = [];
    this.allSelectedLocationList = [];
    if (!event.target.parentElement.children[0].classList.contains('mat-pseudo-checkbox-checked')) {
      this.selectedDistrict = district;
    }
    this.getLocationListByCityList();
    this.getCityListByDistrictList();
    this.allSelectedDistrict = newStatus;

  }
  toggleAllSelectionForCity() {
    if (this.allSelectedCity) {
      this.selectCity.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectCity.options.forEach((item: MatOption) => item.deselect());
      this.allSelectedLocationList = [];
    }
    this.getLocationListByCityList()
  }
  optionClickCity(event: any, city: any) {
    let newStatus = true;
    this.selectCity.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedLocationList = [];

    if (!event.target.parentElement.children[0].classList.contains('mat-pseudo-checkbox-checked')) {
      this.selectedCity = city;
    }
    this.allSelectedCity = newStatus;
    // this.getAllLocationByCityListByMultipleForDestributor()
    this.getLocationListByCityList()
  }
  toggleAllSelectionForLocation() {
    if (this.allSelectedLocation) {
      this.selectLocation.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectLocation.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClickLocation(event: any, location: any) {
    let newStatus = true;
    this.selectLocation.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    if (!event.target.parentElement.children[0].classList.contains('mat-pseudo-checkbox-checked')) {
      this.selectedLocation = location;
    }
    this.allSelectedLocation = newStatus;
    this.filterClientListByMultiple();
  }
  getStateListByDistributorList() {
    let payload = {
      "distributorlist": this.allSelectedDistributorList.length == 0 ? [0] : this.allSelectedDistributorList,
    }
    this.clientService.getClientStateListbyDistributor(payload).subscribe(res => {
      this.stateList = res;
    })
    this.filterClientListByMultiple();
  }
  getDistrictListByStateList() {
    let payload = {
      "distributorlist": this.allSelectedDistributorList.length == 0 ? [0] : this.allSelectedDistributorList,
      "statelist": this.allSelectedStateList
    }
    this.clientService.getClientDistrictbyDistributorAndStateList(payload).subscribe(res => {
      this.districtList = res;
      this.filteredDistrictList = res
    })
    this.filterClientListByMultiple();
  }
  getCityListByDistrictList() {
    let payload = {
      "distributorlist": this.allSelectedDistributorList.length == 0 ? [0] : this.allSelectedDistributorList,
      "districtlist": this.allSelectedDistrictList
    }
    this.clientService.getClientCitybyDistributorAndDistrictList(payload).subscribe(res => {
      this.cityList = res;
      this.filteredCityList = res;
    })
    this.filterClientListByMultiple();
  }
  getLocationListByCityList() {
    let payload = {
      "distributorlist": this.allSelectedDistributorList.length == 0 ? [0] : this.allSelectedDistributorList,
      "citylist": this.allSelectedCityList
    }
    this.clientService.getClientLocationListbyDistributorAndCityList(payload).subscribe(res => {
      this.locationList = res;
      this.filteredLocationList = res;
    })
    this.filterClientListByMultiple();
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
    // this.filterClientList();
    this.filterClientListByMultiple();
  }
  filterClientListByMultiple() {
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
      groupid: this.allSelectedGroupList
    }
    this.clientService.filterClientListByMultiple(payload).subscribe(res => {
      // console.log(res);
      this.rowData = res;
      this.rowDatafilter = res;
      this.isAnyRowSelected = false;
    })
  }
  // filter==========
  selectedDistributor: any = { id: 0 };
  selectedActive: any = { id: "2", name: 'All', value: '' }
  // selectedState: any = { id: 0 };
  // selectedDistrict: any = { id: 0 };
  // selectedCity: any = { id: 0 }
  // selectedLocation: any = { id: 0 };
  selectedVersion: any = { id: 0 };
  public variables = ['One', 'Two', 'County', 'Three', 'Zebra', 'XiOn'];
  public filteredList1 = this.variables.slice();
  public activeList = [{ id: 2, name: 'All', value: '' }, { id: 1, name: 'Active', value: true }, { id: 0, name: 'Inactive', value: false }];
  public filteredActiveList = this.activeList.slice();
  distributorList: any = [];
  public filteredDistributorList = this.distributorList.slice();
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

  groupList: any = [];
  public filteredGroupList = this.groupList.slice();
  getDistibutorList() {
    this.clientService.getDistibutorForClientFilter().subscribe((res: any) => {
      // console.log(res);
      this.distributorList = res;
      // this.swapdistributorList = res;
      this.filteredDistributorList = res;
      this.swapFiletereddistributorList = res;
    })

    this.clientService.getOtaGroupInfo().subscribe((res: any) => {
      this.groupList = res;
      this.filteredGroupList = res;
    })
    // this.filterClientList();
  }
  getStateListByDistributor(distributor: any) {
    this.selectedDistributor = distributor;
    this.clientService.getStateListByDistributorid(this.selectedDistributor?.id).subscribe(res => {
      this.stateList = res;
      this.filteredStateList = res;
    })
    // this.filterClientList();
    // this.filterClientListByMultiple();
  }
  // getDistrictListByStateAndDistributorid(state: any) {
  //   this.selectedState = state;
  //   this.clientService.getDistrictListByStateAndDistributorid(this.selectedDistributor?.id, state?.id).subscribe(res => {
  //     this.districtList = res;
  //     this.filteredDistrictList = res;
  //   })
  //   this.filterClientList();
  // }
  // getCityListByDistricteAndDistributorid(district: any) {
  //   this.selectedDistrict = district;
  //   this.clientService.getCityListByDistricteAndDistributorid(this.selectedDistributor?.id, district?.id).subscribe(res => {
  //     this.cityList = res;
  //     this.filteredCityList = res;
  //   })
  //   this.filterClientList();
  // }

  // getLocation(location: any) {
  //   this.selectedLocation = location;
  //   this.filterClientList();
  // }
  // getPlan(version: any) {
  //   // this.selectedVersion = version;
  //   // this.filterClientList();
  //   this.filterClientListByMultiple()
  // }

  getActive(active: any) {
    this.selectedActive = active;
    this.filterClientListByMultiple()
    // this.filterClientList();
  }
  // getLocationListByCityAndDistributorid(city: any) {
  //   this.selectedCity = city;
  //   this.clientService.getLocationListByCityAndDistributorid(this.selectedDistributor?.id, city?.id).subscribe(res => {
  //     this.locationList = res;
  //     this.filteredLocationList = res;
  //   })
  //   this.filterClientList();
  // }

  // filterClientList() {
  //   let payload = {
  //     distributorid: this.selectedDistributor?.id,
  //     stateid: this.selectedState?.id,
  //     districtid: this.selectedDistrict?.id,
  //     cityid: this.selectedCity?.id,
  //     locationid: this.selectedLocation?.id,
  //     planid: this.selectedVersion?.id,
  //     fromdate: this.fromdate,
  //     todate: this.todate,

  //   }
  //   this.clientService.filterClientList(payload).subscribe(res => {
  //     // console.log(res);
  //     this.rowData = res;
  //   })
  // }
  swapDistributor: any;
  swapingClient: any;
  onchooseDistributor(distributor: any, client: any) {
    this.swapDistributor = distributor;
    this.swapingClient = client;
  }
  closeDialog() {
    this.matDialog.closeAll();
  }
  swapClient() {
    this.clientService.swapClient(this.swapDistributor?.username, [this.swapingClient?.id]).subscribe((res: any) => {
      console.log(res);
      this.alertToaster.showSuccess(res?.message);
      this.matDialog.closeAll();
      this.filterClientListByMultiple();
    }, err => {
      this.alertToaster.showError(err?.error?.message);
    })
  }

  getCustomerVersion() {
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      this.versionList = res;
      // let v = { id: 0, version: "All" }
      // this.versionList.push(v);
      this.filteredVersionList = res;
    })
  }


  filterGroups(searchText: string): void {
    this.filteredGroupList = this.groupList.filter((state: any) =>
      this.isSelectedGroup(state.id) || state.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedGroup(stateId: any): boolean {
    return this.allSelectedGroupList.some((selectedId: any) => selectedId === stateId);
  }

  filterDistributors(searchText: string): void {
    this.filteredDistributorList = this.distributorList.filter((state: any) =>
      this.isSelectedDistributor(state.id) || state.distributor.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  isSelectedDistributor(stateId: any): boolean {
    return this.allSelectedDistributorList.some((selectedId: any) => selectedId === stateId);
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

  onclickEdit(rowData: any) {
    rowData.isDistributor = this.isDistributor;
    this.matDialog.open(EditCustomerComponent, {
      data: rowData
    })
  }
  selectedSwapDistributor: any;
  swapCustomer(rowData: any) {
    this.selectedSwapDistributor = rowData?.distributorid;
    this.clientService.getDistibutorForClientFilter().subscribe((res: any) => {
      this.swapdistributorList = res;
      // this.swapdistributorList = res.filter((e: any) => e.id != rowData.distributorid);
      this.matDialog.open(this.swap, {
        data: rowData
      })
    })
  }
  activateCustomer(rowData: any) {
    console.log(rowData);
    let c = (rowData?.isdelete ? "active " : "inactive ") + rowData?.clientname
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
        this.clientService.activateClientByAdmin([rowData?.id], !rowData?.isdelete).subscribe((res: any) => {
          Swal.fire({
            title: rowData?.isdelete ? "activated" : "inactivated",
            text: res.message,
            icon: "success"
          });
          this.filterClientListByMultiple();
        }, err => {
          Swal.fire({
            title: "Oops",
            text: err?.error?.message,
            icon: "error"
          });
        })
      }
    });
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
          <p>${type === 'ota' ? 'Do you want to enable/disable OTA for selected Customers?' : 'Do you want to activate/deactivate selected Customers?'}</p>
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
            this.clientService.changeOtaStatusForClient(DeviceIdList, selectedOption).subscribe((res: any) => {
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
            this.clientService.activateClientByAdmin(DeviceIdList, selectedOption).subscribe((res: any) => {
              // console.log(res);
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
  objectIncludesValue(obj: any, searchText: any) {
    return Object.keys(obj).some(key => {
      const value = obj[key];
      if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
      return false;
    });
  }
  filteredGroupOptions!: Observable<string[]>;
  addGroup(e: any) {
    this.matDialog.open(e, {
      minWidth: 250
    });
  }
  saveClientToGroup() {
    Swal.fire({
      title: "Do you want to Save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let DeviceIdList: any = [];
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        if (this.gridApi) {
          const selectedRows = this.gridApi.getSelectedRows();
          selectedRows.forEach((e: any) => {
            DeviceIdList.push(e.id);
          });
        }
        this.clientService.addClientToOtaGroup(this.groupname.value, DeviceIdList).subscribe((res: any) => {
          this.alertToaster.showSuccess(res.message);
          this.matDialog.closeAll();
          this.ngOnInit();
          this.filterClientListByMultiple();
          this.isAnyRowSelected = false;
        }, err => {
          this.matDialog.closeAll();
          this.alertToaster.showError(err?.error?.message)
        })
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });


  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupList.filter((option: any) => option?.name.toLowerCase().includes(filterValue));
  }
}
