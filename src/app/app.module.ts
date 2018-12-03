import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { ChampionshipComponent } from './championship/championship.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule, NgbModalModule, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule,
  MatSliderModule, MatSnackBarModule, MatProgressSpinnerModule
} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material';
import { InProgressChampionshipComponent } from './in-progress-championship/in-progress-championship.component';
import { NewChampionshipComponent } from './new-championship/new-championship.component';
import { PlayersService } from './players.service';
import { ParticipantFilterPipe } from './participant-filter.pipe';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from './shared.service';
import { ResultsComponent } from './results/results.component';
import { PlayoffComponent } from './playoff/playoff.component';
import { MatchesComponent } from './matches/matches.component';
import { BigroundMatchesComponent } from './biground-matches/biground-matches.component';
import { GroupMatchesComponent } from './group-matches/group-matches.component';
import { MatchResultModalComponent } from './match-result-modal/match-result-modal.component';
import { BigroundResultsComponent } from './biground-results/biground-results.component';
import { GroupResultsComponent } from './group-results/group-results.component';
import { PlayerModalComponent } from './player-modal/player-modal.component';
import { ChartsModule} from 'ng2-charts';
import {DragDropModule} from '@angular/cdk/drag-drop';
import 'hammerjs';
import { ArchiveComponent } from './archive/archive.component';
import { TablesComponent } from './tables/tables.component';
import { TableSettingsModalComponent } from './table-settings-modal/table-settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ChampionshipComponent,
    InProgressChampionshipComponent,
    NewChampionshipComponent,
    ParticipantFilterPipe,
    ResultsComponent,
    PlayoffComponent,
    MatchesComponent,
    BigroundMatchesComponent,
    GroupMatchesComponent,
    MatchResultModalComponent,
    BigroundResultsComponent,
    GroupResultsComponent,
    PlayerModalComponent,
    PageNotFoundComponent,
    ArchiveComponent,
    TablesComponent,
    TableSettingsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSliderModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    NgbModule,
    NgbModalModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ChartsModule,
    DragDropModule
  ],
  exports: [
    NgbModalModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSnackBarModule,
    MatRadioModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  providers: [PlayersService,
    SharedService,
    NgbActiveModal],
  bootstrap: [AppComponent],
  entryComponents: [
    MatchResultModalComponent,
    PlayerModalComponent,
    TableSettingsModalComponent
  ]
})
export class AppModule { }
