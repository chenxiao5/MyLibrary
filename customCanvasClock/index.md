#基于html5 canvas的时钟组件

## 示例
[demo地址][demo]

## 使用方式
- 引用customCanvasClock.js文件至项目中
- 定义好配置对象
``` javascript
    var object = {
        parentEle: ".box"
    }；
    // 除parentEle外，其余配置均有默认值
    // 具体配置内容请参照：
    /*
	 * param {Object} options : 配置参数
     * {
     *		parentEle : 父级节点
     * 		width : 宽度
     *  	height：高度
     *  	borderWidth：边框大小
     *  	borderColor：边框颜色
     *  	backgroundColor：表盘背景颜色
     *  	backgroundImage： 表盘背景图片
     *  	scaleLength：时间刻度长度
     *  	scaleColor：时间刻度颜色
     *  	fontSize：主事件字体大小
     *  	textColor：主时间字体颜色
     *  	lineCap：指针帽类型
     *  	lineWidth：指针宽度
     *  	isShadow：是否阴影效果
     * }
     */
```
- 实例化`canvasClock`对象
``` javascript
    var clock = new canvasClock(object);
    // object为配置对象
```

## 问题反馈
有问题请联系邮箱：chenxiaowuemail@163.com

[demo]:https://htmlpreview.github.io/?https://github.com/chenxiao5/MyLibrary/blob/master/customCanvasClock/demo.html

