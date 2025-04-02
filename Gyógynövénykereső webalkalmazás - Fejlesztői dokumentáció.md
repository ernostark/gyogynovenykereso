# Gyógynövénykereső weboldal és webáruház

## Fejlesztői dokumentáció

### Felhasznált technológiák

#### Backend
- **Laravel API** (PHP keretrendszer) ^11.31
- **Laravel-sanctum** (Autentikációs kiegészítő csomag) ^4.0
- **MariaDB server** (Adatbázis kiszolgáló) v8.2.12

#### Készítéshez használt programok
- Visual Studio Code v1.98.2
- Insomnia v11.0.0
- XAMPP Control Panel v3.3.0
- phpMyAdmin v5.2.1

#### Frontend
- Angular keretrendszer ^19.1.0

#### Telepítés
- Frontend: npm install

- Backend: 
- composer install
- php artisan app:setup

Miután a setup közben létrehoztuk a Szuper Admint, a következő linken léphetünk be:

http://localhost:4200/admin/login

---

## Tartalom:

1. [Bevezető](#1-bevezető)
2. [Backend](#2-backend)
   - [Adatbázis szerkezete](#adatbázis-szerkezete-táblák-neve-és-mezőnevek)
   - [Végpontok](#végpontok-megnevezése-és-leírása)
3. [Frontend](#3-frontend)
   - [Az alkalmazás struktúrája és alapszerkezete](#az-alkalmazás-struktúrája-és-alapszerkezete)
   - [A fejléc és a keresési funkciók](#a-fejléc-és-a-keresési-funkciók)
   - [Kezdőlap és termékmegtekintés](#kezdőlap-és-termékmegtekintés)
   - [Kosárkezelés](#kosárkezelés)
   - [Rendelések kezelése](#rendelések-kezelése)
   - [Webshop főoldal és szűrési funkciók](#webshop-főoldal-és-szűrési-funkciók)
   - [Hitelesítési és adminisztrációs funkciók](#hitelesítési-és-adminisztrációs-funkciók)
   - [Kapcsolódó tartalmak kezelése](#kapcsolódó-tartalmak-kezelése)
   - [Komponensek és osztályváltozók listája](#komponensek-és-osztályváltozók-listája)

---

## 1. Bevezető

A Gyógynövénykereső egy innovatív online platform, amely a természetes alapú egészségmegőrzést és életmódot támogatja egy különleges keresőfunkcióval. Az oldal segítségével a felhasználók betegségek vagy gyógynövények alapján kereshetnek információkat, és részletes leírásokat találhatnak a különböző gyógynövények tulajdonságairól, hatásairól és felhasználási módjairól.

Az oldal különlegessége, hogy a felhasználók aktívan hozzájárulhatnak az információk bővítéséhez, saját bejegyzések, tapasztalatok vagy észrevételek megosztásával. Ez a közösségi jelleg segíti az adatbázis folyamatos fejlődését és a tudásbázis gyarapodását.

A keresőhöz szorosan kapcsolódik egy webáruház, amely a találatokhoz igazított, releváns étrend-kiegészítőket, gyógyhatású termékeket és egyéb természetes megoldásokat kínál. Ez a kombinált rendszer megkönnyíti a felhasználók számára a számukra megfelelő termékek azonosítását és beszerzését.

Az oldalon a vásárlási folyamat átlátható és felhasználóbarát. A termékek böngészésekor a vásárlók megtekinthetik az árakat, mennyiségeket, készletinformációkat és kedvezményeket. A kosárba helyezett termékek után azonnal látható a részösszeg, a szállítási költség és a végösszeg. Az oldal emellett tájékoztat arról, mennyit kell még vásárolni az ingyenes szállítás eléréséhez.

A rendelés során a felhasználók megadhatják számlázási és szállítási adataikat, valamint kiválaszthatják a szállítási módot (például postai kézbesítést vagy expressz szállítást) és a fizetési lehetőséget (kártyás fizetés, utánvét stb.).

A Gyógynövénykereső célja, hogy egy átfogó, intuitív és hatékony platformot biztosítson, amely egyszerre segíti az információkeresést, a közösségi együttműködést és a termékbeszerzést. Az oldal ösztönzi a természetes alapú megoldások felfedezését, és olyan vásárlási élményt kínál, amely egyesíti a tudás, a közösségi támogatás és a praktikum előnyeit.

### Az oldal készítői:

- **Backend**: Stark Ernő
- **Frontend**: Nádassy Ilona és Markó Dániel

---

## 2. Backend

Az oldal adatbázisszerkezete és végpontjai gondosan lettek kialakítva, hogy egyszerűvé és hatékonnyá tegyék a felhasználói interakciókat, valamint az adminisztrációs folyamatokat. Az adatbázis jól strukturált táblákból áll, amelyek egymással összekapcsolódnak, így biztosítva az összes szükséges adat tárolását és feldolgozását.

Az adatbázis alapját a `users` tábla adja, amely a regisztrált felhasználók adatait tárolja. Itt szerepel minden felhasználó neve, email címe, valamint, hogy rendelkezik-e admin jogosultsággal. A felhasználó címe (ország, irányítószám, város, utca és kiegészítő információk) szintén ebben a táblában található. Az adminok speciális jogosultságokat kapnak, amelyek lehetővé teszik számukra, hogy hozzáférjenek az oldal adminisztrációs funkcióihoz. A rendszer biztonságát az `email_verified_at` mező növeli, amely az email-cím hitelesítésének idejét tárolja, míg a jelszavak a `password` mezőben kerülnek tárolásra titkosítva.

A termékek kezelésére szolgál a `products` tábla, amely a termékek legfontosabb adatait tartalmazza. Ide tartozik a termék neve, leírása, ára, készletmennyisége és a kedvezményes ár is. A termékek kategorizálva kerülnek tárolásra a `product_categories` táblában, amely a kategóriák nevét és egyedi azonosítóját (slug) tartalmazza. Ez a szerkezet lehetővé teszi, hogy a termékeket logikusan rendszerezzük, és könnyen hozzáférhetővé tegyük a felhasználók számára.

A vásárlási élmény fokozása érdekében az oldal rendeléskezelési funkciókat is kínál, amelyeket az `orders` és az `order_items` táblák kezelnek. Az `orders` tábla tartalmazza a rendelési folyamat adatait, például a számlázási és szállítási információkat, valamint a rendelés státuszát. Az egyes rendelésekhez tartozó tételeket az `order_items` tábla tárolja, amely rögzíti a termékeket, azok mennyiségét és árát. Ezek az adatok az adminisztrátorok számára is könnyen elérhetőek, akik frissíthetik a rendelési státuszokat, vagy elemezhetik az eladási adatokat.

A blogbejegyzések kezelése szintén fontos részét képezi az oldal működésének. A `posts` tábla tárolja a blogbejegyzéseket, beleértve a bejegyzések címét, tartalmát, kivonatát (excerpt), kategóriáját és publikálási státuszát. A blogbejegyzésekhez tartozó kategóriák a `categories` táblában találhatók, míg a hozzászólások a `comments` táblában kerülnek mentésre, ahol azok státusza (elfogadott, függőben, spam) is nyomon követhető. A címkék kezelésére a `tags` tábla szolgál, amely lehetővé teszi a blogbejegyzések pontosabb csoportosítását.

A hírlevél-feliratkozás a `newsletter_subscribers` táblában kerül rögzítésre. Ez tartalmazza a feliratkozók email címét, aktív státuszát, valamint az előfizetés és leiratkozás időpontját. Ezen adatok segítségével a hírlevélkezelés egyszerűen és hatékonyan megvalósítható.

A rendszerhez tartozó API-végpontok az adatokat JSON formátumban kezelik, amely biztosítja az adatcsere gyorsaságát és egyszerűségét. Például a `POST /register` végpont lehetővé teszi a felhasználók regisztrációját olyan adatokkal, mint a név, email cím és jelszó. A `POST /login` végponttal a felhasználók bejelentkezhetnek, és egy érvényes tokennel biztonságosan hozzáférhetnek az oldalon elérhető funkciókhoz. Az adminisztrátorok számára a `POST /admin/posts` végpont lehetővé teszi új blogbejegyzések létrehozását, míg a `DELETE /admin/posts/{id}` végponttal törölhetik azokat.

A rendeléskezelési végpontok szintén fontos szerepet játszanak az API rendszerében. A `POST /checkout` végponttal a vásárlók leadhatják rendeléseiket, megadva a számlázási és szállítási információkat, valamint a kosár tartalmát. A rendelési adatokat az adminisztrátorok a `GET /admin/orders` végponton keresztül érhetik el, ahol szűrési lehetőségek állnak rendelkezésükre.

Összességében az oldal strukturált adatbázis-szerkezete és jól definiált API-végpontjai biztosítják a felhasználók és az adminisztrátorok számára szükséges funkcionalitásokat. A rendszer rugalmas, skálázható és felhasználóbarát, amely lehetővé teszi az egyszerű navigációt és a hatékony adminisztrációt. A biztonságos hitelesítési folyamatok és a részletes adatkezelési lehetőségek hozzájárulnak az oldal magas színvonalú működéséhez.

### Adatbázis szerkezete, táblák neve és mezőnevek

1. **users** - Felhasználói adatok tárolása
   - id: Azonosító
   - name: Név
   - email: Email cím
   - email_verified_at: Email megerősítés ideje
   - password: Jelszó
   - country, postal_code, city, street, address_line_2: Felhasználó címe
   - is_admin: Admin jog státusz
   - remember_token: Emlékezési token
   - created_at, updated_at: Létrehozási és módosítási idő

2. **password_reset_tokens** - Jelszó visszaállító tokenek tárolása
   - email: Azonosító
   - token: Visszaállító token
   - created_at: Token létrehozási idő

3. **sessions** - Felhasználói munkamenet adatok tárolása
   - id: Munkamenet azonosító
   - user_id: Kapcsolat a felhasználóhoz
   - ip_address: IP cím
   - user_agent: Felhasználói ügynök információ
   - payload: Munkamenet adatok
   - last_activity: Utolsó aktivitás

4. **cache** - Gyorsítótár adatok tárolása
   - key: Kulcs
   - value: Érték
   - expiration: Lejárati idő

5. **personal_access_tokens** - Hozzáférési tokenek tárolása
   - id: Azonosító
   - tokenable: Kapcsolat a token tulajdonoshoz
   - name: Token neve
   - token: Token értéke
   - abilities: Engedélyek
   - last_used_at: Utolsó használat
   - expires_at: Lejárati idő
   - created_at, updated_at: Létrehozási és módosítási idő

6. **product_categories** - Termékkategóriák tárolása
   - id: Azonosító
   - name: Kategória neve
   - slug: Egyedi URL azonosító
   - description: Kategória leírása
   - created_at, updated_at: Létrehozási és módosítási idő

7. **products** - Termékek részletei
   - id: Azonosító
   - category_id: Kapcsolat kategóriához
   - name: Termék neve
   - slug: Egyedi URL azonosító
   - latin_name: Latin név
   - description: Leírás
   - usage: Használat módja
   - price: Ár
   - discount_price: Kedvezményes ár
   - stock_quantity: Készlet mennyisége
   - unit: Egység
   - is_available: Elérhetőség
   - is_featured: Kiemeltség
   - view_count: Megtekintésszám
   - sale_count: Eladásszám
   - created_at, updated_at: Létrehozási és módosítási idő

8. **admins** - Adminok adatai
   - id: Azonosító
   - name: Név
   - email: Email cím
   - password: Jelszó
   - created_at, updated_at: Létrehozási és módosítási idő

9. **categories** - Blogbejegyzések kategóriáinak tárolása
   - id: Azonosító
   - name: Kategória neve
   - slug: Egyedi URL azonosító
   - description: Leírás
   - parent_id: Szülő kategória azonosító
   - created_at, updated_at: Létrehozási és módosítási idő

10. **posts** - Blogbejegyzések tárolása
    - id: Azonosító
    - title: Bejegyzés címe
    - slug: Egyedi URL azonosító
    - content: Tartalom
    - image_path: Kép útvonala
    - excerpt: Kivonat
    - diseases: Kapcsolódó betegségek
    - featured: Kiemeltség
    - author_id: Kapcsolat szerzőhöz
    - author_type: Szerző típusa (user/admin)
    - category_id: Kapcsolat kategóriához
    - published_at: Publikálás ideje
    - status: Státusz (draft/published/archived)
    - created_at, updated_at: Létrehozási és módosítási idő

11. **comments** - Hozzászólások tárolása
    - id: Azonosító
    - post_id: Kapcsolat bejegyzéshez
    - user_id: Kapcsolat felhasználóhoz
    - content: Tartalom
    - status: Státusz (approved/pending/spam)
    - created_at, updated_at: Létrehozási és módosítási idő

12. **order_items**, **order_status_histories** és **newsletter_subscribers** - Ezek további rendelési tételek, státusztörténetek és hírlevél előfizetők kezelésére szolgálnak.

### Végpontok megnevezése és leírása

1. **POST /register** - Felhasználók regisztrációjához: {name: '...', email: '...', password: '...'}
2. **POST /login** - Bejelentkezés: {email: '...', password: '...'}
3. **GET /posts/latest** - Legújabb blogbejegyzések: {id: 1, title: '...', excerpt: '...', published_at: '...'}
4. **GET /products/{id}** - Termék részletei: {id: 1, name: '...', price: '...', stock_quantity: '...'}
5. **POST /checkout** - Rendelés leadása: {billing_name: '...', shipping_name: '...', payment_method_id: 1}

| Végpont | Metódus | Kapcsolat típusa | Leírás |
|---------|---------|-----------------|--------|
| /register | POST | Nyilvános | Felhasználó regisztrálása |
| /login | POST | Nyilvános | Felhasználó bejelentkezése |
| /logout | POST | Autentikált (auth:sanctum) | Felhasználó kijelentkezése |
| /profile | PUT | Autentikált (auth:sanctum) | Felhasználói profil frissítése |
| /getprofile | GET | Autentikált (auth:sanctum) | Felhasználói profil lekérdezése |
| /orders | GET | Autentikált (auth:sanctum) | Felhasználói rendelések listázása |
| /orders/{id} | GET | Autentikált (auth:sanctum) | Egy adott rendelés részleteinek lekérése |
| /admin/login | POST | Nyilvános | Admin bejelentkezés |
| /admin/logout | POST | Autentikált (auth:sanctum) | Admin kijelentkezés |
| /admin/posts | GET | Adminisztrátor (auth:sanctum) | Blogbejegyzések listázása |
| /admin/posts/{id} | GET | Adminisztrátor (auth:sanctum) | Egy adott blogbejegyzés részleteinek lekérése |
| /admin/posts | POST | Adminisztrátor (auth:sanctum) | Új blogbejegyzés létrehozása |
| /admin/posts/{id} | POST | Adminisztrátor (auth:sanctum) | Blogbejegyzés frissítése |
| /admin/posts/{id} | DELETE | Adminisztrátor (auth:sanctum) | Blogbejegyzés törlése |
| /admin/categories | GET | Adminisztrátor (auth:sanctum) | Blog kategóriák listázása |
| /admin/categories | POST | Adminisztrátor (auth:sanctum) | Új blog kategória létrehozása |
| /admin/categories/{id} | DELETE | Adminisztrátor (auth:sanctum) | Blog kategória törlése |
| /admin/product-categories | POST | Adminisztrátor (auth:sanctum) | Új termékkategória létrehozása |
| /admin/product-categories/{id} | PUT | Adminisztrátor (auth:sanctum) | Termékkategória frissítése |
| /admin/product-categories/{id} | DELETE | Adminisztrátor (auth:sanctum) | Termékkategória törlése |
| /admin/products | POST | Adminisztrátor (auth:sanctum) | Új termék létrehozása |
| /admin/products/{id} | POST | Adminisztrátor (auth:sanctum) | Termék frissítése |
| /admin/products/{id} | DELETE | Adminisztrátor (auth:sanctum) | Termék törlése |
| /admin/messages | GET | Adminisztrátor (auth:sanctum) | Üzenetek listázása |
| /admin/messages/{id}/read | PUT | Adminisztrátor (auth:sanctum) | Üzenet olvasottként jelölése |
| /admin/messages/{id} | DELETE | Adminisztrátor (auth:sanctum) | Üzenet törlése |
| /admin/shipping-methods | GET | Adminisztrátor (auth:sanctum) | Szállítási módok listázása |
| /admin/shipping-methods | POST | Adminisztrátor (auth:sanctum) | Új szállítási mód hozzáadása |
| /admin/shipping-methods/{id} | PUT | Adminisztrátor (auth:sanctum) | Szállítási mód frissítése |
| /admin/shipping-methods/{id} | DELETE | Adminisztrátor (auth:sanctum) | Szállítási mód törlése |
| /admin/shipping-methods/{id}/toggle-active | PUT | Adminisztrátor (auth:sanctum) | Szállítási mód aktív státuszának váltása |
| /admin/payment-methods | GET | Adminisztrátor (auth:sanctum) | Fizetési módok listázása |
| /admin/payment-methods | POST | Adminisztrátor (auth:sanctum) | Új fizetési mód hozzáadása |
| /admin/payment-methods/{id} | PUT | Adminisztrátor (auth:sanctum) | Fizetési mód frissítése |
| /admin/payment-methods/{id} | DELETE | Adminisztrátor (auth:sanctum) | Fizetési mód törlése |
| /admin/payment-methods/{id}/toggle-active | PUT | Adminisztrátor (auth:sanctum) | Fizetési mód aktív státuszának váltása |
| /admin/orders | GET | Adminisztrátor (auth:sanctum) | Admin rendeléslista megtekintése |
| /admin/orders/{id} | GET | Adminisztrátor (auth:sanctum) | Egy adott rendelés megtekintése adminisztrátor által |
| /admin/orders/{id}/status | POST | Adminisztrátor (auth:sanctum) | Rendelési státusz frissítése |
| /admin/order-statuses | GET | Adminisztrátor (auth:sanctum) | Rendelési státuszok listázása |
| /posts/featured | GET | Nyilvános | Kiemelt blogbejegyzések lekérése |
| /posts/latest | GET | Nyilvános | Legújabb blogbejegyzések lekérése |
| /products | GET | Nyilvános | Termékek listázása |
| /products/{id} | GET | Nyilvános | Egy termék részleteinek lekérése |

---

## 3. Frontend

A weboldal egy modern, webes felületre készült alkalmazás, amely teljes mértékben reszponzív kialakítással rendelkezik. Ennek köszönhetően optimalizáltan működik különböző eszközökön, beleértve az asztali számítógépeket, táblagépeket és okostelefonokat, biztosítva a kiváló felhasználói élményt minden platformon.

### Az alkalmazás struktúrája és alapszerkezete

A `frontend/src/app/app.component.ts` a teljes alkalmazás gyökérkomponense, amely az oldal szerkezetét definiálja. Ez a komponens tartalmazza a fejlécet, amely az oldal tetején helyezkedik el, valamint a láblécet, ami az oldal alján található. Emellett a `RouterOutlet` nevű Angular elem használatával az oldalak tartalmát az útvonalak alapján jeleníti meg. A `title` változó az alkalmazás neveként szolgál, jelen esetben "gyogynovenykereso". Ennek a komponensnek az a feladata, hogy keretet adjon az alkalmazás számára, miközben biztosítja a fejléc és lábléc konzisztens megjelenését az összes oldalon.

A navigációs útvonalak konfigurációját a `frontend/src/app/app.routes.ts` állítja be. Ez határozza meg, hogy az egyes URL-ekhez milyen komponensek tartoznak, például a `/home` útvonal a kezdőlapot, míg a `/cart` a kosár oldalt jeleníti meg. A különböző oldalak navigációs logikáját az Angular által biztosított `Routes` struktúrában definiáljuk.

### A fejléc és a keresési funkciók

A fejléc a `frontend/src/app/layout/header/header/header.component.ts`-ben található, és az oldal tetején helyezkedik el. Ez felel az oldal navigációs elemének megjelenítéséért, mint például a keresőmező vagy a kosár ikon. Bár maga a `HeaderComponent` egyszerű struktúrával rendelkezik, kulcsszerepet játszik az oldal navigációs élményének javításában.

A keresőfunkciókat a `SearchComponent` valósítja meg, amely lehetővé teszi, hogy a felhasználók kulcsszavak alapján keressenek a termékek vagy cikkek között. Ennek a komponensnek az egyik fő funkciója, hogy az űrlapban megadott keresési adatokat feldolgozza, majd azokat elküldi az API-nak. A `searchResults` változó az API-ból visszakapott keresési eredményeket tárolja. A keresési eredmények rendezhetők és szűrhetők, ami kényelmesebbé teszi a felhasználók számára a releváns termékek megtalálását.

### Kezdőlap és termékmegtekintés

Az alkalmazás kezdőlapját a `HomeComponent` valósítja meg. Ez a komponens kiemelt szerepet játszik a látogatók első benyomásának kialakításában. A kiemelt és legújabb blogbejegyzéseket tölti be az API-n keresztül, és azokat vizuálisan vonzó módon jeleníti meg. A `featuredPosts` és `latestPosts` változók tárolják a kiemelt és legújabb tartalmakat, míg a `loadFeaturedPosts` és `loadLatestPosts` metódusok az API-ból történő adatlekérést kezelik.

A termék részleteinek megjelenítéséért a `ProductDetailComponent` felel. Ez a komponens a felhasználók számára részletes információkat nyújt egy adott termékről, beleértve annak árát, kedvezményét, készletinformációit és képeit. A `quantity` változóval a felhasználók beállíthatják, hogy hány darabot szeretnének a kosárba helyezni. Az `addToCart` metódus a termék kosárba helyezésének logikáját kezeli, ami biztosítja az adatok szinkronizálását a backenddel.

### Kosárkezelés

A kosár oldal megvalósítása a `CartPageComponent` segítségével történik. Ez a komponens felelős a kosár tartalmának megjelenítéséért és kezeléséért. A `cartItems` változó a kosárban lévő termékeket tartalmazza, míg a `subtotal` és `totalAmount` változók számítják ki a kosár alösszegét és végösszegét, beleértve a szállítási díjakat. A `clearCart` metódus lehetőséget nyújt a kosár teljes tartalmának törlésére, míg az `updateQuantity` lehetővé teszi a termékek mennyiségének módosítását.

A `CartService` egy szolgáltatás, amely a kosár funkcióit központosítja. Ez biztosítja az adatok API-val történő szinkronizálását, például a termékek hozzáadását, eltávolítását vagy frissítését. A `cart$` változó segítségével az alkalmazás más részei figyelhetik a kosár tartalmának változásait.

### Rendelések kezelése

A rendelésekkel kapcsolatos funkcionalitás két komponens segítségével valósul meg: az `OrdersComponent` és az `OrderDetailComponent`. Az `OrdersComponent` listázza a felhasználó összes rendelését, megjelenítve azok státuszát és összegét. Az `OrderDetailComponent` egy konkrét rendelés részleteit mutatja be, beleértve a szállítási és számlázási adatokat, valamint a rendelt tételeket.

Mindkét komponens az API-val dolgozik, és a felhasználói tokent használja az adatok hiteles lekéréséhez. A `loadOrders` és `loadOrder` metódusok biztosítják a megfelelő adatok betöltését, míg a státuszkezelő metódusok, például az `isStatusCompleted`, vizuális visszajelzést adnak a felhasználónak a rendelés állapotáról.

### Webshop főoldal és szűrési funkciók

A webshop főoldalát a `WebshopHomepage` valósítja meg. Ez a komponens felelős a termékek listázásáért, szűréséért és kategorizálásáért. A `products` változó a termékek teljes listáját tárolja, míg a `filteredProducts` a szűrt eredményeket. Az `applyFilters` metódus lehetővé teszi a felhasználók számára, hogy kategóriák, árak vagy keresési kulcsszavak alapján szűrjék a termékeket.

### Hitelesítési és adminisztrációs funkciók

Az `AuthService` a felhasználói hitelesítést kezeli. Ez a szolgáltatás felel a bejelentkezési és kijelentkezési folyamatokért, valamint a felhasználói adatok API-ból történő lekéréséért. A `login` metódus a felhasználói adatok ellenőrzésére szolgál, míg a `logout` eltávolítja az autentikációs tokent, ezzel megszüntetve a bejelentkezést.

### Kapcsolódó tartalmak kezelése

A `RelatedContentService` segítségével a rendszer képes kapcsolódó termékeket vagy blogbejegyzéseket ajánlani. Ez a szolgáltatás például a felhasználók által megtekintett cikkek alapján keres hasonló termékeket, vagy fordítva. A `filterRelatedProducts` és `filterRelatedPosts` metódusok biztosítják a releváns találatokat.

### Komponensek és osztályváltozók listája

**AppComponent**
- title: Az alkalmazás címe, például „gyogynovenykereso".

**HeaderComponent**
- Nincsenek explicit osztályváltozók, a fejléc megjelenítéséért felelős.

**SearchComponent**
- searchForm: A keresési űrlap mezőit és adatstruktúráját tartalmazza.
- searchResults: Az API-ból kapott keresési eredményeket tárolja.
- searchQuery: A keresési kifejezés, amelyet a felhasználó megadott.

**HomeComponent**
- featuredPosts: A kiemelt blogbejegyzések listája.
- latestPosts: A legújabb blogbejegyzések listája.
- loading: A betöltési állapotot jelzi.
- error: A hibaüzeneteket tárolja, ha a betöltés sikertelen.

**ProductDetailComponent**
- product: Az aktuális termék részletes adatai.
- loading: Jelzi, hogy a termék adatai töltődnek-e.
- error: Hibaüzenetet tárol, ha a betöltés sikertelen.
- quantity: A kosárba helyezendő termék mennyisége.
- toastMessage: Visszajelző üzenet szövegét tárolja.

**CartDropdownComponent**
- isOpen: Jelzi, hogy a lenyíló kosármenü nyitott-e.
- cartItems: A kosárban lévő termékek listája.
- totalItems: Az összes kosárban lévő termék darabszáma.
- subtotal: A kosár alösszege.

**CartIconComponent**
- totalItems: A kosár ikonon megjelenő összes termék darabszáma.

**CartPageComponent**
- cartItems: A kosárban lévő termékek listája.
- subtotal: Az alösszeg értéke.
- shippingCost: Szállítási költség.
- totalAmount: A végösszeg.
- loading: A betöltési állapotot jelzi.
- error: Hibaüzenetet tárol, ha a kosár betöltése sikertelen.
- freeShippingThreshold: Az ingyenes szállítás elérésének küszöbértéke.

**OrdersComponent**
- orders: A felhasználó korábbi rendeléseinek listája.
- isLoading: A betöltési állapotot jelzi.
- error: Hibaüzenetek tárolására használatos.

**OrderDetailComponent**
- order: Az aktuális rendelés részletei.
- isLoading: Betöltési állapot.
- error: Hibaüzenetet tárol.
- orderStatuses: Az összes rendelési státusz listája.
- standardStatuses: Alapértelmezett státuszok, ha az API nem érhető el.

**WebshopHomepage**
- products: Az API-ból lekért termékek teljes listája.
- categories: Az API-ból lekért kategóriák listája.
- filteredProducts: Szűrt terméklista a felhasználó keresése vagy kategóriaválasztása alapján.
- selectedCategory: Az aktuálisan kiválasztott kategória.
- searchTerm: A keresési kulcsszó.
- sortOption: A termékek rendezési módja (pl. legújabb, ár szerint).
- toastMessage: Visszajelző üzenet szövege.
- quantity: Kosárba helyezni kívánt mennyiség.

**CheckoutComponent**
- checkoutForm: Az űrlap, amely tartalmazza a rendelési adatokat (számlázási, szállítási adatok).
- cartItems: A kosár tartalma a rendelés idején.
- subtotal: A kosár alösszege.
- shippingCost: Szállítási költség.
- total: A teljes rendelési összeg.
- loading: Jelzi, hogy a rendelés feldolgozása folyamatban van.
- shippingMethods: Az elérhető szállítási módok listája.
- paymentMethods: Az elérhető fizetési módok listája.
- orderSuccess: Jelzi, hogy a rendelés sikeres volt-e.
- orderNumber: A rendelés azonosítószáma.

**Komponensek célja és funkciója**

- **AppComponent**: Az alkalmazás alapstruktúrájának megjelenítése.
- **SearchComponent**: Keresési funkció biztosítása.
- **ProductDetailComponent**: Egy konkrét termék részleteinek megjelenítése.
- **CartPageComponent**: A kosár tartalmának és műveleteinek kezelése.
- **OrdersComponent**: A felhasználói rendelések listázása.
- **CheckoutComponent**: A vásárlási folyamat végrehajtása.

---

Készült: 2025.03.25.