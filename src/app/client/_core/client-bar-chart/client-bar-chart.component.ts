import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AgChartOptions } from 'ag-charts-community';
@Component({
  selector: 'app-client-bar-chart',
  templateUrl: './client-bar-chart.component.html',
  styleUrls: ['./client-bar-chart.component.scss']
})
export class ClientBarChartComponent implements OnInit {
  options: AgChartOptions;
  constructor() {
    this.options = {
      autoSize: true,
      title: { text: "Device Status" },
      subtitle: { text: 'Month Based Device Status' },
      series: [
        {
          // data: [
          //   {
          //     count: 1,
          //     month: "january"
          //   },
          //   {
          //     count: 42,
          //     month: "February"
          //   },
          //   {
          //     count: 12,
          //     month: "March"
          //   }, {
          //     count: 1,
          //     month: "April"
          //   },
          //   {
          //     count: 42,
          //     month: "May"
          //   },
          //   {
          //     count: 12,
          //     month: "June"
          //   },
          //   {
          //     count: 1,
          //     month: "July"
          //   },
          //   {
          //     count: 39,
          //     month: "August"
          //   },
          //   {
          //     count: 12,
          //     month: "September"
          //   }, {
          //     count: 1,
          //     month: "Oct"
          //   },
          //   {
          //     count: 42,
          //     month: "Nov"
          //   },
          //   {
          //     count: 12,
          //     month: "December"
          //   },

          // ],
          xKey: 'month',
          yKey: 'active',
          yName: 'Online',
          stroke: '#03a9f4',
          marker: {
            fill: '#03a9f4',
            stroke: '#0276ab',
          },
        },
        {
          // data: [
          //   {
          //     count: 1,
          //     month: "january"
          //   },
          //   {
          //     count: 42,
          //     month: "February"
          //   },
          //   {
          //     count: 12,
          //     month: "March"
          //   }, {
          //     count: 1,
          //     month: "April"
          //   },
          //   {
          //     count: 42,
          //     month: "May"
          //   },
          //   {
          //     count: 12,
          //     month: "June"
          //   },


          //   {
          //     count: 1,
          //     month: "July"
          //   },
          //   {
          //     count: 42,
          //     month: "August"
          //   },
          //   {
          //     count: 12,
          //     month: "September"
          //   }, {
          //     count: 1,
          //     month: "Oct"
          //   },
          //   {
          //     count: 42,
          //     month: "Nov"
          //   },
          //   {
          //     count: 12,
          //     month: "December"
          //   },
          // ],
          xKey: 'month',
          yKey: 'close',
          yName: 'Offline',
          stroke: '#8bc24a',
          marker: {
            fill: '#8bc24a',
            stroke: '#658d36',
          },
        },
      ],
      // axes: [
      //   {
      //     type: 'time',
      //     position: 'bottom',
      //   },
      //   {
      //     type: 'number',
      //     position: 'left',
      //     label: {
      //       format: '#{.1f} °C',
      //     },
      //   },
      // ],
      legend: {
        position: 'bottom',
      },
    };
  }

  ngOnInit(): void {
    this.options.data = [
      {
        "month": "Sep-2022",
        "active": 11,
        "close": 63
      },
      {
        "month": "Oct-2022",
        "active": 4,
        "close": 26
      },
      {
        "month": "Nov-2022",
        "active": 0,
        "close": 5
      },
      {
        "month": "Dec-2022",
        "active": 0,
        "close": 0
      },
      {
        "month": "Jan-2023",
        "active": 5,
        "close": 60
      },
      {
        "month": "Feb-2023",
        "active": 87,
        "close": 470
      },
      {
        "month": "Mar-2023",
        "active": 256,
        "close": 120
      },
      {
        "month": "Apr-2023",
        "active": 2,
        "close": 0
      },
      {
        "month": "May-2023",
        "active": 4,
        "close": 0
      },
      {
        "month": "Jun-2023",
        "active": 164,
        "close": 0
      },
      {
        "month": "Jul-2023",
        "active": 125,
        "close": 0
      },
      {
        "month": "Aug-2023",
        "active": 0,
        "close": 0
      }
    ]
  }
  // chartOptions = {
  //   title: {
  //     text: "Weekly Total Device Impressions "
  //   },
  //   animationEnabled: true,
  //   axisY: {
  //     includeZero: true,
  //     suffix: ""
  //   },
  //   data: [{
  //     type: "bar",
  //     indexLabel: "{y}",
  //     yValueFormatString: "#,###",
  //     dataPoints: [
  //       { label: "1st Week", y: 75 },
  //       { label: "2st Week", y: 20 },
  //       { label: "3rd Week", y: 24 },
  //       { label: "4th Week", y: 29 },
  //       { label: "This Week", y: 13 }

  //     ]
  //   }]
  // }
}
