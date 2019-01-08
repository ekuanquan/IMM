charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ($, window) {
    window.init = _init;//修改页面大小
    window.searchEventInfo = _searchEventInfo;
    var _config = {
        ajaxUrl: {
            queryEventStatisticsUrl:'/IntegratedMM/query/queryEventStatistics.do',
            queryCodeTypeStatisticsUrl:'/IntegratedMM/query/queryCodeTypeStatistics.do',
            getCodeMemoUrl:'/IntegratedMM/query/getCodeMemo.do',
            queryEventStatisticsByDayUrl:'/IntegratedMM/query/queryEventStatisticsByDay.do',
            querySysCodeStatisticsUrl:'/IntegratedMM/query/querySysCodeStatistics.do'
        }
    };
    var _global = {
        datajson :{
            dataname : ['火警', '劫盗', '紧急','报警'],
            datanum:[0, 0, 0,0],
            code:[]
        },
        firenum:'',                 //火警总数
        faulnum:'',                 //故障总数
        sysnum:'',                  //超测总数
        statisticsPojos:
            {
                time:"2017-09-01;2017-09-30",
                queryPojo:{
                    key:"eventclass",
                    value:"3"
                }
            },
            datetime:[],
            data:[],
        codeMemo:[]

    };

    function _init() {
        _initData();
        _initEven();
    }
    function _initData() {
        var Time = getNowFormatDate();
        Time =Time.split(" ")[0];
        Time = Time.substring(0,7);
        $('#search_select').val(Time);
        $('#search_select').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM',
                isShowClear: false
            });
            //this.blur();
        });
    }
    function _searchEventInfo(){
        $("#sure").click();
    }

    function _initEven() {
        $("#sure").bind('click',function () {
            $(".list div").empty();
            $("#one_time").text($("#search_select").val());
            var param = $("#search_select").val();
            post_async({month:param},_config.ajaxUrl.queryEventStatisticsUrl,callbackpie);              // 饼图
            post_async({month:param},_config.ajaxUrl.queryCodeTypeStatisticsUrl,callbackfireal);        //火警
            var time='';
            var year = param.substring(0,4);
            var month = param.substring(5,7);
            var base = new Date(year,month,0);
            var monthnum = base.getDate();
            //初始化
            _global.datetime =[];
            var time='';
                time = year+ '-' + month+ '-' + '01'+';'+year+ '-' +month+ '-'+monthnum;
                for(var i=1;i<=monthnum;i++){
                    if(i<10){
                        _global.datetime[i-1] = year+ '-' + month+ '-'+'0'+i;
                    }
                    else {
                        _global.datetime[i-1] = year+ '-' + month+ '-'+i;
                    }

                }
                _global.statisticsPojos.time = time;
            _global.statisticsPojos.queryPojo.key = "eventclass";
            _global.statisticsPojos.queryPojo.value = '3';
            post_async(_global.statisticsPojos,_config.ajaxUrl.queryEventStatisticsByDayUrl,callbacksys);//超测
            post_async({month:param},_config.ajaxUrl.querySysCodeStatisticsUrl,callbackfaulet);    //故障
        });
        //默认加载数据
        $("#sure").click();
    }
    /***************************
     饼图的回调函数
     *************************/
    function callbackpie(data) {
       var datajson =[
           {value:0, name:'报警'},
            {value:0, name:'故障'},
            {value:0, name:'超测'},
            /*{value:0, name:'系统'},*/
        ];
        $("#police_nun").text('0');
        $("#fault_num").text('0');
        $("#Supertested_num").text('0')
        $("#system_num").text('0');
        var numall = 0;
        var eventClassPojos = data.EventClassPojos;
        if(data.result.code == '0') {
            for (var i = 0; i < eventClassPojos.length; i++) {
                switch (eventClassPojos[i].evtWat) {
                    case "1":
                        var num = parseInt(eventClassPojos[i].num);
                        datajson[0].value = num;
                        $("#police_nun").text(num);
                        numall += num;
                        break;
                    case "4":
                        var num = parseInt(eventClassPojos[i].num);
                        datajson[1].value = num;
                        $("#fault_num").text(num);
                        numall += num;
                        break;
                    case "3":
                        var num = parseInt(eventClassPojos[i].num);
                        datajson[2].value = num;
                        $("#Supertested_num").text(num);
                        numall += num;
                        break;
                    case "5":
                        var num = parseInt(eventClassPojos[i].num);
                        //datajson[3].value= num;
                        $("#system_num").text(num);
                        numall += num;
                        break;
                    default:
                        break;
                }
            }
        }
        $("#all_num").text(numall);
        pie(datajson);
    }
    /***************************
     报警信息的回调函数
     *************************/
    function callbackfireal(data) {
        _global.datajson.dataname=['火警', '劫盗', '紧急','报警'];
        _global.datajson.datanum=[0, 0, 0,0];
        _global.datajson.code=[];
        var CodeTypePojos = data.CodeTypePojos;
        var result = data.result;
        if(result.code == 0){
            for(var i=0;i<CodeTypePojos.length;i++){
                switch (CodeTypePojos[i].codeTypeId) {
                    case "3":
                        var num = parseInt(CodeTypePojos[i].num);
                        _global.datajson.datanum[0]= num;
                        _global.datajson.dataname[0] = '火警';
                        _global.datajson.code[0] = CodeTypePojos[i].codeTypeId;
                        break;
                    case "4":
                        var num = parseInt(CodeTypePojos[i].num);
                        _global.datajson.datanum[1]= num;
                        _global.datajson.dataname[1] = '劫盗';
                        _global.datajson.code[1] = CodeTypePojos[i].codeTypeId;
                        break;
                    case "1":
                        var num = parseInt(CodeTypePojos[i].num);
                        _global.datajson.datanum[2]= num;
                        _global.datajson.dataname[2] = '紧急';
                        _global.datajson.code[2] = CodeTypePojos[i].codeTypeId;
                        break;
                    case "2":
                        var num = parseInt(CodeTypePojos[i].num);
                        _global.datajson.datanum[3]= num;
                        _global.datajson.dataname[3] = '报警';
                        _global.datajson.code[3] = CodeTypePojos[i].codeTypeId;
                        break;
                    default:
                        break;
                }
            }
        }
        _global.firenum = 0;
        for(var i=0;i<_global.datajson.datanum.length;i++){
            _global.firenum += _global.datajson.datanum[i];
        }

        firealarm(_global.datajson);
    }
    /***************************
     超测信息的回调函数
     *************************/
    function callbacksys(data) {

        var sysdata={
            dataname:[],
            datanum:[]
        };
        //初始化
        _global.data = [];
        if(data.result.code == 0){
            for(var i=0;i<data.statisticsPojos.length;i++){
                sysdata.dataname[i] = data.statisticsPojos[i].time;
                sysdata.datanum[i] = data.statisticsPojos[i].num;
            }
            for(var i=0;i<_global.datetime.length;i++){
                for(var j=0;j<sysdata.dataname.length;j++){
                    if(_global.datetime[i] == sysdata.dataname[j]){
                        _global.data[i] = sysdata.datanum[j];
                        break;
                    }
                    else {
                        _global.data[i] = 0;
                    }
                }
            }
        }
        //统计总数
        _global.sysnum = 0;
        for(var i=0;i<_global.data.length;i++){
            _global.sysnum += parseInt(_global.data[i]);
        }
        system();
    }
    /**********************************
     故障信息的回调
     *************************************/
    function callbackfaulet(data) {
        var datafaulet = [0,0,0];
        if(data.result.code == 0){
            for(var i=0;i<data.SysCodePojos.length;i++){
                if(data.SysCodePojos[i].codeId =='302'||data.SysCodePojos[i].codeId=='712'||data.SysCodePojos[i].codeId=='818' ){
                    datafaulet[0] +=parseInt(data.SysCodePojos[i].num);
                }
                else if(data.SysCodePojos[i].codeId =='301'||data.SysCodePojos[i].codeId=='710'){
                    datafaulet[1] +=parseInt(data.SysCodePojos[i].num);
                }
                else if(data.SysCodePojos[i].codeId =='3B2'||data.SysCodePojos[i].codeId=='3B3'||data.SysCodePojos[i].codeId =='804'||data.SysCodePojos[i].codeId=='920'){
                    datafaulet[2] +=parseInt(data.SysCodePojos[i].num);
                }
            }
        }
        //计算总数
        _global.faulnum = 0;
        for(var i=0;i<datafaulet.length;i++){
            _global.faulnum += datafaulet[i];
        }
        fault(datafaulet);
    }
    function pie(datajson) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_oneright'));

