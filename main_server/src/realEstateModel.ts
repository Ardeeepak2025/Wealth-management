import { getSupabaseClient } from "./supabase";

export interface Property {
  id?: string;
  owner_id: string;
  title: string;
  address?: string;
  description?: string;
  metadata?: any;
}

export interface Valuation {
  id?: string;
  property_id: string;
  amount: number;
  currency?: string;
  recorded_at?: string;
  source?: string;
  notes?: string;
}

export interface RentalIncome {
  id?: string;
  property_id: string;
  amount: number;
  currency?: string;
  start_date?: string;
  end_date?: string | null;
  tenant?: string;
  recorded_at?: string;
}

export async function createProperty(p: Property) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_properties").insert(p).select().single();
  if (error) throw error;
  return data as Property;
}

export async function getPropertyById(id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Property | null;
}

export async function listPropertiesByOwner(ownerId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_properties").select("*").eq("owner_id", ownerId);
  if (error) throw error;
  return data as Property[];
}

export async function addValuation(v: Valuation) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_valuations").insert(v).select().single();
  if (error) throw error;
  return data as Valuation;
}

export async function listValuations(propertyId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_valuations").select("*").eq("property_id", propertyId).order("recorded_at", { ascending: false });
  if (error) throw error;
  return data as Valuation[];
}

export async function addRental(r: RentalIncome) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_rentals").insert(r).select().single();
  if (error) throw error;
  return data as RentalIncome;
}

export async function listRentals(propertyId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_rentals").select("*").eq("property_id", propertyId).order("recorded_at", { ascending: false });
  if (error) throw error;
  return data as RentalIncome[];
}

export async function getLatestValuation(propertyId: string) {
  const vals = await listValuations(propertyId);
  return vals && vals.length ? vals[0] : null;
}

export async function sumRentalIncome(propertyId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.from("real_estate_rentals").select("amount").eq("property_id", propertyId);
  if (error) throw error;
  const sum = (data || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
  return sum;
}
