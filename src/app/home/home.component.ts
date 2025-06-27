import { Component, ViewChild } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { LineChartComponent } from '../line-chart/line-chart.component';
import hospitalData from '../data/hospital-data.json'; 
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { DrillDownChartComponent } from '../drill-down-chart/drill-down-chart.component';
import { HeatMapComponent } from '../clabsi-heatmap/clabsi-heatmap.component';
import { AreaChartComponent } from '../area-chart/area-chart.component';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, BarChartComponent, LineChartComponent, DrillDownChartComponent, HeatMapComponent, AreaChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  @ViewChild('mainContainer') chart: any;
  jsonData = hospitalData

  async exportChartAsPdf() {
    const chartElement = document.getElementById('chartToCapture')

    if(chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('chart.pdf');
    }
  }

  async exportChartAsImage() {
    const chartElement = document.getElementById('chartToCapture')
    if (!chartElement) return;

    html2canvas(chartElement).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'chart.png';
      link.click();
    });
  }
}