// 指定图表的配置项和数据
        option = {
            tooltip: {
                show:false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            color:['#E95757','#EDB302','#0275A9','#9BBA33'],//手动设置颜色值
            graphic:{                       //用水
                type:'text',
                /* left:'center',*/
                left:'40%',
                top:'center',
                style:{
                    text:'综合事件',
                    textAlign:'center',
                    font:'18px "Microsoft YaHei",sans-serif',//  size | family
                    fill:'#000',
                    /* width:30,
                     height:30*/
                }
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    center:['50%','50%'],
                    radius: ['30%', '40%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            /* position: 'innre'*/
                            position:'outside',
                            formatter: "{b}\n{d}%",
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color:'#000',
                                shadowColor: 'rgba(0, 0, 0, 0)',
                                shadowBlur: 0,
                                /*color: 'rgba(102, 102, 102, 1)'*/},
                            /*smooth: 0.2,*///引导线的弧度值
                            length: 20,
                            length2: 20
                        }
                    },
                    /*data:[
                        {value:92, name:'报警'},
                        {value:30, name:'故障'},
                        {value:30, name:'超测'},
                        {value:8, name:'系统'},
                    ]*/
                    data:datajson
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        //更新数据显示

    }
    function system() {
        //var data = _init();
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_four'));
        option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title:[
                {
                    text: '.',
                    textStyle: {
                        color:'#0277A8',
                        fontSize:80,
                    },
                    padding:[-25,0,0,0],
                    /*top:'5%',*/
                },
                {
                    text: '超测信息汇总',
                    textStyle: {
                        fontFamily:'微软雅黑',
                    },
                    padding:[5,0,0,25],
                    top:'5%',
                },
                {
                    text: '（超测总数：'+ _global.sysnum +'）',
                    top:'5%',
                    textStyle: {
                        color:'#2E85B3',
                        fontSize:14,
                        fontFamily:'微软雅黑',
                        fontWeight:'normal',
                    },
                    padding:[8,0,0,135],
                },

            ],
            color: ['#3398DB'],
            grid: {
                top:'20%',              //容器离上方的距离
                left: '3%',
                right: 263,
                /*right: '4%',*/
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {
                    name:'时间',
                    type : 'category',
                    //data : data.week,
                    boundaryGap: false,
                    //data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
                    data:_global.datetime
                    /*axisTick:{
                        show:false,//坐标轴刻度不显示
                    },*/
                }
            ],
            yAxis : [
                {
                    show:true,
                    type : 'value',
                    boundaryGap: [0, '100%'],
                    name:'数量',
                    /*axisTick:{
                        show:false,//坐标轴刻度不显示
                    },*/
                    nameLocation:'end',//y轴标题的位置
                    //min:50,//y轴的起始值
                    fontSize:20,
                    splitLine:{
                        /*show:false,//去掉网格线*/
                        show:true,
                    },
                }
            ],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                //bottom:10,
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series : [
                {
                    name:'',
                    type:'line',
                    smooth:'true',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal:{
                            color:'#66ADCB',
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#B1D5E5'
                            }, {
                                offset: 1,
                                color: '#66ADCB'
                            }])
                        }
                    },
                    barWidth: 17,//柱图的宽度
                    data:_global.data
                    //data: [12,15,15,13,65,22,56,1,78,15,5,6,52,6,5,8,9,6,14,15]
                }
            ]
        };
