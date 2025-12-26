document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("verifyWalletBtn");
  const status = document.getElementById("status");

  if (!btn) {
    console.error("Verify button not found");
    return;
  }

  btn.addEventListener("click", async () => {
    try {
      if (!window.ethereum) {
        status.textContent = "❌ No wallet detected (MetaMask / Trust)";
        return;
      }

      status.textContent = "⏳ Connecting wallet…";

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      const address = accounts[0];

      status.textContent = "✍️ Please sign verification message…";

      const message = "Verify wallet for Airdrop participation";
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address]
      });

      status.textContent = "📡 Sending verification…";

      const res = await fetch("/api/wallet-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature })
      });

      const data = await res.json();

      if (data.success) {
        status.textContent = "✅ Wallet verified successfully!";
      } else {
        status.textContent = "❌ Verification failed";
      }

    } catch (err) {
      console.error(err);
      status.textContent = "❌ Wallet verification cancelled";
    }
  });
});
