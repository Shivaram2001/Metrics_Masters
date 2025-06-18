import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-drilldown-chart',
  templateUrl: './drill-down-chart.component.html',
  imports: [NgxChartsModule],
  styleUrls: ['./drill-down-chart.component.css']
})
export class DrillDownChartComponent implements OnChanges {
  @Input() chartData: any;
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData'] && this.chartData) {
      this.prepareMainChart();
    }
  }

  prepareMainChart() {
    this.isDrilldown = false;
    this.selectedStep = '';
    const units = this.chartData.pivProcedureObservations[0].unitsComparison;
    this.mainChartData = units.map((item: any) => {
      this.dataMap.set(item.field, item); // <-- this works!
      return {
        name: item.field,
        value: Math.round((item.value ?? 0) * 100)
      };
    });
   
    this.obsCount = this.chartData.pivProcedureObservations[0].surveyResponsesCount;
  }

  onBarSelect(event: any) {
    const original = this.dataMap.get(event.name);
    if (!original.details) return;
    this.isDrilldown = true;
    this.selectedStep = event.name;
    this.drilldownData = original.details.map((d: any) => ({
      name: d.field,
      value: Math.round((d.value ?? 0) * 100)
    }));
    this.obsCount = event.count;
  }

  goBack() {
    this.prepareMainChart();
  }

  formatPercent(val: number): string {
    return `${val}%`;
  }
}