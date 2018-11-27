import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BasicValue, ChampionshipData, ChampionshipSettings, ChampionshipDetails} from './app.component';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {

  constructor(private http: HttpClient) { }

  public getChampionshipStatus(id: number): Observable<BasicValue> {
    return this.http.get<BasicValue>('http://localhost:8100/championship-status/' + id);
  }

  public getActualChampionships(): Observable<ChampionshipData[]> {
    return this.http.get<ChampionshipData[]>('http://localhost:8100/actual-championships');
  }

  public getChampionshipSettings(id: number): Observable<ChampionshipSettings> {
    return this.http.get<ChampionshipSettings>('http://localhost:8100/championship-settings/' + id);
  }

  public updateSettings(id: number, data, isInvalid: boolean, lastValidName: string): Observable<BasicValue> {
    if (isInvalid) {
      data.newChampName = lastValidName;
    }
    return this.http.post<BasicValue>('http://localhost:8100/update-championship-settings/' + id,{'settings': data});
  }

  public selectPlayer(champId: number, playerId: number): Observable<BasicValue> {
    const data = new ChampPlayerObject(champId, playerId);
    return this.http.post<BasicValue>('http://localhost:8100/select-player', {'data': data});
  }

  public deselectPlayer(champId: number, playerId: number): Observable<BasicValue> {
    const data = new ChampPlayerObject(champId, playerId);
    return this.http.post<BasicValue>('http://localhost:8100/deselect-player', {'data': data});
  }

  public createChampionship(name: string): Observable<ChampionshipData> {
    return this.http.post<ChampionshipData>('http://localhost:8100/championship', {'name': name});
  }

  public startChampionship(champId: number): Observable<BasicValue> {
    return this.http.get<BasicValue>('http://localhost:8100/start/' + champId);
  }

  public archivateChampionship(champId: number): any {
    return this.http.post('http://localhost:8100/archivate-championship/' + champId, {});
  }

  public deleteChampionship(champId: number): any {
    return this.http.post('http://localhost:8100/delete-championship/' + champId, {});
  }

}

class ChampPlayerObject{

  constructor(
    public champId: number,
    public playerId: number
  ) {}

  getChampId() {
    return this.champId;
  }

  getPlayerId() {
    return this.playerId;
  }

}

