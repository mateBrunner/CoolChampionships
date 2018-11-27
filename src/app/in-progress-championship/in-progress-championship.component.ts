import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChampionshipService} from '../championship.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-in-progress-championship',
  templateUrl: './in-progress-championship.component.html',
  styleUrls: ['./in-progress-championship.component.css']
})
export class InProgressChampionshipComponent implements OnInit, OnDestroy {

  public champId;
  public page;
  public subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private championshipService: ChampionshipService) {
  }

  ngOnInit() {
    this.champId = this.router.url.split('/')[2];
    this.page = this.router.url.split('/')[4]
    this.subscription = this.router.events.subscribe((val) =>
      this.page = this.router.url.split('/')[4]
    );
  }

  archivateChampionship() {
    this.championshipService.archivateChampionship(this.champId).subscribe(
      (response) => {
        this.router.navigate(['/championship/1']);
        this.router.navigate(['/']);
      }
    );
  }

  deleteChampionship() {
    this.championshipService.deleteChampionship(this.champId).subscribe(
      (response) => this.router.navigate(['/'])
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
