import { Component, ViewChild,ElementRef } from '@angular/core';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { concat, Observable, of, Subject, interval, Subscription, from } from 'rxjs';
import { DataService, HttpData } from '../dataService/data.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})

export class SettingPageComponent {

  
  //LOAD PEOPLE
  item$: Observable<HttpData[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();

  //STRINGS
  groupName: string = 'New Group';
  oldGroupName: string = this.groupName
  groupUuid: string;
  tid: string;
  accessToken: string;
  refreshToken: string;
  errorMessage: string
  term: string = null;
  term2: string = null;
  term3: string = null;

  timezone: string;
  //NUMBERS
  numberMember: number = 0;
  numberManager: number = 0;
  j = 0
  timezoneCount: number = 0;

  //BOOLEAN
  addgroupbutton: boolean = false;
  addFlag: number = 1;
  noGroupFlag: number = null;
  isOn: boolean = true;
  saveUpdate: boolean = false;
  SaveDisable = true;
  deleteDisable: boolean
  loaderOpen: boolean = false;
  alert1Open: boolean = false;
  exampleModalOpen = false;
  exampleModal1Open = false;
  errorflag: boolean = false
  timezoneSaveDisable: boolean = true
  timezoneSaveTrigger:boolean=false
  


  //ARRAY
  selectedPersons: any //manager
  selectedPersons1: any; // members
  selectedPersonsArr: any[] = [];
  selectedPersonsArr1: any[] = [];
  previousMemberUuid: any[] = [];
  previousManagerUuid: any[] = [];
  customerArray: string[] = []
  customerArray2: string[] = []
  dataArray: any = [];
  MemDeleteArray: string[] = [];
  ManDeleteArray: string[] = [];
  placeholderString:string=" "
  TempArray: any[] = [];
  TempManArray: any[] = [];
  
  //OBJECTS
  private updateSubscription: Subscription;
  LogContext: any = {};


  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private logStatus: LoggerService) {

    this.selectedPersonsArr1 = ['members']
    this.selectedPersonsArr = ['managers']

  }


  @ViewChild("elem", { static: false }) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", { static: false }) select1Comp2: NgSelectComponent;
  @ViewChild('alertButton', { static: false }) alertButton: ElementRef;
  @ViewChild('failAlertButton', { static: false }) failAlertButton: ElementRef;
  @ViewChild('loadButton', { static: false }) loadButton: ElementRef;
  @ViewChild('closeLoadButton', { static: false }) closeLoadButton: ElementRef;
  @ViewChild('closeAlertButton', { static: false }) closeAlertButton: ElementRef;
  @ViewChild('closeFailAlertButton', { static: false }) closeFailAlertButton: ElementRef;
  @ViewChild('SaveSuccessTimezone', { static: false }) SaveSuccessTimezone: ElementRef;
  @ViewChild('SaveFailTimezone', { static: false }) SaveFailTimezone: ElementRef;


   ngOnInit() {


    this.route.queryParams
      .subscribe(params => {
        this.tid = params.tenantuuid;
      });
 this.LogContext["TID"] = this.tid;
  
    this.token()
    
    
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
         this.logStatus.log("Info", this.LogContext, "Succcss:200 OK", response['role'])

          if (response['role'] == "ACCOUNT_ADMIN" || response['role'] == "PARTNER_ADMIN") {
            //this.errorflag = true
            this.getdbdata()
            this.loadPeople();
            this.getTimezone()
            var expiryTime = response['exp'];
            
            const now = new Date()
            const secondsSinceEpoch = Math.round(now.getTime() / 1000)
            
            var remTime = (expiryTime - secondsSinceEpoch) * 1000 //milliseconds
           


            this.updateSubscription = interval(remTime - 5000).subscribe( //Buffer time of 5 secs
              (val) => {

              
               this.logStatus.log("Info",this.LogContext,"Token Expired")
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
                    this.updateSubscription.unsubscribe();

                  },
                  (error) => {
                    this.errorflag = false
                    if (error.status != 404) { this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString()); }
                    else { this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString()); }
                       this.logStatus.log("Error", this.LogContext, this.errorMessage)
                  })
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

