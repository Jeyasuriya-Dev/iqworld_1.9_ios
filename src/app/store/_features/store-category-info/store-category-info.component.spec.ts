import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCategoryInfoComponent } from './store-category-info.component';

describe('StoreCategoryInfoComponent', () => {
  let component: StoreCategoryInfoComponent;
  let fixture: ComponentFixture<StoreCategoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreCategoryInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCategoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
