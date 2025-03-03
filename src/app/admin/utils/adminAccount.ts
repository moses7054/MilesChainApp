import { Connection, PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "3ekfBBpPEzHCe3Z9DPE9wp7Hgx82LoCGMWS83ez6Ctnj"
);

// Admin account discriminator from the IDL
const ADMIN_DISCRIMINATOR = Buffer.from([244, 158, 220, 65, 8, 73, 4, 65]);

/**
 * Checks if the admin account exists on the Solana network
 * @param connection A Solana connection instance
 * @returns An object with adminExists flag and admin account data if it exists
 */
export const checkAdminAccount = async (connection: Connection) => {
  try {
    // Derive the admin PDA
    const [adminPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("admin")],
      PROGRAM_ID
    );

    console.log("Admin PDA:", adminPDA.toString());

    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(adminPDA);

    if (!accountInfo) {
      console.log("Admin account does not exist on the network");
      return {
        adminExists: false,
        adminPDA,
      };
    }

    console.log("Admin account exists!");
    console.log("Account data size:", accountInfo.data.length);

    return {
      adminExists: true,
      adminPDA,
      accountInfo,
    };
  } catch (error) {
    console.error("Error checking admin account:", error);
    throw error;
  }
};

/**
 * Fetches admin account data if it exists
 * @param connection A Solana connection instance
 * @returns The admin account data if it exists, null otherwise
 */
export const fetchAdminData = async (connection: Connection) => {
  const { adminExists, adminPDA, accountInfo } = await checkAdminAccount(
    connection
  );

  if (!adminExists || !accountInfo) {
    return null;
  }

  try {
    // Verify the account discriminator
    const discriminator = accountInfo.data.slice(0, 8);
    if (!Buffer.from(discriminator).equals(Buffer.from(ADMIN_DISCRIMINATOR))) {
      console.error("Account is not an Admin account");
      return null;
    }

    // Skip the 8-byte discriminator
    const dataWithoutDiscriminator = accountInfo.data.slice(8);

    // Parse fields according to Admin account structure from IDL
    // Admin = {
    //   adminSignerPubkey: PublicKey,  // 32 bytes
    //   maxProjects: u32,              // 4 bytes
    //   feeBasisPoints: u16,           // 2 bytes
    //   adminBump: u8,                 // 1 byte
    //   adminAta: PublicKey            // 32 bytes
    // }

    const adminSignerPubkey = new PublicKey(
      dataWithoutDiscriminator.slice(0, 32)
    );

    // Use DataView to read numeric values with correct endianness
    const dataView = new DataView(
      dataWithoutDiscriminator.buffer,
      dataWithoutDiscriminator.byteOffset,
      dataWithoutDiscriminator.byteLength
    );

    const maxProjects = dataView.getUint32(32, true);
    const feeBasisPoints = dataView.getUint16(36, true);
    const adminBump = dataView.getUint8(38);
    const adminAta = new PublicKey(dataWithoutDiscriminator.slice(39, 71));

    return {
      adminPDA,
      adminSignerPubkey,
      maxProjects,
      feeBasisPoints,
      adminBump,
      adminAta,
    };
  } catch (error) {
    console.error("Error parsing admin account data:", error);
    return null;
  }
};

/**
 * Function to test if admin account exists on devnet
 */
export const checkAdminExistsOnDevnet = async () => {
  // Connect to Solana devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  try {
    const result = await checkAdminAccount(connection);

    if (result.adminExists) {
      console.log("Admin account exists on devnet!");
      const adminData = await fetchAdminData(connection);
      console.log("Admin data:", adminData);
      return {
        exists: true,
        data: adminData,
      };
    } else {
      console.log("Admin account does not exist on devnet.");
      return {
        exists: false,
      };
    }
  } catch (error) {
    console.error("Error checking admin on devnet:", error);
    return {
      exists: false,
      error,
    };
  }
};
