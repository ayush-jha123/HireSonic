// utils/classNames.js
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}