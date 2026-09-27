/**
 * CSS & Web Developer Client-Side Engines
 * High-performance, offline CSS generators with live CSS rule generation,
 * responsive formulas, CSS variables, and HTML/CSS snippets.
 */

export interface CssClampOptions {
  minPx: number;
  maxPx: number;
  minVw: number;
  maxVw: number;
  baseRem?: number;
}

/**
 * 1. CSS Clamp Generator
 * Calculates fluid typography or spacing using clamp(min, preferred, max)
 */
export function generateCssClamp(
  minPx = 16,
  maxPx = 28,
  minVw = 320,
  maxVw = 1200,
  baseRem = 16
): string {
  const minRem = (minPx / baseRem).toFixed(4);
  const maxRem = (maxPx / baseRem).toFixed(4);
  
  // Slope formula: (maxPx - minPx) / (maxVw - minVw)
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const slopeVw = (slope * 100).toFixed(4);
  
  // Y-intercept: (minPx - minVw * slope) / baseRem
  const yAxisIntersection = ((minPx - minVw * slope) / baseRem).toFixed(4);
  
  const sign = parseFloat(yAxisIntersection) >= 0 ? '+' : '-';
  const absY = Math.abs(parseFloat(yAxisIntersection)).toFixed(4);

  const clampValue = `clamp(${minRem}rem, ${absY}rem ${sign} ${slopeVw}vw, ${maxRem}rem)`;

  return `/* CSS Clamp Generator (Fluid Responsive Value) */
/* Screen Range: ${minVw}px to ${maxVw}px | Output Range: ${minPx}px to ${maxPx}px */

:root {
  --fluid-value: ${clampValue};
}

.responsive-element {
  font-size: ${clampValue};
}

/* Fallback for older browsers */
@supports not (font-size: clamp(1rem, 1vw, 2rem)) {
  .responsive-element {
    font-size: ${minRem}rem;
  }
  @media (min-width: ${minVw}px) {
    .responsive-element {
      font-size: calc(${absY}rem ${sign} ${slopeVw}vw);
    }
  }
  @media (min-width: ${maxVw}px) {
    .responsive-element {
      font-size: ${maxRem}rem;
    }
  }
}`;
}

/**
 * 2. CSS Grid Layout Generator
 */
export function generateCssGrid(
  columns = 'repeat(3, 1fr)',
  rows = 'auto',
  gap = '1.5rem',
  alignItems = 'stretch',
  justifyContent = 'stretch'
): string {
  return `/* CSS Grid Layout Generator */
.grid-container {
  display: grid;
  grid-template-columns: ${columns};
  grid-template-rows: ${rows};
  gap: ${gap};
  align-items: ${alignItems};
  justify-content: ${justifyContent};
}

/* Responsive Auto-Fit Fallback Helper */
.grid-responsive-autofit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${gap};
}

.grid-item {
  min-height: 120px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px dashed rgba(99, 102, 241, 0.4);
  border-radius: 8px;
  padding: 1rem;
}`;
}

/**
 * 3. CSS Flexbox Layout Generator
 */
export function generateCssFlexbox(
  direction = 'row',
  justify = 'space-between',
  align = 'center',
  wrap = 'wrap',
  gap = '1rem'
): string {
  return `/* CSS Flexbox Layout Generator */
.flex-container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap};
}

.flex-item {
  flex: 0 1 auto; /* flex-grow flex-shrink flex-basis */
  padding: 1rem;
}

/* Flex child utility helpers */
.flex-grow-1 { flex-grow: 1; }
.flex-shrink-0 { flex-shrink: 0; }
.align-self-start { align-self: flex-start; }
.align-self-center { align-self: center; }`;
}

/**
 * 4. CSS Animation Generator
 */
