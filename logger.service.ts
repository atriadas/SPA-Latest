import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoggerService {

  levelmap = new Map([
    ["Fatal",5],
    ["Error",4], 
    ["Warning",3], 
    ["Info",2],
    ["Trace",1]
  ]);

  errorCodeMap = new Map([
    ["400", "Please provide the valid inputs"],
    ["500", "Server encountered an issue"],
    ["404", "User provisioning is in progress"]

  ]);

loglevel = this.levelmap.get("Trace")
logWithDate: boolean = true;

  log(level:string,LogContext: any = {},...args: any[]) {
 
    var level1=this.levelmap.get(level)
    LogContext["Level"]=level;

    if(level1>=this.loglevel)
    {
    
      let d = new Date()
      let date=d.getHours()+':' + d.getMinutes()+':'+d.getSeconds()+' ' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()
      LogContext["Date"]=date;
      LogContext["Log"]=args;
      if(level=="Error")
      {
        //console.error(level, date , ":"  + JSON.stringify(args));
        console.error(JSON.stringify(LogContext))
      }
      else
      {
       // console.log(level, date , ":"  + JSON.stringify(args));
       console.log(JSON.stringify(LogContext))
      }
       
    }
     
  } 
}