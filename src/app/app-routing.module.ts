import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionshipComponent } from './championship/championship.component';
import { ProfileComponent } from './profile/profile.component';
import {PlayoffComponent} from './playoff/playoff.component';
import {ResultsComponent} from './results/results.component';
import {Match, MatchesComponent} from './matches/matches.component';
import {AppComponent} from './app.component';
import {NewChampionshipComponent} from './new-championship/new-championship.component';
import {InProgressChampionshipComponent} from './in-progress-championship/in-progress-championship.component';

const routes: Routes = [
  { path: 'championship/:id', component: ChampionshipComponent, children: [
      { path: 'new', component: NewChampionshipComponent},
      { path: 'inprogress', component: InProgressChampionshipComponent, children: [
          { path: 'matches', component: MatchesComponent},
          { path: 'results', component: ResultsComponent},
          { path: 'playoff', component: PlayoffComponent}
        ]},
    ]},
  { path: 'profile', component: ProfileComponent}
]

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
