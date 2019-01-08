$(document).ready(function () {
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
                        formatter: "{b}{d}%",
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
                data:[
                    {value:92, name:'报警'},
                    {value:30, name:'故障'},
                    {value:30, name:'超测'},
                    {value:8, name:'系统'},
                ]
            }
        ]
    };

// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
});