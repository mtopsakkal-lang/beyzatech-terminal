# 🚀 BeyzaTech Terminal - APK Derleme Talimatları

## Seçenek 1: Expo Cloud Build (Önerilen - En Kolay)

### ✅ Avantajları:
- Hiçbir yerel kurulum gerekmiyor
- Otomatik imzalama
- Bulutta derlenmiş ve güvenli
- En güncel derleme araçları

### 📋 Adım Adım:

#### 1. Expo CLI Yükleyin
```bash
npm install -g expo-cli
npm install -g eas-cli
```

#### 2. Expo Hesabı Oluşturun
https://expo.dev adresine gidin ve ücretsiz hesap açın

#### 3. CLI'de Giriş Yapın
```bash
eas login
```
Email ve şifrenizi girin

#### 4. Projeyi Klonlayın
```bash
git clone https://github.com/mtopsakkal-lang/beyzatech-terminal.git
cd beyzatech-terminal
```

#### 5. Bağımlılıkları Yükleyin
```bash
npm install
# veya
yarn install
```

#### 6. APK Derleyin
```bash
# En hızlı yöntem (Türkiye'den):
eas build --platform android --non-interactive

# veya daha kontrollü şekilde:
eas build --platform android
```

#### 7. APK'yı İndirin
Derleme tamamlandıktan sonra:
- https://expo.dev adresine gidin
- "Builds" sekmesine tıklayın
- En son derlemeden APK linkini kopyalayın
- Doğrudan cihazınıza indirin

---

## Seçenek 2: Android Studio (Lokal Derleme)

### 📋 Gereksinimler:
- Windows/Mac/Linux
- Java JDK 11+ kurulu
- Android SDK (API Level 33)
- ~5GB boş disk alanı
- 30+ dakika

### 1. Java JDK Yükleyin
```bash
# Windows:
https://www.oracle.com/java/technologies/downloads/

# macOS (Homebrew):
brew install openjdk@11

# Linux:
sudo apt-get install openjdk-11-jdk
```

### 2. Android SDK Yükleyin
```bash
https://developer.android.com/studio
```

### 3. Ortam Değişkenlerini Ayarlayın
```bash
# macOS/Linux ~/.bashrc veya ~/.zshrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows (cmd.exe):
setx ANDROID_HOME %USERPROFILE%\AppData\Local\Android\Sdk
setx PATH %PATH%;%ANDROID_HOME%\platform-tools
```

### 4. Projeyi Klonlayın ve Kurulum Yapın
```bash
git clone https://github.com/mtopsakkal-lang/beyzatech-terminal.git
cd beyzatech-terminal
npm install
```

### 5. Expo Çıkışı (Native Derleme)
```bash
expo eject
# Ya da React Native CLI:
npx create-react-native-app
```

### 6. APK Derleyin
```bash
# Android Studio terminali veya:
cd android
./gradlew assembleRelease

# Eğer hata alırsanız:
./gradlew clean
./gradlew assembleRelease
```

### 7. APK Yeri
```
beyzatech-terminal/android/app/build/outputs/apk/release/app-release.apk
```

---

## Seçenek 3: GitHub Actions CI/CD (Otomatik)

### ✅ Avantajları:
- Her push'ta otomatik derleme
- GitHub'da depolanan APK
- Zamanlamaya göre derleme

### 1. GitHub Actions Workflow Oluşturun

`.github/workflows/build-apk.yml` dosyası oluşturun:

```yaml
name: Build APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Expo CLI
        run: npm install -g expo-cli eas-cli
      
      - name: Install dependencies
        run: npm install
      
      - name: Build APK with EAS
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: eas build --platform android --non-interactive
      
      - name: Upload APK to Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: '*.apk'
```

### 2. Expo Token Ekleyin
- https://expo.dev adresinde "Access Tokens" kısmında token oluşturun
- GitHub > Settings > Secrets > `EXPO_TOKEN` olarak ekleyin

### 3. Release Oluşturun
```bash
git tag v8.0.0
git push origin v8.0.0
```

APK otomatik olarak Release'e yüklenecektir!

---

## 🔍 Sorun Giderme

### ❌ "expo command not found"
```bash
npm install -g expo-cli
# veya
sudo npm install -g expo-cli
```

### ❌ "eas login" başarısız
- VPN'i kapatın / değiştirin
- Türkiye IP'sinden erişim sınırı olabilir

### ❌ APK çok büyük (>100MB)
```bash
# App Bundle (.aab) deneyin:
eas build --platform android --non-interactive --output --type app-bundle
```

### ❌ "ANDROID_HOME" hatası
```bash
# Kontrol edin:
echo $ANDROID_HOME

# Ayarlayın:
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### ❌ Derleme zaman aşımı
- Ağ bağlantınızı kontrol edin
- 30-45 dakika bekleyin
- İnterneti sağlam bir yere taşının

---

## ✅ Başarılı Derleme Işaretleri

```bash
✅ eas build --platform android
✅ Downloading APK... 
✅ Build ID: 12345abcde
✅ APK URL: https://expo.dev/artifacts/...
✅ Download APK
```

---

## 📦 APK Yükleme (Derledikten Sonra)

### Android Cihaza:
1. APK'yı cihazın `Downloads` klasörüne kopyalayın
2. Dosya Yöneticisi açın
3. APK dosyasına dokunun
4. "Yükle" veya "Install" seçin
5. "Bilinmeyen kaynaklar"dan izin verin (gerekliyse)

### Google Play'e Yayın (İstiyorsanız):
1. Google Play Console'a gidin: https://play.google.com/console
2. Yeni uygulama oluşturun
3. Yönetilen Play Store > Uygulamalar > Yükleme
4. APK dosyasını yükleyin

---

## 🚀 Hızlı Komut Özeti

```bash
# En kolay yöntem (Expo Cloud):
npm install -g eas-cli
eas login
eas build --platform android --non-interactive

# Lokal derleme (Macbook/Linux):
npm install
npm run build:apk

# GitHub Actions ile (Push yeterli):
git push origin main
# GitHub Actions otomatik derler
```

---

## 📞 Destek
- Expo: https://docs.expo.dev/build-reference/
- React Native: https://reactnative.dev/docs/build-setup
- Hata raporları: GitHub Issues

---

**Derlemek için hazır mısınız?** ✨
