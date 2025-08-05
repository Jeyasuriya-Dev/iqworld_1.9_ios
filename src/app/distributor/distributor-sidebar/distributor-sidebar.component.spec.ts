import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorSidebarComponent } from './distributor-sidebar.component';

describe('DistributorSidebarComponent', () => {
  let component: DistributorSidebarComponent;
  let fixture: ComponentFixture<DistributorSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributorSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
