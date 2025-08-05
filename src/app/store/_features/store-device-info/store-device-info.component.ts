import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ColDef } from 'ag-grid-community';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-store-device-info',
  templateUrl: './store-device-info.component.html',
  styleUrls: ['./store-device-info.component.scss']
})
export class StoreDeviceInfoComponent implements OnInit {
  @ViewChild('ScreenShots') ScreenShots: HTMLElement | any;
  ScreenShotList: any = []
  isMobile: any = false
  rowData: any;
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
  maxDate = new Date();
  columnDefs: ColDef | any = []
  fromdate: any;
  todate: any;
  store: any;
  isAnyRowSelected = false;
  gridApi: any;
  categoryList: any = [];
  filteredCategoryList = this.categoryList.slice();
  category: any;
  userRole: any;
  storeId: any;
  clientId: any;
  constructor(private clientService: ClientService, private excelService: ExcelService, private alertService: AlertService, private storageService: StorageService, private matDialog: MatDialog) {

  }

  ngOnInit() {
    this.category = history.state;
    let v = this.storageService.getUser();
    this.userRole = this.storageService.getUserRole();
    if (this.storageService.getUserRole() === 'STORE') {
      this.clientService.getStoreByUsername(v.username).subscribe((res: any) => {
        this.store = res
        this.storeId = res.id;
        this.clientId = this.store.clientid;
        this.getCategoryListByStoreId([this.store.id]);
        if (this.category.data) {
          this.filterDevices();
        } else {
          this.filterDeviceList();
        }
      })
    } else {
      this.clientService.getSuserByUsername(v.username).subscribe((res: any) => {
        this.storeId = res.storeid;
        this.clientId = res.clientid;
        this.getCategoryListByStoreId(res.storeid);
        if (this.category.data) {
          this.filterDevices();
        } else {
          this.filterDeviceList();
        }
      });
    }



    // else {
    //   if (this.storageService.getUserRole() === 'STORE') {
    //     this.clientService.getStoreByUsername(v.username).subscribe((res: any) => {
    //       this.store = res
    //       this.storeId = res.id;
    //       this.clientId = res.clientid;
    //       // this.getDeviceListByStoreId([this.store.id]);
    //       this.filterDeviceList();
    //     })
    //   } else {
    //     this.clientService.getSuserByUsername(v.username).subscribe((res: any) => {
    //       // this.getDeviceListByStoreId(res.storeid);
    //       this.storeId = res.storeid;
    //       this.clientId = res.clientid;
    //       this.filterDeviceList();
    //     });
    //   }
    // }



    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: true, cellClass: 'locked-col', width: 100, checkboxSelection: true, headerCheckboxSelection: true },

      {
        headerName: 'Unique Number', field: 'username', pinned: true,
        cellStyle: (params: any) => {
          if (params.data.isandroid) {
            return { color: 'green' };
            //mark police cells as red
          } else {
            return { color: 'red' };
          }

        }
      },
      {
        headerName: 'Actions',
        cellRenderer: (params: any) => {
          const camButton = document.createElement('button');
          camButton.innerHTML = '<i class="fa fa-camera fa-lg" aria-hidden="true"></i>';
          camButton.style.backgroundColor = 'transparent';
          camButton.style.color = '#6295A2';
          camButton.style.border = 'none';
          camButton.style.cursor = 'pointer';
          // camButton.style.fontSize = "20px";
          camButton.title = "take screen shot [device is online]";
          camButton.addEventListener('click', () => {
            const rowData = params.data;
            this.ScreenShotList = []
            this.clientService.getScreenShotsByDeviceUsername(rowData.username).subscribe(res => {
              console.log(res);
              this.ScreenShotList = res;
              this.matDialog.open(this.ScreenShots, {
                width: '100vw',
                data: rowData
              })
            }, err => {
              this.alertService.showError(err?.error?.message);
            })
          });
          if (!params.data.isonline) {
            camButton.disabled = true;
            camButton.style.color = 'lightgrey';
            camButton.title = "take screen shot [device is offline]";
          }
          const div = document.createElement('div');
          div.appendChild(camButton);
          return div;
        }
      },
      {
        headerName: 'Model-name',
        field: 'modelname',
        minWidth: 200,
      },
      //  {
      //   headerName: 'plan', field: 'area', valueGetter: (e: any) => {
      //     return e.data?.versionMaster?.version;
      //   },
      //   cellStyle: (params: any) => {
      //     if (params.data?.versionMaster?.version == "BASIC") {
      //       return { color: '#8ac926' };
      //     } else if (params.data?.versionMaster?.version == "LITE") {
      //       return { color: '#e83f6f' };
      //     } else {
      //       return { color: '#2274a5' };
      //     }
      //   }
      // },
      //  {
      //   headerName: 'Country', field: 'cityname', valueGetter: (params: any) => {

