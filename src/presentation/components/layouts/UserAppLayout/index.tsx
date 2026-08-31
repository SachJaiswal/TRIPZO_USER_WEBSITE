"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../../application/providers/AuthContext";
import { USER_NAV_ITEMS } from "../../../../shared/constants/navigation";
import { Logo } from "../../branding/Logo";
import { User as UserIcon, LogOut, ChevronDown, Compass } from "lucide-react";
import "./style.css";

export const UserAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <div className="user-layout-loading">
        <div className="user-layout-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="user-app-layout">
      {/* Top Navigation Bar */}
      <header className="user-navbar">
        <div className="user-navbar__container">
          <div className="user-navbar__brand">
            <Logo size="medium" />
          </div>

          {/* Navigation Links */}
          <nav className="user-navbar__links">
            {USER_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`user-nav-link ${isActive ? "user-nav-link--active" : ""}`}
                >
                  <Icon className="user-nav-link__icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Dropdown */}
          <div className="user-navbar__profile" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="user-profile-trigger"
            >
              <div className="user-avatar-circle">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt={user.name} className="user-avatar-img" />
                ) : (
                  <span className="user-avatar-initial">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <span className="user-profile-name">{user?.name || "Traveler"}</span>
              <ChevronDown className={`user-profile-chevron ${isDropdownOpen ? "user-profile-chevron--open" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-info">
                  <p className="user-dropdown-name">{user?.name}</p>
                  <p className="user-dropdown-email">{user?.email}</p>
                </div>

                <div className="user-dropdown-divider" />

                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="user-dropdown-item"
                >
                  <UserIcon className="user-dropdown-icon" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="user-dropdown-item user-dropdown-item--logout"
                >
                  <LogOut className="user-dropdown-icon user-dropdown-icon--logout" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="user-app-main">
        <div className="user-app-content">{children}</div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="user-mobile-bar">
        {USER_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`user-mobile-link ${isActive ? "user-mobile-link--active" : ""}`}
            >
              <Icon className="user-mobile-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
