// Get user's current grade
export const getUserGrade = (): string => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.grade || '5'; // Default to grade 5 if not set
  }
  return '5'; // Default grade
};

// Update user's grade
export const updateUserGrade = (grade: string): void => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    userData.grade = grade;
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

// Get user's name
export const getUserName = (): string => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.name || 'Student';
  }
  return 'Student';
};

// Get user's email
export const getUserEmail = (): string => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.email || '';
  }
  return '';
};

// Update user profile
export const updateUserProfile = (profile: {
  name?: string;
  email?: string;
  grade?: string;
}): void => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    Object.assign(userData, profile);
    localStorage.setItem('user', JSON.stringify(userData));
  }
};
