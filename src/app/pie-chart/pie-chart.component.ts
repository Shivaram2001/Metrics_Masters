import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, LegendPosition,ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import * as rawData from '../data/pie-chart.json'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule,FormsModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  chartView: [number, number] = [700, 700];
  legend: boolean = true;
  showLabels: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;

 
colorToggle: boolean = false;

multiColorScheme = {
  name: 'multiColor',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
};

monoColorScheme = {
  name: 'monoColor',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'],
};

get colorScheme() {
  return this.colorToggle ? this.monoColorScheme : this.multiColorScheme;
}

toggleColorScheme() {
  this.colorToggle = !this.colorToggle;
}

 
  infectionSourceData: any[] = [];

  ngOnInit() {
    const data = (rawData as any).default;
    this.infectionSourceData = this.transformToChartData(data["By Infection Source"]);

    const screenWidth = window.innerWidth;
   
this.chartView = screenWidth < 600 ? [300, 300] : [700, 700];

  }

  transformToChartData(obj: { [key: string]: number }): any[] {
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  }
}
