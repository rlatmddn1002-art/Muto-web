import { connection } from "next/server";
import { serverClient } from "./supabase";
import { seedActivities, seedMilestones } from "./seed";
import type { Activity, Milestone } from "./types";

/** 홈페이지에 보여줄 공개 활동 */
export async function getPublicActivities(): Promise<Activity[]> {
  await connection();
  const db = serverClient();
  if (!db) return seedActivities.filter((x) => x.is_public && !x.archived);
  const { data, error } = await db
    .from("activities")
    .select("*")
    .eq("is_public", true)
    .eq("archived", false)
    .order("sort", { ascending: true });
  if (error) {
    console.error("activities", error.message);
    return [];
  }
  return data as Activity[];
}

export async function getPublicMilestones(): Promise<Milestone[]> {
  await connection();
  const db = serverClient();
  if (!db) return seedMilestones.filter((x) => x.is_public);
  const { data, error } = await db
    .from("milestones")
    .select("*")
    .eq("is_public", true)
    .order("sort", { ascending: true });
  if (error) {
    console.error("milestones", error.message);
    return [];
  }
  return data as Milestone[];
}
