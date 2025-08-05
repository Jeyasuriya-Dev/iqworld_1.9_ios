import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { Store } from 'polotno/model/store';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-playlist',
  templateUrl: './store-playlist.component.html',
  styleUrls: ['./store-playlist.component.scss']
})
export class StorePlaylistComponent implements OnInit {
  playlistFormGroup!: FormGroup;
  store: any;
  userip: any;
  categoryList: any = [];
  storeList: any;
  Playlist: any;
  filteredCategoryListDropDown: any = []
  filteredStoreListDropDown: any = [];
  filteredCategoryListDropDownList: any = []
  currentTime: any = new Date();
  userRoleUsername: any;
  userRole: any;
  storeId: any;
  storeUsername: any;
  clientUsername: any;
  category: any;
  constructor(private fb: FormBuilder, private matDialog: MatDialog, private excelService: ExcelService, private router: Router, private alertService: AlertService, private clientService: ClientService, private storageService: StorageService) { }
  ngOnInit(): void {
    this.category = history.state?.data;
    console.log(this.category);
    if (history.state?.data) {
      this.selectedStores = [this.category?.storeid]
      this.selectedFilterCategories = [this.category?.id]
    }
    let v = this.storageService.getUser();
    this.userRoleUsername = v.username;
    this.userRole = this.storageService.getUserRole();
    if (this.storageService.getUserRole() === 'STORE') {
      this.clientService.getStoreByUsername(v.username).subscribe(a => {
        this.store = a;
        this.clientUsername = this.store.clientname;
        this.storeId = this.store.id
        this.selectedStores = [this.store.id]

        this.getPlaylistForClientbyStoreAndCategory(3);
        // else {
        //   this.getPlaylistByStoreId(this.store.id, 3)
        // }
        this.clientService.getCategoryListByStoreId(this.store.id).subscribe((res: any) => {
          this.categoryList = res;
          this.filteredCategoryListDropDown = res;
          this.filteredCategoryListDropDownList = res;
        })
      })
    } else if (this.storageService.getUserRole() === 'SUBUSER') {
      this.clientService.getSuserByUsername(v.username).subscribe((a: any) => {
        this.storeId = a.storeid;
        this.clientUsername = a.clientname;
        this.selectedStores = [a.storeid]
        // if (history.state?.data) {
        //   this.selectedFilterCategories = [this.category.id]
        this.getPlaylistForClientbyStoreAndCategory(3);
        // } else {
        //   this.getPlaylistByStoreId(a.storeid, 3)
        // }
        this.clientService.getCategoryListByStoreId(a.storeid).subscribe((res: any) => {
          this.categoryList = res;
          this.filteredCategoryListDropDown = res;
          this.filteredCategoryListDropDownList = res;
        })
      })
    } else {
      this.clientUsername = this.storageService.getClientUsername();

      this.getPlaylistForClientbyStoreAndCategory(3);

      this.clientService.getClientByUsername(this.clientUsername).subscribe((res: any) => {
        this.clientService.getStoreListByClientId(res.id).subscribe((res: any) => {
          this.storeList = res;
          this.filteredStoreListDropDown = res;
        })
        this.clientService.getCategoryListByClientId(res.id).subscribe((res: any) => {
          this.categoryList = res;
          this.filteredCategoryListDropDown = res;
          this.filteredCategoryListDropDownList = res;
        })
      });
    }
    this.clientService.getUserIp().subscribe(res => {
      console.log(res);
      this.userip = res;
    })
    this.playlistFormGroup = this.fb.group({
      username: ['', Validators.required],
      playlistname: ['', [Validators.required]],
      clientname: ['', Validators.required],
      mediatype: ['', [Validators.required]],
      categorylist: ['', [Validators.required]],
      userip: ['', [Validators.required]],
      categoryid: ['0']
    });
    let myVar = setInterval(async () => {
      this.currentTime = sessionStorage.getItem('currentTime');
    }, 1000);
  }
  addPlaylist(userForm: any, type: any) {
    this.playlistFormGroup.patchValue({
      username: this.userRoleUsername,
      mediatype: type === "playlist" ? 3 : 4,
      userip: this.userip?.userip,
      clientname: this.clientUsername,
      categoryid: 0
    })
    this.selectedCategories = this.selectedFilterCategories
    console.log(this.selectedCategories);
    this.matDialog.open(userForm, {
      data: type,
      minWidth: '320px'
    })
  }
  saveForm() {
    if (this.playlistFormGroup.invalid) {
      return
    }
    console.log(this.playlistFormGroup);
    this.clientService.createPlaylistMBC(this.playlistFormGroup.value).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
      this.getPlaylistByStoreId(this.storeId, this.currentTab == 0 ? 3 : 4)
      this.matDialog.closeAll();
      this.playlistFormGroup.reset();
    }, err => {
      this.alertService.showError(err?.error?.message)
    })
  }
  currentTab: any = 0;
  onTabChanged(e: any) {
    console.log(e);
    this.currentTab = e.index;
    this.playlistFormGroup.reset();
    this.selectedCategories = [];
    this.allCategoriesSelected = false;
    this.selectedFilterCategories = [];
    if (this.userRole != 'STORE' && this.userRole != 'SUBUSER') {
      this.selectedStores = [];
    }
    if (history.state?.data) {
      this.selectedFilterCategories = [this.category.id];
      this.selectedStores = [this.category?.storeid]
    }

    // {
    //   this.getPlaylistByStoreId(this.storeId, e.index == 0 ? 3 : 4)
    // }
    this.getPlaylistForClientbyStoreAndCategory(e.index == 0 ? 3 : 4);


  }
  getPlaylistByStoreId(id: any, mediatype: any) {
    this.clientService.getPlaylistByStoreId(id, mediatype).subscribe((res: any) => {
      this.Playlist = res;
    }, err => {

    })
  }
  getPlaylistForClientbyStoreAndCategory(mediatype: any) {
    let payload = {
      clientname: this.clientUsername,
      storelist: this.selectedStores,
      categorylist: this.selectedFilterCategories,
      mediatype: mediatype
    }
    this.clientService.getPlaylistForClientbyStoreAndCategory(payload).subscribe((res: any) => {
      this.Playlist = res;
    }, err => {

    })
  }
  scheduleFormater(playlist: any): any {
    let current = new Date(this.currentTime).getTime();
    var sch_start_time = new Date(playlist.sch_start_time).getTime();
    var sch_end_time = new Date(playlist.sch_end_time).getTime();

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
        return "Not Scheduled";
      }
    }

    else {
      return "Not Scheduled";
    }
  }

  settingPlaylist(playlist: any, template: any) {
    // console.log(playlist);
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete content? , if you would, You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let loader = this.matDialog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.deletePlaylist(playlist.id).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          Swal.fire(
            'Deleted!',
            res.message,
            'success'
          )
          this.getPlaylistByStoreId(this.storeId, this.currentTab == 0 ? 3 : 4)
        }, err => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.message,
          });
        })
        // window.location.reload();
      }
    })

  }
  mediaUpload(playlist: any) {
    console.log(playlist);
    this.router.navigate(["/store/mediaupload/", playlist.id]);
  }


  @ViewChild('selectCategory') selectCategory!: MatSelect;
  selectedCategories: any[] = [];
  allCategoriesSelected = false;

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

  }
  categoryOptionClick() {
    let newStatus = true;
    this.selectCategory.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allCategoriesSelected = newStatus;

  }


  @ViewChild('selectFilterCategory') selectFilterCategory!: MatSelect;
  selectedFilterCategories: any[] = [];
  allFilterCategoriesSelected = false;

  filterlistCategories(searchText: string): void {
    this.filteredCategoryListDropDownList = this.categoryList.filter((category: any) =>
      this.isSelectedALLCategory(category.id) || category.categoryname.toLowerCase().includes(searchText.toLowerCase()) || category.categorycode.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  isSelectedALLCategory(categoryId: any): boolean {
    return this.selectedFilterCategories.some((selectedId: any) => selectedId === categoryId);
  }

  toggleAllCategoryFilterSelection() {
    if (this.allFilterCategoriesSelected) {
      this.selectFilterCategory.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectFilterCategory.options.forEach((item: MatOption) => item.deselect());
    }
    this.getPlaylistForClientbyStoreAndCategory(this.currentTab == 0 ? 3 : 4)
  }
  categoryFilterOptionClick() {
    let newStatus = true;
    this.selectFilterCategory.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allFilterCategoriesSelected = newStatus;
    this.getPlaylistForClientbyStoreAndCategory(this.currentTab == 0 ? 3 : 4);
  }


  @ViewChild('selectStore') selectStore!: MatSelect;
  selectedStores: any[] = [];
  allStoresSelected = false;
  filterStores(searchText: string): void {
    this.filteredStoreListDropDown = this.storeList.filter((category: any) =>
      this.isSelectedStore(category.id) || category.name.toLowerCase().includes(searchText.toLowerCase()) || category.storecode.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  isSelectedStore(categoryId: any): boolean {
    return this.selectedStores.some((selectedId: any) => selectedId === categoryId);
  }

  toggleAllStoresSelection() {
    if (this.allStoresSelected) {
      this.selectStore.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectStore.options.forEach((item: MatOption) => item.deselect());
    }
    this.selectedFilterCategories = []
    this.clientService.getCategoryListByStoreList(this.selectedStores).subscribe((res: any) => {
      this.categoryList = res;
      this.filteredCategoryListDropDown = res;
      this.filteredCategoryListDropDownList = res;
    })
    this.getPlaylistForClientbyStoreAndCategory(this.currentTab == 0 ? 3 : 4)
  }

  storeOptionClick() {
    let newStatus = true;
    this.selectStore.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allStoresSelected = newStatus;
    this.selectedFilterCategories = []
    this.clientService.getCategoryListByStoreList(this.selectedStores).subscribe((res: any) => {
      this.categoryList = res;
      this.filteredCategoryListDropDown = res;
      this.filteredCategoryListDropDownList = res;
    })
    this.getPlaylistForClientbyStoreAndCategory(this.currentTab == 0 ? 3 : 4)
  }
  getCountOfSpecificValue(arr: any, value: any) {
    if (!Array.isArray(arr)) {
      return 0;
    }

    let count = 0;
    for (const element of arr) {
      if (element === value) {
        count++;
      }
    }
    return count > 0 ? count : 0;
  }
  exportAsExcelFile() {
    let title: any = "";
    let data: any = []
    console.log(this.currentTab);

    for (let obj of this.Playlist) {
      // console.log(obj);
      if (this.currentTab == 0) {
        title = 'Schedule Playlist Information'
        let g = {
          'Playlist Name': obj?.filename,
          'Store name': obj?.store?.storename,
          'Category name': obj?.categoryname,
          "Status": this.scheduleFormater(obj),
          'Schedule Start At': obj?.sch_start_time,
          'Schedule End At': obj?.sch_end_time,
          'Duration': obj?.duration,
          'Files': obj.file_count,
          'Total Slot': obj?.slot_info?.vertical_slot.length,
          'Vertical Empty Slot': this.getCountOfSpecificValue(obj?.slot_info?.vertical_slot, 'false'),
          'Vertical Filled Slot': this.getCountOfSpecificValue(obj?.slot_info?.vertical_slot, 'true'),
          'Horizontal Empty Slot': this.getCountOfSpecificValue(obj?.slot_info?.horizontal_slot, 'false'),
          'Horizontal Filled Slot': this.getCountOfSpecificValue(obj?.slot_info?.horizontal_slot, 'true'),
          'createddate': obj?.creationdate,
          'updatedate': obj?.updationdate,
        }
        data.push(g)
      } else {
        title = 'Default Playlist Information'
        let g = {
          'Playlist Name': obj?.filename,
          'Store name': obj?.store?.storename,
          'Category name': obj?.categoryname,
          "Status": obj.isactive && obj.isverified ? "default" : 'none',
          'Files': obj.file_count,
          'Total Slot': obj?.slot_info?.vertical_slot.length,
          'Vertical Empty Slot': this.getCountOfSpecificValue(obj?.slot_info?.vertical_slot, 'false'),
          'Vertical Filled Slot': this.getCountOfSpecificValue(obj?.slot_info?.vertical_slot, 'true'),
          'Horizontal Empty Slot': this.getCountOfSpecificValue(obj?.slot_info?.horizontal_slot, 'false'),
          'Horizontal Filled Slot': this.getCountOfSpecificValue(obj?.slot_info?.horizontal_slot, 'true'),
          'createddate': obj?.creationdate,
          'updatedate': obj?.updationdate,
        }
        data.push(g)
      }

    }
    let cellSize;
    let titleMerge;
    let imgMerge;
    let dateMerge;
    if (this.currentTab == 0) {
      cellSize = { a: "30", b: "25", c: "18", d: "25", e: "25", f: "25", g: "25", h: "25", i: "25", j: '25', k: '25', l: '25', m: '25', n: '25', o: '25' }
      titleMerge = "'B1':'N4'";
      imgMerge = "'A1':'A4'";
      dateMerge = "'O1':'O4'";
    } else {
      cellSize = { a: "30", b: "25", c: "18", d: "25", e: "25", f: "25", g: "25", h: "25", i: "25", j: '25', k: '25', l: '25' }
      titleMerge = "'B1':'K4'";
      imgMerge = "'A1':'A4'";
      dateMerge = "'L1':'L4'";
    }
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
