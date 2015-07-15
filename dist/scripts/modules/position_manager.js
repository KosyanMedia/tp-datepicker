(function() {
  window.positionManager = {
    positionAround: function(targetNode, sourceNode, forcedBottom, offsets) {
      var bodyRect, bottomSpace, left, showBottom, targetHeight, targetPosition, targetRect, top;
      if (forcedBottom == null) {
        forcedBottom = false;
      }
      if (offsets == null) {
        offsets = {
          top: 0,
          left: 0
        };
      }
      sourceNode.style.position = 'absolute';
      bodyRect = document.documentElement.getBoundingClientRect();
      targetRect = targetNode.getBoundingClientRect();
      targetPosition = this._getOffset(targetNode);
      targetHeight = targetNode.offsetHeight;
      bottomSpace = document.documentElement.clientHeight - targetRect.bottom;
      showBottom = forcedBottom || bottomSpace > sourceNode.offsetHeight;
      if (!showBottom) {
        showBottom = bottomSpace > targetRect.top;
      }
      if (showBottom) {
        top = targetPosition.top + targetHeight - bodyRect.top + offsets.top;
        left = targetPosition.left - bodyRect.left + offsets.left;
      } else {
        top = targetPosition.top - sourceNode.offsetHeight - bodyRect.top - offsets.top;
        left = targetPosition.left - bodyRect.left + offsets.left;
      }
      if (left + bodyRect.left + sourceNode.offsetWidth > window.innerWidth - bodyRect.left) {
        left = window.innerWidth - bodyRect.left - sourceNode.offsetWidth;
      }
      if (top + sourceNode.offsetHeight > window.innerHeight - bodyRect.top) {
        top = window.innerHeight - bodyRect.top - sourceNode.offsetHeight;
      }
      if (left < -bodyRect.left) {
        left = -bodyRect.left;
      }
      if (top < -bodyRect.top) {
        top = -bodyRect.top;
      }
      sourceNode.style.top = top + "px";
      return sourceNode.style.left = left + "px";
    },
    _getOffset: function(el) {
      var _x, _y;
      _x = _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }
      return {
        top: _y,
        left: _x
      };
    }
  };

}).call(this);
