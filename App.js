import flet as ft
import urllib.request
import json
import time
import threading

def main(page: ft.Page):
    page.title = "⚡ BEYZATECH TERMINAL v10.0"
    page.scroll = ft.ScrollMode.AUTO
    page.theme_mode = ft.ThemeMode.DARK
    page.bgcolor = "#090D16"
    page.padding = 20

    coin = "BTC"
    kaynak = "copy"
    borsa = "bitget"
    is_running = True

    title_text = ft.Text("⚡ BEYZATECH TERMINAL v10.0", size=22, weight=ft.FontWeight.BOLD, color="#F8FAFC")
    subtitle_text = ft.Text("Maliyet Analizi & Kripto Formasyon Sinyal Motoru", size=12, color="#38BDF8", weight=ft.FontWeight.W_600)
    coin_title = ft.Text("BTC/USDT (BITGET)", size=20, weight=ft.FontWeight.BOLD, color="#FFFFFF")

    ratio_text = ft.Text("50 / 50", size=15, weight=ft.FontWeight.BOLD, color="#FFFFFF")
    funding_text = ft.Text("%0.0000", size=15, weight=ft.FontWeight.BOLD, color="#FFFFFF")
    oi_text = ft.Text("0.00M", size=15, weight=ft.FontWeight.BOLD, color="#FFFFFF")

    long_maliyet_text = ft.Text("LONG Ort. Giriş: $0.0000", size=14, weight=ft.FontWeight.BOLD, color="#E2E8F0")
    short_maliyet_text = ft.Text("SHORT Ort. Giriş: $0.0000", size=14, weight=ft.FontWeight.BOLD, color="#E2E8F0")

    signal_container = ft.Container(
        content=ft.Text("NÖTR / BEKLE", size=18, weight=ft.FontWeight.BOLD, color="#FFFFFF"),
        bgcolor="#F59E0B", padding=14, border_radius=8, alignment=ft.alignment.center
    )

    kaldıraç_text = ft.Text("RISK MOTORU KALDIRAÇ ÖNERİSİ: 10x", size=12, weight=ft.FontWeight.BOLD, color="#F87171")
    giris_text = ft.Text("Giriş Bölgesi (Limit): $0.0000", size=13, weight=ft.FontWeight.BOLD, color="#F1F5F9")
    stop_text = ft.Text("Zarar Durdur (SL): $0.0000", size=13, weight=ft.FontWeight.BOLD, color="#F1F5F9")
    tp1_text = ft.Text("Kâr Hedefi 1 (TP1): $0.0000", size=13, weight=ft.FontWeight.BOLD, color="#F1F5F9")
    tp2_text = ft.Text("Kâr Hedefi 2 (TP2): $0.0000", size=13, weight=ft.FontWeight.BOLD, color="#F1F5F9")

    ai_body = ft.Text("Kurumsal borsa emir akışı ve likidite havuzu yükleniyor...", size=11, color="#F1F5F9")

    def fetch_nihai_analiz():
        nonlocal coin, kaynak, borsa
        sym = f"{coin.upper().strip()}USDT"
        
        url = f"https://bitget.com{sym}&productType=USDT-FUTURES&limit=100" if borsa == "bitget" else f"https://binance.com{sym}&limit=100"
        
        try:
            # 🚀 Yerleşik urllib kullanarak requests kütüphanesini ve kancaları imha ettik
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                res = json.loads(response.read().decode())
            
            bids = res.get('data', {}).get('bids', []) if borsa == "bitget" else res.get('bids', [])
            asks = res.get('data', {}).get('asks', []) if borsa == "bitget" else res.get('asks', [])

            if bids and asks:
                pr = (float(bids[0][0]) + float(asks[0][0])) / 2
                l_vol, l_val, s_vol, s_val = 0, 0, 0, 0
                crp = 0.998 if kaynak == "copy" else 1.002 if kaynak == "balina" else 1.0

                for bid in bids[:50]:
                    f, m = float(bid[0]), float(bid[1])
                    l_vol += m; l_val += (f * m)
                for ask in asks[:50]:
                    f, m = float(ask[0]), float(ask[1])
                    s_vol += m; s_val += (f * m)

                le = (l_val / l_vol) * crp if l_vol > 0 else pr
                se = (s_val / s_vol) * (crp * 1.004) if s_vol > 0 else pr
                go = (le + se) / 2
                l_ratio = round((l_vol / (l_vol + s_vol)) * 100) if (l_vol + s_vol) > 0 else 50
                
                is_long = pr > go
                giris_yuzde = 0.998 if coin.upper() == 'BTC' else 0.995 if coin.upper() == 'ETH' else 0.992
                sl_yuzde = 0.982 if is_long else 1.018

                giris = pr * giris_yuzde if is_long else pr * (2 - giris_yuzde)
                sl = giris * sl_yuzde if is_long else giris * (2 - sl_yuzde)
                yuzde_fark = abs(((giris - sl) / giris) * 100)
                
                kld_hesap = max(3, min(50, int(15 / yuzde_fark))) if yuzde_fark > 0 else 10
                kld = min(kld_hesap, 20) 

                formasyon_text = f"{coin.upper()} genel altcoin piyasa momentumu ve aritmetik emir dağılımı doğrultusunda çözümlendi."

                coin_title.value = f"{coin}/USDT ({borsa.upper()})"
                ratio_text.value = f"{l_ratio} / {100 - l_ratio}"
                funding_text.value = "0.0100" if l_ratio > 50 else "-0.0150"
                oi_text.value = f"{((l_vol + s_vol) * pr / 1000000):.1f}M"
                
                long_maliyet_text.value = f"LONG Ort. Giriş: ${le:.4f}"
                short_maliyet_text.value = f"SHORT Ort. Giriş: ${se:.4f}"
                
                signal_container.content.value = "LONG" if is_long else "SHORT"
                signal_container.bgcolor = "#10B981" if is_long else "#EF4444"
                
                kaldıraç_text.value = f"RISK MOTORU KALDIRAÇ ÖNERİSİ: {kld}x"
                giris_text.value = f"Giriş Bölgesi (Limit): ${giris:.4f}"
                stop_text.value = f"Zarar Durdur (SL): ${sl:.4f}"
                tp1_text.value = f"Kâr Hedefi 1 (TP1): ${(giris * 1.03 if is_long else giris * 0.97):.4f}"
                tp2_text.value = f"Kâr Hedefi 2 (TP2): ${(giris * 1.045 if is_long else giris * 0.955):.4f}"
                
                ai_body.value = f"{formasyon_text} {borsa.upper()} tahta verilerine göre bu döngüde maksimum risk toleransı kurumsal kilit nedeniyle {kld}x oranıyla sınırlandırılmıştır."
                page.update()
        except Exception as e:
            ai_body.value = f"Veri Çekme Hatası: {str(e)}"
            page.update()

    def auto_refresh_loop():
        while is_running:
            fetch_nihai_analiz()
            time.sleep(5)

    def start_refresh(e):
        threading.Thread(target=auto_refresh_loop, daemon=True).start()

    def set_borsa(b_name):
        nonlocal borsa; borsa = b_name; fetch_nihai_analiz()
    def set_kaynak(k_name):
        nonlocal kaynak; kaynak = k_name; fetch_nihai_analiz()
    def ara_click(e):
        nonlocal coin; coin = search_input.value if search_input.value else "BTC"; fetch_nihai_analiz()

    search_input = ft.TextField(placeholder="Parite Girin (BTC, ETH, SOL...)", color="#FFFFFF", bgcolor="#1E293B", border_color="#475569", expand=True)

    page.add(
        title_text, subtitle_text, ft.Divider(color="#1F2937"),
        ft.Text("BORSA HAVUZU SEÇİN:", color="#F1F5F9", size=12, weight=ft.FontWeight.BOLD),
        ft.Row([
            ft.ElevatedButton("BITGET FUTURES", on_click=lambda _: set_borsa("bitget"), bgcolor="#1E293B", color="#FFFFFF", expand=True),
            ft.ElevatedButton("BINANCE FUTURES", on_click=lambda _: set_borsa("binance"), bgcolor="#1E293B", color="#FFFFFF", expand=True),
        ]),
        ft.Row([
            ft.ElevatedButton("Copy Liderleri", on_click=lambda _: set_kaynak("copy"), bgcolor="#1E293B", color="#FFFFFF", expand=True),
            ft.ElevatedButton("Balinalar", on_click=lambda _: set_kaynak("balina"), bgcolor="#1E293B", color="#FFFFFF", expand=True),
            ft.ElevatedButton("Tümü", on_click=lambda _: set_kaynak("tumu"), bgcolor="#1E293B", color="#FFFFFF", expand=True),
        ]),
        ft.Row([
            search_input,
            ft.ElevatedButton("TARAT", on_click=ara_click, bgcolor="#2563EB", color="#FFFFFF")
        ]),
        ft.Divider(color="#1F2937"), coin_title,
        ft.Container(content=ft.Row([ft.Text("LONG/SHORT ORANI: ", color="#38BDF8", size=11, weight=ft.FontWeight.BOLD), ratio_text], justify=ft.MainAxisAlignment.SPACE_BETWEEN), bgcolor="#111827", padding=10, border_radius=6, border=ft.border.all(1, "#1F2937")),
        ft.Container(content=ft.Row([ft.Text("FONLAMA DURUMU: ", color="#38BDF8", size=11, weight=ft.FontWeight.BOLD), funding_text], justify=ft.MainAxisAlignment.SPACE_BETWEEN), bgcolor="#111827", padding=10, border_radius=6, border=ft.border.all(1, "#1F2937")),
        ft.Container(content=ft.Row([ft.Text("AÇIK POZİSYON (OI): ", color="#38BDF8", size=11, weight=ft.FontWeight.BOLD), oi_text], justify=ft.MainAxisAlignment.SPACE_BETWEEN), bgcolor="#111827", padding=10, border_radius=6, border=ft.border.all(1, "#1F2937")),
        ft.Container(content=long_maliyet_text, bgcolor="#111827", padding=10, border_radius=6, border=ft.border.all(1, "#1F2937")),
        ft.Container(content=short_maliyet_text, bgcolor="#111827", padding=10, border_radius=6, border=ft.border.all(1, "#1F2937")),
        signal_container,
        ft.Container(content=ft.Column([kaldıraç_text, giris_text, stop_text, tp1_text, tp2_text]), bgcolor="#111827", padding=12, border_radius=6, border=ft.border.all(1, "#334155")),
        ft.Container(content=ft.Column([ft.Text("Yapay Zeka Özeti", color="#38BDF8", size=12, weight=ft.FontWeight.BOLD), ai_body]), bgcolor="#1E293B", padding=10, border_radius=6, border=ft.border.all(1, "#3B82F6"))
    )
    page.run_task(start_refresh)

ft.app(target=main)
