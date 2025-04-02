# GYÓGYNÖVÉNYKERESŐ WEBALKALMAZÁS TESZTELÉSI DOKUMENTÁCIÓ
**Projekt neve:** Gyógynövénykereső Webalkalmazás
**Dokumentum verziószáma:** 1.0
**Tesztelési időszak:** 2025. március 1-20.
**Készítette:** Markó Dániel

## 1. TESZTÖSSZEFOGLALÓ

Az alkalmazás tesztelése során alapos vizsgálatokat végeztünk, lefedve a funkcionális, felhasználói élmény, terhelési és biztonsági szempontokat. A tesztelés célja az volt, hogy biztosítsuk a webshop alkalmazás stabil, felhasználóbarát és biztonságos működését.

### 1.1 Tesztelési módszerek

* **Manuális tesztelés:** A felhasználói felület és funkciók manuális ellenőrzése
* **Terheléses tesztelés:** Az alkalmazás teljesítményének vizsgálata terhelés alatt
* **Biztonsági tesztelés:** Az alkalmazás védelmi mechanizmusainak ellenőrzése

### 1.2 Tesztelési környezet

* **Tesztkörnyezet:** Staging szerver
* **Böngészők:** Chrome 122, Firefox 124, Safari 17.4, Edge 122
* **Eszközök:** Dell Latitude E6540 (Windows 10), iPad Pro 12.9", Samsung Galaxy A16 5G, iPhone 14 Pro
* **Hálózat:** 1 Gbps LAN, 100 Mbps WiFi, 5G mobilhálózat

### 1.3 Teszteredmények összefoglalása

* **Sikeres tesztesetek:** 42/45
* **Kritikus hibák:** 0
* **Közepes súlyosságú hibák:** 1
* **Alacsony súlyosságú hibák:** 3

## 2. RÉSZLETES TESZTESETEK

### 2.1 Funkcionális tesztek

#### TC-F-001: Kezdőlap tartalmainak megjelenítése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.01. 10:30  
**Prioritás:** Magas  
**Státusz:** Sikeres

**Teszt célja:**  
Ellenőrizni, hogy a kezdőlap megfelelően jeleníti-e meg a kiemelt és legújabb tartalmakat.

**Előfeltételek:**  
1. Az alkalmazás elérhető
2. Az adatbázisban léteznek kiemelt (featuredPosts) és legújabb (latestPosts) bejegyzések

**Tesztlépések:**  
1. Navigálás a webshop kezdőlapjára
2. A kiemelt bejegyzések megjelenítésének ellenőrzése
3. A legújabb bejegyzések megjelenítésének ellenőrzése
4. Betöltési idő mérése

**Elvárt eredmény:**  
- A kiemelt és legújabb bejegyzések listája megjelenik
- A betöltési idő < 2 másodperc
- A megjelenített adatok relevánsak és helyesek

**Tényleges eredmény:**  
- A kiemelt és legújabb bejegyzések helyesen megjelentek
- A betöltési idő átlagosan 1.3 másodperc volt 10 próbálkozás során
- A megjelenített adatok relevánsak és helyesek voltak

**Megjegyzések:**  
A betöltési idő a várakozásoknak megfelelően alakult minden tesztelt eszközön és hálózaton.

#### TC-F-002: Keresési funkció tesztelése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.03. 14:15  
**Prioritás:** Magas  
**Státusz:** Sikeres

**Teszt célja:**  
Ellenőrizni a keresési funkció működését és a keresési eredmények relevanciáját.

**Előfeltételek:**  
1. Az alkalmazás elérhető
2. Az adatbázisban különböző termékek léteznek

**Tesztlépések:**  
1. Navigálás a webshop keresőmezőjéhez
2. Különböző keresési kulcsszavak beírása (pl. "tea", "gyógyfű", "5gp34k" - nemlétező)
3. Keresés indítása
4. A keresési eredmények és a betöltési idő ellenőrzése

**Elvárt eredmény:**  
- A releváns keresési kulcsszavakra megfelelő találatok jelennek meg
- Nem létező termékre történő keresés esetén üres találati lista "Nincs találat" üzenettel
- A keresés < 2 másodpercen belül eredményt ad

**Tényleges eredmény:**  
- A keresés releváns találatokat adott a létező kulcsszavakra
- Nemlétező termékekre megfelelően üres találati listát és "Nincs találat" üzenetet kaptunk
- A keresés átlagosan 0.8 másodpercen belül eredményt adott

**Megjegyzések:**  
A keresési algoritmus hatékonyan működött különböző keresési mintázatok esetén is.

