const STAFF_ROLES = new Set(["staff", "manager", "admin", "super_admin"]);

export function isStaffRole(role?: string | null) {
  return role != null && STAFF_ROLES.has(role);
}

export function isManagerRole(role?: string | null) {
  return role === "manager" || role === "admin" || role === "super_admin";
}

export function isAdminRole(role?: string | null) {
  return role === "admin" || role === "super_admin";
}
