import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as data from '../data/bar-graph.json';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule, FormsModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  chartData = data;
  mainChartData: any[] = [];
  originalChartData: any[] = [];
  chartView: [number, number] = [0, 0];
  barHeight = 40;
  

  availableYears: string[] = [];
  yearSelection: { [year: string]: boolean } = {};
  showDataLabels: boolean = false; 
  legend: boolean = true// ✅ Added this line

  colorScheme: Color = {
    name: 'custom',
    group: ScaleType.Ordinal,
    selectable: true,
    domain: ['#0288d1', '#c2185b', '#fbc02d', '#7b1fa2']
  };

  private resizeObserver!: ResizeObserver;
  private chartContainer!: HTMLElement | null;

  constructor(private cdRef: ChangeDetectorRef, private elRef: ElementRef) {}

  ngOnInit() {
    this.formatChartData();
  }

  ngAfterViewInit() {
    this.chartContainer = document.querySelector('.chart-view-wrapper');
    this.observeResize();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  formatChartData() {
    const devices = ['PICC', 'CVC', 'Port', 'HD'];
    const seriesMap = new Map<string, any>();
    const yearsSet = new Set<string>();

    devices.forEach(device => {
      seriesMap.set(device, { name: device, series: [] });
    });

    this.chartData.clabsiOccurrenceByDeviceType.forEach((yearData: any) => {
      yearsSet.add(yearData.year.toString());
      yearData.details.forEach((entry: any) => {
        const group = seriesMap.get(entry.field);
        if (group) {
          group.series.push({ name: yearData.year.toString(), value: entry.value });
        }
      });
    });

    this.availableYears = Array.from(yearsSet).sort();
    this.availableYears.forEach(year => this.yearSelection[year] = true);

    this.originalChartData = Array.from(seriesMap.values());
    this.filterChartData();
  }

  filterChartData() {
    const selectedYears = this.availableYears.filter(year => this.yearSelection[year]);
    this.mainChartData = this.originalChartData.map(device => ({
      name: device.name,
      series: device.series.filter((s: any) => selectedYears.includes(s.name))
    }));
    this.updateChartView();
  }

  observeResize() {
    if (!this.chartContainer) return;
    this.resizeObserver = new ResizeObserver(() => this.updateChartView());
    this.resizeObserver.observe(this.chartContainer);
  }

  updateChartView() {
    setTimeout(() => {
      const width = this.chartContainer?.offsetWidth || 800;
      const height = this.mainChartData.length * this.barHeight + 80;
      this.chartView = [width, height];
      this.cdRef.detectChanges();
    });
  }

  getColor(name: string): string {
    const index = this.mainChartData.findIndex(item => item.name === name);
    return this.colorScheme.domain[index % this.colorScheme.domain.length];
  }
}
