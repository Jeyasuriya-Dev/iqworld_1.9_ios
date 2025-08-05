import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePlaylistComponent } from './store-playlist.component';

describe('StorePlaylistComponent', () => {
  let component: StorePlaylistComponent;
  let fixture: ComponentFixture<StorePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorePlaylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
