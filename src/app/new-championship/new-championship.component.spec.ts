import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChampionshipComponent } from './new-championship.component';

describe('NewChampionshipComponent', () => {
  let component: NewChampionshipComponent;
  let fixture: ComponentFixture<NewChampionshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewChampionshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChampionshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
