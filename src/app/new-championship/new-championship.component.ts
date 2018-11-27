import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PlayersService} from '../players.service';
import {ChampionshipData, ChampionshipDetails, Player} from '../app.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChampionshipService} from '../championship.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-championship',
  templateUrl: './new-championship.component.html',
  styleUrls: ['./new-championship.component.css']
})
export class NewChampionshipComponent implements OnInit {

  @Input() actualChampionships: ChampionshipData[] = [];

  public id;
  navigationSubscription;

  public newChampForm: FormGroup;
  public formats = ['big-round', 'group'];

  private allPlayers: Player[];
  public filteredPlayers: Player[];
  public selectedPlayers = [];
  public lastValidName: string;
  public spinner;

  public _searchPlayer = '';
  set searchPlayer(value: string) {
    this._searchPlayer = value;
    this.filteredPlayers = this.filterPlayers();
  }
  get searchPlayer(): string {
    return this._searchPlayer;
  }
  public addPlayerError = null;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private playersService: PlayersService,
              private championshipService: ChampionshipService,
              private snackBar: MatSnackBar,
              private zone: NgZone) {

    console.log('new championship constructor');

    this.id = +this.router.url.split('/')[2];

  }

  ngOnInit() {
    this.getAllPlayers();
    this.buildNewChampForm();
    this.subscribeForChampionshipId();
  }

  getAllPlayers() {
    this.playersService.getPlayers().subscribe((players) => {
      this.allPlayers = players;
      this.filteredPlayers = this.allPlayers;
    });
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

  subscribeForChampionshipId() {
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
        this._searchPlayer = '';
        this.getSelectedPlayers();
      }
    );
  }

  getSelectedPlayers() {
    this.playersService.getSelectedPlayers(this.id).subscribe(
      (players) => {
        this.selectedPlayers = players;
        this.filteredPlayers = this.filterPlayers();
        this.updateSliders();
      }
    );
  }

  filterPlayers() {
    return this.allPlayers.filter(player =>
    player.name.toLowerCase().indexOf(this._searchPlayer.toLowerCase()) !== -1 && !this.isInSelected(player.name));
  }

  isInSelected(value) {
    for (const player of this.selectedPlayers) {
      if (player.name === value) {
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
    if (this.selectedPlayers.length < 3 * control.value && this.newChampForm.get('format').value === 'group') {
      return {'tooFewPlayers': true};
    }
    return null;
  }

  checkNumberOfMatches(control: FormControl): {[s: string]: boolean} {
    if (this.selectedPlayers.length <= control.value && this.newChampForm.get('format').value === 'big-round') {
      return {'tooManyMatches': true};
    }
    return null;
  }

  checkSizeOfPlayoff(control: FormControl): {[s: string]: boolean} {
    if (this.selectedPlayers.length < control.value) {
      return {'tooFewPlayers': true};
    }
    return null;
  }

  selectPlayer(player: Player) {
    this.selectedPlayers.push(player);
    this.searchPlayer = '';
    this.updateSliders();

    this.championshipService.selectPlayer(this.id, player.id).subscribe(
      (response) => null
    );
  }

  discardPlayer(player: Player) {
    this.selectedPlayers.splice(this.selectedPlayers.indexOf(player), 1);
    this.filteredPlayers = this.filterPlayers();
    this.updateSliders();

    this.championshipService.deselectPlayer(this.id, player.id).subscribe(
      (response) => null
    );
  }

  addPlayer() {
    if (this._searchPlayer.length < 3) {
      this.showSnackBar('NAME IS TOO SHORT!');
    } else {
      let isValid = true;
      for (const player of this.allPlayers ) {
        if (player.name === this._searchPlayer ) {
          this.showSnackBar('NAME ALREADY EXISTS!');
          isValid = false;
          break;
        }
      }
      if (isValid) {
        this.playersService.addPlayer(this._searchPlayer).subscribe(
          (player) => {
            this.allPlayers.push(player);
            this.filteredPlayers = this.filterPlayers();
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
