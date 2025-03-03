import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import idl from "../../_idl/milestone.json";

// Program ID from the IDL
const PROGRAM_ID = new PublicKey(idl.address);

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
  // @ts-ignore: IDL type incompatibility
  return new Program(idl, PROGRAM_ID, provider);
};

// Find PDA for admin account
export const findAdminPDA = async (program: Program<any>) => {
  const [adminPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("admin")],
    program.programId
  );
  return adminPDA;
};

// Initialize admin account
export const initializeAdmin = async (
  program: Program<any>,
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
