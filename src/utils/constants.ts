export const getUserRoleFromState = (userState: number): string => {
  const roleMap: { [key: number]: string } = {
    0: 'admin',
    1: 'veterinarian',
    2: 'groomer',
    3: 'user',
  };

  return roleMap[userState] || 'user'; // Valor por defecto 'user' si no encuentra el estado
};
