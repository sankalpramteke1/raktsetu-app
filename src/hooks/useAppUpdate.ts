import { useEffect } from 'react';
import { checkForAppUpdate } from '../services/updateService';

export function useAppUpdate() {
  useEffect(() => {
    // Check for update on mount
    checkForAppUpdate();
  }, []);
}
