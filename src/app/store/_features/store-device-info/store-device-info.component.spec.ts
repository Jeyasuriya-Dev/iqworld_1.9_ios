import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDeviceInfoComponent } from './store-device-info.component';

describe('StoreDeviceInfoComponent', () => {
  let component: StoreDeviceInfoComponent;
  let fixture: ComponentFixture<StoreDeviceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDeviceInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
