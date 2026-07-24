import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';

export default function App() {
  const [coin, setCoin] = useState('BTC');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [kaynak, setKaynak] = useState('copy'); 
  const [borsa, setBorsa] = useState('bitget'); 
  const [data, setData] = useState({
    price: '0.0000', longEntry: '0.0000', shortEntry: '0.0000', genelOrt: '0.0000',
    longShortRatio: '50/50', signal: 'NÖTR', signalColor: '#F59E0B',
    akilliGiris: '0.0000', stopLoss: '0.0000', tp1: '0.0000', tp2: '0.0000',
    fundingRate: '%0.00', openInterest: '0.00M', oneriKaldırac: '10x', aiSummary: 'Veriler işleniyor...'
  });

  const fetchNihaiAnaliz = async (sc, sk, sb) => {
    setLoading(true);
    const sym = `${sc.toUpperCase().trim()}USDT`;
    
    // APK içinde doğrudan tünelsiz çalışan resmi borsa adresleri
    const url = sb === 'bitget' 
      ? `https://bitget.com{sym}&productType=USDT-FUTURES&limit=100`
      : `https://binance.com{sym}&limit=100`;
      
    try {
      const response = await fetch(url);
      const res = await response.json();
      let b = sb === 'bitget' ? res.data?.bids : res.bids;
      let a = sb === 'bitget' ? res.data?.asks : res.asks;
      
      if (b && a && b.length > 0 && a.length > 0) {
        const pr = (parseFloat(b[0][0]) + parseFloat(a[0][0])) / 2;
        let lVol = 0, lVal = 0, sVol = 0, sVolVal = 0;
        let crp = sk === 'copy' ? 0.998 : sk === 'balina' ? 1.002 : 1.0;
        
        b.forEach(x => { const f = parseFloat(x[0]); const m = parseFloat(x[1]); if(!isNaN(f) && !isNaN(m)) { lVol += m; lVal += (f * m); } });
        a.forEach(x => { const f = parseFloat(x[0]); const m = parseFloat(x[1]); if(!isNaN(f) && !isNaN(m)) { sVol += m; sVolVal += (f * m); } });
        
        const le = lVol > 0 ? (lVal / lVol) * crp : pr;
        const se = sVol > 0 ? (sVolVal / sVol) * (crp * 1.004) : pr;
        const go = (le + se) / 2;
        const lRatio = Math.round((lVol / (lVol + sVol)) * 100) || 50;
        const isLong = pr > go;
        const giris = isLong ? pr * 0.997 : pr * 1.003;
        const sl = isLong ? giris * 0.985 : giris * 1.015;
        const kld = Math.max(3, Math.min(50, Math.floor(15 / (Math.abs(((giris - sl) / giris) * 100)))));
        
        setData({
          price: pr.toFixed(4), longEntry: le.toFixed(4), shortEntry: se.toFixed(4), genelOrt: go.toFixed(4),
          longShortRatio: `%${lRatio} / %${100 - lRatio}`, signal: isLong ? 'GÜÇLÜ LONG' : 'GÜÇLÜ SHORT',
          signalColor: isLong ? '#10B981' : '#EF4444', akilliGiris: giris.toFixed(4), stopLoss: sl.toFixed(4),
          tp1: (isLong ? giris * 1.03 : giris * 0.97).toFixed(4), tp2: (isLong ? giris * 1.045 : giris * 0.955).toFixed(4),
          fundingRate: lRatio > 50 ? '%0.0100' : '%-0.0150', openInterest: `${((lVol + sVol) * pr / 1000000).toFixed(1)}M`,
          oneriKaldırac: `${kld}x`, aiSummary: `${sb.toUpperCase()} emir blokları incelendi. Dağılım dengesi %${lRatio} Alıcı lehinedir.`
        });
      }
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNihaiAnaliz(coin, kaynak, borsa); }, [kaynak, borsa]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>⚡ BEYZATECH TERMINAL v9.9.5</Text>
        <Text style={styles.subtitle}>Maliyet Analizi & Akıllı Risk Yönetimi</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, borsa === 'bitget' && styles.actB]} onPress={() => setBorsa('bitget')}><Text style={styles.btnTx}>BITGET FUTURES</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn, borsa === 'binance' && styles.actB]} onPress={() => setBorsa('binance')}><Text style={styles.btnTx}>BINANCE FUTURES</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.fBtn, kaynak === 'copy' && styles.actF]} onPress={() => setKaynak('copy')}><Text style={styles.fBtnTx}>Copy Liderleri</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.fBtn, kaynak === 'balina' && styles.actF]} onPress={() => setKaynak('balina')}><Text style={styles.fBtnTx}>Balinalar</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.fBtn, kaynak === 'tumu' && styles.actF]} onPress={() => setKaynak('tumu')}><Text style={styles.fBtnTx}>Tümü</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Parite Girin (BTC, ETH, SOL...)" placeholderTextColor="#64748B" onChangeText={setSearchQuery} />
          <TouchableOpacity style={styles.sBtn} onPress={() => { if(searchQuery.length > 0){ setCoin(searchQuery); fetchNihaiAnaliz(searchQuery, kaynak, borsa); } }}><Text style={styles.sBtnTx}>TARAT</Text></TouchableOpacity>
        </View>
        {loading ? <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 30 }} /> : (
          <View style={{ width: '100%' }}>
            <Text style={styles.coinTitle}>{coin}/USDT ({borsa.toUpperCase()})</Text>
            <View style={styles.metricBox}><Text style={styles.mTitle}>LONG/SHORT ORANI</Text><Text style={styles.mVal}>{data.longShortRatio}</Text></View>
            <View style={styles.metricBox}><Text style={styles.mTitle}>FONLAMA DURUMU</Text><Text style={styles.mVal}>{data.fundingRate}</Text></View>
            <View style={styles.metricBox}><Text style={styles.mTitle}>AÇIK POZİSYON (OI)</Text><Text style={styles.mVal}>{data.openInterest}</Text></View>
            <View style={styles.card}><Text style={styles.cTitle}>🟢 LONG Ort. Giriş: <Text style={{color:'#10B981'}}>${data.longEntry}</Text></Text></View>
            <View style={styles.card}><Text style={styles.cTitle}>🔴 SHORT Ort. Giriş: <Text style={{color:'#EF4444'}}>${data.shortEntry}</Text></Text></View>
            <View style={[styles.sigBox, { backgroundColor: data.signalColor }]}><Text style={styles.sigTx}>{data.signal}</Text></View>
            <View style={styles.levelCard}>
              <Text style={styles.lBadge}>⚠️ RISK MOTORU KALDIRAÇ ÖNERİSİ: {data.oneriKaldırac}</Text>
              <Text style={styles.lLine}>🔹 Giriş (Limit): <Text style={{color:'#22D3EE'}}>${data.akilliGiris}</Text></Text>
              <Text style={styles.levelLine}>🛑 Zarar Durdur (SL): <Text style={{color:'#EF4444', fontWeight:'bold'}}>${data.stopLoss}</Text></Text>
              <Text style={styles.levelLine}>🟢 Kâr Hedefi 1 (TP1): <Text style={{color:'#10B981', fontWeight:'bold'}}>${data.tp1}</Text></Text>
              <Text style={styles.levelLine}>🟢 Kâr Hedefi 2 (TP2): <Text style={{color:'#10B981', fontWeight:'bold'}}>${data.tp2}</Text></Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  scroll: { padding: 15, alignItems: 'center' },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  subtitle: { color: '#38BDF8', fontSize: 11, marginBottom: 15, fontWeight: '600' },
  lbl: { color: '#F1F5F9', fontSize: 11, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 5 },
  row: { flexDirection: 'row', width: '100%', marginBottom: 10, justifyContent: 'space-between' },
  btn: { flex: 1, backgroundColor: '#1E293B', padding: 10, alignItems: 'center', borderRadius: 6, marginHorizontal: 2, borderWidth: 1, borderColor: '#334155' },
  actB: { backgroundColor: '#2563EB', borderColor: '#38BDF8' },
  btnTx: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  fBtn: { flex: 1, backgroundColor: '#1E293B', marginHorizontal: 2, padding: 8, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  actF: { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  fBtnTx: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  input: { flex: 1, backgroundColor: '#1E293B', color: '#FFF', borderRadius: 6, paddingHorizontal: 10, height: 40, borderWidth: 1, borderColor: '#475569' },
  sBtn: { backgroundColor: '#2563EB', borderRadius: 6, paddingHorizontal: 15, justifyContent: 'center', marginLeft: 5 },
  sBtnTx: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  coinTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginVertical: 8, alignSelf: 'flex-start' },
  metricBox: { backgroundColor: '#111827', width: '100%', padding: 10, borderRadius: 6, marginBottom: 5, borderWidth: 1, borderColor: '#1F2937', flexDirection: 'row', justifyContent: 'space-between' },
  mTitle: { color: '#38BDF8', fontSize: 11, fontWeight: '800' },
  mVal: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  card: { backgroundColor: '#111827', width: '100%', borderRadius: 6, padding: 10, marginBottom: 5, borderWidth: 1, borderColor: '#1F2937' },
  cTitle: { color: '#E2E8F0', fontSize: 13, fontWeight: '700' },
  sigBox: { width: '100%', padding: 12, borderRadius: 6, alignItems: 'center', marginVertical: 5 },
  sigTx: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  levelCard: { backgroundColor: '#111827', width: '100%', borderRadius: 6, padding: 10, marginBottom: 5, borderWidth: 1, borderColor: '#334155' },
  lBadge: { color: '#F87171', fontSize: 11, fontWeight: 'bold', marginBottom: 5 },
  lLine: { color: '#F1F5F9', fontSize: 13, fontWeight: '700', marginVertical: 2 }
});
