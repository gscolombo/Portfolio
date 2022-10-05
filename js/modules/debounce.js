export default function debounce(delay, f) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      f();
    }, delay);
  };
}
