import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { HttpHeaders } from '@angular/common/http';

export class HttpData
{
 group_uuid:string;
 group_name:string;
 
 
}
export class UsersData
{
  user_uuid: string;
  user_guiname: string;
  first_name : string;
  last_name: string;
  extension: string;
  tenant_id:  number;
 
}

@Injectable({
  providedIn: 'root'
})

export class Data2Service{
  
 
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


  getUserData(useruuid: string = null ,auth_token, tid) { //Http Call 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
      var url=environment.backend_address+'/UserInfo?user_uuid='+useruuid+'&tid='+tid;
      return this.http.get(url,{ headers: headers })
  }

  putHTTPData(data:string,uid,auth_token){ //Http Post in DB //SHOWS ERROR EVEN ON SUCCESS
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    var url=environment.backend_address+'/Group/ConfigureUsers?user_uuid='+uid
    const options = {responseType: 'OK' as 'json',headers: headers};
     return this.http.put(url,data,options);

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






