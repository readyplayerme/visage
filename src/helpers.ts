export const isValidGlbUrl = (url: string) => {
  const expression = new RegExp(/(.glb|.glb[?].*)$/g);
  return expression.test(url);
};
