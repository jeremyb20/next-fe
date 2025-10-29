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

export const openLink = (linkRedirect: string) => {
  window.open(linkRedirect, '_blank');
};

export const parseWeight = (weightString: string | undefined) => {
  if (!weightString) return { value: '', unit: 'kg' };

  const match = weightString.match(/^([\d.]+)\s*(kg|lb)?$/i);
  if (match) {
    return {
      value: match[1],
      unit: (match[2]?.toLowerCase() as 'kg' | 'lb') || 'kg',
    };
  }
  return { value: '', unit: 'kg' };
};
