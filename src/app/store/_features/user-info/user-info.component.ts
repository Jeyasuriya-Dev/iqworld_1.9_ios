import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  columnDefs: any;
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
  gridApi: any;
  isAnyRowSelected: any = false;
  rowData: any;
  userFormGroup!: FormGroup;
  store: any;
  constructor(private matDialog: MatDialog, private fb: FormBuilder, private excelService: ExcelService, private alertService: AlertService, private storageService: StorageService, private clientService: ClientService) { }
  ngOnInit(): void {
    let v = this.storageService.getUser();
    this.clientService.getStoreByUsername(v.username).subscribe(res => {
      this.store = res;
      this.getStoreUserByStoreid(this.store?.id)
      this.userFormGroup.addControl('storeid', new FormControl(this.store.id, [Validators.required]));
    });
    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: true, cellClass: 'locked-col', width: 100, checkboxSelection: true, headerCheckboxSelection: true },
      { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
      { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },
      { headerName: 'User code ', field: 'usercode' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone' },
      { headerName: 'Registered On', field: 'createddate' },
      { headerName: 'Last Modified On', field: 'updatedate' },
    ];

    this.userFormGroup = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      phone2: [''],
      createdby: [v.username]
    });
  }
  onGridReady(params: { api: string }) {

  }
  getStoreUserByStoreid(id: any) {
    this.clientService.getStoreUserByStoreid(id).subscribe(res => {
      console.log(res);
      this.rowData = res;
    })
  }
  exportPdf() {

  }
  exportAsExcelFile() {
    const title = 'Users Information';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Username': obj?.username,
        'Password': obj?.password,
        'Usercode': obj?.usercode,
        'Email': obj?.email,
        'Phone': obj?.phone,
        'Store name': obj?.storename,
        'Customer name': obj?.clientname,
        "Status": obj?.isactive ? 'active' : 'inactive',
        'Createddate': obj?.createddate,
        'Updatedate': obj?.updatedate,
      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "25", c: "15", d: "30", e: "15", f: "15", g: "15", h: "15", i: "25", j: "25" }
    let titleMerge = "'B1':'I4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'J1':'J4'";
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

  saveForm(): void {
    if (this.userFormGroup.invalid) {
      return
    }
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })

    console.log(this.userFormGroup.value);
    this.clientService.userCreationByStore(this.userFormGroup.value).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
      this.matDialog.closeAll();
      this.ngOnInit();
    }, err => {
      loader.close();
      this.alertService.showError(err?.error?.message);
    })
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows: any = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
    }
  }
  open(userForm: any) {
    this.matDialog.open(userForm, {
      width: 'max-content'
    })
  }
}
