window.positionManager =
  positionAround: (targetNode, sourceNode, forcedBottom = false) ->
    sourceNode.style.position = 'absolute'
    bodyRect = document.body.getBoundingClientRect()
    targetRect = targetNode.getBoundingClientRect()
    targetPosition = @_getOffset(targetNode)
    targetHeight = targetNode.offsetHeight
    bottomSpace = document.documentElement.clientHeight - targetRect.bottom

    showBottom = forcedBottom || bottomSpace > sourceNode.clientHeight
    showBottom = bottomSpace > targetRect.top unless showBottom

    if showBottom
      sourceNode.style.top = "#{targetPosition.top + targetHeight}px"
      sourceNode.style.left = "#{targetPosition.left}px"
    else
      sourceNode.style.top = "#{targetPosition.top - sourceNode.clientHeight}px"
      sourceNode.style.left = "#{targetPosition.left}px"

  _getOffset: (el) ->
    _x = _y = 0
    while  el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)
      _x += el.offsetLeft - el.scrollLeft
      _y += el.offsetTop - el.scrollTop
      el = el.offsetParent

    return top: _y, left: _x
