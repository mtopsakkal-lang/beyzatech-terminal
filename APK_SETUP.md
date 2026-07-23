# 🎯 BeyzaTech APK Oluşturma Rehberi

## ⚡ En Hızlı Yöntem (5 dakika)

### 1. Gereklilikler
- Node.js 16+
- npm veya yarn
- GitHub hesabı (opsiyonel)

### 2. Komutlar
```bash
# Adım 1: Projeyi klonlayın
git clone https://github.com/mtopsakkal-lang/beyzatech-terminal.git
cd beyzatech-terminal

# Adım 2: Expo CLI ve EAS CLI yükleyin
npm install -g expo-cli eas-cli

# Adım 3: Expo hesabı oluşturun (ilk kez)
eas login
# Email ve şifre girin

# Adım 4: Bağımlılıkları yükleyin
npm install

# Adım 5: APK DERLE
eas build --platform android --non-interactive
```

### 3. APK İndirme
- Derleme tamamlandığında ekrana URL yazılacak
- Veya https://expo.dev hesabınıza girin
- "Builds" sekmesinden APK linkini kopyalayın
- Doğrudan cihazınıza indirin

---

## 📱 APK Kurulum (Derledikten Sonra)

### Android Cihaza:
```
1. APK dosyasını cihaza taşıyın
2. Dosya Yöneticisi açın
3. Downloads klasörüne gidin
4. APK'ya dokunun
5. "Yükle" seçin
6. Bitirmek için bekleyin ✅
```

---

## 🚀 Alternatif: GitHub Actions ile Otomatik Derleme

### Avantajlar:
- Her push'ta otomatik derlenmiş APK
- Hiçbir lokal kurulum gerekmiyor
- GitHub Releases'te otomatik yüklü

### Kurulum:

1. **Expo Token Oluşturun:**
   - https://expo.dev adresine gidin
   - Settings → Access Tokens
   - Yeni token oluşturun
   - Kopyalayın

2. **GitHub'a Token Ekleyin:**
   - Repository: Settings → Secrets and variables → Actions
   - "New repository secret" tıklayın
   - Name: `EXPO_TOKEN`
   - Value: Paste the token

3. **Release Oluşturun:**
   ```bash
   git tag v8.0.0
   git push origin v8.0.0
   ```
   
   APK otomatik GitHub Releases'e yüklenecektir!

---

## 🔥 Sorun Giderme

### ❌ "eas: command not found"
```bash
npm install -g eas-cli
```

### ❌ "permission denied"
```bash
sudo npm install -g eas-cli
```

### ❌ "EXPO_TOKEN not found" (GitHub Actions)
- Repository Settings'de secret eklenmiş mi kontrol edin
- Token'ın süresi dolmadığını kontrol edin
- Yeni token oluşturup güncelleyin

### ❌ Derleme "stuck" kaldı
- 45+ dakika bekleyin (normal)
- İnterneti kontrol edin
- `eas build --platform android` komutunu yeniden çalıştırın

### ❌ APK çok büyük (>100MB)
```bash
# App Bundle (.aab) deneyin:
eas build --platform android --output --type app-bundle
```

---

## ✅ Derleme Başarısı Kontrol Listesi

- [x] Node.js kurulu (`node --version`)
- [x] Expo CLI kurulu (`expo --version`)
- [x] EAS CLI kurulu (`eas --version`)
- [x] Expo hesabında login (`eas login`)
- [x] Bağımlılıklar yüklü (`npm install`)
- [x] APK derlemesi başladı (`eas build --platform android`)
- [x] APK indirme linki alındı
- [x] APK cihaza yüklendi ✨

---

## 📊 Proje Durumu

```
✅ App.js - Tam ve hatasız
✅ app.json - APK build config
✅ package.json - Bağımlılıklar
✅ eas.json - EAS ayarları
✅ babel.config.js - Transpiler
✅ BUILD_INSTRUCTIONS.md - Detaylı rehber
✅ README.md - Projesi açıklaması

🟢 ÜRETIM HAZIR - APK derlemeye hazır!
```

---

## 🎓 İleri Seviye (Opsiyonel)

### Google Play'e Yayınla:
```bash
# 1. Release APK veya App Bundle oluştur
eas build --platform android --non-interactive

# 2. Google Play Console'a gidin
# 3. Uygulama oluşturun
# 4. APK/AAB yükleyin
# 5. Review süreci başlasın
```

### Kendi İmzasını Kullan:
```bash
# Keystore oluştur
keytool -genkey -v -keystore beyzatech.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias beyzatech

# eas.json'da kullan
"production": {
  "android": {
    "buildType": "apk",
    "keystore": "beyzatech.keystore"
  }
}
```

---

## 💡 Son İpuçları

- APK sürümünü güncellemek için `app.json` → `version`
- Her yeni derleme için version numarasını arttırın
- APK'nın boyutunu azaltmak için `expo optimize`
- Test etmek için Android emülatör kullanın

---

**Sorularınız mı var?** 📞
- GitHub Issues: https://github.com/mtopsakkal-lang/beyzatech-terminal/issues
- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/

**Başlamaya hazır mısınız?** ⚡
```bash
eas build --platform android --non-interactive
```
