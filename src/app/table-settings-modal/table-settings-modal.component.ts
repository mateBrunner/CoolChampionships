import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ChampionshipData, Participant} from "../app.component";
import {TablesService} from "../tables.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {SharedService} from "../shared.service";

@Component({
  selector: 'app-table-settings-modal',
  templateUrl: './table-settings-modal.component.html',
  styleUrls: ['./table-settings-modal.component.scss']
})
export class TableSettingsModalComponent implements OnInit {

  @Input() inprogressChampionships: ChampionshipData[] = [];
  @Input() tableId: number;

  public checkForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private tablesService: TablesService,
              private sharedService: SharedService) {

  }

  ngOnInit() {

    this.checkForm = this.createGroup();
    this.tablesService.getChampsForTable(this.tableId).subscribe(
      (champs) => {
        for (const champ of champs) {
          this.checkForm.controls[champ.name].setValue(true);
        }
      }
    )

  }

  createGroup() {
    const group = this.formBuilder.group({});
    this.inprogressChampionships.forEach(control => group.addControl(control.name, this.formBuilder.control(false)));
    return group;
  }

  save() {
    let champsToSave = [];
    for (const champ of this.inprogressChampionships) {
      if (this.checkForm.controls[champ.name].value === true) {
        champsToSave.push(champ.id);
      }
    }
    this.tablesService.saveChampsToTable(this.tableId, champsToSave).subscribe((resp) =>
      this.activeModal.close()
    );
  }

  delete() {
    this.tablesService.deleteTable(this.tableId).subscribe((resp) => {
        this.activeModal.close();
        this.sharedService.tableDeleteEvent();
      }
    )
  }

}
