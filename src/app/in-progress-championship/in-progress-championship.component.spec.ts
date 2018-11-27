import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressChampionshipComponent } from './in-progress-championship.component';

describe('InProgressChampionshipComponent', () => {
  let component: InProgressChampionshipComponent;
  let fixture: ComponentFixture<InProgressChampionshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProgressChampionshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProgressChampionshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
