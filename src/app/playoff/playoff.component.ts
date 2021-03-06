import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {MatchesService} from '../matches.service';
import {Match} from '../matches/matches.component';
import {MatchResultModalComponent} from '../match-result-modal/match-result-modal.component';
import {Subscription} from 'rxjs';
import {Result} from '../biground-matches/biground-matches.component';

@Component({
  selector: 'app-playoff',
  templateUrl: './playoff.component.html',
  styleUrls: ['./playoff.component.css']
})
export class PlayoffComponent implements OnInit, OnDestroy {

  public champId: number;
  public matchTable: PlayoffLevel[] = [];
  public sizeOfPlayoff: number;
  private subscription: Subscription;
  private matchSubscription: Subscription;
  public rankings: number[];
  public lastLevel: number;

  constructor(private modalService: NgbModal,
              private sharedService: SharedService,
              private router: Router,
              private matchesService: MatchesService) {
    this.champId = +this.router.url.split('/')[2];
    this.subscription = this.sharedService.getMatchEdit().subscribe(result =>
      this.saveResult(result)
    );

  }

  ngOnInit() {

    this.matchSubscription = this.matchesService.getPlayoff(this.champId).subscribe( data => {

      let tempMatchTable: PlayoffLevel[] = [];
      this.matchTable = null;
      const matches = data['matches'];
      this.rankings = data['rankings'];
      this.sizeOfPlayoff = matches.length;
      let numberOfLevels = Math.ceil(Math.log(this.sizeOfPlayoff) / Math.log(2));
      if (matches.length === 1) {
        numberOfLevels = 1;
      }

      let i = 0;
      let matchArray;
      while (i < numberOfLevels) {
        matchArray = [];
        tempMatchTable.push(new PlayoffLevel(i, matchArray));
        i++;
      }

      const firstLevel = this.sizeOfPlayoff > 8 ? 0 : this.sizeOfPlayoff > 4 ? 1 : this.sizeOfPlayoff > 2 ? 2 : 3;
      this.lastLevel = 3 - firstLevel;

      let nextRow = -1;
      let lastRow = 0;
      let match: Match;
      const fakePlayer = new Participant(-1, null, -1);
      const fakeMatch = new Match(-1,  fakePlayer, fakePlayer, null, null);

      for (const poMatch of matches) {
        match = poMatch['match'];
        if (match.participant1 === null) {
          match.participant1 = fakePlayer;
        }
        if (match.participant2 === null) {
          match.participant2 = fakePlayer;
        }
        nextRow++;
        if (poMatch['row'] > lastRow) {
          while (nextRow < poMatch['row']) {
            tempMatchTable[poMatch['level'] - firstLevel].matches.push(fakeMatch);
            nextRow++;
          }
        } else {
          nextRow = 0;
        }
        lastRow = poMatch['row'];
        tempMatchTable[poMatch['level'] - firstLevel].matches.push(match);
      }
      this.matchTable = tempMatchTable;
    });
  }

  open(player1: Participant, player2: Participant, matchId: number, point1: number, point2: number) {
    if (player1.name != null && player2.name != null) {
      const modalRef = this.modalService.open(MatchResultModalComponent).componentInstance;
      modalRef.player1 = player1;
      modalRef.player2 = player2;
      modalRef.matchId = matchId;
      modalRef.point1 = point1;
      modalRef.point2 = point2;
    }
  }

  saveResult(result: Result) {
    let poResult: PlayoffResult;
    poResult = new PlayoffResult(this.champId, result);
    this.matchesService.savePlayoffMatch(poResult).subscribe(response =>
      this.ngOnInit()
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.matchSubscription.unsubscribe();
  }


}

class Participant {

  constructor(
    public id: number,
    public name: string,
    public elo: number
  ) {}

  getName() {
    return name;
  }

}

export class PlayoffResult {

  constructor(
    public champId: number,
    public result: Result,
  ) {}

}

class PlayoffLevel {

  constructor(
    public level: number,
    public matches?: Match[],
  ) {}

}

class PlayoffMatch {

  constructor(
    public match: Match,
    public rankings: number[],
  ) {}

}

