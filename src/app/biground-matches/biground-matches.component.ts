import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatchesService} from '../matches.service';
import {Player, PlayerInterface} from '../app.component';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatchResultModalComponent} from '../match-result-modal/match-result-modal.component';
import {SharedService} from '../shared.service';
import {PlayerModalComponent} from '../player-modal/player-modal.component';

@Component({
  selector: 'app-biground-matches',
  templateUrl: './biground-matches.component.html',
  styleUrls: ['./biground-matches.component.css']
})
export class BigroundMatchesComponent implements OnInit, OnDestroy {

  @Input() champId: number;
  private subscription: Subscription;

  public playerIds: number[] = [];

  public ELEMENT_DATA: MatchRows[] = [];
  public matchTable: MatchRows[] = [];

  public playerCount: number[] = [];

  displayedColumns: string[] = ['player', 'opponents']

  constructor(private matchesService: MatchesService,
              private modalService: NgbModal,
              private sharedService: SharedService) {
  }

  ngOnInit() {

    this.subscription = this.sharedService.getMatchEdit().subscribe(result =>
      this.saveResult(result)
    );

    this.playerIds = [];
    this.playerCount = [];
    const opponents: Opponents[] = [];

    this.matchesService.getMatches(this.champId).subscribe(
      (data) => {
        const players = data['playerList'];
        const matches = data['matches'];
        const extraMatch = data['extraMatch'];

        let counter = 0;
        for (const player of players) {
          this.playerIds.push(player.id);
          this.ELEMENT_DATA.push({player: player});
          this.playerCount.push(counter);
          opponents.push({opponents: []});
          counter++;
        }

        for (const match of matches) {
          opponents[this.playerIds.indexOf(match.player1.id)].opponents.push(
            new Opponent(match.id, match.player2.name, match.player2.id, match.point1, match.point2));
          opponents[this.playerIds.indexOf(match.player2.id)].opponents.push(
            new Opponent(match.id, match.player1.name, match.player1.id, match.point2, match.point1));
        }

        // extra match

        if (extraMatch) {
          const extraPlayerRow = this.playerIds.indexOf(extraMatch.player.id);
          let i = 0;
          while ( i < opponents[extraPlayerRow].opponents.length) {
            if (opponents[extraPlayerRow].opponents[i].matchId === extraMatch.match.id) {
              opponents[extraPlayerRow].opponents.splice(i, 1);
              break;
            }
            i++;
          }
        }

        for (const j of this.playerCount) {
          this.ELEMENT_DATA[j].opponents = opponents[j].opponents;
        }
        this.matchTable = this.ELEMENT_DATA;

        console.log(this.matchTable);
      }
    );
  }

  getPlayerFromOpponent(opponent: Opponent): Player {
    return new Player(opponent.id, opponent.name);
  }

  openResultModal(player1: Player, player2: Player, matchId: number, point1: number, point2: number) {
    const modalRef = this.modalService.open(MatchResultModalComponent).componentInstance;
    modalRef.player1 = player1;
    modalRef.player2 = player2;
    modalRef.matchId = matchId;
    modalRef.point1 = point1;
    modalRef.point2 = point2;
  }

  saveResult(result: Result) {

    this.matchesService.saveMatch(result).subscribe(response => null);

    console.log(result);

    for (const opponent of this.matchTable[this.playerIds.indexOf(result.player1_id)].opponents) {
      if (opponent.id === result.player2_id) {
        opponent.pointOwn = result.points.point1;
        opponent.pointOpp = result.points.point2;
      }
    }

    for (const opponent of this.matchTable[this.playerIds.indexOf(result.player2_id)].opponents) {
      if (opponent.id === result.player1_id) {
        opponent.pointOwn = result.points.point2;
        opponent.pointOpp = result.points.point1;
      }
    }
  }

  openPlayerModal(playerId: number) {
    const modalRef = this.modalService.open(PlayerModalComponent).componentInstance;
    modalRef.playerId = playerId;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

export interface MatchRows {
  player: PlayerInterface;
  opponents?: Opponent[];
}

export interface Opponents {

  opponents: Opponent[];

}

class Opponent {

  constructor(
  public matchId: string,
  public name: string,
  public id: number,
  public pointOwn?: number,
  public pointOpp?: number,
  ) {}

}

export class Result {

  constructor(
    public matchId: number,
    public player1_id: number,
    public player2_id: number,
    public points: Points
  ) {}

}

class Points {

  constructor(
    public point1: number,
    public point2: number
  ) {}

}



