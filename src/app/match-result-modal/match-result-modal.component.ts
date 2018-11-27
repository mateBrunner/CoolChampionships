import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SharedService} from '../shared.service';
import {Player, PlayerInterface} from '../app.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatchesService} from '../matches.service';

@Component({
  selector: 'app-match-result-modal',
  templateUrl: './match-result-modal.component.html',
  styleUrls: ['./match-result-modal.component.css']
})
export class MatchResultModalComponent implements OnInit {

  @Input() player1: Player;
  @Input() player2: Player;
  @Input() matchId: number;
  @Input() point1: number;
  @Input() point2: number;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  public resultForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private sharedService: SharedService,
              private matchesService: MatchesService) {
    this.player1 = new Player(-1,'', -1);
    this.player2 = new Player(-1,'', -1);
    this.matchId = -1;
  }

  ngOnInit() {

    this.resultForm = new FormGroup({
      'point1': new FormControl(this.point1, [Validators.required, Validators.pattern('[0-3]')]),
      'point2': new FormControl(this.point2, [Validators.required, Validators.pattern('[0-3]')])
    });
    this.resultForm.setValidators([this.checkEqual.bind(this)]);
  }

  checkEqual(form: FormGroup): {[s: string]: boolean} {
    if (form.controls['point1'].value === form.controls['point2'].value) {
      return {'equalError': true};
    }
    return null;
  }

  save() {
    this.sharedService.matchEditEvent(
      {
        'matchId': this.matchId,
        'player1_id': +this.player1.id,
        'player2_id': +this.player2.id,
        'points': this.resultForm.value});
    this.activeModal.close();
  }

  delete() {
    this.resultForm.controls['point1'].setValue(null);
    this.resultForm.controls['point2'].setValue(null);
    this.save();
  }

}

class Opponent {

  constructor(
    public matchId: number,
    public name: string,
    public id: number,
    public pointOwn?: number,
    public pointOpp?: number,
  ) {}

}
