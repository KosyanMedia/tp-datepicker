(function() {
  this.TpDatepickerPopupRenderer = (function() {
    TpDatepickerPopupRenderer.prototype.prefix = '';

    TpDatepickerPopupRenderer.prototype.node = false;

    TpDatepickerPopupRenderer.prototype.monthRenderer = null;

    TpDatepickerPopupRenderer.prototype.render = function() {
      var month, node, year;
      year = this.datepicker.year;
      month = this.datepicker.month;
      node = this.monthRenderer.render(year, month, this.datepicker.isCurrentMonth, this.datepicker.isPrevMonth, this.datepicker.currentDay);
      this.nodeClassList.toggle(this.prefix + "tp-datepicker--current_month", this.onlyFuture && this.datepicker.isCurrentMonth);
      this.updateMonth(this.datepicker.t.months[month] + " " + year);
      return this.datepickerContainerNode.replaceChild(node, this.datepickerContainerNode.childNodes[0]);
    };

    function TpDatepickerPopupRenderer(datepicker, listener, prefix) {
      var dayNames, headerNode, nextMonthNode, prevMonthNode, sundayFirst;
      this.datepicker = datepicker;
      if (prefix) {
        this.prefix = prefix;
      }
      this.onlyFuture = this.datepicker.onlyFuture;
      dayNames = this.datepicker.t.days;
      sundayFirst = this.datepicker.t.start_from_sunday;
      if (sundayFirst) {
        dayNames.unshift(dayNames.pop());
      }
      this.monthRenderer = new TpDatepickerMonthRenderer(listener, dayNames, sundayFirst, this.prefix, this.onlyFuture);
      this.node = document.createElement('div');
      this.nodeClassList = this.node.classList;
      this.nodeClassList.add(this.prefix + "tp-datepicker");
      this.nodeClassList.add(this.prefix + "tp-datepicker-" + this.datepicker.type);
      headerNode = document.createElement('div');
      headerNode.className = this.prefix + "tp-datepicker-header";
      prevMonthNode = document.createElement('span');
      prevMonthNode.className = this.prefix + "tp-datepicker-prev-month-control";
      prevMonthNode.setAttribute('role', 'tp-datepicker-prev');
      headerNode.appendChild(prevMonthNode);
      this.MonthNode = document.createElement('span');
      this.MonthNode.setAttribute('role', 'tp-datepicker-month');
      headerNode.appendChild(this.MonthNode);
      nextMonthNode = document.createElement('span');
      nextMonthNode.className = this.prefix + "tp-datepicker-next-month-control";
      nextMonthNode.setAttribute('role', 'tp-datepicker-next');
      headerNode.appendChild(nextMonthNode);
      this.node.appendChild(headerNode);
      this.datepickerContainerNode = document.createElement('div');
      this.datepickerContainerNode.className = this.prefix + "tp-datepicker-container";
      this.datepickerContainerNode.setAttribute('role', 'tp-datepicker-table-wrapper');
      this.datepickerContainerNode.appendChild(document.createElement('span'));
      this.node.appendChild(this.datepickerContainerNode);
      if (this.datepicker.legend) {
        this.legendNode = document.createElement('span');
        this.legendNode.className = this.prefix + "tp-datepicker-legend";
        this.legendNode.setAttribute('role', 'tp-datepicker-legend');
        this.node.appendChild(this.legendNode);
      }
      document.body.appendChild(this.node);
      this.node;
    }

    TpDatepickerPopupRenderer.prototype.updateMonth = function(text) {
      return this.MonthNode.textContent = text;
    };

    return TpDatepickerPopupRenderer;

  })();

}).call(this);
