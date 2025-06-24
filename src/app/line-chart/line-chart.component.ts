import { Component, OnInit } from '@angular/core';
import * as pivcJson from '../data/pivc-dwell-time.json';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  imports: [NgxChartsModule, FormsModule, CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  multi: any[] = [];
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  chartView: [number, number] = [0, 0]

  colorScheme = {
    domain: ['#5AA454'],
  };

  ngOnInit() {
    this.prepareMainChart();
  }

  prepareMainChart() {
    this.multi = pivcJson.occurrenceDetails

    let multiCopy = JSON.parse(JSON.stringify(this.multi));

    multiCopy = multiCopy.map((el: any) => ({
      name: el.assessmentMonthYear,
      series: el.lineChartGroupData.map((el1: any) => ({
        name: el1.field.split(' ')[0],
        value: el1.value,
      })),
    }));

    this.multi = multiCopy;
  }
}

