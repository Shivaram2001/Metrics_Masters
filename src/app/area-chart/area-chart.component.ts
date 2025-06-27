import { Component, OnInit } from '@angular/core';
import * as pivcJson from '../data/pivc-dwell-time.json';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [NgxChartsModule, FormsModule, CommonModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnInit {
  multi: any[] = [];
  chartView: [number, number] = [800, 400];

  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Year';
  yAxisLabel = 'Dwell Time (%)';
  timeline = true;

  colorScheme = {
    domain: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc']
  };

  ngOnInit() {
    this.prepareMainChart();
  }

  prepareMainChart() {
    const copy = JSON.parse(JSON.stringify(pivcJson.occurrenceDetails));

    this.multi = copy.map((item: any) => ({
      name: item.assessmentMonthYear,
      series: item.lineChartGroupData.map((point: any) => ({
        name: point.field.split(' ')[0],
        value: point.value
      }))
    }));
  }
}
