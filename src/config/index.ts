export const isElectron = () =>
  import.meta.env.VITE_BUILD_TARGET === 'electron';