export function generateCssAnimation(
  animationName = 'pulse-bounce',
  duration = 1.5,
  timing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  iteration = 'infinite',
  direction = 'normal'
): string {
  let keyframes = '';
  switch (animationName) {
    case 'bounce':
      keyframes = `@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}`;
      break;
    case 'pulse':
      keyframes = `@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.96);
  }
}`;
      break;
    case 'shake':
      keyframes = `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}`;
      break;
    case 'spin':
      keyframes = `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
      break;
    default:
      keyframes = `@keyframes ${animationName} {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.05) translateY(-6px);
    opacity: 0.85;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}`;
  }

  return `/* CSS Keyframe Animation Generator */
.animated-element {
  animation: ${animationName} ${duration}s ${timing} ${iteration} ${direction};
  will-change: transform, opacity;
}

${keyframes}`;
}

/**
 * 5. CSS Transform Generator
 */
export function generateCssTransform(
  rotate = 15,
  scale = 1.1,
  translateX = 0,
  translateY = -5,
  skewX = 0,
  skewY = 0,
  perspective = 600
): string {
  const transformParts = [
    perspective > 0 ? `perspective(${perspective}px)` : '',
    rotate !== 0 ? `rotate(${rotate}deg)` : '',
    scale !== 1 ? `scale(${scale})` : '',
    translateX !== 0 || translateY !== 0 ? `translate(${translateX}px, ${translateY}px)` : '',
    skewX !== 0 || skewY !== 0 ? `skew(${skewX}deg, ${skewY}deg)` : ''
  ].filter(Boolean).join(' ');

  return `/* CSS 2D & 3D Transform Generator */
.transformed-box {
  transform: ${transformParts || 'none'};
  transform-origin: center center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.transformed-box:hover {
  transform: scale(${Math.max(1, scale * 1.05)});
}`;
}

/**
 * 6. CSS Filter Generator
 */
export function generateCssFilter(
  blur = 0,
  brightness = 105,
  contrast = 110,
  grayscale = 0,
  hueRotate = 0,
  invert = 0,
  saturate = 120,
  sepia = 0
): string {
  const filters = [
    blur > 0 ? `blur(${blur}px)` : null,
    brightness !== 100 ? `brightness(${brightness}%)` : null,
    contrast !== 100 ? `contrast(${contrast}%)` : null,
    grayscale > 0 ? `grayscale(${grayscale}%)` : null,
    hueRotate !== 0 ? `hue-rotate(${hueRotate}deg)` : null,
    invert > 0 ? `invert(${invert}%)` : null,
    saturate !== 100 ? `saturate(${saturate}%)` : null,
    sepia > 0 ? `sepia(${sepia}%)` : null
  ].filter(Boolean).join(' ');

  return `/* CSS Visual Filter Generator */
.filtered-element {
  filter: ${filters || 'none'};
  transition: filter 0.25s ease-in-out;
}

.filtered-element:hover {
  filter: none; /* Restore original on hover */
}`;
}

/**
 * 7. CSS Text Shadow Generator
 */
export function generateCssTextShadow(
  styleType = 'neon',
  color = '#6366f1',
  blur = 12
): string {
  let shadow = '';
  switch (styleType) {
    case 'neon':
      shadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`;
      break;
    case '3d':
      shadow = `1px 1px 0px #4f46e5, 2px 2px 0px #4338ca, 3px 3px 0px #3730a3, 4px 4px 6px rgba(0, 0, 0, 0.5)`;
      break;
    case 'retro':
      shadow = `3px 3px 0px #f59e0b, 6px 6px 0px #ef4444`;
      break;
    case 'soft':
    default:
      shadow = `0 2px 4px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(99, 102, 241, 0.25)`;
      break;
  }

  return `/* CSS Text Shadow Generator (${styleType}) */
.text-shadow-styled {
  text-shadow: ${shadow};
  font-weight: 700;
  letter-spacing: -0.02em;
}`;
}

/**
 * 8. CSS Gradient Text Generator
 */