#### TC-F-003: Kosár funkcióinak tesztelése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.05. 11:20  
**Prioritás:** Kritikus  
**Státusz:** Sikeres

**Teszt célja:**  
A kosár funkcióinak tesztelése: termékek hozzáadása, mennyiség módosítása, eltávolítása.

**Előfeltételek:**  
1. Az alkalmazás elérhető
2. Az adatbázisban termékek léteznek

**Tesztlépések:**  
1. Termék kiválasztása és kosárba helyezése
2. Termék mennyiségének növelése (1→3)
3. Termék mennyiségének csökkentése (3→2)
4. Termék eltávolítása a kosárból
5. Több különböző termék kosárba helyezése
6. A kosár adatainak szinkronitásának ellenőrzése az API-val

**Elvárt eredmény:**  
- A termékek sikeresen hozzáadhatók a kosárhoz
- A mennyiség módosítása helyesen változtatja a kosár tartalmát és végösszeget
- A termék eltávolítása frissíti a kosár tartalmát
- A kosár adatai szinkronban vannak az API-val
- A cartItems mindig az aktuális állapotot mutatja

**Tényleges eredmény:**  
- A termékek hozzáadása, mennyiségének módosítása és eltávolítása megfelelően működött
- A kosár végösszege és a szállítási költségek helyesen számolódtak
- A cartItems megfelelően frissült minden művelet után
- A kosár adatai szinkronban voltak az API-val

**Megjegyzések:**  
A kosár funkcionalitása minden tesztelt esetben stabilan működött, a számítások pontosak voltak.

#### TC-F-004: Vásárlási folyamat tesztelése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.07. 09:45  
**Prioritás:** Kritikus  
**Státusz:** Sikeres

**Teszt célja:**  
A teljes vásárlási folyamat tesztelése a termék kiválasztásától a sikeres rendelésig.

**Előfeltételek:**  
1. Az alkalmazás elérhető
2. A felhasználó be van jelentkezve
3. A kosárban legalább egy termék található

**Tesztlépések:**  
1. Továbblépés a pénztárhoz
2. Szállítási adatok megadása a checkoutForm-ban
3. Fizetési adatok megadása
4. Rendelés elküldése
5. Visszaigazolás ellenőrzése

**Elvárt eredmény:**  
- A checkoutForm megfelelően kezeli a kitöltött adatokat
- A rendelés sikeresen feldolgozásra kerül
- Rendelési szám (orderNumber) generálódik
- A rendszer visszaigazolást ad a sikeres rendelésről

