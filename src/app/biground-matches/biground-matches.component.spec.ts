import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigroundMatchesComponent } from './biground-matches.component';

describe('BigroundMatchesComponent', () => {
  let component: BigroundMatchesComponent;
  let fixture: ComponentFixture<BigroundMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigroundMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigroundMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
