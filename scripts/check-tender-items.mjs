#!/usr/bin/env node
/**
 * Check tender_items for a given tender_id.
 * Usage: node scripts/check-tender-items.mjs [tenderId]
 * Loads .env.local from project root (same as Next.js).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  try {
    const path = resolve(root, ".env.local");
    const content = readFileSync(path, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) {
        const key = m[1];
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1).replace(/\\n/g, "\n");
        process.env[key] = val;
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tenderId = process.argv[2] || "d6ab104e-d77a-40ee-a339-f5610736c66d";

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (set in .env.local)");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log("Tender ID:", tenderId);
  console.log("");

  const { data: rows, error: selectError } = await supabase
    .from("tender_items")
    .select("id, tender_id, sort_order, description, quantity, unit, notes, image_url, created_at")
    .eq("tender_id", tenderId)
    .order("sort_order");

  if (selectError) {
    console.error("Select error:", selectError.message);
    process.exit(1);
  }

  console.log("tender_items row count for this tender:", rows?.length ?? 0);
  if (rows?.length) {
    console.log("");
    console.log("Rows:");
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.log("");
    console.log("No rows found for this tender.");
  }

  const { count, error: countErr } = await supabase
    .from("tender_items")
    .select("*", { count: "exact", head: true });
  if (!countErr) console.log("Total tender_items rows in table (all tenders):", count ?? 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
