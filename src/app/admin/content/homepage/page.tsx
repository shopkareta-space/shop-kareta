import { getLatestRevision, getCmsReferenceData } from "@/lib/services/admin-cms.service";
import CMSClient from "./CMSClient";

export default async function AdminHomepageCMSPage() {
  const [latestRevision, referenceData] = await Promise.all([
    getLatestRevision(),
    getCmsReferenceData()
  ]);

  return (
    <div className="min-h-[calc(100vh-100px)]">
      <CMSClient initialRevision={latestRevision} referenceData={referenceData} />
    </div>
  );
}
