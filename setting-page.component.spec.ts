import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SettingPageComponent } from './setting-page.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { GroupFilterPipe } from '../filter/groupFilter.pipe';
import { DataService } from '../dataService/data.service';
import { ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SettingPageComponent', () => {
  let component: SettingPageComponent;
  let fixture: ComponentFixture<SettingPageComponent>;

  class ActivatedRouteMock {
    queryParams = new Observable(observer => {
      const urlParams = {
        //useruuid: 'user',
        tenantuuid: 'tid'
      }
      observer.next(urlParams);
      observer.complete();
    });
  }

  const ServiceStub = {

    getAllGroupsData(tid, flag) {



      return Observable.create((observer) => {

        if (flag == 'nullDb') {
          observer.next([]);
        }

        else if (flag == 'valid Db') {
          observer.next([{ group_uuid: "aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc", group_name: "Mitel Group 1" },
          { group_uuid: "aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc", group_name: "Mitel Group 2" }]);
        }

        observer.complete();
      })
    },

    getLoggedInUser() {

      return Observable.create((observer) => {

        observer.next({
          extension: "7345",
          role: "ACCOUNT_ADMIN",
          exp: (Math.round(new Date().getTime() / 1000)+30).toString(),
          iat: "1591686931"
         
        });
        //(Math.round(new Date().getTime() / 1000)+300).toString(),
     

        observer.complete();
      })

    },

    getNewToken() {

      var store = {
        Refresh_Token: "ll",
        Access_Token: "kkk"
      };
      return Observable.create((observer) => {

        observer.next(store);

        observer.complete();
      })
    },

    getGroupInfo() {
      return of({
        group_name: "Mitel Group 1", group_uuid: "6955656b-9de3-45cb-a992-4d081918c171",

        members:

          [{ user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov", last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }],

        supervisor:

          [{ user_uuid: "1494d56e-db1f-4cdd-87c6-ec90a731cc52", user_guiname: "provuser5@asc.com", first_name: "prov", last_name: "user5", extension: "7004", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }]

      })

    },

    postHTTPData() {
      return of({ Status: 200, Statustext: "Success" })

    },

    postUpdatedData() {
      return of({ Status: 200, Statustext: "Success" })
    },

    deleteGroupDb() {
      return of({ Status: 200, Statustext: "Success" })
    }
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingPageComponent, GroupFilterPipe],
      imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule, NgxPaginationModule],
      providers: [{ provide: DataService, useValue: ServiceStub }, {
        provide: ActivatedRoute,
        useClass: ActivatedRouteMock
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  beforeEach(() => {
    var store = {
      Refresh_Token: "ll",
      Access_Token: "kkk",
      tokenchange: ''
    };

    spyOn(window.localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(window.localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    // spyOn(window.localStorage, 'clear').and.callFake(function () {
    //     store = {};
    // });

  });

  it('should create Settings Component', () => {



    component.accessToken = "valid Db"
    expect(component).toBeTruthy();
    expect(component.tid).toEqual("tid")



  });

  it('should generate Token', () => {

    component.token()
    expect(component.accessToken).toEqual('kkk')
    expect(component.refreshToken).toEqual('ll')


  });

  it('should enable Save Buton on Group Name Change On new Group valid groupname', () => {
    component.numberManager = 1
    component.saveUpdate = false
    component.groupName = "kakka"
    component.OnGroupNameChange("m"); //random variable
    expect(component.SaveDisable).toBeFalsy();


  });

  it('should disable Save Buton on Group Name Change On new Group with invalid groupname', () => {
    component.numberManager = 1
    component.saveUpdate = false
    component.groupName = "k"
    component.OnGroupNameChange("m"); //random variable
    expect(component.SaveDisable).toBeTruthy();

  });

  it('should disable Save Buton on Group Name Change On update with invalid groupname', () => {
    component.numberManager = 1
    component.saveUpdate = true
    component.groupName = "k"
    component.OnGroupNameChange("m"); //random variable
    expect(component.SaveDisable).toBeTruthy();
  });

  it('should enable Save Buton on Group Name Change On update with valid groupname', () => {
    component.numberManager = 1
    component.saveUpdate = true
    component.groupName = "kakakak"
    component.OnGroupNameChange("m"); //random variable
    expect(component.SaveDisable).toBeFalsy();

  });

  it('should enable Save Buton on Group Name Change On update with valid groupname', () => {
    component.numberManager = 1
    component.saveUpdate = true
    component.groupName = "kakakak"
    component.oldGroupName = "kakakak"
    component.selectedPersonsArr = ["lala", "poka"]
    component.selectedPersonsArr1 = ["lala", "poka"]
    component.previousMemberUuid = ["lala", "poka"]
    component.previousManagerUuid = ["lala", "poka"]

    component.OnGroupNameChange("m"); //random variable
    expect(component.SaveDisable).toBeTruthy();

  });

  it('should call on New Group', () => {
    component.NewGroup();
    expect(component.isOn).toBeFalsy();
    expect(component.noGroupFlag).toEqual(1);
  });

  it('should call on getdbdata valid db', () => {
    component.accessToken = "valid Db"
    component.getdbdata();
    expect(component.errorflag).toBeTruthy();
    expect(component.isOn).toBeFalsy();
    expect(component.noGroupFlag).toEqual(1);

  });

  it('should call on getdbdata null db', () => {
    component.accessToken = "nullDb"
    component.getdbdata();
    expect(component.errorflag).toBeTruthy();
    expect(component.isOn).toBeTruthy();
    expect(component.noGroupFlag).toEqual(0);

  });

  it('should call on showGroupData', () => {
    component.showGroupData("aa");
    expect(component.saveUpdate).toBeTruthy();
    expect(component.deleteDisable).toBeFalsy();
    expect(component.SaveDisable).toBeTruthy();
    expect(component.addgroupbutton).toBeTruthy();
    expect(component.selectedPersonsArr1).not.toEqual([])
    expect(component.selectedPersonsArr).not.toEqual([])
    expect(component.previousMemberUuid).not.toEqual([])
    expect(component.previousManagerUuid).not.toEqual([])
    expect(component.ManDeleteArray).toEqual([])
    expect(component.MemDeleteArray).toEqual([])
    expect(component.customerArray).toEqual([])
    expect(component.customerArray2).toEqual([])
    expect(component.groupName).toEqual("Mitel Group 1")

  });

  it('should call on filterMember', () => {
    component.filterMember();
    expect(component.TempArray).toEqual(component.selectedPersonsArr1);
  });

  it('should call on filterManager', () => {
    component.filterManager();
    expect(component.TempManArray).toEqual(component.selectedPersonsArr);
  });

  it('should call on  addgroup', () => {
    component.addgroup();
    expect(component.selectedPersonsArr).toEqual([])
    expect(component.selectedPersonsArr1).toEqual([])
    expect(component.numberManager).toEqual(0)
    expect(component.numberMember).toEqual(0)
    expect(component.groupName).toEqual('New Group')
    expect(component.addFlag).toEqual(1)
    expect(component.saveUpdate).toBeFalsy()
  });

  it('should call on saveGroup', fakeAsync(() => {
    
    component.loadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.closeAlertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.closeLoadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.alertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    var close = component.closeAlertButton.nativeElement;
    component.saveGroup();
    fixture.detectChanges()

    // expect(component.loadButton.nativeElement.click).toHaveBeenCalled()
    // expect(component.alertButton.nativeElement.click).toHaveBeenCalled()
    // expect(component.closeLoadButton.nativeElement.click).toHaveBeenCalled()

    // expect(e2.nativeElement.click).toHaveBeenCalled();
    expect(component.isOn).toBeFalsy();
    tick(2000);
    expect(component.addgroupbutton).toBeFalsy()
    expect(close.click).toHaveBeenCalled()

  }));

  it('should call on updateGroup',  fakeAsync(() => {
    component.loadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.closeAlertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.closeLoadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.alertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    var close = component.closeAlertButton.nativeElement;
    var closeload=component.closeLoadButton.nativeElement;

    component.updateGroup();
    fixture.detectChanges()

    // expect(component.loadButton.nativeElement.click).toHaveBeenCalled()
    // expect(component.alertButton.nativeElement.click).toHaveBeenCalled()
    // expect(closeload.click).toHaveBeenCalled()

    expect(component.isOn).toBeFalsy();

    tick(2000);
    expect(component.addgroupbutton).toBeFalsy()
    expect(close.click).toHaveBeenCalled()


  }));

  it('should call on compare', () => {

    var arr1 = ["a", "b"]
    var arr2 = ["a", "c"]
    var arr3 = ["c", "d"]
    expect(component.compare(arr1, arr2)).toBeTruthy();
    expect(component.compare(arr1, arr3)).toBeTruthy();

  });

  it('should call on compare2', () => {

    var arr1 = ["a", "b"]
    var arr2 = ["a", "b"]
    var arr3 = ["c", "d"]
    expect(component.compare2(arr1, arr2)).toBeTruthy();
    expect(component.compare2(arr1, arr3)).toBeFalsy();

  });

  it('should call on deleteGroup', fakeAsync(() => {
    component.deleteGroup()
    tick(201)
    expect(component.addgroupbutton).toBeFalsy()
  }));

  it('should call on filterMember', fakeAsync(() => {

    component.term2 = "l"
    component.selectedPersonsArr1 = ["lala", "poka"]
    component.filterMember()
    expect(component.TempArray).toContain("lala")
    component.term2 = "j"
    component.filterMember()
    expect(component.TempArray).toEqual([])

  }));

  it('should call on filterManager', fakeAsync(() => {

    component.term = "l"
    component.selectedPersonsArr = ["lala", "poka"]
    component.filterManager()
    expect(component.TempManArray).toContain("lala")
    component.term = "j"
    component.filterManager()
    expect(component.TempManArray).toEqual([])

  }));

  it('should call on adding same member', fakeAsync(() => {

    component.selectedPersons1 = { "user_uuid": "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", "user_guiname": "provuser7@asc.com", "first_name": "prov", "last_name": "user7", "extension": "7006", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    component.selectedPersonsArr1 = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "Mitel Group"
    component.OnAdd()
    expect(component.SaveDisable).toBeFalsy()

  }));

  it('should call on adding a different member', fakeAsync(() => {

    // component.selectedPersons1=  '{user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov",last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }'
    component.selectedPersonsArr1 = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "Mitel Group"
    component.selectedPersons1 = { "user_uuid": "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408", "user_guiname": "provuser10@asc.com", "first_name": "prov", "last_name": "user10", "extension": "7009", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    component.OnAdd()
    expect(component.customerArray).toEqual(["5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408"])
    expect(component.SaveDisable).toBeFalsy()

  }));

  it('should call on adding a different member with old name', fakeAsync(() => {

    // component.selectedPersons1=  '{user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov",last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }'
    component.selectedPersonsArr1 = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "M"
    component.selectedPersons1 = { "user_uuid": "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408", "user_guiname": "provuser10@asc.com", "first_name": "prov", "last_name": "user10", "extension": "7009", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    component.OnAdd()
    expect(component.SaveDisable).toBeTruthy()

  }));
  it('should call on adding a different member with old name', fakeAsync(() => {

    component.selectedPersons1 = { "user_uuid": "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408", "user_guiname": "provuser10@asc.com", "first_name": "prov", "last_name": "user10", "extension": "7009", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    // component.selectedPersons1=  '{user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov",last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }'
    component.selectedPersonsArr1 = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "Mitel"
    component.oldGroupName = "Mitel"
    component.previousMemberUuid = component.selectedPersonsArr1
    component.previousMemberUuid[1] = ([component.selectedPersons1['first_name'], component.selectedPersons1['last_name'], component.selectedPersons1['user_guiname'], component.selectedPersons1['user_uuid']]);
    //component.previousMemberUuid=[["prov","user7","provuser7@asc.com","2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"],["prov","user7","provuser7@asc.com","2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]]
    component.OnAdd()
    expect(component.SaveDisable).toBeTruthy()

  }));

  it('should call on adding a different manager with old name', fakeAsync(() => {

    component.selectedPersons = { "user_uuid": "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408", "user_guiname": "provuser10@asc.com", "first_name": "prov", "last_name": "user10", "extension": "7009", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    // component.selectedPersons1=  '{user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov",last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }'
    component.selectedPersonsArr = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "Mitel"
    component.oldGroupName = "Mitel"
    component.previousManagerUuid = component.selectedPersonsArr
    component.previousManagerUuid[1] = ([component.selectedPersons['first_name'], component.selectedPersons['last_name'], component.selectedPersons['user_guiname'], component.selectedPersons['user_uuid']]);
    //component.previousMemberUuid=[["prov","user7","provuser7@asc.com","2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"],["prov","user7","provuser7@asc.com","2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]]
    component.OnAdd1()
    expect(component.SaveDisable).toBeTruthy()

  }));

  it('should call on adding same Manager', fakeAsync(() => {

    component.selectedPersons = { "user_uuid": "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", "user_guiname": "provuser7@asc.com", "first_name": "prov", "last_name": "user7", "extension": "7006", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    component.selectedPersonsArr = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "Mitel Group"
    component.OnAdd1()
    expect(component.SaveDisable).toBeFalsy()

  }));

  it('should call on adding a different Manager', fakeAsync(() => {

    // component.selectedPersons1=  '{user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov",last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }'
    component.selectedPersonsArr = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "Mitel Group"
    component.selectedPersons = { "user_uuid": "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408", "user_guiname": "provuser10@asc.com", "first_name": "prov", "last_name": "user10", "extension": "7009", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    component.OnAdd1()
    expect(component.customerArray2).toEqual(["5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408"])
    expect(component.SaveDisable).toBeFalsy()

  }));

  it('should call on adding a different Manager with old name', fakeAsync(() => {

    // component.selectedPersons1=  '{user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov",last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }'
    component.selectedPersonsArr = ["prov", "user7", "provuser7@asc.com", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a"]
    component.groupName = "M"
    component.selectedPersons = { "user_uuid": "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408", "user_guiname": "provuser10@asc.com", "first_name": "prov", "last_name": "user10", "extension": "7009", "tenant_id": "6362a2c8-f247-4347-8fde-bd3b3c922c70" }
    component.OnAdd1()
    expect(component.SaveDisable).toBeTruthy()

  }));

  it('should call on remove a different Member  with old name', fakeAsync(() => {

    component.selectedPersonsArr1 = ["lala", "poka"]
    component.removeFromList("lala", 0)
    expect(component.SaveDisable).toBeTruthy()


  }));

  it('should call on remove a different Member  with old name', fakeAsync(() => {

    component.selectedPersonsArr1 = ["lala", "poka"]
    component.groupName = "Mite"
    component.oldGroupName = "l"
    component.numberManager = 1
    component.removeFromList("lala", 0)
    expect(component.SaveDisable).toBeFalsy()
    component.numberManager = 1
    component.groupName = "lalala"
    component.oldGroupName = "lalala"
    component.previousMemberUuid = []
    component.removeFromList("poka", 0)
    expect(component.SaveDisable).toBeTruthy()

  }));

  it('should call on remove a different Member with old name', fakeAsync(() => {

    component.selectedPersonsArr1 = ["lala", "poka"]
    component.numberManager = 1
    component.groupName = "k"
    component.removeFromList("lala", 0)

    expect(component.SaveDisable).toBeTruthy()

  }));


  it('should call on remove a different Manager with old name', fakeAsync(() => {

    component.selectedPersonsArr = ["lala", "poka"]
    component.removeFromList("lala", 1)
    expect(component.SaveDisable).toBeTruthy()


  }));


  it('should call on remove a different Manager with old name', fakeAsync(() => {

    component.selectedPersonsArr = ["lala", "poka"]
    component.groupName = "Mite"
    component.oldGroupName = "l"
    component.numberMember = 1
    component.removeFromList("lala", 1)
    expect(component.SaveDisable).toBeFalsy()
    component.numberMember = 1
    component.groupName = "lalala"
    component.oldGroupName = "lalala"
    component.previousManagerUuid = []
    component.removeFromList("poka", 1)
    expect(component.SaveDisable).toBeTruthy()

  }));

  it('should call on remove a different Manager with old name', fakeAsync(() => {

    component.selectedPersonsArr = ["lala", "poka"]
    component.numberMember = 1
    component.groupName = "k"
    component.removeFromList("lala", 1)

    expect(component.SaveDisable).toBeTruthy()

  }));



  ///***********************************ERROR********************************************************** */

});

describe('SettingPageComponent ON ERROR', () => {
  let component: SettingPageComponent;
  let fixture: ComponentFixture<SettingPageComponent>;



  const ServiceErrorStub = {

    getAllGroupsData(tid) {
      
      return Observable.create((observer) => {

        if(tid=='1')
        {
          observer.error({ status: 404, statustext: "ERROR" });
        }
  
        else if(tid=='2')
        {
          observer.error({ status: 400, statustext: "ERROR" });
        }

        observer.complete();
      })

    },
    getLoggedInUser() {
      let data = { status: 404, statustext: "ERROR", error: { message: "404 error" } }
      return Observable.create((observer) => {

        observer.error(data);

        observer.complete();
      })


    },
    getNewToken() {
      let data = { status: 404, statustext: "ERROR" }
      return Observable.create((observer) => {

        observer.error(data);

        observer.complete();
      })

    },
    getGroupInfo(tid) {
      
      return Observable.create((observer) => {

        if(tid=='1')
        {
          observer.error({ status: 404, statustext: "ERROR" });
        }
  
        else if(tid=='2')
        {
          observer.error({ status: 400, statustext: "ERROR" });
        }

        observer.complete();
      })

    },
    postHTTPData(ll,tid) {

      return Observable.create((observer) => {

        if(tid=='1')
        {
          observer.error({ status: 404, statustext: "ERROR" });
        }
  
        else if(tid=='2')
        {
          observer.error({ status: 400, statustext: "ERROR" });
        }

       

        observer.complete();
      })
    },
    postUpdatedData(ll,tid) {
      
      return Observable.create((observer) => {

        if(tid=='1')
        {
          observer.error({ status: 404, statustext: "ERROR" });
        }
  
        else if(tid=='2')
        {
          observer.error({ status: 400, statustext: "ERROR" });
        }

        observer.complete();
      })
    },
    deleteGroupDb(group_uuid) {
      let data;
      if(group_uuid=='1')
      {
        data = { status: 404, statustext: "ERROR" }
      }
      else if(group_uuid=='2')
      {
        data = { status: 400, statustext: "ERROR" }
      }
   
      return Observable.create((observer) => {

        observer.error(data);

        observer.complete();
      })
    }
  }


  // @ViewChild('openModal', { static: false }) openModal: ElementRef;
  // @ViewChild('alertButton', { static: false }) alertButton: ElementRef;
  // @ViewChild('failAlertButton', { static: false }) failAlertButton: ElementRef;
  // @ViewChild('loadButton', { static: false }) loadButton: ElementRef;
  // @ViewChild('closeLoadButton', { static: false }) closeLoadButton: ElementRef;
  // @ViewChild('closeAlertButton', { static: false }) closeAlertButton: ElementRef;
  // @ViewChild('closeFailAlertButton', { static: false }) closeFailAlertButton: ElementRef;
  // const e2: ElementRef = new ElementRef({click() {} } );


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingPageComponent, GroupFilterPipe],
      imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule, NgxPaginationModule],
      providers: [{ provide: DataService, useValue: ServiceErrorStub }]
      ,
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  beforeEach(() => {
    var store = {
      Refresh_Token: "ll",
      Access_Token: "kkk",
      tokenchange: ''
    };

    spyOn(window.localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(window.localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    // spyOn(window.localStorage, 'clear').and.callFake(function () {
    //     store = {};
    // });

  });

  it('should create Settings Component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate Token', () => {

    component.token()
    expect(component.accessToken).toEqual('kkk')
    expect(component.refreshToken).toEqual('ll')
    expect(component.errorflag).toBeFalsy();

  });

  it('should call on getdbdata', () => {
    component.tid='1'
    component.getdbdata();
    expect(component.errorflag).toBeFalsy();

  });
  it('should call on getdbdata', () => {
    component.tid='2'
    component.getdbdata();
    expect(component.errorflag).toBeFalsy();

  });

  it('should call on showGroupData', () => {
 
    component.showGroupData("1");
    expect(component.errorflag).toBeFalsy();

  });

  it('should call on showGroupData', () => {
 
    component.showGroupData("2");
    expect(component.errorflag).toBeFalsy();

  });


  it('should call on saveGroup ERROR', () => {
    component.tid='2';

    component.loadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.closeFailAlertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }
  
    component.closeLoadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.failAlertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    var close = component.closeFailAlertButton.nativeElement;

    component.saveGroup();
    
  });

  
  it('should call on saveGroup ERROR 404', () => {
    component.tid='1';
    component.loadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }
    component.saveGroup();
    expect(component.errorflag).toBeFalsy();
    
  });


  it('should call on updateGroup ERROR 404', () => {
    component.groupUuid='1';
    component.loadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }
    component.updateGroup();
    expect(component.errorflag).toBeFalsy();
    
  });

  it('should call on updateGroup on  ERROR', () => {

    component.groupUuid='2';

    component.loadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.closeFailAlertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }
  
    component.closeLoadButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    component.failAlertButton = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['click'])
    }

    var close = component.closeFailAlertButton.nativeElement;

    component.updateGroup();

  });


  it('should call on deleteGroup', fakeAsync(() => {
    component.groupUuid='1'
    component.deleteGroup()
    expect(component.errorflag).toBeFalsy();

  }));

  it('should call on deleteGroup', fakeAsync(() => {
    component.groupUuid='2'
    component.deleteGroup()
    expect(component.errorflag).toBeFalsy();

  }));





});
