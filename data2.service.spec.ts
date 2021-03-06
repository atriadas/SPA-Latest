import { TestBed, inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Data2Service } from './data2.service';

describe('Data2Service', () => {

    beforeEach(() => TestBed.configureTestingModule({
        providers: [Data2Service],
        imports: [
            HttpClientTestingModule
        ]
    }));

    it('should be created', () => {
        const service: Data2Service = TestBed.get(Data2Service);
        expect(service).toBeTruthy();
    });


    it('expects service to fetch All Users',
        inject([HttpTestingController, Data2Service],
            (httpMock: HttpTestingController, service: Data2Service) => {
                // We call the service
                service.getUserData("test0", "test1", "test2").subscribe(data3 => {
                    //expect(JSON.parse(data3.toString()).get.user_guiname).toEqual("provuser5@asc.com")
                    expect(Object.values(data3)).toContain("provuser5@asc.com")

                });
                // We set the expectations for the HttpClient mock
                const req = httpMock.expectOne('http://' + environment.backend_address + '/UserInfo?user_uuid=test0&tid=test2');
                expect(req.request.method).toEqual('GET');
                // Then we set the fake data to be returned by the mock
                let data3 = {
                    user_uuid: "1494d56e-db1f-4cdd-87c6-ec90a731cc52",

                    user_guiname: "provuser5@asc.com",

                    first_name: "prov",

                    last_name: "user5",

                    extension: "7004",

                    tenant_id: "6362a2c8-f247-4347-8fde-bd3b3c922c70"
                }

                req.flush(data3)
            }))


    it('expects service to fetch Logged in user',
        inject([HttpTestingController, Data2Service],
            (httpMock: HttpTestingController, service: Data2Service) => {
                // We call the service
                service.getLoggedInUser("test1").subscribe(data4 => {

                    expect(Object.values(data4)).toContain("7345")


                    // expect(data.data.length).toBe(7);
                });

                const req = httpMock.match('https://authentication.us.dev.api.mitel.io/2017-09-01/token')
                expect(req[0].request.method).toEqual('GET');
                // Then we set the fake data to be returned by the mock
                let data4 = {
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
        inject([HttpTestingController, Data2Service],
            (httpMock: HttpTestingController, service: Data2Service) => {
                // We call the service

                var userdto: any = {};
                userdto["grant_type"] = "refresh_token"
                userdto["token"] = "nnnnnnn"
                var post = JSON.stringify(userdto)


                service.getNewToken(post).subscribe(data =>

                    data => expect(data).toEqual(post, 'should return the employee'),
                    fail

                );

                const req = httpMock.expectOne("https://authentication.us.dev.api.mitel.io/2017-09-01/token");
                expect(req.request.method).toEqual('POST');
                expect(req.request.body).toEqual(post);

                // Expect server to return the employee after POST
                const expectedResponse = new HttpResponse({ status: 201, statusText: 'OK', body: post });
                req.event(expectedResponse);
            }))



    it('expects service to update Group Data',
        inject([HttpTestingController, Data2Service],
            (httpMock: HttpTestingController, service: Data2Service) => {
                // We call the service

                var userdto: any = {};
                userdto["Role_id"] = "All Recordings";
                var put = JSON.stringify(userdto)


                service.putHTTPData(put, "test0", "test1").subscribe(data =>
                    data => expect(data).toEqual(put, 'should return the employee'),
                    fail

                );
                const req = httpMock.expectOne('http://' + environment.backend_address + '/Group/ConfigureUsers?user_uuid=test0');
                expect(req.request.method).toEqual('PUT');
                expect(req.request.body).toEqual(put);

                // Expect server to return the employee after PUT
                const expectedResponse = new HttpResponse({ status: 201, statusText: 'OK', body: put });
                req.event(expectedResponse);

            }))


    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }))

});
