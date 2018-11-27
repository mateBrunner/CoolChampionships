import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerFilter'
})
export class PlayerFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
