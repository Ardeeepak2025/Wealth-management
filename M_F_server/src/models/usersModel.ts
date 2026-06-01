import supabase from "../db";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  last_active: string | null;
  created_at: string;
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    throw error;
  }

  return (data ?? []) as User[];
}

export async function getUserById(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as User | null) ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as User | null) ?? null;
}

export async function createUser(
  data: Omit<User, "id" | "created_at" | "last_active">,
): Promise<number> {
  const { data: insertedRows, error } = await supabase
    .from("users")
    .insert({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return insertedRows.id;
}

export async function updateUserLastActive(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("users")
      .update({ last_active: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "42703"
    ) {
      return;
    }

    throw error;
  }
}
