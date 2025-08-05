import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDeviceAnalyticsComponent } from './client-device-analytics.component';

describe('ClientDeviceAnalyticsComponent', () => {
  let component: ClientDeviceAnalyticsComponent;
  let fixture: ComponentFixture<ClientDeviceAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDeviceAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDeviceAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
