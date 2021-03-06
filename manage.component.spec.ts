import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Data2Service } from '../dataService/data2.service';
import { ManageComponent } from './manage.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IfStmt } from '@angular/compiler';


describe('ManageComponent:getUserInfo', () => {

    let component: ManageComponent;
    let fixture: ComponentFixture<ManageComponent>;
    let error: boolean = false


    class ActivatedRouteMock {
        queryParams = new Observable(observer => {
            const urlParams = {
                useruuid: '1',
                tenantuuid: 'tid'
            }
            observer.next(urlParams);
            observer.complete();
        });
    }

    const ServiceStub = {

        getUserData(flag) {

            return Observable.create((observer) => {

                if(flag=='1')
                observer.next({ Roleid: 1 });

                if(flag=='2')
                observer.next({ Roleid: 2 });

                if(flag=='3')
                observer.next({ Roleid: 3 });



                observer.complete();
            })

        },

        getLoggedInUser(accessToken) {

            return Observable.create((observer) => {
                if(accessToken=="invalid")
                {
                    observer.next({
                        extension: "7345",
                        role: "Invalid",
                        exp: (Math.round(new Date().getTime() / 1000)+30).toString(),
                        iat: "1591686931"
                    });

                }
            
                //(Math.round(new Date().getTime() / 1000)+30).toString(),
                else{
                    observer.next({
                        extension: "7345",
                        role: "ACCOUNT_ADMIN",
                        exp: (Math.round(new Date().getTime() / 1000)+30).toString(),
                        iat: "1591686931"
                    });

                }
               

                observer.complete();
            })

        },

        getNewToken(usedto) {

        
            var store = {
                Refresh_Token: "ll",
                Access_Token: "kkk"
            };
            return Observable.create((observer) => {

                if(usedto['token']=='invalid')
                {
                    observer.error({ status: 404, statustext: "ERROR new token" })
                }
                else{
                    observer.next(store);
                }
            

                observer.complete();
            })
        },

        putHTTPData(data: string, userid: string) {
            return of({ Status: 200, Statustext: "Success" })
        }
    }

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [ManageComponent],
            imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule],
            providers: [{ provide: Data2Service, useValue: ServiceStub }, {
                provide: ActivatedRoute,
                useClass: ActivatedRouteMock
            }]
        })

            .compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ManageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.userId).toEqual('1')
        expect(component.tid).toEqual("tid")
        expect(component.role).toEqual("None");
    });

    it('should generate Token', () => {

        var store = {
            Refresh_Token: "valid",
            Access_Token: "valid",
            tokenchange: ''
        };

        spyOn(window.localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(window.localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });

        component.token()
        expect(component.accessToken).toEqual('valid')
        expect(component.refreshToken).toEqual('valid')


    });

    it('should generate Token', () => {

        var store = {
            Refresh_Token: "invalid",
            Access_Token: "valid",
            tokenchange: ''
        };

        spyOn(window.localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(window.localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });

        component.token()
        expect(component.accessToken).toEqual('valid')
        expect(component.refreshToken).toEqual('invalid')


    });

    it('should generate Token unauthorised', () => {
        var store = {
            Refresh_Token: "valid",
            Access_Token: "invalid",
            tokenchange: ''
        };

        spyOn(window.localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(window.localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });

        
        component.token()
        expect(component.accessToken).toEqual('invalid')
        expect(component.refreshToken).toEqual('valid')
        expect(component.errorMessage).toEqual("Unauthorised: Not an Admin")


    });

    it('should getUserInfo', async(() => {

    

        component.userId='2'
        component.getuserinfo()
        expect(component.role).toEqual("Own/Group Recordings");

        component.userId='3'
        component.getuserinfo()
        expect(component.role).toEqual("All Recordings");

    }));

    it('get roles function', async () => {

        component.GetRoleValue("kk")
        expect(component.saveflag).toBeFalsy();
        component.roles = [component.role]
        expect(component.role_id).toEqual(1);


    })

    it('should call Userdetails', async () => {
        component.UserDetails();
        expect(component.saveflag).toBeTruthy();
    })

    it('should call Onclose', async () => {
        component.OnClose();
        expect(component.closeFlag).toBeTruthy()
    })



})

//***********************ERROR**********************************/

describe('ManageComponent:ERROR', () => {


    let component: ManageComponent;
    let fixture: ComponentFixture<ManageComponent>;
    let error: boolean = false

    const ServiceErrorStub = {
       
        getUserData(userId) {

         
           
            return Observable.create((observer) => {

                if(userId=='1')
                {
                  observer.error({ status: 404, statustext: "ERROR" });
                }
          
                else if(userId=='2')
                {
                  observer.error({ status: 400, statustext: "ERROR" });
                }

                observer.complete();
            })

        },

        getLoggedInUser() {
            let data = { status: 404, statustext: "ERROR", error:{message:"404 error"} }
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

        putHTTPData(tid,userId) {
            console.log(userId,"POKAA")
         
            return Observable.create((observer) => {

                if(userId=='1')
                {
                  observer.error({ status: 404, statustext: "ERROR" });
                }
          
                else if(userId=='2')
                {
                  observer.error({ status: 400, statustext: "ERROR" });
                }


                observer.complete();
            })
        }
    }

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [ManageComponent],
            imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule],
            providers: [{ provide: Data2Service, useValue: ServiceErrorStub }]
        })

            .compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ManageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should getUserInfo On Error 404', async(() => {

     
       
        component.userId='1';
        component.getuserinfo()
        expect(component.errorflag).toBeFalsy();


    }));

    it('should getUserInfo On Error 400', async(() => {

        component.userId='2';
        component.getuserinfo()
        expect(component.errorflag).toBeFalsy();
        

    }));

    it('should token 404', async(() => {

      
        component.token()
        expect(component.errorflag).toBeFalsy();
        

    }));

    it('should call Userdetails ON ERROR 404', async () => {
        component.userId='1';
        component.UserDetails();
        expect(component.saveflag).toBeTruthy();
        expect(component.errorflag).toBeFalsy();

    })

    it('should call Userdetails ON ERROR 400', async () => {
        component.userId='2';
        component.UserDetails();
        expect(component.saveflag).toBeTruthy();
        expect(component.errorflag).toBeFalsy();

    })



})
