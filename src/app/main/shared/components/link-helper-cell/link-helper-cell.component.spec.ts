import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHelperCellComponent } from './link-helper-cell.component';

describe('LinkHelperCellComponent', () => {
  let component: LinkHelperCellComponent;
  let fixture: ComponentFixture<LinkHelperCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkHelperCellComponent],
    });
    fixture = TestBed.createComponent(LinkHelperCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
