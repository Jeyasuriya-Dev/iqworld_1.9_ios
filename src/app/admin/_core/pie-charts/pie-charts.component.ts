import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-charts.component.html',
  styleUrls: ['./pie-charts.component.scss']
})
export class PieChartsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  chartOptions = {
    animationEnabled: true,
    title: {
      text: "Last Week Total Impressions"
    },
    data: [{
      type: "doughnut",
      yValueFormatString: "#,###.##'K'",
      indexLabel: "{name}",
      dataPoints: [
        { y: 28, name: "Sunday" },
        { y: 10, name: "Monday" },
        { y: 20, name: "Tuesday" },
        { y: 15, name: "Wednesday" },
        { y: 23, name: "Thursday" },
        { y: 17, name: "Friday" },
        { y: 12, name: "Saturday" }
      ]
    }]
  }
 
}
