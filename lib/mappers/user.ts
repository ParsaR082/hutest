import type { UserProfile } from "@/lib/api/types";
import type { MockUser } from "@/lib/dashboard-data";

export function mapUserProfileToDashboardUser(user: UserProfile): MockUser {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  return {
    id: String(user.id),
    name: fullName,
    email: user.email,
    avatar: user.avatar ?? "/images/about/avatar1.jpg",
    memberSince: user.member_since,
    tier: user.tier_label,
  };
}
