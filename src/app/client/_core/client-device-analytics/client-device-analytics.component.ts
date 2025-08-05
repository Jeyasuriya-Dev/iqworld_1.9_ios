import { AfterContentChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
@Component({
  selector: 'app-client-device-analytics',
  templateUrl: './client-device-analytics.component.html',
  styleUrls: ['./client-device-analytics.component.scss']
})
export class ClientDeviceAnalyticsComponent implements OnInit, AfterContentChecked {
  offline: any[] = [];
  online: any[] = [];
  clientUsername: any;
  chartOptions: any = {};
  selectedType: any = "today"
  constructor(private clientService: ClientService, private storageService: StorageService) { }
  ngOnInit(): void {

    this.clientUsername = this.storageService.getClientUsername();
    this.clientService.getDeviceStatusAnalysisreport(this.clientUsername, this.selectedType).subscribe((res: any) => {
      // console.log(res);
      this.offline = [];
      this.online = [];
      res.forEach((e: any) => {
        // console.log(e?.lable);
        var label = '';
        if (e?.lable == 'null') {
          label = '';
        } else {
          label = e?.lable;
        }
        let online = { x: new Date(e?.year, e.month - 1, e.day, e.time, 0), y: e?.online_device, label: label };
        let offline = { x: new Date(e?.year, e.month - 1, e.day, e.time, 0), y: e?.offline_device, label: label };
        // console.log(online);
        this.online.push(online)
        // console.log(offline);
        this.offline.push(offline)
      });
    });

  }
  ngAfterContentChecked() {
    this.chartOptions = {
      animationEnabled: true,
      // exportEnabled: true,
      toolTip: {
        shared: true,
      },
      title: {
        text: "Device Status Analysis"
      },
      axisY: {
        title: "Number of Devices"
      },
      data: [
        {
          // type: "line",
          type: 'area',
          name: "Online",
          showInLegend: true,
          legendMarkerType: "square",
          color: "rgba(124,252,0,0.8)",
          markerSize: 10,
          dataPoints: this.online
        },
        {
          // type: "line",
          type: "area",
          name: "Offline",
          showInLegend: true,
          legendMarkerType: "square",
          color: "rgba(219,112,147,0.8)",
          markerSize: 10,
          dataPoints: this.offline
        }]
    }

  }
  changeType(event: any) {
    // console.log(event);
    this.selectedType = event.value;
    this.ngOnInit();
    // this.clientService.getDeviceStatusAnalysisreport(this.clientUsername, this.selectedType).subscribe((res: any) => {
    //   // console.log(res);
    //   this.offline = [];
    //   this.online = [];
    //   res.forEach((e: any) => {
    //     console.log(e?.lable);
    //     var label = '';
    //     if (e?.lable == 'null') {
    //       label = '';
    //     } else {
    //       label = e?.lable;
    //     }
    //     let online = { x: new Date(e?.year, e.month - 1, e.day, e.time, 0), y: e?.online_device, label: label };
    //     let offline = { x: new Date(e?.year, e.month - 1, e.day, e.time, 0), y: e?.offline_device, label: label };
    //     // console.log(online);
    //     this.online.push(online)
    //     // console.log(offline);
    //     this.offline.push(offline)
    //   });
    // });
  }

  // chartOptions = {
  //   animationEnabled: true,
  //   title: {
  //     text: "Device Status Analysis"
  //   },
  //   axisY: {
  //     title: "Number of Devices"
  //   },
  //   data: [
  //     {
  //       type: "area",
  //       name: "online",
  //       showInLegend: true,
  //       legendMarkerType: "square",
  //       color: "rgba(124,252,0,0.6)",
  //       markerSize: 0,
  //       dataPoints: [
  //         { x: new Date(2013, 0, 1, 0, 0), y: 7, label: "midnight" },
  //         { x: new Date(2013, 0, 1, 1, 0), y: 8 },
  //         { x: new Date(2013, 0, 1, 2, 0), y: 5 },
  //         { x: new Date(2013, 0, 1, 3, 0), y: 7 },
  //         { x: new Date(2013, 0, 1, 4, 0), y: 6 },
  //         { x: new Date(2013, 0, 1, 5, 0), y: 8 },
  //         { x: new Date(2013, 0, 1, 6, 0), y: 12 },
  //         { x: new Date(2013, 0, 1, 7, 0), y: 24 },
  //         { x: new Date(2013, 0, 1, 8, 0), y: 36 },
  //         { x: new Date(2013, 0, 1, 9, 0), y: 35 },
  //         { x: new Date(2013, 0, 1, 10, 0), y: 37 },
  //         { x: new Date(2013, 0, 1, 11, 0), y: 29 },
  //         { x: new Date(2013, 0, 1, 12, 0), y: 34, label: "noon" },
  //         { x: new Date(2013, 0, 1, 13, 0), y: 38 },
  //         { x: new Date(2013, 0, 1, 14, 0), y: 23 },
  //         { x: new Date(2013, 0, 1, 15, 0), y: 31 },
  //         { x: new Date(2013, 0, 1, 16, 0), y: 34 },
  //         { x: new Date(2013, 0, 1, 17, 0), y: 29 },
  //         { x: new Date(2013, 0, 1, 18, 0), y: 14 },
  //         { x: new Date(2013, 0, 1, 19, 0), y: 12 },
  //         { x: new Date(2013, 0, 1, 20, 0), y: 10 },
  //         { x: new Date(2013, 0, 1, 21, 0), y: 8 },
  //         { x: new Date(2013, 0, 1, 22, 0), y: 13 },
  //         { x: new Date(2013, 0, 1, 23, 0), y: 11 }
  //       ]
  //     },
  //     {
  //       type: "area",
  //       name: "Offline",
  //       showInLegend: true,
  //       legendMarkerType: "square",
  //       color: "rgba(219,112,147,0.7)",
  //       markerSize: 0,
  //       dataPoints: [
  //         { x: new Date(2013, 0, 1, 0, 0), y: 12, label: "midnight" },
  //         { x: new Date(2013, 0, 1, 1, 0), y: 10 },
  //         { x: new Date(2013, 0, 1, 2, 0), y: 3 },
  //         { x: new Date(2013, 0, 1, 3, 0), y: 5 },
  //         { x: new Date(2013, 0, 1, 4, 0), y: 2 },
  //         { x: new Date(2013, 0, 1, 5, 0), y: 1 },
  //         { x: new Date(2013, 0, 1, 6, 0), y: 3 },
  //         { x: new Date(2013, 0, 1, 7, 0), y: 6 },
  //         { x: new Date(2013, 0, 1, 8, 0), y: 14 },
  //         { x: new Date(2013, 0, 1, 9, 0), y: 15 },
  //         { x: new Date(2013, 0, 1, 10, 0), y: 21 },
  //         { x: new Date(2013, 0, 1, 11, 0), y: 24 },
  //         { x: new Date(2013, 0, 1, 12, 0), y: 28, label: "noon" },
  //         { x: new Date(2013, 0, 1, 13, 0), y: 26 },
  //         { x: new Date(2013, 0, 1, 14, 0), y: 17 },
  //         { x: new Date(2013, 0, 1, 15, 0), y: 23 },
  //         { x: new Date(2013, 0, 1, 16, 0), y: 28 },
  //         { x: new Date(2013, 0, 1, 17, 0), y: 22 },
  //         { x: new Date(2013, 0, 1, 18, 0), y: 10 },
  //         { x: new Date(2013, 0, 1, 19, 0), y: 9 },
  //         { x: new Date(2013, 0, 1, 20, 0), y: 6 },
  //         { x: new Date(2013, 0, 1, 21, 0), y: 4 },
  //         { x: new Date(2013, 0, 1, 22, 0), y: 12 },
  //         { x: new Date(2013, 0, 1, 23, 0), y: 14 }
  //       ]
  //     }]
  // }
}
