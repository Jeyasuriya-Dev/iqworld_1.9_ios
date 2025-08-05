import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDeviceLogsComponent } from './client-device-logs.component';

describe('ClientDeviceLogsComponent', () => {
  let component: ClientDeviceLogsComponent;
  let fixture: ComponentFixture<ClientDeviceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDeviceLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDeviceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
