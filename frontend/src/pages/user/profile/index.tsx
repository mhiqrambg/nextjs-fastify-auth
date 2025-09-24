import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout/DashboardLayout";
import ProfileView from "@/components/views/user/profile/index";

export default function profile() {
  return (
    <DashboardLayout>
      <ProfileView />
    </DashboardLayout>
  );
}
