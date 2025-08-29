// utils/auth.js
export function parseStored(raw) {
  if (!raw) return null;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  }
  return raw;
}

export function getStoredUserObject() {
  const keys = [
    "current_user",
    "currentUser",
    "current-user",
    "user",
    "authUser",
    "me",
    "userData",
    "session_user",
  ];

  try {
    for (const key of keys) {
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const parsed = parseStored(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch (e) {}

  try {
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = parseStored(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch (e) {}

  return null;
}

export function getCurrentUserId() {
  const user = getStoredUserObject();
  if (!user) return null;

  if (user.id) return user.id;
  if (user._id) return user._id;
  if (user.userId) return user.userId;
  if (user.idUser) return user.idUser;

  return null;
}
