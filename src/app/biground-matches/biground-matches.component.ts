import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatchesService} from '../matches.service';
import {Participant, ParticipantInterface} from '../app.component';
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
        const players = data['participantList'];
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
          opponents[this.playerIds.indexOf(match.participant1.id)].opponents.push(
            new Opponent(match.id, match.participant2.name, match.participant2.id, match.point1, match.point2));
          opponents[this.playerIds.indexOf(match.participant2.id)].opponents.push(
            new Opponent(match.id, match.participant1.name, match.participant1.id, match.point2, match.point1));
        }

        // extra match

        if (extraMatch) {
          const extraParticipantRow = this.playerIds.indexOf(extraMatch.participant.id);
          let i = 0;
          while ( i < opponents[extraParticipantRow].opponents.length) {
            if (opponents[extraParticipantRow].opponents[i].matchId === extraMatch.match.id) {
              opponents[extraParticipantRow].opponents.splice(i, 1);
              break;
            }
            i++;
          }
        }

        for (const j of this.playerCount) {
          this.ELEMENT_DATA[j].opponents = opponents[j].opponents;
        }
        this.matchTable = this.ELEMENT_DATA;
      }
    );
  }

  getPlayerFromOpponent(opponent: Opponent): Participant {
    return new Participant(opponent.id, opponent.name);
  }

  openResultModal(player1: Participant, player2: Participant, matchId: number, point1: number, point2: number) {
    const modalRef = this.modalService.open(MatchResultModalComponent).componentInstance;
    modalRef.player1 = player1;
    modalRef.player2 = player2;
    modalRef.matchId = matchId;
    modalRef.point1 = point1;
    modalRef.point2 = point2;
  }

  saveResult(result: Result) {

    this.matchesService.saveMatch(result).subscribe(response => null);

    for (const opponent of this.matchTable[this.playerIds.indexOf(result.participant1_id)].opponents) {
      if (opponent.id === result.participant2_id) {
        opponent.pointOwn = result.points.point1;
        opponent.pointOpp = result.points.point2;
      }
    }

    for (const opponent of this.matchTable[this.playerIds.indexOf(result.participant2_id)].opponents) {
      if (opponent.id === result.participant1_id) {
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
  player: ParticipantInterface;
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
    public participant1_id: number,
    public participant2_id: number,
    public points: Points
  ) {}

}

class Points {

  constructor(
    public point1: number,
    public point2: number
  ) {}

}



