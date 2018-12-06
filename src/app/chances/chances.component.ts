import {Component, Input, OnInit} from '@angular/core';
import {ChampionshipService} from "../championship.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chances',
  templateUrl: './chances.component.html',
  styleUrls: ['./chances.component.scss']
})
export class ChancesComponent implements OnInit {

  private champId: number;

  constructor(private championshipService: ChampionshipService,
              private router: Router) {
    this.champId = +this.router.url.split('/')[2];
  }

  ngOnInit() {
    console.log(this.champId);
    this.championshipService.championshipChances(this.champId).subscribe((chances) => null);
  }

}
