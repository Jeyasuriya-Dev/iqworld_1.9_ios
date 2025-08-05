"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientDeviceInfoComponent = void 0;
var core_1 = require("@angular/core");
var edit_device_component_1 = require("src/app/_core/popups/edit-device/edit-device.component");
var sweetalert2_1 = require("sweetalert2");
var ClientDeviceInfoComponent = /** @class */ (function () {
    function ClientDeviceInfoComponent(renderer, exportService, excelService, observer, matDialog, clientService, storage, pdfService) {
        var _this = this;
        this.renderer = renderer;
        this.exportService = exportService;
        this.excelService = excelService;
        this.observer = observer;
        this.matDialog = matDialog;
        this.clientService = clientService;
        this.storage = storage;
        this.pdfService = pdfService;
        this.maxDate = new Date();
        this.isMoblie = false;
        this.modelnamelist = [];
        this.modellist = [];
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: 'left', cellClass: 'locked-col', width: 100 },
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
                        _this.matDialog.open(edit_device_component_1.EditDeviceComponent, {
                            data: rowData
                        });
                    });
                    return editButton;
                }
            },
            {
                headerName: 'Unique Number', field: 'username', pinned: 'left',
                cellStyle: function (params) {
                    if (params.data.isandroid) {
                        return { color: 'green' };
                        //mark police cells as red
                    }
                    else {
                        return { color: 'red' };
                    }
                }
            }, {
                headerName: 'Model-name',
                field: 'modelname',
                minWidth: 200,
                editable: true,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: this.modellist,
                    valueListMaxHeight: 50
                },
                onCellValueChanged: function (event) {
                    console.log(event);
                    _this.updateDeviceModelname(event.data.username, event.newValue);
                }
            }, {
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
            }, {
                headerName: 'Country', field: 'cityname',
                valueGetter: function (params) {
                    if (params.data.country) {
                        return params.data.country.countryname;
                    }
                    else {
                        return "No Country";
                    }
                }
            },
            {
                headerName: 'State', field: 'statename', width: 250,
                valueGetter: function (params) {
                    if (params.data.state) {
                        return params.data.state.statename;
                    }
                    else {
                        return "N/A";
                    }
                }
            }, {
                headerName: 'District', field: 'district', minWidth: 250,
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.district) === null || _b === void 0 ? void 0 : _b.name;
                }
            },
            {
                headerName: 'City', field: 'cityname',
                valueGetter: function (params) {
                    if (params.data.city) {
                        return params.data.city.cityname;
                    }
                    else {
                        return "N/A";
                    }
                }
            },
            {
                headerName: 'Location', field: 'cityname',
                valueGetter: function (params) {
                    var _a, _b;
                    if (params.data.location) {
                        return (_b = (_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.area;
                    }
                    else {
                        return "N/A";
                    }
                }
            },
            {
                headerName: 'Landmark', field: 'landmark',
                valueGetter: function (params) {
                    if (params.data.landmark) {
                        return params.data.landmark;
                    }
                    else {
                        return "N/A";
                    }
                }
            },
            {
                headerName: "Orientation", field: "height_width",
                valueGetter: function (params) {
                    // console.log(params.data.height_width);
                    var v = params.data.height_width;
                    v = v.substring(2);
                    // console.log(v);
                    if (params.data.height_width) {
                        if (v == 16) {
                            return 'Vertical';
                        }
                        else {
                            return 'Horizental';
                        }
                    }
                    else {
                        return "UnDefined";
                    }
                }
            },
            {
                headerName: 'Status', field: 'isonline',
                valueGetter: function (params) {
                    if (params.data.isonline) {
                        return 'Online';
                    }
                    else {
                        return "Offline";
                    }
                }, cellStyle: function (params) {
                    if (params.data.isonline) {
                        //mark police cells as red
                        return { color: 'green' };
                    }
                    else {
                        return { color: 'red' };
                    }
                }
            },
            // { headerName: 'Activity', field: 'isactive', cellRenderer: DeviceActivateBtnComponent },
            {
                headerName: 'Activity', field: 'isactive',
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
                }
            },
            {
                headerName: 'Apk', field: 'apk'
            },
            {
                headerName: 'Apk updated on', field: 'apkupdate'
            },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updationdate', field: 'updateddate' },
            { headerName: 'Log Out', field: 'isandroid', cellRenderer: this.CellRendererBtn.bind(this) }
        ];
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
        this.rowData = [];
        this.fromdate = "null";
        this.todate = "null";
        // filter========================
        this.selectDistributor = { id: 0, distributor: "" };
        this.selectedClient = { id: 0 };
        this.selectedState = { id: 0 };
        this.selectedDistrict = { id: 0 };
        this.selectedCity = { id: 0 };
        this.selectedLocation = { id: 0 };
        this.selectedVersion = { id: 0 };
        this.selectedOrientation = { id: 0 };
        this.selectedActive = { id: '2' };
        this.selectedIsonline = { id: '2', value: "null" };
        this.onlineList = [{ id: 1, name: 'online' }, { id: 0, name: 'offline' }];
        this.filteredOnlineList = this.onlineList.slice();
        this.orientationList = [{ id: 0, name: 'Vertical' }, { id: 1, name: 'Horizontal' }];
        this.filteredOrientationList = this.orientationList.slice();
        this.activeList = [{ id: 0, name: 'active' }, { id: 1, name: 'inactive' }];
        this.filteredActiveList = this.activeList.slice();
        this.distributorList = [];
        this.filteredDistributorList = this.distributorList.slice();
        this.clientList1 = [];
        this.filteredListClient = this.clientList1.slice();
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
    ClientDeviceInfoComponent.prototype.ispinned = function (s) {
        if (s) {
            return null;
        }
        else {
            return "left";
        }
    };
    ClientDeviceInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.observer.observe(['(max-width: 768px)']).subscribe(function (res) {
            if (res.matches) {
                _this.isMoblie = true;
            }
            else {
                _this.isMoblie = false;
            }
        });
        var username1 = this.storage.getUser();
        // console.log(username1);
        if (username1.roles[0] == 'ROLE_CLIENT') {
            this.clientname = this.storage.getUser();
        }
        else if (username1.roles[0] == 'ROLE_ADMIN') {
            this.clientname = sessionStorage.getItem('auth-client');
            this.clientname = JSON.parse(this.clientname);
        }
        else {
            this.clientname = sessionStorage.getItem('auth-client');
            this.clientname = JSON.parse(this.clientname);
        }
        this.getAllDeviceList();
        this.getAllDeviceModel();
        ;
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', width: 100 },
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
                        _this.matDialog.open(edit_device_component_1.EditDeviceComponent, {
                            data: rowData
                        });
                    });
                    return editButton;
                }
            },
            {
                headerName: 'Unique Number', field: 'username', pinned: this.ispinned(this.isMoblie),
                cellStyle: function (params) {
                    if (params.data.isandroid) {
                        return { color: 'green' };
                        //mark police cells as red
                    }
                    else {
                        return { color: 'red' };
                    }
                }
            }, {
                headerName: 'Model-name',
                field: 'modelname',
                minWidth: 200,
                editable: true,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: this.modellist,
                    valueListMaxHeight: 50
                },
                onCellValueChanged: function (event) {
                    console.log(event);
                    _this.updateDeviceModelname(event.data.username, event.newValue);
                }
            }, {
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
            }, {
                headerName: 'Country', field: 'cityname',
                valueGetter: function (params) {
                    if (params.data.country) {
                        return params.data.country.countryname;
                    }
                    else {
                        return "No Country";
                    }
                }
            },
            {
                headerName: 'State', field: 'statename', width: 250,
                valueGetter: function (params) {
                    if (params.data.state) {
                        return params.data.state.statename;
                    }
                    else {
                        return "N/A";
                    }
                }
            }, {
                headerName: 'District', field: 'district', minWidth: 250,
                valueGetter: function (e) {
                    var _a, _b;
                    return (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.district) === null || _b === void 0 ? void 0 : _b.name;
                }
            },
            {
                headerName: 'City', field: 'cityname',
                valueGetter: function (params) {
                    if (params.data.city) {
                        return params.data.city.cityname;
                    }
                    else {
                        return "N/A";
                    }
                }
            },
            {
                headerName: 'Location', field: 'cityname',
                valueGetter: function (params) {
                    var _a, _b;
                    if (params.data.location) {
                        return (_b = (_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.area;
                    }
                    else {
                        return "N/A";
                    }
                }
            },
            {
                headerName: 'Landmark', field: 'landmark',
                valueGetter: function (params) {
                    if (params.data.landmark) {
                        return params.data.landmark;
                    }
                    else {
                        return "N/A";
                    }
                }
            },
            {
                headerName: "Orientation", field: "height_width",
                valueGetter: function (params) {
                    // console.log(params.data.height_width);
                    var v = params.data.height_width;
                    v = v.substring(2);
                    // console.log(v);
                    if (params.data.height_width) {
                        if (v == 16) {
                            return 'Vertical';
                        }
                        else {
                            return 'Horizental';
                        }
                    }
                    else {
                        return "UnDefined";
                    }
                }
            },
            {
                headerName: 'Status', field: 'isonline',
                valueGetter: function (params) {
                    if (params.data.isonline) {
                        return 'Online';
                    }
                    else {
                        return "Offline";
                    }
                }, cellStyle: function (params) {
                    if (params.data.isonline) {
                        //mark police cells as red
                        return { color: 'green' };
                    }
                    else {
                        return { color: 'red' };
                    }
                }
            },
            // { headerName: 'Activity', field: 'isactive', cellRenderer: DeviceActivateBtnComponent },
            {
                headerName: 'Activity', field: 'isactive',
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
                }
            },
            {
                headerName: 'Apk', field: 'apk'
            },
            {
                headerName: 'Apk updated on', field: 'apkupdate'
            },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updationdate', field: 'updateddate' },
            { headerName: 'Log Out', field: 'isandroid', cellRenderer: this.CellRendererBtn.bind(this) }
        ];
    };
    ClientDeviceInfoComponent.prototype.getAllDeviceModel = function () {
        var _this = this;
        this.clientService.getAllDeviceModel().subscribe(function (res) {
            _this.modelnamelist = res;
            _this.modelnamelist.forEach(function (element) {
                // console.log(element);
                _this.modellist.push(element.modelname);
            });
            console.log(_this.modellist);
        });
    };
    ClientDeviceInfoComponent.prototype.CellRendererBtn = function (params) {
        var _this = this;
        var _a;
        var button = this.renderer.createElement('button');
        this.renderer.addClass(button, 'mat-raised-button');
        this.renderer.setStyle(button, 'background', 'transparent');
        this.renderer.setStyle(button, 'margin', '0px 15%');
        this.renderer.setStyle(button, 'width', '50%');
        this.renderer.setStyle(button, 'line-height', '1.8');
        this.renderer.setStyle(button, "padding", "0px 5px");
        // this.renderer.setStyle(button, 'font-weight', '600');
        if (!((_a = params.data) === null || _a === void 0 ? void 0 : _a.isandroid)) {
            this.renderer.setStyle(button, 'color', 'RED');
            this.renderer.setStyle(button, 'border', '1px RED solid');
            this.renderer.setProperty(button, 'innerText', 'N/A');
            this.renderer.setAttribute(button, "disabled", "true");
        }
        else {
            this.renderer.setStyle(button, 'color', 'green');
            this.renderer.setStyle(button, 'border', '1px green solid');
            this.renderer.setProperty(button, 'innerText', 'Log out');
        }
        this.renderer.listen(button, 'click', function () {
            var _a;
            _this.logOutDevice((_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a.username);
        });
        var div = this.renderer.createElement('div');
        this.renderer.appendChild(div, button);
        return div;
    };
    ClientDeviceInfoComponent.prototype.logOutDevice = function (data) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log out it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.clientService.logOutDevice(data).subscribe(function (res) {
                    // console.log(res);
                    sweetalert2_1["default"].fire({
                        title: "logged Out!",
                        text: res === null || res === void 0 ? void 0 : res.message,
                        icon: "success"
                    });
                    _this.ngOnInit();
                }, function (err) {
                    var _a;
                    sweetalert2_1["default"].fire({
                        title: "Oops!",
                        text: (_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.message,
                        icon: "error"
                    });
                });
            }
            else if (
            /* Read more about handling dismissals below */
            result.dismiss === sweetalert2_1["default"].DismissReason.cancel) {
                sweetalert2_1["default"].fire({
                    title: "Cancelled",
                    text: "Your Device is safe :)",
                    icon: "error"
                });
            }
        });
    };
    ClientDeviceInfoComponent.prototype.updateDeviceModelname = function (deviceno, modelname) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: "Are you sure?",
            text: "You want to change the model name!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.clientService.updateDeviceModelname(deviceno, modelname).subscribe(function (res) {
                    console.log(res);
                    sweetalert2_1["default"].fire({
                        title: "Changed!",
                        text: res.message,
                        icon: "success"
                    });
                });
            }
        });
    };
    ClientDeviceInfoComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.clientService.getdeviceListbyclientusername(this.clientname.username).subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
            _this.gridApi.setRowData(res);
        });
    };
    ClientDeviceInfoComponent.prototype.getAllDeviceList = function () {
        var _this = this;
        this.clientService.getClientByUsername(this.clientname.username).subscribe(function (res) {
            _this.selectDistributor.distributor = res === null || res === void 0 ? void 0 : res.distributor;
            _this.getStatelistByClient(res);
        });
        this.clientService.getdeviceListbyclientusername(this.clientname.username).subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
        this.getCustomerVersion();
    };
    ClientDeviceInfoComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
    };
    ClientDeviceInfoComponent.prototype.exportAsExcelFile = function () {
        var title = capitalize(this.clientname.username) + ' Device Details';
        var data = [];
        for (var _i = 0, _a = this.rowData; _i < _a.length; _i++) {
            var obj = _a[_i];
            // console.log(obj);
            var g = {
                "Unique Number": obj.username,
                "State": state(obj.state),
                "City": city(obj.city),
                "Location": getSomething(obj.location),
                "Landmark": getSomething(obj.landmark),
                "Orientation": getOrientation(obj.height_width),
                "Status": formatOnline(obj.isonline),
                // 'Active ': obj.isactive,
                "Creationdate": obj.creationdate,
                "Updateddate": obj.updateddate
            };
            data.push(g);
        }
        var cellSize = { a: "25", b: "35", c: "15", d: "15", e: "15", f: "15", g: "10", h: "25", i: "25" };
        var titleMerge = "'B1':'H4'";
        var imgMerge = "'A1':'A4'";
        var dateMerge = "'I1':'I4'";
        var reportData = {
            title: title,
            data: data,
            headers: Object.keys(data[0]),
            cellSize: cellSize,
            titleMerge: titleMerge,
            imgMerge: imgMerge,
            dateMerge: dateMerge
        };
        this.excelService.exportExcel(reportData);
        // this.excelService.exportAsExcelFile(data,title);
    };
    ClientDeviceInfoComponent.prototype.exportPdf1 = function () {
        // console.log(this.rowData);
        var title = capitalize(this.clientname.username) + ' Device Details';
        var Fields = [
            'Unique Number',
            'State',
            'City',
            "Location",
            'Landmark',
            "Orientation",
            "Status",
            // "Active",
            'Creation Date',
            'Updation Date'
        ];
        var dataFields = [
            'username',
            'state',
            'city',
            'location',
            "landmark",
            "height_width",
            "isonline",
            // "isactive",
            'creationdate',
            'updateddate'
        ];
        var data = [];
        for (var _i = 0, _a = this.rowData; _i < _a.length; _i++) {
            var obj = _a[_i];
            // console.log(obj);
            var g = {
                "id": obj.id,
                "username": obj.username,
                "state": state(obj.state),
                "city": city(obj.city),
                "location": getSomething(obj.location),
                "landmark": getSomething(obj.landmark),
                "height_width": getOrientation(obj.height_width),
                "creationdate": obj.creationdate,
                "updateddate": obj.updateddate,
                // "isactive": obj.isactive,
                "isonline": formatOnline(obj.isonline)
            };
            data.push(g);
        }
        var column_width = ['13%', '15%', '11%', '11%', '11%', '8%', '5%', '13%', '13%'];
        this.fdate = this.fromdate;
        this.tdate = this.todate;
        if (this.fdate === undefined && this.tdate === undefined) {
            this.fdate = 'NA';
            this.tdate = 'NA';
        }
        this.pdfService.generatePDFSP('download', data, title, Fields, dataFields, column_width, this.fdate, this.tdate);
        // this.pdfService.generatePdf();
    };
    ClientDeviceInfoComponent.prototype.exportPdf = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        console.log(this.selectedActive);
        var filterList = {
            distributor: (_a = this.selectDistributor) === null || _a === void 0 ? void 0 : _a.distributor,
            state: (_b = this.selectedState) === null || _b === void 0 ? void 0 : _b.statename,
            district: (_c = this.selectedDistrict) === null || _c === void 0 ? void 0 : _c.name,
            city: (_d = this.selectedCity) === null || _d === void 0 ? void 0 : _d.cityname,
            location: (_e = this.selectedLocation) === null || _e === void 0 ? void 0 : _e.area,
            isactive: (_f = this.selectedActive) === null || _f === void 0 ? void 0 : _f.name,
            isonline: (_g = this.selectedIsonline) === null || _g === void 0 ? void 0 : _g.name,
            orientation: (_h = this.selectedOrientation) === null || _h === void 0 ? void 0 : _h.name,
            plan: (_j = this.selectedVersion) === null || _j === void 0 ? void 0 : _j.version,
            fromdate: this.fromdate,
            todate: this.todate
        };
        var title = 'Device Information';
        var dataFields = [
            "distributor",
            "clientname",
            "Unique",
            "modelname",
            "address",
            "plan",
            "Orientation",
            "activity",
            "status",
            "apkupdate",
            "createdby",
            "creationdate",
        ];
        var field = [];
        for (var _i = 0, dataFields_1 = dataFields; _i < dataFields_1.length; _i++) {
            var e = dataFields_1[_i];
            if (e === "distributor") {
                if (this.selectDistributor.id == 0) {
                    continue;
                }
            }
            if (e === "address") {
                if (this.selectedState.id != 0) {
                    continue;
                }
                if (this.selectedDistrict.id != 0) {
                    continue;
                }
                if (this.selectedCity.id != 0) {
                    continue;
                }
                if (this.selectedLocation.id != 0) {
                    continue;
                }
            }
            if (e === "Orientation") {
                if (this.selectedOrientation.id != 0) {
                    continue;
                }
            }
            if (e === "status") {
                if (this.selectedIsonline.id != "null") {
                    continue;
                }
            }
            if (e === "plan") {
                if (this.selectedVersion.id != 0) {
                    continue;
                }
            }
            if (e === "activity") {
                if (this.selectedActive.id != "null") {
                    continue;
                }
            }
            field.push(e);
        }
        var data1 = [];
        for (var _s = 0, _t = this.rowData; _s < _t.length; _s++) {
            var obj = _t[_s];
            // console.log(obj);
            var g = {
                'clientname': obj === null || obj === void 0 ? void 0 : obj.clientname,
                'Unique': obj === null || obj === void 0 ? void 0 : obj.password,
                "phone": obj === null || obj === void 0 ? void 0 : obj.phone,
                "modelname": obj.modelname,
                Orientation: obj.height_width == "9:16" ? "vertical" : "horizontal",
                'email': obj === null || obj === void 0 ? void 0 : obj.email,
                'plan': (_k = obj === null || obj === void 0 ? void 0 : obj.versionMaster) === null || _k === void 0 ? void 0 : _k.version,
                'createdby': obj === null || obj === void 0 ? void 0 : obj.createdby,
                'distributor': ((_l = this.selectDistributor) === null || _l === void 0 ? void 0 : _l.distributor) ? (_m = this.selectDistributor) === null || _m === void 0 ? void 0 : _m.distributor : "not Specified",
                // 'country': obj?.country?.countryname,
                'address': "State :" + ((_o = obj === null || obj === void 0 ? void 0 : obj.state) === null || _o === void 0 ? void 0 : _o.statename) + " \n\n" + "district :" + ((_p = obj === null || obj === void 0 ? void 0 : obj.district) === null || _p === void 0 ? void 0 : _p.name) + " \n\n" + "city :" + ((_q = obj === null || obj === void 0 ? void 0 : obj.city) === null || _q === void 0 ? void 0 : _q.cityname) + " \n\n" + "location :" + ((_r = obj === null || obj === void 0 ? void 0 : obj.location) === null || _r === void 0 ? void 0 : _r.area),
                // 'state': obj?.state?.statename,
                // 'district': obj?.district?.name,
                // 'city': obj?.city?.cityname,
                // "location": obj?.location?.area,
                // 'zipcode': obj?.zipcode,
                "activity": obj === null || obj === void 0 ? void 0 : obj.isactive,
                "status": obj === null || obj === void 0 ? void 0 : obj.isonline,
                "apkupdate": obj === null || obj === void 0 ? void 0 : obj.apkupdate,
                'creationdate': obj === null || obj === void 0 ? void 0 : obj.creationdate
            };
            data1.push(g);
        }
        var column_width = ['5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%', '5.55%',];
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
        this.exportService.generateDevicePDF(data);
    };
    ClientDeviceInfoComponent.prototype.getDistibutorList = function () {
        var _this = this;
        this.clientService.getDistibutor().subscribe(function (res) {
            // console.log(res);
            _this.distributorList = res;
            _this.filteredDistributorList = res;
        });
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getAllClientByDistributor = function (event) {
        var _this = this;
        console.log(event);
        this.selectDistributor = event;
        this.clientService.getClientListByDistributorId(event.id).subscribe(function (res) {
            console.log(res);
            _this.clientList1 = res;
            _this.filteredListClient = res;
        });
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getStatelistByClient = function (client) {
        var _this = this;
        this.selectedClient = client;
        var payload = [client === null || client === void 0 ? void 0 : client.id];
        this.clientService.getStatelistByClient(payload).subscribe(function (res) {
            console.log(res);
            _this.stateList = res;
            _this.filteredStateList = res;
        });
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getDistrictbyStatelist = function (state) {
        var _this = this;
        var _a;
        this.selectedState = state;
        var payload = {
            state_list: [state === null || state === void 0 ? void 0 : state.id],
            client_list: [(_a = this.selectedClient) === null || _a === void 0 ? void 0 : _a.id]
        };
        this.clientService.getDistrictListByStateIdList(payload).subscribe(function (res) {
            // console.log(res);
            _this.districtList = res;
            _this.filteredDistrictList = res;
        });
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getCitybyDistrictList = function (district) {
        var _this = this;
        var _a;
        this.selectedDistrict = district;
        var payload = {
            district_list: [district === null || district === void 0 ? void 0 : district.id],
            client_list: [(_a = this.selectedClient) === null || _a === void 0 ? void 0 : _a.id]
        };
        this.clientService.getCityListByDistrictList(payload).subscribe(function (res) {
            // console.log(res);
            _this.cityList = res;
            _this.filteredCityList = res;
        });
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getLocationByStateAndCity = function (city) {
        var _this = this;
        var _a;
        this.selectedCity = city;
        var payload = {
            city_list: [city === null || city === void 0 ? void 0 : city.id],
            client_list: [(_a = this.selectedClient) === null || _a === void 0 ? void 0 : _a.id]
        };
        this.clientService.getLocationByStateAndCity(payload).subscribe(function (res) {
            console.log(res);
            _this.locationList = res;
            _this.filteredLocationList = res;
        });
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getCustomerVersion = function () {
        var _this = this;
        this.clientService.getCustomerVersion().subscribe(function (res) {
            // console.log(res);
            _this.versionList = res;
            _this.filteredVersionList = res;
        });
    };
    ClientDeviceInfoComponent.prototype.getFromDate = function (event) {
        // console.log(event.value);
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.fromdate = year + "-" + month + "-" + date;
    };
    ClientDeviceInfoComponent.prototype.getToDate = function (event) {
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.todate = year + "-" + month + "-" + date;
        console.log(this.fromdate + "---" + this.todate);
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getLocation = function (location) {
        this.selectedLocation = location;
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getOnline = function (e) {
        this.selectedIsonline = e;
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getOrientation = function (location) {
        this.selectedOrientation = location;
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getActive = function (location) {
        this.selectedActive = location;
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.getVersion = function (location) {
        this.selectedVersion = location;
        this.filterDeviceList();
    };
    ClientDeviceInfoComponent.prototype.filterDeviceList = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var payload = {
            distributorid: (_a = this.selectDistributor) === null || _a === void 0 ? void 0 : _a.id,
            clientname: (_b = this.selectedClient) === null || _b === void 0 ? void 0 : _b.username,
            stateid: (_c = this.selectedState) === null || _c === void 0 ? void 0 : _c.id,
            districtid: (_d = this.selectedDistrict) === null || _d === void 0 ? void 0 : _d.id,
            cityid: (_e = this.selectedCity) === null || _e === void 0 ? void 0 : _e.id,
            locationid: (_f = this.selectedLocation) === null || _f === void 0 ? void 0 : _f.id,
            height_width: (_g = this.selectedOrientation) === null || _g === void 0 ? void 0 : _g.id,
            isactive: (_h = this.selectedActive) === null || _h === void 0 ? void 0 : _h.id,
            isonline: (_j = this.selectedIsonline) === null || _j === void 0 ? void 0 : _j.id,
            versionid: (_k = this.selectedVersion) === null || _k === void 0 ? void 0 : _k.id,
            fromdate: this.fromdate,
            todate: this.todate
        };
        console.log(payload);
        this.clientService.filterDeviceList(payload).subscribe(function (res) {
            _this.rowData = res;
        });
    };
    ClientDeviceInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-client-device-info',
            templateUrl: './client-device-info.component.html',
            styleUrls: ['./client-device-info.component.scss']
        })
    ], ClientDeviceInfoComponent);
    return ClientDeviceInfoComponent;
}());
exports.ClientDeviceInfoComponent = ClientDeviceInfoComponent;
function capitalize(word) {
    return word
        .toLowerCase()
        .replace(/\w/, function (firstLetter) { return firstLetter.toUpperCase(); });
}
function city(params) {
    if (params.cityname) {
        return params.cityname;
    }
    else {
        return "No City";
    }
}
function state(params) {
    // console.log(params);
    if (params.statename) {
        return params.statename;
    }
    else {
        return "No State";
    }
}
function getOrientation(height_width) {
    if (height_width) {
        var v = height_width;
        v = v.substring(2);
        if (v == 16) {
            return 'Vertical';
        }
        else {
            return 'Horizental';
        }
    }
    else {
        return "N/A";
    }
}
function getSomething(data) {
    if (data) {
        return data;
    }
    else {
        return "N/A";
    }
}
function formatOnline(data) {
    if (data) {
        return "Online";
    }
    else {
        return "Offline";
    }
}
