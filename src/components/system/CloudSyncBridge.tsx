import { useCloudSync } from "@/lib/cloud-sync";

// Mount once inside AuthProvider to keep the local store synced with Cloud.
export function CloudSyncBridge() {
  useCloudSync();
  return null;
}
