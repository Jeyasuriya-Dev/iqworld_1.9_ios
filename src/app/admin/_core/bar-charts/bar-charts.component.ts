import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.scss']
})
export class BarChartsComponent implements OnInit {

  chart: any;
  constructor() { }

  ngOnInit(): void {
  }

  chartOptions = {
    title: {
      text: "Weekly Total Impressions "
    },
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1st Week", y: 75 },
        { label: "2st Week", y: 20 },
        { label: "3rd Week", y: 24 },
        { label: "4th Week", y: 29 },
        { label: "This Week", y: 13 }

      ]
    }]
  }
}
