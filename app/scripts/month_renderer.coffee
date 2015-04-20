class @TpDatepickerMonthRenderer
  prefix: 'tp-datepicker-'
  marks: ['prev', 'current-date', 'next']
  isTouchDevice: null

  constructor: (@callback, @daysNames, @sundayFirst, marks) ->
    @marks = marks if marks
    [@marksPrev, @marksCurrent, @marksNext] = @marks
    @isTouchDevice ||= window.isTouchDevice

  render: (month, year, isCurrentMonth, currentDay) ->
    @_buildTable(@_monthDaysArray(month, year), isCurrentMonth, currentDay)

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
    target.classList.contains('tp-datepicker-current') && target.hasAttribute('id') && @callback(event.type, target)

  _buildTable: (days, isCurrentMonth, currentDay) ->
    table = document.createElement 'table'
    table.classList.add "#{@prefix}table"
    table.classList.add "#{@prefix}table--#{if @sundayFirst then 'sunday-first' else 'normal-weekdays'}"

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
      el.classList.add("#{@prefix}day_name")
      el.textContent = @daysNames[i]

    daysHash = {}
    for i in [0...42]
      cd = days[i]
      el = table.appendChild(document.createElement('tr')) if i % 7 == 0
      date = "#{cd[0]}-#{cd[1]}-#{cd[2]}"
      id = "#{@prefix}#{date}-#{cd[3]}"
      day = daysHash[id] = el.appendChild(document.createElement('td'))
      innerEl = day.appendChild(document.createElement('div'))
      day.setAttribute('id', id)
      day.setAttribute('data-date', date)
      innerEl.textContent = cd[2]
      day.className = "#{@prefix}#{cd[3]}"
      if isCurrentMonth && currentDay > cd[2]
        day.className += ' tp-datepicker-prev-date'
      else
        day.className += ' tp-datepicker-current'

    @days = daysHash

    table
