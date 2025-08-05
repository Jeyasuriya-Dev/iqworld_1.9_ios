"use strict";
exports.__esModule = true;
exports.clienturl = void 0;
var clienturl = /** @class */ (function () {
    function clienturl() {
    }
    clienturl.CURRENT_VERSION = function () {
        return "v1.8";
    };
    clienturl.AUTH_URL = function () {
        // return 'http://ds.iqtv.in:8082/api/auth';
        return 'http://192.168.1.105:8082/api/auth';
    };
    clienturl.BASE_URL = function () {
        // return 'http://ds.iqtv.in:8082/api/v1';
        return "http://192.168.1.105:8082/api/v1";
    };
    clienturl.WEB_URL = function () {
        // return "http://ds.iqtv.in";
        return "http://192.168.1.103:4200";
    };
    clienturl.getShapes = function () {
        var shapes = [
            {
                "shapeType": "Rectangle",
                "x": 50,
                "y": 50,
                "width": 100,
                "height": 75,
                "fill": "blue"
            },
            {
                "shapeType": "Circle",
                "x": 150,
                "y": 150,
                "radius": 50,
                "fill": "red"
            },
            {
                "shapeType": "Ellipse",
                "x": 250,
                "y": 150,
                "radiusX": 80,
                "radiusY": 40,
                "radius": 50,
                "fill": "green"
            },
            {
                "shapeType": "Line",
                "points": [50, 50, 200, 50, 200, 100],
                "stroke": "black",
                "strokeWidth": 2
            },
            {
                "shapeType": "Polygon",
                "x": 400,
                "y": 150,
                "sides": 6,
                "radius": 50,
                "fill": "purple"
            },
            {
                "shapeType": "Triangle",
                "x": 100,
                "y": 250,
                "text": "Hello, Konva!",
                "fontSize": 20,
                "fill": "yellow"
            }
        ];
        return shapes;
    };
    return clienturl;
}());
exports.clienturl = clienturl;
