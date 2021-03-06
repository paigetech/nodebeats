"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var login_service_1 = require('./login.service');
var login_model_1 = require('./login.model');
var login_component_1 = require("./login.component");
var Rx_1 = require("rxjs/Rx");
var testing_1 = require('@angular/core/testing');
var testing_2 = require("@angular/router/testing");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var general_config_1 = require("../../../shared/configs/general.config");
//TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
// export const IncludProvider = [
//     FormBuilder,
//     {provide: APP_BASE_HREF, useValue: '/'}, // must be second
//     {provide: ActivatedRoute, useClass: Mock},
//     {provide: Router, useClass: Mock},
// ];
//
var MockSingleLoginService = (function (_super) {
    __extends(MockSingleLoginService, _super);
    function MockSingleLoginService() {
        _super.call(this, null);
        this.loggedIn = false;
        this.isValidLogin = function () {
            return Rx_1.Observable.of(false);
        };
        this.login = function (loginCred) {
            var objResponse = new login_model_1.LoginResponse();
            objResponse.success = false;
            return Rx_1.Observable.of(objResponse);
        };
    }
    return MockSingleLoginService;
}(login_service_1.LoginService));
describe("Verify Not Already Login", function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [testing_2.RouterTestingModule, forms_1.ReactiveFormsModule, http_1.HttpModule],
            declarations: [login_component_1.LoginComponent],
            providers: [
                { provide: login_service_1.LoginService, useClass: MockSingleLoginService }
            ]
        });
    });
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.compileComponents();
    }));
    it('should check the Validation if there is previously stored token and respond with inValid Login', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        expect(component.isValidLogin).toBe(false);
    }));
    it('should show the LoginForm', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        expect(compiled.textContent).toContain('Nodebeats Login');
        var component = fixture.debugElement.componentInstance;
        expect(component.loginForm).toBeDefined();
    }));
    it('should show the required message when trying to login with empty username /password field', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        compiled.querySelector('.login-btn').click();
        fixture.detectChanges();
        expect(compiled.querySelector('.error-msg').textContent).toContain('*');
    }));
    it('should show the invalid credential message when trying to login with wrong credential', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        var component = fixture.debugElement.componentInstance;
        component.loginForm.controls.username.patchValue("wrongUserName");
        component.loginForm.controls.password.patchValue("wrongPassword");
        compiled.querySelector('.login-btn').click();
        fixture.detectChanges();
        expect(component.objResponse.success).toBe(false);
        expect(component.slide).toBe("expand");
    }));
});
/*
 * Note:  Here we cannot test the success login due to the full Page redirect  to the admin  page.
 * Hopefully will be able to solve this in next release with Angular 2 getting more stable
 * */