      //     if (params.data.country) {

      //       return params.data.country.countryname;
      //     } else {
      //       return "No Country";
      //     }
      //   }
      // },

      // {
      //   headerName: 'State', field: 'statename', width: 250, valueGetter: (params: any) => {

      //     if (params.data.state) {

      //       return params.data.state.statename;
      //     } else {
      //       return "N/A";
      //     }
      //   }
      // }, {
      //   headerName: 'District', field: 'district', minWidth: 250, valueGetter: (e: any) => {
      //     return e.data?.district?.name;
      //   }
      // },
      // {
      //   headerName: 'City', field: 'cityname', valueGetter: (params: any) => {

      //     if (params.data.city) {
      //       return params.data.city.cityname;
      //     } else {
      //       return "N/A";
      //     }
      //   }
      // }
      // ,
      // {
      //   headerName: 'Location', field: 'cityname', valueGetter: (params: any) => {
      //     if (params.data.location) {
      //       return params?.data?.location?.area;
      //     } else {
      //       return "N/A";
      //     }
      //   }
      // },
      // {
      //   headerName: 'Landmark', field: 'landmark', valueGetter: (params: any) => {

      //     if (params.data.landmark) {
      //       return params.data.landmark;
      //     } else {
      //       return "N/A";
      //     }
      //   }
      // },
      {

        headerName: 'Category', field: 'categoryname',
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
        }, cellStyle: (params: any) => {
          if (params.data.isonline) {
            //mark police cells as red
            return { color: 'green' };
          } else {
            return { color: 'red' };
          }

        }
      },
      // { headerName: 'Activity', field: 'isactive', cellRenderer: DeviceActivateBtnComponent },
      {
        headerName: 'Activity', field: 'isactive', valueGetter: (params: any) => {
          // console.log(params.data);

          if (params?.data?.isactive) {
            return "approved"
          } else {
            return "pending"
          }

        }, cellStyle: (params: any) => {
          if (params.data.isactive) {
            return { color: '#378ced' };
          } else {
            return { color: '#eb9834' };
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
    ];

  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  getDeviceListByStoreId(id: any) {
    this.clientService.getDeviceListByStoreId(id).subscribe(res => {
      console.log(res);
      this.rowData = res;
    })
  }
  getCategoryListByStoreId(id: any) {
    this.clientService.getCategoryListByStoreId([id]).subscribe((res: any) => {
      this.categoryList = res;
      this.filteredCategoryListDropDown = res;
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
  }
  exportPdf() {

  }
  exportAsExcelFile() {
    const title = 'Device Information';

    let address;

    let data: any = []


    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Clientname': obj?.clientname,
        'Unique': obj?.password,
        "Store": obj?.storename,
        "Category": obj?.categoryname,
        "Modelname": obj.modelname,
        Orientation: obj.height_width == "9:16" ? "vertical" : "horizontal",
        'Createdby': obj?.createdby,
        "Activity": obj?.isactive ? "active" : "inactive",
        "Status": obj?.isonline ? "online" : "offline",
        "Apkupdate": obj?.apkupdate,
        'Created Date': obj?.creationdate,
        'Updated Date': obj?.updateddate,
      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "15", c: "15", d: "20", e: "15", f: "15", g: "35", h: "25", i: "25", j: "25", k: "35", l: '36' }
    let titleMerge = "'B1':'K4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'L1':'L4'";
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
  deviceStatus = 'all';

  selectedDeviceList: any = []
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows: any = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedDeviceList = new Array(selectedRows.map((item: any) => item.id));
    }
  }
  selectedStore: any;
  openStorePopUp(e: any) {
    this.matDialog.open(e)
  }
  onchooseStore(item: any) {
    this.selectedStore = item;
  }
  allocateDevices() {
    if (this.selectedStore.id) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      this.clientService.allocateDeviceForCategory(this.selectedStore.id, this.selectedDeviceList).subscribe((res: any) => {
        this.alertService.showSuccess(res.message);
        this.closeDialog();
        this.ngOnInit();
      }, err => {
        this.alertService.showError(err.error.message);
        loader.close();
      })
    } else {
      this.alertService.showInfo('Please select category...');
    }

  }
  closeDialog() {
    this.matDialog.closeAll();
  }


  @ViewChild('selectCategory') selectCategory!: MatSelect;
  selectedCategories: any[] = [];
  allCategoriesSelected = false;
  filteredCategoryListDropDown: any[] = [];


  filterCategories(searchText: string): void {
    this.filteredCategoryListDropDown = this.categoryList.filter((category: any) =>
      this.isSelectedCategory(category.id) || category.categoryname.toLowerCase().includes(searchText.toLowerCase()) || category.categorycode.toLowerCase().includes(searchText.toLowerCase())
    );
  }


  isSelectedCategory(categoryId: any): boolean {
    return this.selectedCategories.some((selectedId: any) => selectedId === categoryId);
  }



  toggleAllCategorySelection() {
    if (this.allCategoriesSelected) {
      this.selectCategory.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectCategory.options.forEach((item: MatOption) => item.deselect());
    }

    // this.getDeviceListByCategoryListNdStatus();
    this.filterDeviceList();
  }

  categoryOptionClick() {
    let newStatus = true;
    this.selectCategory.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allCategoriesSelected = newStatus;
    // this.getDeviceListByCategoryListNdStatus()
    this.filterDeviceList();
  }

  geDevicesByStatus(e: any) {
    this.deviceStatus = e;
    // this.getDeviceListByCategoryListNdStatus()
    this.filterDeviceList();
  }
  getDeviceListByCategoryListNdStatus() {
    this.clientService.getDeviceListByCategoryListNdStatus(this.selectedCategories, this.deviceStatus).subscribe(res => {
      console.log(res);
      this.rowData = res;
    })
  }
  filterDevices() {
    this.selectedCategories = [];
    console.log('State:', history.state);
    if (this.category.data) {
      this.selectedCategories.push(this.category.data.id);
      this.deviceStatus = this.category.type;
      // this.geDevicesByStatus(this.deviceStatus);
      this.filterDeviceList();
    }

  }

  orientationList = [{ id: 0, name: 'All' }, { id: "9:16", name: 'Vertical' }, { id: "16:9", name: 'Horizontal' }];
  activeList = [{ id: 2, name: 'All' }, { id: 1, name: 'active', value: true }, { id: 0, name: 'inactive', value: false }];
  selectedOrientation: any;
  selectedActive: any;
  getOrientation(type: any) {
    this.selectedOrientation = type;
    this.filterDeviceList();
  }

  getActive(location: any) {
    this.selectedActive = location;
    this.filterDeviceList();
  }

  filterDeviceList() {
    let payload = {
      "isactive": this.selectedActive?.id,
      "height_width": this.selectedOrientation?.id,
      "clientlist": [this.clientId],
      "isonline": this.deviceStatus === "all" ? 2 : this.deviceStatus === "online" ? 1 : 0,
      storelist: [this.storeId],
      categorylist: this.selectedCategories,
      fromdate: "null",
      todate: "null"
    }
    this.clientService.filterDeviceListByMultiple(payload).subscribe(res => {
      this.rowData = res;
    })
  }
}
