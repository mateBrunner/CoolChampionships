import { Injectable } from '@angular/core';
import {BasicValue, ChampionshipData} from './app.component';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Result} from './biground-matches/biground-matches.component';
import {PlayoffResult} from './playoff/playoff.component';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private http: HttpClient) { }

  public getChampionshipFormat(id: number): Observable<BasicValue> {
    return this.http.get<BasicValue>('http://localhost:8100/championship-format/' + id);
  }

  public getMatches(id: number): any {
    return this.http.get('http://localhost:8100/championship-matches/' + id);
  }

  public saveMatch(result: Result): any {
    return this.http.post('http://localhost:8100/save-match', {'result': result});
  }

  public savePlayoffMatch(result: PlayoffResult): any {
    return this.http.post('http://localhost:8100/save-playoff-match', {'result': result});
  }

  public getResult(id: number): any {
    return this.http.get('http://localhost:8100/championship-result/' + id);
  }

  public deleteResult(id: number): any {
    return this.http.post('http://localhost:8100/delete-match-result', {'id': id});
  }

  public getPlayoff(id: number): any {
    return this.http.get('http://localhost:8100/championship-playoff/' + id);
  }

}
