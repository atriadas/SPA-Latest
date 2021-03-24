import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoggerService = TestBed.get(LoggerService);
    expect(service).toBeTruthy();
  });
   it('should be called on log function', () => {
    const service: LoggerService = TestBed.get(LoggerService);
   service.log("Trace")
   service.log("Error")
 
  });
});
