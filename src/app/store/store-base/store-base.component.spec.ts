import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBaseComponent } from './store-base.component';

describe('StoreBaseComponent', () => {
  let component: StoreBaseComponent;
  let fixture: ComponentFixture<StoreBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
