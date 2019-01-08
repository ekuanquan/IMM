$(document).ready(function () {
    inti();
});

;(function (window, $) {
    window.inti = _init;
    window.Interfacetojs = _Interfacetojs;

    var _global = {
        PlayStatus:{
            video:"2",
            live:'2',
        },

        NVRUrl: {
            videoUrl: '',
            liveUrl: ''
        },
        NVRVideoPojo: {
            devLoginName: '',
            devLoginPwd: '',
            devChannelId: '',
            devTUTKID: '',
            videoServer: '',
            videoUrlSuf: ''

        }

    };

    function _init() {
        _initEvent();
        _initData();
    }

    function _initEvent() {
        $("#left_start").bind('click', function (event) {
            if(_global.PlayStatus.video == '-3'){
                _stopToStart();
                _global.PlayStatus.video = '2';
                $('#left_start').removeClass('start').addClass("pause").text('暂停');
            }else{
                var p = _plugin("Object_leftVideo");
                _changePlayStatus(p, 'left');
            }

        });
        $("#right_start").bind('click', function (event) {
            if(_global.PlayStatus.live == '-3'){
                _exefuncRight(_global.NVRUrl.liveUrl);
            }else{
                var p = _plugin("Object_rightVideo");
                _changePlayStatus(p, 'right');
            }

        });
        $("#left_stop").bind('click', function (event) {

            var p = _plugin("Object_leftVideo");
            p.StopPlay();
            _global.PlayStatus.video ='-3';
            $('#left_start').removeClass('pause').addClass("start").text('播放');
        });
        $("#left_stop").hover(function () {
            $(this).children('.stop_img').css('background-position','0px');
        },function () {
            $(this).children('.stop_img').css('background-position','-10px');
        });


        $("#left_fullScreen").bind('click', function (event) {
            if ($(this).hasClass('fullscreen')) {
                if (parent._changeUpSize && typeof(parent._changeUpSize) == 'function') {
                    parent._changeUpSize({
                        width: 1310,
                        height: 440
                    });
                }
                //_changeCss('./linkageVideo.css');
                _leftSwitchFull();
                $(this).removeClass('fullscreen');
            } else {
                if (parent._changeUpSize && typeof(parent._changeUpSize) == 'function') {
                    parent._changeUpSize({
                        width: 1300,
                        height: 800
                    });
                }
                //_changeCss('./videoFullScreen.css');
                _leftSwitchFull();
                $(this).addClass('fullscreen');
            }
        });
        $("#right_fullScreen").bind('click', function (event) {


            if ($(this).hasClass('fullscreen')) {
                if (parent._changeUpSize && typeof(parent._changeUpSize) == 'function') {
                    parent._changeUpSize({
                        width: 1310,
                        height: 440
                    });
                }

                //_changeCss('./linkageVideo.css');
                _rightSwitchFull();
                $(this).removeClass('fullscreen');
            } else {
                if (parent._changeUpSize && typeof(parent._changeUpSize) == 'function') {
                    parent._changeUpSize({
                        width: 1300,
                        height: 800
                    });
                }
                _rightSwitchFull();
                //_changeCss('./liveFullScreen.css');
                $(this).addClass('fullscreen');
            }
        });


    }

    function _initData() {
        parent.parent._setTitle2("联动视频");
        if (parent.parent.mainDivIframe.alterUserIframe.getNVRVideoPojo && typeof(parent.parent.mainDivIframe.alterUserIframe.getNVRVideoPojo) == 'function') {
            var rowData = parent.parent.getPopupsRowJson();
            var eventTime = rowData.datetime;
            eventTime = eventTime.replace('T', ' ');
            // 获取某个时间格式的时间戳
            var timestamp2 = Date.parse(new Date(eventTime));
            var startTime = timestamp2 - 30000;
            var endTime = timestamp2 + 30000;
            startTime = formatNVRDateTime(startTime);
            endTime = formatNVRDateTime(endTime);

            _global.NVRVideoPojo = parent.parent.mainDivIframe.alterUserIframe.getNVRVideoPojo();
            var NVRVideoPojo = _global.NVRVideoPojo;

            if(NVRVideoPojo.nvrDevType == '10'){
                _global.NVRUrl.videoUrl = "rtsp://127.0.0.1:9009/" + NVRVideoPojo.devTUTKID + ":0:P2P_TUTK_RECORD:" + NVRVideoPojo.devChannelId + ':0:' +
                    NVRVideoPojo.devLoginName + ':' + NVRVideoPojo.devLoginPwd + '/' + startTime + ":" + endTime;
            }else if(NVRVideoPojo.nvrDevType == '9'){
                if(NVRVideoPojo.manufacturer == 'HIK'){
                    _global.NVRUrl.videoUrl = "rtsp://127.0.0.1:9009/" + NVRVideoPojo.wireDevIp + ":"+NVRVideoPojo.wireDevPort+":HIK_DVR:"+NVRVideoPojo.devChannelId+":0:"+
                        NVRVideoPojo.wireDevLoginName + ':' + NVRVideoPojo.wireDevLoginPwd + '/' + startTime + ":" + endTime;
                }else if(NVRVideoPojo.manufacturer == 'DH'){
                    _global.NVRUrl.videoUrl = "rtsp://127.0.0.1:9009/" + NVRVideoPojo.wireDevIp + ":"+NVRVideoPojo.wireDevPort+":DH_DVR:"+NVRVideoPojo.devChannelId+":0:"+
                        NVRVideoPojo.wireDevLoginName + ':' + NVRVideoPojo.wireDevLoginPwd + '/' + startTime + ":" + endTime;
                }
            }

            _global.NVRUrl.liveUrl = 'rtsp://' + NVRVideoPojo.videoServer + NVRVideoPojo.videoUrlSuf;
        }
        console.log("_global.NVRUrl.videoUrl: "+_global.NVRUrl.videoUrl);
        _exefuncLeft(_global.NVRUrl.videoUrl);
        _exefuncRight(_global.NVRUrl.liveUrl);
    }

    function _leftSwitchFull() {
        if ($("#left_stop").hasClass('stop_full')) {
            $("body").removeClass('body');
            $("#left_content").addClass('left_content').removeClass('left_content_full');
            $("#left_content_video_container").addClass('content_video_container').removeClass('content_video_container_full');
            $("#left_content_title").addClass('content_title').removeClass('content_title_full');
            $("#left_stop").removeClass('stop_full');
            $("#right_content").removeClass('hide_content');
        } else {
            $("body").addClass('body');
            $("#left_content").removeClass('left_content').addClass('left_content_full');
            $("#left_content_video_container").removeClass('content_video_container').addClass('content_video_container_full');
            $("#left_content_title").removeClass('content_title').addClass('content_title_full');
            $("#left_stop").addClass('stop_full');
            $("#right_content").addClass('hide_content');
        }


    }

    function _rightSwitchFull() {
        if ($("#right_stop").hasClass('stop_full')) {
            $("body").removeClass('body');
            $("#right_content").removeClass('right_content_full').addClass('right_content');
            $("#right_content_video_container").removeClass('content_video_container_full').addClass('content_video_container');
            $("#right_content_title").removeClass('content_title_full').addClass('content_title');
            $("#right_stop").removeClass('stop_full');
            $("#left_content").removeClass('hide_content');
        } else {
            $("body").addClass('body');
            $("#right_content").removeClass('right_content').addClass('right_content_full');
            $("#right_content_video_container").removeClass('content_video_container').addClass('content_video_container_full');
            $("#right_content_title").removeClass('content_title').addClass('content_title_full');
            $("#right_stop").addClass('stop_full');
            $("#left_content").addClass('hide_content');
        }


    }


    function _plugin(id) {
        return document.getElementById(id);
    }


    function _exefuncStopToStart(url){
        var p = _plugin("Object_leftVideo");
        p.play_id = 10;
        p.SetDealmodle(1);
        p.SetStyle(1, 0);
        p.RandPlay(url, 0);
    }
    function _exefuncLeft(url) {

        var p = _plugin("Object_leftVideo");
        p.play_id = 10;
        p.SetDealmodle(1);
        p.SetStyle(1, 0);

        p.StopPlay();
        p.RandPlay(url, 0);

    }

    function _exefuncRight(url) {

        var p = _plugin("Object_rightVideo");
        p.play_id = 11;
        p.SetDealmodle(1);
        p.SetStyle(0, 0);

        p.StopPlay();
        p.SetReplayFlag(1);
        p.RandPlay(url, 0);

    }
    
    function _stopToStart() {
        //_exefuncLeft(_global.NVRUrl.videoUrl);
        _exefuncStopToStart(_global.NVRUrl.videoUrl)
    }
    
    function _changePlayStatus(p,left_right) {
        if(left_right == 'left'){
            if (_global.PlayStatus.video == '2') {
                p.PlayCommand('-2');
            } else if (_global.PlayStatus.video == '-2') {
                p.PlayCommand('2');
            }
        }else if(left_right == 'right'){
            if (_global.PlayStatus.live == '2') {
                p.PlayCommand('-2');
            } else if (_global.PlayStatus.live == '-2') {
                p.PlayCommand('2');
            }
        }

    }

    /**
     * 插件的事件监听接口
     *
     */
    function _Interfacetojs(play_id, action, url, NotUse) {
        if (action == "LButtonMsg" && play_id != null) { //点击事件

        } else if (action == "LDButtonMsg" && play_id != null) { //双击事件

        } else if (action == "mousemoveMsg" && play_id != null) { //鼠标移动事件
            //alert('鼠标移动事件')
        } else if (action == "TUTKRecordList") { //插件返回时间

        } else if (action == "stopplayMsg" && url == "000") { //播放停止则播放下一条
            //alert("播放完毕");
            if (play_id == 10) {
                //alert("播放完毕10");
                $('#left_start').removeClass('pause').addClass("start").text('播放');
                _global.PlayStatus.video = '-3';
            }
            if (play_id == 11) {
                //alert("播放完毕11");
                $('#right_start').removeClass('pause').addClass("start").text('播放');
                _global.PlayStatus.live = '-3';

            }

        } else if (action == "startplayMsg") { //播放状态事件
            if (url == "004") {  //连接失败
                if(play_id == 10){
                    $('#left_start').removeClass('pause').addClass("start").text('播放');
                    _global.PlayStatus.video = '-3';
                }else if(play_id == 11){
                    $('#right_start').removeClass('pause').addClass("start").text('播放');
                    _global.PlayStatus.live = '-3';
                }
            }

            if (url == "010") { //无法播放
                if(play_id == 10){
                    $('#left_start').removeClass('pause').addClass("start").text('播放');
                    _global.PlayStatus.video = '-3';
                }else if(play_id == 11){
                    $('#right_start').removeClass('pause').addClass("start").text('播放');
                    _global.PlayStatus.live = '-3';
                }
            }
            if (url == "112") {  //成功播放
                if(play_id == 10){
                    $('#left_start').removeClass('start').addClass("pause").text('暂停');
                    _global.PlayStatus.video = '2';
                }else if(play_id == 11){
                    $('#right_start').removeClass('start').addClass("pause").text('暂停');
                    _global.PlayStatus.live = '2';
                }
            }
        } else if (action == "ChangePlayState") {
            if (play_id == 10) {
                if (url == "2") {
                    //alert("2");
                    $('#left_start').removeClass('start').addClass("pause").text('暂停');
                    _global.PlayStatus.video = '2';
                } else if (url == "-2") {
                    //alert("-2");
                    $('#left_start').removeClass('pause').addClass("start").text('播放');
                    _global.PlayStatus.video = '-2';
                }
            } else if (play_id == 11) {
                if (url == "2") {
                    //alert("2");
                    $('#right_start').removeClass('start').addClass("pause").text('暂停');
                    _global.PlayStatus.live = '2';
                } else if (url == "-2") {
                    //alert("-2");
                    $('#right_start').removeClass('pause').addClass("start").text('播放');
                    _global.PlayStatus.live = '-2';
                }
            }

        }

    }


})(window, jQuery);

