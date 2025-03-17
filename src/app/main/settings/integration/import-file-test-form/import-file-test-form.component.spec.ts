import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFileTestFormComponent } from './import-file-test-form.component';

describe('ImportFileTestFormComponent', () => {
  let component: ImportFileTestFormComponent;
  let fixture: ComponentFixture<ImportFileTestFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFileTestFormComponent],
    });
    fixture = TestBed.createComponent(ImportFileTestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
