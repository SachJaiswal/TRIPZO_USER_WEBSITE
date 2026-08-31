"use client";

import React from "react";
import { UserAppLayout } from "../../components/layouts/UserAppLayout";
import { useAuth } from "../../../application/providers/AuthContext";
import { User, Mail, Shield, Smartphone, Globe, Calendar } from "lucide-react";
import "./style.css";

export const ProfileFeature: React.FC = () => {
  const { user } = useAuth();

  return (
    <UserAppLayout>
      <div className="user-profile-feature">
        <header className="user-page-header">
          <div>
            <h1 className="user-page-title">My Profile</h1>
            <p className="user-page-subtitle">View and manage your account details and travel preferences.</p>
          </div>
        </header>

        <div className="user-profile-card">
          <div className="user-profile-header">
            <div className="user-profile-avatar-big">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user.name} />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>
            <div className="user-profile-main-info">
              <h2 className="user-profile-name">{user?.name || "Traveler"}</h2>
              <span className="user-profile-role-tag">{user?.role || "USER"} ACCOUNT</span>
            </div>
          </div>

          <div className="user-profile-details-grid">
            <div className="user-detail-box">
              <Mail className="user-detail-icon" />
              <div>
                <span className="user-detail-label">Email Address</span>
                <span className="user-detail-value">{user?.email}</span>
              </div>
            </div>

            <div className="user-detail-box">
              <Smartphone className="user-detail-icon" />
              <div>
                <span className="user-detail-label">Phone Number</span>
                <span className="user-detail-value">{user?.phone_number || "Not specified"}</span>
              </div>
            </div>

            <div className="user-detail-box">
              <Globe className="user-detail-icon" />
              <div>
                <span className="user-detail-label">Authentication Method</span>
                <span className="user-detail-value">{user?.auth_provider || "LOCAL"}</span>
              </div>
            </div>

            <div className="user-detail-box">
              <Calendar className="user-detail-icon" />
              <div>
                <span className="user-detail-label">Member Since</span>
                <span className="user-detail-value">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "2026"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserAppLayout>
  );
};