export function generateCssGradientText(
  angle = 135,
  color1 = '#ec4899',
  color2 = '#8b5cf6',
  color3 = '#3b82f6'
): string {
  const gradient = color3
    ? `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`
    : `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  return `/* CSS Gradient Text Generator */
.gradient-heading {
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-weight: 800;
}`;
}

/**
 * 9. CSS Glassmorphism Generator
 */
export function generateCssGlassmorphism(
  blur = 16,
  opacity = 0.2,
  outlineOpacity = 0.3,
  bgColor = '#ffffff'
): string {
  return `/* CSS Glassmorphism / Frosted Glass Generator */
.glass-container {
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid rgba(255, 255, 255, ${outlineOpacity});
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 2rem;
  color: #ffffff;
}

/* Dark Mode Tint Variant */
.glass-dark {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
}`;
}

/**
 * 10. CSS Neumorphism Generator
 */
export function generateCssNeumorphism(
  size = 200,
  radius = 24,
  distance = 12,
  blur = 24,
  shape = 'flat', // flat | convex | concave | inset
  baseColor = '#e0e5ec'
): string {
  let shadow = '';
  let background = baseColor;

  if (shape === 'inset') {
    shadow = `inset ${distance}px ${distance}px ${blur}px #bebebe, inset -${distance}px -${distance}px ${blur}px #ffffff`;
  } else if (shape === 'convex') {
    background = `linear-gradient(145deg, #f0f5fc, #cacfd4)`;
    shadow = `${distance}px ${distance}px ${blur}px #bebebe, -${distance}px -${distance}px ${blur}px #ffffff`;
  } else if (shape === 'concave') {
    background = `linear-gradient(145deg, #cacfd4, #f0f5fc)`;
    shadow = `${distance}px ${distance}px ${blur}px #bebebe, -${distance}px -${distance}px ${blur}px #ffffff`;
  } else {
    // flat
    shadow = `${distance}px ${distance}px ${blur}px #bebebe, -${distance}px -${distance}px ${blur}px #ffffff`;
  }

  return `/* CSS Neumorphism (Soft UI) Generator */
.neumorphic-card {
  width: ${size}px;
  height: ${size}px;
  border-radius: ${radius}px;
  background: ${background};
  box-shadow: ${shadow};
  transition: all 0.2s ease-in-out;
}

.neumorphic-card:active {
  box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
}`;
}

/**
 * 11. CSS Button Generator
 */
export function generateCssButton(
  variant = 'gradient',
  bgColor = '#6366f1',
  textColor = '#ffffff',
  radius = 10,
  shadow = true
): string {
  return `/* CSS Button Generator (${variant}) */
.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${radius}px;
  color: ${textColor};
  background: ${variant === 'gradient' ? `linear-gradient(135deg, ${bgColor}, #8b5cf6)` : bgColor};
  border: none;
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  ${shadow ? `box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);` : ''}
}

.custom-btn:hover {
  transform: translateY(-2px);
  ${shadow ? `box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.49);` : ''}
}

.custom-btn:active {
  transform: translateY(0);
}

.custom-btn:focus-visible {
  outline: 2px solid ${bgColor};
  outline-offset: 3px;
}`;
}

/**
 * 12. CSS Card Generator
 */
export function generateCssCard(
  styleType = 'elevated',
  padding = 24,
  radius = 16,
  shadowDepth = 'medium'
): string {
  let shadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
  if (shadowDepth === 'low') shadow = '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)';
  if (shadowDepth === 'high') shadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';

  return `/* CSS Card Layout Generator */
.app-card {
  padding: ${padding}px;
  border-radius: ${radius}px;
  background: #ffffff;
  box-shadow: ${shadow};
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.15);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .app-card {
    background: #1e293b;
    border-color: #334155;
    color: #f8fafc;
  }
}`;
}

/**
 * 13. CSS Tooltip Generator
 */
export function generateCssTooltip(
  position = 'top',
  bgColor = '#0f172a',
  textColor = '#ffffff',
  sampleText = 'Helpful tooltip prompt'
): string {
  let posRules = '';
  let arrowRules = '';
  switch (position) {
    case 'bottom':
      posRules = `top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px;`;
      arrowRules = `bottom: 100%; left: 50%; transform: translateX(-50%); border-bottom-color: ${bgColor};`;
      break;
    case 'left':
      posRules = `top: 50%; right: 100%; transform: translateY(-50%); margin-right: 8px;`;
      arrowRules = `left: 100%; top: 50%; transform: translateY(-50%); border-left-color: ${bgColor};`;
      break;
    case 'right':
      posRules = `top: 50%; left: 100%; transform: translateY(-50%); margin-left: 8px;`;
      arrowRules = `right: 100%; top: 50%; transform: translateY(-50%); border-right-color: ${bgColor};`;
      break;
    case 'top':
    default:
      posRules = `bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;`;
      arrowRules = `top: 100%; left: 50%; transform: translateX(-50%); border-top-color: ${bgColor};`;
      break;
  }

  return `/* Pure CSS Tooltip Generator (Zero JavaScript) */
