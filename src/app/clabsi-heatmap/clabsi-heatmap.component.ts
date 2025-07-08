import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule} from '@angular/common';
import * as data from '../data/heat-map.json';

@Component({
  selector: 'app-heat-map',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent implements OnInit {
  chartData = data;
  heatmapData: any[] = [];
  chartView: [number, number] = [0, 0];
  cellHeight = 40;
  colorScheme: Color = {
    name: 'heatmap',
    group: ScaleType.Quantile,
    selectable: true,
    domain: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  };
  private resizeObserver!: ResizeObserver;
  private chartContainer!: HTMLElement | null;

  constructor(private cdRef: ChangeDetectorRef, private elRef: ElementRef) {}

  ngOnInit() {
    this.formatHeatmapData();
  }

  ngAfterViewInit() {
    this.chartContainer = document.querySelector('.chart-view-wrapper');
    this.observeResize();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  formatHeatmapData() {
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

    this.heatmapData = Array.from(seriesMap.values());
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
      const height = this.heatmapData.length * this.cellHeight + 100;
      this.chartView = [width, height];
      this.cdRef.detectChanges();
    });
  }
}
