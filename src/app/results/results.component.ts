import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChampionshipService} from '../championship.service';
import {MatchesService} from '../matches.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

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
