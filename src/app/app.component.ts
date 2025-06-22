import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeComponent } from './home/home.component';
@Component({
  selector: 'app-root',
  imports: [HomeComponent, MatGridListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DynamicMetricGenerator';
}
