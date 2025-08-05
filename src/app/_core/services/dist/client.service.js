"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ClientService = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var api_base_1 = require("src/app/api-base");
var BASE_API = api_base_1.clienturl.BASE_URL();
var httpOptions = {
    headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json' })
};
var ClientService = /** @class */ (function () {
    function ClientService(http) {
        // let v =  this.getCurrentAddress();
        // console.log(v);
        var _this = this;
        this.http = http;
        // this.ifscBankDetails("HDFC0009159");
        this.getIPAddress().subscribe(function (res) {
            // console.log(res);
            _this.getUserIp().subscribe(function (res1) {
                _this.userIp = res.ipString + "/" + res1.userip;
                // console.log(this.userIp);
            });
        });
    }
    ClientService.prototype.ifscBankDetails = function (ifsc) {
        // return this.http.get("https://ifsc.razorpay.com/"+ifsc);
        fetch("https://ifsc.razorpay.com/" + ifsc)
            .then(function (response) { return response.json(); })
            .then(function (result) { return console.log(result); })["catch"](function (error) { return console.log('error', error); });
    };
    ClientService.prototype.getUserIp = function () {
        return this.http.get(BASE_API + "/none-auth/useripAddress");
    };
    ClientService.prototype.logMovies = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, movies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        movies = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientService.prototype.createClient = function (payload) {
        // console.log(payload);
        return this.http.post(BASE_API + "/client/create", payload);
    };
    ClientService.prototype.updateClient = function (payload) {
        // console.log(payload);
        return this.http.post(BASE_API + "/client/updateclient", payload);
    };
    ClientService.prototype.getAllClientList = function () {
        return this.http.get(BASE_API + "/client/all");
    };
    ClientService.prototype.getClientListByDistributorId = function (id) {
        return this.http.get(BASE_API + "/client/getclientlistbydistributorid?distributorid=" + id);
    };
    ClientService.prototype.getAllStateList = function () {
        return this.http.get(BASE_API + "/none-auth/state/all");
    };
    ClientService.prototype.getStateListWithoutAll = function () {
        return this.http.get(BASE_API + "/none-auth/getAllState");
    };
    ClientService.prototype.getStateListBycountryIdOrcountry = function (countryname, countryid) {
        return this.http.get(BASE_API + "/none-auth/getstatebycountry?countryid=" + countryid + "&countryname=" + countryname);
    };
    ClientService.prototype.getCityListByStateId = function (stateid) {
        return this.http.get(BASE_API + "/none-auth/city?stateid=" + stateid);
    };
    ClientService.prototype.getCityListByStateIdOrState = function (stateid, statename) {
        return this.http.get(BASE_API + "/none-auth/getcitybystate?stateid=" + stateid + "&statename=" + statename);
    };
    // getCurrentAddress(): any {
    //   const successCallback = async (position: any) => {
    //     // console.log(position.coords);
    //     let v = await this.getAddressBylt(position.coords.latitude, position.coords.longitude);
    //     console.log(v);
    //   };
    //   const errorCallback = (error: any) => {
    //     console.log(error);
    //   };
    //   navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    // }
    ClientService.prototype.getCurrentAddress = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var successCallback, errorCallback;
            var _this = this;
            return __generator(this, function (_a) {
                successCallback = function (position) { return __awaiter(_this, void 0, void 0, function () {
                    var address, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.getAddressBylt(position.coords.latitude, position.coords.longitude)];
                            case 1:
                                address = _a.sent();
                                // console.log(address);
                                resolve(address); // Resolve the promise with the address
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                console.error(error_1);
                                reject(error_1); // Reject the promise if there's an error
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                errorCallback = function (error) {
                    // console.log(error);
                    reject(error); // Reject the promise on error
                };
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
                return [2 /*return*/];
            });
        }); });
    };
    ClientService.prototype.getAddressBylt = function (lat, lon) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOptions, Res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOptions = {
                            method: 'GET'
                        };
                        return [4 /*yield*/, fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + lon + "&apiKey=3e0f8d22bbbe467f8e584f7040592da1", requestOptions)
                                .then(function (response) { return response.json(); })
                                .then(function (result) {
                                // console.log(result);
                                Res = result;
                            })["catch"](function (error) { return console.log('error', error); })];
                    case 1:
                        _a.sent();
                        // console.log(Res);
                        return [2 /*return*/, Res];
                }
            });
        });
    };
    ClientService.prototype.createPlaylist = function (payload, stateListIds) {
        // console.log(this.userIp);
        // playlistname;
        // username;
        //  userip;
        // stateid;
        //  city;
        //  clientname;
        // displaytype;
        // statelist;
        var fd = {
            "playlistname": payload.filename,
            "username": payload.username,
            "userip": this.userIp,
            "stateid": payload.state,
            "district": payload.district,
            "city": payload.city,
            "clientname": payload.clientname,
            "displaytype": payload.displaytype,
            "statelist": stateListIds,
            "mediatype": payload.mediatype,
            "location": payload.location
        };
        // console.log(fd);
        // console.log(this.userIp);
        return this.http.post(BASE_API + "/playlist/create", fd);
        // return this.http.post(BASE_API + "/playlist/create?playlistname=" + payload.filename + "&username=" + payload.username + "&city=" + payload.city + "&state=" + payload.state + "&userip=" + this.userIp + "&displaytype=" + payload.displaytype + "&clientname=" + payload.clientname + "&mediatype=" + payload.mediatype, {});
    };
    ClientService.prototype.getDefaultAllPlaylistByClient = function (clientname, isvertical) {
        return this.http.get(BASE_API + "/playlist/getplaylistdefault?clientname=" + clientname + "&vertical=" + isvertical);
    };
    ClientService.prototype.getAllPlaylistByClient = function (clientname, isvertical) {
        return this.http.get(BASE_API + "/playlist/byclient?clientname=" + clientname + "&vertical=" + isvertical);
    };
    ClientService.prototype.getAllMediaInfoByPlaylistId = function (playlistId) {
        return this.http.get(BASE_API + "/playlist/getplaylistfiles?playlist_id=" + playlistId);
    };
    ClientService.prototype.getmediafilesByPlaylistNdOrientation = function (playlistId, isvertical) {
        return this.http.get(BASE_API + "/playlist/getplaylistfilesbyplaylistidandorientation?playlist_id=" + playlistId + "&vertical=" + isvertical);
    };
    ClientService.prototype.getIPAddress = function () {
        return this.http.get('https://api-bdc.net/data/client-ip');
    };
    ClientService.prototype.getAllDevicesList = function () {
        return this.http.get(BASE_API + "/device/all");
    };
    // gettotaldevicesbydistributorid
    ClientService.prototype.getTotalDevicesByDistributorId = function (id) {
        return this.http.get(BASE_API + "/device/gettotaldevicesbydistributorid?distributorid=" + id);
    };
    ClientService.prototype.getDevicesByusername = function (username) {
        return this.http.get(BASE_API + "/complaint/getByDeviceUsername?username=" + username);
        // http://localhost:8082/api/v1/complaint/getByDeviceUsername?username=IQW0000011
    };
    ClientService.prototype.uploadFiles = function (fd) {
        return this.http.post(BASE_API + "/playlist/uploadfile", fd);
    };
    // uploadImages(fd: any) {
    //   console.log(fd);
    //   return this.http.post(BASE_API + "/playlist/uploadfile", fd);
    // }
    ClientService.prototype.mediaFilebyClientAndDate = function (payload) {
        // console.log(payload);
        return this.http.get(BASE_API + "/playlist/playlistbyclient?clientname=" + payload.clientname + "&state_id=" + payload.state + "&city_id=" + payload.city + "&mediatype=" + payload.mediatype + "&vertical=" + payload.vertical + "&location_id=" + payload.location_id + "&district_id=" + payload.district_id);
    };
    ClientService.prototype.getAllPlaylistByClientUsername = function (clientname) {
        return this.http.get(BASE_API + "/playlist/getallplaylist?clientname=" + clientname);
    };
    ClientService.prototype.setScheduleForPlaylist = function (playlist_id, startTime, endTime, scheduledby) {
        return this.http.get(BASE_API + "/playlist/setScheduleForPlaylist?playlist_id=" + playlist_id + "&start_time=" + startTime + "&end_time=" + endTime + "&scheduledby=" + scheduledby);
    };
    ClientService.prototype.setScheduleForOta = function (otaid, startTime, endTime) {
        return this.http.get(BASE_API + "/none-auth/setscheduleforota?id=" + otaid + "&stattime=" + startTime + "&endtime=" + endTime);
    };
    ClientService.prototype.getplaylistByplaylistIdNdclientUsername = function (playlist_id, clientname) {
        // console.log(playlist_id);
        // console.log(clientname);
        return this.http.get(BASE_API + "/playlist/getplaylistByplaylistIdNdclientname?playlist_id=" + playlist_id + "&clientname=" + clientname);
    };
    ClientService.prototype.getdeviceListbyclientusername = function (clientname) {
        return this.http.get(BASE_API + "/device/getdevicebyclient?clientname=" + clientname);
    };
    ClientService.prototype.deleteMediafile = function (id) {
        return this.http["delete"](BASE_API + "/playlist/deletemediafile?id=" + id);
    };
    ClientService.prototype.deletePlaylist = function (id) {
        return this.http["delete"](BASE_API + "/playlist/deleteplaylist?id=" + id);
    };
    ClientService.prototype.editPlaylistStateList = function (payload) {
        return this.http.post(BASE_API + "/playlist/addtoallstate", payload);
    };
    ClientService.prototype.editPlaylistStateLists = function (payload) {
        return this.http.post(BASE_API + "/playlist/editplaylist", payload);
    };
    ClientService.prototype.stopPlaylistSchedule = function (playlist_id, scheduledby) {
        return this.http.get(BASE_API + "/playlist/stopplaylistschedule?id=" + playlist_id + "&scheduledby=" + scheduledby);
    };
    ClientService.prototype.stopOtaSchedule = function (id) {
        return this.http.get(BASE_API + "/none-auth/stopotaschedule?id=" + id);
    };
    ClientService.prototype.checkPlaylist = function () {
        return this.http.get(BASE_API + "/playlist/checkplaylist?playlist_id=21&updation_date=2023-08-03T15:19:39");
    };
    ClientService.prototype.getDeviceStatusByClient = function (clientname) {
        return this.http.get(BASE_API + "/device/getdevicecountsbyclient?clientname=" + clientname);
    };
    ClientService.prototype.getDistibutorDashboardData = function (id) {
        return this.http.get(BASE_API + "/distibutor/dashboarddetails?distributorid=" + id);
    };
    ClientService.prototype.getAllDeviceStatus = function () {
        return this.http.get(BASE_API + "/device/getdevicestatusall");
    };
    ClientService.prototype.getDeviceCountOfAllStates = function (clientname) {
        return this.http.get(BASE_API + "/device/getdevicecountofallstates?clientname=" + clientname);
    };
    ClientService.prototype.sendOtp = function (clientname) {
        return this.http.get(BASE_API + "/none-auth/sendotp?clientname=" + clientname);
    };
    ClientService.prototype.sendOtpForDeviceActivation = function (clientname, activationby) {
        return this.http.get(BASE_API + "/none-auth/sendotpactivation?clientname=" + clientname + "&activationby=" + activationby);
    };
    ClientService.prototype.sendResetOtp = function (clientname) {
        return this.http.get(BASE_API + "/none-auth/sendresetotp?clientname=" + clientname);
    };
    ClientService.prototype.verifyOtp = function (otp, clientname) {
        return this.http.get(BASE_API + "/none-auth/verifyotp?otp=" + otp + "&clientname=" + clientname);
    };
    ClientService.prototype.getClientcountByWeekorMonth = function (type) {
        return this.http.get(BASE_API + "/client/getclientcountbyweekormonth?type=" + type);
    };
    ClientService.prototype.getDeviceDetailsByState = function (clientUsername) {
        return this.http.get(BASE_API + "/device/getdevicedetails?clientname=" + clientUsername);
    };
    // /getstoragedetails
    ClientService.prototype.getStorageDetailsByClient = function (clientname) {
        return this.http.get(BASE_API + "/playlist/getstoragedetails?clientname=" + clientname);
    };
    ClientService.prototype.getStorageDetailsByAdmin = function () {
        return this.http.get(BASE_API + "/playlist/gettotalstoragedetails");
    };
    ClientService.prototype.changePasswordByUsername = function (clientname, newpass) {
        return this.http.get(BASE_API + "/none-auth/changepassword?clientname=" + clientname + "&newpass=" + newpass);
    };
    ClientService.prototype.getDeviceCountByState = function (clientname, statename) {
        return this.http.get(BASE_API + "/device/getdevicecountbystate?clientname=" + clientname + "&statename=" + statename);
    };
    ClientService.prototype.createScroller = function (payload) {
        return this.http.post(BASE_API + "/scroller/create", payload);
    };
    ClientService.prototype.getScrollerByClientname = function (clientname) {
        return this.http.get(BASE_API + "/scroller/getbyclientname?clientname=" + clientname);
    };
    ClientService.prototype.getScrollerType = function () {
        return this.http.get(BASE_API + "/scroller/getscrolltype");
    };
    ClientService.prototype.updateScrollerByClientnameAndId = function (payload) {
        return this.http.post(BASE_API + "/scroller/update", payload);
    };
    ClientService.prototype.addScrollerToPlaylist = function (payload) {
        return this.http.post(BASE_API + "/scroller/addscrolllisttoplaylist", payload);
    };
    ClientService.prototype.changeScrollerPosition = function (playlist_id, type_id) {
        return this.http.get(BASE_API + "/scroller/updateplaylistscrolltype?playlist_id=" + playlist_id + "&type_id=" + type_id);
    };
    ClientService.prototype.deletScrollerById = function (id) {
        return this.http["delete"](BASE_API + "/scroller/delete?id=" + id);
    };
    ClientService.prototype.enablesScroller = function (playlistid, isscroller) {
        return this.http.get(BASE_API + "/scroller/enablesScroller?playlistid=" + playlistid + "&isscroller=" + isscroller);
    };
    ClientService.prototype.getScheduleHistoryByFilter = function (clientname, start, end, playlist_id) {
        return this.http.get(BASE_API + "/playlist/getplaylisthistorybyclient?clientname=" + clientname + "&fromdate=" + start + "&todate=" + end + "&playlist_id=" + playlist_id);
    };
    ClientService.prototype.updateSplitview = function (playlist_id, splitview) {
        return this.http.get(BASE_API + "/playlist/updatesplitview?splitview=" + splitview + "&playlist_id=" + playlist_id);
    };
    ClientService.prototype.uploadApkFile = function (payload) {
        console.log(payload.getAll);
        return this.http.post(BASE_API + "/none-auth/uploadapkfile", payload);
    };
    ClientService.prototype.getOtalistAll = function () {
        return this.http.get(BASE_API + "/none-auth/getotalist/all");
    };
    ClientService.prototype.updateOtaStatus = function (id, status) {
        return this.http.get(BASE_API + "/none-auth/updateotastatus?id=" + id + "&status=" + status);
    };
    ClientService.prototype.getClientByUsername = function (clientname) {
        return this.http.get(BASE_API + "/client/getclientbyusername?clientname=" + clientname);
    };
    ClientService.prototype.getNotificationForOtaUpgrade = function (clientname) {
        return this.http.get(BASE_API + "/none-auth/getnotificationforotaupgrade?clientname=" + clientname);
    };
    // http://localhost:8082/api/v1/none-auth/getnotificationforotaupgrade?clientname=ridsys
    ClientService.prototype.createComplaint = function (sub, desc, clientname) {
        return this.http.post(BASE_API + "/complaint/create?clientname=" + clientname + "&subject=" + sub + "&description=" + desc, {});
    };
    ClientService.prototype.getComplaintList = function () {
        return this.http.get(BASE_API + "/complaint/getcomplaintdetails");
    };
    ClientService.prototype.getComplaintListbyView = function () {
        return this.http.get(BASE_API + "/complaint/getAllComplaintsByView");
    };
    ClientService.prototype.updateIsViewed = function (id) {
        return this.http.get(BASE_API + "/complaint/upadateview?id=" + id);
    };
    ClientService.prototype.updateIsActive = function (id) {
        return this.http.get(BASE_API + "/complaint/upadateactive?id=" + id);
    };
    ClientService.prototype.getComplaintDetailsByView = function () {
        return this.http.get(BASE_API + "/complaint/getcomplaintdetailsbyview");
    };
    ClientService.prototype.getComplaintDetailsByViewDistributor = function (username) {
        return this.http.get(BASE_API + "/complaint/getComplaintsByDistributorAndview?username=" + username);
    };
    // http://192.168.1.105:8082/api/v1/complaint//getactivecomplaintcount?username=
    ClientService.prototype.getComplaintCountByDistributorOrAdmin = function (username) {
        return this.http.get(BASE_API + "/complaint/getactivecomplaintcount?username=" + username);
    };
    ClientService.prototype.getComplaintListByDistributor = function (username) {
        return this.http.get(BASE_API + "/complaint/getComplaintlistByDistributor?username=" + username);
    };
    // http://192.168.1.105:8082/api/v1/complaint/getcomplaintlist?username=
    ClientService.prototype.getComplaintListByDistributorOrAdmin = function (username) {
        return this.http.get(BASE_API + "/complaint/getcomplaintlist?username=" + username);
    };
    // http://192.168.1.105:8082/api/v1/complaint/getactivaterequest?username=
    ClientService.prototype.getActivateListByDistributorOrAdmin = function (username) {
        return this.http.get(BASE_API + "/complaint/getactivaterequest?username=" + username);
    };
    // http://192.168.1.105:8082/api/v1/complaint/getactiveanddeactiverequest?username=admin&isactive=1
    ClientService.prototype.getActiveAndDeactiveRequest = function (username, isactive) {
        return this.http.get(BASE_API + "/complaint/getactiveanddeactiverequest?username=" + username + "&isactive=" + isactive);
    };
    ClientService.prototype.getComplaintDetailsAllByClientname = function (clientname, type) {
        return this.http.get(BASE_API + "/complaint/getcomplaintdetailsbyclientname?clientname=" + clientname + "&type=" + type);
    };
    ClientService.prototype.createDistibutor = function (payload) {
        return this.http.post(BASE_API + "/distibutor/create", payload);
    };
    ClientService.prototype.updateDistibutor = function (payload) {
        return this.http.post(BASE_API + "/distibutor/update", payload);
    };
    ClientService.prototype.getDistibutor = function () {
        return this.http.get(BASE_API + "/distibutor/getdistributorall");
    };
    ClientService.prototype.getDistributorById = function (id) {
        return this.http.get(BASE_API + "/distibutor/getdistributorById?id=" + id);
    };
    ClientService.prototype.getdistributorByUsername = function (username) {
        return this.http.get(BASE_API + "/distibutor/getdistributorbyusername?username=" + username);
    };
    ClientService.prototype.activateClient = function (clientname, status, versionId) {
        return this.http.get(BASE_API + "/client/activateclient?clientname=" + clientname + "&status=" + status + "&versionid=" + versionId);
    };
    ClientService.prototype.updateDeviceModelname = function (username, modelname) {
        return this.http.get(BASE_API + "/device/updatedevicemodelname?username=" + username + "&modelname=" + modelname);
    };
    ClientService.prototype.activateDevice = function (clientname, username, status, versionId) {
        return this.http.get(BASE_API + "/device/activatedevice?clientname=" + clientname + "&username=" + username + "&status=" + status + "&versionid=" + versionId);
    };
    ClientService.prototype.getAllDeviceModel = function () {
        return this.http.get(BASE_API + "/none-auth/getdeviecemodels");
    };
    ClientService.prototype.convertDataToVideo = function (list) {
        return this.http.post(BASE_API + "/playlist/convertdata", list);
    };
    ClientService.prototype.registorDevice = function (payload) {
        //   {
        //     "landmark": "busstand",
        //     "count": "1",
        //     "city": "GUNTUR",
        //     "state": "2",
        //     "area": "vinukonda",
        //     "height_width": "9:16",
        //     "acceptTerms": true,
        //     "modelname": "CAN3201",
        //     "clientid": 1
        // }
        var options = {
            params: new http_1.HttpParams({
                fromString: "country=" + payload.country + '&count=' + payload.count + '&landmark=' + payload.landmark + '&android_id=' + payload.android_id + '&city=' + payload.city + '&state=' + payload.state + '&location=' + payload.area + '&height_width=' + payload.height_width + '&modelname=' + payload.modelname + '&client_id=' + payload.clientid + '&createdby=' + "user"
            })
        };
        return this.http.post(BASE_API + "/none-auth/device/create1", options.params);
    };
    ClientService.prototype.registorDevice2 = function (payload) {
        console.log(payload);
        return this.http.post(BASE_API + "/none-auth/device/create2", payload);
    };
    ClientService.prototype.updateDevice = function (payload) {
        var options = {
            params: new http_1.HttpParams({
                fromString: "versionid=" + payload.versionid + "&username=" + payload.username + "&country=" + payload.country + '&landmark=' + payload.landmark + '&city=' + payload.city + '&state=' + payload.state + '&location=' + payload.location + '&height_width=' + payload.height_width + '&modelname=' + payload.modelname
            })
        };
        return this.http.post(BASE_API + "/none-auth/device/update", options.params);
    };
    ClientService.prototype.getLocationListByCity = function (cityname) {
        return this.http.get(BASE_API + "/none-auth/getlocationbycity?cityname=" + cityname);
    };
    ClientService.prototype.getLocationListByCityId = function (cityname) {
        return this.http.get(BASE_API + "/none-auth/getlocationbycityid?cityname=" + cityname);
    };
    ClientService.prototype.setPlaylistAsDefault = function (clientname, isactive, state_id, playlist_id, vertical) {
        return this.http.get(BASE_API + "/playlist/setplaylistasdefault?clientname=" + clientname + "&state_id=" + state_id + "&playlist_id=" + playlist_id + "&isactive=" + isactive + "&vertical=" + vertical);
    };
    ClientService.prototype.getCustomerVersion = function () {
        return this.http.get(BASE_API + "/versionmaster/all");
    };
    // http://localhost:8082/api/v1/none-auth/getstatebyclientlist
    // getStatelistByClient
    // getCitybyStatelist(state_list: string[]) {
    //   return this.http.get(BASE_API + "/none-auth/getcitybystatelist?state_list=" + state_list);
    // }
    ClientService.prototype.getCitybyStatelist = function (state_list) {
        return this.http.post(BASE_API + "/none-auth/getcitybystatelist", state_list);
    };
    // sudo lsof -t -i tcp:4200 | xargs kill -9
    ClientService.prototype.getStatelistByClient = function (client_list) {
        console.log(client_list);
        return this.http.get(BASE_API + "/none-auth/getstatebyclientlist?clientlist=" + client_list);
    };
    // getLocationByStateAndCity(city_list: any) {
    //   return this.http.get(BASE_API + "/none-auth/getlocationbystateandcity?city_list=" + city_list);
    // }
    ClientService.prototype.getLocationByStateAndCity = function (city_list) {
        return this.http.post(BASE_API + "/none-auth/getlocationbystateandcity", city_list);
    };
    ClientService.prototype.getDeviceByLocation = function (payload) {
        return this.http.post(BASE_API + "/none-auth/getdevicebylocationandclient", payload);
    };
    // http://192.168.1.105:8082/api/v1/none-auth/getdeviceforplaylist
    ClientService.prototype.getDeviceByLocationFilter = function (payload) {
        return this.http.post(BASE_API + "/none-auth/getdeviceforplaylist", payload);
    };
    ClientService.prototype.getDeviceByLocationAndClientByPlanAndVertical = function (payload) {
        return this.http.post(BASE_API + "/none-auth/getdevicebylocationandclientForOta", payload);
    };
    ClientService.prototype.upgradeClientVersion = function (clientid, version) {
        console.log(clientid);
        console.log(version);
        return this.http.get(BASE_API + "/client/versionupdaterequest?clientid=" + clientid + "&version=" + version);
    };
    ClientService.prototype.updateComplaint = function (complaint_id) {
        console.log(complaint_id);
        return this.http.get(BASE_API + "/complaint/updatecomplaint?complaint_id=" + complaint_id);
    };
    ClientService.prototype.getStateListbyClientdeviceLocation = function (clientname) {
        // http://192.168.1.105:8082/api/v1/none-auth/getstatebydevice?clientname=pgajula16;
        return this.http.get(BASE_API + "/none-auth/getstatebydevice?clientname=" + clientname);
    };
    ClientService.prototype.getOtaGroupMasterByOtaId = function (id) {
        // http://192.168.1.105:8082/api/v1/none-auth/getotagroupdetailsbyid?ota_id=
        return this.http.get(BASE_API + "/none-auth/getotagroupdetailsbyid?ota_id=" + id);
    };
    ClientService.prototype.logOutDevice = function (username) {
        return this.http.get(BASE_API + "/device/logout?deviceid=" + username);
    };
    ClientService.prototype.getAllCountryList = function () {
        return this.http.get(BASE_API + "/none-auth/getcountrylist/all");
    };
    ClientService.prototype.getStateListByCountrynameOrId = function (countryname, countryid) {
        return this.http.get(BASE_API + "/none-auth/getstatebycountry?countryname=" + countryname + "&countryid=" + countryid);
    };
    ClientService.prototype.getDistrictListByStatenameOrId = function (statename, stateid) {
        return this.http.get(BASE_API + "/none-auth/getdistrictbystate?statename=" + statename + "&stateid=" + stateid);
    };
    ClientService.prototype.getDistrictListByStateIdList = function (payload) {
        return this.http.post(BASE_API + "/none-auth/getdistrictbystatellist", payload);
    };
    ClientService.prototype.getCityListByDistrictnameOrId = function (districtname, districtid) {
        return this.http.get(BASE_API + "/none-auth/getcitybydistrict?districtname=" + districtname + "&districtid=" + districtid);
    };
    ClientService.prototype.getStateListByDistributorid = function (districtid) {
        return this.http.get(BASE_API + "/client/getclientstatebydistributor?distributor_id=" + districtid);
    };
    ClientService.prototype.getDistrictListByStateAndDistributorid = function (districtid, state_id) {
        return this.http.get(BASE_API + "/client/getclientdistrictbydistributor?distributor_id=" + districtid + "&state_id=" + state_id);
    };
    ClientService.prototype.getCityListByDistricteAndDistributorid = function (districtid, district_id) {
        return this.http.get(BASE_API + "/client/getclientcitybydistributor?distributor_id=" + districtid + "&district_id=" + district_id);
    };
    ClientService.prototype.getLocationListByCityAndDistributorid = function (districtid, city_id) {
        return this.http.get(BASE_API + "/client/getclientlocationbydistributor?distributor_id=" + districtid + "&city_id=" + city_id);
    };
    ClientService.prototype.getCityListByDistrictList = function (payload) {
        return this.http.post(BASE_API + "/none-auth/getcitybydistrictlist", payload);
    };
    ClientService.prototype.filterClientList = function (payload) {
        return this.http.get(BASE_API + "/client/getallclientlist?distributorid=" + payload.distributorid + "&stateid=" + payload.stateid + "&districtid=" + payload.districtid + "&cityid=" + payload.cityid + "&locationid=" + payload.locationid + "&planid=" + payload.planid + "&fromdate=" + payload.fromdate + "&todate=" + payload.todate);
    };
    ClientService.prototype.filterDeviceList = function (payload) {
        return this.http.get(BASE_API + "/device/getalldeviceinfo?distributorid=" + payload.distributorid + "&stateid=" + payload.stateid + "&districtid=" + payload.districtid + "&cityid=" + payload.cityid + "&locationid=" + payload.locationid + "&versionid=" + payload.versionid + "&fromdate=" + payload.fromdate + "&todate=" + payload.todate + "&height_width=" + payload.height_width + "&isonline=" + payload.isonline + "&clientname=" + payload.clientname + "&isactive=" + payload.isactive);
    };
    ClientService.prototype.freezeScroller = function (isfreeze, playlist_id) {
        return this.http.get(BASE_API + "/playlist/setisfreezeforplaylist?playlist_id=" + playlist_id + "&isfreeze=" + isfreeze);
    };
    ClientService.prototype.filterLog = function (clientname, username, fromdate, todate) {
        return this.http.get(BASE_API + "/device/getdevicelog?username=" + username + "&clientname=" + clientname + "&fromdate=" + fromdate + "&todate=" + todate);
    };
    ClientService.prototype.getStateForDistributor = function () {
        return this.http.get(BASE_API + "/distibutor/getstatelistfordistributor");
    };
    ClientService.prototype.getDistrictbyStateForDistributor = function (stateid) {
        return this.http.get(BASE_API + "/distibutor/getdistrictlistbystatefordistributor?stateid=" + stateid);
    };
    ClientService.prototype.getCitybyDistrictForDistibutor = function (districtid) {
        return this.http.get(BASE_API + "/distibutor/getcitylistbydistrictfordistributor?districtid=" + districtid);
    };
    ClientService.prototype.getLocationbyCityForDistibutor = function (cityid) {
        return this.http.get(BASE_API + "/distibutor/getlocationlistbycityfordistributor?cityid=" + cityid);
    };
    ClientService.prototype.getAllDistributorList = function (payload) {
        return this.http.get(BASE_API + "/distibutor/getalldistributorlist?stateid=" + payload.stateid + "&districtid=" + payload.districtid + "&cityid=" + payload.cityid + "&locationid=" + payload.locationid + "&fromdate=" + payload.fromdate + "&todate=" + payload.todate);
    };
    ClientService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ClientService);
    return ClientService;
}());
exports.ClientService = ClientService;
