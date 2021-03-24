import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'groupFilter'
})
export class GroupFilterPipe implements PipeTransform {
    transform(value, term) {
        if (!term) {
            return value;
        }
        else {
            var value2 = value.filter(item => (item['Groupname'].toLowerCase().indexOf(term.toLowerCase()) ) > -1);
            return  value2
           
        }
    }
}