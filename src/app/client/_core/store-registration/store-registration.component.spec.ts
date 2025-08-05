import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRegistrationComponent } from './store-registration.component';

describe('StoreRegistrationComponent', () => {
  let component: StoreRegistrationComponent;
  let fixture: ComponentFixture<StoreRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
