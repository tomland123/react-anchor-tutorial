import { useWallet } from "./Wallet";

const WalletConnector = () => {
  const { wallet, getName } = useWallet();

  const handleConnectDisconnect = () => {
    wallet.connect();
  };

  return (
    <button
      onClick={handleConnectDisconnect}
      style={{
        height: "34px",
        width: "184px",
        textAlign: "left",
        borderRadius: "30px",
      }}
    >
      <div
        style={{
          marginLeft: "20px",
        }}
      >
        {getName()}
      </div>
    </button>
  );
};

export default WalletConnector;
