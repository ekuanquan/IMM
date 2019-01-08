/**
 * Created by admin on 2016/10/16.
 */
/**
 * Created by admin on 2016/6/20.
 */
define(['require',
    'base/jTop'
], function (require) {
    var jTop = require('base/jTop');
    (function (global, win) {
        global.LatLng = function (setting) {
            var _self = this;
        };
        global.LatLng.prototype = {
            x_pi: 3.14159265358979324 * 3000.0 / 180.0,
            pi: 3.14159265358979324,
            a: 6378245.0,
            ee:0.00669342162296594323,
            wgs_gcj_encrypts:function(wgLat, wgLng) {
                var _self = this;
                var point={};
                var dLat = _self.transformLat(wgLng - 105.0, wgLat - 35.0);
                var dLng = _self.transformLng(wgLng - 105.0, wgLat - 35.0);
                var radLat = wgLat / 180.0 * _self.pi;
                var magic = Math.sin(radLat);
                magic = 1 - _self.ee * magic * magic;
                var sqrtMagic = Math.sqrt(magic);
                dLat = (dLat * 180.0) / ((_self.a * (1 - _self.ee)) / (magic * sqrtMagic) * _self.pi);
                dLng = (dLng * 180.0) / (_self.a / sqrtMagic * Math.cos(radLat) * _self.pi);
                var lat = wgLat + dLat;
                var lon = wgLng + dLng;
                point['lng']=lon;
                point['lat']=lat;
                return point;
            },
            transformLat:function(x, y) {
                var pi = this.pi;
                var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
                return ret;
            },
            transformLng:function(x, y) {
                var pi = this.pi;
                var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
                return ret;
            },
            gcj_To_Gps84:function(lat,lng) {
                var point = this.transform(lat, lng);
                var lontitude = lng * 2 - point['lng'];
                var latitude = lat * 2 - point['lat'];
                point['lng'] = lontitude;
                point['lat'] = latitude;
                return point;
            },
            transform:function(lat, lng) {
                var _self = this;
                var point = {};
                var dLat = _self.transformLat(lng - 105.0, lat - 35.0);
                var dLng = _self.transformLng(lng - 105.0, lat - 35.0);
                var radLat = lat / 180.0 * _self.pi;
                var magic = Math.sin(radLat);
                magic = 1 - _self.ee * magic * magic;
                var sqrtMagic = Math.sqrt(magic);
                dLat = (dLat * 180.0) / ((_self.a * (1 - _self.ee)) / (magic * sqrtMagic) * _self.pi);
                dLng = (dLng * 180.0) / (_self.a / sqrtMagic * Math.cos(radLat) * _self.pi);
                var mgLat = lat + dLat;
                var mgLng = lng + dLng;
                point['lng']=mgLng;
                point['lat']=mgLat;
                return point;
            }
        }
    })(jTop, window);
    return jTop.LatLng;
})