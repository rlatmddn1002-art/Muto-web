import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && key);

let browserClient: SupabaseClient | null = null;

/** 서버 컴포넌트용: 요청마다 새 클라이언트 (공개 데이터만 읽음) */
export function serverClient(): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** 관리 페이지용: 로그인 세션을 브라우저에 유지 */
export function browserSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!browserClient) browserClient = createClient(url, key);
  return browserClient;
}
