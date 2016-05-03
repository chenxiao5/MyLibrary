// 自定义canvas时钟
;(function(win) {

	/*
	  * customCanvasClock(使用工厂模式创建时钟对象)
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
	var customCanvasClock = function(options) {
		this.parentEle = document.querySelector(options.parentEle) || document; // 父级节点
		this.width = options.width || 400; // 时钟宽度
		this.height = options.height || 400; // 时钟高度
		this.radius = (this.width > this.height) ? this.width / 2 - 6 : this.height / 2 - 6; // 时钟半径
		this.borderWidth = options.borderWidth || 6; // 时钟边框大小
		this.borderColor = options.borderColor || "#999"; // 时钟边框颜色
		this.backgroundColor = options.backgroundColor || "rgba(255, 255, 255, .8)";// 背景颜色
		this.backgroundImage = options.backgroundImage; // 背景图片
		this.scaleLength = options.scaleL || this.width * 4 / 100; // 时间刻度长度
		this.scaleColor = options.scaleColor || this.borderColor// 时间刻度颜色
		this.fontSize = options.fontSize || 16 * this.width / 400 + "px"; // 主时间字体大小
		this.textColor = options.textColor || "#333"; // 主事件字体颜色
		this.lineCap = options.lineCap || "butt"; // 指针帽类型
		this.lineWidth = options.lineWidth || 2; // 指针宽度
		this.isShadow = options.isShadow || true; // 是否阴影效果
		this.canvas = this.createCanvas(); // 创建canvas元素
		this.cxt = this.getContext(); // 获取2d上下文
		this.img = this.createImg();
		this.init(); // 初始化时钟
	};

	customCanvasClock.prototype = {

		// 创建canvas元素
		createCanvas: function() {
			var _dom = document.createElement("canvas");

			_dom.width = this.width;
			_dom.height = this.height;
			_dom.style.display = "block";

			return this.parentEle.appendChild(_dom);
		},

		// 获取2d上下文
		getContext: function() {
			if (this.canvas.getContext) {
				return this.canvas.getContext("2d");
			} else {
				throw new Error("对不起，你的浏览器不支持canvas");
			}
		},

		// 缓存背景图片
		createImg: function() {
			var img = document.createElement("img");
			if (this.backgroundImage) {
				img.src = this.backgroundImage;
				return img;
			} else {
				return null;
			}
		},

		// 擦除canvas
		clearContext: function() {
			this.cxt.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
		},

		// 绘制表盘
		drawBackGround: function() {
			var _self = this,
				 context = _self.cxt,
				 width = _self.width,
				 height = _self.height;

			context.translate(width / 2, height / 2);

			// 绘制具体操作
			(function() {
				// 绘制椭圆
				function drawEllipse(cxt, x, y, width, height, fillStyle) {

					var r = (width > height) ? width / 2 - 6 : height / 2 - 6,
						 ratioX = width / r / 2,
						 ratioY = height / r / 2;

					cxt.save();
					cxt.fillStyle = fillStyle;
					cxt.beginPath();
					cxt.arc(x, y, r, 0, Math.PI * 2, false);
					cxt.scale(ratioX, ratioY);

					if (_self.isShadow) {
						cxt.shadowOffsetX = 5;
						cxt.shadowOffsetY = 5;
						cxt.shadowBlur = 4;
						cxt.shadowColor = "rgba(0, 0, 0, 1)";
					}

					cxt.closePath();
					cxt.fill();
					cxt.restore();
				};

				// 绘制内圆
				function drawRound(x, y, r, fillStyle, bgImg) {
					context.save();
					context.fillStyle = fillStyle;
					context.beginPath();
					context.arc(0, 0, r, 0, Math.PI * 2, false);
					if (bgImg !== null) {
						pattern = context.createPattern(bgImg, "no-repeat");
						context.fillStyle = pattern;
					}
					context.fill();
					context.restore();
				};

				// 绘制表盘整体
				function drawBackGround() {
					drawEllipse(context, 0, 0, width, height, _self.borderColor);
					drawRound(0, 0, _self.radius - _self.borderWidth, _self.backgroundColor, _self.img);
				};

				// 绘制主时间
				function drawTime(context) {
					context.save();
					for(var i = 12; i > 0; i--) {
						context.font = "bold " + _self.fontSize + " Arial";
						context.textAlign = "center";
						context.textBaseline = "middle";
						context.fillText(i, 0, -(_self.radius - 1.6 * _self.scaleLength));
						context.rotate(-1 / 6 * Math.PI);
					}
					context.restore();
				};

				// 绘制事件刻度
				function drawScale(context) {
					context.save(); // 保存当前配置
					context.lineWidth = 2;
					context.strokeStyle = _self.scaleColor;
					for (var i = 60; i > 0; i--) {
						context.beginPath();
						context.moveTo(0, -(_self.radius - _self.scaleLength));
						context.lineTo(0, -(_self.radius - _self.borderWidth));
						context.stroke();
						context.rotate(-1 / 30 * Math.PI);
					}
					context.restore(); // 恢复上一次配置
				};

				drawBackGround();
				drawTime(context);
				drawScale(context);
			})();
		},

		// 绘制指针
		drawHand: function(rotate, length, num) {

			var _self = this,
				 context = _self.cxt,
				 radius = _self.radius,
				 width = _self.lineWidth,
				 cap = _self.lineCap;

			context.save();
			context.rotate(1 * rotate * num);
			context.lineWidth = width;
			context.lineCap = cap;
			context.strokeStyle = "#333";
			context.beginPath();
			context.moveTo(0, length / 10 * 1);
			context.lineTo(0, -1 * length);
			context.stroke();
			context.restore();
		},

		// 绘制时针
		drawHourHand: function(time) {

			var h = time.getHours(),
				 m = time.getMinutes(),
				 s = time.getSeconds();
			h = h + (m / 60) + (s / 60) / 60;

			this.drawHand((1 / 6) * Math.PI, this.radius / 2, h);
		},

		// 绘制分针
		drawMinuteHand: function(time) {

			var m = time.getMinutes(),
				 s = time.getSeconds();
			m = m + (s / 60) / 60;

			this.drawHand((1 / 30) * Math.PI, this.radius / 3 * 2, m);
		}, 

		// 绘制秒针
		drawSecHand: function(time) {

			var s = time.getSeconds() + 1;

			this.drawHand((1 / 30) * Math.PI, this.radius / 10 * 8, s);
		},

		// 绘制中心圆
		drawCenter: function() {

			var _self = this,
				 context = _self.cxt,
				 nRadius = _self.lineWidth * 1;

			context.save();
			context.fillStyle = "#333";
			context.beginPath();
			context.moveTo(0, 0);
			context.arc(0, 0, nRadius, 0, Math.PI * 2);
			context.fill();
			context.restore();
		},

		// 初始化时钟
		init: function() {
			var _self = this,
				 time = null;

			function render() {
				time = new Date();
				_self.clearContext();
				_self.drawBackGround();
				_self.drawHourHand(time);
				_self.drawMinuteHand(time);
				_self.drawSecHand(time);
				_self.drawCenter();
				_self.cxt.translate(-1 * _self.width / 2, -1 * _self.height / 2);
			};

			render();
			setInterval(render, 1000);
		}
	};

	win.canvasClock = customCanvasClock;
})(window);