.tooltip-trigger {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-trigger::after {
  content: attr(data-tooltip);
  position: absolute;
  ${posRules}
  padding: 6px 12px;
  background-color: ${bgColor};
  color: ${textColor};
  font-size: 0.8125rem;
  line-height: 1.4;
  white-space: nowrap;
  border-radius: 6px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tooltip-trigger::before {
  content: '';
  position: absolute;
  ${arrowRules}
  border-width: 5px;
  border-style: solid;
  border-color: transparent;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.tooltip-trigger:hover::after,
.tooltip-trigger:hover::before {
  opacity: 1;
  visibility: visible;
}

/* HTML Usage: <span class="tooltip-trigger" data-tooltip="${sampleText}">Hover me</span> */`;
}

/**
 * 14. CSS Modal Generator
 */
export function generateCssModal(
  animationType = 'scale-fade',
  maxWidth = 540,
  backdropBlur = true
): string {
  return `/* CSS Modal & Dialog Overlay Generator */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  ${backdropBlur ? 'backdrop-filter: blur(4px);' : ''}
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 1.5rem;
  animation: modalFadeIn 0.2s ease-out;
}

.modal-dialog {
  width: 100%;
  max-width: ${maxWidth}px;
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(226, 232, 240, 0.6);
  animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}`;
}

/**
 * 15. CSS Toggle Switch Generator
 */
export function generateCssToggleSwitch(
  styleType = 'ios',
  activeColor = '#6366f1',
  size = 'medium'
): string {
  const width = size === 'large' ? 56 : size === 'small' ? 36 : 46;
  const height = size === 'large' ? 32 : size === 'small' ? 20 : 26;
  const dotSize = height - 4;
  const offset = width - height;

  return `/* Pure CSS Toggle Switch Generator */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: ${width}px;
  height: ${height}px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #cbd5e1;
  border-radius: ${height}px;
  transition: background-color 0.25s ease;
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: ${dotSize}px;
  width: ${dotSize}px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: ${activeColor};
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(${offset}px);
}

.toggle-switch input:focus-visible + .toggle-slider {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.4);
}

/* HTML:
<label class="toggle-switch">
  <input type="checkbox">
  <span class="toggle-slider"></span>
</label>
*/`;
}

/**
 * 16. CSS Checkbox Generator
 */
export function generateCssCheckbox(
  styleType = 'rounded',
  checkColor = '#6366f1',
  size = 20
): string {
  return `/* Pure Custom CSS Checkbox Generator */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.95rem;
}

.custom-checkbox input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: ${size}px;
  height: ${size}px;
  border: 2px solid #94a3b8;
  border-radius: ${styleType === 'rounded' ? '6px' : '3px'};
  outline: none;
  cursor: pointer;
  position: relative;
  display: grid;
  place-content: center;
  transition: all 0.2s ease;
}

.custom-checkbox input[type="checkbox"]::before {
  content: "";
  width: ${Math.round(size * 0.55)}px;
  height: ${Math.round(size * 0.3)}px;
  border-left: 2.5px solid #ffffff;
  border-bottom: 2.5px solid #ffffff;
  transform: rotate(-45deg) scale(0);
  transition: transform 0.15s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  margin-top: -2px;
}

.custom-checkbox input[type="checkbox"]:checked {
  background-color: ${checkColor};
  border-color: ${checkColor};
}

.custom-checkbox input[type="checkbox"]:checked::before {
  transform: rotate(-45deg) scale(1);
}

.custom-checkbox input[type="checkbox"]:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
}`;
}

/**
 * 17. CSS Radio Button Generator
 */
export function generateCssRadioButton(
  styleType = 'pulse',
  activeColor = '#6366f1',
  size = 22
): string {
  const dotSize = Math.round(size * 0.5);

  return `/* Custom CSS Radio Button Generator */
