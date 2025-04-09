# GYÓGYNÖVÉNYKERESŐ WEBALKALMAZÁS TESZTELÉSI DOKUMENTÁCIÓ
**Projekt neve:** Gyógynövénykereső Webalkalmazás
**Dokumentum verziószáma:** 1.1
**Tesztelési időszak:** 2025. március 1-20.
**Készítette:** Markó Dániel

## 1. TESZTÖSSZEFOGLALÓ

Az alkalmazás tesztelése során alapos vizsgálatokat végeztünk, lefedve a funkcionális, felhasználói élmény, és biztonsági szempontokat. A tesztelés célja az volt, hogy biztosítsuk a webshop alkalmazás stabil, felhasználóbarát és biztonságos működését.

### 1.1 Tesztelési módszerek

* **Manuális tesztelés:** A felhasználói felület és funkciók manuális ellenőrzése
* **Biztonsági tesztelés:** Az alkalmazás védelmi mechanizmusainak ellenőrzése

### 1.2 Tesztelési környezet

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

**Eredmény:**  
1. A kezdőlap sikeresen betöltődött minden tesztelt eszközön
2. A kiemelt bejegyzések helyesen megjelentek, az adatok relevánsak és helyesek voltak
3. A legújabb bejegyzések helyesen megjelentek, az adatok relevánsak és helyesek voltak
4. A betöltési idő átlagosan 1.3 másodperc volt 10 próbálkozás során, ami a 2 másodperces határérték alatt maradt

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

**Eredmény:**  
1. A keresőmező minden tesztelt eszközön elérhető és használható volt
2. A különböző keresőkifejezések beírása problémamentesen működött
3. A keresés indítása sikeresen működött minden esetben
4. A keresés releváns találatokat adott a létező kulcsszavakra, nemlétező termékekre megfelelően üres találati listát és "Nincs találat" üzenetet kaptunk, a keresés átlagosan 0.8 másodpercen belül eredményt adott

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

**Eredmény:**  
1. A termékek sikeresen hozzáadhatók voltak a kosárhoz
2. A mennyiség növelése 1-ről 3-ra sikeresen működött, a végösszeg megfelelően frissült
3. A mennyiség csökkentése 3-ról 2-re sikeresen működött, a végösszeg megfelelően frissült
4. A termék eltávolítása frissítette a kosár tartalmát, a termék sikeresen eltűnt a kosárból
5. Több különböző termék kosárba helyezése sikeresen működött, mindegyik megjelent a kosárban
6. A kosár adatai minden művelet után szinkronban voltak az API-val, a cartItems megfelelően frissült

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

**Eredmény:**  
1. A pénztárhoz való továbblépés gomb megfelelően működött, a pénztár oldal betöltődött
2. A checkoutForm hibátlanul működött, megfelelően validálta az adatokat
3. A fizetési adatok megadása sikeresen működött minden tesztelt fizetési móddal
4. A rendelés leadása sikeres volt, a rendelési szám generálódott (pl. #ORD-2025-03542)

**Megjegyzések:**  
A vásárlási folyamat lépései között a navigáció intuitív volt, a folyamat minden tesztelt fizetési módszerrel sikeresen lezajlott.

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

**Eredmény:**  
1. A navigálás minden főbb oldalra sikeresen működött minden tesztelt eszközön
2. A menüpontok és linkek minden esetben a megfelelő oldalakra vezettek
3. Az oldalbetöltési idők átlagosan 1.8 másodperc alatt maradtak, ami az elvárt 3 másodperces határérték alatt van
4. A navigáció minden tesztelt képernyőméreten (desktop, tablet, mobil) megfelelően működött

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

**Eredmény:**  
1. Az alkalmazás sikeresen betöltődött minden tesztelt eszközön (asztali gép, tablet, mobil)
2. Az oldalak elrendezése a legtöbb eszközön megfelelő volt, de Samsung Galaxy A16 5G készüléken a termékgaléria nem megfelelően jelent meg fekvő módban
3. A tipográfia és színek kellemes vizuális élményt nyújtottak minden eszközön
4. A gombok, ikonok és interaktív elemek egységesek és jól használhatók voltak minden eszközön

**Megjegyzések:**  
A termékgaléria hibája a Samsung Galaxy A16 5G készüléken fekvő módban javításra szorul. A hiba csak ezen az egy eszközön jelentkezett. (Bug ID: BUG-2025-032)

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

**Eredmény:**  
1. A bejelentkezés megfelelően működött helyes adatokkal, helytelen adatokkal pedig megfelelő hibaüzenetet adott
2. A jogosulatlan hozzáférési kísérletek blokkolt állapottal és hibaüzenettel végződtek
3. Az alkalmazás minden API-hívásnál megfelelően ellenőrizte a hitelesítést
4. A session timeout megfelelően működött (30 perc inaktivitás után), a rendszer biztonságosan kezelte a session-öket
5. A jelszóvisszaállítási folyamat megfelelően működött, biztonságos módon lehetett új jelszót beállítani

**Megjegyzések:**  
Nem történt jogosulatlan adat-hozzáférés a tesztek során. A jelszavak bcrypt algoritmussal, megfelelő salt értékkel kerültek tárolásra. Minden adat HTTPS protokollon keresztül került továbbításra.

## 3. ÖSSZEFOGLALÁS ÉS JAVASLATOK

### 3.1 Tesztelési eredmények összefoglalása

A webshop alkalmazás tesztelése során a következő eredményeket kaptuk:

1. **Funkcionális tesztek:** Az alkalmazás alapvető funkciói (kezdőlap, keresés, kosár, vásárlás) megfelelően működnek. A betöltési idők és válaszidők az elvárt határértékeken belül vannak.

2. **Felhasználói élmény tesztek:** Az alkalmazás navigációs rendszere és design-ja a legtöbb eszközön megfelelően működik. Egy kisebb hiba javítása szükséges a termékgaléria megjelenítésében bizonyos mobileszközökön.

3. **Biztonsági tesztek:** Az alkalmazás hitelesítési és jogosultságkezelési rendszere megfelelően működik.

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