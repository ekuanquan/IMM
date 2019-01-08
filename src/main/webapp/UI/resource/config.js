
;(function(window,$){
    window.getVideoServerIp=_getVideoServerIp;
    window.getAkeyServerIp=_getAkeyServerIp;
    var _config = {
        videoServerIp: "10.26.2.222",//NVR流转服务IP
        akeyServer: "10.26.2.221",//一键报警流转服务IP
    }
    function _getVideoServerIp() {
        return _config.videoServerIp;
    }
    function _getAkeyServerIp() {
        return _config.akeyServer;
    }
})(window,jQuery);