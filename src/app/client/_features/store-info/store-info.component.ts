import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { StoreRegistrationComponent } from '../../_core/store-registration/store-registration.component';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { Router } from '@angular/router';
import { textTransform } from 'html2canvas/dist/types/css/property-descriptors/text-transform';
import { PdfmbcService } from 'src/app/_core/services/pdfmbc.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_core/services/alert.service';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss']
})
export class StoreInfoComponent implements OnInit {
  @ViewChild('masterSettings') settings: any;
  columnDefs: ColDef[] = [];
  gridApi: any;
  isAnyRowSelected = false;
  rowData: any;
  client: any;
  masterForm!: FormGroup;
  constructor(private matDialog: MatDialog, private fb: FormBuilder, private alertService: AlertService, private clientService: ClientService, private excelService: ExcelService, private router: Router, private storageService: StorageService) { }
  ngOnInit(): void {
    let v = this.storageService.getClientUsername();
    this.clientService.getClientByUsername(v).subscribe(res => {
      this.client = res;
      this.getStoreListByClientId(this.client.id)
    })
    // headerCheckboxSelection: true, checkboxSelection: true,
    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, cellClass: 'locked-col', width: 120 },
      {
        headerName: 'Store Name', field: 'name', cellClass: 'locked-col', cellStyle: { cursor: 'pointer' },
        // onCellClicked: (e) => {
        //   console.log(e);
        //   this.router.navigate(['client/categery-info/' + e.data.id], { state: e.data });
        // },
        cellRenderer: (params: any) => {
          const editButton = document.createElement('button');
          editButton.innerHTML = '<i   class="fa fa-edit fa-lg"></i>';
          editButton.style.backgroundColor = 'transparent';
          editButton.style.color = '#3085d6';
          editButton.style.border = 'none';
          editButton.style.cursor = 'pointer';
          editButton.addEventListener('click', () => {
            const rowData = params.data;
            let dialogRef = this.matDialog.open(StoreRegistrationComponent, {
              data: rowData
            })
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              this.ngOnInit();
            });
          });
          const addButton = document.createElement('button');
          addButton.style.backgroundColor = 'transparent';
          addButton.style.border = 'none';
          // addButton.style.marginRight = '8px';
          addButton.style.cursor = 'pointer';
          addButton.textContent = params.data.name;
          addButton.style.textTransform = "capitalize";
          addButton.style.color = '#ff4081';
          addButton.addEventListener('click', () => {
            this.router.navigate(['client/categery-info/' + params.data.id], { state: params.data });
          });
          const div = document.createElement('div');
          div.classList.add('d-flex')
          // div.classList.add('justify-content-center')
          // div.classList.add('align-items-center')
          const settingButton = document.createElement('button');
          settingButton.innerHTML = '<i  class="fa fa-cog fa-lg"></i>';
          settingButton.style.backgroundColor = 'transparent';
          settingButton.style.color = '#3085d6';
          settingButton.style.border = 'none';
          settingButton.style.cursor = 'pointer';
          settingButton.title = 'Master Settings';
          settingButton.addEventListener('click', () => {
            const rowData = params.data;
            this.clientService.getMasterSettingsByStoreId(rowData.id).subscribe((res: any) => {
              console.log(res);
              this.masterForm.patchValue({
                isslot: true,
                fileduration: res.fileduration,
                slotcount: res.slotcount,
                cyclecount: res.cyclecount,
                store_storage: res.store_storage,
                totalduration: res.totalduration,
                id: res.id,
                clientid: res.clientid,
                storeid: res?.storeid,
                createdby: this.storageService.getUsername()
              })
              let dialogRef = this.matDialog.open(this.settings, {
                data: rowData?.name
              })
              dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
                this.ngOnInit();
              });
            })



          });
          div.appendChild(editButton);
          div.appendChild(settingButton);
          div.appendChild(addButton);
          return div;
        }
      },
      // {
      //   headerName: 'Actions', field: 'zipcode', cellRenderer: (params: any) => {
      //     const settingButton = document.createElement('button');
      //     settingButton.innerHTML = '<i style="font-size:large;" class="fa fa-cogs"></i>';
      //     settingButton.style.backgroundColor = 'transparent';
      //     settingButton.style.color = '#3085d6';
      //     settingButton.style.border = 'none';
      //     settingButton.style.cursor = 'pointer';
      //     settingButton.title = 'Master Settings';
      //     settingButton.addEventListener('click', () => {
      //       const rowData = params.data;
      //       this.clientService.getMasterSettingsByStoreId(rowData.id).subscribe((res: any) => {
      //         console.log(res);
      //         this.masterForm.patchValue({
      //           isslot: true,
      //           fileduration: res.fileduration,
      //           slotcount: res.slotcount,
      //           cyclecount: res.cyclecount,
      //           store_storage: res.store_storage,
      //           totalduration: res.totalduration,
      //           id: res.id,
      //           clientid: res.clientid,
      //           storeid: res?.storeid
      //         })
      //         let dialogRef = this.matDialog.open(this.settings, {
      //           data: rowData?.name
      //         })
      //         dialogRef.afterClosed().subscribe(result => {
      //           console.log('The dialog was closed');
      //           this.ngOnInit();
      //         });
      //       })



      //     });
      //     const div = document.createElement('div');
      //     div.appendChild(settingButton)
      //     return div;
      //   }
      // },
      { headerName: 'Store Name', field: 'storecode' },
      { headerName: 'Username', cellStyle: { "text-transform": "none" }, field: 'username' },
      { headerName: 'Password', cellStyle: { "text-transform": "none" }, field: 'password' },
      { headerName: 'Email', field: 'email' },
      {
        headerName: 'Country', field: 'country', valueGetter: (params: any) => {
          console.log(params);

          if (params.data.country) {
            return params.data.country.countryname;
          } else {
            return "No Country";
          }
        }
      },

      {
        headerName: 'State', field: 'statename', width: 250, valueGetter: (params: any) => {

          if (params.data.state) {

            return params.data.state.statename;
          } else {
            return "N/A";
          }
        }
      }, {
        headerName: 'District', field: 'district', minWidth: 250, valueGetter: (e: any) => {
          return e.data?.district?.name;
        }
      },
      {
        headerName: 'City', field: 'cityname', valueGetter: (params: any) => {

          if (params.data.city) {
            return params.data.city.cityname;
          } else {
            return "N/A";
          }
        }
      }
      ,
      {
        headerName: 'Location', field: 'cityname', valueGetter: (params: any) => {
          if (params.data.location) {
            return params?.data?.location?.area;
          } else {
            return "N/A";
          }
        }
      }, { headerName: 'Zip code', field: 'zipcode' },
      { headerName: 'Createdby', field: 'createdby' },
      { headerName: 'Creationdate', field: 'createddate' },
      { headerName: 'Updationdate', field: 'updatedate' },
    ];
    this.masterForm = this.fb.group({
      isslot: [false, Validators.required],
      fileduration: ['', Validators.required],
      slotcount: [{ value: '', disabled: true }, Validators.required],
      cyclecount: ['', Validators.required],
      store_storage: ['', Validators.required],
      totalduration: ['', Validators.required],
      id: ['', Validators.required],
      clientid: ['', Validators.required],
      storeid: ['', Validators.required],
      createdby: this.storageService.getUsername()
    })
  }

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // minWidth: 180,
      floatingFilter: true
    },
    pagination: true,
    paginationPageSize: 13,
    autoHeight: true,
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;

  }
  getStoreListByClientId(clientid: any) {
    this.clientService.getStoreListByClientId(clientid).subscribe((res: any) => {
      this.rowData = res;
    })
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
    }
  }
  exportPdf() {

  }
  exportAsExcelFile() {
    const title = 'Stores Information';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Store name': obj?.name,
        'Username': obj?.username,
        'Password': obj?.password,
        'Store code': obj?.storecode,
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
    let cellSize = { a: "25", b: "15", c: "15", d: "15", e: "15", f: "35", g: "35", h: "25", i: "25", j: "25", k: "35", l: "15", m: "25" }
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
  open() {
    let dialogRef = this.matDialog.open(StoreRegistrationComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }


  saveMasterForm() {
    console.log(this.masterForm.value);
    this.masterForm.get('slotcount')?.enable()
    if (this.masterForm.invalid) {
      return
    }
    console.log(this.masterForm.value);

    this.clientService.editStoreMasterSettings(this.masterForm.value).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
      this.ngOnInit();
      this.disableMasterForm();
      this.matDialog.closeAll();

    }, err => {
      this.masterForm.get('slotcount')?.disable()
      this.alertService.showError(err?.error?.message);
    })

  }
  enableMasterForm() {
    this.masterForm.enable();
    this.masterForm.get('slotcount')?.disable();
  }
  disableMasterForm() {
    this.masterForm.disable();
  }
}
