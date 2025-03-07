import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPatternComponent } from './item-pattern.component';

describe('ItemPatternComponent', () => {
  let component: ItemPatternComponent;
  let fixture: ComponentFixture<ItemPatternComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPatternComponent],
    });
    fixture = TestBed.createComponent(ItemPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
