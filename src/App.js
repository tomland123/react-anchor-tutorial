import "./App.css";
import { WalletProvider } from "./Wallet";
import WalletConnector from "./WalletConnector";
import MinimalSetup from "./MinimalSetup";

function App() {
  return (
    <div className="App">
      <WalletProvider>
        <WalletConnector />
        <MinimalSetup />
      </WalletProvider>
    </div>
  );
}

export default App;
