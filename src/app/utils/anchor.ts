import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet, Idl } from "@project-serum/anchor";
import idl from "../../_idl/milestone.json";

// Program ID from the IDL
export const PROGRAM_ID = new PublicKey(idl.address);

// Get the Anchor Provider
export const getProvider = (wallet: Wallet, connection: Connection) => {
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  return provider;
};

// Get the Milestone Program
export const getMilestoneProgram = (provider: AnchorProvider) => {
  // @ts-expect-error: IDL type incompatibility
  return new Program(idl, PROGRAM_ID, provider);
};

// Find PDA for admin account
export const findAdminPDA = async (program: Program<Idl>) => {
  const [adminPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("admin")],
    program.programId
  );
  return adminPDA;
};

// Initialize admin account
export const initializeAdmin = async (
  program: Program<Idl>,
  maxProjects: number,
  feeBasisPoints: number
) => {
  try {
    const adminPDA = await findAdminPDA(program);
    const usdcMint = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    ); // Devnet USDC mint

    const tx = await program.methods
      .initAdmin(maxProjects, feeBasisPoints)
      .accounts({
        signer: program.provider.publicKey,
        admin: adminPDA,
        usdcMint,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error("Error initializing admin:", error);
    throw error;
  }
};

// Initialize company account
export const initializeCompany = async (
  program: Program<Idl>,
  name: string,
  businessRegNum: string
) => {
  try {
    // Derive the company PDA
    const provider = program.provider as AnchorProvider;
    const userPublicKey = provider.publicKey;

    if (!userPublicKey) {
      throw new Error("Provider has no public key");
    }

    const [companyPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("company"), userPublicKey.toBuffer()],
      program.programId
    );

    // Call the program method to initialize the company
    const tx = await program.methods
      .initCompany(name, businessRegNum)
      .accounts({
        signer: userPublicKey,
        company: companyPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error("Error initializing company:", error);
    throw error;
  }
};

// Get Anchor Provider without wallet adapter (for read-only operations)
export const getAnchorProvider = (connection: Connection) => {
  // Create a read-only provider
  const provider = new AnchorProvider(
    connection,
    // Use a dummy wallet that can't sign
    {
      publicKey: PublicKey.default,
      signTransaction: async () => {
        throw new Error("Cannot sign");
      },
      signAllTransactions: async () => {
        throw new Error("Cannot sign");
      },
    },
    AnchorProvider.defaultOptions()
  );
  return provider;
};
