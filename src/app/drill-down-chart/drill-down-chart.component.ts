import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import * as unitComparisonDataJson from '../data/unit-comparison-data.json';
import * as hospitalDataJson from '../data/hospital-data.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drill-down-chart',
  templateUrl: './drill-down-chart.component.html',
  standalone: true,
  imports: [NgxChartsModule, FormsModule, CommonModule],
  styleUrls: ['./drill-down-chart.component.css']
})
export class DrillDownChartComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input() chartData: any;
  unitComparisonData: any = unitComparisonDataJson;
  hospitalData: any = hospitalDataJson;
  dataMap = new Map<string, any>();
  mainChartData: any[] = [];
  drilldownData: any[] = [];
  isDrilldown = false;
  selectedStep = '';
  obsCount = 0;
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1976d2']
  };
  overallAsepticAvg: number = 0;
  selectedView: string = 'hospital'; // 'hospital' or 'unit'
  chartView: [number, number] = [0, 0];
  drilldownChartView: [number, number] = [0, 0];
  drilldownOverallAsepticValue: string = 'N/A';
  barHeight = 40;
  private resizeObserver!: ResizeObserver;
  private chartContainer!: HTMLElement | null;

  constructor(private cdRef: ChangeDetectorRef, private elRef: ElementRef) {}

  ngOnInit() {
    this.prepareMainChart();
  }

  ngAfterViewInit() {
    this.chartContainer = document.querySelector('.chart-view-wrapper');
    this.observeContainer();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  observeContainer() {
    if (this.chartContainer) {
      this.resizeObserver = new ResizeObserver(() => this.updateChartView());
      this.resizeObserver.observe(this.chartContainer);
    }
  }

  updateChartView() {
    if (!this.chartContainer) return;
    
    // Use a timeout to ensure the view is stable before measuring
    setTimeout(() => {
      const width = this.chartContainer!.offsetWidth;
      if (this.isDrilldown) {
        const height = this.drilldownData.length * this.barHeight + 80;
        this.drilldownChartView = [width, height];
      } else {
        const height = this.mainChartData.length * this.barHeight + 80;
        this.chartView = [width, height];
      }
      this.cdRef.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData'] && this.chartData) {
      this.prepareMainChart();
    }
  }

  onViewChange(view: string) {
    this.selectedView = view;
    this.prepareMainChart();
  }

  prepareMainChart() {
    this.isDrilldown = false;
    this.selectedStep = '';
    this.dataMap.clear();

    if (this.selectedView === 'hospital') {
      const units = this.hospitalData.pivProcedureObservations[0].unitsComparison;
      const overall = units.find((item: any) => item.field === 'Performed procedure aseptically');
      const others = units.filter((item: any) => item.field !== 'Performed procedure aseptically');
      this.mainChartData = [
        { name: 'Overall aseptic procedure', value: Math.round((overall?.value ?? 0) * 100) },
        ...others.map((item: any) => ({ name: item.field, value: Math.round((item.value ?? 0) * 100) }))
      ];
      if (overall) this.dataMap.set('Overall aseptic procedure', overall);
      others.forEach((item: any) => this.dataMap.set(item.field, item));
      this.obsCount = this.hospitalData.pivProcedureObservations[0].surveyResponsesCount;
      this.overallAsepticAvg = Math.round((overall?.value ?? 0) * 100);
    } else {
      const unitComparisonDetails = this.unitComparisonData.pivUnitComparisonSummaryDetails[0];
      const units = unitComparisonDetails.unitsComparison;
      this.mainChartData = units.map((item: any) => ({
        name: item.field,
        value: Math.round((item.value ?? 0) * 100),
        extra: { count: item.count }
      }));
      units.forEach((item: any) => this.dataMap.set(item.field, item));
      this.obsCount = units.reduce((acc: number, item: any) => acc + item.count, 0);
    }
    this.updateChartView();
  }

  onBarSelect(event: any) {
    const original = this.dataMap.get(event.name);
    if (!original || (this.selectedView === 'hospital' && !original.details)) return;

    this.isDrilldown = true;
    this.selectedStep = event.name;

    if (this.selectedView === 'unit') {
      const overallAseptic = original.details.find((d: any) => d.field === 'Performed procedure aseptically');
      this.drilldownOverallAsepticValue = overallAseptic && overallAseptic.value !== null ? `${Math.round(overallAseptic.value * 100)}%` : 'N/A';
      this.drilldownData = original.details
        .filter((d: any) => d.field !== 'Performed procedure aseptically')
        .map((d: any) => ({
          name: d.field,
          value: d.value !== null ? Math.round(d.value * 100) : 0
        }));
      this.obsCount = original.count;
    } else {
      this.drilldownData = original.details.map((d: any) => ({
        name: d.field,
        value: Math.round((d.value ?? 0) * 100)
      }));
      this.obsCount = event.extra ? event.extra.count : 0;
    }
    this.updateChartView();
  }

  goBack() {
    this.isDrilldown = false;
    this.updateChartView();
  }

  formatPercent(val: number): string {
    return `${val}%`;
  }

  getYAxisMargin(): number[] {
    // [top, right, bottom, left]
    const left = window.innerWidth < 700 ? 100 : 220;
    return [20, 20, 40, left];
  }
}