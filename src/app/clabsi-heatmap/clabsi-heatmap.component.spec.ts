import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapComponent } from './clabsi-heatmap.component';

describe('ClabsiHeatmapComponent', () => {
  let component: HeatMapComponent;
  let fixture: ComponentFixture<HeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
