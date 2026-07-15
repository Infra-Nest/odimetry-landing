import { useEffect, useState } from 'react';
import { getMyOrganizations } from '../services/organizationService';
import type { UserOrganization } from '../types/organization';

export const useUserOrganizations = (token: string | null) => {
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setOrganizations([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    getMyOrganizations(token)
      .then((result) => {
        if (isActive) setOrganizations(result);
      })
      .catch((err) => {
        if (isActive) {
          setOrganizations([]);
          setError(err instanceof Error ? err.message : 'Failed to load organizations.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  return { organizations, isLoading, error };
};
