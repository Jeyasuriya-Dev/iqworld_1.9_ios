import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent implements OnInit {
  client: any;
  categoryList: any;
  store: any;
  storeList: any = []
  activatedRouteId: any = 0;
  categoryForm!: FormGroup;
  isSubmitted = false
  constructor(
    private clientService: ClientService,
    private storageService: StorageService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private fb: FormBuilder, private router: Router,
    private excelService: ExcelService
  ) {
  }

  ngOnInit(): void {
    this.store = history.state;
    console.log('State:', history.state);
    let v = this.storageService.getClientUsername();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      // console.log(id);
      this.activatedRouteId = id
      console.log(id);

      if (id === '0') {
        this.clientService.getClientByUsername(v).subscribe(res => {
          this.client = res;
          this.getStoreListByClientId();
          this.getCategoryListByClientId(this.client.id);
        });
      } else {
        this.getCategoryListByStoreId(id);
      }
    });
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      storeid: ['', Validators.required]
    })
  }
  saveCategory() {
    this.isSubmitted = true
    if (!this.categoryForm.valid) {
      return
    }
    this.clientService.createCategory(this.categoryForm.value).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
      this.ngOnInit();
      this.matDialog.closeAll();
    });
  }
  getCategoryListByClientId(clientid: any) {
    this.categoryList = [];
    this.clientService.getCategoryListByClientId(clientid).subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  getCategoryListByStoreId(storeid: any) {
    this.categoryList = [];
    this.clientService.getCategoryListByStoreId(storeid).subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  createCategory(e: any) {
    if (this.activatedRouteId == 0) {
      this.clientService.getStoreListByClientId(this.client.id).subscribe((res: any) => {
        this.storeList = res
        this.matDialog.open(e, {
          maxWidth: 350
        })
        // const selectOptions = res.map((option: any) => `<option value="${option.id}">${toTitleCase(option.name)}</option>`).join('');
        // Swal.fire({
        //   title: '',
        //   html: `
        //     <div style="padding: 20px; text-align: center; ">
        //       <h1 style="font-size: 1.5em; margin-bottom: 20px; text-transform: capitalize;">Category Registration</h1>
        //       <div style="margin-bottom: 10px;">
        //         <input id="category-name" class="swal2-input" placeholder="Enter Category name here..." style="width: 90%; padding: 10px; border-radius: 5px; border: 1px solid #ced4da; box-sizing: border-box;">
        //       </div>
        //       <div style="margin-bottom: 20px;">
        //         <select id="category-type" class="swal2-select" style="width: 90%; padding: 10px; border-radius: 5px; border: 1px solid #ced4da; box-sizing: border-box;">
        //           ${selectOptions}
        //         </select>
        //       </div>
        //     </div>
        //   `,
        //   showCancelButton: true,
        //   confirmButtonText: 'Submit',
        //   cancelButtonText: 'Cancel',
        //   preConfirm: () => {
        //     return {
        //       name: (document.getElementById('category-name') as HTMLInputElement).value,
        //       type: (document.getElementById('category-type') as HTMLSelectElement).value
        //     }
        //   }
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     let payload = {
        //       name: result.value.name,
        //       storeid: result.value.type // Adjust as per your payload structure
        //     };
        //     this.clientService.createCategory(payload).subscribe((res: any) => {
        //       this.alertService.showSuccess(res.message);
        //       this.getCategoryListByClientId(this.client.id);
        //     });
        //   }
        // });



      })
    } else {
      Swal.fire({
        title: '',
        html: `<h1>${toTitleCase(this.store.name + " category registration")}</h1>`,
        input: 'text',
        inputPlaceholder: 'Enter Category name here...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputAttributes: {
          style: 'border: 1px solid #ced4da; border-radius: 5px; outline: none !important;',
          autofocus: 'autofocus'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          let payload = {
            name: result.value,
            storeid: this.store.id
          };
          this.clientService.createCategory(payload).subscribe((res: any) => {
            this.alertService.showSuccess(res.message);
            this.getCategoryListByStoreId(this.store.id);
          });
        }
      });
    }
  }
  filteredStoreList: any = [];
  getStoreListByClientId() {
    this.clientService.getStoreListByClientId(this.client.id).subscribe((res: any) => {
      this.filteredStoreList = res;
      this.storeList = res;
    })
  }


  @ViewChild('selectStore') selectStore!: MatSelect;
  selectedStores: any[] = [];
  allStoresSelected = false;

  filterCategories(searchText: string): void {
    this.filteredStoreList = this.storeList.filter((category: any) =>
      category.name.toLowerCase().includes(searchText.toLowerCase()) || category.storecode.toLowerCase().includes(searchText.toLowerCase())
    );
  }


  isSelectedStore(categoryId: any): boolean {
    return this.selectedStores.some((selectedId: any) => selectedId === categoryId);
  }

  showDevicesByCategory(e: any, type: any) {

    this.router.navigateByUrl('/client/screen', { state: { data: e, type: type } });
  }
  showPlaylistByCategory(e: any, type: any) {
    this.router.navigateByUrl('/client/playlist-info', { state: { data: e, type: type } });
  }
  toggleAllStoreSelection() {
    if (this.allStoresSelected) {
      this.selectStore.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectStore.options.forEach((item: MatOption) => item.deselect());
    }
    this.getCategoryListByStoreId(this.selectedStores);
  }

  categoryOptionClick() {
    let newStatus = true;
    this.selectStore.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allStoresSelected = newStatus;
    console.log(this.selectedStores);
    this.getCategoryListByStoreId(this.selectedStores)
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
