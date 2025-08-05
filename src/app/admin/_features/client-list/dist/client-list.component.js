"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientListComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var edit_customer_component_1 = require("src/app/_core/popups/edit-customer/edit-customer.component");
var ClientListComponent = /** @class */ (function () {
    function ClientListComponent(matDialog, exportService, observer, clientService, alertToaster, router, fb, authService, tokenStorage) {
        var _this = this;
        this.matDialog = matDialog;
        this.exportService = exportService;
        this.observer = observer;
        this.clientService = clientService;
        this.alertToaster = alertToaster;
        this.router = router;
        this.fb = fb;
        this.authService = authService;
        this.tokenStorage = tokenStorage;
        this.isDistributor = false;
        this.maxDate = new Date();
        this.fromdate = "null";
        this.todate = "null";
        this.isMoblie = false;
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
                minWidth: 180,
                floatingFilter: true
            },
            pagination: true,
            autoHeight: true,
            onGridReady: function (event) { return event.api.sizeColumnsToFit(); }
        };
        this.rowData = [];
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, cellClass: 'locked-col', minWidth: 80 },
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
                        _this.matDialog.open(edit_customer_component_1.EditCustomerComponent, {
                            data: rowData
                        });
                    });
                    return editButton;
                }
            },
            {
                headerName: 'Name', field: 'clientname', pinned: 'left', width: 190,
                onCellClicked: function (event) {
                    _this.cellClickedEvent(event);
                }
            },
            { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
            { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },
            {
                headerName: 'plan', field: 'area',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.versionMaster) === null || _b === void 0 ? void 0 : _b.version;
                },
                cellStyle: function (params) {
                    var _a, _b, _c, _d;
                    if (((_b = (_a = params.data) === null || _a === void 0 ? void 0 : _a.versionMaster) === null || _b === void 0 ? void 0 : _b.version) == "BASIC") {
                        return { color: '#8ac926' };
                    }
                    else if (((_d = (_c = params.data) === null || _c === void 0 ? void 0 : _c.versionMaster) === null || _d === void 0 ? void 0 : _d.version) == "LITE") {
                        return { color: '#e83f6f' };
                    }
                    else {
                        return { color: '#2274a5' };
                    }
                }
            },
            // { headerName: 'Status', field: 'isactive', cellRenderer: CostumerActivateBtnComponent },
            {
                headerName: 'Status', field: 'isactive',
                valueGetter: function (params) {
                    var _a;
                    console.log(params.data);
                    if ((_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a.isactive) {
                        return "approved";
                    }
                    else {
                        return "pending";
                    }
                }, cellStyle: function (params) {
                    if (params.data.isactive) {
                        return { color: '#378ced' };
                    }
                    else {
                        return { color: '#eb9834' };
                    }
                    return null;
                }
            },
            { headerName: 'Client Code', field: 'clientcode', cellStyle: { "text-transform": "none" } },
            { headerName: 'Company Profile', field: 'company' },
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
            { headerName: 'Mobile', field: 'phone' },
            { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updatedate', field: 'updatedate' },
            { headerName: 'Creationby', field: 'creationby' }
        ];
        // filter==========
        this.selectedDistributor = { id: 0 };
        this.selectedActive = { id: "null", name: 'unknown', value: 'unknown' };
        this.selectedState = { id: 0 };
        this.selectedDistrict = { id: 0 };
        this.selectedCity = { id: 0 };
        this.selectedLocation = { id: 0 };
        this.selectedVersion = { id: 0 };
        this.variables = ['One', 'Two', 'County', 'Three', 'Zebra', 'XiOn'];
        this.filteredList1 = this.variables.slice();
        this.activeList = [{ id: "null", name: 'none' }, { id: 1, name: 'active', value: true }, { id: 0, name: 'inactive', value: false }];
        this.filteredActiveList = this.activeList.slice();
        this.distributorList = [];
        this.filteredDistributorList = this.distributorList.slice();
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
    ClientListComponent.prototype.cellClickedEvent = function (client) {
        var _this = this;
        // console.log(client.data);
        // console.log("cellClickedEvent");
        this.signInForm = this.fb.group({
            username: [client.data.username, forms_1.Validators.required],
            password: [client.data.password, forms_1.Validators.required]
        });
        // console.log(this.signInForm.value);
        this.authService.login(this.signInForm.value).subscribe(function (res) {
            // console.log(res);
            _this.tokenStorage.saveClient(res);
            var user = _this.tokenStorage.getClient();
            var roles = user.roles;
            // console.log(roles);
            var isClient = roles.includes('ROLE_CLIENT');
            // console.log(isClient);
            if (isClient) {
                _this.clientService.getClientByUsername(user.username).subscribe(function (res) {
                    console.log(res);
                    if (res.versionMaster.version == "BASIC") {
                        _this.router.navigate(['client/screen']).then(function () {
                            window.location.reload();
                        });
                    }
                    else {
                        _this.router.navigate(['client/client-dashboard']).then(function () {
                            window.location.reload();
                        });
                    }
                });
                // this.router.navigate(['client/client-dashboard']).then(() => {
                //   window.location.reload();
                // });
            }
            else {
                alert("Invalid User");
            }
        }, function (err) {
            _this.alertToaster.showError("Costumer Not Activated");
        });
    };
    ClientListComponent.prototype.ispinned = function (s) {
        console.log("ismo" + s);
        if (s) {
            return null;
        }
        else {
            return "left";
        }
    };
    ClientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        var _a, _b;
        this.clientService.getStateListByDistributorid((_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.id).subscribe(function (res) {
            _this.stateList = res;
            _this.filteredStateList = res;
        });
        this.getCustomerVersion();
        if (this.tokenStorage.getUserRole() == "DISTRIBUTOR" || ((_b = this.tokenStorage.getDistributor()) === null || _b === void 0 ? void 0 : _b.roles)) {
            this.isDistributor = true;
        }
        else {
            this.isDistributor = false;
        }
        console.log(this.isDistributor);
        this.getAllClientList();
        this.getDistibutorList();
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
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', minWidth: 80 },
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
                        _this.matDialog.open(edit_customer_component_1.EditCustomerComponent, {
                            data: rowData
                        });
                    });
                    return editButton;
                }
            },
            {
                headerName: 'Name', field: 'clientname', pinned: this.ispinned(this.isMoblie), width: 190,
                onCellClicked: function (event) {
                    _this.cellClickedEvent(event);
                }
            },
            { headerName: 'Username', field: 'username', cellStyle: { "text-transform": "none" } },
            { headerName: 'Password', field: 'password', cellStyle: { "text-transform": "none" } },
            {
                headerName: 'plan', field: 'area',
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.versionMaster) === null || _b === void 0 ? void 0 : _b.version;
                },
                cellStyle: function (params) {
                    var _a, _b, _c, _d;
                    if (((_b = (_a = params.data) === null || _a === void 0 ? void 0 : _a.versionMaster) === null || _b === void 0 ? void 0 : _b.version) == "BASIC") {
                        return { color: '#8ac926' };
                    }
                    else if (((_d = (_c = params.data) === null || _c === void 0 ? void 0 : _c.versionMaster) === null || _d === void 0 ? void 0 : _d.version) == "LITE") {
                        return { color: '#e83f6f' };
                    }
                    else {
                        return { color: '#2274a5' };
                    }
                }
            },
            // { headerName: 'Status', field: 'isactive', cellRenderer: CostumerActivateBtnComponent },
            {
                headerName: 'Status', field: 'isactive',
                valueGetter: function (params) {
                    var _a;
                    console.log(params.data);
                    if ((_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a.isactive) {
                        return "approved";
                    }
                    else {
                        return "pending";
                    }
                }, cellStyle: function (params) {
                    if (params.data.isactive) {
                        return { color: '#378ced' };
                    }
                    else {
                        return { color: '#eb9834' };
                    }
                    return null;
                }
            },
            { headerName: 'Client Code', field: 'clientcode', cellStyle: { "text-transform": "none" } },
            { headerName: 'Company Profile', field: 'company' },
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
            { headerName: 'Mobile', field: 'phone' },
            { headerName: 'Email', field: 'email', cellStyle: { "text-transform": "none" } },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updatedate', field: 'updatedate' },
            { headerName: 'Creationby', field: 'creationby' }
        ];
    };
    ClientListComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
    };
    ClientListComponent.prototype.getAllClientList = function () {
        var _this = this;
        if (this.isDistributor) {
            var user = this.tokenStorage.getUser();
            if (user.roles[0] == "ROLE_DISTRIBUTOR") {
                this.clientService.getdistributorByUsername(user.username).subscribe(function (res) {
                    console.log(res);
                    _this.selectedDistributor = res;
                    _this.getStateListByDistributor(res);
                    _this.clientService.getClientListByDistributorId(res.id).subscribe(function (res) {
                        // console.log(res);
                        _this.rowData = res;
                        _this.gridApi.setRowData(res);
                    });
                });
            }
            else {
                var di = this.tokenStorage.getDistributor();
                this.clientService.getdistributorByUsername(di.username).subscribe(function (res) {
                    _this.selectedDistributor = res;
                    _this.getStateListByDistributor(res);
                    _this.clientService.getClientListByDistributorId(res.id).subscribe(function (res) {
                        // console.log(res);
                        _this.rowData = res;
                        _this.gridApi.setRowData(res);
                    });
                });
            }
            console.log(this.isDistributor);
        }
        else {
            this.clientService.getAllClientList().subscribe(function (res) {
                // console.log(res);
                _this.rowData = res;
                _this.gridApi.setRowData(res);
            });
        }
    };
    ClientListComponent.prototype.goClientPortal = function (client) {
        // console.log(client);
    };
    ClientListComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
    };
    ClientListComponent.prototype.onQuickFilter = function (id) {
        this.gridApi.setQuickFilter(id);
    };
    ClientListComponent.prototype.exportPdf = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        console.log(this.selectedActive);
        var filterList = {
            distributor: (_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.distributor,
            state: (_b = this.selectedState) === null || _b === void 0 ? void 0 : _b.statename,
            district: (_c = this.selectedDistrict) === null || _c === void 0 ? void 0 : _c.name,
            city: (_d = this.selectedCity) === null || _d === void 0 ? void 0 : _d.cityname,
            location: (_e = this.selectedLocation) === null || _e === void 0 ? void 0 : _e.area,
            isactive: (_f = this.selectedActive) === null || _f === void 0 ? void 0 : _f.value,
            plan: (_g = this.selectedVersion) === null || _g === void 0 ? void 0 : _g.version,
            fromdate: this.fromdate,
            todate: this.todate
        };
        var title = 'Customer Information';
        var dataFields = [
            'clientname',
            "company",
            'username',
            'password',
            'clientcode',
            "phone",
            'email',
            'plan',
            'distributor',
            'state',
            'district',
            'city',
            "location",
            'zipcode',
            "status",
            'creationdate',
            'updatedate'
        ];
        var field = [];
        for (var _i = 0, dataFields_1 = dataFields; _i < dataFields_1.length; _i++) {
            var e = dataFields_1[_i];
            if (e === "distributor") {
                if (this.selectedDistributor.id != 0) {
                    continue;
                }
            }
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
            if (e === "plan") {
                if (this.selectedVersion.id != 0) {
                    continue;
                }
            }
            if (e === "status") {
                if (this.selectedActive.id != "null") {
                    continue;
                }
            }
            field.push(e);
        }
        var data1 = [];
        for (var _m = 0, _o = this.rowData; _m < _o.length; _m++) {
            var obj = _o[_m];
            // console.log(obj);
            var g = {
                'clientname': obj === null || obj === void 0 ? void 0 : obj.clientname,
                "company": obj === null || obj === void 0 ? void 0 : obj.company,
                'username': obj === null || obj === void 0 ? void 0 : obj.username,
                'password': obj === null || obj === void 0 ? void 0 : obj.password,
                'clientcode': obj === null || obj === void 0 ? void 0 : obj.clientcode,
                "phone": obj === null || obj === void 0 ? void 0 : obj.phone,
                'email': obj === null || obj === void 0 ? void 0 : obj.email,
                'plan': obj === null || obj === void 0 ? void 0 : obj.plan,
                'distributor': obj === null || obj === void 0 ? void 0 : obj.distributor,
                // 'country': obj?.country?.countryname,
                'state': (_h = obj === null || obj === void 0 ? void 0 : obj.state) === null || _h === void 0 ? void 0 : _h.statename,
                'district': (_j = obj === null || obj === void 0 ? void 0 : obj.district) === null || _j === void 0 ? void 0 : _j.name,
                'city': (_k = obj === null || obj === void 0 ? void 0 : obj.city) === null || _k === void 0 ? void 0 : _k.cityname,
                "location": (_l = obj === null || obj === void 0 ? void 0 : obj.location) === null || _l === void 0 ? void 0 : _l.area,
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
        this.exportService.generateCustomerPDF(data);
    };
    ClientListComponent.prototype.exportAsExcelFile = function () {
    };
    ClientListComponent.prototype.getFromDate = function (event) {
        // console.log(event.value);
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.fromdate = year + "-" + month + "-" + date;
    };
    ClientListComponent.prototype.getToDate = function (event) {
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.todate = year + "-" + month + "-" + date;
        console.log(this.fromdate + "---" + this.todate);
        this.filterClientList();
    };
    ClientListComponent.prototype.getDistibutorList = function () {
        var _this = this;
        this.clientService.getDistibutor().subscribe(function (res) {
            // console.log(res);
            _this.distributorList = res;
            _this.filteredDistributorList = res;
        });
        this.filterClientList();
    };
    ClientListComponent.prototype.getStateListByDistributor = function (distributor) {
        var _this = this;
        var _a;
        this.selectedDistributor = distributor;
        this.clientService.getStateListByDistributorid((_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.id).subscribe(function (res) {
            _this.stateList = res;
            _this.filteredStateList = res;
        });
        this.filterClientList();
    };
    ClientListComponent.prototype.getDistrictListByStateAndDistributorid = function (state) {
        var _this = this;
        var _a;
        this.selectedState = state;
        this.clientService.getDistrictListByStateAndDistributorid((_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.id, state === null || state === void 0 ? void 0 : state.id).subscribe(function (res) {
            _this.districtList = res;
            _this.filteredDistrictList = res;
        });
        this.filterClientList();
    };
    ClientListComponent.prototype.getCityListByDistricteAndDistributorid = function (district) {
        var _this = this;
        var _a;
        this.selectedDistrict = district;
        this.clientService.getCityListByDistricteAndDistributorid((_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.id, district === null || district === void 0 ? void 0 : district.id).subscribe(function (res) {
            _this.cityList = res;
            _this.filteredCityList = res;
        });
        this.filterClientList();
    };
    ClientListComponent.prototype.getLocation = function (location) {
        this.selectedLocation = location;
        this.filterClientList();
    };
    ClientListComponent.prototype.getPlan = function (version) {
        this.selectedVersion = version;
        this.filterClientList();
    };
    ClientListComponent.prototype.getActive = function (active) {
        this.selectedActive = active;
        this.filterClientList();
    };
    ClientListComponent.prototype.getLocationListByCityAndDistributorid = function (city) {
        var _this = this;
        var _a;
        this.selectedCity = city;
        this.clientService.getLocationListByCityAndDistributorid((_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.id, city === null || city === void 0 ? void 0 : city.id).subscribe(function (res) {
            _this.locationList = res;
            _this.filteredLocationList = res;
        });
        this.filterClientList();
    };
    ClientListComponent.prototype.filterClientList = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var payload = {
            distributorid: (_a = this.selectedDistributor) === null || _a === void 0 ? void 0 : _a.id,
            stateid: (_b = this.selectedState) === null || _b === void 0 ? void 0 : _b.id,
            districtid: (_c = this.selectedDistrict) === null || _c === void 0 ? void 0 : _c.id,
            cityid: (_d = this.selectedCity) === null || _d === void 0 ? void 0 : _d.id,
            locationid: (_e = this.selectedLocation) === null || _e === void 0 ? void 0 : _e.id,
            planid: (_f = this.selectedVersion) === null || _f === void 0 ? void 0 : _f.id,
            fromdate: this.fromdate,
            todate: this.todate
        };
        this.clientService.filterClientList(payload).subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
    };
    ClientListComponent.prototype.getCustomerVersion = function () {
        var _this = this;
        this.clientService.getCustomerVersion().subscribe(function (res) {
            // console.log(res);
            _this.versionList = res;
            _this.filteredVersionList = res;
        });
    };
    ClientListComponent = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        core_1.Component({
            selector: 'app-client-list',
            templateUrl: './client-list.component.html',
            styleUrls: ['./client-list.component.scss']
        })
    ], ClientListComponent);
    return ClientListComponent;
}());
exports.ClientListComponent = ClientListComponent;
