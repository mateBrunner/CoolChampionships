import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasicValue, Player} from './app.component';
import {Observable} from 'rxjs';
import {PlayerStats} from './player-modal/player-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private http: HttpClient) { }

  public getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('http://localhost:8100/players');
  }

  public getSelectedPlayers(id: number): Observable<Player[]> {
    return this.http.get<Player[]>('http://localhost:8100/selected-players/' + id);
  }

  public addPlayer(name: string): Observable<Player> {
    return this.http.post<Player>('http://localhost:8100/add-player', {'name': name});
  }

  public getPlayerStats(id: number): Observable<PlayerStats> {
    return this.http.get<PlayerStats>('http://localhost:8100/player-stats/' + id);
  }

}
