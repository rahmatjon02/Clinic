// utils/auth.js (или куда тебе удобно)
export function parseStored(raw) {
  if (!raw) return null;
  // если это уже число/строка без JSON
  if (typeof raw === "string") {
    // Попробуем распарсить JSON, если это JSON-строка
    const trimmed = raw.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        // не JSON — оставим как строку
        return trimmed;
      }
    }
    // просто строка (возможно это id)
    return trimmed;
  }
  // если уже объект/массив
  return raw;
}

export function getStoredUserObject() {
  // ключи которые мы умеем читать (расширяем при необходимости)
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

  // сначала проверяем sessionStorage (временная сессия)
  try {
    for (const key of keys) {
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const parsed = parseStored(raw);
      // если массив: берем первый элемент
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      if (typeof parsed === "object" && parsed !== null) return parsed;
      // если это просто id - вернём null (пользователь не сохранён целиком)
    }
  } catch (e) {
    // ignore
  }

  // затем localStorage (долгоживущая сессия)
  try {
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = parseStored(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch (e) {
    // ignore
  }

  // Если нигде не хранится объект пользователя — вернём null
  return null;
}

export function getCurrentUserId() {
  const user = getStoredUserObject();
  if (!user) return null;

  // Попробуем найти id в разных полях
  if (user.id) return user.id;
  if (user._id) return user._id;
  if (user.userId) return user.userId;
  if (user.idUser) return user.idUser;

  // Если объект сам — возможно пользователь был сохранён как простая строк (email)
  // тогда не можем вернуть id.
  return null;
}
