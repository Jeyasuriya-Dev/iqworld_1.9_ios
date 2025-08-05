import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_core/services/storage.service';
import { ClientService } from '../_core/services/client.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  isAdmin = false;
  client: any;
  constructor(private router: Router, private storageService: StorageService, private clientService: ClientService) { }

  ngOnInit(): void {
    let v = this.storageService.getClientUsername();
    let a = this.storageService.getUserRole();
    let b = this.storageService.getClient();
    let c = this.storageService.getDistributor();
    if (b?.roles?.includes('ROLE_CLIENT')) {
      this.clientService.getClientByUsername(v).subscribe(res => {
        this.client = res;
      })
    }
    if (a == "ADMIN") {
      if (b?.username) {
        this.isAdmin = false;
      }
      else {
        this.isAdmin = true;
      }
    } else {
      this.isAdmin = false;
    }
    // console.log(this.isAdmin);

  }
  navgetToUrlAdmin(id: any) {
    this.router.navigateByUrl("admin/setting/" + id);

  }
  navgetToUrlClient(id: any) {
    this.router.navigateByUrl("client/setting/" + id);

  }
}
