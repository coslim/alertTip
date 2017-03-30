/**
 * 使用说明:
 * 
 *	window.lm.Pop(popHtml, [type], [options])
 *	popHtml:html 字符串
 *	type:window.lm.xcConfirm.typeEnum 集合中的元素
 *	options: 扩展对象
 * 用法:
 * 1. window.lm.xcConfirm("弹窗<span>alter</span>");
 * 2. window.lm.xcConfirm("成功","success");
 * 3. window.lm.xcConfirm("请输入","input",{onOk:function(){}})
 * 4. window.lm.xcConfirm("自定义",{title:"自定义"})
 * 
 */
(function($){
	window.lm = window.lm || {};
	window.lm.xcConfirm = function(popHtml, type, options) {
	    var btnType = window.lm.xcConfirm.btnEnum;
		var eventType = window.lm.xcConfirm.eventEnum;
		var popType = {
			//弹出基本信息
			info: {
				title: "信息",
				icon: "0 0",		//蓝色i
				btn: btnType.ok
			},
			//成功 弹出信息
			success: {
				title: "成功",
				icon: "0 -48px",	//绿色对勾
				btn: btnType.ok
			},
			//错误弹出信息
			error: {
				title: "错误",
				icon: "-48px -48px",//红色叉
				btn: btnType.ok
			},
			//弹出注意信息
			confirm: {
				title: "提示",
				icon: "-48px 0",	//黄色问号
				btn: btnType.okcancel
			},
			//警告弹出信息
			warning: {
				title: "警告",
				icon: "0 -96px",	//黄色叹号
				btn: btnType.okcancel
			},
			//带文本框的弹窗
			input: {
				title: "输入",
				icon: "",
				btn: btnType.ok
			},
			//自定义
			custom: {
				title: "",
				icon: "",
				btn: btnType.ok
			}
		};
		var itype = type ? type instanceof Object ? type : popType[type] || {} : {};	//格式化输入的参数:弹窗类型
		var config = $.extend(true, {
			//弹窗属性
			title: "", 		 //自定义的标题 传过来的值
			icon: "", 		 //自定义图标	传过来的按钮值
			btn: btnType.ok, //按钮,默认单按钮【只有确定按钮】
			//鼠标事件
			onOk: $.noop,		//点击 确定按钮
			onCancel: $.noop,	//点击 取消按钮
			onClose: $.noop		//关闭按钮,关闭弹窗
		}, itype, options);
		
		var $txt = $("<p>").html(popHtml);	//弹窗文本 dom对象
		var $tt = $("<span>").addClass("tt").text(config.title);	//弹窗标题(从调用方法中传过来的)
		var icon = config.icon;
		var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition",icon) : "";	//弹窗图标
		var btn = config.btn;		//按钮组生成参数
		var popId = creatPopId();	//弹窗索引
		var $box = $("<div>").addClass("xcConfirm");	//弹窗插件容器
		var $layer = $("<div>").addClass("xc_layer");	//遮罩层
		var $popBox = $("<div>").addClass("popBox");	//弹窗盒子
		var $ttBox = $("<div>").addClass("ttBox");		//弹窗顶部区域
		var $txtBox = $("<div>").addClass("txtBox");	//弹窗内容主体区
		var $btnArea = $("<div>").addClass("btnArea");	//按钮区域
		var $input = $("<input>").addClass("inputBox");		//输入框
		var $clsBtn = $("<a>").addClass("clsBtn");			//关闭按钮
		
		var $ok = $("<a>").addClass("sgBtn").addClass("ok").text("确定"); 			//确定按钮
		var $cancel = $("<a>").addClass("sgBtn").addClass("cancel").text("取消");	//取消按钮
		
		//传入按钮的属性值 【a标签中 href 属性值】 【测试后完成，未发现bug】
		//if(options)options.okLink?$ok.attr('href',options.okLink):this;
		//if(options)options.cancelLink?$cancel.attr('href',options.cancelLink):this;
			//上面的两句需要 与 js 中 window.lm.xcConfirm(txt, window.lm.xcConfirm.typeEnum.confirm,{okLink:'http://www.baidu.com'}); 配合使用
					
		//建立按钮映射关系
		var btns = { ok: $ok, cancel: $cancel };init();
		
		function init(){
			//需要特殊处理input
			if(popType["input"] === itype){
				$txt.append($input);
			}
			creatDom();
			bind();
		}
		
		//将传过来的数据添加进去
		function creatDom(){
			$popBox.append(
				$ttBox.append($clsBtn).append($tt)
			).append(
				$txtBox.append($icon).append($txt)
			).append(
				$btnArea.append(creatBtnGroup(btn))
			);
			$box.attr("id", popId).append($layer).append($popBox);
			$("body").append($box);
		}
		
		//按钮事件
		function bind(){
			//点击确认按钮
			$ok.click(doOk);
				
				//按照常规的写法，按下回车键的话 作用应该需要跟 点击确定按钮要 一直！ 此处 存在 bug  未修复
				
			//回车键触发确认事件
			$(window).bind("keydown", function(e){
				if(e.keyCode == 13) {
					if($("#" + popId).length == 1){
						$ok.trigger('click');
					}
				}
			});
			
			//点击取消按钮
			$cancel.click(doCancel);
			
			//使用ESC键关闭事件
			$(window).bind("keydown", function(e){
				if(e.keyCode == 27) {
					if($("#" + popId).length == 1){
						doCancel();
					}
				}
			});
			
			//点击关闭按钮关闭
			$clsBtn.click(doClose);
		}
		
		//确认按钮事件
		function doOk(){
			var $o = $(this);
			var v = $.trim($input.val());
			if ($input.is(":visible"))
		        config.onOk(v);
		    else
		        config.onOk();
			$("#" + popId).remove(); 
			config.onClose(eventType.ok);
		}
		
		//取消按钮事件
		function doCancel(){
			var $o = $(this);
			config.onCancel();
			$("#" + popId).remove(); 
			config.onClose(eventType.cancel);
		}
		
		//关闭按钮事件
		function doClose(){
			$("#" + popId).remove();
			config.onClose(eventType.close);
			$(window).unbind("keydown");
		}
		
		//生成按钮
		function creatBtnGroup(tp){
			var $bgp = $("<div>").addClass("btnGroup");
			$.each(btns, function(i, n){
				if( btnType[i] == (tp & btnType[i]) ){
					$bgp.append(n);
				}
			});
			return $bgp;
		}

		//重生popId,防止id重复【随机生成div 的ID值】
		function creatPopId(){
			var i = "pop_" + (new Date()).getTime()+parseInt(Math.random()*100000);		//弹窗索引
			if($("#" + i).length > 0){
				return creatPopId();
			}else{
				return i;
			}
		}
	};
	
	//按钮类型
	window.lm.xcConfirm.btnEnum = {
		ok: parseInt("0001",2),			//确定按钮
		cancel: parseInt("0010",2), 	//取消按钮
		okcancel: parseInt("0011",2) 	//确定&&取消
	};
	
	//触发事件类型
	window.lm.xcConfirm.eventEnum = {
		ok: 1,
		cancel: 2,
		close: 3
	};
	
	//弹窗类型 下面的类型根据需要调用
	window.lm.xcConfirm.typeEnum = {
		//具体的 类型在页面中有注释
		info: "info",
		success: "success",
		error:"error",
		confirm: "confirm",
		warning: "warning",
		input: "input",
		custom: "custom"
	};
	
})(jQuery);
