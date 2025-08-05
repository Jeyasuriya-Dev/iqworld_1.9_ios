import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgChartClickEvent, AgChartDoubleClickEvent, AgChartLegendClickEvent, AgChartLegendDoubleClickEvent, AgChartOptions } from 'ag-charts-community';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-client-pie-chart',
  templateUrl: './client-pie-chart.component.html',
  styleUrls: ['./client-pie-chart.component.scss']
})
export class ClientPieChartComponent implements OnInit {
  public options!: AgChartOptions;
  public options1!: AgChartOptions;
  clientname: any;
  isCityWise = false;
  constructor(private clientService: ClientService, private storage: StorageService) {
    let username1 = this.storage.getUser();
    // console.log(username1);

    if (username1.roles[0] == 'ROLE_CLIENT') {
      this.clientname = this.storage.getUser();
    }
    else if (username1.roles[0] == 'ROLE_ADMIN') {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
      // console.log(json_object);
      // console.log(this.clientname);
    }
    else {
      this.clientname = sessionStorage.getItem('auth-client');
    }
    this.options = {
      data: this.getAllData(),
      series: [
        {
          type: 'pie',
          angleKey: 'devicecount',
          calloutLabelKey: 'statename',
          sectorLabelKey: 'devicecount',
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
          },
        },

      ],
    };
    this.options1 = {
      // data: this.getAllData(),
      series: [
        {
          type: 'pie',
          angleKey: 'devicecount',
          calloutLabelKey: 'statename',
          sectorLabelKey: 'devicecount',
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
          },
        },

      ],
    };
    this.getAllData()

  }
  getAllData(): any {
    let data: any = []
    this.clientService.getDeviceCountOfAllStates(this.clientname.username).subscribe(res => {
      data = res;
      this.options = {
        autoSize: true,
        title: {
          text: 'PAN INDIA DEVICE COUNT',
          fontSize: 20,
        },
        data: data,
        series: [
          {
            type: 'pie',
            angleKey: 'devicecount',
            calloutLabelKey: 'statename',
            sectorLabelKey: 'devicecount',
            sectorLabel: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        ],
        listeners: {
          seriesNodeClick: (event) => {
            //  console.log(event.datum.statename);
            let v = this.getStateData(event.datum.statename)
            //  console.log(v);

          },
        },

      };

    })
    return data;
  }
  ngOnInit(): void {

  }
  getStateData(statename: any): any {
    let data: any = []
    this.clientService.getDeviceCountByState(this.clientname.username, statename).subscribe(res => {
      data = res;
      // console.log(res);

      this.options = {
        autoSize: true,
        title: {
          text: statename + ' DEVICES',
          fontSize: 20,
        },
        data: data,
        series: [
          {
            type: 'pie',
            angleKey: 'Device_count',
            calloutLabelKey: 'City_name',
            sectorLabelKey: 'Device_count',
            sectorLabel: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        ],
        listeners: {
          seriesNodeClick: (event) => {
            this.getAllData()
          },
        },

      };

    })
    return data;
  }

  // yValueFormatString: "#,###.##'%'",
  // chartOptions = {
  //   animationEnabled: true,
  //   title: {
  //     text: "Last Week Device Impressions"
  //   },
  //   data: [{
  //     type: "doughnut",
  //     yValueFormatString: "#,###.##''",
  //     indexLabel: "{name}",
  //     dataPoints: [
  //       { y: 28, name: "Sunday" },
  //       { y: 10, name: "Monday" },
  //       { y: 20, name: "Tuesday" },
  //       { y: 15, name: "Wednesday" },
  //       { y: 23, name: "Thursday" },
  //       { y: 17, name: "Friday" },
  //       { y: 12, name: "Saturday" }
  //     ]
  //   }]
  // }

}
