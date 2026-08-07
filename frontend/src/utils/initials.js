/**
 * Iniciales del usuario para el Avatar: primera letra del nombre y del
 * apellido. Devuelve cadena vacía si el perfil aún no ha cargado, para que
 * MUI muestre su icono de persona por defecto en lugar de una letra suelta.
 */
export const getInitials = (profile = {}) => {
  const name = (profile.name || '').trim();
  const surname = (profile.surname || '').trim();
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
};
