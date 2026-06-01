import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/services/axios";
import { realEstateService } from "@/services/realEstateService";
import { fallbackProperties } from "@/utils/constants";
import type { Property, PropertyPayload, RealEstatePortfolio, RentRecord, Valuation } from "@/types/realestate";

interface RealEstateContextValue {
  properties: Property[];
  portfolio: RealEstatePortfolio | null;
  rents: RentRecord[];
  valuations: Valuation[];
  loading: boolean;
  error: string | null;
  loadProperties: (ownerId: number) => Promise<void>;
  loadPortfolio: (investorId: number) => Promise<void>;
  createProperty: (payload: PropertyPayload) => Promise<void>;
  loadPropertyActivity: (propertyId: number) => Promise<void>;
}

export const RealEstateContext = createContext<RealEstateContextValue | undefined>(undefined);

export function RealEstateProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [portfolio, setPortfolio] = useState<RealEstatePortfolio | null>(null);
  const [rents, setRents] = useState<RentRecord[]>([]);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async (task: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await task();
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProperties = useCallback(
    (ownerId: number) =>
      withLoading(async () => {
        try {
          const nextProperties = await realEstateService.getProperties(ownerId);
          setProperties(nextProperties.length ? nextProperties : fallbackProperties);
        } catch {
          setProperties(fallbackProperties);
        }
      }),
    [withLoading],
  );

  const loadPortfolio = useCallback(
    (investorId: number) =>
      withLoading(async () => {
        setPortfolio(await realEstateService.getPortfolio(investorId));
      }),
    [withLoading],
  );

  async function createProperty(payload: PropertyPayload) {
    await realEstateService.createProperty(payload);
    toast.success("Property saved");
    await loadProperties(payload.ownerId);
  }

  const loadPropertyActivity = useCallback(
    (propertyId: number) =>
      withLoading(async () => {
        const [nextRents, nextValuations] = await Promise.all([
          realEstateService.getRents(propertyId).catch(() => []),
          realEstateService.getValuations(propertyId).catch(() => []),
        ]);
        setRents(nextRents);
        setValuations(nextValuations);
      }),
    [withLoading],
  );

  const value = useMemo(
    () => ({
      properties,
      portfolio,
      rents,
      valuations,
      loading,
      error,
      loadProperties,
      loadPortfolio,
      createProperty,
      loadPropertyActivity,
    }),
    [properties, portfolio, rents, valuations, loading, error, loadProperties, loadPortfolio, loadPropertyActivity],
  );

  return <RealEstateContext.Provider value={value}>{children}</RealEstateContext.Provider>;
}
