// @ts-nocheck
// https://github.com/robinrodricks/vue3-touch-events
import { App } from 'vue';

function touchX(event) {
  if (event.type.indexOf('mouse') !== -1) {
    return event.clientX;
  }
  return event.touches[0].clientX;
}

function touchY(event) {
  if (event.type.indexOf('mouse') !== -1) {
    return event.clientY;
  }
  return event.touches[0].clientY;
}

const isPassiveSupported = (function () {
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener('test', null, opts);
  } catch (e) {}
  return supportsPassive;
})();

export const vueTouchEvents = (app: App, constructorOptions = {}) => {
  const globalOptions = {
    disableClick: false,
    tapTolerance: 10, // px
    swipeTolerance: 30, // px
    touchHoldTolerance: 400, // ms
    longTapTimeInterval: 400, // ms
    touchClass: '',
    dragFrequency: 100, // ms
    rollOverFrequency: 100, // ms
    ...constructorOptions,
  };

  function touchStartEvent(event) {
    const $this = this.$$touchObj;
    const isTouchEvent = event.type.indexOf('touch') >= 0;
    const isMouseEvent = event.type.indexOf('mouse') >= 0;
    const $el = this;

    if (isTouchEvent) {
      $this.lastTouchStartTime = event.timeStamp;
    }

    if (
      isMouseEvent &&
      $this.lastTouchStartTime &&
      event.timeStamp - $this.lastTouchStartTime < 350
    ) {
      return;
    }

    if ($this.touchStarted) {
      return;
    }

    addTouchClass(this);

    $this.touchStarted = true; // always true while the element is being PRESSED

    $this.touchMoved = false; // true only when the element is PRESSED and DRAGGED a bit
    $this.swipeOutBounded = false;

    $this.startX = touchX(event);
    $this.startY = touchY(event);

    $this.currentX = 0; // always updated with the last mouse X/Y while over the element
    $this.currentY = 0;

    $this.touchStartTime = event.timeStamp;

    // performance: only process swipe events if `swipe.*` event is registered on this element
    $this.hasSwipe =
      hasEvent(this, 'swipe') ||
      hasEvent(this, 'swipe.left') ||
      hasEvent(this, 'swipe.right') ||
      hasEvent(this, 'swipe.top') ||
      hasEvent(this, 'swipe.bottom');

    // performance: only start hold timer if the `hold` event is registered on this element
    if (hasEvent(this, 'hold')) {
      // Trigger touchhold event after `touchHoldTolerance` MS
      $this.touchHoldTimer = setTimeout(() => {
        $this.touchHoldTimer = null;
        triggerEvent(event, $el, 'hold');
      }, $this.options.touchHoldTolerance);
    }

    triggerEvent(event, this, 'press');
  }

  function touchMoveEvent(event) {
    const $this = this.$$touchObj;

    const curX = touchX(event);
    const curY = touchY(event);

    const movedAgain = $this.currentX != curX || $this.currentY != curY;

    $this.currentX = curX;
    $this.currentY = curY;

    if (!$this.touchMoved) {
      const { tapTolerance } = $this.options;

      $this.touchMoved =
        Math.abs($this.startX - $this.currentX) > tapTolerance ||
        Math.abs($this.startY - $this.currentY) > tapTolerance;

      // trigger `drag.once` only once after mouse FIRST moved while dragging the element
      // (`touchMoved` is the flag that indicates we no longer need to trigger this)
      if ($this.touchMoved) {
        cancelTouchHoldTimer($this);
        triggerEvent(event, this, 'drag.once');
      }

      // performance: only process swipe events if `swipe.*` event is registered on this element
    } else if ($this.hasSwipe && !$this.swipeOutBounded) {
      const swipeOutBounded = $this.options.swipeTolerance;

      $this.swipeOutBounded =
        Math.abs($this.startX - $this.currentX) > swipeOutBounded &&
        Math.abs($this.startY - $this.currentY) > swipeOutBounded;
    }

    // only trigger `rollover` event if cursor actually moved over this element
    if (hasEvent(this, 'rollover') && movedAgain) {
      // throttle the `rollover` event based on `rollOverFrequency`
      var now = event.timeStamp;
      var throttle = $this.options.rollOverFrequency;
      if ($this.touchRollTime == null || now > $this.touchRollTime + throttle) {
        $this.touchRollTime = now;

        triggerEvent(event, this, 'rollover');
      }
    }

    // only trigger `drag` event if cursor actually moved and if we are still dragging this element
    if (hasEvent(this, 'drag') && $this.touchStarted && $this.touchMoved && movedAgain) {
      // throttle the `drag` event based on `dragFrequency`
      var now = event.timeStamp;
      var throttle = $this.options.dragFrequency;
      if ($this.touchDragTime == null || now > $this.touchDragTime + throttle) {
        $this.touchDragTime = now;

        triggerEvent(event, this, 'drag');
      }
    }
  }

  function touchCancelEvent() {
    const $this = this.$$touchObj;

    cancelTouchHoldTimer($this);
    removeTouchClass(this);

    $this.touchStarted = $this.touchMoved = false;
    $this.startX = $this.startY = 0;
  }

  function touchEndEvent(event) {
    const $this = this.$$touchObj;
    const isTouchEvent = event.type.indexOf('touch') >= 0;
    const isMouseEvent = event.type.indexOf('mouse') >= 0;

    if (isTouchEvent) {
      $this.lastTouchEndTime = event.timeStamp;
    }

    const touchholdEnd = isTouchEvent && !$this.touchHoldTimer;
    cancelTouchHoldTimer($this);

    $this.touchStarted = false;

    removeTouchClass(this);

    if (isMouseEvent && $this.lastTouchEndTime && event.timeStamp - $this.lastTouchEndTime < 350) {
      return;
    }

    // trigger `end` event when touch stopped
    triggerEvent(event, this, 'release');

    if (!$this.touchMoved) {
      // detect if this is a longTap event or not
      if (
        hasEvent(this, 'longtap') &&
        event.timeStamp - $this.touchStartTime > $this.options.longTapTimeInterval
      ) {
        if (event.cancelable) {
          event.preventDefault();
        }
        triggerEvent(event, this, 'longtap');
      } else if (hasEvent(this, 'hold') && touchholdEnd) {
        if (event.cancelable) {
          event.preventDefault();
        }
      } else {
        // emit tap event
        triggerEvent(event, this, 'tap');
      }

      // performance: only process swipe events if `swipe.*` event is registered on this element
    } else if ($this.hasSwipe && !$this.swipeOutBounded) {
      const swipeOutBounded = $this.options.swipeTolerance;
      let direction;
      const distanceY = Math.abs($this.startY - $this.currentY);
      const distanceX = Math.abs($this.startX - $this.currentX);

      if (distanceY > swipeOutBounded || distanceX > swipeOutBounded) {
        if (distanceY > swipeOutBounded) {
          direction = $this.startY > $this.currentY ? 'top' : 'bottom';
        } else {
          direction = $this.startX > $this.currentX ? 'left' : 'right';
        }

        // Only emit the specified event when it has modifiers
        if (hasEvent(this, `swipe.${direction}`)) {
          triggerEvent(event, this, `swipe.${direction}`, direction);
        } else {
          // Emit a common event when it has no any modifier
          triggerEvent(event, this, 'swipe', direction);
        }
      }
    }
  }

  function mouseEnterEvent() {
    addTouchClass(this);
  }

  function mouseLeaveEvent() {
    removeTouchClass(this);
  }

  function hasEvent($el, eventType) {
    const callbacks = $el.$$touchObj.callbacks[eventType];
    return callbacks != null && callbacks.length > 0;
  }

  function triggerEvent(e, $el, eventType, param) {
    const $this = $el.$$touchObj;

    // get the subscribers for this event
    const callbacks = $this.callbacks[eventType];

    // exit if no subscribers to this particular event
    if (callbacks == null || callbacks.length === 0) {
      return null;
    }

    // per callback
    for (let i = 0; i < callbacks.length; i++) {
      const binding = callbacks[i];

      if (binding.modifiers.stop) {
        e.stopPropagation();
      }

      if (binding.modifiers.prevent) {
        e.preventDefault();
      }

      // handle `self` modifier`
      if (binding.modifiers.self && e.target !== e.currentTarget) {
        continue;
      }

      if (typeof binding.value === 'function') {
        if (param) {
          binding.value(param, e);
        } else {
          binding.value(e);
        }
      }
    }
  }

  function addTouchClass($el) {
    const className = $el.$$touchObj.options.touchClass;
    className && $el.classList.add(className);
  }

  function removeTouchClass($el) {
    const className = $el.$$touchObj.options.touchClass;
    className && $el.classList.remove(className);
  }

  function cancelTouchHoldTimer($this) {
    if ($this.touchHoldTimer) {
      clearTimeout($this.touchHoldTimer);
      $this.touchHoldTimer = null;
    }
  }

  function buildTouchObj($el, extraOptions = null) {
    const touchObj = $el.$$touchObj || {
      // an object contains all callbacks registered,
      // key is event name, value is an array
      callbacks: {},
      // prevent bind twice, set to true when event bound
      hasBindTouchEvents: false,
      // default options, would be override by v-touch-options
      options: globalOptions,
    };
    if (extraOptions) {
      touchObj.options = { ...touchObj.options, ...extraOptions };
    }
    $el.$$touchObj = touchObj;
    return $el.$$touchObj;
  }

  app.directive('touch', {
    beforeMount($el, binding) {
      // build a touch configuration object
      const $this = buildTouchObj($el);
      // declare passive option for the event listener. Defaults to { passive: true } if supported
      let passiveOpt = isPassiveSupported ? { passive: true } : false;
      // register callback
      const eventType = binding.arg || 'tap';
      switch (eventType) {
        case 'swipe':
          var _m = binding.modifiers;
          if (_m.left || _m.right || _m.top || _m.bottom) {
            for (const i in binding.modifiers) {
              if (['left', 'right', 'top', 'bottom'].indexOf(i) >= 0) {
                const _e = `swipe.${i}`;
                $this.callbacks[_e] = $this.callbacks[_e] || [];
                $this.callbacks[_e].push(binding);
              }
            }
          } else {
            $this.callbacks.swipe = $this.callbacks.swipe || [];
            $this.callbacks.swipe.push(binding);
          }
          break;

        case 'press':
        case 'drag':
          if (binding.modifiers.disablePassive) {
            // change the passive option for the `drag` event if disablePassive modifier exists
            passiveOpt = false;
          }
        default:
          $this.callbacks[eventType] = $this.callbacks[eventType] || [];
          $this.callbacks[eventType].push(binding);
      }

      // prevent bind twice
      if ($this.hasBindTouchEvents) {
        return;
      }

      $el.addEventListener('touchstart', touchStartEvent, passiveOpt);
      $el.addEventListener('touchmove', touchMoveEvent, passiveOpt);
      $el.addEventListener('touchcancel', touchCancelEvent);
      $el.addEventListener('touchend', touchEndEvent);

      if (!$this.options.disableClick) {
        $el.addEventListener('mousedown', touchStartEvent);
        $el.addEventListener('mousemove', touchMoveEvent);
        $el.addEventListener('mouseup', touchEndEvent);
        $el.addEventListener('mouseenter', mouseEnterEvent);
        $el.addEventListener('mouseleave', mouseLeaveEvent);
      }

      // set bind mark to true
      $this.hasBindTouchEvents = true;
    },

    unmounted($el) {
      $el.removeEventListener('touchstart', touchStartEvent);
      $el.removeEventListener('touchmove', touchMoveEvent);
      $el.removeEventListener('touchcancel', touchCancelEvent);
      $el.removeEventListener('touchend', touchEndEvent);

      if ($el.$$touchObj && !$el.$$touchObj.options.disableClick) {
        $el.removeEventListener('mousedown', touchStartEvent);
        $el.removeEventListener('mousemove', touchMoveEvent);
        $el.removeEventListener('mouseup', touchEndEvent);
        $el.removeEventListener('mouseenter', mouseEnterEvent);
        $el.removeEventListener('mouseleave', mouseLeaveEvent);
      }

      // remove vars
      delete $el.$$touchObj;
    },
  });

  app.directive('touch-class', {
    beforeMount($el, binding) {
      buildTouchObj($el, {
        touchClass: binding.value,
      });
    },
  });

  app.directive('touch-options', {
    beforeMount($el, binding) {
      buildTouchObj($el, binding.value);
    },
  });
};
