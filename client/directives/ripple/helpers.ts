type TRippleClass = 'ripple-in' | 'ripple-out';

const createRipple = (
  rippleX: number,
  rippleY: number,
  rippleDimensions: number,
  rippleClass: TRippleClass,
) => {
  const div = document.createElement('div');
  div.className = rippleClass;

  div.style.width = `${rippleDimensions}px`;
  div.style.height = `${rippleDimensions}px`;

  div.style.left = `${rippleX}px`;
  div.style.top = `${rippleY}px`;

  div.style.borderRadius = `${rippleDimensions}px`;

  div.style.pointerEvents = 'none';

  return div;
};

export const rippleEffect = (e, el: HTMLElement, rippleClass: TRippleClass) => {
  el.style.position = 'relative';

  if (rippleClass === 'ripple-in') {
    el.style.overflow = 'hidden';
    el.style.verticalAlign = 'top';
  }

  const rect = el.getBoundingClientRect();
  const cursorX = e.clientX;
  const cursorY = e.clientY;

  const fromTop = cursorY - rect.top;
  const fromBottom = rect.height - fromTop;
  const fromLeft = cursorX - rect.left;
  const fromRight = rect.width - fromLeft;

  const requiredDimension = Math.ceil(Math.max(fromRight, fromLeft, fromTop, fromBottom));

  if (el.getElementsByClassName(rippleClass).length > 0) {
    Array.from(el.getElementsByClassName(rippleClass)).forEach((elItem) => {
      el.removeChild(elItem);
    });
  }

  const ripple = createRipple(
    fromLeft - requiredDimension,
    fromTop - requiredDimension,
    requiredDimension * 2,
    rippleClass,
  );

  el.appendChild(ripple);

  ripple.addEventListener('animationend', ({ animationName }) => {
    if (animationName === 'RippleEffect') ripple.remove();
  });
};
