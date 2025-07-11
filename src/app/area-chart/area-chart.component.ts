import { Component, OnInit } from '@angular/core';
import * as pivcJson from '../data/pivc-dwell-time.json';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area-chart',
  imports: [NgxChartsModule, FormsModule, CommonModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnInit {
  multi: any[] = [];
  view: any[] = [900, 900];

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
  legendBelow: LegendPosition = LegendPosition.Below

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

