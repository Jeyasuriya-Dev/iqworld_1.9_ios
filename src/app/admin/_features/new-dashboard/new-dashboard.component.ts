import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent implements OnInit {

  total: any = 0;
  online: any = 0;
  deactive: any = 0;
  active: any = 0;
  offline: any = 0;
  clienlist: any = 0;
  storage: any = 0;
  totalspace: any = "0 MB";
  usedspace: any = "0 MB";
  todayAmount: any = 0;
  expired: any = 0;
  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getDeviceInfo();
    this.getClients();

    this.clientService.getStorageDetailsByAdmin().subscribe((res: any) => {
      // console.log(res);
      this.storage = percentage(res.totalspace, res.usedspace);
      this.totalspace = res.totalspace;
      this.usedspace = res.usedspace;

    })
  }
  getDeviceInfo() {
    this.clientService.getAllDeviceStatus().subscribe((res: any) => {
      // console.log(res);
      this.online = res.online;
      this.deactive = res.deactive;
      this.active = res.active;
      this.offline = res.offline;
      this.total = res.totalAmount
      this.total = formateMoney(this.total);
      this.todayAmount = formateMoney(res.todayAmount);
      this.expired = res.expired;
    })
  }
  getClients() {
    this.clientService.getAllClientList().subscribe((res: any) => {
      // console.log(res);
      this.clienlist = res.length;
    })
  }

}

function formateMoney(money: any) {
  let m: any = 0;
  if (money) {
    if (money <= 999) {
      m = money;
      m = parseFloat(m).toFixed(2);
    } else if (1000 <= money && money <= 99999) {
      m = (money / 1000);
      m = parseFloat(m).toFixed(2) + " K";
    }

    else if (100000 <= money && money <= 9999999) {
      m = (money / 100000);
      m = parseFloat(m).toFixed(2) + " L";
    }
    else {
      m = (money / 10000000);
      m = parseFloat(m).toFixed(2) + " Cr"
    }
  }

  // console.log(m);
  return m;
}

function percentage1(totalspace: any, usedspace: any) {

  // console.log(totalspace.substring(totalspace.length()-1, totalspace.length()));
  // console.log(used);
  // console.log(totalspace.length());

  // console.log(totalspace.substring(0, totalspace.length - 2));
  // console.log(totalspace.substring(0, totalspace.length - 2));

  const total = totalspace.substring(0, totalspace.length - 2) * 1000;
  const used = usedspace.substring(0, usedspace.length - 2);

  let percentage: any = ((used / total) * 100);
  let p = parseFloat(percentage).toFixed(2);
  return p;
}

function percentage(totalspace: any, usedspace: any) {


  // console.log(totalspace.substring(0,totalspace.length-2));

  // console.log(totalspace);
  // console.log(usedspace.slice(-2));
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