/**
 * Created by ly on 2016/10/13.
 * jquery插件 翻页按钮
 */
;(function($,window,document,undefined){
    function addCss(cssPath){
        var $link = $('<link>');
        $('head').append($link);
        $link.attr('rel','stylesheet').attr('type','text/css');
        $link.attr("href",cssPath);
    }
    var defaults = {
        clickPage: function(){},
        cssPath:'../tool/jquery-page-1.0.1/jquery-page-1.0.1.css',
        currentPage:1,
        maxPage:1,
        tempelet:'共{0}条信息，当前第{1}/{2}页',
		noDataTip:'查询无结果',
		noDataColor:'#FF0000'
    }
    var classSet = {
        pageBox:'page-Box',
        tipBox:'Record-page-left',
        btnBox:'Record-page-right',
        jump:'pageJump',
        jump_disable:'pageJump-disable',
        label:'pageYeClass',
        input:'inputClass',
        turn:'pageDiv',
        preBtn_disable:'unclick1',
        preBtn_active:'prev',
        nextBtn_disable:'unclick2',
        nextBtn_active:'next',
        on:'on',
        point:'point'
    }
    var IDSet = {
        mainID: 'YWPAGE_mainID',
        tip:'YWPAGE_tip',
        jumpBtn:'YWPAGE_jumpBtn',
        jumpInput:'YWPAGE_jumpInput',
        turn:'YWPAGE_turn'
    }
    function _plugins (options){
        this.mainID = options.ID || IDSet.mainID;
        this.setting =  $.extend(defaults, options);
        var cssPath = this.setting.cssPath;
        var maxPage = defaults.maxPage;
        var currentPage = defaults.currentPage;
        //检验数据
        if($.isFunction(this.setting.clickPage) == false){
            this.setting.clickPage = defaults.clickPage;
        }
		if(this.setting.noDataTip == null || this.setting.noDataTip == undefined ){
            this.setting.noDataTip = defaults.noDataTip;
        }
		if(this.setting.noDataColor == null || this.setting.noDataColor == undefined 
		 || /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/i.test(this.setting.noDataColor) == false){
            this.setting.noDataColor = defaults.noDataColor;
        }
		
        addCss(cssPath);
        initView.apply(this);
        this.setPage(maxPage,currentPage,0);
    }

    function initView(){
        var $main = $('#' + this.mainID);
        //创建信息展示，tip
        var $tipBox = $('<div></div>');
        //创建按钮部分，btn
        var $btnBox = $('<div></div>');
        //按钮部分分为页码按钮和跳转按钮
        var $jump = $('<div></div>');
        var $label = $('<label></label>');
        var $input = $('<input />');
        var $turn = $('<div></div>');

        $main.append($tipBox).append($btnBox);
        $btnBox.append($jump).append($label).append($input).append($turn);

        $main.addClass(classSet.pageBox);
        $tipBox.addClass(classSet.tipBox);
        $btnBox.addClass(classSet.btnBox);
        $jump.addClass(classSet.jump);
        $label.addClass(classSet.label);
        $input.addClass(classSet.input);
        $turn.addClass(classSet.turn);

        $tipBox.text('共0条信息，当前第0/1页').attr('id',IDSet.tip);
        $jump.text('跳转').attr('id',IDSet.jumpBtn);
        $label.text('页');
        $input.attr('id',IDSet.jumpInput);
        $turn.attr('id',IDSet.turn);
        $input.bind('focus',function(){
            $(this).attr('class',classSet.input);
        });
        $input.bind("input propertychange",function() {
            var reg = /[^\d]/g;
            var val = $(this).val();
            val = val.replace(reg, '');
            if(val != ''){
                var num = parseInt(val);
                if(num<=0){
                    num = 1;
                }
                val = num;
            }
            $(this).val(val);
        });

    }

    function fixpageDivState(maxPage,clickPage){
        var $jump = $('#'+IDSet.jumpBtn);
        $('#' + IDSet.jumpInput).val('');

        if(maxPage == 1|| !maxPage){
            $jump.attr("class",classSet.jump_disable);
            $jump.unbind('click');
        }
        else {
            $jump.attr("class",classSet.jump);
            $jump.unbind('click').bind('click',function(){
                var $page = $('#' + IDSet.jumpInput);
                var index = $page.val();
                var reg = new RegExp("^[0-9]*$");
                if(reg.test(index) == false){
                    $page.addClass('beyond');
                    return false;
                }
                index = (index == "") ? 0 : parseInt(index);
                if (index == 0) {
                    $page.focus();
                    $page.addClass('wrong');
                }
                else if(index < 1){
                    clickPage(1);
                }
                else if(index > maxPage){
                    clickPage(maxPage);
                }
                else{
                    clickPage(index);
                }
            });
        }
    }
    function setTip(str,color){
		var $tip = $('#'+IDSet.tip);
        $tip.html(str);
		if(color !=null && color !=undefined){
			$tip.css('color',color);
		}
		else{
			$tip.css('color','#323232');
		}
    }
    function createEM(className){
        var $em = $('<em></em>');
        $em.addClass(className);
        return $em;
    }
    function createSAPN(className,text){
        var $span = $('<span></span>');
        $span.text(text);
        if(className != null && className != ''){
            $span.addClass(className);
        }
        return $span;
    }
    function createI(className){
        var $i = $('<i></i>');
        $i.text('...');
        $i.addClass(className);
        return $i;
    }

    function createTurn($turn,start,end,markIndex,clickPage){
        for (var i = start; i <= end; i++) {
            var $span = null;
            if (markIndex == i) {
                $span = createSAPN(classSet.on, i);
            } else {
                $span = createSAPN('', i);
            }
            if(clickPage!=null && clickPage != undefined){
                $span.bind('click',function(){
                    var page = $(this).text();
                    page = parseInt(page);
                    clickPage(page);
                })
            }
            $turn.append($span);
        }
    }

    function createPreBtn($turn,markIndex,clickPage){
        if(markIndex == 1){
            var $pre = createEM(classSet.preBtn_disable);
            $turn.append($pre);
        }
        else{
            var $pre = createEM(classSet.preBtn_active);
            if(clickPage!=null && clickPage != undefined){
                $pre.bind('click',function(){
                    var $on = $('.'+classSet.on,'#'+IDSet.turn);
                    var page = $($on).text();
                    page = parseInt(page) - 1;
                    clickPage(page);
                })
            }
            $turn.append($pre);
        }
    }

    function createNextBtn($turn,markIndex,maxPage,clickPage){
        if(markIndex == maxPage){
            var $next = createEM(classSet.nextBtn_disable);
            $turn.append($next);
        }
        else{
            var $next = createEM(classSet.nextBtn_active);
            if(clickPage!=null && clickPage != undefined){
                $next.bind('click',function(){
                    var $on = $('.'+classSet.on,'#'+IDSet.turn);
                    var page = $($on).text();
                    page = parseInt(page) + 1;
                    clickPage(page);
                })
            }
            $turn.append($next);
        }
    }
    function _format(){
        var arg = arguments;
        if(arg == undefined || arg == null || arg.length<2){
            return arg;
        }
        var result = arg[0];
        var data = arg[1];
        var reg = /{(\d+)}/gm;
        result = result.replace(reg,function(match,name){
            return data[~~name];
        });
        return result;
    }
    _plugins.prototype.setPage = function(maxPage,currPage,total){
        maxPage = parseInt(maxPage);
        currPage = parseInt(currPage);
        total = parseInt(total);
        maxPage = maxPage>1 ? maxPage : 1;
		if(total <0){
			var tipSTR = this.setting.noDataTip;
			setTip(tipSTR,this.setting.noDataColor);
			
		}
		else{
			var tipSTR = _format(defaults.tempelet,[total,currPage,maxPage]);
			setTip(tipSTR);
		}
		var clickPage = this.setting.clickPage;
		fixpageDivState(maxPage,clickPage);
        

        var $turn = $('#' +IDSet.turn);
        $turn.html('');
        //上一页按钮
        createPreBtn($turn,currPage,clickPage);

        //中间的按钮
        if(maxPage <= 6){
            createTurn($turn,1,maxPage,currPage,clickPage);
        }
        else{
            //当前页靠前
            if (currPage <= 4) {
                createTurn($turn,1,5,currPage,clickPage);
                var $i = createI(classSet.point);
                $turn.append($i);
                createTurn($turn,maxPage,maxPage,currPage,clickPage);
            }
            //当前页靠后
            else if (currPage >= maxPage - 3) {
                createTurn($turn,1,1,currPage,clickPage);
                var $i = createI(classSet.point);
                $turn.append($i);
                createTurn($turn,maxPage - 4,maxPage,currPage,clickPage);
            }
            //当前页在中间
            else{
                createTurn($turn,1,1,currPage,clickPage);
                var $i_1 = createI(classSet.point);
                $turn.append($i_1);
                createTurn($turn,currPage - 2,currPage + 2,currPage,clickPage);
                var $i_2 = createI(classSet.point);
                $turn.append($i_2);
                createTurn($turn,maxPage,maxPage,currPage,clickPage);
            }
        }
        //下一页按钮
        createNextBtn($turn,currPage,maxPage,clickPage);
    }
	_plugins.prototype.getCurrPage = function(){
		var $on = $('.'+classSet.on,'#'+IDSet.turn);
        var getCurrPage = $($on).text();
		getCurrPage = parseInt(getCurrPage);
		return getCurrPage;
	}
    if(window.YW == null || window.YW == undefined){
        window.YW = {};
    }
    window.YW.PAGEUI = _plugins;
})(jQuery,window,document);

