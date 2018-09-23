import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'message',
  pure: false
})
export class MessagePipe implements PipeTransform {

  transform(value: any, selected: number): any {
    const res = [];
    for (const mes of value) {
      if (+mes.s_id === selected || +mes.r_id === selected) {
        res.push(mes);
      }
    }
    return res;
  }

}
