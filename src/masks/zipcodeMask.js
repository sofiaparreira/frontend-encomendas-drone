export const zipcodeMask = (value) => {
  if (!value) return '';
  let cep = value.replace(/\D/g, '');
  if (cep.length > 5) {
    cep = cep.slice(0, 5) + '-' + cep.slice(5, 8);
  }
  return cep.slice(0, 9);
};
