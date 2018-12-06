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

  public getInProgressChampionships(): Observable<ChampionshipData[]> {
    return this.http.get<ChampionshipData[]>('http://localhost:8100/inprogress-championships');
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

  public addDouble(champId: number): any {
    return this.http.post('http://localhost:8100/add-double', {'data': champId});
  }

  public addPlayerToDouble(champId: number, doubleId: number, playerId: number): any {
    const data = new DoubleParticipantObject(champId, doubleId, playerId);
    return this.http.post('http://localhost:8100/add-player-to-double', {'data': data});
  }


  public selectParticipant(champId: number, participantId: number): Observable<BasicValue> {
    const data = new ChampParticipantObject(champId, participantId);
    return this.http.post<BasicValue>('http://localhost:8100/select-participant', {'data': data});
  }

  public deselectParticipant(champId: number, participantId: number): Observable<BasicValue> {
    const data = new ChampParticipantObject(champId, participantId);
    return this.http.post<BasicValue>('http://localhost:8100/deselect-participant', {'data': data});
  }

  public createChampionship(data: ChampionshipData): Observable<ChampionshipData> {
    return this.http.post<ChampionshipData>('http://localhost:8100/championship', {'data': data});
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

  public championshipChances(champId: number): any {
    return this.http.get('http://localhost:8100/championship-chances/' + champId);
  }

}

class ChampParticipantObject{

  constructor(
    public champId: number,
    public participantId: number
  ) {}

  getChampId() {
    return this.champId;
  }

  getPlayerId() {
    return this.participantId;
  }

}

class DoubleParticipantObject{

  constructor(
    public champId: number,
    public doubleId: number,
    public participantId: number
  ) {}

  getChampId() {
    return this.champId;
  }

  getDoubleId() {
    return this.champId;
  }

  getParticipantId() {
    return this.participantId;
  }

}

