import SEOHead from "@/components/SEOHead";
import AppLayout from "@/components/AppLayout";
import ProfileScreen from "@/components/ProfileScreen";

const ProfilePage = () => {
  return (
    <AppLayout activeTab="profile">
      <SEOHead
        title="Your Profile"
        description="Manage your ScoreLive profile, notification preferences, and subscription settings."
        path="/profile"
      />
      <ProfileScreen />
    </AppLayout>
  );
};

export default ProfilePage;
