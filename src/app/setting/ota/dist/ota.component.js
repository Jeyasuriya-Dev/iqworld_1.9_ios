"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OtaComponent = void 0;
var core_1 = require("@angular/core");
var apk_enable_btn_component_1 = require("src/app/_core/cellrenders/apk-enable-btn/apk-enable-btn.component");
var loader_component_1 = require("src/app/_core/loader/loader.component");
var sweetalert2_1 = require("sweetalert2");
var OtaComponent = /** @class */ (function () {
    function OtaComponent(clientService, renderer, alertService, matDialog) {
        this.clientService = clientService;
        this.renderer = renderer;
        this.alertService = alertService;
        this.matDialog = matDialog;
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col' },
            { headerName: 'Edit', field: 'apk', cellRenderer: this.CellRendererBtn.bind(this) },
            {
                headerName: 'Schedule', cellRenderer: this.CellRendererBtnSchedule.bind(this)
            },
            { headerName: 'Start Time', field: 'sch_start_time' },
            { headerName: 'End Time', field: 'sch_end_time' },
            { headerName: 'APK', field: 'apk' },
            {
                headerName: 'Version', field: 'ver',
                valueGetter: function (e) {
                    return "v" + e.data.ver;
                }
            },
            {
                headerName: 'Uploaded By', field: 'uploadedby'
            },
            {
                headerName: 'Uploaded Ip', field: 'uploadedip'
            },
            {
                headerName: 'Features', field: 'featureList', width: 250,
                cellRenderer: function (e) {
                    // console.log(e.value);
                    var st = "";
                    if (e.value) {
                        for (var index = 0; index < e.value.length; index++) {
                            var element = e.value[index];
                            if (st) {
                                st = st + "," + (index + 1) + "." + element;
                            }
                            else {
                                st = (index + 1) + "." + element;
                            }
                        }
                    }
                    return st;
                }
            },
            { headerName: 'Creationdate', field: 'creationdate' },
            { headerName: 'Updationdate', field: 'updateddate' },
            {
                headerName: 'Release', cellRenderer: apk_enable_btn_component_1.ApkEnableBtnComponent
            },
        ];
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
                // width: 200,
                floatingFilter: true
            },
            pagination: true
        };
        this.rowData = [];
        // Grouping---------------------
        this.distributorList = [];
        this.ClientList = [];
        this.selectId = 0;
        this.allSelectedDistrictList = [];
        this.stateList = [];
        this.distributorList2 = this.distributorList.slice();
        this.allSelectedStateList = [];
        this.allSelectedCityList = [];
        this.allSelectedClientList = [];
        this.allcitylist = [];
        this.alldevicelist = [];
        this.alllocationlist = [];
        this.allSelectedLocationList = [];
        this.allselectedDeviceList = [];
        this.allSelectedState = false;
        this.allSelectedCity = false;
        this.allSelectedLocation = false;
        this.allselectedDevice = false;
        this.allSelectedClient = false;
        this.allSelectedDistrict = false;
        this.filteredListDevice = this.alldevicelist.slice();
        this.filteredListCity = this.allcitylist.slice();
        this.filteredListLocation = this.alllocationlist.slice();
        this.filteredListState = this.stateList.slice();
        this.filteredListClient = this.ClientList.slice();
        this.currentDate = new Date().toISOString().slice(0, 16);
    }
    OtaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clientService.getIPAddress().subscribe(function (res) {
            // console.log(res);
            _this.clientService.getUserIp().subscribe(function (res1) {
                _this.userIp = res.ipString + "/" + res1.userip;
                // console.log(this.userIp);
            });
        });
        this.getAllDistributorList();
        this.getCustomerVersion();
        this.clientService.getOtalistAll().subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
    };
    OtaComponent.prototype.dateTimePicker = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: "Don't save"
        }).then(function (result) {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                _this.clientService.setScheduleForOta(_this.otaId, _this.startDate, _this.endDate).subscribe(function (res) {
                    // console.log(res);
                    sweetalert2_1["default"].fire('Saved!', res.message, 'success');
                    // window.location.reload();
                    _this.ngOnInit();
                    _this.matDialogRef.close();
                }, function (err) {
                    var dynamicHTML;
                    if (err.error.message.length == 58) {
                        dynamicHTML = "<h4>Please choose Valid Date and Time </h4>";
                    }
                    else {
                        dynamicHTML = "<h4>" + err.error.message + "</h4>";
                    }
                    sweetalert2_1["default"].fire({
                        icon: 'error',
                        title: 'Oops...',
                        html: dynamicHTML,
                        text: ""
                    });
                });
            }
            else if (result.isDenied) {
                sweetalert2_1["default"].fire('Changes are not saved', '', 'info');
            }
        });
    };
    OtaComponent.prototype.onFileChange = function (event) {
        var _this = this;
        var files = event.target.files;
        if (files && files.length) {
            var _loop_1 = function (i) {
                var reader = new FileReader();
                reader.onload = function () {
                    var p = {
                        file: files[i],
                        apk: files[i].name
                    };
                    // console.log(p);
                    _this.ota = p;
                };
                reader.readAsDataURL(files[i]);
            };
            for (var i = 0; i < files.length; i++) {
                _loop_1(i);
            }
        }
    };
    OtaComponent.prototype.onSubmit = function (name, ver) {
        var _this = this;
        var _a;
        // console.log(this.ota);
        // console.log(ver);
        console.log(this.selectId);
        var fd = new FormData();
        fd.append("uploadedBy", name.value);
        fd.append("id", this.selectId);
        fd.append("uploadedIp", this.userIp);
        fd.append("ver", ver.value);
        fd.append("distributorid", this.selectDistributorId);
        fd.append("clientlist", this.allSelectedClientList);
        fd.append("statelist", this.allSelectedStateList);
        fd.append("districtlist", this.allSelectedDistrictList);
        fd.append("citylist", this.allSelectedCityList);
        fd.append("locationlist", this.allSelectedLocationList);
        fd.append("devicelist", this.allselectedDeviceList);
        fd.append("isvertical", this.selectedVertical);
        fd.append("planid", this.selectedVersion);
        if (this.ota) {
            fd.append("file", this.ota.file);
            fd.append("apk", this.ota.apk);
        }
        else if (this.selectId == 0) {
            this.alertService.showWarning("Please Choose The Apk File");
        }
        if (this.selectId == 0) {
            var ul = document.getElementById("input-container");
            // console.log();
            var v = Array.from(ul.children);
            var features_1;
            v.forEach(function (e) {
                // console.log(e.innerText);
                if (e.innerText != "Edit This Line") {
                    if (features_1) {
                        features_1 = features_1 + "&" + e.innerText;
                    }
                    else {
                        features_1 = e.innerText;
                    }
                }
            });
            if (features_1) {
                fd.append("features", features_1);
            }
        }
        console.log(this.selectId);
        if (this.selectId == 0) {
            if (((_a = this.ota) === null || _a === void 0 ? void 0 : _a.file) && name.value && ver.value) {
                // console.log(fd.get("uploadedBy"));
                var loader_1 = this.matDialog.open(loader_component_1.LoaderComponent, {
                    panelClass: 'loader-upload'
                });
                // console.log(fd.get('uploadedBy'));
                this.clientService.uploadApkFile(fd).subscribe(function (res) {
                    // console.log(res);
                    loader_1.close();
                    _this.ngOnInit();
                    _this.alertService.showSuccess(res.message);
                    _this.allSelectedCityList = [];
                    _this.allSelectedClientList = [];
                    _this.allselectedDeviceList = [];
                    _this.allSelectedDistrictList = [];
                    _this.allSelectedLocationList = [];
                    _this.allSelectedStateList = [];
                    // window.location.reload();
                }, function (err) {
                    loader_1.close();
                    _this.alertService.showError(err.error.message);
                });
            }
            else {
                this.alertService.showWarning("Please Fill The All Fields");
            }
        }
        else {
            var loader_2 = this.matDialog.open(loader_component_1.LoaderComponent, {
                panelClass: 'loader-upload'
            });
            this.clientService.uploadApkFile(fd).subscribe(function (res) {
                // console.log(res);
                loader_2.close();
                _this.alertService.showSuccess(res.message);
                // window.location.reload();
                _this.ngOnInit();
                _this.matDialogRef.close();
            }, function (err) {
                loader_2.close();
                _this.alertService.showSuccess(err.error.message);
            });
        }
    };
    OtaComponent.prototype.addInput = function () {
        var container = document.getElementById('input-container');
        // console.log(container);
        var input = document.createElement('li');
        input.contentEditable = "true";
        input.setAttribute("contenteditable", "true");
        input.style.margin = "10px";
        container.style.color = "green"; // Change text color
        container.style.fontSize = "16px"; // Change font size
        container.style.paddingLeft = "10px";
        input.innerText = "Edit This Line";
        container.appendChild(input);
    };
    OtaComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
    };
    OtaComponent.prototype.exportAsExcelFile = function () {
    };
    OtaComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
    };
    OtaComponent.prototype.exportPdf = function () {
    };
    OtaComponent.prototype.CloseMatDialog = function () {
        this.matDialog.closeAll();
    };
    OtaComponent.prototype.CellRendererBtn = function (params) {
        var _this = this;
        var button = this.renderer.createElement('button');
        // console.log(params.data);
        this.renderer.addClass(button, 'mat-raised-button');
        this.renderer.setStyle(button, 'background', 'transparent');
        this.renderer.setStyle(button, 'margin', '0px 15%');
        this.renderer.setStyle(button, 'width', '50%');
        this.renderer.setStyle(button, 'line-height', '1.8');
        this.renderer.setStyle(button, "padding", "0px 5px");
        this.renderer.setProperty(button, 'innerText', 'Edit');
        this.renderer.setStyle(button, 'color', '#42aaf5');
        this.renderer.setStyle(button, 'border', '1px #42aaf5 solid');
        this.renderer.listen(button, 'click', function (e) {
            var _a;
            console.log(params.data);
            // this.matDialog.open(this.editee)
            // console.log(this.editee);
            _this.getOtaGroupMasterByOtaId((_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a.id);
        });
        var div = this.renderer.createElement('div');
        this.renderer.appendChild(div, button);
        return div;
    };
    OtaComponent.prototype.scheduleFormater = function (data) {
        var current = new Date().getTime();
        var sch_start_time = new Date(data.sch_start_time).getTime();
        var sch_end_time = new Date(data.sch_end_time).getTime();
        // console.log(sch_start_time > current);
        // console.log(sch_start_time < current && current < sch_end_time);
        // console.log(current > sch_end_time);
        if (sch_start_time != 0 && sch_end_time != 0) {
            if (sch_start_time > current) {
                return 'Scheduled';
            }
            else if (sch_start_time < current && current < sch_end_time) {
                return 'Onprogress';
            }
            else if (current > sch_end_time) {
                return 'Finished';
            }
            else {
                return "Not-scheduled";
            }
        }
        else {
            return "Not-scheduled";
        }
    };
    OtaComponent.prototype.CellRendererBtnSchedule = function (params) {
        var _this = this;
        var button = this.renderer.createElement('button');
        // console.log(params.data);
        this.renderer.addClass(button, 'mat-raised-button');
        this.renderer.setStyle(button, 'background', 'transparent');
        this.renderer.setStyle(button, 'margin', '0px 15%');
        this.renderer.setStyle(button, 'line-height', '1.8');
        this.renderer.setStyle(button, "padding", "0px 5px");
        var res = this.scheduleFormater(params.data);
        if (res == "Scheduled") {
            this.renderer.setStyle(button, 'width', '50%');
            this.renderer.setProperty(button, 'innerText', 'Scheduled');
            this.renderer.setStyle(button, 'color', '#3d1df0');
            this.renderer.setStyle(button, 'border', '1px #3d1df0 solid');
            this.renderer.listen(button, 'click', function (e) {
                var _a, _b, _c;
                console.log(params.data);
                _this.startDate = (_a = params.data) === null || _a === void 0 ? void 0 : _a.sch_start_time;
                _this.endDate = (_b = params.data) === null || _b === void 0 ? void 0 : _b.sch_end_time;
                _this.otaId = (_c = params.data) === null || _c === void 0 ? void 0 : _c.id;
                _this.matDialogRef = _this.matDialog.open(_this.schedule, {
                    minWidth: '300px'
                });
            });
        }
        else if (res == "Onprogress") {
            this.renderer.setStyle(button, 'width', '50%');
            this.renderer.setProperty(button, 'innerText', 'Onprogress');
            this.renderer.setStyle(button, 'color', '#08d43f');
            this.renderer.setStyle(button, 'border', '1px #08d43f solid');
            this.renderer.listen(button, 'click', function (e) {
                var _a, _b, _c;
                console.log(params.data);
                _this.startDate = (_a = params.data) === null || _a === void 0 ? void 0 : _a.sch_start_time;
                _this.endDate = (_b = params.data) === null || _b === void 0 ? void 0 : _b.sch_end_time;
                _this.otaId = (_c = params.data) === null || _c === void 0 ? void 0 : _c.id;
                _this.stopSchedule();
                // this.matDialogRef = this.matDialog.open(this.schedule);
            });
        }
        else if (res == "Finished") {
            this.renderer.setStyle(button, 'width', '50%');
            this.renderer.setProperty(button, 'innerText', 'Finished');
            this.renderer.setStyle(button, 'color', '#eb2310');
            this.renderer.setStyle(button, 'border', '1px #eb2310 solid');
            this.renderer.listen(button, 'click', function (e) {
                var _a, _b, _c;
                console.log(params.data);
                _this.startDate = (_a = params.data) === null || _a === void 0 ? void 0 : _a.sch_start_time;
                _this.endDate = (_b = params.data) === null || _b === void 0 ? void 0 : _b.sch_end_time;
                _this.otaId = (_c = params.data) === null || _c === void 0 ? void 0 : _c.id;
                _this.matDialogRef = _this.matDialog.open(_this.schedule, {
                    minWidth: '300px'
                });
            });
        }
        else if (res == "Not-scheduled") {
            this.renderer.setStyle(button, 'width', '70%');
            this.renderer.setProperty(button, 'innerText', 'Not-scheduled');
            this.renderer.setStyle(button, 'color', '#4b5e51');
            this.renderer.setStyle(button, 'border', '1px #4b5e51 solid');
            this.renderer.listen(button, 'click', function (e) {
                var _a, _b, _c;
                console.log(params.data);
                _this.startDate = (_a = params.data) === null || _a === void 0 ? void 0 : _a.sch_start_time;
                _this.endDate = (_b = params.data) === null || _b === void 0 ? void 0 : _b.sch_end_time;
                _this.otaId = (_c = params.data) === null || _c === void 0 ? void 0 : _c.id;
                _this.matDialogRef = _this.matDialog.open(_this.schedule, {
                    minWidth: '300px'
                });
            });
        }
        var div = this.renderer.createElement('div');
        this.renderer.appendChild(div, button);
        return div;
    };
    OtaComponent.prototype.stopSchedule = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Stop it!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.clientService.stopOtaSchedule(_this.otaId).subscribe(function (res) {
                    // console.log(res);
                    // window.location.reload();
                    sweetalert2_1["default"].fire('Stopped!', res.message, 'success');
                    _this.ngOnInit();
                    _this.matDialogRef.close();
                });
            }
        });
    };
    OtaComponent.prototype.getOtaGroupMasterByOtaId = function (e) {
        var _this = this;
        this.clientService.getOtaGroupMasterByOtaId(e).subscribe(function (res) {
            console.log(res);
            _this.matDialogRef = _this.matDialog.open(_this.editee);
            _this.allSelectedClientList = res === null || res === void 0 ? void 0 : res.clientlist;
            _this.allSelectedStateList = res === null || res === void 0 ? void 0 : res.statelist;
            _this.allSelectedCityList = res === null || res === void 0 ? void 0 : res.citylist;
            _this.allSelectedDistrictList = res === null || res === void 0 ? void 0 : res.districtlist;
            _this.allSelectedLocationList = res === null || res === void 0 ? void 0 : res.locationlist;
            _this.allselectedDeviceList = res === null || res === void 0 ? void 0 : res.devicelist;
            _this.selectDistributorId = res === null || res === void 0 ? void 0 : res.distributorid;
            _this.selectedVersion = res === null || res === void 0 ? void 0 : res.planid;
            _this.selectId = res === null || res === void 0 ? void 0 : res.otaid;
            if (res.isvertical) {
                _this.selectedVertical = "true";
            }
            else {
                _this.selectedVertical = "false";
            }
            // console.log(this.selectedVertical);
            _this.clientService.getClientListByDistributorId(res.distributorid).subscribe(function (res) {
                console.log(res);
                _this.ClientList = res;
                _this.getStatelistByClient();
                _this.getDistrictbyStatelist();
                _this.getCitybyStatelist();
                _this.getLocationByStateAndCity();
                _this.getDeviceByLocation();
            });
        });
    };
    OtaComponent.prototype.toggleAllSelectionForClient = function () {
        if (this.allSelectedClient) {
            this.selectClient.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectClient.options.forEach(function (item) { return item.deselect(); });
            this.allSelectedCityList = [];
            this.allSelectedLocationList = [];
            this.allselectedDeviceList = [];
        }
        this.getStatelistByClient();
    };
    OtaComponent.prototype.optionClickClient = function () {
        var newStatus = true;
        this.selectClient.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.getStatelistByClient();
        this.allSelectedClient = newStatus;
    };
    OtaComponent.prototype.toggleAllSelectionForState = function () {
        if (this.allSelectedState) {
            this.selectState.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectState.options.forEach(function (item) { return item.deselect(); });
            this.allSelectedCityList = [];
            this.allSelectedLocationList = [];
            this.allselectedDeviceList = [];
        }
        this.getDistrictbyStatelist();
        this.getCitybyStatelist();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.optionClickState = function () {
        var newStatus = true;
        this.selectState.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedState = newStatus;
        this.getDistrictbyStatelist();
        this.getCitybyStatelist();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.toggleAllSelectionForDistrict = function () {
        if (this.allSelectedDistrict) {
            this.selectDistrict.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectDistrict.options.forEach(function (item) { return item.deselect(); });
            this.allSelectedCityList = [];
            this.allSelectedLocationList = [];
            this.allselectedDeviceList = [];
        }
        this.getCitybyDistrictList();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.optionClickDistrict = function () {
        var newStatus = true;
        this.selectDistrict.options.forEach(function (item) {
            console.log(item);
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedState = newStatus;
        this.allSelectedCityList = [];
        this.allSelectedLocationList = [];
        this.allselectedDeviceList = [];
        this.getCitybyDistrictList();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.toggleAllSelectionForCity = function () {
        if (this.allSelectedCity) {
            this.selectCity.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectCity.options.forEach(function (item) { return item.deselect(); });
            this.allSelectedLocationList = [];
            this.allselectedDeviceList = [];
        }
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.optionClickCity = function () {
        var newStatus = true;
        this.selectCity.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCity = newStatus;
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.toggleAllSelectionForLocation = function () {
        if (this.allSelectedLocation) {
            this.selectLocation.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectLocation.options.forEach(function (item) { return item.deselect(); });
            this.allselectedDeviceList = [];
        }
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.optionClickLocation = function () {
        var newStatus = true;
        this.selectLocation.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedLocation = newStatus;
        this.getDeviceByLocation();
    };
    OtaComponent.prototype.toggleAllSelectionForDevice = function () {
        if (this.allselectedDevice) {
            this.selectDevice.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectDevice.options.forEach(function (item) { return item.deselect(); });
        }
    };
    OtaComponent.prototype.optionClickDiveice = function () {
        var newStatus = true;
        this.selectDevice.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allselectedDevice = newStatus;
    };
    //  checkConfigure(event: any) {
    //    var clickedId = event.target.id
    //    let selectlist: any = document.getElementsByClassName("formSelect");
    //    // console.log(selectlist);
    //    var elementsArray = [...selectlist];
    //    // Use forEach to iterate over the array of elements
    //    elementsArray.forEach((element) => {
    //      // Do something with each element
    //      // console.log(element.id == clickedId);
    //      if (element.id == clickedId) {
    //        console.log(clickedId);
    //        if (clickedId == "allstate") {
    //          this.isstateSelected = true;
    //          this.isDeviceselected = false;
    //          this.isLocationSelected = false;
    //          this.iscitySelected = false;
    //        } else if (clickedId == "allcity") {
    //          this.isstateSelected = false;
    //          this.isDeviceselected = false;
    //          this.isLocationSelected = false;
    //          this.iscitySelected = true;
    //        } else if (clickedId == "alllocation") {
    //          this.isstateSelected = false;
    //          this.isDeviceselected = false;
    //          this.isLocationSelected = true;
    //          this.iscitySelected = false;
    //        } else if (clickedId == "alldevice") {
    //          this.isstateSelected = false;
    //          this.isDeviceselected = true;
    //          this.isLocationSelected = false;
    //          this.iscitySelected = false;
    //        }
    //        element.checked = true;
    //      } else {
    //        element.checked = false;
    //      }
    //    });
    //  }
    OtaComponent.prototype.getStatelistByClient = function () {
        var _this = this;
        console.log(this.allSelectedClientList);
        this.clientService.getStatelistByClient(this.allSelectedClientList).subscribe(function (res) {
            console.log(res);
            _this.stateList = res;
            _this.filteredListState = res;
        });
    };
    OtaComponent.prototype.getDistrictbyStatelist = function () {
        var _this = this;
        var payload = {
            state_list: this.allSelectedStateList,
            client_list: this.allSelectedClientList
        };
        this.clientService.getDistrictListByStateIdList(payload).subscribe(function (res) {
            // console.log(res);
            _this.alldistrictlist = res;
            _this.filteredListCity = res;
        });
    };
    OtaComponent.prototype.getCitybyDistrictList = function () {
        var _this = this;
        var payload = {
            district_list: this.allSelectedDistrictList,
            client_list: this.allSelectedClientList
        };
        this.clientService.getCityListByDistrictList(payload).subscribe(function (res) {
            // console.log(res);
            _this.allcitylist = res;
            _this.filteredListCity = res;
        });
    };
    OtaComponent.prototype.getCitybyStatelist = function () {
        var _this = this;
        console.log(this.allSelectedStateList);
        var payload = {
            state_list: this.allSelectedStateList,
            client_list: this.allSelectedClientList
        };
        // this.clientService.getCitybyStatelist(this.allSelectedStateList).subscribe(res => {
        //   // console.log(res);
        //   this.allcitylist = res;
        //   this.filteredListCity=res;
        // })
        this.clientService.getCitybyStatelist(payload).subscribe(function (res) {
            // console.log(res);
            _this.allcitylist = res;
            _this.filteredListCity = res;
        });
    };
    OtaComponent.prototype.getLocationByStateAndCity = function () {
        var _this = this;
        console.log(this.allSelectedCityList);
        var payload = {
            city_list: this.allSelectedCityList,
            client_list: this.allSelectedClientList
        };
        this.clientService.getLocationByStateAndCity(payload).subscribe(function (res) {
            console.log(res);
            _this.alllocationlist = res;
            _this.filteredListLocation = res;
        });
    };
    OtaComponent.prototype.getDeviceByLocation = function () {
        var _this = this;
        // console.log(this.allselectedDeviceList);
        var payload = {
            location_list: this.allSelectedLocationList,
            client_list: this.allSelectedClientList,
            isvertical: this.selectedVertical,
            version: this.selectedVersion
        };
        console.log(payload);
        this.clientService.getDeviceByLocationAndClientByPlanAndVertical(payload).subscribe(function (res) {
            // console.log(res);
            _this.alldevicelist = res;
            _this.filteredListDevice = res;
        });
    };
    OtaComponent.prototype.getAllDistributorList = function () {
        var _this = this;
        this.clientService.getDistibutor().subscribe(function (res) {
            console.log(res);
            _this.distributorList = res;
            _this.distributorList2 = res;
        });
    };
    OtaComponent.prototype.getAllClientByDistributor = function (event) {
        var _this = this;
        console.log(event);
        this.selectDistributorId = event.value;
        this.clientService.getClientListByDistributorId(event.value).subscribe(function (res) {
            console.log(res);
            _this.ClientList = res;
            _this.filteredListClient = res;
        });
    };
    OtaComponent.prototype.getCustomerVersion = function () {
        var _this = this;
        this.clientService.getCustomerVersion().subscribe(function (res) {
            // console.log(res);
            _this.planVersionList = res;
        });
    };
    __decorate([
        core_1.ViewChild('selectState')
    ], OtaComponent.prototype, "selectState");
    __decorate([
        core_1.ViewChild('selectCity')
    ], OtaComponent.prototype, "selectCity");
    __decorate([
        core_1.ViewChild('selectLocation')
    ], OtaComponent.prototype, "selectLocation");
    __decorate([
        core_1.ViewChild('selectDevice')
    ], OtaComponent.prototype, "selectDevice");
    __decorate([
        core_1.ViewChild('selectClient')
    ], OtaComponent.prototype, "selectClient");
    __decorate([
        core_1.ViewChild('selectDistrict')
    ], OtaComponent.prototype, "selectDistrict");
    __decorate([
        core_1.ViewChild('editee1')
    ], OtaComponent.prototype, "editee");
    __decorate([
        core_1.ViewChild('schedule1')
    ], OtaComponent.prototype, "schedule");
    OtaComponent = __decorate([
        core_1.Component({
            selector: 'app-ota',
            templateUrl: './ota.component.html',
            styleUrls: ['./ota.component.scss']
        })
    ], OtaComponent);
    return OtaComponent;
}());
exports.OtaComponent = OtaComponent;
