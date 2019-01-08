$(document).ready(function () {
// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main_four'));
    option = {
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
                text: '（超测总数：100）',
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
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top:'20%',
            left: '3%',
            right: 283,
            /*right: '4%',*/
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                name:'时间',
                type : 'category',
                data : ['第一周', '第二周', '第三周', '第四周'],
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
                min:50,//y轴的起始值
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
                        color:'#B1D6E4',//柱体颜色
                    },
                    emphasis:{
                        color:'#66ACC9',//鼠标滑过柱体颜色
                        label: {
                            show: true,
                            position: 'top',//数量显示在柱子的顶部
                            textStyle: {
                                color: '#66ACC9',//数字的颜色
                                fontSize:18,//数字的字体
                            }
                        }
                    }
                },

                barWidth: 17,//柱图的宽度
                data:[140, 120, 260, 80],
            }
        ]
    };
// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
});