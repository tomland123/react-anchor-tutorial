export const RandomIdl = {
  version: "0.0.0",
  name: "basic_1",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "myAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: "u64",
        },
      ],
    },
    {
      name: "update",
      accounts: [
        {
          name: "myAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "MyAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "data",
            type: "u64",
          },
        ],
      },
    },
  ],
  metadata: {
    address: "CrYj35HAPKBxEKw5aV56FSfb4bBE1raDLPMWcnyba1MM",
  },
};
