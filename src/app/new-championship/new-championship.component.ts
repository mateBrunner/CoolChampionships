import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PlayersService} from '../players.service';
import {ChampionshipData, ChampionshipDetails, Participant} from '../app.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChampionshipService} from '../championship.service';
import {MatSnackBar} from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-new-championship',
  templateUrl: './new-championship.component.html',
  styleUrls: ['./new-championship.component.css']
})
export class NewChampionshipComponent implements OnInit {

  @Input() actualChampionships: ChampionshipData[] = [];

  public id;

  public newChampForm: FormGroup;
  public formats = ['big-round', 'group'];
  public participantType: string;
  private allParticipants: Participant[];
  public filteredParticipants: Participant[];
  public selectedParticipants = [];
  public lastValidName: string;
  public spinner;
  public showPlayers = false;
  public selectedDoubleId: number;

  public _searchParticipant = '';
  set searchParticipant(value: string) {
    this._searchParticipant = value;
    this.filteredParticipants = this.filterParticipants();
  }
  get searchParticipant(): string {
    return this._searchParticipant;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private playersService: PlayersService,
              private championshipService: ChampionshipService,
              private snackBar: MatSnackBar,
              private zone: NgZone) {
    this.id = +this.router.url.split('/')[2];
  }

  ngOnInit() {
    this.getAllParticipants();
    this.buildNewChampForm();
    this.getChampionshipSettings();
  }

  buildNewChampForm() {
    this.newChampForm = new FormGroup({
      'newChampName': new FormControl(null, [Validators.required, this.checkNewChampName.bind(this)]),
      'format': new FormControl(null),
      'numberOfGroups': new FormControl(null),
      'numberOfMatches': new FormControl(null),
      'sizeOfPlayoff': new FormControl(null, [this.checkSizeOfPlayoff.bind(this)])
    });
    this.newChampForm.controls['numberOfGroups'].setValidators([this.checkNumberOfGroups.bind(this)]);
    this.newChampForm.controls['numberOfMatches'].setValidators([this.checkNumberOfMatches.bind(this)]);
    this.newChampForm.controls['format'].valueChanges.subscribe(params => { this.updateSliders(); });
  }

  getChampionshipSettings() {
    this.championshipService.getChampionshipSettings(this.id).subscribe(
      (data) => {
        this.newChampForm.setValue({
          'newChampName': data.newChampName,
          'format': data.format,
          'numberOfGroups': data.numberOfGroups,
          'numberOfMatches': data.numberOfMatches,
          'sizeOfPlayoff': data.sizeOfPlayoff
        });
        this.lastValidName = this.newChampForm.controls['newChampName'].value;
        this.participantType = data.participantType;
        this.getSelectedParticipants();
        this.getAllParticipants();
        this._searchParticipant = '';
        if (this.participantType === 'DOUBLE') {
          this.showPlayers = false;
        } else {
          this.showPlayers = true;
        }
      }
    );
  }

  getAllParticipants() {
    this.playersService.getParticipants(this.participantType).subscribe((participants) => {
      this.allParticipants = participants;
      this.filteredParticipants = this.allParticipants;
    });
  }

  getSelectedParticipants() {
    this.playersService.getSelectedParticipants(this.id).subscribe(
      (participants) => {
        this.selectedParticipants = participants;
        this.filteredParticipants = this.filterParticipants();
        this.updateSliders();
      }
    );
  }

  filterParticipants() {
    return this.allParticipants.filter(participant =>
    participant.name.toLowerCase().indexOf(this._searchParticipant.toLowerCase()) !== -1 && !this.isInSelected(participant.name));
  }

  isInSelected(value) {
    for (const participant of this.selectedParticipants) {
      if (participant.name === value) {
        return true;
      }
    }
    return false;
  }

  changeForm() {
      const isInvalid = this.newChampForm.controls['newChampName'].invalid;
      if (!isInvalid) {
        this.lastValidName = this.newChampForm.controls['newChampName'].value;
      }
      this.championshipService.updateSettings(this.id,
                                              this.newChampForm.value,
                                              this.newChampForm.controls['newChampName'].invalid,
                                              this.lastValidName).subscribe(
        (response) => null
      );
  }

  checkNewChampName(control: FormControl): {[s: string]: boolean} {
    for (const champ of this.actualChampionships) {
      if (champ.name === control.value && this.id !== champ.id ) {
        return {'badName': true};
      }
    }
    return null;
  }

  checkNumberOfGroups(control: FormControl): {[s: string]: boolean} {
    if (this.selectedParticipants.length < 3 * control.value && this.newChampForm.get('format').value === 'group') {
      return {'tooFewParticipants': true};
    }
    return null;
  }

  checkNumberOfMatches(control: FormControl): {[s: string]: boolean} {
    if (this.selectedParticipants.length <= control.value && this.newChampForm.get('format').value === 'big-round') {
      return {'tooManyMatches': true};
    }
    return null;
  }

  checkSizeOfPlayoff(control: FormControl): {[s: string]: boolean} {
    if (this.selectedParticipants.length < control.value) {
      return {'tooFewParticipants': true};
    }
    return null;
  }

  selectParticipant(participant: Participant) {
    if (this.participantType === 'DOUBLE') {
      this.championshipService.addPlayerToDouble(this.id, this.selectedDoubleId, participant.id).subscribe(
        (response) => {
          this.selectedParticipants = response;
          this.showPlayers = false;
        }
      )
    } else {
      this.selectedParticipants.push(participant);
      this.championshipService.selectParticipant(this.id, participant.id).subscribe(
        (response) => null
      );
    }
    this.searchParticipant = '';
    this.updateSliders();
  }

  discardParticipant(player: Participant) {
    this.selectedParticipants.splice(this.selectedParticipants.indexOf(player), 1);
    this.filteredParticipants = this.filterParticipants();
    this.updateSliders();
    this.championshipService.deselectParticipant(this.id, player.id).subscribe(
      (response) => null
    );
  }

  addDouble() {
    this.championshipService.addDouble(this.id).subscribe(
      (response) => {
        this.selectedParticipants = response;
        this.updateSliders();
      }
    )
  }

  addPlayerToDouble(doubleId: number) {
    this.showPlayers = true;
    this.selectedDoubleId = doubleId;
  }

  addParticipant() {
    if (this._searchParticipant.length < 3) {
      this.showSnackBar('NAME IS TOO SHORT!');
    } else {
      let isValid = true;
      for (const player of this.allParticipants ) {
        if (player.name === this._searchParticipant ) {
          this.showSnackBar('NAME ALREADY EXISTS!');
          isValid = false;
          break;
        }
      }
      if (isValid) {
        this.playersService.addParticipant(this._searchParticipant).subscribe(
          (player) => {
            this.allParticipants.push(player);
            this.filteredParticipants = this.filterParticipants();
          }
        );
      }
    }
  }

  showSnackBar(message: string) {
    this.zone.run(() => {
      this.snackBar.open(message, null, {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'end'
      });
    });
  }

  updateSliders() {
    this.newChampForm.controls['numberOfMatches'].updateValueAndValidity();
    this.newChampForm.controls['sizeOfPlayoff'].updateValueAndValidity();
    this.newChampForm.controls['numberOfGroups'].updateValueAndValidity();
  }

  onSubmit() {
    this.championshipService.startChampionship(this.id).subscribe(
      (response) =>
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
          this.router.navigate(['/championship/' + this.id ]))
    );
  }

}
