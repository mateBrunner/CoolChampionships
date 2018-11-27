import { Component, OnInit } from '@angular/core';
import {MatchesService} from '../matches.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Player} from '../app.component';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  public format: string;
  public champId: number;

  constructor(private matchesService: MatchesService,
              private route: ActivatedRoute,
              private router: Router) {
    this.champId = +this.router.url.split('/')[2];
  }

  ngOnInit() {

    this.matchesService.getChampionshipFormat(this.champId).subscribe(
      (data) => {
        this.format = data.value;
      }
    );

  }

}

export class Match {

  constructor(
    public id: number,
    public player1: Player,
    public player2: Player,
    public point1: number,
    public point2: number
  ) {}

}
