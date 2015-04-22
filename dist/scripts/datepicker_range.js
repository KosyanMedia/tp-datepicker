(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.TpDatepickerRange = (function(superClass) {
    extend(TpDatepickerRange, superClass);

    TpDatepickerRange.prototype.isEndDate = false;

    TpDatepickerRange.prototype.settedRoles = {};

    TpDatepickerRange.prototype.prevRole = false;

    TpDatepickerRange.prototype.readyToDraw = true;

    TpDatepickerRange.prototype.legend = false;

    TpDatepickerRange.prototype.type = 'range';

    TpDatepickerRange.prototype.onSelect = function(startDate, endDate, role) {
      return console.log(role + " selected range from " + startDate + " to " + endDate);
    };

    function TpDatepickerRange(options) {
      var ref;
      if (options == null) {
        options = {};
      }
      options.role = null;
      options.roles || (options.roles = ['startDate', 'endDate']);
      if (options.legend) {
        this.legend = options.legend;
      }
      TpDatepickerRange.__super__.constructor.call(this, options);
      ref = this.roles, this.startDateRole = ref[0], this.endDateRole = ref[1];
      this.settedRoles[this.startDateRole] = this.settedRoles[this.endDateRole] = false;
    }

    TpDatepickerRange.prototype.show = function(role1, callback) {
      this.role = role1;
      this.callback = callback;
      this.isEndDate = this.role === this.endDateRole;
      TpDatepickerRange.__super__.show.call(this, this.role, this.callback);
      return this.prevRole = this.role;
    };

    TpDatepickerRange.prototype._callback_proxy = function(event_name, element) {
      if (TpDatepickerRange.__super__._callback_proxy.call(this, event_name, element)) {
        return true;
      }
      switch (event_name) {
        case 'mouseout':
          this.readyToDraw = true;
          return true;
        case 'mouseover':
          if (!this.readyToDraw) {
            return;
          }
          if (this.isEndDate) {
            this._drawSausage(this.startDate, element.getAttribute('data-date'));
          } else {
            this._drawSausage(element.getAttribute('data-date'), this.endDate);
          }
          this.readyToDraw = false;
          return true;
        default:
          return false;
      }
    };

    TpDatepickerRange.prototype._currentDateType = function() {
      if (this.isEndDate) {
        return 'endDate';
      } else {
        return 'startDate';
      }
    };

    TpDatepickerRange.prototype._showCallback = function(date, role) {
      var oppositeRole;
      TpDatepickerRange.__super__._showCallback.call(this, date, role);
      if (date) {
        this[this._currentDateType()] = date;
      }
      this.settedRoles[role] = true;
      this._checkDates(role);
      oppositeRole = this._oppositeRole(role);
      if (this.settedRoles[oppositeRole]) {
        this.nodes[this.role].classList.remove(this.prefix + "tp-datepicker-trigger--active");
        this._setScale(0);
      } else {
        this._setupDate(oppositeRole, this[oppositeRole]);
        this._listenerFor(oppositeRole)();
      }
      return this.onSelect(this.startDateObj, this.endDateObj, role);
    };

    TpDatepickerRange.prototype._oppositeRole = function() {
      if (this.isEndDate) {
        return this.startDateRole;
      } else {
        return this.endDateRole;
      }
    };

    TpDatepickerRange.prototype._checkDates = function(role) {
      var oppositeRole;
      this.startDateObj = this._parseDate(this.startDate) || (this.endDateObj && this._changeDate(this.endDateObj, -1)) || this.today;
      this.endDateObj = this._parseDate(this.endDate) || (this.startDateObj && this._changeDate(this.startDateObj, 1));
      oppositeRole = this._oppositeRole(role);
      if (this.startDateObj >= this.endDateObj || !this.settedRoles[oppositeRole] || this.endDateObj === this.today) {
        this.settedRoles[oppositeRole] = false;
        if (this.isEndDate) {
          if (this.endDateObj === this.today) {
            this.endDateObj = this._changeDate(this.today, 1);
          }
          this.startDateObj = this._changeDate(this.endDateObj, -1);
        } else {
          this.endDateObj = this._changeDate(this.startDateObj, 1);
        }
      }
      this.startDate = this[this.startDateRole] = this._stringifyDate(this.startDateObj);
      return this.endDate = this[this.endDateRole] = this._stringifyDate(this.endDateObj);
    };

    TpDatepickerRange.prototype._renderDatepicker = function() {
      TpDatepickerRange.__super__._renderDatepicker.call(this);
      this._drawSausage(this.startDate, this.endDate);
      if (this.legend && this.prevRole !== this.role) {
        return this._updateLegend(this.t.legend[this._currentDateType()]);
      }
    };

    TpDatepickerRange.prototype._updateLegend = function(text) {
      var node;
      node = this.popupRenderer.legendNode;
      node.textContent = text;
      node.classList.toggle(this.prefix + "tp-datepicker-legend--start-date", !this.isEndDate);
      node.classList.toggle(this.prefix + "tp-datepicker-legend--end-date", this.isEndDate);
      this._setScale(1.2, node);
      return setTimeout(((function(_this) {
        return function() {
          return _this._setScale(1, node);
        };
      })(this)), 200);
    };

    TpDatepickerRange.prototype._drawSausage = function(sausageStart, sausageEnd) {
      var arrayEnd, arrayStart, classList, date, ended, isEnding, isStarting, node, ref, results, samePoints, started;
      if (!(sausageStart || sausageEnd)) {
        return;
      }
      sausageStart || (sausageStart = sausageEnd);
      sausageEnd || (sausageEnd = sausageStart);
      arrayStart = sausageStart.split('-');
      arrayEnd = sausageEnd.split('-');
      started = parseInt(arrayStart[1], 10) < this.month && parseInt(arrayEnd[1], 10) >= this.month;
      ended = parseInt(arrayEnd[1], 10) < this.month && parseInt(arrayStart[1], 10) >= this.month;
      sausageStart = this.prefix + "tp-datepicker-" + sausageStart + "-current-date";
      sausageEnd = this.prefix + "tp-datepicker-" + sausageEnd + "-current-date";
      samePoints = sausageStart === sausageEnd;
      ref = this.popupRenderer.monthRenderer.days;
      results = [];
      for (date in ref) {
        node = ref[date];
        classList = node.classList;
        if (classList.contains(this.prefix + "tp-datepicker-current")) {
          isStarting = sausageStart === date;
          isEnding = sausageEnd === date;
          if (isStarting && !((samePoints || ended) && this.isEndDate)) {
            classList.add(this.prefix + "tp-datepicker-start-sausage");
            classList.remove(this.prefix + "tp-datepicker-range");
            classList.remove(this.prefix + "tp-datepicker-end-sausage");
            classList.remove(this.prefix + "tp-datepicker-end-sausage--invisible");
            classList.remove(this.prefix + "tp-datepicker-start-sausage--invisible");
            started = !samePoints;
            if (started && !ended) {
              results.push(classList.add(this.prefix + "tp-datepicker-range"));
            } else {
              results.push(void 0);
            }
          } else if (isEnding && (started || this.isEndDate)) {
            classList.add(this.prefix + "tp-datepicker-end-sausage");
            classList.remove(this.prefix + "tp-datepicker-range");
            classList.remove(this.prefix + "tp-datepicker-start-sausage");
            classList.remove(this.prefix + "tp-datepicker-end-sausage--invisible");
            classList.remove(this.prefix + "tp-datepicker-start-sausage--invisible");
            if (started) {
              classList.add(this.prefix + "tp-datepicker-range");
            }
            started = samePoints;
            results.push(ended = true);
          } else if (started && !ended) {
            classList.add(this.prefix + "tp-datepicker-range");
            classList.remove(this.prefix + "tp-datepicker-start-sausage");
            results.push(classList.remove(this.prefix + "tp-datepicker-end-sausage"));
          } else {
            if (isEnding) {
              ended = true;
              classList.add(this.prefix + "tp-datepicker-end-sausage--invisible");
              classList.remove(this.prefix + "tp-datepicker-start-sausage--invisible");
            } else if (isStarting) {
              classList.add(this.prefix + "tp-datepicker-start-sausage--invisible");
              classList.remove(this.prefix + "tp-datepicker-end-sausage--invisible");
            } else {
              classList.remove(this.prefix + "tp-datepicker-start-sausage--invisible");
              classList.remove(this.prefix + "tp-datepicker-end-sausage--invisible");
            }
            classList.remove(this.prefix + "tp-datepicker-range");
            classList.remove(this.prefix + "tp-datepicker-start-sausage");
            results.push(classList.remove(this.prefix + "tp-datepicker-end-sausage"));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    TpDatepickerRange.prototype._changeDate = function(date, step) {
      if (step == null) {
        step = 1;
      }
      return new Date((new Date(date)).setDate(date.getDate() + step));
    };

    return TpDatepickerRange;

  })(TpDatepicker);

}).call(this);