.custom-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.custom-radio input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: ${size}px;
  height: ${size}px;
  border: 2px solid #94a3b8;
  border-radius: 50%;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.custom-radio input[type="radio"]::before {
  content: "";
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  background-color: ${activeColor};
}

.custom-radio input[type="radio"]:checked {
  border-color: ${activeColor};
}

.custom-radio input[type="radio"]:checked::before {
  transform: scale(1);
}

.custom-radio input[type="radio"]:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
}`;
}

/**
 * 18. CSS Loader Generator
 */
export function generateCssLoader(
  loaderType = 'dots',
  primaryColor = '#6366f1',
  size = 48,
  speedSec = 1.2
): string {
  if (loaderType === 'bars') {
    return `/* CSS Equalizer Bars Loader */
.css-bars-loader {
  display: flex;
  align-items: center;
  gap: 6px;
  height: ${size}px;
}

.css-bars-loader div {
  width: 6px;
  height: 100%;
  background: ${primaryColor};
  border-radius: 3px;
  animation: barsWave ${speedSec}s ease-in-out infinite;
}

.css-bars-loader div:nth-child(2) { animation-delay: 0.15s; }
.css-bars-loader div:nth-child(3) { animation-delay: 0.3s; }
.css-bars-loader div:nth-child(4) { animation-delay: 0.45s; }

@keyframes barsWave {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}`;
  }

  return `/* CSS Pulse Dots Loader */
.css-dots-loader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.css-dots-loader div {
  width: 12px;
  height: 12px;
  background-color: ${primaryColor};
  border-radius: 50%;
  animation: dotPulse ${speedSec}s infinite ease-in-out both;
}

.css-dots-loader div:nth-child(1) { animation-delay: -0.32s; }
.css-dots-loader div:nth-child(2) { animation-delay: -0.16s; }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}`;
}

/**
 * 19. CSS Spinner Generator
 */
export function generateCssSpinner(
  spinnerType = 'ring',
  color = '#6366f1',
  size = 40,
  borderThickness = 4
): string {
  return `/* CSS Spinner Generator (${spinnerType}) */
.css-spinner {
  width: ${size}px;
  height: ${size}px;
  border: ${borderThickness}px solid rgba(99, 102, 241, 0.15);
  border-top-color: ${color};
  border-radius: 50%;
  animation: spinnerRotate 0.8s linear infinite;
  display: inline-block;
}

@keyframes spinnerRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dual Ring Variant */
.css-spinner-dual {
  width: ${size}px;
  height: ${size}px;
  border: ${borderThickness}px solid transparent;
  border-top-color: ${color};
  border-bottom-color: ${color};
  border-radius: 50%;
  animation: spinnerRotate 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}`;
}

/**
 * 20. CSS Skeleton Loader Generator
 */
export function generateCssSkeletonLoader(
  shape = 'rectangle',
  baseColor = '#e2e8f0',
  highlightColor = '#f8fafc',
  duration = 1.5
): string {
  const borderRadius = shape === 'circle' ? '50%' : shape === 'text' ? '4px' : '10px';
  const height = shape === 'text' ? '1rem' : '120px';

  return `/* CSS Shimmer Skeleton Placeholder Loader */
.skeleton-shimmer {
  background-color: ${baseColor};
  background-image: linear-gradient(
    90deg,
    ${baseColor} 0%,
    ${highlightColor} 50%,
    ${baseColor} 100%
  );
  background-size: 200% 100%;
  border-radius: ${borderRadius};
  height: ${height};
  animation: skeletonPulse ${duration}s infinite linear;
}

@keyframes skeletonPulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Dark mode skeleton */
@media (prefers-color-scheme: dark) {
  .skeleton-shimmer {
    background-color: #1e293b;
    background-image: linear-gradient(
      90deg,
      #1e293b 0%,
      #334155 50%,
      #1e293b 100%
    );
  }
}`;
}

/**
 * 21. CSS Media Query Generator
 */
export function generateCssMediaQuery(
  target = 'all',
  minWidth = 768,
  maxWidth = 1024,
  orientation = 'none'
): string {
  return `/* CSS Media Query Generator */
