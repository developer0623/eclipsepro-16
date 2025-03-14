import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xl200SetupsComponent } from './xl200-setups.component';

describe('Xl200SetupsComponent', () => {
  let component: Xl200SetupsComponent;
  let fixture: ComponentFixture<Xl200SetupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xl200SetupsComponent]
    });
    fixture = TestBed.createComponent(Xl200SetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
