import { Component } from '@angular/core';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MatGridListModule } from '@angular/material/grid-list';
@Component({
  selector: 'app-root',
  imports: [DropdownComponent, MatGridListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DynamicMetricGenerator';
}
