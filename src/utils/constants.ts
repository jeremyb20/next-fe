export const getUserRoleFromState = (userState: number): string => {
  const roleMap: { [key: number]: string } = {
    0: 'admin',
    1: 'veterinarian',
    2: 'groomer',
    3: 'client',
  };

  return roleMap[userState] || 'user'; // Valor por defecto 'user' si no encuentra el estado
};

export const getUserStatusFromState = (userState: number): string => {
  const roleMap: { [key: number]: string } = {
    0: 'active',
    1: 'pending',
    2: 'banned',
    3: 'rejected',
  };

  return roleMap[userState] || 'active'; // Valor por defecto 'user' si no encuentra el estado
};
