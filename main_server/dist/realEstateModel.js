"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = createProperty;
exports.getPropertyById = getPropertyById;
exports.listPropertiesByOwner = listPropertiesByOwner;
exports.addValuation = addValuation;
exports.listValuations = listValuations;
exports.addRental = addRental;
exports.listRentals = listRentals;
exports.getLatestValuation = getLatestValuation;
exports.sumRentalIncome = sumRentalIncome;
const supabase_1 = require("./supabase");
async function createProperty(p) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_properties").insert(p).select().single();
    if (error)
        throw error;
    return data;
}
async function getPropertyById(id) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_properties").select("*").eq("id", id).maybeSingle();
    if (error)
        throw error;
    return data;
}
async function listPropertiesByOwner(ownerId) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_properties").select("*").eq("owner_id", ownerId);
    if (error)
        throw error;
    return data;
}
async function addValuation(v) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_valuations").insert(v).select().single();
    if (error)
        throw error;
    return data;
}
async function listValuations(propertyId) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_valuations").select("*").eq("property_id", propertyId).order("recorded_at", { ascending: false });
    if (error)
        throw error;
    return data;
}
async function addRental(r) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_rentals").insert(r).select().single();
    if (error)
        throw error;
    return data;
}
async function listRentals(propertyId) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_rentals").select("*").eq("property_id", propertyId).order("recorded_at", { ascending: false });
    if (error)
        throw error;
    return data;
}
async function getLatestValuation(propertyId) {
    const vals = await listValuations(propertyId);
    return vals && vals.length ? vals[0] : null;
}
async function sumRentalIncome(propertyId) {
    const supabase = (0, supabase_1.getSupabaseClient)();
    if (!supabase)
        throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("real_estate_rentals").select("amount").eq("property_id", propertyId);
    if (error)
        throw error;
    const sum = (data || []).reduce((s, r) => s + Number(r.amount || 0), 0);
    return sum;
}
