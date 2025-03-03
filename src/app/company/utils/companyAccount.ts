import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "3ekfBBpPEzHCe3Z9DPE9wp7Hgx82LoCGMWS83ez6Ctnj"
);

/**
 * Interface for company account data
 */
export interface CompanyData {
  signer: PublicKey;
  name: string;
  businessRegNum: string;
  companyBump: number;
  totalProjects: number;
}

/**
 * Checks if a company account exists for the provided wallet
 * @param connection Solana connection
 * @param walletAddress The wallet address to check
 * @returns Object containing existence check and company PDA
 */
export const checkCompanyAccount = async (
  connection: Connection,
  walletAddress: PublicKey
) => {
  try {
    if (!walletAddress) {
      console.error("No wallet address provided to checkCompanyAccount");
      throw new Error("No wallet address provided");
    }

    // Derive the company PDA
    const [companyPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("company"), walletAddress.toBuffer()],
      PROGRAM_ID
    );

    console.log("Company PDA:", companyPDA.toString());

    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(companyPDA);

    if (!accountInfo) {
      console.log("Company account does not exist for this wallet");
      return {
        companyExists: false,
        companyPDA,
      };
    }

    console.log("Company account exists!");
    console.log("Account data size:", accountInfo.data.length);

    return {
      companyExists: true,
      companyPDA,
      accountInfo,
    };
  } catch (error) {
    console.error("Error in checkCompanyAccount:", error);
    throw error;
  }
};

/**
 * Fetches company account data if it exists
 * @param connection Solana connection
 * @param walletAddress The wallet address to check
 * @returns The company account data if it exists, null otherwise
 */
export const fetchCompanyData = async (
  connection: Connection,
  walletAddress: PublicKey
) => {
  try {
    const { companyExists, companyPDA, accountInfo } =
      await checkCompanyAccount(connection, walletAddress);

    if (!companyExists || !accountInfo) {
      return null;
    }

    try {
      // Skip the 8-byte discriminator
      const dataWithoutDiscriminator = accountInfo.data.slice(8);

      // Parse fields according to CompanyAccount structure from IDL
      // We're just extracting the PublicKey for now to avoid complex parsing

      // Extract signer public key (first 32 bytes after discriminator)
      const signer = new PublicKey(dataWithoutDiscriminator.slice(0, 32));

      return {
        companyPDA,
        signer,
      };
    } catch (parseError) {
      console.error("Error parsing company account data:", parseError);
      // Still return the basic data even if parsing fails
      return {
        companyPDA,
        parseError: true,
      };
    }
  } catch (error) {
    console.error("Error in fetchCompanyData:", error);
    throw error;
  }
};

/**
 * Function to test if company account exists on devnet
 */
export const checkCompanyExistsOnDevnet = async (walletAddress: PublicKey) => {
  // Connect to Solana devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  try {
    const result = await checkCompanyAccount(connection, walletAddress);

    if (result.companyExists) {
      console.log("Company account exists on devnet!");
      const companyData = await fetchCompanyData(connection, walletAddress);
      console.log("Company data:", companyData);
      return {
        exists: true,
        data: companyData,
      };
    } else {
      console.log("Company account does not exist on devnet.");
      return {
        exists: false,
      };
    }
  } catch (error) {
    console.error("Error checking company on devnet:", error);
    return {
      exists: false,
      error,
    };
  }
};

/**
 * Initialize a company account directly using transactions without Anchor's IDL
 * @param connection Solana connection
 * @param walletAddress The wallet address to be used as the company signer
 * @param name Company name
 * @param businessRegNum Business registration number
 * @returns Transaction signature
 */
export const initializeCompanyDirect = async (
  connection: Connection,
  walletAddress: PublicKey,
  name: string,
  businessRegNum: string,
  signTransaction: (tx: Transaction) => Promise<Transaction>
) => {
  try {
    console.log(
      "Initializing company directly for wallet:",
      walletAddress.toString()
    );
    console.log("Company name:", name);
    console.log("Business reg number:", businessRegNum);

    // Derive the Company PDA
    const [companyPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("company"), walletAddress.toBuffer()],
      PROGRAM_ID
    );

    console.log("Company PDA:", companyPDA.toString());

    // Create the instruction data buffer
    // Format matches the IDL's initCompany instruction with arguments: name and businessRegNum

    // First 8 bytes are the instruction discriminator for init_company (from IDL)
    const initCompanyDiscriminator = Buffer.from([
      4, 20, 200, 152, 94, 207, 211, 98,
    ]);

    // Encode name as a string (length prefix followed by UTF-8 bytes)
    const nameBuffer = Buffer.from(name, "utf8");
    const nameLength = Buffer.alloc(4);
    nameLength.writeUInt32LE(nameBuffer.length, 0);

    // Encode business registration number
    const businessRegNumBuffer = Buffer.from(businessRegNum, "utf8");
    const businessRegNumLength = Buffer.alloc(4);
    businessRegNumLength.writeUInt32LE(businessRegNumBuffer.length, 0);

    // Combine all parts into the instruction data
    const instructionData = Buffer.concat([
      initCompanyDiscriminator,
      nameLength,
      nameBuffer,
      businessRegNumLength,
      businessRegNumBuffer,
    ]);

    // Create the transaction instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: walletAddress, isSigner: true, isWritable: true }, // signer
        { pubkey: companyPDA, isSigner: false, isWritable: true }, // company PDA
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system program
      ],
      programId: PROGRAM_ID,
      data: instructionData,
    });

    // Create and sign the transaction
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = walletAddress;

    // Get recent blockhash for the transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Sign the transaction
    const signedTransaction = await signTransaction(transaction);

    // Send the transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);

    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${confirmation.value.err.toString()}`
      );
    }

    console.log("Company initialization transaction confirmed:", signature);
    return signature;
  } catch (error) {
    console.error("Error initializing company directly:", error);
    throw error;
  }
};
