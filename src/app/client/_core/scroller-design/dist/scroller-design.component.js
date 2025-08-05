"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScrollerDesignComponent = void 0;
var core_1 = require("@angular/core");
var ScrollerDesignComponent = /** @class */ (function () {
    function ScrollerDesignComponent(storageService, clientService, alertService) {
        this.storageService = storageService;
        this.clientService = clientService;
        this.alertService = alertService;
        this.marqueeMessage = "Enter your text here";
        this.direction = "left";
        this.newScroller = "Add new Scroller";
        this.scrollname = "";
        this.scrollObj = {
            "id": "",
            "name": "",
            "clientname": "",
            "message": "",
            "isactive": true,
            "creationdate": "",
            "updateddate": "",
            "fncolor": "",
            "bgcolor": "",
            "fnsize": "",
            "width": "",
            "height": "",
            "behavior": "",
            "scrlspeed": "5",
            "direction": "",
            "x": "0",
            "y": "0"
        };
        this.scrollList = [{
                name: "",
                behavior: "",
                height: "auto",
                width: "auto",
                x: 0,
                y: 0,
                background: "black",
                fontSize: 35,
                color: "white",
                scrollamount: 20,
                message: "this.marqueeMessage",
                direction: "left"
            }
        ];
        this.isExist = false;
        this.behavior = "scroll";
        this.height = "auto";
        this.width = "auto";
        this.right = 0;
        this.top = 0;
        this.background = "#00000090";
        this.fontSize = 35;
        this.color = "white";
        this.scrollamount = 20;
        this.mStyle = {
            position: '',
            top: "",
            right: '',
            background: "",
            'font-size': "",
            color: "",
            height: "",
            width: "",
            padding: "inherit",
            "font-family": ""
        };
        this.ScrollerType = 2;
        this.ScrollerTypeList = [];
        this.fontFile = null;
        this.fontFamily = null;
        this.fontList = [
            {
                name: "Aller",
                face: "Source+Sans+Pro:900italic",
                style: {
                    fontFamily: "Aller",
                    fontWeight: "",
                    fontStyle: 'italic'
                }
            },
            {
                name: "Amatic",
                face: "Quattrocento+Sans",
                style: {
                    fontFamily: 'Amatic'
                }
            },
            {
                name: "Antonio",
                face: "Ubuntu:700",
                style: {
                    fontFamily: 'Antonio'
                }
            },
            {
                name: "Caviar Dreams",
                face: "Arizonia",
                style: {
                    fontFamily: 'Caviar-Dreams'
                }
            },
            {
                name: "Chunk five",
                face: "Lora:700",
                style: {
                    fontFamily: "Chunkfive",
                    fontWeight: 700
                }
            },
            {
                name: "Cooper hewitt",
                face: "Sansita+One",
                style: {
                    fontFamily: "Cooper-hewitt"
                }
            },
            {
                name: "FFF-Tusj",
                face: "Armata",
                style: {
                    fontFamily: "FFF-Tusj"
                }
            },
            {
                name: "Fira Sans",
                face: "Black+Ops+One",
                style: {
                    fontFamily: "fira-sans"
                }
            },
            {
                name: "Josefin Sans",
                face: "Russo+One",
                style: {
                    fontFamily: "josefin-sans"
                }
            },
            {
                name: "Kaushan",
                face: "Playfair+Display",
                style: {
                    fontFamily: "kaushan-script"
                }
            },
            {
                name: "Lato",
                face: "Roboto:700",
                style: {
                    fontFamily: "lato",
                    fontWeight: 700
                }
            },
            {
                name: "League Gothic",
                face: "Montserrat:800",
                style: {
                    fontFamily: "League-Gothic",
                    fontWeight: 800
                }
            },
            {
                name: "League Spartan",
                face: "Poppins:600",
                style: {
                    fontFamily: "league-spartan",
                    fontWeight: 600
                }
            },
            {
                name: "Lobster-I",
                face: "Merriweather:300italic",
                style: {
                    fontFamily: "Lobster",
                    fontStyle: 'italic',
                    fontWeight: 300
                }
            },
            {
                name: "Lobster-II",
                face: "Crimson+Text:700",
                style: {
                    fontFamily: "lobster-two",
                    fontWeight: 700
                }
            },
            {
                name: "Montserrat",
                face: "Oswald:400",
                style: {
                    fontFamily: "montserrat",
                    fontWeight: 400
                }
            },
            {
                name: "Norwester",
                face: "Inconsolata",
                style: {
                    fontFamily: "norwester"
                }
            },
            {
                name: "Open Sans",
                face: "Nunito:800",
                style: {
                    fontFamily: "open-sans",
                    fontWeight: 800
                }
            },
            {
                name: "Ostrich Sans",
                face: "Karla:700",
                style: {
                    fontFamily: "ostrich-sans",
                    fontWeight: 700
                }
            },
            {
                name: "Fira Sans",
                face: "Fira+Sans:300",
                style: {
                    fontFamily: "Fira Sans",
                    fontWeight: 300
                }
            },
            {
                name: "Oswald",
                face: "Raleway:600",
                style: {
                    fontFamily: "oswald",
                    fontWeight: 600
                }
            },
            {
                name: "Pacifico",
                face: "Dancing+Script",
                style: {
                    fontFamily: "pacifico"
                }
            },
            {
                name: "Playfair Display",
                face: "Pacifico",
                style: {
                    fontFamily: "playfair-display"
                }
            },
            {
                name: "Poppins",
                face: "Roboto+Condensed:700",
                style: {
                    fontFamily: "poppins",
                    fontWeight: 700
                }
            },
            {
                name: "Pt Sans",
                face: "Muli:600",
                style: {
                    fontFamily: "pt-sans",
                    fontWeight: 600
                }
            },
            {
                name: "Raleway",
                face: "Cabin:500",
                style: {
                    fontFamily: "raleway",
                    fontWeight: 500
                }
            },
            {
                name: "Red Hat",
                face: "Merriweather+Sans:700",
                style: {
                    fontFamily: "red-hat",
                    fontWeight: 700
                }
            },
            {
                name: "Roboto",
                face: "Lato:900",
                style: {
                    fontFamily: "roboto",
                    fontWeight: 900
                }
            },
            {
                name: "SeasideResortNF",
                face: "Open+Sans:800",
                style: {
                    fontFamily: "SeasideResortNF",
                    fontWeight: 800
                }
            },
            {
                name: "sofia",
                face: "Bebas+Neue",
                style: {
                    fontFamily: "sofia"
                }
            },
            {
                name: "Source Sans Pro",
                face: "Exo:600",
                style: {
                    fontFamily: "source-sans-pro",
                    fontWeight: 600
                }
            },
            {
                name: "Titillium",
                face: "Cormorant+Garamond",
                style: {
                    fontFamily: "Titillium"
                }
            }
        ];
    }
    ScrollerDesignComponent.prototype.ngDoCheck = function () {
        // console.log(this.selectedFont);
        this.mStyle = {
            position: 'relative',
            top: this.top + "px",
            right: this.right + 'px',
            background: this.background,
            'font-size': this.fontSize + 'px',
            color: this.color,
            height: this.height + "px",
            width: this.width + "px",
            padding: "inherit",
            "font-family": this.selectedFont
        };
        var doc = document.getElementById("marquee");
        doc.scrollAmount = this.scrollamount;
        if (this.marqueeMessage.length >= 1) {
            doc.style.display = "block";
        }
        else {
            doc.style.display = "none";
        }
        // console.log(this.mStyle);
    };
    ScrollerDesignComponent.prototype.selectFont = function (event) {
        this.selectedFont = event.target.value;
    };
    ScrollerDesignComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clientUsername = this.storageService.getClientUsername();
        this.clientService.getScrollerByClientname(this.clientUsername).subscribe(function (res) {
            // console.log(res);
            _this.scrollList = res;
        });
        this.clientService.getScrollerType().subscribe(function (res) {
            _this.ScrollerTypeList = res;
        });
    };
    ScrollerDesignComponent.prototype.addScroller = function (newsroller) {
        var _this = this;
        // console.log(newsroller.value);
        // let style = {
        //   name: newsroller.value,
        //   clientname: this.clientUsername,
        //   behavior: this.behavior,
        //   height: this.height,
        //   width: this.width,
        //   right: this.right,
        //   top: this.top,
        //   background: this.background,
        //   fontSize: this.fontSize,
        //   color: this.color,
        //   scrollamount: this.scrollamount,
        //   message: this.marqueeMessage,
        //   direction: this.direction
        // }
        var style = {
            name: this.scrollname,
            clientname: this.clientUsername,
            message: this.marqueeMessage,
            isactive: true,
            behavior: this.behavior,
            height: this.height,
            width: this.width,
            x: this.right,
            y: this.top,
            bgcolor: this.background,
            fnsize: this.fontSize,
            fontname: this.selectedFont,
            fncolor: this.color,
            scrlspeed: this.scrollamount,
            direction: this.direction,
            scroller_type: this.ScrollerType
        };
        // this.scroll.push(style);
        // console.log(this.scrollList);
        this.clientService.createScroller(style).subscribe(function (res) {
            // console.log(res);
            _this.clientService.getScrollerByClientname(_this.clientUsername).subscribe(function (res) {
                // console.log(res);
                _this.scrollList = res;
                _this.alertService.showSuccess(res === null || res === void 0 ? void 0 : res.message);
                _this.ngOnInit();
                // window.location.reload();
            });
        });
    };
    ScrollerDesignComponent.prototype.saveStyle = function (marquee) {
        // let style = {
        var _this = this;
        this.scrollObj.name = this.scrollname;
        this.scrollObj.clientname = this.clientUsername;
        this.scrollObj.message = this.marqueeMessage;
        this.scrollObj.isactive = true;
        this.scrollObj.behavior = this.behavior;
        this.scrollObj.height = this.height;
        this.scrollObj.width = this.width;
        this.scrollObj.x = this.right;
        this.scrollObj.y = this.top;
        this.scrollObj.bgcolor = this.background;
        this.scrollObj.fnsize = this.fontSize;
        this.scrollObj.fncolor = this.color;
        this.scrollObj.scrlspeed = this.scrollamount;
        this.scrollObj.direction = this.direction;
        this.scrollObj.clientname = this.clientUsername;
        this.scrollObj.scroller_type = this.ScrollerType;
        this.scrollObj.fontname = this.selectedFont;
        // console.log(this.scrollObj);
        this.clientService.updateScrollerByClientnameAndId(this.scrollObj).subscribe(function (res) {
            // console.log(res);
            _this.alertService.showSuccess(res.message);
            _this.ngOnInit();
            // window.location.reload();
        });
    };
    ScrollerDesignComponent.prototype.editSroller = function (obj) {
        var _a;
        // console.log(obj);
        this.scrollObj = obj;
        this.scrollname = obj.name;
        this.behavior = obj.behavior;
        this.height = obj.height;
        this.width = obj.width;
        this.right = obj.x;
        this.top = obj.y;
        this.background = obj.bgcolor;
        this.fontSize = obj.fnsize;
        this.color = obj.fncolor;
        this.scrollamount = obj.scrlspeed;
        this.marqueeMessage = obj.message;
        this.direction = obj.direction;
        this.ScrollerType = (_a = obj === null || obj === void 0 ? void 0 : obj.scrollTypeMaster) === null || _a === void 0 ? void 0 : _a.id;
        this.selectedFont = obj === null || obj === void 0 ? void 0 : obj.fontname;
    };
    ScrollerDesignComponent.prototype.deleteScroller = function (id) {
        var _this = this;
        this.clientService.deletScrollerById(id).subscribe(function (res) {
            // console.log(res);
            _this.alertService.showSuccess(res === null || res === void 0 ? void 0 : res.message);
            _this.ngOnInit();
        }, function (err) {
            var _a;
            _this.alertService.showError((_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.message);
        });
    };
    ScrollerDesignComponent.prototype.onFileChange = function (event) {
        console.log(event);
        var fileInput = event.target;
        if (fileInput.files && fileInput.files.length > 0) {
            var file = fileInput.files[0];
            this.readFontFile(file);
        }
    };
    ScrollerDesignComponent.prototype.readFontFile = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            // Read the font file data as a base64-encoded string
            var fontData = e.target.result;
            // Create a data URI for the font file
            var fontDataUri = "data:application/font-woff;charset=utf-8;base64," + btoa(fontData);
            // Apply the font using @font-face
            _this.applyFontStyle(fontDataUri, file.name.split(".")[0]);
        };
        reader.readAsBinaryString(file);
    };
    ScrollerDesignComponent.prototype.applyFontStyle = function (fontDataUri, Fontname) {
        this.selectedFont = Fontname; // You can use any font name here
        var style = document.createElement('style');
        style.appendChild(document.createTextNode("\n      @font-face {\n        font-family: '" + this.selectedFont + "';\n        src: url('" + fontDataUri + "') format('woff');\n      }\n    "));
        document.head.appendChild(style);
    };
    ScrollerDesignComponent = __decorate([
        core_1.Component({
            selector: 'app-scroller-design',
            templateUrl: './scroller-design.component.html',
            styleUrls: ['./scroller-design.component.scss']
        })
    ], ScrollerDesignComponent);
    return ScrollerDesignComponent;
}());
exports.ScrollerDesignComponent = ScrollerDesignComponent;
