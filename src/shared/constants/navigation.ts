import { Home, Compass, User } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: any;
}

export const USER_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/home",
    icon: Home,
  },
  {
    id: "bookings",
    label: "My Trips",
    href: "/bookings",
    icon: Compass,
  },
  {
    id: "profile",
    label: "My Profile",
    href: "/profile",
    icon: User,
  },
];
