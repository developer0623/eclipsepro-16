import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationActionCellComponent } from './integration-action-cell.component';

describe('IntegrationActionCellComponent', () => {
  let component: IntegrationActionCellComponent;
  let fixture: ComponentFixture<IntegrationActionCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntegrationActionCellComponent],
    });
    fixture = TestBed.createComponent(IntegrationActionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
