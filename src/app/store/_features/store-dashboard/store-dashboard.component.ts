import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  styleUrls: ['./store-dashboard.component.scss']
})
export class StoreDashboardComponent implements OnInit {

  date = new Date().toLocaleString();
  dueDate = new Date().toDateString();
  allnode: any = 0;
  online: any = 0;
  deactive: any = 0;
  active: any = 0;
  offline: any = 0;
  storage: any = 0;
  totalspace: any = "2GB";
  usedspace: any = "0MB";
  clientname: any;
  remains: any = 400;
  totalHrs = 0;
  remainingDays = 0;
  data: any;
  user: any;
  constructor(private clientService: ClientService, private storageService: StorageService) { }
  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.storageService.getUserRole() === 'STORE') {
      this.clientService.getStoreByUsername(this.user.username).subscribe((res: any) => {
        this.getStoreStorageInfoByStoreId(res.id)
      })
    } else if (this.storageService.getUserRole() === 'SUBUSER') {
      this.clientService.getSuserByUsername(this.user.username).subscribe((res: any) => {
        this.getStoreStorageInfoByStoreId(res.storeid)
      })
    }
  }
  getStoreStorageInfoByStoreId(id: any) {
    this.clientService.getStoreStorageInfoByStoreId(id).subscribe((res: any) => {
      this.data = res;
      this.storage = percentage(this.data?.totalspace, this.data?.usedspace)
    })
  }

}
function percentage(totalspace: any, usedspace: any) {
  let space;
  if (usedspace.slice(-2) == "KB") {
    space = usedspace.substring(0, usedspace.length - 2)
  } else if (usedspace.slice(-2) == "MB") {
    space = usedspace.substring(0, usedspace.length - 2) * 1024
  }
  else if (usedspace.slice(-2) == "GB") {
    space = usedspace.substring(0, usedspace.length - 2) * 1000 * 1024
  }
  // console.log(totalspace.substring(0, totalspace.length - 2));

  const total = totalspace.substring(0, totalspace.length - 2) * 1000 * 1024;
  const used = space;
  // console.log(total);
  // console.log(used);

  let percentage: any = ((used / total) * 100);
  let p = parseFloat(percentage).toFixed(3);
  return p;
}