import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSettingsModalComponent } from './table-settings-modal.component';

describe('TableSettingsModalComponent', () => {
  let component: TableSettingsModalComponent;
  let fixture: ComponentFixture<TableSettingsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
