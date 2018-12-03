import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasicValue, Participant} from './app.component';
import {Observable} from 'rxjs';
import {ParticipantStats} from './player-modal/player-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private http: HttpClient) { }

  public getParticipants(type: string): Observable<Participant[]> {
    if (type === 'TEAM') {
      return this.http.get<Participant[]>('http://localhost:8100/teams');
    } else {
      return this.http.get<Participant[]>('http://localhost:8100/players');
    }
  }

  public getSelectedParticipants(id: number): Observable<Participant[]> {
    return this.http.get<Participant[]>('http://localhost:8100/selected-participants/' + id);
  }

  public addParticipant(name: string): Observable<Participant> {
    return this.http.post<Participant>('http://localhost:8100/add-player', {'name': name});
  }

  public getParticipantStats(id: number): Observable<ParticipantStats> {
    return this.http.get<ParticipantStats>('http://localhost:8100/participant-stats/' + id);
  }

}
