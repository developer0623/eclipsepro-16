import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xl200ToolsComponent } from './xl200-tools.component';

describe('Xl200ToolsComponent', () => {
  let component: Xl200ToolsComponent;
  let fixture: ComponentFixture<Xl200ToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xl200ToolsComponent],
    });
    fixture = TestBed.createComponent(Xl200ToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