// 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    function fault(datafaulet) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_three'));
        option = {
            title:[
                {
                    text: '.',
                    textStyle: {
                        color:'#EEB501',
                        fontSize:80,
                    },
                    padding:[-25,0,0,0],
                    /*top:'5%',*/
                },
                {
                    text: '故障信息汇总',
                    padding:[5,0,0,25],
                    top:'5%',
                },
                {
                    text: '（故障总数：'+ _global.faulnum +'）',
                    top:'5%',
                    textStyle: {
                        color:'#EFC34D',
                        fontSize:14,
                        fontFamily:'微软雅黑',
                        fontWeight:'normal',
                    },
                    padding:[8,0,0,135],
                },
            ],
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'20%',
                left: '3%',
                /* right: '4%',*/
                right:283,
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name:'类型',
                    type : 'category',
                    axisTick:{
                        show:false,//坐标轴刻度不显示
                    },
                    data : ['电压低', '无交流', '通信网络故障'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisTick:{
                        show:false,//坐标轴刻度不显示
                    },

                }
            ],
            yAxis : [
                {
                    show:true,
                    type : 'value',
                    name:'数量',
                    /* nameTextStyle:{
                     fontSize:'16',
                     }*/
                    axisTick:{
                        show:false,//坐标轴刻度不显示
                    },
                    nameLocation:'end',//y轴标题的位置
                    min:0,//y轴的起始值
                    fontSize:20,
                    splitLine:{
                        show:false,//去掉网格线
                    },

                }
            ],

            series : [
                {
                    name:'',
                    type:'bar',
                    itemStyle: {
                        normal:{
                            color:'#F9E9B1',//柱体颜色
                        },
                        emphasis:{
                            color:'#F4D269',//鼠标滑过柱体颜色
                            label: {
                                show: true,
                                position: 'top',//数量显示在柱子的顶部
                                textStyle: {
                                    color: '#F4D269',//数字的颜色
                                    fontSize:18,//数字的字体
                                }
                            }
                        }
                    },

                    barWidth: 17,//柱图的宽度
                    data:datafaulet,
                    barGap:'1%',
                }
            ]
        };
