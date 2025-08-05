import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreScheduleInfoComponent } from './store-schedule-info.component';

describe('StoreScheduleInfoComponent', () => {
  let component: StoreScheduleInfoComponent;
  let fixture: ComponentFixture<StoreScheduleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreScheduleInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreScheduleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