/* 1. Mobile-First (min-width) */
@media (min-width: ${minWidth}px) {
  .container {
    max-width: ${minWidth}px;
    padding: 2rem;
  }
}

/* 2. Desktop-Down (max-width) */
@media (max-width: ${maxWidth}px) {
  .sidebar {
    display: none;
  }
}

/* 3. Modern Range Syntax (Media Queries Level 4) */
@media (${minWidth}px <= width <= ${maxWidth}px) {
  .tablet-banner {
    display: block;
  }
}

/* 4. Accessibility & User Preferences */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0f172a;
    color: #f8fafc;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`;
}

/**
 * 22. CSS Breakpoint Planner
 */
export function generateCssBreakpointPlanner(
  system = 'tailwind'
): string {
  return `/* CSS Breakpoint Planner & Token Hierarchy */

/* 1. Standard CSS Custom Properties */
:root {
  --breakpoint-xs: 475px;  /* Extra small mobile */
  --breakpoint-sm: 640px;  /* Small devices, phones */
  --breakpoint-md: 768px;  /* Medium devices, tablets */
  --breakpoint-lg: 1024px; /* Large devices, laptops */
  --breakpoint-xl: 1280px; /* Extra large, desktops */
  --breakpoint-2xl: 1536px;/* Ultra wide monitors */
}

/* 2. SCSS Responsive Mixins */
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' { @media (min-width: 640px) { @content; } }
  @else if $breakpoint == 'md' { @media (min-width: 768px) { @content; } }
  @else if $breakpoint == 'lg' { @media (min-width: 1024px) { @content; } }
  @else if $breakpoint == 'xl' { @media (min-width: 1280px) { @content; } }
}

/* 3. Tailwind CSS Config snippet */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
};`;
}

/**
 * 23. CSS Sticky Header Generator
 */
export function generateCssStickyHeader(
  height = 70,
  bgColor = '#ffffff',
  blur = true,
  borderBottom = true
): string {
  return `/* CSS Sticky Navigation Header Generator */
.sticky-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: ${height}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.85);
  ${blur ? 'backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);' : ''}
  ${borderBottom ? 'border-bottom: 1px solid rgba(226, 232, 240, 0.8);' : ''}
  transition: height 0.3s ease, box-shadow 0.3s ease;
}

/* Header Shrink on Scroll (Toggle via JS or Container Scroll) */
.sticky-header.is-scrolled {
  height: ${Math.round(height * 0.8)}px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
}`;
}

/**
 * 24. CSS Responsive Typography Generator
 */
export function generateCssResponsiveTypography(
  basePx = 16,
  ratioName = 'major_third',
  minWidth = 375,
  maxWidth = 1280
): string {
  const ratio = ratioName === 'golden' ? 1.618 : ratioName === 'perfect_fourth' ? 1.333 : 1.25;

  return `/* Fluid Modular Typography Scale */
:root {
  --font-ratio: ${ratio};
  
  /* Modular scale multipliers */
  --text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --text-xl: clamp(1.563rem, 1.35rem + 0.9vw, 2rem);
  --text-2xl: clamp(1.953rem, 1.6rem + 1.5vw, 2.75rem);
  --text-3xl: clamp(2.441rem, 1.9rem + 2.3vw, 3.8rem);
}

h1 { font-size: var(--text-3xl); line-height: 1.15; font-weight: 800; letter-spacing: -0.03em; }
h2 { font-size: var(--text-2xl); line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
h3 { font-size: var(--text-xl); line-height: 1.3; font-weight: 600; }
body { font-size: var(--text-base); line-height: 1.6; }
small { font-size: var(--text-xs); }`;
}

/**
 * 25. CSS Image Overlay Generator
 */
export function generateCssImageOverlay(
  effectType = 'slide-up',
  overlayColor = 'rgba(15, 23, 42, 0.85)',
  textColor = '#ffffff'
): string {
  return `/* CSS Image Overlay Hover Effect */
.image-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: ${overlayColor};
  color: ${textColor};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transform: translateY(${effectType === 'slide-up' ? '20px' : '0'});
  transition: all 0.35s ease-in-out;
}

.image-card:hover img {
  transform: scale(1.08);
}

.image-card:hover .image-overlay {
  opacity: 1;
  transform: translateY(0);
}`;
}

