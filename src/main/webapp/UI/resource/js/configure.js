
$(document).ready(function () {
    configure();
});
;(function (window,$) {
    window.configure = _configure;

    //退出配置
    var location = "https://";// 前缀为 http或者https
    //var serverInfo = "win-vud72jmvs9p:8843";// 此处改成所用单点的服务计算机名（或IP）和端口
    var serverInfo = "win-Q0ARVVE1HGR:8843";// 此处改成所用单点的服务计算机名（或IP）和端口
    //地图
    var mapServer="http://10.26.40.20:2098/";// 此处改成具体的地图服务地址

    function _configure(index) {
        switch (index){
            case "location":
                return location;
                break;
            case "serverInfo":
                return serverInfo;
                break;
            case "mapServer":
                return mapServer;
                break;
            default:
                break;
        }
    }

})(window,jQuery);