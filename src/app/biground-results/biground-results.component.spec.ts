import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigroundResultsComponent } from './biground-results.component';

describe('BigroundResultsComponent', () => {
  let component: BigroundResultsComponent;
  let fixture: ComponentFixture<BigroundResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigroundResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigroundResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
