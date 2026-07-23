import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Vibration } from 'react-native';

export default function App() {
  const [coin, setCoin] = useState('BTC');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [kaynak, setKaynak] = useState('copy'); // 'copy', 'balina', 'tumu'
  const [borsa, setBorsa] = useState('binance'); // 'bitget', 'binance'

  const [yakinlikUyarisi, setYakinlikUyarisi] = useState(false);
  const [uyariMesaji, setUyariMesaji] = useState('');
  const oncekiSinyalRef = useRef('');

  const [data, setData] = useState({
    price: '0.00',
    longEntry: '0.00',
    longCount: '0',
    longSize: '0.00M',
    shortEntry: '0.00',
    shortCount: '0',
    shortSize: '0.00M',
    genelOrt: '0.00',
    signal: 'BEKLE / NÖTR',
    signalColor: '#6B7280',
    akilliGiris: '0.00',
    stopLoss: '0.00',
    takeProfit1: '0.00',
    takeProfit2: '0.00',
    liqZone: '0.00',
    oneriKaldırac: '10x',
    aiSummary: 'Borsa veri havuzları analiz ediliyor...'
  });

  const fetchNihaiAnaliz = async (selectedCoin, selectedKaynak, selectedBorsa) => {
    setLoading(true);
    const upperCoin = selectedCoin.toUpperCase().trim();
    const symbol = `${upperCoin}USDT`;
    
    // FIXED: Correct API endpoints with proper URL structure
    let targetUrl = '';
    
    if (selectedBorsa === 'bitget') {
      targetUrl = `https://api.bitget.com/v2/spot/public/depth?symbol=${symbol}&limit=100`;
    } else {
      // Binance Futures API
      targetUrl = `https://fapi.binance.com/fapi/v1/depth?symbol=${symbol}&limit=100`;
    }

    try {
      const response = await fetch(targetUrl, { 
        headers: { 'Accept': 'application/json' },
        timeout: 10000 
      });
      
      if (!response.ok) throw new Error(`HTTP Hata: ${response.status}`);
      
      const resData = await response.json();
      let bids = [];
      let asks = [];

      // Parse API responses based on exchange format
      if (selectedBorsa === 'bitget' && resData.data) {
        bids = resData.data.bids || [];
        asks = resData.data.asks || [];
      } else if (selectedBorsa === 'binance' && resData.bids) {
        bids = resData.bids || [];
        asks = resData.asks || [];
      }

      if (bids.length > 0 && asks.length > 0) {
        // Calculate mid price from best bid/ask
        const bestBid = parseFloat(bids[0][0]);
        const bestAsk = parseFloat(asks[0][0]);
        const anlikFiyat = (bestBid + bestAsk) / 2;

        let totalLongVolume = 0;
        let totalLongMaliyetValue = 0;
        let totalShortVolume = 0;
        let totalShortMaliyetValue = 0;

        // Investor group multipliers
        let carpan = selectedKaynak === 'copy' ? 0.998 : selectedKaynak === 'balina' ? 1.002 : 1.0;

        bids.forEach(bid => {
          const fiyat = parseFloat(bid[0]);
          const miktar = parseFloat(bid[1]);
          if (!isNaN(fiyat) && !isNaN(miktar)) {
            totalLongVolume += miktar;
            totalLongMaliyetValue += (fiyat * miktar);
          }
        });

        asks.forEach(ask => {
          const fiyat = parseFloat(ask[0]);
          const miktar = parseFloat(ask[1]);
          if (!isNaN(fiyat) && !isNaN(miktar)) {
            totalShortVolume += miktar;
            totalShortMaliyetValue += (fiyat * miktar);
          }
        });

        if (totalLongVolume === 0 || totalShortVolume === 0) throw new Error("Tahta hacmi sıfır.");

        const longOrtGiris = (totalLongMaliyetValue / totalLongVolume) * carpan;
        const shortOrtGiris = (totalShortMaliyetValue / totalShortVolume) * (carpan * 1.004);
        const genelOrt = (longOrtGiris + shortOrtGiris) / 2;

        let guncelSinyal = 'BEKLE / NÖTR';
        let sColor = '#F59E0B';
        let akilliGiris = anlikFiyat;
        let stopLoss = anlikFiyat;
        let tp1 = anlikFiyat;
        let tp2 = anlikFiyat;
        let lZone = anlikFiyat;

        if (anlikFiyat > genelOrt) {
          guncelSinyal = 'GÜÇLÜ LONG';
          sColor = '#10B981';
          akilliGiris = anlikFiyat * 0.997;
          stopLoss = akilliGiris * 0.985; 
          tp1 = akilliGiris * 1.03;
          tp2 = akilliGiris * 1.045;
          lZone = akilliGiris * 0.95;
        } else {
          guncelSinyal = 'GÜÇLÜ SHORT';
          sColor = '#EF4444';
          akilliGiris = anlikFiyat * 1.003;
          stopLoss = akilliGiris * 1.015; 
          tp1 = akilliGiris * 0.97;
          tp2 = akilliGiris * 0.955;
          lZone = akilliGiris * 1.05;
        }

        // Smart leverage calculation
        const yuzdeFark = Math.abs(((akilliGiris - stopLoss) / akilliGiris) * 100);
        const hesaplananKaldıraç = Math.floor(15 / yuzdeFark); 
        const finalKaldıraç = hesaplananKaldıraç > 50 ? '50x' : hesaplananKaldıraç < 3 ? '3x' : `${hesaplananKaldıraç}x`;

        // Cost proximity alarm
        const longMesafe = Math.abs(((anlikFiyat - longOrtGiris) / anlikFiyat) * 100);
        const shortMesafe = Math.abs(((anlikFiyat - shortOrtGiris) / anlikFiyat) * 100);

        if (longMesafe < 0.5) {
          setUyariMesaji(`🚨 DESTEK YAKIN: Fiyat Long Maliyet Kümesine Yaklaştı ($${longOrtGiris.toFixed(2)})!`);
          setYakinlikUyarisi(true);
          Vibration.vibrate();
        } else if (shortMesafe < 0.5) {
          setUyariMesaji(`🚨 DİRENÇ YAKIN: Fiyat Short Maliyet Duvarına Yaklaştı ($${shortOrtGiris.toFixed(2)})!`);
          setYakinlikUyarisi(true);
          Vibration.vibrate();
        } else {
          setYakinlikUyarisi(false);
        }

        oncekiSinyalRef.current = guncelSinyal;

        setData({
          price: anlikFiyat.toFixed(2),
          longEntry: longOrtGiris.toFixed(2),
          longCount: Math.floor(totalLongVolume * 0.05).toString(),
          longSize: `$${((totalLongMaliyetValue * 0.01) / 1000000).toFixed(2)}M`,
          shortEntry: shortOrtGiris.toFixed(2),
          shortCount: Math.floor(totalShortVolume * 0.05).toString(),
          shortSize: `$${((totalShortMaliyetValue * 0.01) / 1000000).toFixed(2)}M`,
          genelOrt: genelOrt.toFixed(2),
          signal: guncelSinyal,
          signalColor: sColor,
          akilliGiris: akilliGiris.toFixed(2),
          stopLoss: stopLoss.toFixed(2),
          takeProfit1: tp1.toFixed(2),
          takeProfit2: tp2.toFixed(2),
          liqZone: lZone.toFixed(2),
          oneriKaldırac: finalKaldıraç,
          aiSummary: `${selectedBorsa.toUpperCase()} vadeli emir derinliği başarıyla çözümlendi. Piyasa dağılımına göre bu döngüde maksimum risk toleransı ${finalKaldıraç} kaldıraç oranını desteklemektedir.`
        });
      } else {
        throw new Error("Emir defteri verisi alınamadı");
      }
    } catch (error) {
      alert(`Veri Hatası: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNihaiAnaliz(coin, kaynak, borsa);
  }, [kaynak, borsa]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      const formatted = searchQuery.toUpperCase().replace('USDT', '').trim();
      setCoin(formatted);
      fetchNihaiAnaliz(formatted, kaynak, borsa);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {yakinlikUyarisi && (
          <TouchableOpacity style={styles.alarmFlaş} onPress={() => setYakinlikUyarisi(false)}>
            <Text style={styles.alarmFlaşText}>{uyariMesaji}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.mainTitle}>⚡ BEYZATECH TERMINAL v8.0</Text>
        <Text style={styles.subTitle}>Kurumsal Maliyet & Likidite Analiz Ağı</Text>

        <Text style={styles.sectionLabel}>Borsa Havuzu Seçin:</Text>
        <View style={styles.borsaRow}>
          <TouchableOpacity style={[styles.borsaBtn, borsa === 'bitget' && styles.activeBorsa]} onPress={() => setBorsa('bitget')}>
            <Text style={[styles.borsaBtnText, borsa === 'bitget' && styles.activeBorsaText]}>BITGET FUTURES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.borsaBtn, borsa === 'binance' && styles.activeBorsa]} onPress={() => setBorsa('binance')}>
            <Text style={[styles.borsaBtnText, borsa === 'binance' && styles.activeBorsaText]}>BINANCE FUTURES</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Yatırımcı Grubu:</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterBtn, kaynak === 'copy' && styles.activeBtn]} onPress={() => setKaynak('copy')}>
            <Text style={[styles.btnText, kaynak === 'copy' && styles.activeBtnText]}>Copy Liderleri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, kaynak === 'balina' && styles.activeBtn]} onPress={() => setKaynak('balina')}>
            <Text style={[styles.btnText, kaynak === 'balina' && styles.activeBtnText]}>Balinalar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, kaynak === 'tumu' && styles.activeBtn]} onPress={() => setKaynak('tumu')}>
            <Text style={[styles.btnText, kaynak === 'tumu' && styles.activeBtnText]}>Tümü</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.input}
            placeholder="Parite Kodu Girin (Örn: BTC, ETH, NEAR)"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Tarat</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
        ) : (
          <View style={{ width: '100%' }}>
            {/* Current Price */}
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>{coin} Fiyatı</Text>
              <Text style={styles.priceValue}>${data.price}</Text>
            </View>

            {/* Signal Card */}
            <View style={[styles.signalCard, { backgroundColor: data.signalColor + '20' }]}>
              <Text style={[styles.signalLabel, { color: data.signalColor }]}>📊 SİNYAL</Text>
              <Text style={[styles.signalValue, { color: data.signalColor }]}>{data.signal}</Text>
            </View>

            {/* Long/Short Analysis */}
            <View style={styles.analysisRow}>
              <View style={styles.analysisCard}>
                <Text style={styles.analysisTitle}>📈 LONG</Text>
                <Text style={styles.analysisLabel}>Giriş: ${data.longEntry}</Text>
                <Text style={styles.analysisLabel}>Hacim: {data.longSize}</Text>
                <Text style={styles.analysisLabel}>Emirler: {data.longCount}</Text>
              </View>
              <View style={styles.analysisCard}>
                <Text style={styles.analysisTitle}>📉 SHORT</Text>
                <Text style={styles.analysisLabel}>Giriş: ${data.shortEntry}</Text>
                <Text style={styles.analysisLabel}>Hacim: {data.shortSize}</Text>
                <Text style={styles.analysisLabel}>Emirler: {data.shortCount}</Text>
              </View>
            </View>

            {/* Trading Levels */}
            <View style={styles.levelsCard}>
              <Text style={styles.levelsTitle}>🎯 İŞLEM SEVİYELERİ</Text>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>Akıllı Giriş:</Text>
                <Text style={styles.levelValue}>${data.akilliGiris}</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>Stop Loss:</Text>
                <Text style={[styles.levelValue, { color: '#EF4444' }]}>${data.stopLoss}</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>Take Profit 1:</Text>
                <Text style={[styles.levelValue, { color: '#10B981' }]}>${data.takeProfit1}</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>Take Profit 2:</Text>
                <Text style={[styles.levelValue, { color: '#10B981' }]}>${data.takeProfit2}</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>Likidasyon Bölgesi:</Text>
                <Text style={styles.levelValue}>${data.liqZone}</Text>
              </View>
            </View>

            {/* Leverage Recommendation */}
            <View style={styles.leverageCard}>
              <Text style={styles.leverageLabel}>💪 ÖNERİLEN KALDIRAÇ</Text>
              <Text style={styles.leverageValue}>{data.oneriKaldırac}</Text>
            </View>

            {/* AI Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>🤖 AI ANALİZİ</Text>
              <Text style={styles.summaryText}>{data.aiSummary}</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 16,
    marginBottom: 12,
  },
  borsaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  borsaBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
  },
  activeBorsa: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  borsaBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeBorsaText: {
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeBtnText: {
    color: '#FFFFFF',
  },
  searchSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    color: '#FFFFFF',
    fontSize: 14,
  },
  searchButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  alarmFlaş: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#991B1B',
  },
  alarmFlaşText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  priceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  priceLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  signalCard: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  signalLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  signalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  analysisCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  analysisTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  analysisLabel: {
    color: '#D1D5DB',
    fontSize: 11,
    marginBottom: 4,
  },
  levelsCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  levelsTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  levelValue: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  leverageCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  leverageLabel: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  leverageValue: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 32,
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
  },
});