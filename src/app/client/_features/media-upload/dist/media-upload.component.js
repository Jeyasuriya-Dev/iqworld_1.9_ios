"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.MediaUploadComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var otp_verification_component_1 = require("src/app/_core/cellrenders/otp-verification/otp-verification.component");
var loader_component_1 = require("src/app/_core/loader/loader.component");
var sweetalert2_1 = require("sweetalert2");
var MediaUploadComponent = /** @class */ (function () {
    function MediaUploadComponent(observer, vista, storageService, formBuilder, el, Alert, alertService, storage, activatedRoute, clientService, matDialog) {
        this.observer = observer;
        this.vista = vista;
        this.storageService = storageService;
        this.formBuilder = formBuilder;
        this.el = el;
        this.Alert = Alert;
        this.alertService = alertService;
        this.storage = storage;
        this.activatedRoute = activatedRoute;
        this.clientService = clientService;
        this.matDialog = matDialog;
        this.images = [];
        this.both = [];
        this.ScrollerTypeList = [];
        this.selectedScroller = null;
        this.selectedStateOptions = [];
        this.videos = [];
        this.isVertical = true;
        this.isMoblie = false;
        this.stateList = [];
        this.selectStateList = [];
        this.selectedStateList = [];
        this.isScheduled = false;
        this.isstateSelected = false;
        this.isDistrictSelected = false;
        this.forceList = [];
        this.selectedOptions = [];
        this.scrollList = [];
        this.scrollList1 = [];
        this.isBaseUser = true;
        this.iscitySelected = false;
        this.isLocationSelected = false;
        this.isDeviceselected = false;
        this.existedImages = [
            {
                "id": 0,
                "filename": "",
                "url": "",
                "mediainfo": {
                    "id": 0,
                    "mediatype": ""
                },
                "playlist_id": 0,
                "order_id": 0,
                "isactive": true,
                "creationdate": "",
                "createdby": "client",
                "duration": null,
                "animation": "fade",
                "type": ""
            }
        ];
        this.selectedImage = null;
        this.isVerified = false;
        this.allSelected = false;
        this.allStateSelected = false;
        // Grouping---------------------
        this.allSelectedStateList = [];
        this.allSelectedDistrictList = [];
        this.allSelectedCityList = [];
        this.allcitylist = [];
        this.alldevicelist = [];
        this.alldistrictlist = [];
        this.alllocationlist = [];
        this.allSelectedLocationList = [];
        this.allselectedDeviceList = [];
        this.allSelectedState = false;
        this.allSelectedCity = false;
        this.allSelectedLocation = false;
        this.allselectedDevice = false;
        this.allSelectedDistrict = false;
        this.anyOneChecked = false;
        this.filteredListDevice = this.alldevicelist.slice();
        this.filteredListCity = this.allcitylist.slice();
        this.filteredListLocation = this.alllocationlist.slice();
        this.filteredListState = this.stateList.slice();
        this.playListId = this.activatedRoute.snapshot.paramMap.get('id');
        this.currentDate = new Date().toISOString().slice(0, 16);
    }
    MediaUploadComponent.prototype.ngAfterViewInit = function () {
    };
    MediaUploadComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clientUsername = this.storageService.getClientUsername();
        this.currentUser = this.storageService.getUser();
        this.getStateAllList();
        this.getAllMediaInfoByPlaylistId("true");
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
        this.clientService.getplaylistByplaylistIdNdclientUsername(this.playListId, this.clientUsername).subscribe(function (res) {
            var _a, _b;
            console.log(res);
            _this.playlist = res;
            _this.selectedScroller = (_a = res === null || res === void 0 ? void 0 : res.scrollTypeMaster) === null || _a === void 0 ? void 0 : _a.id;
            _this.selectedSplitview = res.splitview;
            _this.mediatype = _this.playlist.mediainfo.id;
            _this.startDate = _this.playlist.sch_start_time;
            _this.endDate = _this.playlist.sch_end_time;
            _this.selectStateList = _this.playlist.state_list;
            _this.allSelectedStateList = _this.playlist.statelistIds;
            // console.log(this.playlist.statelistIds);
            _this.allSelectedDistrictList = (_b = _this.playlist) === null || _b === void 0 ? void 0 : _b.districtlistIds;
            _this.allSelectedCityList = _this.playlist.citylistIds;
            _this.allSelectedLocationList = _this.playlist.locationlistIds;
            _this.allselectedDeviceList = _this.playlist.device_listIds;
            _this.selectedOptions = _this.playlist.scrollid_list;
            if (_this.playlist.scheduletype == "STATE") {
                _this.isstateSelected = true;
            }
            else if (_this.playlist.scheduletype == "DISTRICT" && !_this.isstateSelected) {
                _this.isDistrictSelected = true;
            }
            else if (_this.playlist.scheduletype == "CITY" && !_this.isstateSelected && !_this.isDistrictSelected) {
                _this.iscitySelected = true;
            }
            else if (_this.playlist.scheduletype == "LOCATION" && !_this.isstateSelected && !_this.iscitySelected && !_this.isDistrictSelected) {
                _this.isLocationSelected = true;
            }
            else {
                _this.isDeviceselected = true;
            }
            _this.getScheduleDetails();
            _this.getDistrictbyStatelist();
            _this.getCitybyDistrictList();
            _this.getLocationByStateAndCity();
            _this.getDeviceByLocation();
        });
        this.clientService.getScrollerType().subscribe(function (res) {
            _this.ScrollerTypeList = res;
        });
        this.clientService.getClientByUsername(this.clientUsername).subscribe(function (res) {
            // console.log(res);
            _this.customer = res;
            if (res.versionMaster.version == "BASIC") {
                _this.isBaseUser = true;
            }
            else {
                _this.isBaseUser = false;
            }
            // console.log(this.isBaseUser);
        });
        this.clientService.getScrollerByClientname(this.clientUsername).subscribe(function (res) {
            // console.log(res);
            _this.scrollList = res;
            // console.log(this.playlist.scrollid);
            // if (this.playlist.scrollid) {
            //   let scrollidlist: any[] = this.playlist.scrollid.split(",");
            //   for (let index = 0; index < this.scrollList.length; index++) {
            //     const element = this.scrollList[index];
            //     // console.log(scrollidlist);
            //     // console.log(element.id);
            //     for (let index = 0; index < scrollidlist.length; index++) {
            //       const element1 = scrollidlist[index];
            //       if (element.id == element1) {
            //         this.selectedOptions.push(element.id)
            //       }
            //     }
            //   }
            // }
            // if (this.playlist) {
            //   if (this.playlist.scrollid) {
            //     let scrollidlist: any[] = this.playlist.scrollid.split(",");
            //     for (let index = 0; index < this.scrollList.length; index++) {
            //       const element = this.scrollList[index];
            //       // console.log(scrollidlist);
            //       // console.log(element.id);
            //       for (let index = 0; index < scrollidlist.length; index++) {
            //         const element1 = scrollidlist[index];
            //         if (element.id == element1) {
            //           this.selectedOptions.push(element.id)
            //         }
            //       }
            //     }
            //   }
            // }
        });
        // this.getAllMediaInfoByPlaylistId();
    };
    MediaUploadComponent.prototype.selectedTabValue = function (tab) {
        // console.log(tab.index);
        this.both = [];
        if (tab.index == "0") {
            this.isVertical = true;
            this.getAllMediaInfoByPlaylistId("true");
        }
        else {
            this.isVertical = false;
            this.getAllMediaInfoByPlaylistId("false");
        }
    };
    MediaUploadComponent.prototype.applyForce = function (event, device) {
        var _this = this;
        // console.log(event);
        if (!event.checked) {
            this.forceList.push(device.id);
        }
        else {
            this.forceList.forEach(function (e) {
                _this.forceList = _this.forceList.filter(function (item) { return item !== device.id; });
            });
        }
        console.log(this.forceList);
    };
    MediaUploadComponent.prototype.scheduleFormater = function () {
        var current = new Date().getTime();
        var sch_start_time = new Date(this.playlist.sch_start_time).getTime();
        var sch_end_time = new Date(this.playlist.sch_end_time).getTime();
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
    MediaUploadComponent.prototype.getScheduleDetails = function () {
        var current = new Date().getTime();
        // console.log(this.isScheduled);
        var sch_start_time = new Date(this.playlist.sch_start_time).getTime();
        var sch_end_time = new Date(this.playlist.sch_end_time).getTime();
        // console.log(sch_start_time < current && current < sch_end_time);
        // if (this.playlist.file_count != 0) {
        if (sch_start_time < current && current < sch_end_time) {
            this.isScheduled = true;
        }
        else {
            this.isScheduled = false;
        }
        // console.log(this.isScheduled);
        // }
    };
    MediaUploadComponent.prototype.getAllMediaInfoByPlaylistId = function (isvertical) {
        var _this = this;
        this.clientService.getmediafilesByPlaylistNdOrientation(this.playListId, this.isVertical).subscribe(function (res) {
            // console.log(res);
            var existedImage = res;
            // this.existedImages = res;
            _this.existedImages.length = 0;
            existedImage.map(function (e) {
                var v = _this.isImage(e.filename);
                // console.log(v);
                if (v) {
                    e.type = "image";
                    _this.existedImages.push(e);
                }
                else {
                    e.type = "video";
                    _this.existedImages.push(e);
                }
            });
        });
    };
    MediaUploadComponent.prototype.checkAspectRatio = function (image) {
        image.is16_9 = Math.abs(image.width / image.height - 16 / 9) < 0.01;
    };
    MediaUploadComponent.prototype.isImage = function (v) {
        var imageExtensions = ['.gif', '.jpg', '.jpeg', '.png'];
        var status = false;
        imageExtensions.map(function (e) {
            var c = v.includes(e);
            if (c) {
                status = c;
            }
        });
        return status;
    };
    ;
    MediaUploadComponent.prototype.onFileChange = function (event) {
        var _this = this;
        // this.images=[];
        var files = event.target.files;
        // console.log(files);
        // this.filesList = files;
        if (files && files.length) {
            var _loop_1 = function (i) {
                var reader = new FileReader();
                reader.onload = function () {
                    var image = new Image();
                    image.onload = function () {
                        _this.images.push({
                            file: files[i],
                            url: reader.result,
                            height: image.height,
                            width: image.width,
                            aspectRatioFlag: Math.abs(image.height / image.width - 16 / 9) < 0.01
                                ? '16:9 Aspect Ratio'
                                : 'Aspect Ratio Mismatch'
                        });
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(files[i]);
            };
            for (var i = 0; i < files.length; i++) {
                _loop_1(i);
            }
        }
    };
    MediaUploadComponent.prototype.updatePreview = function (image) {
        if (image.height > 0 && image.width > 0) {
            var aspectRatio = 9 / 16; // 9:16 aspect ratio (portrait)
            if (image.height / image.width !== aspectRatio) {
                if (image.height > image.width) {
                    // Adjust width based on height
                    image.width = Math.round(image.height / aspectRatio);
                }
                else {
                    // Adjust height based on width
                    image.height = Math.round(image.width * aspectRatio);
                }
            }
        }
    };
    MediaUploadComponent.prototype.removeImage = function (image) {
        var index = this.images.indexOf(image);
        if (index !== -1) {
            this.images.splice(index, 1);
        }
    };
    MediaUploadComponent.prototype.removeFile = function (image) {
        var index = this.both.indexOf(image);
        if (index !== -1) {
            this.both.splice(index, 1);
        }
    };
    MediaUploadComponent.prototype.uploadImages = function () {
        var _this = this;
        this.Fd = [];
        var fd = new FormData();
        for (var i = 0; i < this.images.length; i++) {
            var image = this.images[i];
            fd.append('file', image.file);
        }
        fd.append('username', this.currentUser.username);
        fd.append('mediatype', '1');
        fd.append('playlist_id', this.playListId);
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        this.clientService.sendOtp(this.clientUsername).subscribe(function (res) {
            // console.log(res);
            loader.close();
            if (res.message == "success") {
                _this.verifyOtp("image", fd);
            }
        });
        // this.clientService.uploadImages(fd).subscribe((res: any) => {
        //   console.log(res);
        //   this.Alert.successAlert(res.message);
        //   this.getAllMediaInfoByPlaylistId();
        // })
    };
    MediaUploadComponent.prototype.onFileChangeVideo = function (event) {
        var _this = this;
        // this.videos=[];
        var files = event.target.files;
        if (files && files.length) {
            var _loop_2 = function (i) {
                var reader = new FileReader();
                reader.onload = function () {
                    _this.videos.push({
                        file: files[i],
                        url: reader.result,
                        height: 500,
                        width: 1020
                    });
                };
                reader.readAsDataURL(files[i]);
            };
            for (var i = 0; i < files.length; i++) {
                _loop_2(i);
            }
        }
    };
    MediaUploadComponent.prototype.onFileChangeFile = function (event) {
        var _this = this;
        // this.videos=[];
        var files = event.target.files;
        // console.log(files);
        if (files && files.length) {
            var _loop_3 = function (i) {
                var reader = new FileReader();
                reader.onload = function () {
                    _this.both.push({
                        file: files[i],
                        url: reader.result,
                        type: files[i].type
                    });
                };
                reader.readAsDataURL(files[i]);
            };
            for (var i = 0; i < files.length; i++) {
                _loop_3(i);
            }
        }
        // console.log(this.both);
    };
    MediaUploadComponent.prototype.updatePreviewVideo = function (video) {
        var aspectRatio = 9 / 16; // 9:16 aspect ratio (portrait)
        if (video.height > 0 && video.width > 0) {
            if (video.height / video.width !== aspectRatio) {
                if (video.height > video.width) {
                    // Adjust width based on height
                    video.width = Math.round(video.height / aspectRatio);
                }
                else {
                    // Adjust height based on width
                    video.height = Math.round(video.width * aspectRatio);
                }
            }
        }
    };
    MediaUploadComponent.prototype.deleteImage = function (image) {
    };
    MediaUploadComponent.prototype.deleteVideo = function (video) {
    };
    MediaUploadComponent.prototype.removeVideo = function (video) {
        var index = this.videos.indexOf(video);
        if (index !== -1) {
            this.videos.splice(index, 1);
        }
    };
    MediaUploadComponent.prototype.uploadVideos = function () {
        var _this = this;
        this.Fd = [];
        var fd = new FormData();
        for (var i = 0; i < this.videos.length; i++) {
            var video = this.videos[i];
            fd.append('file', video.file);
        }
        fd.append('username', this.currentUser.username);
        fd.append('mediatype', '2');
        fd.append('playlist_id', this.playListId);
        // console.log('FormData:', fd);
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        this.clientService.sendOtp(this.clientUsername).subscribe(function (res) {
            // console.log(res);
            loader.close();
            if (res.message == "success") {
                _this.verifyOtp("video", fd);
            }
        });
    };
    MediaUploadComponent.prototype.uploadBoth = function () {
        var _this = this;
        // console.log(this.isVertical);
        this.Fd = [];
        var fd = new FormData();
        for (var i = 0; i < this.both.length; i++) {
            var both = this.both[i];
            fd.append('file', both.file);
        }
        fd.append('username', this.currentUser.username);
        fd.append('mediatype', this.playlist.mediainfo.id);
        fd.append('playlist_id', this.playListId);
        // console.log('FormData:', fd);
        if (this.isVertical) {
            fd.append('isvertical', "true");
        }
        else {
            fd.append('isvertical', "false");
        }
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        if (this.isBaseUser) {
            this.clientService.uploadFiles(fd).subscribe(function (res) {
                _this.Alert.successAlert(res.message);
                loader.close();
                window.location.reload();
            });
        }
        else {
            this.clientService.sendOtp(this.clientUsername).subscribe(function (res) {
                // console.log(res);
                loader.close();
                if (res.message == "success") {
                    _this.verifyOtp("both", fd);
                }
            });
        }
    };
    MediaUploadComponent.prototype.isAspectRatio16_9 = function (width, height) {
        var aspectRatio = width / height;
        // console.log(width, height);
        var w = 1080;
        var h = 1920;
        // return Math.abs(aspectRatio - (16 / 9)) < 0.01;
        if (width >= w && height >= h) {
            return true;
        }
        else {
            return false;
        }
    };
    MediaUploadComponent.prototype.onEdit = function (image) {
        // Implement edit functionality here
        // console.log('Edit clicked for image:', image);
        var v = this.vista.editeOnVista(this.playlist, image);
    };
    MediaUploadComponent.prototype.addMore = function () {
        var v = this.vista.editeOnVistaCreatePlan(this.playlist);
    };
    MediaUploadComponent.prototype.onDelete = function (image) {
        // Implement delete functionality here
        // console.log('Delete clicked for image:', image);
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            // console.log(result);
            if (result.isConfirmed) {
                _this.clientService.deleteMediafile(image.id).subscribe(function (res) {
                    // console.log(res);
                    sweetalert2_1["default"].fire('Deleted!', 'Your file has been deleted.', 'success');
                    _this.getAllMediaInfoByPlaylistId("");
                    // window.location.reload();
                    // this.ngOnInit();
                });
            }
            else {
                sweetalert2_1["default"].fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });
    };
    MediaUploadComponent.prototype.onMouseEnter = function (image) {
        this.selectedImage = image;
    };
    MediaUploadComponent.prototype.onMouseLeave = function (image) {
        this.selectedImage = null;
    };
    MediaUploadComponent.prototype.dateTimePicker = function () {
        var _this = this;
        // console.log(this.endDate);
        // console.log(this.startDate);
        // console.log(this.choosedPlaylist);
        sweetalert2_1["default"].fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: "Don't save"
        }).then(function (result) {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                _this.clientService.setScheduleForPlaylist(_this.playListId, _this.startDate, _this.endDate, _this.currentUser.username).subscribe(function (res) {
                    // console.log(res);
                    sweetalert2_1["default"].fire('Saved!', '', 'success');
                    window.location.reload();
                }, function (err) {
                    // console.log(err.error.message == "Text '2023-07-27 14:40:00' could not be parsed at index 10");
                    var dynamicHTML;
                    // let Text = err.error.message;
                    // let isIncludes = Text.length
                    // console.log(isIncludes);
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
                        text: "",
                        footer: '<a style="color:#76b2e3; font-weight:600;"> <span style="color: blue; font-weight:600;">Note:</span> Please Check Playlist has data Or Not</a>'
                    });
                });
            }
            else if (result.isDenied) {
                sweetalert2_1["default"].fire('Changes are not saved', '', 'info');
            }
        });
    };
    MediaUploadComponent.prototype.openSchedulePopUp = function (template) {
        this.matDialog.open(template, {
            minWidth: "350px"
        });
    };
    MediaUploadComponent.prototype.stopSchedule = function () {
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
                _this.clientService.stopPlaylistSchedule(_this.playListId, _this.currentUser.username).subscribe(function (res) {
                    // console.log(res);
                    window.location.reload();
                    sweetalert2_1["default"].fire('Stopped!', 'Your playlist has been Stopped.', 'success');
                });
            }
        });
    };
    MediaUploadComponent.prototype.verifyOtp = function (type, fd) {
        var Dailog = this.matDialog.open(otp_verification_component_1.OtpVerificationComponent, {
            disableClose: true,
            data: { type: type, fd: fd, clientname: this.clientUsername }
        });
        Dailog.afterClosed().subscribe(function (result) {
            if (result) {
                // console.log("Result is TRUE!");
            }
        });
    };
    MediaUploadComponent.prototype.closeDailog = function (data, mediatype, fd) {
        var _this = this;
        this.isVerified = data;
        // console.log(fd);
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        if (this.isVerified) {
            this.clientService.uploadFiles(fd).subscribe(function (res) {
                // console.log(res);
                _this.Alert.successAlert(res.message);
                loader.close();
                window.location.reload();
            });
        }
    };
    MediaUploadComponent.prototype.toggleAllSelection = function () {
        if (this.allSelected) {
            this.select.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.select.options.forEach(function (item) { return item.deselect(); });
        }
    };
    MediaUploadComponent.prototype.optionClick = function () {
        var newStatus = true;
        this.select.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    };
    MediaUploadComponent.prototype.toggleAllStateSelection = function () {
        if (this.allStateSelected) {
            this.stateselect.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.stateselect.options.forEach(function (item) { return item.deselect(); });
        }
    };
    MediaUploadComponent.prototype.optionStateClick = function () {
        var newStatus = true;
        this.stateselect.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allStateSelected = newStatus;
    };
    MediaUploadComponent.prototype.getStateAllList = function () {
        // this.clientService.getStateListWithoutAll().subscribe(res => {
        //   // console.log(res);
        //   this.stateList = res;
        // })
        var _this = this;
        this.clientService.getStateListbyClientdeviceLocation(this.clientUsername).subscribe(function (res) {
            // console.log(res);
            _this.stateList = res;
            _this.filteredListState = res;
        });
    };
    MediaUploadComponent.prototype.onSaveClick = function () {
        var _this = this;
        // console.log(this.selectedOptions);
        // console.log(this.params.data.id);
        var payload = {
            playlist_id: this.playListId,
            statelist: this.selectedStateOptions
        };
        sweetalert2_1["default"].fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: "Don't save"
        }).then(function (result) {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var loader_1 = _this.matDialog.open(loader_component_1.LoaderComponent, {
                    panelClass: 'loader-upload'
                });
                _this.clientService.editPlaylistStateList(payload).subscribe(function (res) {
                    // console.log(res);
                    loader_1.close();
                    sweetalert2_1["default"].fire('Saved!', res.message, 'success');
                }, function (err) {
                    var _a;
                    loader_1.close();
                    sweetalert2_1["default"].fire('error!!', (_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.message, "error");
                });
            }
            else if (result.isDenied) {
                sweetalert2_1["default"].fire('Changes are not saved', '', 'info');
            }
        });
    };
    MediaUploadComponent.prototype.btnClickedHandler = function () {
        // console.log(this.stateList);
        // console.log(this.selectStateList);
        this.selectedStateList = [];
        for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
            var state_1 = _a[_i];
            // console.log(this.selectStateList);
            var StateInstant = { id: state_1.id, statename: state_1.statename, isSelected: false };
            if (this.selectStateList.includes(state_1.statename)) {
                StateInstant = { id: state_1.id, statename: state_1.statename, isSelected: true };
                if (state_1.id != 0) {
                    this.selectedStateOptions.push(StateInstant.id);
                }
                // console.log(state);
            }
            if (state_1.id != 0) {
                this.selectedStateList.push(StateInstant);
            }
        }
        // console.log(this.selectedStateList);
        // console.log(this.selectedStateOptions);
        // this.matDailog.open(event, {
        // });
    };
    MediaUploadComponent.prototype.enableScroller = function (data) {
        var _this = this;
        // console.log(data.checked);
        this.clientService.enablesScroller(this.playListId, data.checked).subscribe(function (res) {
            // console.log(res);
            _this.clientService.getplaylistByplaylistIdNdclientUsername(_this.playListId, _this.clientUsername).subscribe(function (res) {
                // console.log(res);
                _this.playlist = res;
                _this.mediatype = _this.playlist.mediainfo.id;
                _this.startDate = _this.playlist.sch_start_time;
                _this.endDate = _this.playlist.sch_end_time;
                _this.getScheduleDetails();
            });
        });
    };
    MediaUploadComponent.prototype.addScrollListToPlaylist = function (selectScroller) {
        var _this = this;
        console.log(selectScroller);
        var payload = {
            playlist_id: this.playListId,
            scrollid: this.selectedOptions
        };
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        this.clientService.addScrollerToPlaylist(payload).subscribe(function (res) {
            // console.log(res);
            loader.close();
            sweetalert2_1["default"].fire('Saved!!', res === null || res === void 0 ? void 0 : res.message, 'success');
            _this.ngOnInit();
        }, function (err) {
            var _a;
            loader.close();
            sweetalert2_1["default"].fire('Saved!!', (_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.message, 'error');
        });
    };
    MediaUploadComponent.prototype.changeScrollerPosition = function () {
        var _this = this;
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        this.clientService.changeScrollerPosition(this.playListId, this.selectedScroller).subscribe(function (res) {
            // console.log(res);
            loader.close();
            _this.alertService.showSuccess(res === null || res === void 0 ? void 0 : res.message);
            // window.location.reload();
            _this.ngOnInit();
        }, function (err) {
            var _a;
            loader.close();
            _this.alertService.showError((_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.message);
        });
    };
    MediaUploadComponent.prototype.updateSplitview = function (data) {
        var _this = this;
        // console.log(data);
        this.clientService.updateSplitview(this.playListId, data).subscribe(function (res) {
            _this.alertService.showSuccess(res.message);
        });
    };
    MediaUploadComponent.prototype.toggleAllSelectionForState = function () {
        if (this.allSelectedState) {
            this.selectState.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectState.options.forEach(function (item) { return item.deselect(); });
            this.allSelectedCityList = [];
            this.allSelectedLocationList = [];
            this.allselectedDeviceList = [];
            this.allSelectedDistrictList = [];
        }
        this.getDistrictbyStatelist();
        this.getCitybyDistrictList();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    MediaUploadComponent.prototype.optionClickState = function () {
        var newStatus = true;
        this.selectState.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedState = newStatus;
        this.allSelectedCityList = [];
        this.allSelectedLocationList = [];
        this.allselectedDeviceList = [];
        this.allSelectedDistrictList = [];
        this.getDistrictbyStatelist();
        this.getCitybyDistrictList();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    MediaUploadComponent.prototype.toggleAllSelectionForDistrict = function () {
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
    MediaUploadComponent.prototype.optionClickDistrict = function () {
        var newStatus = true;
        this.selectDistrict.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedDistrict = newStatus;
        this.allSelectedCityList = [];
        this.allSelectedLocationList = [];
        this.allselectedDeviceList = [];
        this.getCitybyDistrictList();
        this.getLocationByStateAndCity();
        this.getDeviceByLocation();
    };
    MediaUploadComponent.prototype.toggleAllSelectionForCity = function () {
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
    MediaUploadComponent.prototype.optionClickCity = function () {
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
    MediaUploadComponent.prototype.toggleAllSelectionForLocation = function () {
        if (this.allSelectedLocation) {
            this.selectLocation.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectLocation.options.forEach(function (item) { return item.deselect(); });
            this.allselectedDeviceList = [];
        }
        this.getDeviceByLocation();
    };
    MediaUploadComponent.prototype.optionClickLocation = function () {
        var newStatus = true;
        this.selectLocation.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedLocation = newStatus;
        this.getDeviceByLocation();
    };
    MediaUploadComponent.prototype.toggleAllSelectionForDevice = function () {
        if (this.allselectedDevice) {
            this.selectDevice.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.selectDevice.options.forEach(function (item) { return item.deselect(); });
        }
    };
    MediaUploadComponent.prototype.optionClickDiveice = function () {
        var newStatus = true;
        this.selectDevice.options.forEach(function (item) {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allselectedDevice = newStatus;
    };
    // checkConfigure(event: any) {
    //   console.log(event.target.checked);
    //   // if (event.target.checked) {
    //   //   this.anyOneChecked = true;
    //   // } else {
    //   //   this.anyOneChecked = false;
    //   // }
    //   var clickedId = event.target.id
    //   let selectlist: any = document.getElementsByClassName("formSelect");
    //   // console.log(selectlist);
    //   var elementsArray = [...selectlist];
    //   // Use forEach to iterate over the array of elements
    //   elementsArray.forEach((element) => {
    //     // Do something with each element
    //     // console.log(element.id == clickedId);
    //     if (event.target.checked) {
    //       if (element.id == clickedId) {
    //         // console.log(clickedId);
    //         if (clickedId == "allstate") {
    //           this.isstateSelected = true;
    //           this.isDeviceselected = false;
    //           this.isLocationSelected = false;
    //           this.iscitySelected = false;
    //         } else if (clickedId == "allcity") {
    //           this.isstateSelected = false;
    //           this.isDeviceselected = false;
    //           this.isLocationSelected = false;
    //           this.iscitySelected = true;
    //         } else if (clickedId == "alllocation") {
    //           this.isstateSelected = false;
    //           this.isDeviceselected = false;
    //           this.isLocationSelected = true;
    //           this.iscitySelected = false;
    //         } else if (clickedId == "alldevice") {
    //           this.isstateSelected = false;
    //           this.isDeviceselected = true;
    //           this.isLocationSelected = false;
    //           this.iscitySelected = false;
    //         }
    //       }
    //       // element.checked = !element.checked;
    //     } else {
    //       // element.checked = false;
    //       this.isstateSelected = false;
    //       this.isDeviceselected = false;
    //       this.isLocationSelected = false;
    //       this.iscitySelected = false;
    //     }
    //   });
    // }
    MediaUploadComponent.prototype.enableScrollerFreeze = function (event) {
        // console.log(event?.checked);
        var _this = this;
        var loader = this.matDialog.open(loader_component_1.LoaderComponent, {
            panelClass: 'loader-upload'
        });
        this.clientService.freezeScroller(event === null || event === void 0 ? void 0 : event.checked, this.playListId).subscribe(function (res) {
            loader.close();
            sweetalert2_1["default"].fire('Saved!!', res === null || res === void 0 ? void 0 : res.message, 'success');
            // window.location.reload();
            _this.ngOnInit();
        }, function (err) {
            var _a;
            loader.close();
            sweetalert2_1["default"].fire('Saved!!', (_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.message, 'error');
        });
    };
    MediaUploadComponent.prototype.checkConfigure = function (event) {
        var _this = this;
        var clickedId = event.target.id;
        var selectlist = document.getElementsByClassName("formSelect");
        // console.log(selectlist);
        var elementsArray = __spreadArrays(selectlist);
        // Use forEach to iterate over the array of elements
        elementsArray.forEach(function (element) {
            // Do something with each element
            // console.log(element.id == clickedId);
            if (element.id == clickedId) {
                // console.log(clickedId);
                if (clickedId == "allstate") {
                    _this.isstateSelected = !_this.isstateSelected;
                    _this.isDistrictSelected = false;
                    _this.iscitySelected = false;
                    _this.isLocationSelected = false;
                    _this.isDeviceselected = false;
                }
                else if (clickedId == "allDistrict") {
                    _this.isstateSelected = false;
                    _this.isDistrictSelected = !_this.isDistrictSelected;
                    _this.iscitySelected = false;
                    _this.isLocationSelected = false;
                    _this.isDeviceselected = false;
                }
                else if (clickedId == "allcity") {
                    _this.isstateSelected = false;
                    _this.isDistrictSelected = false;
                    _this.iscitySelected = !_this.iscitySelected;
                    _this.isDeviceselected = false;
                    _this.isLocationSelected = false;
                }
                else if (clickedId == "alllocation") {
                    _this.isstateSelected = false;
                    _this.isDistrictSelected = false;
                    _this.iscitySelected = false;
                    _this.isLocationSelected = !_this.isLocationSelected;
                    _this.isDeviceselected = false;
                }
                else if (clickedId == "alldevice") {
                    _this.isstateSelected = false;
                    _this.isDistrictSelected = false;
                    _this.iscitySelected = false;
                    _this.isLocationSelected = false;
                    _this.isDeviceselected = !_this.isDeviceselected;
                }
                element.checked = true;
            }
            else {
                element.checked = false;
            }
        });
    };
    MediaUploadComponent.prototype.editPlaylist = function () {
        var _this = this;
        // console.log(this.allSelectedStateList);
        var payload = {
            playlist_id: this.playListId,
            statelist: this.allSelectedStateList,
            citylist: this.allSelectedCityList,
            locationlist: this.allSelectedLocationList,
            districtlist: this.allselectedDeviceList,
            devicelist: this.allSelectedDistrictList,
            scheduletype: "",
            forcelist: this.forceList
        };
        if (this.isstateSelected) {
            if (!this.allselectedDeviceList) {
                this.allselectedDeviceList = [];
            }
            payload = {
                playlist_id: this.playListId,
                statelist: this.allSelectedStateList,
                citylist: this.allSelectedCityList,
                locationlist: this.allSelectedLocationList,
                devicelist: this.allselectedDeviceList,
                districtlist: this.allSelectedDistrictList,
                scheduletype: "state",
                forcelist: this.forceList
            };
        }
        else if (this.isDistrictSelected) {
            if (!this.allselectedDeviceList) {
                this.allselectedDeviceList = [];
            }
            payload = {
                playlist_id: this.playListId,
                statelist: this.allSelectedStateList,
                citylist: this.allSelectedCityList,
                locationlist: this.allSelectedLocationList,
                devicelist: this.allselectedDeviceList,
                districtlist: this.allSelectedDistrictList,
                scheduletype: "district",
                forcelist: this.forceList
            };
        }
        else if (this.iscitySelected) {
            if (!this.allselectedDeviceList) {
                this.allselectedDeviceList = [];
            }
            payload = {
                playlist_id: this.playListId,
                statelist: this.allSelectedStateList,
                citylist: this.allSelectedCityList,
                locationlist: this.allSelectedLocationList,
                devicelist: this.allselectedDeviceList,
                districtlist: this.allSelectedDistrictList,
                scheduletype: "city",
                forcelist: this.forceList
            };
        }
        else if (this.isLocationSelected) {
            if (!this.allselectedDeviceList) {
                this.allselectedDeviceList = [];
            }
            payload = {
                playlist_id: this.playListId,
                statelist: this.allSelectedStateList,
                citylist: this.allSelectedCityList,
                locationlist: this.allSelectedLocationList,
                devicelist: this.allselectedDeviceList,
                districtlist: this.allSelectedDistrictList,
                scheduletype: "location",
                forcelist: this.forceList
            };
        }
        else if (this.isDeviceselected) {
            if (!this.allselectedDeviceList) {
                this.allselectedDeviceList = [];
            }
            payload = {
                playlist_id: this.playListId,
                statelist: this.allSelectedStateList,
                citylist: this.allSelectedCityList,
                locationlist: this.allSelectedLocationList,
                devicelist: this.allselectedDeviceList,
                districtlist: this.allSelectedDistrictList,
                scheduletype: "device",
                forcelist: this.forceList
            };
        }
        if (this.isScheduled) {
            // let timerInterval: any;
            // ;
            // Swal.fire({
            //   icon: "info",
            //   title: "Schedule is in progress, Try after the schedule completes",
            //   html: "I will close in &nbsp;<b> </b>&nbsp;milliseconds.",
            //   timer: 2500,
            //   timerProgressBar: true,
            //   didOpen: () => {
            //     Swal.showLoading();
            //     const timer: any = Swal?.getPopup()?.querySelector("b");
            //     timerInterval = setInterval(() => {
            //       timer.textContent = `${Swal.getTimerLeft()}`;
            //     }, 100);
            //   },
            //   willClose: () => {
            //     clearInterval(timerInterval);
            //   }
            // }).then((result) => {
            //   /* Read more about handling dismissals below */
            //   if (result.dismiss === Swal.DismissReason.timer) {
            //     console.log("I was closed by the timer");
            //   }
            // });
            // "<h5 style='color:red'>" + title + "</h5>"
            sweetalert2_1["default"].fire({
                title: "<b style='color:orange;'>Warning</b>",
                html: "<h2 style='color:green;'> Schedule is in progress, Try after the schedule is complete!!</h2>",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Stop Schedule!"
            }).then(function (result) {
                if (result.isConfirmed) {
                    _this.clientService.stopPlaylistSchedule(_this.playListId, _this.currentUser.username).subscribe(function (res) {
                        // console.log(res);
                        window.location.reload();
                        sweetalert2_1["default"].fire('Stopped!', 'Your playlist has been Stopped.', 'success');
                    });
                }
            });
        }
        else {
            var loader_2 = this.matDialog.open(loader_component_1.LoaderComponent, {
                panelClass: 'loader-upload'
            });
            this.clientService.editPlaylistStateLists(payload).subscribe(function (res) {
                console.log(res);
                sweetalert2_1["default"].fire('Edited!', res.message, 'success');
                loader_2.close();
                // window.location.reload()
                _this.ngOnInit();
            }, function (err) {
                loader_2.close();
                sweetalert2_1["default"].fire('Err!', err.error.message, 'error');
            });
        }
    };
    MediaUploadComponent.prototype.getDistrictbyStatelist = function () {
        var _this = this;
        var payload = {
            state_list: this.allSelectedStateList,
            clientname: this.playlist.clientname
        };
        this.clientService.getDistrictListByStateIdList(payload).subscribe(function (res) {
            // console.log(res);
            _this.alldistrictlist = res;
            _this.filteredListCity = res;
        });
    };
    MediaUploadComponent.prototype.getCitybyDistrictList = function () {
        var _this = this;
        var payload = {
            district_list: this.allSelectedDistrictList,
            clientname: this.playlist.clientname
        };
        this.clientService.getCityListByDistrictList(payload).subscribe(function (res) {
            // console.log(res);
            _this.allcitylist = res;
            _this.filteredListCity = res;
        });
    };
    MediaUploadComponent.prototype.getLocationByStateAndCity = function () {
        var _this = this;
        var payload = {
            city_list: this.allSelectedCityList,
            clientname: this.playlist.clientname
        };
        this.clientService.getLocationByStateAndCity(payload).subscribe(function (res) {
            // console.log(res);
            _this.alllocationlist = res;
            _this.filteredListLocation = res;
        });
    };
    MediaUploadComponent.prototype.getDeviceByLocation = function () {
        var _this = this;
        // console.log(this.allselectedDeviceList);
        var payload = {
            state_list: this.allSelectedStateList,
            district_list: this.allSelectedDistrictList,
            city_list: this.allSelectedCityList,
            location_list: this.allSelectedLocationList,
            clientname: this.playlist.clientname
        };
        // console.log(payload);
        this.clientService.getDeviceByLocationFilter(payload).subscribe(function (res) {
            // console.log(res);
            _this.alldevicelist = res;
            _this.filteredListDevice = res;
        });
        // this.clientService.getDeviceByLocation(payload).subscribe(res => {
        //   // console.log(res);
        //   this.alldevicelist = res;
        //   this.filteredListDevice = res;
        // })
    };
    MediaUploadComponent.prototype.removeAllDevices = function (e) {
        var _this = this;
        console.log(e);
        if (e.checked) {
            this.filteredListDevice.forEach(function (e) {
                // console.log(e);
                if (e.isexist) {
                    _this.forceList.push(e.id);
                    e.isexist = false;
                }
            });
        }
        else {
            this.forceList = [];
            this.getDeviceByLocation();
        }
        console.log(this.forceList);
    };
    __decorate([
        core_1.ViewChild('selectScroller')
    ], MediaUploadComponent.prototype, "select");
    __decorate([
        core_1.ViewChild('stateselect')
    ], MediaUploadComponent.prototype, "stateselect");
    __decorate([
        core_1.ViewChild('selectState')
    ], MediaUploadComponent.prototype, "selectState");
    __decorate([
        core_1.ViewChild('selectCity')
    ], MediaUploadComponent.prototype, "selectCity");
    __decorate([
        core_1.ViewChild('selectLocation')
    ], MediaUploadComponent.prototype, "selectLocation");
    __decorate([
        core_1.ViewChild('selectDevice')
    ], MediaUploadComponent.prototype, "selectDevice");
    __decorate([
        core_1.ViewChild('selectDistrict')
    ], MediaUploadComponent.prototype, "selectDistrict");
    MediaUploadComponent = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        core_1.Component({
            selector: 'app-media-upload',
            templateUrl: './media-upload.component.html',
            styleUrls: ['./media-upload.component.scss'],
            animations: [
                animations_1.trigger('showActions', [
                    animations_1.state('hidden', animations_1.style({
                        opacity: 0,
                        pointerEvents: 'none'
                    })),
                    animations_1.state('shown', animations_1.style({
                        opacity: 1,
                        pointerEvents: 'all'
                    })),
                    animations_1.transition('hidden => shown', animations_1.animate('100ms ease-in')),
                    animations_1.transition('shown => hidden', animations_1.animate('100ms ease-out')),
                ])
            ]
        })
    ], MediaUploadComponent);
    return MediaUploadComponent;
}());
exports.MediaUploadComponent = MediaUploadComponent;
