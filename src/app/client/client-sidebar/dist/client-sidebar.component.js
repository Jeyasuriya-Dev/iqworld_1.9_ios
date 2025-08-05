"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientSidebarComponent = void 0;
var core_1 = require("@angular/core");
var ClientSidebarComponent = /** @class */ (function () {
    function ClientSidebarComponent(authService, observer, tokenStorage, router, clientService) {
        this.authService = authService;
        this.observer = observer;
        this.tokenStorage = tokenStorage;
        this.router = router;
        this.clientService = clientService;
        this.isDark = false;
        this.isMoblie = false;
        this.notilist = [];
        this.isOpened = true;
        this.isAdmin = false;
        this.isDistributor = false;
        this.isPro = false;
        this.isBasic = false;
        this.isSearch = false;
        this.badgeCount = 5;
    }
    ClientSidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        var currentuser = this.tokenStorage.getClientUsername();
        // console.log(currentuser);
        this.clientService.getClientByUsername(currentuser).subscribe(function (res) {
            console.log(res);
            _this.client = res;
            _this.clientname = res.clientname;
            _this.clientid = res.id;
            _this.clientcode = res.clientcode;
            _this.distributor = res.distributor;
            _this.planName = res.versionMaster.version;
            if (_this.planName == "PRO") {
                _this.isPro = true;
            }
            else {
                _this.isPro = false;
            }
            if (_this.planName == "BASIC") {
                _this.isBasic = true;
                // this.router.navigate(['/client/screen']);
            }
            else {
                _this.isBasic = false;
            }
        });
        this.clientService.getNotificationForOtaUpgrade(currentuser).subscribe(function (res) {
            _this.notilist = res;
        });
        this.roles = this.tokenStorage.getUser().roles;
        var user = this.tokenStorage.getUser();
        var distributor = this.tokenStorage.getDistributor();
        // console.log(distributor);
        this.roles = user.roles;
        this.isAdmin = this.roles.includes('ROLE_ADMIN');
        this.isDistributor = this.roles.includes('ROLE_DISTRIBUTOR');
        if (distributor || (distributor === null || distributor === void 0 ? void 0 : distributor.roles[0]) == "ROLE_DISTRIBUTOR") {
            this.isDistributor = true;
        }
        this.observer.observe(['(max-width: 768px)']).subscribe(function (res) {
            var sidebar = document.querySelector(".sidebar");
            if (res.matches) {
                _this.isMoblie = true;
                sidebar.classList.add("close");
            }
            else {
                _this.isMoblie = false;
                sidebar.classList.remove("close");
            }
        });
        var submenuItems = document.querySelectorAll(".submenu_item");
        submenuItems.forEach(function (item, index) {
            item.addEventListener("click", function () {
                item.classList.toggle("show_submenu");
                submenuItems.forEach(function (item2, index2) {
                    if (index !== index2) {
                        item2.classList.remove("show_submenu");
                    }
                });
            });
        });
        console.log(this.isAdmin);
        console.log(this.isDistributor);
        console.log(distributor);
    };
    ClientSidebarComponent.prototype.returnToAdmin = function () {
        this.router.navigate(['admin/client-list']).then(function () {
            sessionStorage.removeItem("auth-distributor");
            sessionStorage.removeItem("auth-client");
            window.location.reload();
        });
    };
    ClientSidebarComponent.prototype.returnToDistributor = function () {
        this.router.navigate(['distributor/distributor-customer-list']).then(function () {
            sessionStorage.removeItem("auth-client");
            window.location.reload();
        });
    };
    ClientSidebarComponent.prototype.openSidebar = function () {
        var sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("close");
        this.isOpened = true;
    };
    ClientSidebarComponent.prototype.closeSidebar = function () {
        var sidebar = document.querySelector(".sidebar");
        sidebar.classList.add("close", "hoverable");
        this.isOpened = false;
    };
    ClientSidebarComponent.prototype.expandSidebar = function () {
        var sidebar = document.querySelector(".sidebar");
        sidebar.classList.remove("close", "hoverable");
        this.isOpened = true;
    };
    ClientSidebarComponent.prototype.mouseLeave = function () {
        var sidebar = document.querySelector(".sidebar");
        if (sidebar.classList.contains("hoverable")) {
            // sidebar!.classList.add("close");
            // this.isOpened = false;
        }
    };
    ClientSidebarComponent.prototype.signOut = function () {
        this.authService.signOut();
        window.sessionStorage.clear();
        this.router.navigate(['/login']);
    };
    ClientSidebarComponent.prototype.showProfile = function () {
        var profile = document.querySelector(".profile-hover");
        if (profile.style.display == "none") {
            profile.style.display = "block";
        }
        else {
            profile.style.display = "none";
        }
    };
    ClientSidebarComponent.prototype.mouseEnter = function () {
        var sidebar = document.querySelector(".sidebar");
        if (sidebar.classList.contains("hoverable")) {
            // sidebar!.classList.remove("close");
            // this.isOpened = true;
        }
    };
    ClientSidebarComponent.prototype.changeMode = function () {
        var body = document.querySelector("body");
        body.classList.toggle("dark");
        var darkLight = document.querySelector("#darkLight");
        sessionStorage.setItem("isDark", "true");
        if (sessionStorage.getItem("isDark") == "true") {
            if (body.classList.contains("dark")) {
                // document.setI;
                darkLight.classList.replace("bx-sun", "bx-moon");
            }
            else {
                darkLight.classList.replace("bx-moon", "bx-sun");
            }
        }
    };
    ClientSidebarComponent.prototype.menuItem = function () {
        var submenuItems = document.querySelectorAll(".submenu_item");
    };
    ClientSidebarComponent.prototype.onClickItem = function () {
    };
    ClientSidebarComponent.prototype.navgetToUrl = function (id) {
        this.router.navigateByUrl("client/" + id);
        // this.closeSidebar()
        if (this.isMoblie) {
            this.closeSidebar();
        }
    };
    ClientSidebarComponent.prototype.search = function () {
        var searchBox = document.getElementById('searchBox');
        var googleIcon = document.getElementById('googleIcon');
        searchBox === null || searchBox === void 0 ? void 0 : searchBox.classList.toggle('active');
        if (searchBox === null || searchBox === void 0 ? void 0 : searchBox.classList.contains("active")) {
            this.isSearch = true;
        }
        else {
            this.isSearch = false;
        }
    };
    ClientSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-client-sidebar',
            templateUrl: './client-sidebar.component.html',
            styleUrls: ['./client-sidebar.component.scss']
        })
    ], ClientSidebarComponent);
    return ClientSidebarComponent;
}());
exports.ClientSidebarComponent = ClientSidebarComponent;
