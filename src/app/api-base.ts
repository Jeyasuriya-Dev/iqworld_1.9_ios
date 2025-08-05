export class clienturl {

    static CURRENT_VERSION(): String {
        // return "v1.33"; //iq
        // return "v1.38" //qc
        return "v1.9"; //e2if
    }

    static RELEASE_DATE(): String {
        return "Monday, 26 May 2025";
        // return "Monday, 12 May 2025";
    }

    static AUTH_URL(): String {
        // return 'http://ads.e2is.in:8080/iqworld/api/auth';
        return 'https://ds.iqtv.in:8080/iqworld/api/auth';
        // return 'http://103.183.47.142:8080/iqworld/api/auth';
        // return 'http://192.168.70.100:8585/iqworld/api/auth';
        // return 'http://192.168.1.105:8083/api/auth';
        // return 'http://192.168.1.234:8083/api/auth';

    }

    static BASE_URL(): String {
        // return 'http://ads.e2is.in:8080/iqworld/api/v1';
        return 'https://ds.iqtv.in:8080/iqworld/api/v1';
        // return "http://103.183.47.142:8080/iqworld/api/v1";
        // return "http://192.168.70.100:8585/iqworld/api/v1";
        // return "http://192.168.1.105:8083/api/v1";
        // return "http://192.168.1.234:8083/api/v1";
    }
    static WEB_URL(): String {
        // return "http://ads.e2is.in";
        return "https://ds.iqtv.in";
        // return "http://103.183.47.142";
        // return "http://192.168.70.100";
        // return "http://192.168.1.103:4200";
    }

    // static getShapes() {
    //     let shapes = [
    //         {
    //             "shapeType": "Rectangle",
    //             "x": 50,
    //             "y": 50,
    //             "width": 100,
    //             "height": 75,
    //             "fill": "blue"
    //         },
    //         {
    //             "shapeType": "Circle",
    //             "x": 150,
    //             "y": 150,
    //             "radius": 50,
    //             "fill": "red"
    //         },
    //         {
    //             "shapeType": "Ellipse",
    //             "x": 250,
    //             "y": 150,
    //             "radiusX": 80,
    //             "radiusY": 40,
    //             "radius": 50,
    //             "fill": "green"
    //         },
    //         {
    //             "shapeType": "Line",
    //             "points": [50, 50, 200, 50, 200, 100],
    //             "stroke": "black",
    //             "strokeWidth": 2
    //         },
    //         {
    //             "shapeType": "Polygon",
    //             "x": 400,
    //             "y": 150,
    //             "sides": 6,
    //             "radius": 50,
    //             "fill": "purple"
    //         },
    //         {
    //             "shapeType": "Triangle",
    //             "x": 100,
    //             "y": 250,
    //             "text": "Hello, Konva!",
    //             "fontSize": 20,
    //             "fill": "yellow"
    //         }
    //     ]
    //     return shapes;
    // }

    static getColors() {
        let colors = [
            { "name": "Red", "code": "#FF0000" },
            { "name": "Crimson", "code": "#DC143C" },
            { "name": "Maroon", "code": "#800000" },
            { "name": "DarkRed", "code": "#8B0000" },
            { "name": "FireBrick", "code": "#B22222" },
            { "name": "Brown", "code": "#A52A2A" },
            { "name": "IndianRed", "code": "#CD5C5C" },
            { "name": "LightCoral", "code": "#F08080" },
            { "name": "Salmon", "code": "#FA8072" },
            { "name": "DarkSalmon", "code": "#E9967A" },
            { "name": "LightSalmon", "code": "#FFA07A" },
            { "name": "OrangeRed", "code": "#FF4500" },
            { "name": "DarkOrange", "code": "#FF8C00" },
            { "name": "Orange", "code": "#FFA500" },
            { "name": "Gold", "code": "#FFD700" },
            { "name": "DarkGoldenrod", "code": "#B8860B" },
            { "name": "Goldenrod", "code": "#DAA520" },
            { "name": "PaleGoldenrod", "code": "#EEE8AA" },
            { "name": "DarkKhaki", "code": "#BDB76B" },
            { "name": "Khaki", "code": "#F0E68C" },
            { "name": "Olive", "code": "#808000" },
            { "name": "Yellow", "code": "#FFFF00" },
            { "name": "YellowGreen", "code": "#9ACD32" },
            { "name": "DarkOliveGreen", "code": "#556B2F" },
            { "name": "OliveDrab", "code": "#6B8E23" },
            { "name": "LimeGreen", "code": "#32CD32" },
            { "name": "Lime", "code": "#00FF00" },
            { "name": "LawnGreen", "code": "#7CFC00" },
            { "name": "Chartreuse", "code": "#7FFF00" },
            { "name": "GreenYellow", "code": "#ADFF2F" },
            { "name": "SpringGreen", "code": "#00FF7F" },
            { "name": "MediumSpringGreen", "code": "#00FA9A" },
            { "name": "LightGreen", "code": "#90EE90" },
            { "name": "PaleGreen", "code": "#98FB98" },
            { "name": "DarkSeaGreen", "code": "#800CED1" },
            { "name": "CadetBlue", "code": "#5F9EA0" },
            { "name": "SteelBlue", "code": "#4682B4" },
            { "name": "LightSteelBlue", "code": "#B0C4DE" },
            { "name": "PowderBlue", "code": "#B0E0E6" },
            { "name": "LightBlue", "code": "#ADD8E6" },
            { "name": "SkyBlue", "code": "#87CEEB" },
            { "name": "LightSkyBlue", "code": "#87CEFA" },
            { "name": "DeepSkyBlue", "code": "#00BFFF" },
            { "name": "DodgerBlue", "code": "#1E90FF" },
            { "name": "CornflowerBlue", "code": "#6495ED" },
            { "name": "MediumSlateBlue", "code": "#7B68EE" },
            { "name": "RoyalBlue", "code": "#4169E1" },
            { "name": "Blue", "code": "#0000FF" },
            { "name": "MediumBlue", "code": "#0000CD" },
            { "name": "DarkBlue", "code": "#00008B" },
            { "name": "Navy", "code": "#000080" },
            { "name": "MidnightBlue", "code": "#191970" },
            { "name": "Purple", "code": "#800080" },
            { "name": "DarkSlateBlue", "code": "#483D8B" },
            { "name": "MediumPurple", "code": "#9370DB" },
            { "name": "BlueViolet", "code": "#8A2BE2" },
            { "name": "Indigo", "code": "#4B0082" },
            { "name": "DarkOrchid", "code": "#9932CC" },
            { "name": "DarkViolet", "code": "#9400D3" },
            { "name": "MediumOrchid", "code": "#BA55D3" },
            { "name": "Orchid", "code": "#DA70D6" },
            { "name": "Violet", "code": "#EE82EE" },
            { "name": "Plum", "code": "#DDA0DD" },
            { "name": "Thistle", "code": "#D8BFD8" },
            { "name": "Lavender", "code": "#E6E6FA" },
            { "name": "Magenta", "code": "#FF00FF" },
            { "name": "MediumVioletRed", "code": "#C71585" },
            { "name": "PaleVioletRed", "code": "#DB7093" },
            { "name": "DeepPink", "code": "#FF1493" },
            { "name": "HotPink", "code": "#FF69B4" },
            { "name": "LightPink", "code": "#FFB6C1" },
            { "name": "Pink", "code": "#FFC0CB" },
            { "name": "AntiqueWhite", "code": "#FAEBD7" },
            { "name": "Beige", "code": "#F5F5DC" },
            { "name": "Bisque", "code": "#FFE4C4" },
            { "name": "Black", "code": "#000000" },
            { "name": "Grey", "code": "#808080" },
            { "name": "DimGrey", "code": "#696969" },
            { "name": "LightGrey", "code": "#D3D3D3" },
            { "name": "white", "code": "#D3D3D3" }
        ]

        return colors;
    }
}   

