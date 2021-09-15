// @ts-nocheck
import { useEffect, useState } from "react";

import { useWallet } from "./Wallet";
import { RandomIdl } from "./randomIdl";
import { PublicKey, Connection } from "@solana/web3.js";
const anchor = require("@project-serum/anchor");

const MinimalSetup = () => {
  const { wallet, connected } = useWallet();
  const [program, setProgram] = useState({});

  const [keyFromAccount, setKeyFromAccount] = useState({});

  const InitAccount = async () => {
    const myAccount = anchor.web3.Keypair.generate();
    const { provider } = program;

    await program.rpc.initialize(new anchor.BN(1234), {
      accounts: {
        myAccount: myAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [myAccount],
      instructions: [
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: myAccount.publicKey,
          space: 8 + 8, // Add 8 for the account discriminator.
          lamports: await provider.connection.getMinimumBalanceForRentExemption(
            8 + 8,
          ),
          programId: program.programId,
        }),
      ],
    });

    setKeyFromAccount(myAccount.publicKey);
  };

  const UpdateAccount = async () => {
    const { provider } = program;

    const account = await program.account.myAccount.fetch(keyFromAccount);
    console.log(account, "before");

    await program.rpc.update(new anchor.BN(4321), {
      accounts: {
        myAccount: keyFromAccount,
      },
    });

    // Fetch the newly updated account.
    const account_after = await program.account.myAccount.fetch(keyFromAccount);

    console.log(account_after, "after");
  };

  const loadAnchor = async () => {
    const programId = new PublicKey(
      "7oyrzFtYfb8RYGBJ3YgosEXGFe3ezR9NpgeLCnCpcSRX",
    );
    const connection = new Connection("http://127.0.0.1:8899", {
      commitment: "processed",
    });

    const provider = new anchor.Provider(connection, wallet, {
      commitment: "processed",
    });

    const newProgram = new anchor.Program(RandomIdl, programId, provider);

    console.log(newProgram, "Is Anchor Working?");
    setProgram(newProgram);
  };

  useEffect(() => {
    if (wallet?.publicKey?.toString() && connected) {
      loadAnchor();
    }
  }, [wallet?.publicKey?.toString() || "", connected]);

  return (
    <div>
      <button
        onClick={() => {
          InitAccount();
        }}
      >
        InitARandomAccount
      </button>

      <button
        onClick={() => {
          UpdateAccount();
        }}
      >
        Update The Account
      </button>

      {/*  */}
    </div>
  );
};

export default MinimalSetup;
