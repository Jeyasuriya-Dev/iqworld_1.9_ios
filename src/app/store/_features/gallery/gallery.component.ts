import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  galleryMedia: any[] = []
  user: any;
  clientUsername: any;
  mediaList: any[] = [{ id: 1, name: 'all' }, { id: 2, name: 'image' }, { id: 3, name: 'video' }]
  constructor(private clientService: ClientService, private storageService: StorageService) {

  }
  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.storageService.getUserRole() === 'STORE' || this.storageService.getUserRole() === 'SUBUSER') {
      this.clientService.getStoreByUsername(this.user.username).subscribe((res: any) => {
        this.clientUsername = res.clientname
        this.getPlaylistFilesForGallery();
      })
    } else {
      this.clientUsername = this.storageService.getClientUsername();
      this.getPlaylistFilesForGallery();
    }

    this.getBrandList();
  }
  getBrandList() {
    this.clientService.getBrandList().subscribe((res: any) => {
      this.brandList = res;
      this.filteredBrandList = res;
    });

    this.clientService.getAllContentTags().subscribe((res: any) => {
      this.tagList = res;
      this.filteredTagList = res;
    });
  }
  getPlaylistFilesForGallery() {
    let v = {
      "clientname": this.clientUsername,
      "taglist": this.selectedTags,
      "brandlist": this.selectedBrands,
      "type": this.fileType
    }

    this.clientService.getPlaylistFilesForGallery(v).subscribe((res: any) => {
      this.galleryMedia = res;
    })
  }

  @ViewChild('selectbrand') selectbrand!: MatSelect;
  selectedBrands: any[] = [];
  allBrandSelected = false;
  brandList: any[] = [];
  filteredBrandList: any = []
  filterlistBrands(searchText: string): void {
    this.filteredBrandList = this.brandList.filter((brand: any) =>
      this.isSelectedAllBrands(brand.id) || brand.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  isSelectedAllBrands(id: any): boolean {
    return this.selectedBrands.some((selectedId: any) => selectedId === id);
  }

  toggleAllBrandListSelection() {
    if (this.allBrandSelected) {
      this.selectbrand.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectbrand.options.forEach((item: MatOption) => item.deselect());
    }
    this.getPlaylistFilesForGallery()
  }
  brandFilterOptionClick() {
    let newStatus = true;
    this.selectbrand.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allBrandSelected = newStatus;
    this.getPlaylistFilesForGallery()
  }


  @ViewChild('selectTag') selectTag!: MatSelect;
  selectedTags: any[] = [];
  allTagsSelected = false;
  tagList: any[] = [];
  filteredTagList: any[] = []
  filterTags(searchText: string): void {
    this.filteredTagList = this.tagList.filter((category: any) =>
      this.isSelectedTag(category.id) || category.tagname.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  isSelectedTag(categoryId: any): boolean {
    return this.selectedTags.some((selectedId: any) => selectedId === categoryId);
  }

  toggleAllTagSelection() {
    if (this.allTagsSelected) {
      this.selectTag.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectTag.options.forEach((item: MatOption) => item.deselect());
    }
    this.getPlaylistFilesForGallery()
  }

  tagOptionClick() {
    let newStatus = true;
    this.selectTag.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allTagsSelected = newStatus;
    this.getPlaylistFilesForGallery()
  }
  fileType: any = "all";
  mediaOptionClick(obj: any) {
    this.fileType = obj.name;
    this.getPlaylistFilesForGallery()
  }
  downloadFile(file: any) {
    fetchFile(file.url)
  }
}

function fetchFile(url: any) {
  fetch(url).then(res => res.blob()).then(file => {
    let tempUrl = URL.createObjectURL(file);
    const aTag = document.createElement("a");
    aTag.href = tempUrl;
    aTag.download = url.replace(/^.*[\\\/]/, '');
    document.body.appendChild(aTag);
    aTag.click();

    URL.revokeObjectURL(tempUrl);
    aTag.remove();
  }).catch(() => {
    alert("Failed to download file!");

  });
}