import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldersGridComponent } from './folders-grid.component';

describe('FoldersGridComponent', () => {
  let component: FoldersGridComponent;
  let fixture: ComponentFixture<FoldersGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoldersGridComponent]
    });
    fixture = TestBed.createComponent(FoldersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
