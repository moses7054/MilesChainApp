/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/milestone.json`.
 */
export type Milestone = {
  "address": "3ekfBBpPEzHCe3Z9DPE9wp7Hgx82LoCGMWS83ez6Ctnj",
  "metadata": {
    "name": "milestone",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closeTempAccount",
      "discriminator": [
        80,
        79,
        87,
        235,
        222,
        107,
        213,
        127
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "projectAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project_account.company_pubkey",
                "account": "projectAccount"
              },
              {
                "kind": "account",
                "path": "project_account.project_name",
                "account": "projectAccount"
              }
            ]
          }
        },
        {
          "name": "tempTransactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  95,
                  116,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              },
              {
                "kind": "account",
                "path": "temp_transaction_account.ngo_account_pubkey",
                "account": "tempTransactionAccount"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "createProject",
      "discriminator": [
        148,
        219,
        181,
        42,
        221,
        114,
        145,
        190
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        },
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "projectAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "company"
              },
              {
                "kind": "arg",
                "path": "projectName"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              }
            ]
          }
        },
        {
          "name": "vaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "signerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectName",
          "type": "string"
        },
        {
          "name": "requirementsHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "maxSubmissionsAllowed",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "editNgoReuirements",
      "discriminator": [
        212,
        44,
        120,
        135,
        197,
        178,
        185,
        156
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "ngo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  103,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "tempTransactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  95,
                  116,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "temp_transaction_account.project_account_pubkey",
                "account": "tempTransactionAccount"
              },
              {
                "kind": "account",
                "path": "ngo"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "close",
          "type": "bool"
        },
        {
          "name": "submittedRequirementsHash",
          "type": {
            "option": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "editProjectAccount",
      "discriminator": [
        56,
        104,
        85,
        216,
        108,
        163,
        245,
        187
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        },
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "projectAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project_account.company_pubkey",
                "account": "projectAccount"
              },
              {
                "kind": "arg",
                "path": "projectName"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "status",
          "type": {
            "option": {
              "defined": {
                "name": "projectStatus"
              }
            }
          }
        },
        {
          "name": "requirementsHash",
          "type": {
            "option": {
              "array": [
                "u8",
                32
              ]
            }
          }
        },
        {
          "name": "close",
          "type": "bool"
        },
        {
          "name": "projectName",
          "type": "string"
        }
      ]
    },
    {
      "name": "initAdmin",
      "discriminator": [
        97,
        65,
        97,
        27,
        200,
        206,
        72,
        219
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "adminAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "maxProjects",
          "type": "u32"
        },
        {
          "name": "feeBasisPoints",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initCompany",
      "discriminator": [
        4,
        20,
        200,
        152,
        94,
        207,
        211,
        98
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "businessRegNum",
          "type": "string"
        }
      ]
    },
    {
      "name": "initNgo",
      "discriminator": [
        117,
        237,
        199,
        110,
        135,
        173,
        100,
        249
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "ngo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  103,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "initiateProject",
      "discriminator": [
        141,
        45,
        252,
        49,
        10,
        159,
        154,
        22
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "ngo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  103,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "projectAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project_account.company_pubkey",
                "account": "projectAccount"
              },
              {
                "kind": "arg",
                "path": "projectName"
              }
            ]
          }
        },
        {
          "name": "tempTransactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  95,
                  116,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              },
              {
                "kind": "account",
                "path": "ngo"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectName",
          "type": "string"
        },
        {
          "name": "submittedRequirementsHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "processProjectFunding",
      "discriminator": [
        228,
        60,
        35,
        195,
        112,
        99,
        62,
        89
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        },
        {
          "name": "company",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "projectAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project_account.company_pubkey",
                "account": "projectAccount"
              },
              {
                "kind": "arg",
                "path": "projectName"
              }
            ]
          }
        },
        {
          "name": "ngo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  103,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "ngo.ngo_signer",
                "account": "ngoAccount"
              }
            ]
          }
        },
        {
          "name": "projectCompletionDetails",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116,
                  95,
                  99,
                  111,
                  109,
                  112,
                  108,
                  101,
                  116,
                  105,
                  111,
                  110,
                  95,
                  100,
                  101,
                  116,
                  97,
                  105,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              },
              {
                "kind": "account",
                "path": "ngo"
              }
            ]
          }
        },
        {
          "name": "tempTransactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  95,
                  116,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              },
              {
                "kind": "account",
                "path": "ngo"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "status",
          "type": {
            "defined": {
              "name": "status"
            }
          }
        },
        {
          "name": "merkelRoot",
          "type": {
            "option": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "processProjectPayment",
      "discriminator": [
        88,
        4,
        217,
        163,
        147,
        4,
        166,
        151
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "projectAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project_account.company_pubkey",
                "account": "projectAccount"
              },
              {
                "kind": "arg",
                "path": "projectName"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "vaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "ngo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  103,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "ngo.ngo_signer",
                "account": "ngoAccount"
              }
            ]
          }
        },
        {
          "name": "ngoAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "ngosignerPubkey"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "ngosignerPubkey"
        },
        {
          "name": "projectCompletionDetails",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116,
                  95,
                  99,
                  111,
                  109,
                  112,
                  108,
                  101,
                  116,
                  105,
                  111,
                  110,
                  95,
                  100,
                  101,
                  116,
                  97,
                  105,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              },
              {
                "kind": "account",
                "path": "ngo"
              }
            ]
          }
        },
        {
          "name": "tempTransactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  95,
                  116,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "projectAccount"
              },
              {
                "kind": "account",
                "path": "ngo"
              }
            ]
          }
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "adminAta",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "admin.admin_signer_pubkey",
                "account": "admin"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "admin",
      "discriminator": [
        244,
        158,
        220,
        65,
        8,
        73,
        4,
        65
      ]
    },
    {
      "name": "companyAccount",
      "discriminator": [
        37,
        215,
        171,
        200,
        8,
        141,
        69,
        96
      ]
    },
    {
      "name": "ngoAccount",
      "discriminator": [
        147,
        248,
        39,
        222,
        235,
        182,
        48,
        242
      ]
    },
    {
      "name": "projectAccount",
      "discriminator": [
        179,
        110,
        82,
        178,
        208,
        35,
        171,
        116
      ]
    },
    {
      "name": "projectCompletionDetails",
      "discriminator": [
        114,
        101,
        174,
        73,
        145,
        30,
        220,
        203
      ]
    },
    {
      "name": "tempTransactionAccount",
      "discriminator": [
        50,
        167,
        251,
        143,
        40,
        57,
        235,
        66
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "events": [
    {
      "name": "paymentEvent",
      "discriminator": [
        132,
        136,
        157,
        119,
        91,
        254,
        225,
        20
      ]
    },
    {
      "name": "processProjectEvent",
      "discriminator": [
        201,
        84,
        158,
        75,
        80,
        172,
        7,
        203
      ]
    },
    {
      "name": "projectApplyEvent",
      "discriminator": [
        38,
        193,
        132,
        96,
        72,
        52,
        199,
        17
      ]
    },
    {
      "name": "projectCreationEvent",
      "discriminator": [
        230,
        92,
        83,
        93,
        108,
        239,
        79,
        178
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "maxProjectsReached",
      "msg": "max project limit reached"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "amount not specified"
    },
    {
      "code": 6002,
      "name": "maxApplicationReached",
      "msg": "max ngo application reached"
    },
    {
      "code": 6003,
      "name": "projectClosed",
      "msg": "Cannot apply. Project closed"
    },
    {
      "code": 6004,
      "name": "projectNotAccepted",
      "msg": "This ngo's appliaction is not accepted"
    },
    {
      "code": 6005,
      "name": "projectStatusWrong",
      "msg": "wrong project status cannot disburse funds"
    },
    {
      "code": 6006,
      "name": "insufficientVaultBalance",
      "msg": "Insufficient balance in vault to cover fee and payment"
    },
    {
      "code": 6007,
      "name": "projectNotClosed",
      "msg": "Project not closed"
    },
    {
      "code": 6008,
      "name": "projectStatusNotAllowed",
      "msg": "This status cannot be used"
    },
    {
      "code": 6009,
      "name": "projectWrongStatus",
      "msg": "The status of project account should be NotOpenForApplication for changing the requirements"
    },
    {
      "code": 6010,
      "name": "ngoRequirementsNotAllowed",
      "msg": "Ngo application already accepted , cannot change reuirements now"
    }
  ],
  "types": [
    {
      "name": "admin",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminSignerPubkey",
            "type": "pubkey"
          },
          {
            "name": "maxProjects",
            "type": "u32"
          },
          {
            "name": "feeBasisPoints",
            "type": "u16"
          },
          {
            "name": "adminBump",
            "type": "u8"
          },
          {
            "name": "adminAta",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "companyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "businessRegNum",
            "type": "string"
          },
          {
            "name": "companyBump",
            "type": "u8"
          },
          {
            "name": "totalProjects",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "ngoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "ngoSigner",
            "type": "pubkey"
          },
          {
            "name": "completedProjects",
            "type": "u32"
          },
          {
            "name": "merkelRoot",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "ngoBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "paymentEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectAccountPubkey",
            "type": "pubkey"
          },
          {
            "name": "ngoAccountPubkey",
            "type": "pubkey"
          },
          {
            "name": "payment",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "processProjectEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectPubkey",
            "type": "pubkey"
          },
          {
            "name": "ngoPubkey",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "status"
              }
            }
          }
        ]
      }
    },
    {
      "name": "projectAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "companyPubkey",
            "type": "pubkey"
          },
          {
            "name": "projectName",
            "type": "string"
          },
          {
            "name": "requirementsHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "projectStatus"
              }
            }
          },
          {
            "name": "maxSubmissionsAllowed",
            "type": "u16"
          },
          {
            "name": "totalSubmissions",
            "type": "u16"
          },
          {
            "name": "projectBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "projectApplyEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectAccountPubkey",
            "type": "pubkey"
          },
          {
            "name": "ngoAccountPubkey",
            "type": "pubkey"
          },
          {
            "name": "submittedRequirementsHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "projectCompletionDetails",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectPubkey",
            "type": "pubkey"
          },
          {
            "name": "ngoPubkey",
            "type": "pubkey"
          },
          {
            "name": "merkelRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "completionBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "projectCreationEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "companyPubkey",
            "type": "pubkey"
          },
          {
            "name": "projectName",
            "type": "string"
          },
          {
            "name": "requirementsHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "projectStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "openForApplication"
          },
          {
            "name": "funded"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "closed"
          },
          {
            "name": "notOpenForApplication"
          }
        ]
      }
    },
    {
      "name": "status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "accepted"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "tempTransactionAccount",
      "docs": [
        "Temporary account for tracking project-related transactions."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectAccountPubkey",
            "type": "pubkey"
          },
          {
            "name": "ngoSignerPubkey",
            "type": "pubkey"
          },
          {
            "name": "ngoAccountPubkey",
            "type": "pubkey"
          },
          {
            "name": "submittedRequirementsHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "tempTransactionAccountStatus"
              }
            }
          },
          {
            "name": "tempBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tempTransactionAccountStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "processing"
          },
          {
            "name": "accepted"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectKey",
            "type": "pubkey"
          },
          {
            "name": "vaultAta",
            "type": "pubkey"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
