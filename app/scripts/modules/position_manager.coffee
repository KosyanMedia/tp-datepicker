window.positionManager =
  positionAround: (targetNode, sourceNode, forcedBottom = false, offsets={top: 0, left: 0}) ->
    sourceNode.style.position = 'absolute'
    bodyRect = document.documentElement.getBoundingClientRect()
    targetRect = targetNode.getBoundingClientRect()
    targetPosition = @_getOffset(targetNode)
    targetHeight = targetNode.offsetHeight
    bottomSpace = document.documentElement.clientHeight - targetRect.bottom

    showBottom = forcedBottom || bottomSpace > sourceNode.offsetHeight
    showBottom = bottomSpace > targetRect.top unless showBottom

    if showBottom
      top = targetPosition.top + targetHeight - bodyRect.top + offsets.top
      left = targetPosition.left - bodyRect.left + offsets.left
    else
      top = targetPosition.top - sourceNode.offsetHeight - bodyRect.top - offsets.top
      left = targetPosition.left - bodyRect.left + offsets.left

    if left + bodyRect.left + sourceNode.offsetWidth > window.innerWidth - bodyRect.left
      left = window.innerWidth - bodyRect.left - sourceNode.offsetWidth

    if top + sourceNode.offsetHeight > window.innerHeight - bodyRect.top
      top = window.innerHeight - bodyRect.top - sourceNode.offsetHeight

    left = - bodyRect.left if left < - bodyRect.left
    top = - bodyRect.top if top < - bodyRect.top

    sourceNode.style.top = "#{top}px"
    sourceNode.style.left = "#{left}px"
  _getOffset: (el) ->
    _x = _y = 0
    while  el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)
      _x += el.offsetLeft - el.scrollLeft
      _y += el.offsetTop - el.scrollTop
      el = el.offsetParent

    return top: _y, left: _x
