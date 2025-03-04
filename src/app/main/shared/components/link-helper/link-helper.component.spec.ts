import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHelperComponent } from './link-helper.component';

describe('LinkHelperComponent', () => {
  let component: LinkHelperComponent;
  let fixture: ComponentFixture<LinkHelperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkHelperComponent],
    });
    fixture = TestBed.createComponent(LinkHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
