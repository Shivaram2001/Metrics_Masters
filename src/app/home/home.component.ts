import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { LineChartComponent } from '../line-chart/line-chart.component';
import hospitalData from '../data/hospital-data.json'; 
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { DrillDownChartComponent } from '../drill-down-chart/drill-down-chart.component';
@Component({
  selector: 'app-home',
  imports: [MatTabsModule, BarChartComponent, LineChartComponent, DrillDownChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  jsonData = hospitalData
}
