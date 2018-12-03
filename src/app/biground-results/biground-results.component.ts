import {Component, Input, OnInit} from '@angular/core';
import {MatchesService} from '../matches.service';
import {ParticipantInterface} from '../app.component';

@Component({
  selector: 'app-biground-results',
  templateUrl: './biground-results.component.html',
  styleUrls: ['./biground-results.component.css']
})
export class BigroundResultsComponent implements OnInit {

  @Input() champId: number;

  public resultTable: ResultRows[] = [];
  public ELEMENT_DATA: ResultRows[] = [];
  public sizeOfPlayoff;

  displayedColumns: string[] = ['ranking', 'player', 'playedMatch', 'wonMatch', 'wonSet', 'losenSet', 'aveOpp'];

  constructor(private matchesService: MatchesService) { }

  ngOnInit() {

    this.matchesService.getResult(this.champId).subscribe( data => {

      let iterator = 0;
      const playerResults = data['participantResults'];
      this.sizeOfPlayoff = data['sizeOfPlayoff'];

      while (iterator < playerResults.length) {
        this.ELEMENT_DATA[iterator] = playerResults[iterator];
        this.ELEMENT_DATA[iterator].ranking = iterator + 1;
        iterator++;
      }
      this.resultTable = this.ELEMENT_DATA;

    });

  }

  roundValue(number: number) {
    return Math.round(number);
  }

}

export interface ResultRows {
  ranking?: number;
  participant: ParticipantInterface;
  numberOfPlayedMatches: number;
  numberOfWonMatches: number;
  numberOfWonSets: number;
  numberOfLosenSets: number;
  averageOfOpponents: number;
}
