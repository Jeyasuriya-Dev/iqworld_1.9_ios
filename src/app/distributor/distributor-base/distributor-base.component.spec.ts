import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorBaseComponent } from './distributor-base.component';

describe('DistributorBaseComponent', () => {
  let component: DistributorBaseComponent;
  let fixture: ComponentFixture<DistributorBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributorBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
