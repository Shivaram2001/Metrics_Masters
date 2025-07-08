import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import * as data from '../data/pie-chart.json';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  pieData: any[] = [];
  chartView: [number, number] = [700, 700];

  legend: boolean = true;
  showLabels: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

 
ngOnInit() {
    this.pieData = (data as any).default;
  }
}

