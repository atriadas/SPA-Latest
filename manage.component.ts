import { Component, OnInit ,ViewChild,ViewEncapsulation} from '@angular/core';
import {  Observable,Subject, interval, Subscription  } from 'rxjs';
import { Data2Service, HttpData} from '../dataService/data2.service';
import { NgSelectComponent} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./manage.component.css'],
  providers: [LoggerService]
})

export class ManageComponent implements OnInit {

   //ARRAY
  roles = ['None', 'Own/Group Recordings', 'All Recordings'];
  
  //NUMBER
  role_id: number = 1;
  j = 0
  
  //STRINGS
  userId: string = ''
  tid: string 
  accessToken: string;
  refreshToken: string;
  errorMessage: string
  role: string = 'None';

  //BOOLEAN
  saveflag: boolean = true;
  flag: boolean = false
  closeFlag:boolean=false;
  errorflag: boolean = false

  //OBJECTS
  private updateSubscription: Subscription;
  LogContext: any = {};

  constructor(private dataService: Data2Service , private router: Router, private route: ActivatedRoute, private logStatus:LoggerService) {}
  
   ngOnInit() { 
    
    this.route.queryParams//fetching query params
    .subscribe(params => {
      this.userId = params.useruuid;
    });
    this.route.queryParams
    .subscribe(params => {
      this.tid = params.tenantuuid;
    });
     this.LogContext["UserUUID"] = this.userId;
    this.LogContext["TID"] = this.tid;
    this.token(); //function to validate and refrsh token  
    
  }

  token() {

    this.LogContext["FunctionName"] = "token"

    this.j = this.j + 1;

    this.accessToken = localStorage.getItem('Access_Token')// fetching the access toke from local storage
    this.refreshToken = localStorage.getItem('Refresh_Token')

    var validtoken = this.dataService.getLoggedInUser(this.accessToken)

    validtoken
      .subscribe(
        (response) => {                           //Next callback

          this.logStatus.log("Info", this.LogContext,'Success:200 OK', response['role'])

        
          if (response['role'] == "ACCOUNT_ADMIN" || response['role'] == "PARTNER_ADMIN") {
            //this.errorflag = true
            this.getuserinfo()
            var expiryTime = response['exp'];
            
            const now = new Date()
            const secondsSinceEpoch = Math.round(now.getTime() / 1000)
          
            var remTime = (expiryTime - secondsSinceEpoch) * 1000 //milliseconds
           


            this.updateSubscription = interval(remTime - 5000).subscribe( //Buffer time of 5 secs
              (val) => {
                
                this.logStatus.log("Info", this.LogContext,"Token Expired")

                var userdto: any = {};
                userdto["grant_type"] = "refresh_token"
                userdto["token"] = this.refreshToken
                var data = this.dataService.getNewToken(JSON.stringify(userdto))
                data.subscribe(
                  (response) => {
                    
                    var newAccessToken = response["access_token"]
                    var newRefreshToken = response["refresh_token"]
                    localStorage.setItem("Access_Token", newAccessToken);
                    localStorage.setItem("Refresh_Token", newRefreshToken);
                    localStorage.setItem("tokenchange", this.j.toString())//token changed counter
                    this.logStatus.log("Info", this.LogContext,"New access token", newAccessToken, "New refresh token", newRefreshToken)
                    this.token();

                  },
                  (error) => {
                    this.errorflag = false
                    if (error.status != 404) { this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString()); }
                    else { this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString()); }
                    this.logStatus.log("Error", this.LogContext, this.errorMessage)
                  })
                this.updateSubscription.unsubscribe();

              }
            );


          }
          else {
            this.errorMessage = "Unauthorised: Not an Admin"
            this.logStatus.log("Error", this.LogContext, this.errorMessage)
          }
        },
        (error) => {
          this.errorflag = false
          this.errorMessage = 'Error:' + error.status + ' ' + error.error['message'];
          this.logStatus.log("Error", this.LogContext, this.errorMessage)
        }
      )
    }

  getuserinfo() {


    this.LogContext["FunctionName"] = "getuserinfo"
  
    //this.role = ''
    const data = this.dataService.getUserData(this.userId, this.accessToken, this.tid);
    data.subscribe(
      (response) => {
        this.errorflag = true;

        

        this.role_id = response["Roleid"];
        if (this.role_id == 1)
          this.role = "None"
        if (this.role_id == 2)
          this.role = "Own/Group Recordings"
        if (this.role_id == 3)
          this.role = "All Recordings"

        this.logStatus.log("Info", this.LogContext, "role_>", this.role, "role id_>", this.role_id)


      },
      (error) => {

        this.errorflag = false

        if (error.status != 404) {
           this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString());
           }
        else 
        { 
          this.errorMessage=this.logStatus.errorCodeMap.get(error.status.toString()); 
        }

        this.logStatus.log("Error", this.LogContext, this.errorMessage)
      }
    );
  }

  GetRoleValue(args) { //Extracting Selected Role

    this.LogContext["FunctionName"] = "GetRoleValue"
    this.role_id = this.roles.indexOf(this.role) + 1
    this.saveflag = false
    this.logStatus.log("Info", this.LogContext, this.role, this.role_id)

  }

  UserDetails() //Save Changes

  {
    this.LogContext["FunctionName"] = "UserDetails"
    
    var userdto: any = {};
    userdto["Role_id"] = this.role_id;
    var stringData = JSON.stringify(userdto);
    this.logStatus.log("Info", this.LogContext, stringData)
    var res = this.dataService.putHTTPData(stringData, this.userId, this.accessToken)

    res.subscribe(
      (response) => {
        this.logStatus.log("Info", this.LogContext, response)
        parent.postMessage("SAVE_SUCCESSFULL", "*");
        setTimeout(() => { this.getuserinfo(); }, 500);
      },
      (error) => {
        this.errorflag = false
        if (error.status != 404) { this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString()); }
        else { this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString()); }
        this.logStatus.log("Error", this.LogContext, this.errorMessage)
        parent.postMessage("SAVE_FAILED", "*");
      }
    )
    this.saveflag = true
  }

  OnClose() {

    this.LogContext["FunctionName"] = "OnClose"
    parent.postMessage("CLOSE_MODAL", "*");
    this.closeFlag=true;
    this.logStatus.log("Info", this.LogContext)
  }

}
