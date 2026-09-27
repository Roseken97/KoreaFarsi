const KEY = "kf:onboarded";

// localStorage can throw (private mode, blocked storage); onboarding simply shows again.
export function hasOnboarded() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
}
