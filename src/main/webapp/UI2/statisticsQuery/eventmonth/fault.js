$(document).ready(function () {
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
                text: '（故障总数：30）',
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
                data : ['电压低', '无交流', '通信网络故障', '其他'],
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
                data:[255, 325, 95, 85],
                barGap:'1%',
            }
        ]
    };
// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
});