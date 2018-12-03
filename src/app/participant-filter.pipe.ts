import { Pipe, PipeTransform } from '@angular/core';
import {FilterObject, Participant} from "./app.component";

@Pipe({
  name: 'playerFilter'
})
export class ParticipantFilterPipe implements PipeTransform {
  transform(participants: Participant[], filter: FilterObject): Participant[] {

    if (!participants || !filter.name) {
      return participants;
    }

    return participants.filter(participant => participant.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1);

  }

}
