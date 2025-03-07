import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitModalComponent } from './split-modal.component';

describe('SplitModalComponent', () => {
  let component: SplitModalComponent;
  let fixture: ComponentFixture<SplitModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SplitModalComponent],
    });
    fixture = TestBed.createComponent(SplitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
