import { useState, useEffect, useDebugValue } from 'react';
import UpdateTracker from '../UpdateTracker';

/**
 * Hook that subscribes to updates on the given resources,
 * returning the latest update as `{ timestamp, url }`.
 */
export default function useLatestUpdate(document) {
  const url = document && document.asRef()
  const [latestUpdate, setLatestUpdate] = useState({});
  useDebugValue(latestUpdate.timestamp || null);
  useEffect(() => {
    if (url){
      const tracker = new UpdateTracker(setLatestUpdate);
      tracker.subscribe(url);
      return () => tracker.unsubscribe(url);
    }
  }, [url]);
  return latestUpdate;
}
