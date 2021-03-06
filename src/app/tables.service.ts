import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {Table, TableMatch} from "./tables/tables.component";
import {ChampionshipData} from "./app.component";
import {Match} from "./matches/matches.component";

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(private http: HttpClient) {
  }

  public getTables(): Observable<Table[]> {
    return this.http.get<Table[]>('http://localhost:8100/tables');
  }

  public getChampsForTable(tableId: number): Observable<ChampionshipData[]> {
    return this.http.get<ChampionshipData[]>('http://localhost:8100/champs-for-table/' + tableId);
  }

  public saveChampsToTable(tableId: number, champIds: number[]): any {
    return this.http.post('http://localhost:8100/save-champs-to-table',
      {'champs': champIds,
             'tableId': tableId});
  }

  public deleteTable(tableId: number): any {
    return this.http.get('http://localhost:8100/delete-table/' + tableId);
  }

  public clearTable(tableId: number): any {
    return this.http.get('http://localhost:8100/clear-table/' + tableId);
  }

  public newTable(table: Table): any {
    return this.http.post('http://localhost:8100/new-table',
      {'col': table.col,
             'row': table.row})
  }

  public getRandomMatch(tableId: number): Observable<TableMatch> {
    return this.http.get<TableMatch>('http://localhost:8100/random-match/' + tableId);
  }

}

