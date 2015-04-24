class @TpDatepickerMonthRenderer
  prefix: ''
  marks: ['prev', 'current-date', 'next']
  isTouchDevice: null

  constructor: (@callback, @daysNames, @sundayFirst, prefix, @onlyFuture) ->
    [@marksPrev, @marksCurrent, @marksNext] = @marks
    @isTouchDevice ||= window.isTouchDevice
    @prefix = prefix if prefix

  render: (year, month, isCurrentMonth, isPrevMonth, currentDay) ->
    @_buildTable(@_monthDaysArray(year, month), isCurrentMonth, isPrevMonth, currentDay, month)

  _firstDay: (year, month) -> (new Date(year, month - 1, 1)).getDay()

  # Add ten hours to 32th day to avoid winter time adjustment
  _monthLength: (year, month) -> 32 - new Date(year, month - 1, 32, 10).getDate()

  _monthDaysArray: (year, month) ->
    nextYear = prevYear = year
    days = []
    needShift = true

    if month == 1
      prevYear--
      prevMonth = 12
      nextMonth = month + 1
    else if month == 12
      nextYear++
      nextMonth = 1
      prevMonth = month - 1
    else
      nextMonth = month + 1
      prevMonth = month - 1

    prevMonthLength = @_monthLength(prevYear, prevMonth)
    prevMonthStart = prevMonthLength - @_firstDay(year, month) + 1 - @sundayFirst
    prevMonthEnd = prevMonthLength + 1

    if prevMonthStart == prevMonthEnd
      prevMonthStart = prevMonthStart - 6
      needShift = false

    `
    for (var day = prevMonthStart, fin = prevMonthEnd; day < fin; days.push([prevYear, prevMonth, day++, this.marksPrev]));
    for (var day = 1, fin = this._monthLength(year, month) + 1; day < fin; days.push([year, month, day++, this.marksCurrent]));
    for (var day = 1; day < 14; days.push([nextYear, nextMonth, day++, this.marksNext]));
    `
    days.shift() if needShift
    days

  _callbackProxy: (event) ->
    target = event.target
    target = target.parentNode if target.tagName == 'DIV'
    unless target.classList.contains("#{@prefix}tp-datepicker-prev-date") && @onlyFuture
      target.hasAttribute('id') && @callback(event.type, target)

  _buildTable: (days, isCurrentMonth, isPrevMonth, currentDay, currentMonth) ->
    table = document.createElement 'table'
    table.classList.add "#{@prefix}tp-datepicker-table"
    table.classList.add "#{@prefix}tp-datepicker-table--#{if @sundayFirst then 'sunday-first' else 'normal-weekdays'}"

    callbackProxy = (event) => @_callbackProxy(event)

    table.addEventListener 'click', callbackProxy
    table.addEventListener 'mouseout', callbackProxy
    table.addEventListener 'mouseover', callbackProxy
    if window.isTouchDevice
      table.addEventListener 'touchstart', callbackProxy
      table.addEventListener 'touchend', callbackProxy
      table.addEventListener 'touchmove', callbackProxy

    th = table.appendChild(document.createElement('tr'))
    for i in [0..6]
      el = th.appendChild(document.createElement('td'))
      el.classList.add("#{@prefix}tp-datepicker-day_name")
      el.textContent = @daysNames[i]

    daysHash = {}
    for i in [0...42]
      cd = days[i]
      el = table.appendChild(document.createElement('tr')) if i % 7 == 0
      date = "#{cd[0]}-#{cd[1]}-#{cd[2]}"
      id = "#{@prefix}tp-datepicker-#{date}"
      day = daysHash[id] = el.appendChild(document.createElement('td'))
      innerEl = day.appendChild(document.createElement('div'))
      day.setAttribute('id', id)
      day.setAttribute('data-date', date)
      innerEl.textContent = cd[2]
      day.className = "#{@prefix}tp-datepicker-#{cd[3]}"
      if isPrevMonth || (isCurrentMonth && ((currentDay > cd[2] && currentMonth >= cd[1]) || cd[3] == @marksPrev))
        day.className += " #{@prefix}tp-datepicker-prev-date"
      else
        day.className += " #{@prefix}tp-datepicker-current"

    @days = daysHash
    console.log @days
    table
