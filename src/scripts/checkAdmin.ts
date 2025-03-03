#!/usr/bin/env ts-node
import { checkAdminExistsOnDevnet } from "../app/admin/utils/adminAccount";

/**
 * Simple script to check if the admin account exists on devnet
 *
 * Usage:
 * npx ts-node src/scripts/checkAdmin.ts
 */
async function main() {
  console.log("Checking if admin account exists on Solana devnet...");

  try {
    const result = await checkAdminExistsOnDevnet();

    if (result.exists) {
      console.log("✅ Admin account exists!");
      console.log("Admin account data:");
      console.log(
        JSON.stringify(
          result.data,
          (key, value) => {
            // Convert PublicKey objects to strings for readability
            if (value && typeof value === "object" && value.toBase58) {
              return value.toBase58();
            }
            return value;
          },
          2
        )
      );
    } else {
      console.log("❌ Admin account does not exist on devnet");
      if (result.error) {
        console.error("Error details:", result.error);
      }
    }
  } catch (error) {
    console.error("Failed to check admin account:", error);
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
