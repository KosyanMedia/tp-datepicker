(function() {
  window.isTouchDevice = window.ontouchstart || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  this.SwipeDetector = (function() {
    SwipeDetector.prototype.xDown = null;

    SwipeDetector.prototype.yDown = null;

    SwipeDetector.prototype.wrapper = null;

    SwipeDetector.prototype.callbacks = {};

    SwipeDetector.prototype.sensivity = 50;

    SwipeDetector.prototype.xDiff = 0;

    SwipeDetector.prototype.yDiff = 0;

    SwipeDetector.prototype.blockScroll = false;

    function SwipeDetector(wrapper, callbacks, sensivity) {
      this.wrapper = wrapper != null ? wrapper : document.body;
      this.callbacks = callbacks != null ? callbacks : {};
      this.sensivity = sensivity != null ? sensivity : 10;
      this.wrapper.addEventListener('touchstart', ((function(_this) {
        return function(e) {
          return _this.handleTouchStart(e);
        };
      })(this)), false);
      this.wrapper.addEventListener('touchend', ((function(_this) {
        return function(e) {
          return _this.handleTouchEnd(e);
        };
      })(this)), false);
      this.wrapper.addEventListener('touchmove', ((function(_this) {
        return function(e) {
          return _this.handleTouchMove(e);
        };
      })(this)), false);
    }

    SwipeDetector.prototype.handleTouchStart = function(event) {
      this.blockScroll = true;
      this.xDown = event.touches[0].clientX;
      return this.yDown = event.touches[0].clientY;
    };

    SwipeDetector.prototype.handleTouchEnd = function(event) {
      this.blockScroll = false;
      if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
        if (Math.abs(Math.abs(this.xDiff) - Math.abs(this.yDiff)) > this.sensivity) {
          if (this.xDiff > 0) {
            this.callbacks.left && this.callbacks.left();
          } else {
            this.callbacks.right && this.callbacks.right();
          }
        }
      } else {
        if (Math.abs(Math.abs(this.yDiff) - Math.abs(this.xDiff)) > this.sensivity) {
          if (this.yDiff > 0) {
            this.callbacks.up && this.callbacks.up();
          } else {
            this.callbacks.down && this.callbacks.down();
          }
        }
      }
      this.xDown = null;
      this.yDown = null;
      this.xDiff = 0;
      return this.yDiff = 0;
    };

    SwipeDetector.prototype.handleTouchMove = function(event) {
      var xUp, yUp;
      if (this.blockScroll) {
        event.preventDefault();
      }
      if (!(this.xDown && this.yDown)) {
        return;
      }
      xUp = event.touches[0].clientX;
      yUp = event.touches[0].clientY;
      this.xDiff += this.xDown - xUp;
      this.yDiff += this.yDown - yUp;
      this.xDown = xUp;
      return this.yDown = yUp;
    };

    return SwipeDetector;

  })();

}).call(this);