// 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    function firealarm() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('two_left'));
        option = {
            title: [
                {
                    text: '.',
                    textStyle: {
                        color:'#E95451',
                        fontSize:80,
                    },
                    padding:[-25,0,0,0],
                    /*top:'5%',*/
                },
                {
                    text: '报警信息汇总',
                    textStyle: {
                        fontFamily:'微软雅黑',
                    },
                    top:'5%',
                    padding:[5,0,0,25],
                },
                {
                    text: '（警情总数：'+ _global.firenum +'）',
                    top:'5%',
                    textStyle: {
                        color:'#F08F8F',
                        fontSize:14,
                        fontFamily:'微软雅黑',
                        fontWeight:'normal',
                    },
                    padding:[8,0,0,135],
                },
            ],
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'25%',
                left: '3%',
                /*right: '4%',*/
                right:'8%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name:'类型',
                    type : 'category',
                    /*data : ['火警', '劫盗', '紧急', '警报', '监控', '窃盗'],*/
                    data:_global.datajson.dataname,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisTick:{
                        show:false,//坐标轴刻度不显示
                    },
                    /*axisLabel: {
                     interval: 0,
                     },*/

                }
            ],
            yAxis : [
                {
                    show:true,
                    type : 'value',
                    name:'数量',
                    nameTextStyle:{
                        fontSize:'14',
                    },
                    axisTick:{
                        show:false,//坐标轴刻度不显示
                    },
                    nameLocation:'end',//y轴标题的位置
                    //min:50,//y轴的起始值
                    fontSize:20,
                    splitLine:{
                        show:false,//去掉网格线
                    },

                }
            ],

            series : [
                {
                    name:'',
                    type:'bar',
                    itemStyle: {
                        normal:{
                            color:'#F9CCCC',//柱体颜色
                        },
                        emphasis:{
                            color:'#EE7776',//鼠标滑过柱体颜色
                            label: {
                                show: true,
                                position: 'top',//数量显示在柱子的顶部
                                textStyle: {
                                    color: '#EE7776',//数字的颜色
                                    fontSize:18,//数字的字体
                                },
                            },
                        },
                        barGap:0,
                    },

                    barWidth: 17,//柱图的宽度
                    /*data:[560, 325, 95, 260, 230, 120],*/
                    data:_global.datajson.datanum,
                    barGap:0,
                }
            ]
        };
