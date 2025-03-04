import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationExportEventsComponent } from './integration-export-events.component';

describe('IntegrationExportEventsComponent', () => {
  let component: IntegrationExportEventsComponent;
  let fixture: ComponentFixture<IntegrationExportEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntegrationExportEventsComponent],
    });
    fixture = TestBed.createComponent(IntegrationExportEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
