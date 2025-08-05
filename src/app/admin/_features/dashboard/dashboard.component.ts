import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  total: any = 0;
  online: any = 0;
  deactive: any = 0;
  active: any = 0;
  offline: any = 0;
  clienlist: any = 0;
  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getDeviceInfo();
    this.getClients();
    this.start()
  }
  getDeviceInfo() {
    this.clientService.getAllDeviceStatus().subscribe((res: any) => {
      // console.log(res);
      this.total = res.total
      this.online = res.online;
      this.deactive = res.deactive;
      this.active = res.active;
      this.offline = res.offline;
    })
  }
  getClients() {
    this.clientService.getAllClientList().subscribe((res: any) => {
      // console.log(res);
      this.clienlist = res.length;
    })
  }

  intervalId = 0;
  message = '';
  seconds = 60;

  clearTimer() {
    clearInterval(this.intervalId);
  }
  ngOnDestroy() {
    this.clearTimer();
  }

  start() {
    this.countDown();
  }
  stop() {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;

      if (this.seconds < 0) {
        this.seconds = 60;
      } // reset
      this.message = `${this.seconds}s`;
      if(this.seconds === 0){
          // window.location.reload();
          this.ngOnInit();
      }
    }, 1000);
  }
}
