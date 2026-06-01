"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseClient = getSupabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
let supabaseClient = null;
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return null;
    }
    if (!supabaseClient) {
        supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return supabaseClient;
}
