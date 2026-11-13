
import { BlackNovemberLanding } from "@/modules/web-express/components/BlackNovemberLanding";
import { useCampaignClock } from "@/modules/web-express/lib/campaign-server";
import { SITE_URL } from "@/modules/web-express/lib/site";

export default function CampaignPage() {
  const state = useCampaignClock();
  return <BlackNovemberLanding state={state} />;
}
