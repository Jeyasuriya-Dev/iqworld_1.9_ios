import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMediaUploadComponent } from './store-media-upload.component';

describe('StoreMediaUploadComponent', () => {
  let component: StoreMediaUploadComponent;
  let fixture: ComponentFixture<StoreMediaUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreMediaUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreMediaUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
