import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncStateGridComponent } from './sync-state-grid.component';

describe('SyncStateGridComponent', () => {
  let component: SyncStateGridComponent;
  let fixture: ComponentFixture<SyncStateGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SyncStateGridComponent]
    });
    fixture = TestBed.createComponent(SyncStateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