**Tényleges eredmény:**  
- A checkoutForm hibátlanul működött, megfelelően validálta az adatokat
- A rendelés leadása sikeres volt
- A rendelési szám generálódott (pl. #ORD-2025-03542)
- A rendszer megfelelő visszaigazolást adott emailben és a felületen is

**Megjegyzések:**  
A vásárlási folyamat lépései között a navigáció intuitív volt, a folyamat minden tesztelt fizetési módszerrel sikeresen lezajlott (bankkártya, PayPal, utalás).

### 2.2 Felhasználói élmény tesztek

#### TC-UX-001: Navigáció tesztelése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.10. 13:40  
**Prioritás:** Magas  
**Státusz:** Sikeres

**Teszt célja:**  
Az alkalmazás navigációs rendszerének tesztelése különböző eszközökön.

**Előfeltételek:**  
1. Az alkalmazás elérhető különböző eszközökön

**Tesztlépések:**  
1. Navigálás a webshop főbb oldalaira (kezdőlap, kategóriák, termékoldal, kosár, fiók)
2. Menüpontok és linkek működésének ellenőrzése
3. Oldalbetöltési idők mérése
4. Navigáció tesztelése különböző képernyőméreteken

**Elvárt eredmény:**  
- A navigáció minden eszközön zökkenőmentesen működik
- Az oldalak gyorsan betöltődnek (< 3 másodperc)
- Az útvonalak hibamentesen vezetik a felhasználót a megfelelő oldalakra
- A menüpontok logikus elrendezésűek

**Tényleges eredmény:**  
- A navigáció minden tesztelt eszközön megfelelően működött
- Az oldalbetöltési idők átlagosan 1.8 másodperc alatt maradtak
- Az útvonalak minden esetben a megfelelő oldalakra vezettek
- A menüpontok elrendezése logikus és könnyen használható volt

**Megjegyzések:**  
A mobilnézetben a hamburger menü megfelelően működött, a hierarchikus navigáció jól használható volt.

#### TC-UX-002: Reszponzív design tesztelése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.12. 15:10  
**Prioritás:** Magas  
**Státusz:** Részben sikeres

**Teszt célja:**  
Az alkalmazás reszponzív designjának tesztelése különböző eszközökön és képernyőméreteken.

**Előfeltételek:**  
1. Az alkalmazás elérhető különböző eszközökön

**Tesztlépések:**  
1. Az alkalmazás betöltése különböző eszközökön (asztali gép, tablet, mobil)
2. Az oldalak elrendezésének és megjelenésének ellenőrzése
3. Tipográfia és színek ellenőrzése
4. Gombok, ikonok és interaktív elemek használhatóságának ellenőrzése

**Elvárt eredmény:**  
- Az alkalmazás megfelelően alkalmazkodik a különböző képernyőméretekhez
- A vizuális elemek (gombok, ikonok) egységesek és felhasználóbarátok
- A színek és tipográfia kellemes vizuális élményt nyújt
- Minden funkció használható minden eszköztípuson

**Tényleges eredmény:**  
- Az alkalmazás nagy részben megfelelően alkalmazkodott a különböző képernyőméretekhez
- A vizuális elemek egységesek és jól használhatók voltak
- **Probléma:** Samsung Galaxy A16 5G készüléken a termékgaléria nem megfelelően jelent meg fekvő módban
- A színek és tipográfia kellemes vizuális élményt nyújtott

**Megjegyzések:**  
A termékgaléria hibája a Samsung Galaxy A16 5G készüléken fekvő módban javításra szorul. A hiba csak ezen az egy eszközön jelentkezett. (Bug ID: BUG-2025-032)

### 2.3 Terhelési tesztek

#### TC-L-001: API terheléses teszt

**Tesztelő:** A teljes fejlesztői csapat (Nádassy Ilona, Markó Dániel, Stark Ernő)
**Tesztelés dátuma:** 2025.03.15. 02:30  
**Prioritás:** Magas  
**Státusz:** Sikeres

**Teszt célja:**  
Az API terhelhetőségének tesztelése nagy számú párhuzamos kérés mellett.

**Előfeltételek:**  
1. Az API elérhető a tesztkörnyezetben
2. A terheléses tesztelő eszközök beállítva

**Tesztlépések:**  
1. Szimulált felhasználók számának fokozatos növelése (100, 500, 1000, 5000)
2. Különböző API végpontok terhelése párhuzamos kérésekkel
3. Válaszidők és hibaarány mérése
4. Rendszerviselkedés monitorozása magas terhelés mellett

**Elvárt eredmény:**  
- Az API stabilan működik nagy számú párhuzamos kérés mellett
- A válaszidők elfogadható szinten maradnak (< 2 másodperc)
- Adatvesztés nem fordul elő
- A rendszer automatikusan skálázódik szükség esetén

**Tényleges eredmény:**  
- Az API 1000 párhuzamos felhasználóig stabilan működött
- 5000 párhuzamos felhasználónál a válaszidők átlagosan 1.8 másodpercre nőttek
- Adatvesztés nem történt
- Az automatikus skálázás megfelelően működött, újabb konténerek indultak magas terhelés esetén

**Megjegyzések:**  
A backend rendszerek skálázhatósága biztosított, a jelenlegi technológiai stack segítségével a rendszer képes kezelni a várható terhelést.

#### TC-L-002: Weboldal terheléses teszt

**Tesztelő:** A teljes fejlesztői csapat (Nádassy Ilona, Markó Dániel, Stark Ernő)
**Tesztelés dátuma:** 2025.03.16. 03:15  
**Prioritás:** Magas  
**Státusz:** Sikeres

**Teszt célja:**  
A webshop oldal terhelhetőségének tesztelése nagy látogatószám mellett.

**Előfeltételek:**  
1. A weboldal elérhető a tesztkörnyezetben
2. A terheléses tesztelő eszközök beállítva

**Tesztlépések:**  
1. Szimulált látogatók számának fokozatos növelése (100, 500, 1000, 5000)
2. Különböző oldalbetöltések, keresések és kosárműveletek szimulálása
3. Oldalbetöltési idők és hibaarány mérése
4. CDN és gyorsítótár hatékonyságának vizsgálata

**Elvárt eredmény:**  
- A webshop oldala stabil teljesítményt nyújt nagy látogatószám mellett
- Az oldalak gyorsan töltenek be (< 3 másodperc)
- A rendszer megfelelően reagál nagyobb terhelésre
- A CDN és gyorsítótár hatékony működése

**Tényleges eredmény:**  
- Az oldal 5000 párhuzamos felhasználóig is stabil maradt
- Az oldalbetöltési idők 2.2-2.8 másodperc között maradtak még magas terhelés mellett is
- A CDN és gyorsítótár megfelelően működött, csökkentve a backend terhelését
- Nem fordult elő kiszolgálási hiba vagy túlterhelés

**Megjegyzések:**  
A terheléses tesztek alapján a rendszer várhatóan képes lesz kezelni a szezonális forgalmi csúcsokat is (pl. Black Friday, karácsonyi időszak).

### 2.4 Biztonsági tesztek

#### TC-S-001: Hitelesítés és jogosultságkezelés tesztelése

**Tesztelő:** Markó Dániel
**Tesztelés dátuma:** 2025.03.18. 10:00  
**Prioritás:** Kritikus  
**Státusz:** Sikeres

**Teszt célja:**  
Az alkalmazás hitelesítési és jogosultságkezelési rendszerének tesztelése.

**Előfeltételek:**  
1. Az alkalmazás elérhető a tesztkörnyezetben
2. Különböző jogosultságú felhasználói fiókok léteznek

**Tesztlépések:**  
1. Bejelentkezési mechanizmus tesztelése (helyes és helytelen adatokkal)
2. Jogosulatlan hozzáférési kísérletek végrehajtása
3. API-hívások hitelesítésének ellenőrzése
4. Session kezelés és timeout tesztelése
5. Jelszóvisszaállítási folyamat tesztelése

**Elvárt eredmény:**  
- Az alkalmazás megfelelően ellenőrzi a hitelesítést minden API-hívásnál
- Csak a jogosult felhasználók férnek hozzá a védett tartalmakhoz
- Az adatok titkosított csatornákon keresztül kerülnek továbbításra
- A jelszavak biztonságosan tárolódnak
- A session kezelés megfelelően működik

**Tényleges eredmény:**  
- Az alkalmazás minden API-hívásnál megfelelően ellenőrizte a hitelesítést
- A jogosulatlan hozzáférési kísérletek blokkolt állapottal és hibaüzenettel végződtek
- Minden adat HTTPS protokollon keresztül került továbbításra
- A jelszavak bcrypt algoritmussal, megfelelő salt értékkel kerültek tárolásra
- A session timeout megfelelően működött (30 perc inaktivitás után)

**Megjegyzések:**  
Nem történt jogosulatlan adat-hozzáférés a tesztek során.

## 3. ÖSSZEFOGLALÁS ÉS JAVASLATOK

### 3.1 Tesztelési eredmények összefoglalása

A webshop alkalmazás tesztelése során a következő eredményeket kaptuk:

1. **Funkcionális tesztek:** Az alkalmazás alapvető funkciói (kezdőlap, keresés, kosár, vásárlás) megfelelően működnek. A betöltési idők és válaszidők az elvárt határértékeken belül vannak.

2. **Felhasználói élmény tesztek:** Az alkalmazás navigációs rendszere és design-ja a legtöbb eszközön megfelelően működik. Egy kisebb hiba javítása szükséges a termékgaléria megjelenítésében bizonyos mobileszközökön.

3. **Terhelési tesztek:** Az alkalmazás API-ja és weboldalai megfelelően teljesítettek nagy terhelés mellett is. A skálázhatóság biztosított a jelenlegi architektúrában.

4. **Biztonsági tesztek:** Az alkalmazás hitelesítési és jogosultságkezelési rendszere megfelelően működik.

### 3.2 Azonosított problémák és javaslatok

1. **Samsung Galaxy A16 5G termékgaléria hiba (BUG-2025-032)**
   - **Prioritás:** Közepes
   - **Javaslat:** A CSS média lekérdezések finomhangolása szükséges a fekvő módban való megfelelő megjelenítéshez.

### 3.3 Következő lépések

1. Az azonosított hibák javítása a végső kiadás előtt
2. Regressziós tesztelés a javítások után
3. Teljesítmény-optimalizálási lehetőségek feltárása
4. Folyamatos biztonsági tesztelés bevezetése a fejlesztési ciklusba

### 3.4 Végső értékelés

A webshop alkalmazás a tesztelés alapján megfelelő minőségű, és a kritikus funkcionalitások megbízhatóan működnek. Az azonosított hibák kijavítása után az alkalmazás alkalmas a produkciós környezetben való üzemeltetésre.

**Tesztelési jelentés státusza:** Elfogadásra javasolt, a jelzett hibák javításával!

---