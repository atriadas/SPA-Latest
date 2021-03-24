

import { GroupFilterPipe } from './groupFilter.pipe';
import { pipe } from 'rxjs';

describe('Pipe', () => {
    it('create an instance', () => {
      const pipe = new GroupFilterPipe();
      expect(pipe).toBeTruthy();
      let arr=[{Groupname:'jj'}]
      pipe.transform(arr,"j")
    });
    it('create an instance', () => {
      const pipe = new GroupFilterPipe();
      expect(pipe).toBeTruthy();
      let arr=[{Groupname:'jj'}]
      pipe.transform(arr,null)
    });


   
  });
