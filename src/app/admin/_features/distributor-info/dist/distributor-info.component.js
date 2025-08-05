"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DistributorInfoComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var qr_code_generator_component_1 = require("src/app/_core/cellrenders/qr-code-generator/qr-code-generator.component");
var edit_distributor_component_1 = require("src/app/_core/popups/edit-distributor/edit-distributor.component");
var DistributorInfoComponent = /** @class */ (function () {
    function DistributorInfoComponent(clientService, exportService, observer, matDialog, fb, authService, tokenStorage, router, alertToaster) {
        var _this = this;
        this.clientService = clientService;
        this.exportService = exportService;
        this.observer = observer;
        this.matDialog = matDialog;
        this.fb = fb;
        this.authService = authService;
        this.tokenStorage = tokenStorage;
        this.router = router;
        this.alertToaster = alertToaster;
        this.isMoblie = false;
        this.maxDate = new Date();
        this.fromdate = "null";
        this.todate = 'null';
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
                width: 180,
                floatingFilter: true
            },
            pagination: true
        };
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', pinned: "left", cellClass: 'locked-col', width: 100 },
            {
                headerName: 'Edit', minWidth: 80,
                cellRenderer: function (params) {
                    var editButton = document.createElement('button');
                    editButton.innerHTML = '<i class="fa fa-edit"></i>';
                    editButton.style.backgroundColor = 'transparent';
                    editButton.style.color = 'blue';
                    editButton.style.border = 'none';
                    editButton.style.cursor = 'pointer';
                    editButton.style.fontSize = "24px";
                    editButton.addEventListener('click', function () {
                        var rowData = params.data;
                        _this.matDialog.open(edit_distributor_component_1.EditDistributorComponent, {
                            data: rowData
                        });
                    });
                    return editButton;
                }
            },
            {
                headerName: 'Name', field: 'distributor', pinned: "left",
                onCellClicked: function (event) {
                    _this.cellClickedEvent(event);
                }
            },
            { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
            { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },
            { headerName: 'Distributor Code', field: 'distributorcode', cellStyle: { "text-transform": "none" } },
            {
                headerName: 'QR Code', field: '', cellRenderer: qr_code_generator_component_1.QrCodeGeneratorComponent
            },
            {
                headerName: 'Country', field: 'country',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.country) === null || _b === void 0 ? void 0 : _b.countryname;
                }
            },
            {
                headerName: 'State', field: 'state', minWidth: 250,
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.statename;
                }
            },
            {
                headerName: 'District', field: 'district', minWidth: 250,
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.district) === null || _b === void 0 ? void 0 : _b.name;
                }
            },
            {
                headerName: 'City', field: 'city',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.city) === null || _b === void 0 ? void 0 : _b.cityname;
                }
            },
            {
                headerName: 'Location', field: 'location',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.area;
                }
            },
            // { headerName: 'Postal', field: 'zipcode' },
            { headerName: 'Mobile', field: 'phone' },
            { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updatedate', field: 'updatedate' },
            { headerName: 'IsActiveStatus', field: 'isactive' }
        ];
        // Filter========================
        this.variables = ['One', 'Two', 'County', 'Three', 'Zebra', 'XiOn'];
        this.filteredList1 = this.variables.slice();
        this.selectedState = { id: 0 };
        this.selectedDistrict = { id: 0 };
        this.selectedCity = { id: 0 };
        this.selectedLocation = { id: 0 };
        this.stateList = [];
        this.filteredStateList = this.stateList.slice();
        this.districtList = [];
        this.filteredDistrictList = this.districtList.slice();
        this.cityList = [];
        this.filteredCityList = this.cityList.slice();
        this.versionList = [];
        this.filteredVersionList = this.versionList.slice();
        this.locationList = [];
        this.filteredLocationList = this.locationList.slice();
    }
    DistributorInfoComponent.prototype.ispinned = function (s) {
        if (s) {
            return null;
        }
        else {
            return "left";
        }
    };
    DistributorInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getAllDistibutor();
        this.getStateForDistributor();
        this.observer.observe(['(max-width: 768px)']).subscribe(function (res) {
            var sidebar = document.querySelector(".sidebar");
            if (res.matches) {
                _this.isMoblie = true;
            }
            else {
                _this.isMoblie = false;
            }
        });
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', width: 100 },
            {
                headerName: 'Edit', minWidth: 80,
                cellRenderer: function (params) {
                    var editButton = document.createElement('button');
                    editButton.innerHTML = '<i class="fa fa-edit"></i>';
                    editButton.style.backgroundColor = 'transparent';
                    editButton.style.color = 'blue';
                    editButton.style.border = 'none';
                    editButton.style.cursor = 'pointer';
                    editButton.style.fontSize = "24px";
                    editButton.addEventListener('click', function () {
                        var rowData = params.data;
                        _this.matDialog.open(edit_distributor_component_1.EditDistributorComponent, {
                            data: rowData
                        });
                    });
                    return editButton;
                }
            },
            {
                headerName: 'Name', field: 'distributor', pinned: this.ispinned(this.isMoblie),
                onCellClicked: function (event) {
                    _this.cellClickedEvent(event);
                }
            },
            { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
            { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },
            { headerName: 'Distributor Code', field: 'distributorcode', cellStyle: { "text-transform": "none" } },
            {
                headerName: 'QR Code', field: '', cellRenderer: qr_code_generator_component_1.QrCodeGeneratorComponent
            },
            {
                headerName: 'Country', field: 'country',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.country) === null || _b === void 0 ? void 0 : _b.countryname;
                }
            },
            {
                headerName: 'State', field: 'state', minWidth: 250,
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.statename;
                }
            },
            {
                headerName: 'District', field: 'district', minWidth: 250,
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.district) === null || _b === void 0 ? void 0 : _b.name;
                }
            },
            {
                headerName: 'City', field: 'city',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.city) === null || _b === void 0 ? void 0 : _b.cityname;
                }
            },
            {
                headerName: 'Location', field: 'location',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.area;
                }
            },
            // { headerName: 'Postal', field: 'zipcode' },
            { headerName: 'Mobile', field: 'phone' },
            { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updatedate', field: 'updatedate' },
            { headerName: 'IsActiveStatus', field: 'isactive' }
        ];
    };
    DistributorInfoComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.clientService.getDistibutor().subscribe(function (data) {
            _this.gridApi.setRowData(data);
        });
    };
    DistributorInfoComponent.prototype.cellClickedEvent = function (client) {
        var _this = this;
        // console.log(client.data);
        // console.log("cellClickedEvent");
        this.signInForm = this.fb.group({
            username: [client.data.username, forms_1.Validators.required],
            password: [client.data.password, forms_1.Validators.required]
        });
        this.authService.login(this.signInForm.value).subscribe(function (res) {
            // console.log(res);
            _this.tokenStorage.saveDistributor(res);
            var user = _this.tokenStorage.getDistributor();
            var roles = user.roles;
            // console.log(roles);
            var isDistrubutor = roles.includes('ROLE_DISTRIBUTOR');
            // console.log(isClient);
            if (isDistrubutor) {
                _this.router.navigate(['distributor/distributor-dashboard']).then(function () {
                    window.location.reload();
                });
            }
            else {
                alert("Invalid User");
            }
        }, function (err) {
            // console.log(err);
            _this.alertToaster.showError(err.error.message);
        });
    };
    DistributorInfoComponent.prototype.getAllDistibutor = function () {
        var _this = this;
        this.clientService.getDistibutor().subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
    };
    DistributorInfoComponent.prototype.exportPdf = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var filterList = {
            // distributor: this.selectedDistributor?.distributor,
            state: (_a = this.selectedState) === null || _a === void 0 ? void 0 : _a.statename,
            district: (_b = this.selectedDistrict) === null || _b === void 0 ? void 0 : _b.name,
            city: (_c = this.selectedCity) === null || _c === void 0 ? void 0 : _c.cityname,
            location: (_d = this.selectedLocation) === null || _d === void 0 ? void 0 : _d.area,
            // isactive: this.selectedActive?.value,
            // plan: this.selectedVersion?.version,
            fromdate: this.fromdate,
            todate: this.todate
        };
        var title = 'Distributor Information';
        var dataFields = [
            'distributor',
            'username',
            'password',
            'code',
            "phone",
            'email',
            'state',
            'district',
            'city',
            "location",
            'creationdate',
            'updatedate'
        ];
        var field = [];
        for (var _i = 0, dataFields_1 = dataFields; _i < dataFields_1.length; _i++) {
            var e = dataFields_1[_i];
            if (e === "state") {
                if (this.selectedState.id != 0) {
                    continue;
                }
            }
            if (e === "district") {
                if (this.selectedDistrict.id != 0) {
                    continue;
                }
            }
            if (e === "city") {
                if (this.selectedCity.id != 0) {
                    continue;
                }
            }
            if (e === "location") {
                if (this.selectedLocation.id != 0) {
                    continue;
                }
            }
            field.push(e);
        }
        var data1 = [];
        for (var _j = 0, _k = this.rowData; _j < _k.length; _j++) {
            var obj = _k[_j];
            // console.log(obj);
            var g = {
                'distributor': obj === null || obj === void 0 ? void 0 : obj.distributor,
                'username': obj === null || obj === void 0 ? void 0 : obj.username,
                'password': obj === null || obj === void 0 ? void 0 : obj.password,
                'code': obj === null || obj === void 0 ? void 0 : obj.distributorcode,
                "phone": obj === null || obj === void 0 ? void 0 : obj.phone,
                'email': obj === null || obj === void 0 ? void 0 : obj.email,
                // 'country': obj?.country?.countryname,
                'state': (_e = obj === null || obj === void 0 ? void 0 : obj.state) === null || _e === void 0 ? void 0 : _e.statename,
                'district': (_f = obj === null || obj === void 0 ? void 0 : obj.district) === null || _f === void 0 ? void 0 : _f.name,
                'city': (_g = obj === null || obj === void 0 ? void 0 : obj.city) === null || _g === void 0 ? void 0 : _g.cityname,
                "location": (_h = obj === null || obj === void 0 ? void 0 : obj.location) === null || _h === void 0 ? void 0 : _h.area,
                'zipcode': obj === null || obj === void 0 ? void 0 : obj.zipcode,
                "status": obj === null || obj === void 0 ? void 0 : obj.isactive,
                'creationdate': obj === null || obj === void 0 ? void 0 : obj.creationdate,
                'updatedate': obj === null || obj === void 0 ? void 0 : obj.updatedate
            };
            data1.push(g);
        }
        var column_width = ['5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%'];
        var data = {
            action: "download",
            fdate: this.fromdate,
            tdate: this.todate,
            column_width: column_width,
            history: data1,
            reportname: title,
            columns: field,
            columnsdataFields: field,
            filterList: filterList
        };
        this.exportService.generateDestributorPDF(data);
    };
    DistributorInfoComponent.prototype.exportAsExcelFile = function () {
    };
    DistributorInfoComponent.prototype.getStateForDistributor = function () {
        var _this = this;
        this.clientService.getStateForDistributor().subscribe(function (res) {
            _this.stateList = res;
            _this.filteredStateList = res;
        });
        this.filterDistributorList();
    };
    DistributorInfoComponent.prototype.getDistrictbyStateForDistributor = function (state) {
        var _this = this;
        this.selectedState = state;
        this.clientService.getDistrictbyStateForDistributor(state === null || state === void 0 ? void 0 : state.id).subscribe(function (res) {
            _this.districtList = res;
            _this.filteredDistrictList = res;
        });
        this.filterDistributorList();
    };
    DistributorInfoComponent.prototype.getCitybyDistrictForDistibutor = function (district) {
        var _this = this;
        this.selectedDistrict = district;
        this.clientService.getCitybyDistrictForDistibutor(district === null || district === void 0 ? void 0 : district.id).subscribe(function (res) {
            _this.cityList = res;
            _this.filteredCityList = res;
        });
        this.filterDistributorList();
    };
    DistributorInfoComponent.prototype.getLocationbyCityForDistibutor = function (city) {
        var _this = this;
        var _a;
        this.selectedCity = city;
        this.clientService.getLocationbyCityForDistibutor((_a = this.selectedCity) === null || _a === void 0 ? void 0 : _a.id).subscribe(function (res) {
            _this.locationList = res;
            _this.filteredLocationList = res;
        });
        this.filterDistributorList();
    };
    DistributorInfoComponent.prototype.getLocation = function (location) {
        this.selectedLocation = location;
        this.filterDistributorList();
    };
    DistributorInfoComponent.prototype.getFromDate = function (event) {
        // console.log(event.value);
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.fromdate = year + "-" + month + "-" + date;
    };
    DistributorInfoComponent.prototype.getToDate = function (event) {
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.todate = year + "-" + month + "-" + date;
        console.log(this.fromdate + "---" + this.todate);
        this.filterDistributorList();
    };
    DistributorInfoComponent.prototype.filterDistributorList = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var payload = {
            stateid: (_a = this.selectedState) === null || _a === void 0 ? void 0 : _a.id,
            districtid: (_b = this.selectedDistrict) === null || _b === void 0 ? void 0 : _b.id,
            cityid: (_c = this.selectedCity) === null || _c === void 0 ? void 0 : _c.id,
            locationid: (_d = this.selectedLocation) === null || _d === void 0 ? void 0 : _d.id,
            fromdate: this.fromdate,
            todate: this.todate
        };
        this.clientService.getAllDistributorList(payload).subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
    };
    DistributorInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-distributor-info',
            templateUrl: './distributor-info.component.html',
            styleUrls: ['./distributor-info.component.scss']
        })
    ], DistributorInfoComponent);
    return DistributorInfoComponent;
}());
exports.DistributorInfoComponent = DistributorInfoComponent;
