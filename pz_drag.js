(function() {
  /**
	@基于jQuery拖放函数
	@new PZ_DND({
			   handle:$("#handle"),            //指定拖动的手柄
			   target:$("#dragBox"),			//指定拖动的目标元素,如果没指定，默认就是handle
			   range:document||$("#range")      //如果range没提供，默认为document
			   });
	@杨永
	@QQ:377746756
	@call:18911082352
	@版本:1.0
	*/
  function PZ_DND(args) {
    var _this_ = this;
    //初始化参数
    this.handle = args.handle;
    this.target = args.target || this.handle;
    this.rangeBox = args.range || document;
    if (this.rangeBox == document) {
      this.target.css({
        position: 'fixed',
        _position: 'absolute'
      });
    } else {
      this.target.css({
        position: 'absolute'
      });
    }
    //绑定事件
    this.handle.mousedown(function(evt) {
      //为了解决ie鼠标移除浏览器无法捕捉
      if (this.setCapture) {
        this.setCapture();
      }
      evt.preventDefault();
      //获取鼠标相对于拖动目标的偏移
      var $this = this,
        layerX = _this_.getLayerPos(evt).x,
        layerY = _this_.getLayerPos(evt).y;
      //注册document移动事件
      $(document)
        .mousemove(function(evt) {
          evt.preventDefault();
          _this_.move(evt, layerX, layerY);
        })
        .mouseup(function() {
          $(this).unbind('mousemove');
          $(this).unbind('mouseup');
          //取消ie鼠标移除浏览器无法捕捉
          if (this.releaseCapture) {
            this.releaseCapture();
          }
          _this_.target.css({
            opacity: 1
          });
        });
      //鼠标按下拖动时的样式
      _this_.target.css({
        opacity: 0.6
      });
    });
  }
  PZ_DND.prototype = {
    setTargetPos: function(left, top) {
      //防止因滚动条产生的距离
      if (!/MSIE\s+6\.0/.test(window.navigator.userAgent)) {
        //ie6不需要减
        left =
          left -
          (document.documentElement.scrollLeft || document.body.scrollLeft);
        top =
          top - (document.documentElement.scrollTop || document.body.scrollTop);
      }
      if (this.rangeBox == document) {
        top =
          top < 0
            ? 0
            : top >
              this.getWindowSize().height - this.target.get(0).offsetHeight
            ? this.getWindowSize().height - this.target.get(0).offsetHeight
            : top;
        left =
          left < 0
            ? 0
            : left > this.getWindowSize().width - this.target.get(0).offsetWidth
            ? this.getWindowSize().width - this.target.get(0).offsetWidth
            : left;
      } else {
        top =
          top < this.rangeBox.offset().top
            ? this.rangeBox.offset().top
            : top >
              this.rangeBox.get(0).offsetHeight -
                this.target.get(0).offsetHeight +
                this.rangeBox.offset().top
            ? this.rangeBox.get(0).offsetHeight -
              this.target.get(0).offsetHeight +
              this.rangeBox.offset().top
            : top;
        left =
          left < this.rangeBox.offset().left
            ? this.rangeBox.offset().left
            : left >
              this.rangeBox.get(0).offsetWidth -
                this.target.get(0).offsetWidth +
                this.rangeBox.offset().left
            ? this.rangeBox.get(0).offsetWidth -
              this.target.get(0).offsetWidth +
              this.rangeBox.offset().left
            : left;
      }
      this.target.css({
        left: left + 'px',
        top: top + 'px'
      });
    },
    move: function(evt, layerX, layerY) {
      //鼠标在document上移动要执行的函数
      this.setTargetPos(evt.pageX - layerX, evt.pageY - layerY);
    },
    getLayerPos: function(evt) {
      //获取鼠标相对于拖动目标的偏移
      return {
        x: evt.pageX - this.target.offset().left,
        y: evt.pageY - this.target.offset().top
      };
    },
    getWindowSize: function() {
      //获取窗口大小
      return {
        width:
          document.documentElement.clientWidth || document.body.clientWidth,
        height:
          document.documentElement.clientHeight || document.body.clientHeight
      };
    }
  };
  window['PZ_DND'] = PZ_DND;
})();