  getTimezone() {
    this.LogContext["FunctionName"] = "getTimezone"
    this.dataService.getTimezoneData(this.tid, this.accessToken)
      .subscribe(
        (response) => {
          if(this.timezoneSaveTrigger==true)
          {
            this.SaveSuccessTimezone.nativeElement.click();
          }
          
          this.logStatus.log("Info", this.LogContext, response)
          this.timezone = response["tz_name"]
          this.timezoneSaveDisable = true
        } ,
      (error) => {  
        this.timezone="Error"

        this.logStatus.log("Error", this.LogContext, error.statusText)
      }
      )
  

  }

  changeTimezone(timezone) {
    this.LogContext["FunctionName"] = "changeTimezone"
    this.timezoneCount = this.timezoneCount + 1
    this.timezone = timezone
    if (this.timezoneCount > 2) {
      this.timezoneSaveDisable = false
    }
  }

  timezoneSave() {
    this.LogContext["FunctionName"] = "timezoneSave"
    var postGroup2: any = {}
    postGroup2['timezone'] = this.timezone
    var res = this.dataService.postTimezone(JSON.stringify(postGroup2), this.tid, this.accessToken)
    res.subscribe(
      (response) => {
        this.timezoneSaveTrigger=true
        this.logStatus.log("Info", this.LogContext, "Success:200 OK")
        this.timezoneSaveDisable = true
        this.getTimezone()

      },
      (error) => { 
        this.timezoneSaveDisable = true
        this.SaveFailTimezone.nativeElement.click();
        this.getTimezone()     
        this.logStatus.log("Error", this.LogContext, error.statusText)
      }
      )

  }

  OnGroupNameChange(args){

    this.LogContext["FunctionName"] = "OnGroupNameChange"

    if (this.numberManager > 0 || this.numberMember > 0) { //IF0

      if (this.saveUpdate == true) { //IF1

        if (this.groupName != this.oldGroupName //IF2
          || !(this.compare2(this.selectedPersonsArr1, this.previousMemberUuid))
          || !(this.compare2(this.selectedPersonsArr, this.previousManagerUuid))) {

          if (this.groupName.length > 2) //IF3
          {
            this.SaveDisable = false

          }

          else {//ELSE3
            this.SaveDisable = true;

          }

        }
        else { //ELSE2
          this.SaveDisable = true;


        }
      }

      else {//ELSE1

        if (this.groupName.length > 2)//IF4
        {
          this.SaveDisable = false

        }
        else {//ELSE4
          this.SaveDisable = true;

        }
      }
    }
  }
  
  
  NewGroup() { //when there is no existing group
    this.LogContext["FunctionName"] = "NewGroup"
    this.isOn = false
    this.noGroupFlag = 1
    this.logStatus.log("Info", this.LogContext, "No existing Groups")
    this.addgroup()
  }

closeCanModal() { //Cancel Modal close on crpss

    this.addgroupbutton = false;
    this.exampleModal1Open = false
    this.logStatus.log("Info", this.LogContext,"Cancel Dismiss")
  }

