import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-store-category-info',
  templateUrl: './store-category-info.component.html',
  styleUrls: ['./store-category-info.component.scss']
})
export class StoreCategoryInfoComponent {
  categoryList: any;
  store: any;
  storeList: any = []
  categoryForm!: FormGroup;
  isSubmitted = false;
  userRole: any;
  constructor(
    private clientService: ClientService,
    private storageService: StorageService,
    private alertService: AlertService,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private excelService: ExcelService
  ) {
  }

  ngOnInit(): void {
    let v = this.storageService.getUser();
    console.log(v);
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      // storeid: [this.store.id, Validators.required]
      createdby: this.storageService.getUsername()
    })
    this.userRole = this.storageService.getUserRole();
    if (this.storageService.getUserRole() === 'STORE') {

      this.clientService.getStoreByUsername(v.username).subscribe(res => {
        this.store = res;
        this.categoryForm.addControl('storeid', new FormControl(this.store.id, [Validators.required]));
        this.getCategoryListByStoreId(this.store.id);
      });
    } else {
      this.clientService.getSuserByUsername(v.username).subscribe((res: any) => {

        // this.categoryForm.addControl('storeid', new FormControl(res.storeid, [Validators.required]));
        this.getCategoryListByStoreId(res.storeid);
      });
    }


  }
  saveCategory() {
    this.isSubmitted = true;
    console.log(this.categoryForm.value);

    if (this.categoryForm.invalid) {
      return
    }
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    if (this.isCategoryEdit) {
      this.clientService.editCategory(this.categoryForm.value.name, this.isCategoryEdit?.id, this.storageService.getUsername()).subscribe((res: any) => {
        this.alertService.showSuccess(res.message);
        this.ngOnInit();
        this.matDialog.closeAll();
      }, err => {
        this.alertService.showError(err?.error?.message);
        this.matDialog.closeAll();
      });
    } else {
      this.clientService.createCategory(this.categoryForm.value).subscribe((res: any) => {
        this.alertService.showSuccess(res.message);
        this.ngOnInit();
        this.matDialog.closeAll();
      });
    }
  }

  getCategoryListByStoreId(storeid: any) {
    this.categoryList = [];
    this.clientService.getCategoryListByStoreId([storeid]).subscribe((res: any) => {
      this.categoryList = res;
    });
  }
  isCategoryEdit: any = false;
  OpenCreateCategoryPopUp(e: any, data: any) {
    if (data) {
      this.categoryForm.patchValue({ name: data?.categoryname });
      this.isCategoryEdit = data;
    } else {
      this.isCategoryEdit = false;
    }
    this.matDialog.open(e, {
      maxWidth: 350
    })


  }
  showPlaylistByCategory(e: any, type: any) {
    this.router.navigateByUrl('/store/playlist', { state: { data: e, type: type } });
  }
  showDevicesByCategory(e: any, type: any) {
    this.router.navigateByUrl('/store/device-info', { state: { data: e, type: type } });
  }
  exportAsExcelFile() {
    const title = 'Category Information';
    let data: any = []
    for (let obj of this.categoryList) {
      // console.log(obj);
      let g = {
        'Store name': obj?.storename,
        'Category name': obj?.categoryname,
        'Code': obj?.categorycode,
        'Total device': obj?.total_device_count,
        'Online device': obj?.online_device_count,
        'Offline device': obj?.offline_device_count,
        "Status": obj?.isactive ? 'active' : 'inactive',
        'createddate': obj?.createddate,
        'updatedate': obj?.updatedate,
      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "25", c: "15", d: "15", e: "15", f: "15", g: "15", h: "25", i: "25", }
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
  }
}
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
