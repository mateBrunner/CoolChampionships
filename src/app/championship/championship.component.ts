import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicValue, ChampionshipData} from '../app.component';
import {SharedService} from '../shared.service';
import {ChampionshipService} from '../championship.service';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.css']
})
export class ChampionshipComponent implements OnInit {

  public status: string;
  public actualChampionships: ChampionshipData[] = [];

  constructor(private sharedService: SharedService,
              private championshipService: ChampionshipService,
              private route: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone) {
    championshipService.getActualChampionships().subscribe((champs) => {
      this.actualChampionships = champs;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = +this.router.url.split('/')[2];
      this.championshipService.getChampionshipStatus(id).subscribe(
        (data) => {
          if (data.value === 'NEW') {
            this.ngZone.run(() => this.router.navigateByUrl('championship/' + id + '/new'));
          } else if (data.value === 'INPROGRESS') {
            this.ngZone.run(() => this.router.navigateByUrl('championship/' + id + '/inprogress/matches'));
          }
        }
      );
      }
    );
  }

}