  getdbdata() { // TO GET ALL THE GROUPS

    this.LogContext["FunctionName"] = "getdbdata"
    this.dataArray = [];
    //this.isOn = false //extra
    //this.noGroupFlag = 1; //extra
    
    this.dataService.getAllGroupsData(this.tid, this.accessToken)
      .subscribe(
        (response) => {
   
          this.errorflag = true

          if (response != null && response.length != 0) {
          this.logStatus.log("Info", this.LogContext,"Group exsists")
            this.isOn = false
            this.noGroupFlag = 1;
            for (const i of (response as any)) {
              this.dataArray.push({
                Groupname: i.group_name,
                GroupId: i.group_uuid
              });
            }
          
          }
          else {
 
            this.isOn = true;
            this.noGroupFlag = 0;
            this.logStatus.log("Info", this.LogContext, "No existing Groups")
          }
        },

        (error) => {
          this.errorflag = false
          if (error.status != 404) { this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString()); }
          else { this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString()); }
          this.logStatus.log("Error", this.LogContext, this.errorMessage)
        }
      )

  }


  saveGroup() { // ON SAVE
    this.LogContext["FunctionName"] = "saveGroup"

    this.isOn = false;
    this.loadButton.nativeElement.click();
    var postGroup2: any = {}
    postGroup2['Groupname'] = this.groupName
    postGroup2['Supervisor_uuid'] = this.customerArray2
    postGroup2['Members_uuid'] = this.customerArray
    var res = this.dataService.postHTTPData(JSON.stringify(postGroup2), this.tid, this.accessToken)
    res.subscribe(
      (response) => {
        this.logStatus.log("Info", this.LogContext, "Success:200 OK")
        this.closeLoadButton.nativeElement.click();
        this.alertButton.nativeElement.click();
        var close = this.closeAlertButton.nativeElement;
        setTimeout(() => { this.getdbdata(); this.addgroupbutton = false; close.click(); }, 2000);
      },

      (error) => {

        if (error.status == 404) {
        this.errorflag = false;
          this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString());
        }
        else {
          setTimeout(() => { this.closeLoadButton.nativeElement.click(); this.failAlertButton.nativeElement.click(); }, 1000);
          var close = this.closeFailAlertButton.nativeElement;
          this.errorMessage = JSON.parse(error["error"]);
          this.errorMessage = this.errorMessage["ErrorLog"]
          setTimeout(() => { close.click(); }, 4000);
        }
        this.logStatus.log("Error", this.LogContext, this.errorMessage)
      }
    )
  }

  updateGroup() { //ON UPDATE
    this.LogContext["FunctionName"] = "updateGroup"
    
    this.isOn = false;
    this.loadButton.nativeElement.click();
    var postGroup2: any = {}
    postGroup2["Groupname"] = this.groupName
    postGroup2["members_toadd"] = this.customerArray
    postGroup2["supervisors_toadd"] = this.customerArray2
    postGroup2["members_todelete"] = this.MemDeleteArray
    postGroup2["supervisors_todelete"] = this.ManDeleteArray
    var res = this.dataService.postUpdatedData(JSON.stringify(postGroup2), this.groupUuid, this.accessToken, this.tid);
    res.subscribe(
      (response) => {
        this.logStatus.log("Info", this.LogContext, "Success:200 OK")
        var closeload = this.closeLoadButton.nativeElement
        closeload.click();
        this.alertButton.nativeElement.click();
        var close = this.closeAlertButton.nativeElement;
        setTimeout(() => { this.getdbdata(); this.addgroupbutton = false; close.click(); }, 2000);
      },

      (error) => {
        if (error.status == 404) {
        this.errorflag = false;
          this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString());
        }
        else {
          setTimeout(() => { this.closeLoadButton.nativeElement.click(); this.failAlertButton.nativeElement.click(); }, 1000);
          var close = this.closeFailAlertButton.nativeElement;
          this.errorMessage = JSON.parse(error["error"]);
          this.errorMessage = this.errorMessage["ErrorLog"]
          setTimeout(() => { close.click(); }, 4000);
        }
        this.logStatus.log("Error", this.LogContext, this.errorMessage)
      }
    )
  }

  compare(arr1, arr2) { //ARRAY COMPARISON IF EVEN ONE ELEMENT EXISTS
    this.LogContext["FunctionName"] = "compare"

    if (!arr1 || !arr2) return 

    let result: boolean;

    arr1.forEach((elem1, index) => {
      elem1;
      arr2.forEach((elem2, index) => {
        elem2;
        if (elem1.someProp === elem2.someProp) {
          result = true;//--If elem1 equal elem2        
        }
      });
    });

    return result

  }

  compare2(arr1, arr2) { // COMPARE TWO SIMILAR ARRAYS

    this.LogContext["FunctionName"] = "compare2"

    return JSON.stringify(arr1) == JSON.stringify(arr2)

  }


  OnAdd() {  //When Item is added in members

    this.LogContext["FunctionName"] = "OnAdd"


    if (this.selectedPersons1 != null) { 
      if (this.compare([this.selectedPersons1['first_name'], this.selectedPersons1['last_name'], this.selectedPersons1['user_guiname'], this.selectedPersons1['user_uuid']], this.selectedPersonsArr1.filter(item => item[3].indexOf(this.selectedPersons1['user_uuid']) > -1))) {

        this.logStatus.log("Info", this.LogContext, "Member Already exists!!")

      }

      else {

        this.logStatus.log("Info", this.LogContext, "Member Added")
        this.selectedPersonsArr1[this.numberMember] = ([this.selectedPersons1['first_name'], this.selectedPersons1['last_name'], this.selectedPersons1['user_guiname'], this.selectedPersons1['user_uuid']]);
        this.numberMember = this.numberMember + 1;
        this.customerArray.push(this.selectedPersons1['user_uuid'])
        if (this.MemDeleteArray.indexOf(this.selectedPersons1['user_uuid']) > -1) {
          this.MemDeleteArray.splice(this.MemDeleteArray.indexOf(this.selectedPersons1['user_uuid']), 1);
           
        }

      }
      if (this.groupName.length > 2) {
        if (!(this.compare2(this.selectedPersonsArr1, this.previousMemberUuid)) || this.groupName != this.oldGroupName) {
          this.SaveDisable = false //enable
        }
        else {
          this.SaveDisable = true;
        }
      }
      else {
        this.SaveDisable = true;
      }

    }
    this.selectedPersons1 = null

  }

  filterMember() // filter for selected members
  {

    this.LogContext["FunctionName"] = "filterMember"
    let term = this.term2
    this.TempArray = this.selectedPersonsArr1

    if (term) 
    {

      this.TempArray = this.TempArray.filter(item => ((item[0] + ' ' + item[1]).toString().toLowerCase().indexOf(term.toLowerCase())) > -1);
    }
  }

  filterManager() // filter for selected members
  {
    this.LogContext["FunctionName"] = "filterManager"
    let term = this.term
    this.TempManArray = this.selectedPersonsArr

    if (term) {  
      
      this.TempManArray = this.TempManArray.filter(item => ((item[0] + " " + item[1]).toString().toLowerCase().indexOf(term.toLowerCase())) > -1);
      
    }
  }

  removeFromList(item, flag) { //When Item is removed

    this.LogContext["FunctionName"] = "removeFromList"
    if (flag == 0) { //for members

     var i = this.selectedPersonsArr1.indexOf(item);
    this.MemDeleteArray.push(this.selectedPersonsArr1[i][3]);
    this.logStatus.log("Info", this.LogContext, "Member Removed",this.MemDeleteArray)
      this.selectedPersonsArr1.splice(i, 1);
      this.numberMember = this.numberMember - 1;
      this.filterMember()//filter function

      if (this.numberMember > 0 || this.numberManager > 0) {
        if (this.groupName.length > 2) {
          if (!(this.compare2(this.selectedPersonsArr1, this.previousMemberUuid)) || this.groupName != this.oldGroupName) {
            this.SaveDisable = false //enable
          }
          else {
            this.SaveDisable = true;
          }
        }
        else {
          this.SaveDisable = true;
        }

      }
      else {
        this.SaveDisable = true
      }

 
    }
    else if (flag == 1) {

      var i = this.selectedPersonsArr.indexOf(item);
      this.ManDeleteArray.push(this.selectedPersonsArr[i][3]);
      this.logStatus.log("Info", this.LogContext, "Manager Removed",this.ManDeleteArray)
     
      this.selectedPersonsArr.splice(i, 1);
      this.numberManager = this.numberManager - 1;
      this.filterManager() //filter function
      if (this.numberManager > 0 || this.numberMember > 0) {
        if (this.groupName.length > 2) {
          if (!(this.compare2(this.selectedPersonsArr, this.previousManagerUuid)) || this.groupName != this.oldGroupName) {
            this.SaveDisable = false //enable
          }
          else {
            this.SaveDisable = true;
          }
        }
        else {
          this.SaveDisable = true;
        }

      }
      else {
        this.SaveDisable = true
      }

    
    }

  }

  OnAdd1()  //When Item is added in managers
  {
    this.LogContext["FunctionName"] = " OnAdd1"
    if (this.selectedPersons != null) {

      if (this.compare([this.selectedPersons['first_name'], this.selectedPersons['last_name'], this.selectedPersons['user_guiname'], this.selectedPersons['user_uuid']], this.selectedPersonsArr.filter(item => item[3].indexOf(this.selectedPersons['user_uuid']) > -1))) {

        this.logStatus.log("Info", this.LogContext, "Manager Already exists!!")

      }

      else {

        this.logStatus.log("Info", this.LogContext, "Manager Added")
        this.selectedPersonsArr[this.numberManager] = ([this.selectedPersons['first_name'], this.selectedPersons['last_name'], this.selectedPersons['user_guiname'], this.selectedPersons['user_uuid']]);


        this.numberManager = this.numberManager + 1;
        this.customerArray2.push(this.selectedPersons['user_uuid'])

        if (this.ManDeleteArray.indexOf(this.selectedPersons['user_uuid']) > -1) {
          this.ManDeleteArray.splice(this.ManDeleteArray.indexOf(this.selectedPersons['user_uuid']), 1);
          
        }

       
      }
      
      if (this.groupName.length > 2) {
        if (!(this.compare2(this.selectedPersonsArr, this.previousManagerUuid)) || this.groupName != this.oldGroupName) {
          this.SaveDisable = false //enable
        }
        else {
          this.SaveDisable = true;
        }
      }
      else {
        this.SaveDisable = true;
      }

    }
    this.selectedPersons = null

  }

  //PAGINATION

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  }

  public config1: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  }

  addgroup() { //ON NEW GROUP ADD

    this.LogContext["FunctionName"] = "addgroup"
    this.addgroupbutton = true
    this.selectedPersonsArr = []
    this.selectedPersonsArr1 = []
    this.numberMember = 0
    this.numberManager = 0
    this.groupName = 'New Group'
    this.addFlag = 1;
    this.saveUpdate = false;
    this.deleteDisable = true; //cant delete a new group before saving
    this.SaveDisable = true
    this.logStatus.log("Info", this.LogContext, "New Group")
  }

  showGroupData(grpId: string) { //TO SHOW DATA IN GROUP
    this.LogContext["FunctionName"] = "showGroupData"
    this.loadPeople()
    this.saveUpdate = true
    this.deleteDisable = false; // Delete is enabled
    this.SaveDisable = true
    this.groupUuid = grpId;
    const data = this.dataService.getGroupInfo(grpId, this.accessToken, this.tid);
    this.addgroupbutton = true;
    this.selectedPersonsArr1 = []
    this.selectedPersonsArr = []
    this.previousMemberUuid = []
    this.previousManagerUuid = []
    this.ManDeleteArray = []
    this.MemDeleteArray = []
    this.customerArray = []
    this.customerArray2 = []
    this.term = null;
    this.term2 = null;
    data.subscribe(
      (response) => {
       
        this.selectedPersonsArr1 = []
        this.selectedPersonsArr = []
        this.groupName = response["group_name"];
        this.oldGroupName = response["group_name"];
        

        var arr1: any = [];
        arr1 = response['members'];

        var arr2: any = [];
        arr2 = response['supervisor'];


        for (var i in arr1) {
          this.selectedPersonsArr1[i] = [arr1[i]['first_name'], arr1[i]['last_name'], arr1[i]['user_guiname'], arr1[i]['user_uuid']];
          this.previousMemberUuid[i] = [arr1[i]['first_name'], arr1[i]['last_name'], arr1[i]['user_guiname'], arr1[i]['user_uuid']];


        }

      
        this.numberMember = this.selectedPersonsArr1.length


        for (var i in arr2) {
          this.selectedPersonsArr[i] = [arr2[i]['first_name'], arr2[i]['last_name'], arr2[i]['user_guiname'], arr2[i]['user_uuid']];
          this.previousManagerUuid[i] = [arr2[i]['first_name'], arr2[i]['last_name'], arr2[i]['user_guiname'], arr2[i]['user_uuid']];
        }

         
        this.numberManager = this.selectedPersonsArr.length

        this.logStatus.log("Info", this.LogContext,this.groupName)


      },
      (error) => {
        this.errorflag = false
        if (error.status != 404) { this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString()); }
        else { this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString()); }
        this.logStatus.log("Error", this.LogContext, this.errorMessage)
      }
    )
    this.addFlag = 2;

  }

  deleteGroup() //DELETE A GROUP
  {
    this.LogContext["FunctionName"] = "deleteGroup"
    var res = this.dataService.deleteGroupDb(this.groupUuid, this.tid, this.accessToken)
    res.subscribe(
      (response) => {                           //Next callback
        this.logStatus.log("Info", this.LogContext, "Success 200 OK")
        setTimeout(() => { this.getdbdata(); this.addgroupbutton = false; }, 200);
      },
      (error) => {                              //Error callback  
        this.errorflag = false
        if (error.status != 404) { this.errorMessage = error.status + ' ' + error.statusText + ' ' + this.logStatus.errorCodeMap.get(error.status.toString()); }
        else { this.errorMessage = this.logStatus.errorCodeMap.get(error.status.toString()); }
        this.logStatus.log("Error", this.LogContext, this.errorMessage)
      }
    )

  }

  private loadPeople() { // TO FETCH DATA MEMBERS AND MANAGERS    
    
    this.LogContext["FunctionName"] = "loadPeople"
    this.item$ = concat(
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.peopleLoading = true),
        switchMap(term =>
          this.dataService.getHttpData(term, this.tid, this.accessToken).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.peopleLoading = false)
          ))
      )
    )

  }

}