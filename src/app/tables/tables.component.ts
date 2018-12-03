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

  constructor(private modalService: NgbModal,
              private tablesService: TablesService,
              private championshipService: ChampionshipService,
              private sharedService: SharedService) {
    this.subscription = this.sharedService.getTableDelete().subscribe(resp =>
      this.ngOnInit()
    );


    this.championshipService.getInProgressChampionships().subscribe((champs) => {
      this.inprogressChampionships = champs;
    });
  }

  ngOnInit() {

    this.tableGrid = [];
    this.tablesService.getTables().subscribe((tables) => {
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
        this.tableGrid[table.row][table.col] = table;
      }
    });

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
    this.tableGrid[table.row][table.col].match = new Match(2,new Participant(1,'asdf'), new Participant(1, 'jké'), 2,1);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

export class Table {

  constructor(
    public id: number,
    public row: number,
    public col: number,
    public match?: Match
  ) {}

}



