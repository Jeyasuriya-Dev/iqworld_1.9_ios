import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBarChartComponent } from './client-bar-chart.component';

describe('ClientBarChartComponent', () => {
  let component: ClientBarChartComponent;
  let fixture: ComponentFixture<ClientBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
