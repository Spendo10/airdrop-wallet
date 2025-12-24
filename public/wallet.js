// public/wallet.js
const statusText = document.getElementById('status');
const metaMaskBtn = document.getElementById('metaMaskBtn');
const walletConnectBtn = document.getElementById('walletConnectBtn');

let web3;
let provider;

// MetaMask connection
metaMaskBtn.addEventListener('click', async () => {
  if (!window.ethereum) {
    statusText.textContent = "❌ Please install MetaMask!";
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    statusText.textContent = `🟢 MetaMask connected: ${address}`;

    // Send to backend
    await sendAddressToBackend(address);

  } catch (err) {
    console.error(err);
    statusText.textContent = `❌ MetaMask connection failed: ${err.message}`;
  }
});

// WalletConnect connection
walletConnectBtn.addEventListener('click', async () => {
  try {
    provider = new WalletConnectProvider.default({
      infuraId: "YOUR_INFURA_ID" // optional, required if using Ethereum mainnet
    });

    await provider.enable();
    web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    statusText.textContent = `🟢 WalletConnect connected: ${address}`;

    // Send to backend
    await sendAddressToBackend(address);

    // Subscribe to disconnect
    provider.on("disconnect", () => {
      statusText.textContent = "💡 Wallet disconnected";
    });

  } catch (err) {
    console.error(err);
    statusText.textContent = `❌ WalletConnect failed: ${err.message}`;
  }
});

// Function to send address to backend
async function sendAddressToBackend(address) {
  try {
    const response = await fetch('/api/wallet-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });

    const result = await response.json();
    if (result.success) {
      statusText.textContent += " ✅ Saved to backend!";
    } else {
      statusText.textContent += ` ⚠️ Error: ${result.error || 'Unknown'}`;
    }

  } catch (err) {
    console.error(err);
    statusText.textContent += ` ⚠️ Backend error: ${err.message}`;
  }
}
