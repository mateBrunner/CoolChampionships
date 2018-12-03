import {Component, Input, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {Participant, ParticipantInterface} from '../app.component';
import {PlayersService} from '../players.service';

@Component({
  selector: 'app-player-modal',
  templateUrl: './player-modal.component.html',
  styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent implements OnInit {

  @Input() playerId: number;
  public dataChart;
  public participantStats: ParticipantStats;

  constructor(private playerService: PlayersService) {
    this.participantStats = new ParticipantStats();
    this.participantStats.participant = new Participant(-1, '', 0);
    this.participantStats.mostPlayedParticipant = new Participant(-1, '', 0);
  }

  ngOnInit() {

    this.playerService.getParticipantStats(this.playerId).subscribe((data) => {
        this.participantStats = data;
        this.createChart();
      }
    );

  }

  createChart() {
    if (this.dataChart) { this.dataChart.destroy(); }
    this.dataChart = new Chart('dataCanvas', {
      type: 'pie',
      data: {
        labels: ['WIN', 'LOSE'],
        datasets: [
          {
            data: [this.participantStats.numberOfWonMatches, this.participantStats.numberOfLosenMatches],
            backgroundColor: [
              'rgba(25, 130, 8, 0.8)',
              'rgba(226, 41, 41, 0.8)'
            ]

          }
        ],
        borderWidth: 1
      },
      options: {
      }
    });
  }

}

export class ParticipantStats {

  constructor(
    public participant?: Participant,
    public numberOfPlayedMatches?: number,
    public numberOfWonMatches?: number,
    public numberOfLosenMatches?: number,
    public mostWinInRow?: number,
    public mostLoseInRow?: number,
    public mostPlayedParticipant?: Participant,
    public numberOfMatchesWithMostPlayedParticipant?: number,
    public wonAgainstMostPlayedParticipant?: number,
    public dateOfFirstMatch?: string,
    public dateOfLastMatch?: string
  ) {}

  getParticipant() {
  }

}