// export class Mock {
//
// }
var MockTFALoginService = (function (_super) {
    __extends(MockTFALoginService, _super);
    function MockTFALoginService() {
        _super.call(this, null);
        this.isValidLogin = function () {
            return Rx_1.Observable.of(false);
        };
        this.login = function (loginCred) {
            var objResponse = new login_model_1.LoginResponse();
            switch (loginCred.username) {
                case "wrongUserName":
                    objResponse.success = false;
                    objResponse.message = "associated message";
                    break;
                case "rightUserName":
                    objResponse.success = true;
                    objResponse.twoFactorAuthEnabled = true;
                    objResponse.userId = "loginUserId";
                    break;
            }
            return Rx_1.Observable.of(objResponse);
        };
        this.tfaVerification = function (userId, token) {
            var objResponse = new login_model_1.LoginResponse();
            switch (token.toString()) {
                case "123456":
                    objResponse.success = false;
                    objResponse.message = "TOTP Token not verified";
                    break;
            }
            return Rx_1.Observable.of(objResponse);
        };
    }
    return MockTFALoginService;
}(login_service_1.LoginService));
//
describe('Login with the TFA Enabled ', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [testing_2.RouterTestingModule, forms_1.ReactiveFormsModule, http_1.HttpModule],
            declarations: [login_component_1.LoginComponent],
            providers: [
                { provide: login_service_1.LoginService, useClass: MockTFALoginService }
            ]
        });
    });
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.compileComponents();
    }));
    it('should check the Validation if there is previously stored token and respond with not Valid Login', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        expect(component.isValidLogin).toBe(false);
    }));
    it('should show the LoginForm', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        expect(compiled.textContent).toContain('Nodebeats Login');
        var component = fixture.debugElement.componentInstance;
        expect(component.loginForm).toBeDefined();
        expect(component.tfaEnabled).toBe(false);
    }));
    it('should show the required message when trying to login with empty username /password field', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        compiled.querySelector('.login-btn').click();
        fixture.detectChanges();
        expect(compiled.querySelector('.error-msg').textContent).toContain('*');
    }));
    it('should show the invalid credential message when trying to login with wrong credential', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        var component = fixture.debugElement.componentInstance;
        component.loginForm.controls.username.patchValue("wrongUserName");
        component.loginForm.controls.password.patchValue("wrongPassword");
        compiled.querySelector('.login-btn').click();
        fixture.detectChanges();
        expect(component.loginForm.valid).toBe(true);
        expect(component.objResponse.success).toBe(false);
        expect(component.slide).toBe("expand");
    }));
    it('should show the TFA TOKEN entry filed when credential verified', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        var component = fixture.debugElement.componentInstance;
        component.loginForm.controls.username.patchValue("rightUserName");
        component.loginForm.controls.password.patchValue("rightPassword");
        compiled.querySelector('.login-btn').click();
        fixture.detectChanges();
        expect(component.tfaEnabled).toBe(true);
        expect(component.slide).toBe("collapse");
        expect(component.userId).toBe("loginUserId");
        expect(compiled.textContent).toContain("Nodebeats 2FA Login");
    }));
    it('should show the required message when submit with empty TFA TOKEN entry filed', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        var component = fixture.debugElement.componentInstance;
        component.tfaEnabled = true;
        fixture.detectChanges();
        expect(compiled.textContent).toContain("Nodebeats 2FA Login");
        expect(compiled.querySelector('.verify-btn')).not.toBeNull();
        compiled.querySelector('.verify-btn').click();
        fixture.detectChanges();
        expect(component.tfaForm.valid).toBe(false);
        expect(compiled.querySelector('.error-msg').textContent).toContain('*');
    }));
    it('should show the error message when submit with wrong TFA TOKEN entry filed', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        var component = fixture.debugElement.componentInstance;
        component.tfaEnabled = true;
        fixture.detectChanges();
        component.tfaForm.controls.token.patchValue("123456"); //wrong token
        compiled.querySelector('.verify-btn').click();
        fixture.detectChanges();
        expect(component.tfaForm.valid).toBe(true);
        expect(component.slide).toBe("expand");
    }));
});
var MockAlreadyLoggedInService = (function (_super) {
    __extends(MockAlreadyLoggedInService, _super);
    function MockAlreadyLoggedInService() {
        _super.call(this, null);
        this.isValidLogin = function () {
            return Rx_1.Observable.of(true);
        };
    }
    return MockAlreadyLoggedInService;
}(login_service_1.LoginService));
describe("Verify Already Login", function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [testing_2.RouterTestingModule, forms_1.ReactiveFormsModule, http_1.HttpModule],
            declarations: [login_component_1.LoginComponent],
            providers: [
                { provide: login_service_1.LoginService, useClass: MockAlreadyLoggedInService }
            ]
        });
    });
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.compileComponents();
    }));
    it('should verify the already Valid Login', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
        var component = fixture.debugElement.componentInstance;
        general_config_1.Config.getAuthToken = jasmine.createSpy('getItem() spy').and.returnValue("token");
        component.ngOnInit();
        //    fixture.detectChanges();
        expect(component.isValidLogin).toBe(true);
    }));
});
//# sourceMappingURL=login.test.js.map