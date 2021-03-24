import { Injectable} from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'

export class HttpData
{
  user_uuid: string;
  user_guiname: string;
  first_name : string;
  last_name: string;
  extension: string;
  tenant_id:  number;
 
}
export class GroupsData{
  group_name: string;
  group_uuid: string;
}

export class GroupInfo{
  group_name: string;
    group_uuid: string;
    members:{
      user_uuid: string;
      user_guiname: string;
      first_name : string;
      last_name: string;
      extension: string;
      tenant_id:  string;    
          };
    supervisor:{
      user_uuid: string;
      user_guiname: string;
      first_name : string;
      last_name: string;
      extension: string;
      tenant_id:  string;  
    };
}

@Injectable({
  providedIn: 'root'
})

export class DataService{
  

  constructor(public http: HttpClient) {
    console.log("Data Service Constructor")
    var str =location.host
    if(str.includes("dev.mitelcloud.com")){
      environment.authentication_url = environment.dev_authentication_url  
    if(location.host == "dev.craccess.dev.mitelcloud.com"){
      environment.backend_address = "http://"+location.host + ":8089/spabackend"
    }else{
      environment.backend_address ="https://"+location.host +"/spabackend"
    }
    }else{
      environment.backend_address ="https://"+location.host +"/spabackend"
    }
    console.log(environment.backend_address)
  }
  
 getHttpData(term: string = null,tid,auth_token): Observable<HttpData[]> { //Http Call for users   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
  
    if (term) 
    {
      var url=environment.backend_address+'/FindUser?tid='+tid+'&user='+term
      var item = this.http.get<HttpData[]>(url,{ headers: headers })
     
      return item
    }

    else 
    {
     
      return of([]);
    }

  }
 
  getAllGroupsData(tid,auth_token) 
  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    
    var url=environment.backend_address+'/Group/AllGroups?tid='+tid
  const data =this.http.get<GroupsData[]>(url,{ headers: headers })
  
  return data;

  }

  getGroupInfo(grpID:string,auth_token,tid)
  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    
    var url=environment.backend_address+'/Group/GetGroupsInfo?group_uuid='+grpID+'&tid='+tid
    const data=this.http.get<GroupInfo[]>(url,{ headers: headers })
  
    return data;

  }

  postHTTPData(data,tid,auth_token){ //Http Post in DB
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    
    var url=environment.backend_address+'/createGroup?tid='+tid
 const options = {responseType: 'OK' as 'json',headers: headers};
    return this.http.post(url,data,options)
  }

 getTimezoneData(tid,auth_token)
  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    
    var url=environment.backend_address+'/GetTimeZone?tid='+tid
    const data=this.http.get(url,{ headers: headers })
  
    return data;
  }

  postTimezone(data,tid,auth_token){ // Post timezonrein DB
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    var url=environment.backend_address+'/SetTimeZone?tid='+tid
    const options = {responseType: 'OK' as 'json',headers: headers};
    return this.http.post(url,data,options)
  } 

 postUpdatedData(data:string,grpID:string,auth_token,tid){ //SUCCESS AS ERROR
   
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +auth_token
      })
     
    var url=environment.backend_address+'/Group/UpdateGroup?grp_id='+grpID+'&tid='+tid
    const options = {responseType: 'OK' as 'json',headers: headers};

    return this.http.put(url,data,options)   
  }  
  
  deleteGroupDb(grpID:string,tid:string,auth_token)
  { 
    
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +auth_token
      })
    
    var url=environment.backend_address+'/Group/DeleteGroup?group_uuid='+ grpID+'&tid='+tid
   return this.http.delete(url,{ headers: headers })
    }  

   getLoggedInUser(auth_token) {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    var res=this.http.get(environment.authentication_url, { headers: headers })
   
    return res
  
  } 

getNewToken(data)
  {
     return this.http.post(environment.authentication_url,data)
  }
  
}

