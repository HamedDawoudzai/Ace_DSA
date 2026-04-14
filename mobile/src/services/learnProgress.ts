import * as storage from "./storage";

const KEY = "learn_visited_ids";

export async function getVisitedIds(): Promise<Set<string>> {
  const raw = await storage.getItem(KEY);
  if (!raw) return new Set();
  try {
    const arr: string[] = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function markVisited(id: string): Promise<Set<string>> {
  const visited = await getVisitedIds();
  if (!visited.has(id)) {
    visited.add(id);
    await storage.setItem(KEY, JSON.stringify(Array.from(visited)));
  }
  return visited;
}
