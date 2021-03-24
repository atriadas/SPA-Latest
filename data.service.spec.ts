import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { DataService, GroupsData, GroupInfo } from './data.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Key } from 'protractor';
import { HttpData } from './data2.service';

describe('DataService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [DataService],
        imports: [
            HttpClientTestingModule
        ]
    }));

    it('should be created', () => {
        const service: DataService = TestBed.get(DataService);
        expect(service).toBeTruthy();
    });


    it('expects service to fetch All Groups Data',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service
                service.getAllGroupsData("test1", "test2").subscribe(data => {
                   
                    data.filter(x => {
                        expect(x.group_name).toContain("Mitel Group 1")
                        //expect(x.group_name).toContain("Mitel Group 2")
                        expect(x.group_uuid).toContain("aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc")
                    })
                    // expect(data.data.length).toBe(7);
                });
                // We set the expectations for the HttpClient mock
                const req = httpMock.expectOne('http://' + environment.backend_address + '/Group/AllGroups?tid=test1');
                expect(req.request.method).toEqual('GET');
                // Then we set the fake data to be returned by the mock
                let data:GroupsData[]=[{ group_uuid: "aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc", group_name: "Mitel Group 1" }]
                req.flush(data)
            }))


    it('expects service to fetch  Groups Info',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service
                service.getGroupInfo("grpid", "authtoken", "tid").subscribe(data2 => {
                 
                    data2.filter(x => {
                        expect(x.group_name).toContain("Mitel Group 1")
                        expect(x.group_uuid).toContain("6955656b-9de3-45cb-a992-4d081918c171")
                        expect(x.members.extension).toEqual("7006")
                        expect(x.members.first_name).toEqual("prov")
                        expect(x.members.last_name).toEqual("user7")
                        expect(x.supervisor.tenant_id).toEqual("6362a2c8-f247-4347-8fde-bd3b3c922c70")
                        expect(x.supervisor.user_guiname).toEqual("provuser5@asc.com")
                        expect(x.supervisor.user_uuid).toEqual("1494d56e-db1f-4cdd-87c6-ec90a731cc52")
                    })

                });
                // We set the expectations for the HttpClient mock
                const req = httpMock.expectOne('http://' + environment.backend_address + '/Group/GetGroupsInfo?group_uuid=grpid&tid=tid');
                expect(req.request.method).toEqual('GET');
                // Then we set the fake data to be returned by the mock
                let data:GroupInfo[]=[ {
                    group_name: "Mitel Group 1", group_uuid: "6955656b-9de3-45cb-a992-4d081918c171",

                    members:

                        { user_uuid: "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", user_guiname: "provuser7@asc.com", first_name: "prov", last_name: "user7", extension: "7006", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" },

                    supervisor:

                        { user_uuid: "1494d56e-db1f-4cdd-87c6-ec90a731cc52", user_guiname: "provuser5@asc.com", first_name: "prov", last_name: "user5", extension: "7004", tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70" }

                }]
                req.flush(data);

            }))

    it('expects service to fetch All Users',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service
                service.getHttpData("test0", "test1", "test2").subscribe(data3 => {
                
                    data3.filter(x => {
                        expect(x.extension).toContain("7004")
                        expect(x.user_guiname).toContain("provuser5@asc.com")
                        expect(x.first_name).toContain("prov")
                    })
                    // expect(data.data.length).toBe(7);
                });
                // We set the expectations for the HttpClient mock
                const req = httpMock.expectOne('http://' + environment.backend_address + '/FindUser?tid=test1&user=test0');
                expect(req.request.method).toEqual('GET');
                // Then we set the fake data to be returned by the mock
                let data3=[{ user_uuid: "1494d56e-db1f-4cdd-87c6-ec90a731cc52" ,
                
                    user_guiname: "provuser5@asc.com",

                    first_name: "prov",

                    last_name: "user5",

                    extension: "7004",

                    tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70"}] 

                req.flush(data3);

            }))

            it('expects service to fetch All Users',
            inject([HttpTestingController, DataService],
                (httpMock: HttpTestingController, service: DataService) => {
                    // We call the service
                    service.getHttpData(null, "test1", "test2")
                   
                        // expect(data.data.length).toBe(7);
             
                    // We set the expectations for the HttpClient mock
                    // const req = httpMock.expectOne('http://' + environment.backend_address + '/FindUser?tid=test1&user=test0');
                    // expect(req.request.method).toEqual('GET');
                    // Then we set the fake data to be returned by the mock
                    // let data3=[{ user_uuid: "1494d56e-db1f-4cdd-87c6-ec90a731cc52" ,
                    
                    //     user_guiname: "provuser5@asc.com",
    
                    //     first_name: "prov",
    
                    //     last_name: "user5",
    
                    //     extension: "7004",
    
                    //     tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70"}] 
    
                    // req.flush(data3);
    
                }))


    it('expects service to fetch Logged in user',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service
                service.getLoggedInUser("test1").subscribe(data4 => {

                    expect(Object.values(data4)).toContain("7345")


                    // expect(data.data.length).toBe(7);
                });
                // We set the expectations for the HttpClient mock
                // const req = httpMock.expectOne('http://C:/Users/dasatria/Documents/mitel/front-end/App Settings - Groups Mangement SPA - Single column variant/CustomerApplication2_new/Group-Management-SPA/coverage\CustomerApplication2/src/app/dataService/data');
                // expect(req.request.url.endsWith("/2017-09-01/token")).toEqual(true);
                const req = httpMock.match('https://authentication.us.dev.api.mitel.io/2017-09-01/token')
                expect(req[0].request.method).toEqual('GET');
                // Then we set the fake data to be returned by the mock
                let data4={
                    extension: "7345",
                    role: "ACCOUNT_ADMIN",
                    loginId: "asccruser6@mitel.com",
                    iss: "https://authentication.us-east-1.us.dev.api.mitel.io/connect",
                    mobileVerified: "false",
                    principalId: "b42aa385-44da-4866-84bf-6d487bd1fcd4",
                    integrationLatency: 0,
                    profileHeaderUrl: "",
                    photoUrl: "",
                    extensionVerified: "true",
                    sipAddress: "b42aa385-44da-4866-84bf-6d487bd1fcd4@18a15b3e-84d1-4f48-8ace-ce2bcdaf86c6.us.dev.api.mitel.io",
                    exp: "1591690894",
                    iat: "1591686931",
                    email: "asccruser6@mitel.com",
                    phoneVerified: "true",
                    mobile: "",
                    languageCode: "en-US",
                    userId: "b42aa385-44da-4866-84bf-6d487bd1fcd4",
                    uniqueUserId: "b42aa385-44da-4866-84bf-6d487bd1fcd4",
                    accountId: "18a15b3e-84d1-4f48-8ace-ce2bcdaf86c6",
                    emailVerified: "false",
                    aud: "https://mitel.io/auth/teamwork",
                    phone: "+14085087345",
                    domain: "18a15b3e-84d1-4f48-8ace-ce2bcdaf86c6.us.dev.api.mitel.io",
                    name: "asc user6",
                    siteId: "",
                    partnerId: "991000002"
                }
                req[0].flush(data4);
            }))



    it('expects service to fetch new token',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service

                var userdto: any = {};
                userdto["grant_type"] = "refresh_token"
                userdto["token"] = "nnnnnnn"
                var post = JSON.stringify(userdto)


                service.getNewToken(post).subscribe(data =>
                    // expect(JSON.parse(data.toString()).get.extension).toEqual("7345")
                    data => expect(data).toEqual(post, 'should return the employee'),
                    fail

                );
                // expect(data.data.length).toBe(7);


                const req = httpMock.expectOne("https://authentication.us.dev.api.mitel.io/2017-09-01/token");
                expect(req.request.method).toEqual('POST');
                expect(req.request.body).toEqual(post);

                // Expect server to return the employee after POST
                const expectedResponse = new HttpResponse({ status: 201, statusText: 'OK', body: post });
                req.event(expectedResponse);

                // Then we set the fake data to be returned by the mock
                //   req.flush({data:{
                //     extension: "7345",
                //     role: "ACCOUNT_ADMIN",
                //     loginId: "asccruser6@mitel.com"
                //   }
                // });

            }))


    it('expects service to post Group Data',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service

                var postGroup2: any = {}
                postGroup2['Groupname'] = "Mitel Group3"
                postGroup2['Supervisor_uuid'] = ["25eb0277-5fd2-44ba-8da0-6190d4d50f2b", "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408"],
                    postGroup2['Members_uuid'] = ["1494d56e-db1f-4cdd-87c6-ec90a731cc52", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", "48fdc60b-0ce1-412a-90ba-8eb664dc87f5"]
                var post = JSON.stringify(postGroup2)


                service.postHTTPData(post, "test1", "test2").subscribe(data =>
                    data => expect(data).toEqual(post, 'should return the employee'),
                    fail

                );
                const req = httpMock.expectOne('http://' + environment.backend_address + '/createGroup?tid=test1');
                expect(req.request.method).toEqual('POST');
                expect(req.request.body).toEqual(post);

                // Expect server to return the employee after POST
                const expectedResponse = new HttpResponse({ status: 201, statusText: 'OK', body: post });
                req.event(expectedResponse);

            }))


    it('expects service to update Group Data',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service

                var postGroup2: any = {}
                postGroup2['Groupname'] = "Mitel Group3"
                postGroup2['Supervisor_uuid'] = ["25eb0277-5fd2-44ba-8da0-6190d4d50f2b", "5fdfb3cd-a107-49ac-8e2c-5a3d22d3e408"],
                    postGroup2['Members_uuid'] = ["1494d56e-db1f-4cdd-87c6-ec90a731cc52", "2115f0a5-8c6c-45a7-83c8-79b34eb7f67a", "48fdc60b-0ce1-412a-90ba-8eb664dc87f5"]
                var put = JSON.stringify(postGroup2)


                service.postUpdatedData(put, "test0", "test1", "test2").subscribe(data =>
                    data => expect(data).toEqual(put, 'should return the employee'),
                    fail

                );
                const req = httpMock.expectOne('http://' + environment.backend_address + '/Group/UpdateGroup?grp_id=test0&tid=test2');
                expect(req.request.method).toEqual('PUT');
                expect(req.request.body).toEqual(put);

                // Expect server to return the employee after PUT
                const expectedResponse = new HttpResponse({ status: 201, statusText: 'OK', body: put });
                req.event(expectedResponse);

            }))


    it('expects service to Delete Group',
        inject([HttpTestingController, DataService],
            (httpMock: HttpTestingController, service: DataService) => {
                // We call the service
                service.deleteGroupDb("test1", "test2", "test3").subscribe((data: any) => {
                    expect(data).toBe(3);
                  });
                const req = httpMock.expectOne('http://'+environment.backend_address+'/Group/DeleteGroup?group_uuid=test1&tid=test2');
                expect(req.request.method).toEqual('DELETE');
                req.flush(3);
            }))

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }))

});
