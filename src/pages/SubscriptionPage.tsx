import SEOHead from "@/components/SEOHead";
import AppLayout from "@/components/AppLayout";
import SubscriptionScreen from "@/components/SubscriptionScreen";

const SubscriptionPage = () => {
  return (
    <AppLayout activeTab="subscription">
      <SEOHead
        title="Subscription Plans"
        description="Choose the best ScoreLive plan for your football experience."
        path="/subscription"
      />
      <SubscriptionScreen />
    </AppLayout>
  );
};

export default SubscriptionPage;
