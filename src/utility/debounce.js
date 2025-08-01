export const debounce = (func, delay) => {
  let cooldown = false;

  return (...args) => {
    if (cooldown) return;

    func(...args);
    cooldown = true;

    setTimeout(() => {
      cooldown = false;
    }, delay);
  };
};
