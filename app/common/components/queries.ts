import supabase from "~/supa-client";

export const getAccounts = async () => {
  const { data, error } = await supabase
    .from("accounts")
    .select("account_id, name");
  if (error) throw new Error(error.message);
  return data;
};

export const getProfile = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`name, email`)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
