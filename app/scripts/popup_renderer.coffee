class @TpDatepickerPopupRenderer
  node: false
  monthRenderer: null

  render: ->
    year = @datepicker.year
    month = @datepicker.month
    node = @monthRenderer.render(year, month, @datepicker.isCirrentMonth, @datepicker.currentDay)
    @nodeClassList.toggle 'tp-datepicker--current_month', @isCirrentMonth

    @updateMonth "#{@datepicker.t.months[month]} #{year}"
    @datepickerContainerNode.replaceChild(node, @datepickerContainerNode.childNodes[0])


  constructor: (@datepicker, listener) ->
    dayNames = @datepicker.t.days
    sundayFirst = @datepicker.t.start_from_sunday
    dayNames.unshift(dayNames.pop()) if sundayFirst
    @monthRenderer = new TpDatepickerMonthRenderer(listener, dayNames, sundayFirst)

    @node = document.createElement('div')
    @nodeClassList = @node.classList
    @nodeClassList.add 'tp-datepicker'
    @nodeClassList.add "tp-datepicker-#{@datepicker.type}"

    headerNode = document.createElement('div')
    headerNode.className = 'tp-datepicker-header'

    prevMonthNode = document.createElement('span')
    prevMonthNode.className = 'tp-datepicker-prev-month-control'
    prevMonthNode.setAttribute('role', 'tp-datepicker-prev')
    headerNode.appendChild prevMonthNode

    @MonthNode = document.createElement('span')
    @MonthNode.setAttribute('role', 'tp-datepicker-month')
    headerNode.appendChild @MonthNode

    nextMonthNode = document.createElement('span')
    nextMonthNode.className = 'tp-datepicker-next-month-control'
    nextMonthNode.setAttribute('role', 'tp-datepicker-next')
    headerNode.appendChild nextMonthNode

    @node.appendChild headerNode
    @datepickerContainerNode = document.createElement('div')
    @datepickerContainerNode.className = 'tp-datepicker-container'
    @datepickerContainerNode.setAttribute('role', 'tp-datepicker-table-wrapper')

    @datepickerContainerNode.appendChild document.createElement('span')
    @node.appendChild @datepickerContainerNode

    if @datepicker.legend
      @legendNode = document.createElement('span')
      @legendNode.className = 'tp-datepicker-legend'
      @legendNode.setAttribute('role', 'tp-datepicker-legend')
      @node.appendChild @legendNode

    @datepicker.datepickerWrapper.appendChild @node
    @node


  updateMonth: (text) -> @MonthNode.textContent = text
