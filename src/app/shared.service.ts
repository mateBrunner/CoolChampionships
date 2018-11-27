import {EventEmitter, Injectable} from '@angular/core';
import {ChampionshipData} from './app.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  actualChampionships: ChampionshipData[] = [];

  matchEdit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  matchEditEvent(result) {
    this.matchEdit.emit(result);
  }
  getMatchEdit() {
    return this.matchEdit;
  }
}
