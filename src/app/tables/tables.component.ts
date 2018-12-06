import {Component, OnDestroy, OnInit} from '@angular/core';
import {Match} from "../matches/matches.component";
import {Participant} from "../app.component";
import {TablesService} from "../tables.service";
import {ChampionshipService} from "../championship.service";
import {MatchResultModalComponent} from "../match-result-modal/match-result-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TableSettingsModalComponent} from "../table-settings-modal/table-settings-modal.component";
import {SharedService} from "../shared.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Result} from "../biground-matches/biground-matches.component";
import {PlayoffResult} from "../playoff/playoff.component";
import {MatchesService} from "../matches.service";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, OnDestroy {

  public tableGrid: Table[][] = [];
  public maxRows = 8;
  public maxColumns = 8;
  public numberOfRows: number;
  public numberOfColumns: number;
  private inprogressChampionships;
  private subscription: Subscription;
  private saveResultSubscription: Subscription;

  constructor(private modalService: NgbModal,
              private tablesService: TablesService,
              private championshipService: ChampionshipService,
              private sharedService: SharedService,
              private matchesService: MatchesService) {
    this.subscription = this.sharedService.getTableDelete().subscribe(resp =>
      this.ngOnInit()
    );
    this.saveResultSubscription = this.sharedService.getMatchEdit().subscribe(result =>
      this.saveResult(result)
    );


    this.championshipService.getInProgressChampionships().subscribe((champs) => {
      this.inprogressChampionships = champs;
    });
  }

  ngOnInit() {

    this.tableGrid = [];
    this.tablesService.getTables().subscribe((tables) => {
      console.log(tables);
      this.numberOfColumns = 0;
      this.numberOfRows = 0;
      for (const table of tables) {
        if (table.col > this.numberOfColumns) { this.numberOfColumns = table.col; }
        if (table.row > this.numberOfRows) { this.numberOfRows = table.row; }
      }

      let i=0;
      while (i <= this.numberOfRows) {
        this.tableGrid.push([]);
        let j=0;
        while (j <= this.numberOfColumns) {
          this.tableGrid[i].push(new Table(-1, i, j,null));
          j++;
        }
        i++;
      }

      for (const table of tables) {
        if (table.tableMatch === null) {
          table.tableMatch = new TableMatch(null, new Match(null, new Participant(null, null), new Participant(null, null),null, null))
        }
        this.tableGrid[table.row][table.col] = table;
      }
    });

  }

  openEditResult(participant1: Participant, participant2: Participant, matchId: number) {
    const modalRef = this.modalService.open(MatchResultModalComponent).componentInstance;
    modalRef.player1 = participant1;
    modalRef.player2 = participant2;
    modalRef.matchId = matchId;
  }

  openSettings(tableId: number) {
    const modalRef = this.modalService.open(TableSettingsModalComponent).componentInstance;
    modalRef.inprogressChampionships = this.inprogressChampionships;
    modalRef.tableId = tableId;
  }

  newTable(table: Table) {
    this.tablesService.newTable(table).subscribe((resp) => this.ngOnInit())
  }

  randomMatch(table: Table) {
    this.tablesService.getRandomMatch(table.id).subscribe((match) => {
      if (match != null) {
        this.tableGrid[table.row][table.col].tableMatch = match;
      }}
    )

  }

  saveResult(result: Result) {
    let champId: number;
    let r = 0;
    while ( r <= this.numberOfRows ) {
      let c = 0;
      while ( c <= this.numberOfColumns ) {
        if (this.tableGrid[r][c].tableMatch != null && this.tableGrid[r][c].tableMatch.match.id === result.matchId) {
          champId = this.tableGrid[r][c].tableMatch.champId;
        }
        c++;
      }
      r++;
    }

    this.matchesService.saveTableMatch(champId, result).subscribe(response =>
    this.ngOnInit()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.saveResultSubscription.unsubscribe();
  }

}

export class Table {

  constructor(
    public id: number,
    public row: number,
    public col: number,
    public tableMatch?: TableMatch
  ) {}

}

export class TableMatch {

  constructor(
    public champId: number,
    public match: Match
  ) {}

}



