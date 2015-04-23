(function() {
  this.TpDatepicker = (function() {
    TpDatepicker.prototype.prefix = '';

    TpDatepicker.prototype.roles = [];

    TpDatepicker.prototype.role = null;

    TpDatepicker.prototype.wrapper = false;

    TpDatepicker.prototype.popupRenderer = false;

    TpDatepicker.prototype.today = new Date();

    TpDatepicker.prototype.isCirrentMonth = false;

    TpDatepicker.prototype.t = window.translations.datepicker;

    TpDatepicker.prototype.isTouchDevice = window.isTouchDevice;

    TpDatepicker.prototype.nodes = [];

    TpDatepicker.prototype.settedRoles = false;

    TpDatepicker.prototype.legend = false;

    TpDatepicker.prototype.type = 'simple';

    TpDatepicker.prototype.onSelect = function(date, role) {
      return console.log(role + " selected date " + date);
    };

    function TpDatepicker(options) {
      var i, len, node, ref, role;
      if (options == null) {
        options = {};
      }
      this.datepickerWrapper = options.wrapper || document.body;
      this.roles = (options.role && [options.role]) || options.roles || ['tp-datepicker'];
      this.role = this.roles[0];
      if (options.callback) {
        this.onSelect = options.callback;
      }
      if (options.prefix) {
        this.prefix = options.prefix;
      }
      ref = this.roles;
      for (i = 0, len = ref.length; i < len; i++) {
        role = ref[i];
        node = this.nodes[role] = this.datepickerWrapper.querySelector("[role=\"" + role + "\"]");
        node.classList.add(this.prefix + "tp-datepicker-trigger");
        this[role] = this._parseDate(node.getAttribute('data-date'));
        if (this.isTouchDevice) {
          node.addEventListener('touchstart', this._listenerFor(role));
        } else {
          node.addEventListener('click', this._listenerFor(role));
        }
        node.addEventListener('focus', function(event) {
          event.preventDefault();
          return event.target.blur();
        });
      }
      this._initPopup();
    }

    TpDatepicker.prototype._initPopup = function() {
      var listener;
      this.currentMonth = this.today.getMonth() + 1;
      this.currentYear = this.today.getFullYear();
      this.currentDay = this.today.getDate();
      listener = (function(_this) {
        return function(event_name, element) {
          return _this._callback_proxy(event_name, element);
        };
      })(this);
      this.popupRenderer = new TpDatepickerPopupRenderer(this, listener, this.prefix);
      if (window.SwipeDetector) {
        new SwipeDetector(this.popupRenderer.node, {
          left: (function(_this) {
            return function() {
              return _this.nextMonth();
            };
          })(this),
          right: (function(_this) {
            return function() {
              return _this.prevMonth();
            };
          })(this),
          down: (function(_this) {
            return function() {
              return _this.popupRenderer.node.classList.remove(_this.prefix + "tp-datepicker--active");
            };
          })(this),
          up: (function(_this) {
            return function() {
              return _this.popupRenderer.node.classList.remove(_this.prefix + "tp-datepicker--active");
            };
          })(this)
        });
      }
      this.popupRenderer.node.querySelector('[role="tp-datepicker-prev"]').addEventListener('click', (function(_this) {
        return function() {
          return _this.prevMonth();
        };
      })(this));
      this.popupRenderer.node.querySelector('[role="tp-datepicker-next"]').addEventListener('click', (function(_this) {
        return function() {
          return _this.nextMonth();
        };
      })(this));
      return document.addEventListener('click', (function(_this) {
        return function(event) {
          var node;
          if (!(node = event.target)) {
            return;
          }
          if (node.tagName !== 'BODY' && node.tagName !== 'HTML') {
            if (_this.roles.indexOf(node.getAttribute('role')) > -1) {
              if (window.sendMetric) {
                window.sendMetric("datepickerinputs_touch");
              }
              return;
            }
            while (node = node.parentNode) {
              if (node.tagName === 'BODY') {
                break;
              }
              if (!node.parentNode || node.classList.contains(_this.prefix + "tp-datepicker") || _this.roles.indexOf(node.getAttribute('role')) >= 0) {
                return;
              }
            }
          }
          _this.nodes[_this.role].classList.remove(_this.prefix + "tp-datepicker-trigger--active");
          return _this.popupRenderer.node.classList.remove(_this.prefix + "tp-datepicker--active");
        };
      })(this));
    };

    TpDatepicker.prototype.prevMonth = function() {
      if (this.isCirrentMonth) {
        return;
      }
      if (this.month === 1) {
        this.year--;
        this.month = 12;
      } else {
        this.month--;
      }
      return this._renderDatepicker();
    };

    TpDatepicker.prototype.nextMonth = function() {
      if (this.month === 12) {
        this.year++;
        this.month = 1;
      } else {
        this.month++;
      }
      return this._renderDatepicker();
    };

    TpDatepicker.prototype.show = function(role1, callback) {
      var node, ref, role;
      this.role = role1;
      this.callback = callback;
      this.date = this._parseDate(this[this.role]) || this.today;
      this.month = this.date.getMonth() + 1;
      this.year = this.date.getFullYear();
      this._renderDatepicker();
      ref = this.nodes;
      for (role in ref) {
        node = ref[role];
        node.classList.toggle(this.prefix + "tp-datepicker-trigger--active", role === this.role);
      }
      if (window.positionManager) {
        return window.positionManager.positionAround(this.nodes[this.role], this.popupRenderer.node);
      }
    };

    TpDatepicker.prototype._callback_proxy = function(event_name, element) {
      switch (event_name) {
        case 'click':
          this.callback(element.getAttribute('data-date'));
          return true;
        default:
          return false;
      }
    };

    TpDatepicker.prototype._listenerFor = function(role) {
      return (function(_this) {
        return function() {
          return _this.show(role, function(date) {
            return _this._showCallback(date, role);
          });
        };
      })(this);
    };

    TpDatepicker.prototype._showCallback = function(date, role) {
      if (date) {
        this[role] = date;
      }
      this._setupDate(role, this[role]);
      if (!this.settedRoles) {
        this.nodes[this.role].classList.remove(this.prefix + "tp-datepicker-trigger--active");
        this.popupRenderer.node.classList.remove(this.prefix + "tp-datepicker--active");
        return this.onSelect(date, role);
      }
    };

    TpDatepicker.prototype._setupDate = function(role, date) {
      this.nodes[role].setAttribute('data-date', date);
      return this.nodes[role].setAttribute('value', this._formatDate(date));
    };

    TpDatepicker.prototype._renderDatepicker = function() {
      this.isCirrentMonth = this.currentYear === this.year && this.currentMonth === this.month;
      this.popupRenderer.render(this);
      return this.popupRenderer.node.classList.add(this.prefix + "tp-datepicker--active");
    };

    TpDatepicker.prototype._parseDate = function(string) {
      var array;
      if (!string) {
        return;
      }
      array = string.split('-');
      return new Date(array[0], parseInt(array[1], 10) - 1, array[2]);
    };

    TpDatepicker.prototype._stringifyDate = function(date) {
      return (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
    };

    TpDatepicker.prototype._formatDate = function(string) {
      var dateArray;
      if (!string) {
        return;
      }
      dateArray = string.split('-');
      return dateArray[2] + " " + this.t.short_months[parseInt(dateArray[1], 10)] + " " + dateArray[0];
    };

    TpDatepicker.prototype._setScale = function(value, element) {
      if (element == null) {
        element = this.popupRenderer.node;
      }
      return element.style.webkitTransform = element.style.transform = "scale(" + value + ")";
    };

    return TpDatepicker;

  })();

}).call(this);
