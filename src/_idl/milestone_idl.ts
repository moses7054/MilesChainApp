export const IDL = {
  address: "3ekfBBpPEzHCe3Z9DPE9wp7Hgx82LoCGMWS83ez6Ctnj",
  metadata: {
    name: "milestone",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    // ...instructions would be here, removed for brevity
  ],
  accounts: [
    {
      name: "admin",
      discriminator: [244, 158, 220, 65, 8, 73, 4, 65],
    },
    // ...other accounts would be here
  ],
  types: [
    {
      name: "admin",
      type: {
        kind: "struct",
        fields: [
          {
            name: "adminSignerPubkey",
            type: "pubkey",
          },
          {
            name: "maxProjects",
            type: "u32",
          },
          {
            name: "feeBasisPoints",
            type: "u16",
          },
          {
            name: "adminBump",
            type: "u8",
          },
          {
            name: "adminAta",
            type: "pubkey",
          },
        ],
      },
    },
    // ...other types would be here
  ],
};