// 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart.on('click',function (params) {
            //alert(params.name + params.data);
            $('#fire_alarm').text('').text(params.name).attr("title",params.name);
            $('#fire_allnum').text('').text(params.data).attr("title",params.data);
            for(var i=0;i<_global.datajson.dataname.length;i++){
                if(_global.datajson.dataname[i] == params.name){
                    var param ={codeTypeId: _global.datajson.code[i]};
                    post_async(param,_config.ajaxUrl.getCodeMemoUrl,callbackcodememo);
                    break;
                }
                else {
                    continue;
                }
            }
        })
    }
    /**************************************
     事件类型的返回函数
     **************************************/
    function callbackcodememo(data) {
        var monthnum = $("#search_select").val();
        var params = {month:monthnum};
        post_async(params,_config.ajaxUrl.querySysCodeStatisticsUrl,callbackcodeid);
       /* $("#two_right").text("");
        for(var i=0;i<data.codeMemo.length;i++){
            $div = $("<div></div>");
            $div1 = $("<div></div>");
            $div2 = $("<div></div>");
            $div.addClass("list");
            $div1.addClass("fire_alarm");
            $div2.addClass("fire_allnum");
            $div.append($div1.append(data.codeMemo[i].codeMemo));
            $div.append($div2.append(0));
            $div.appendTo($("#two_right"));
        }*/
        _global.codeMemo = data.codeMemo;
    }
    function callbackcodeid(data) {
        $("#two_right").text("");
        var result = data.result;
        if(result.code == "0"){

            var SysCodePojos =  data.SysCodePojos;
            for (var i=0;i< _global.codeMemo.length;i++){
                for(var j=0;j<SysCodePojos.length;j++){
                    if(_global.codeMemo[i].codeId ==SysCodePojos[j].codeId){
                        var $div = $("<div></div>");
                        var $div1 = $("<div></div>");
                        var $div2 = $("<div></div>");
                        $div.addClass("list");
                        $div1.addClass("fire_alarm");
                        $div2.addClass("fire_allnum");
                        var num = parseInt(SysCodePojos[j].num);
                        $div.append($div1.append(_global.codeMemo[i].codeMemo).attr("title",_global.codeMemo[i].codeMemo));
                        $div.append($div2.append(num).attr("title",num));
                        $div.appendTo($("#two_right"));
                        break;
                    }else{
                        if(j==(SysCodePojos.length-1)){
                            var $div = $("<div></div>");
                            var $div1 = $("<div></div>");
                            var $div2 = $("<div></div>");
                            $div.addClass("list");
                            $div1.addClass("fire_alarm");
                            $div2.addClass("fire_allnum");
                            $div.append($div1.append(_global.codeMemo[i].codeMemo).attr("title",_global.codeMemo[i].codeMemo));
                            $div.append($div2.append(0).attr("title",0));
                            $div.appendTo($("#two_right"));
                        }
                    }
                }

            }
        }
    }
    
    function _showTwo_right() {
        for(var i=0;i<_global.codeMemo;i++){

        }
        var $div = $("<div></div>");
        var $div1 = $("<div></div>");
        var $div2 = $("<div></div>");
        $div.addClass("list");
        $div1.addClass("fire_alarm");
        $div2.addClass("fire_allnum");
        $div.append($div1.append(data.codeMemo[i].codeMemo));
        $div.append($div2.append(0));
        $div.appendTo($("#two_right"));
    }

})(jQuery, window);