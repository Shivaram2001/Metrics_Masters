import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import * as data from '../data/bar-graph.json';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  chartData = data;
  mainChartData: any[] = [];
  chartView: [number, number] = [0, 0];
  barHeight = 40;
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

    devices.forEach(device => {
      seriesMap.set(device, { name: device, series: [] });
    });

    this.chartData.clabsiOccurrenceByDeviceType.forEach((yearData: any) => {
      yearData.details.forEach((entry: any) => {
        const group = seriesMap.get(entry.field);
        if (group) {
          group.series.push({ name: yearData.year.toString(), value: entry.value });
        }
      });
    });

    this.mainChartData = Array.from(seriesMap.values());
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

  downloadChart() {
  const chartElement = document.getElementById('chartToCapture');
  if (!chartElement) return;

  html2canvas(chartElement).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'bar-chart.png';
    link.click();
  });
}
}

