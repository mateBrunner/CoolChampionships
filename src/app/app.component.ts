import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {ChampionshipService} from './championship.service';
import {SharedService} from './shared.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FormBuilder]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CoolChampionship';

  public actualChampionships: ChampionshipData[] = [];
  public selectedId: number;
  public newChampModalForm: FormGroup;
  public subscription: Subscription;

  constructor(private modalService: NgbModal, private route: ActivatedRoute,
              private router: Router, private championshipService: ChampionshipService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.updateActualChampionships();
    this.subscription = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized && val.state.root.firstChild !== null) {
        if (val.state.root.firstChild.url[0]['path'] === 'championship') {
          this.selectedId = val.state.root.firstChild.params['id'];
          console.log('hello');
        }
      }
    });

    this.newChampModalForm = new FormGroup({
      'newChampName': new FormControl('name', [Validators.required, this.checkNewChampName.bind(this)])
    });

  }

  updateActualChampionships() {
    this.championshipService.getActualChampionships().subscribe((champs) => {
      this.actualChampionships = champs;
      this.sharedService.actualChampionships = this.actualChampionships;
    });
  }

  open(content) {
    this.modalService.open(content);
  }

  createChampionship() {
    this.championshipService.createChampionship(this.newChampModalForm.get('newChampName').value).subscribe(
      (champ) => {
        this.actualChampionships.push(champ);
        this.router.navigate(['/championship/' + champ.id]);
      }
    );
    this.newChampModalForm.reset();
  }

  checkNewChampName(control: FormControl): {[s: string]: boolean} {
    for (const champ of this.actualChampionships) {
      if (champ.name === control.value) {
        return {'badName': true};
      }
    }
    return null;
  }

  onSubmit() {
    console.log('submit');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

export class ChampionshipData {

  constructor(
    public id: number,
    public name: string
  ) {}

  getName() {
    return this.name;
  }

}

export class ChampionshipSettings {

  constructor (
    public newChampName: string,
    public format: string,
    public numberOfGroups: number,
    public numberOfMatches: number,
    public sizeOfPlayoff: number
  ) {}

}

export class ChampionshipDetails {

  constructor(
    public id: number,
    public name: string,
    public format?: string,
    public numberOfMatches?: number,
    public sizeOfPlayoff?: number
  ) {}

}

export class BasicValue {

  constructor(
    public value: string
  ) {}

  getValue() {
    return this.value;
  }

}

export class FilterObject {
  constructor(
    public name: string,
    public selectedPlayers: Player[]
  ) {}

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

}

export class Player {

  constructor(
    public id: number,
    public name: string,
    public elo?: number
  ) {}

  public getName() {
    return this.name;
  }

}

export class PlayerInterface {

  id: number;
  name: string;
  elo: number;

}