/**
 * 26. CSS Hover Effect Generator
 */
export function generateCssHoverEffect(
  effectName = 'lift',
  transitionMs = 250
): string {
  let hoverRule = '';
  switch (effectName) {
    case 'lift':
      hoverRule = `transform: translateY(-6px); box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.2);`;
      break;
    case 'glow':
      hoverRule = `box-shadow: 0 0 25px rgba(99, 102, 241, 0.6); border-color: #6366f1;`;
      break;
    case 'expand-underline':
      return `/* Expand Underline on Hover */
.hover-underline {
  position: relative;
  display: inline-block;
  color: inherit;
  text-decoration: none;
}

.hover-underline::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #6366f1;
  transform-origin: bottom right;
  transition: transform ${transitionMs}ms cubic-bezier(0.86, 0, 0.07, 1);
}

.hover-underline:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}`;
    default:
      hoverRule = `transform: scale(1.03);`;
  }

  return `/* CSS Interactive Hover Effect (${effectName}) */
.interactive-hover-target {
  transition: all ${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.interactive-hover-target:hover {
  ${hoverRule}
}`;
}

/**
 * 27. CSS Scrollbar Styler
 */
export function generateCssScrollbar(
  width = 8,
  thumbColor = '#6366f1',
  trackColor = '#f1f5f9',
  radius = 6
): string {
  return `/* Custom Cross-Browser CSS Scrollbars */

/* Standard Firefox & Modern Chrome */
* {
  scrollbar-width: thin;
  scrollbar-color: ${thumbColor} ${trackColor};
}

/* WebKit (Chrome, Safari, Edge, Opera) */
::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px;
}

::-webkit-scrollbar-track {
  background: ${trackColor};
  border-radius: ${radius}px;
}

::-webkit-scrollbar-thumb {
  background-color: ${thumbColor};
  border-radius: ${radius}px;
  border: 2px solid ${trackColor};
}

::-webkit-scrollbar-thumb:hover {
  background-color: #4f46e5;
}`;
}

/**
 * 28. CSS Text Truncation Generator
 */
export function generateCssTextTruncation(
  mode = 'multiline',
  maxLines = 3
): string {
  if (mode === 'single') {
    return `/* CSS Single-Line Ellipsis Truncation */
.truncate-single {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  display: block;
}`;
  }

  return `/* CSS Multi-Line Text Clamp Truncation */
.truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: ${maxLines};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}`;
}

/**
 * 29. CSS Multi-Column Layout Generator
 */
export function generateCssMultiColumnLayout(
  columnCount = 3,
  columnGap = '2rem',
  columnRuleColor = 'rgba(203, 213, 225, 0.6)'
): string {
  return `/* CSS Multi-Column Newspaper / Editorial Layout */
.editorial-columns {
  column-count: ${columnCount};
  column-gap: ${columnGap};
  column-rule: 1px solid ${columnRuleColor};
  text-align: justify;
}

.editorial-columns p {
  break-inside: avoid;
  margin-bottom: 1.25rem;
}

.editorial-headline-span {
  column-span: all;
  margin-bottom: 2rem;
  text-align: center;
}`;
}

/**
 * 30. CSS Container Query Generator
 */
export function generateCssContainerQuery(
  containerName = 'card-wrapper',
  containerType = 'inline-size',
  queryWidth = '420px'
): string {
  return `/* Modern CSS Container Queries (Size Based on Parent, Not Viewport) */

/* 1. Define Container Context */
.${containerName} {
  container-type: ${containerType};
  container-name: ${containerName};
}

/* 2. Style Default Component */
.card-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 3. Query the Parent Container Dimension */
@container ${containerName} (min-width: ${queryWidth}) {
  .card-component {
    flex-direction: row;
    align-items: center;
  }

  .card-thumbnail {
    width: 40%;
  }

  .card-content {
    width: 60%;
  }
}`;
}
