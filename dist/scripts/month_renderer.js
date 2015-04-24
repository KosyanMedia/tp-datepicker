(function() {
  this.TpDatepickerMonthRenderer = (function() {
    TpDatepickerMonthRenderer.prototype.prefix = '';

    TpDatepickerMonthRenderer.prototype.marks = ['prev', 'current-date', 'next'];

    TpDatepickerMonthRenderer.prototype.isTouchDevice = null;

    function TpDatepickerMonthRenderer(callback, daysNames, sundayFirst, prefix, onlyFuture) {
      var ref;
      this.callback = callback;
      this.daysNames = daysNames;
      this.sundayFirst = sundayFirst;
      this.onlyFuture = onlyFuture;
      ref = this.marks, this.marksPrev = ref[0], this.marksCurrent = ref[1], this.marksNext = ref[2];
      this.isTouchDevice || (this.isTouchDevice = window.isTouchDevice);
      if (prefix) {
        this.prefix = prefix;
      }
    }

    TpDatepickerMonthRenderer.prototype.render = function(year, month, isCurrentMonth, isPrevMonth, currentDay) {
      return this._buildTable(this._monthDaysArray(year, month), isCurrentMonth, isPrevMonth, currentDay, month);
    };

    TpDatepickerMonthRenderer.prototype._firstDay = function(year, month) {
      return (new Date(year, month - 1, 1)).getDay();
    };

    TpDatepickerMonthRenderer.prototype._monthLength = function(year, month) {
      return 32 - new Date(year, month - 1, 32, 10).getDate();
    };

    TpDatepickerMonthRenderer.prototype._monthDaysArray = function(year, month) {
      var days, needShift, nextMonth, nextYear, prevMonth, prevMonthEnd, prevMonthLength, prevMonthStart, prevYear;
      nextYear = prevYear = year;
      days = [];
      needShift = true;
      if (month === 1) {
        prevYear--;
        prevMonth = 12;
        nextMonth = month + 1;
      } else if (month === 12) {
        nextYear++;
        nextMonth = 1;
        prevMonth = month - 1;
      } else {
        nextMonth = month + 1;
        prevMonth = month - 1;
      }
      prevMonthLength = this._monthLength(prevYear, prevMonth);
      prevMonthStart = prevMonthLength - this._firstDay(year, month) + 1 - this.sundayFirst;
      prevMonthEnd = prevMonthLength + 1;
      if (prevMonthStart === prevMonthEnd) {
        prevMonthStart = prevMonthStart - 6;
        needShift = false;
      }
      
    for (var day = prevMonthStart, fin = prevMonthEnd; day < fin; days.push([prevYear, prevMonth, day++, this.marksPrev]));
    for (var day = 1, fin = this._monthLength(year, month) + 1; day < fin; days.push([year, month, day++, this.marksCurrent]));
    for (var day = 1; day < 14; days.push([nextYear, nextMonth, day++, this.marksNext]));
    ;
      if (needShift) {
        days.shift();
      }
      return days;
    };

    TpDatepickerMonthRenderer.prototype._callbackProxy = function(event) {
      var target;
      target = event.target;
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (!(target.classList.contains(this.prefix + "tp-datepicker-prev-date") && this.onlyFuture)) {
        return target.hasAttribute('id') && this.callback(event.type, target);
      }
    };

    TpDatepickerMonthRenderer.prototype._buildTable = function(days, isCurrentMonth, isPrevMonth, currentDay, currentMonth) {
      var callbackProxy, cd, date, day, daysHash, el, i, id, innerEl, j, k, table, th;
      table = document.createElement('table');
      table.classList.add(this.prefix + "tp-datepicker-table");
      table.classList.add(this.prefix + "tp-datepicker-table--" + (this.sundayFirst ? 'sunday-first' : 'normal-weekdays'));
      callbackProxy = (function(_this) {
        return function(event) {
          return _this._callbackProxy(event);
        };
      })(this);
      table.addEventListener('click', callbackProxy);
      table.addEventListener('mouseout', callbackProxy);
      table.addEventListener('mouseover', callbackProxy);
      if (window.isTouchDevice) {
        table.addEventListener('touchstart', callbackProxy);
        table.addEventListener('touchend', callbackProxy);
        table.addEventListener('touchmove', callbackProxy);
      }
      th = table.appendChild(document.createElement('tr'));
      for (i = j = 0; j <= 6; i = ++j) {
        el = th.appendChild(document.createElement('td'));
        el.classList.add(this.prefix + "tp-datepicker-day_name");
        el.textContent = this.daysNames[i];
      }
      daysHash = {};
      for (i = k = 0; k < 42; i = ++k) {
        cd = days[i];
        if (i % 7 === 0) {
          el = table.appendChild(document.createElement('tr'));
        }
        date = cd[0] + "-" + cd[1] + "-" + cd[2];
        id = this.prefix + "tp-datepicker-" + date;
        day = daysHash[id] = el.appendChild(document.createElement('td'));
        innerEl = day.appendChild(document.createElement('div'));
        day.setAttribute('id', id);
        day.setAttribute('data-date', date);
        innerEl.textContent = cd[2];
        day.className = this.prefix + "tp-datepicker-" + cd[3];
        if (isPrevMonth || (isCurrentMonth && ((currentDay > cd[2] && currentMonth >= cd[1]) || cd[3] === this.marksPrev))) {
          day.className += " " + this.prefix + "tp-datepicker-prev-date";
        } else {
          day.className += " " + this.prefix + "tp-datepicker-current";
        }
      }
      this.days = daysHash;
      console.log(this.days);
      return table;
    };

    return TpDatepickerMonthRenderer;

  })();

}).call(this);
