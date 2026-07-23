# ⚡ BeyzaTech Terminal v8.0

**Kurumsal Maliyet & Likidite Analiz Ağı** - Kripto işlem analizi için yapay zeka destekli React Native uygulaması.

## 🎯 Özellikler

✅ **Gerçek Zamanlı Emir Defteri Analizi**
- Binance ve Bitget futures platformlarından veri çekme
- Long/Short hacim analizi
- Maliyet kümeleri tespiti

✅ **Akıllı İşlem Seviyeleri**
- Otomatik entry noktaları hesaplama
- Stop loss ve take profit seviyeleri
- Likidite bölgesi tespiti

✅ **Kaldıraç Recommendation Motoru**
- Risk-reward oranına göre optimal kaldıraç
- 3x - 50x arasında akıllı öneriler
- Portföy koruma algoritması

✅ **Maliyet Yakınlık Alarmları**
- Fiyat maliyet kümelerine yaklaştığında uyarı
- Cihaz titremesi ile bildirim
- Gerçek zamanlı sinyal değişimleri

✅ **Yatırımcı Grubu Filtreleri**
- Copy Liderleri
- Balinalar (Whale tracking)
- Tüm Piyasa Katılımcıları

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/mtopsakkal-lang/beyzatech-terminal.git
cd beyzatech-terminal
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
# veya
yarn install
```

### 3. Uygulamayı Çalıştırın
```bash
# Expo ile başlat:
npm start

# Android cihazda:
npm run android

# iOS cihazda:
npm run ios
```

## 📱 APK Kurması (Derleme)

### Seçenek 1: Expo Cloud Build (Önerilen)
```bash
npm install -g eas-cli
eas login
eas build --platform android --non-interactive
```
Derleme tamamlandıktan sonra Expo panelinden APK'yı indirin.

### Seçenek 2: GitHub Actions (Otomatik)
```bash
git push origin main
# GitHub Actions tarafından otomatik derlenir
```

### Seçenek 3: Lokal Derleme
Detaylı talimatlar için `BUILD_INSTRUCTIONS.md` dosyasını okuyun.

## 📊 Kullanım

1. **Borsa Seçin**: Bitget veya Binance Futures
2. **Yatırımcı Grubu Seçin**: Copy Liderleri / Balinalar / Tümü
3. **Parite Arayın**: BTC, ETH, SOL, vb.
4. **Analizi Gözlemleyin**:
   - Sinyal: GÜÇLÜ LONG / GÜÇLÜ SHORT / BEKLE
   - İşlem Seviyeleri: Entry, SL, TP1, TP2, Likidite Bölgesi
   - Kaldıraç Önerisi

## 🔧 Teknik Detaylar

### Stack
- **Framework**: React Native + Expo
- **UI**: StyleSheet (Dark Theme)
- **API**: Binance Futures, Bitget REST API
- **State Management**: React Hooks

### Mimarisı
```
App.js (Ana bileşen)
├── Borsa Seçimi (Binance/Bitget)
├── Yatırımcı Grubu Filtreleri
├── Parite Arama
├── fetchNihaiAnaliz() - Ana veri işleme
└── UI Bileşenleri
    ├── Fiyat Kartı
    ├── Sinyal Göstergesi
    ├── Long/Short Analizi
    ├── İşlem Seviyeleri
    ├── Kaldıraç Önerisi
    └── AI Özeti
```

### API Endpoints
- **Binance**: `https://fapi.binance.com/fapi/v1/depth`
- **Bitget**: `https://api.bitget.com/v2/spot/public/depth`

### Veri İşleme
1. Order book verileri çekilir
2. Bid (alış) ve Ask (satış) hacimleri toplanır
3. Ağırlıklı ortalama giriş fiyatları hesaplanır
4. Sinyal üretilir (fiyat vs maliyet karşılaştırması)
5. Risk parametreleri hesaplanır

## ⚠️ Yasal Uyarı

Bu uygulama eğitim amaçlıdır. Kripto para alım-satımı yüksek risk içerir. Tüm işlemler kendi sorumluluğunuzda yapılmalıdır. Yazarlar finansal tavsiye vermez.

## 🐛 Sorun Bildirme

Hata veya öneriniz varsa: [GitHub Issues](https://github.com/mtopsakkal-lang/beyzatech-terminal/issues)

## 📝 Lisans

MIT License - Açık Kaynak

## 👨‍💻 Geliştirici

**mtopsakkal** - [GitHub](https://github.com/mtopsakkal-lang)

---

**Version**: 8.0.0  
**Son Güncelleme**: 2026-07-23  
**Durum**: ✅ Üretim Hazır

