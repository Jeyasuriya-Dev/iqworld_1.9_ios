import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelnameDropdownComponent } from './modelname-dropdown.component';

describe('ModelnameDropdownComponent', () => {
  let component: ModelnameDropdownComponent;
  let fixture: ComponentFixture<ModelnameDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelnameDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelnameDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
