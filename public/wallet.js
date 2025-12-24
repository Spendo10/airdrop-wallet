// public/wallet.js
const connectBtn = document.getElementById("connectBtn");
const statusText = document.getElementById("status");

// Function to connect wallet (MetaMask or WalletConnect)
async function connectWallet() {
  if (window.ethereum) {
    // MetaMask detected
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      statusText.textContent = `🟢 Connected: ${address}`;

      // Send wallet address to backend
      const res = await fetch("/api/wallet-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });
      const data = await res.json();

      if (data.success) statusText.textContent = `✅ Wallet connected!`;
      else statusText.textContent = `⚠️ Error: ${data.error || "Unknown"}`;

    } catch (err) {
      statusText.textContent = `❌ MetaMask connection failed: ${err.message}`;
    }
  } else if (window.WalletConnectProvider) {
    // WalletConnect fallback
    try {
      const provider = new WalletConnectProvider.default({
        infuraId: "YOUR_INFURA_ID" // Optional, only for Ethereum mainnet
      });
      await provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      statusText.textContent = `🟢 Connected: ${address}`;

      // Send to backend
      const res = await fetch("/api/wallet-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });
      const data = await res.json();

      if (data.success) statusText.textContent = `✅ Wallet connected!`;
      else statusText.textContent = `⚠️ Error: ${data.error || "Unknown"}`;

    } catch (err) {
      statusText.textContent = `❌ WalletConnect failed: ${err.message}`;
    }
  } else {
    statusText.textContent = "❌ No Web3 wallet detected! Install MetaMask or WalletConnect.";
  }
}

// Attach to button
connectBtn.addEventListener("click", connectWallet);
