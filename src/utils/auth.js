// Save both tokens
export function saveTokens(access, refresh, email, remember = true) {
  if (remember) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("email", email);
  } else {
    sessionStorage.setItem("access", access);
    sessionStorage.setItem("refresh", refresh);
    sessionStorage.setItem("email", email);
  }
}

export function getAccessToken() {
  return localStorage.getItem("access") || sessionStorage.getItem("access");
}

export function saveAccessToken(token) {
  if (localStorage.getItem("access"))
    localStorage.setItem("access", token);
  else sessionStorage.setItem("access", token);
}

export function getRefreshToken() {
  return localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
}

export function getUserEmail() {
  return localStorage.getItem("email") || sessionStorage.getItem("email");
}

export function clearAllTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("email");

  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
  sessionStorage.removeItem("email");
}

export function isAuthenticated() {
  return !!getAccessToken();
}
