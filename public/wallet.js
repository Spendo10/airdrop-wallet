const connectBtn = document.getElementById('connectBtn');
const statusText = document.getElementById('status');

async function connectWallet() {
  if (!window.Web3Modal) {
    statusText.textContent = '❌ vendor.js not loaded';
    return;
  }

  try {
    const providerOptions = {}; // WalletConnect or other options can go here
    const web3Modal = new window.Web3Modal.default({ cacheProvider: false, providerOptions });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    statusText.textContent = `🟢 Connected: ${address}`;

    const response = await fetch('/api/wallet-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });

    const result = await response.json();
    if (result.success) {
      statusText.textContent = `✅ Wallet connected and recorded: ${address}`;
    } else {
      statusText.textContent = `⚠️ Error: ${result.error || 'Unknown error'}`;
    }
  } catch (err) {
    console.error(err);
    statusText.textContent = `❌ Connection failed: ${err.message || err}`;
  }
}

connectBtn.addEventListener('click', connectWallet);
