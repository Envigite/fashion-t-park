export function handleExpiredToken(res: Response) {
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = "/";
    return true;
  }
  return false;
}

export function guardAdminPage(): void {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.href = "/";
  }
}