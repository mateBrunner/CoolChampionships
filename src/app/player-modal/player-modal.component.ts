import {Component, Input, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {Player, PlayerInterface} from '../app.component';
import {PlayersService} from '../players.service';

@Component({
  selector: 'app-player-modal',
  templateUrl: './player-modal.component.html',
  styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent implements OnInit {

  @Input() playerId: number;
  public dataChart;
  public playerStats: PlayerStats;

  constructor(private playerService: PlayersService) {
    this.playerStats = new PlayerStats();
    this.playerStats.player = new Player(-1, '', 0);
    this.playerStats.mostPlayedPlayer = new Player(-1, '', 0);
  }

  ngOnInit() {

    this.playerService.getPlayerStats(this.playerId).subscribe((data) => {
        this.playerStats = data;
        console.log(typeof this.playerStats);
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
            data: [this.playerStats.numberOfWonMatches, this.playerStats.numberOfLosenMatches],
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

export class PlayerStats {

  constructor(
    public player?: Player,
    public numberOfPlayedMatches?: number,
    public numberOfWonMatches?: number,
    public numberOfLosenMatches?: number,
    public mostWinInRow?: number,
    public mostLoseInRow?: number,
    public mostPlayedPlayer?: Player,
    public numberOfMatchesWithMostPlayedPlayer?: number,
    public wonAgainstMostPlayedPlayer?: number,
    public dateOfFirstMatch?: string,
    public dateOfLastMatch?: string
  ) {}

  getPlayer() {
  }

}
