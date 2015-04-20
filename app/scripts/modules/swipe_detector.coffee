class @SwipeDetector
  xDown: null
  yDown: null
  wrapper: null
  callbacks: {}
  sensivity: 50
  xDiff: 0
  yDiff: 0
  blockScroll: false
  constructor: (@wrapper = document.body, @callbacks = {}, @sensivity = 10) ->
    @wrapper.addEventListener 'touchstart', ((e) => @handleTouchStart(e)), false
    @wrapper.addEventListener 'touchend', ((e) => @handleTouchEnd(e)), false
    @wrapper.addEventListener 'touchmove', ((e) => @handleTouchMove(e)), false

  handleTouchStart: (event) ->
    @blockScroll = true
    @xDown = event.touches[0].clientX
    @yDown = event.touches[0].clientY

  handleTouchEnd: (event) ->
    @blockScroll = false
    if Math.abs(@xDiff) > Math.abs(@yDiff)
      if Math.abs(Math.abs(@xDiff) - Math.abs(@yDiff)) > @sensivity
        if @xDiff > 0
          @callbacks.left && @callbacks.left()
        else
          @callbacks.right && @callbacks.right()
    else
      if Math.abs(Math.abs(@yDiff) - Math.abs(@xDiff)) > @sensivity
        if @yDiff > 0
          @callbacks.up && @callbacks.up()
        else
          @callbacks.down && @callbacks.down()

    @xDown = null
    @yDown = null
    @xDiff = 0
    @yDiff = 0

  handleTouchMove: (event) ->
    event.preventDefault() if @blockScroll
    return unless @xDown && @yDown
    xUp = event.touches[0].clientX
    yUp = event.touches[0].clientY
    @xDiff += @xDown - xUp
    @yDiff += @yDown - yUp
    @xDown = xUp
    @yDown = yUp
