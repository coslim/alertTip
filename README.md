# alertTip

自定义的提示弹窗插件。弹出层alert ，自定义配置！
index.html
//自定义的提示弹窗【自定义标题、内容】	有【确定】和【取消】按钮
/**
 * 注意：
 * 下面的 custom 可以替换成
 * info（蓝色i提示）、confirm（黄色？号）、warning（警告）、error（错误）、success（成功）、input（文本框弹窗）
 */
			 
$("#btn7").click(function(){
	var txt= "测试文本测试文本测试文本";
	var option = {
		title: "这里是标题",
		btn: parseInt("0011",2),
		onOk: function(){
			console.log("确认");
		}
	}
	window.lm.xcConfirm(txt, "custom", option);
});
    
也可以根据需要增加！alertCen.js 文件有大量注释
    
