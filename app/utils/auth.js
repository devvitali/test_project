export function isProfileComplete(user) {
  return Boolean(user
    && user.photoURL
    && user.firstName
    && user.firstName.length > 0
    && user.icon);
}

export function isUserValid(user) {
  return Boolean(user && user.onboardingComplete);
}
