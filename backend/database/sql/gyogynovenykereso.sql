-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 03. 16:24
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `gyogynovenykereso`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `session_id`, `status`, `expires_at`, `created_at`, `updated_at`) VALUES
(56, NULL, 'fBtV4e35Wj1ivSlyUeRa1ZndtLxPF8QJkQfZsKjE', 'active', NULL, '2025-04-02 14:42:22', '2025-04-02 14:42:22'),
(57, NULL, 'wR4onoTvvfBnIeECs1Wv8ouh5lswjLTYFFfIfTZK', 'active', NULL, '2025-04-02 14:42:22', '2025-04-02 14:42:22');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Gyógynövények és hatásaik', 'gyogynovenyek-es-hatasaik', NULL, NULL, '2025-04-02 16:59:19', '2025-04-02 16:59:19'),
(2, 'Szezonális gyűjtés és termesztés', 'szezonalis-gyujtes-es-termesztes', NULL, NULL, '2025-04-02 16:59:30', '2025-04-02 16:59:30'),
(3, 'Gyógyteák és receptek', 'gyogyteak-es-receptek', NULL, NULL, '2025-04-02 16:59:42', '2025-04-02 16:59:42'),
(4, 'Egészséges életmód', 'egeszseges-eletmod', NULL, NULL, '2025-04-02 16:59:54', '2025-04-02 16:59:54'),
(5, 'Népi gyógyászat', 'nepi-gyogyaszat', NULL, NULL, '2025-04-02 17:00:06', '2025-04-02 17:00:06'),
(6, 'Betegségek természetes kezelése', 'betegsegek-termeszetes-kezelese', NULL, NULL, '2025-04-02 17:00:19', '2025-04-02 17:00:19');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `status` enum('approved','pending','spam') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `media`
--

CREATE TABLE `media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(4, '2025_01_20_195018_create_product_categories_table', 1),
(5, '2025_01_20_195019_create_products_table', 1),
(6, '2025_01_20_195020_create_product_images_table', 1),
(7, '2025_01_27_125556_create_admins_table', 1),
(8, '2025_01_27_131600_create_categories_table', 1),
(9, '2025_01_27_131726_create_posts_table', 1),
(10, '2025_01_27_133230_create_tags_table', 1),
(11, '2025_01_27_133250_create_post_tag_table', 1),
(12, '2025_01_27_133303_create_comments_table', 1),
(13, '2025_01_27_133320_create_media_table', 1),
(14, '2025_02_08_122540_create_contacts_table', 1),
(15, '2025_02_27_195214_create_order_statuses_table', 1),
(16, '2025_02_27_195347_create_shipping_methods_table', 1),
(17, '2025_02_27_195428_create_payment_methods_table', 1),
(18, '2025_02_27_195504_create_orders_table', 1),
(19, '2025_02_27_195911_create_order_items_table', 1),
(20, '2025_02_27_200027_create_order_status_histories_table', 1),
(21, '2025_03_07_172845_create_newsletter_subscribers_table', 1),
(22, '2025_03_16_124725_create_carts_table', 1),
(23, '2025_03_16_124813_create_cart_items_table', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `token` varchar(255) DEFAULT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unsubscribed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `shipping_method_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method_id` bigint(20) UNSIGNED NOT NULL,
  `billing_name` varchar(255) NOT NULL,
  `billing_email` varchar(255) NOT NULL,
  `billing_phone` varchar(255) DEFAULT NULL,
  `billing_country` varchar(255) NOT NULL DEFAULT 'Magyarország',
  `billing_postal_code` varchar(255) NOT NULL,
  `billing_city` varchar(255) NOT NULL,
  `billing_street` varchar(255) NOT NULL,
  `billing_address_line_2` varchar(255) DEFAULT NULL,
  `same_as_billing` tinyint(1) NOT NULL DEFAULT 1,
  `shipping_name` varchar(255) DEFAULT NULL,
  `shipping_phone` varchar(255) DEFAULT NULL,
  `shipping_country` varchar(255) DEFAULT NULL,
  `shipping_postal_code` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `shipping_street` varchar(255) DEFAULT NULL,
  `shipping_address_line_2` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_latin_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(255) NOT NULL DEFAULT 'g',
  `unit_price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `order_statuses`
--

CREATE TABLE `order_statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `order_statuses`
--

INSERT INTO `order_statuses` (`id`, `name`, `color`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Új rendelés', '#3490dc', NULL, 1, '2025-04-02 09:52:41', '2025-04-02 09:52:41'),
(2, 'Feldolgozás alatt', '#f6993f', NULL, 2, '2025-04-02 09:52:41', '2025-04-02 09:52:41'),
(3, 'Kiszállítás alatt', '#38c172', NULL, 3, '2025-04-02 09:52:41', '2025-04-02 09:52:41'),
(4, 'Teljesítve', '#4dc0b5', NULL, 4, '2025-04-02 09:52:41', '2025-04-02 09:52:41'),
(5, 'Törölve', '#e3342f', NULL, 5, '2025-04-02 09:52:41', '2025-04-02 09:52:41');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `order_status_histories`
--

CREATE TABLE `order_status_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Utánvét', 'Csomagját átvételkor fizetheti készpénzzel vagy kártyával.', 1, 1, '2025-04-02 19:37:43', '2025-04-02 19:37:43'),
(2, 'Átutalás', 'Banki átutalással fizetheti rendelését.', 1, 2, '2025-04-02 19:40:05', '2025-04-02 19:40:05');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `diseases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`diseases`)),
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `author_id` bigint(20) UNSIGNED NOT NULL,
  `author_type` enum('user','admin') NOT NULL DEFAULT 'user',
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `content`, `image_path`, `excerpt`, `diseases`, `featured`, `author_id`, `author_type`, `category_id`, `published_at`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'A kamilla sokoldalú gyógyhatása', 'a-kamilla-sokoldalu-gyogyhatasa', 'A kamilla az egyik legismertebb és legszélesebb körben használt gyógynövény, amit már az ókori egyiptomiak és görögök is alkalmaztak. Jellegzetes, kellemes illatú virágzata tartalmazza azokat az értékes hatóanyagokat, amelyek gyulladáscsökkentő, görcsoldó és nyugtató hatásáról ismertek. Teaként fogyasztva enyhíti a gyomor- és bélrendszeri panaszokat, segít megszüntetni az emésztési zavarokat és a puffadást. Külsőleg alkalmazva borogatásként vagy fürdőként kiváló bőrproblémákra, különösen érzékeny vagy irritált bőr esetén. A kamillatea rendszeres fogyasztása csökkentheti a stressz tüneteit és segít az elalvásban. Gyulladáscsökkentő hatása miatt torokfájás esetén gargarizálásra is kiválóan alkalmas. Érdemes megemlíteni, hogy a kamilla a parlagfű-allergiával rendelkezőknél keresztallergiát okozhat, ezért ők óvatosan fogyasszák.', 'images/mlKL8oSGceOpgEtaegzRCmYeMccszPYP2C6kcOMR.jpg', 'A kamilla az egyik legismertebb és legszélesebb körben használt gyógynövény, amit már az ókori egyip...', '[\"gyomorhurut\",\"b\\u00e9lgyullad\\u00e1s\",\"\\u00e1lmatlans\\u00e1g\",\"szorong\\u00e1s\",\"ekc\\u00e9ma\",\"torokgyullad\\u00e1s\",\"szemgyullad\\u00e1s\",\"fog\\u00ednygyullad\\u00e1s\"]', 0, 1, 'admin', 1, '2025-04-02 17:11:43', 'published', '2025-04-02 17:11:43', '2025-04-02 17:11:43', NULL),
(2, 'Levendula - nem csak illatszer', 'levendula-nem-csak-illatszer', 'A levendula lila virágai nem csupán csodálatos illatukról, hanem sokrétű gyógyhatásukról is ismertek. Ez a mediterrán eredetű növény évszázadok óta kiemelt szerepet tölt be a természetes gyógyászatban. Fő hatóanyagai az illóolajban található linalool és linalil-acetát, amelyek nyugtató, feszültségoldó hatással rendelkeznek.\r\n\r\nA levendula tea fogyasztása segít enyhíteni a fejfájást, migrént és az alvászavarokat. Párnába töltött szárított virágai javítják az alvás minőségét és csökkentik az éjszakai felébredések számát. Illóolaját párologtatva vagy fürdővízbe cseppentve enyhíti a stressz tüneteit és javítja a közérzetet. Külsőleg alkalmazva a levendulaolaj segíti a kisebb sebek, égési sérülések gyógyulását és enyhíti a rovarcsípések okozta kellemetlenségeket. Kevesen tudják, de emésztési panaszokra is hatásos lehet, különösen az ideges eredetű gyomorpanaszok esetén.', 'images/qo1kvRxaBFGbQcA0nEUm6VMVlzAS3OFRIDayjeXw.png', 'A levendula lila virágai nem csupán csodálatos illatukról, hanem sokrétű gyógyhatásukról is ismertek...', '[\"migr\\u00e9n\",\"\\u00e1lmatlans\\u00e1g\",\"szorong\\u00e1s\",\"stressz\",\"b\\u0151rirrit\\u00e1ci\\u00f3\",\"rovarcs\\u00edp\\u00e9s\",\"\\u00e9g\\u00e9si s\\u00e9r\\u00fcl\\u00e9s\",\"em\\u00e9szt\\u00e9si zavar\"]', 0, 1, 'admin', 1, '2025-04-02 17:15:11', 'published', '2025-04-02 17:15:11', '2025-04-02 17:15:11', NULL),
(3, 'Gyömbér - az emésztés és az immunrendszer támogatója', 'gyomber-az-emesztes-es-az-immunrendszer-tamogatoja', 'A gyömbér gyökértörzse az egyik legősibb fűszer- és gyógynövény, amelyet már 5000 évvel ezelőtt is alkalmaztak Kínában és Indiában. Csípős ízét a gingerol nevű vegyületnek köszönheti, amely erős gyulladáscsökkentő és antioxidáns tulajdonságokkal rendelkezik. A gyömbér különösen hatékony a hányinger különböző formáinak kezelésében, legyen szó utazási betegségről, terhességi rosszullétről vagy műtét utáni émelygésről. Friss vagy szárított formában teaként fogyasztva serkenti az emésztőnedvek termelését, így segíti a nehéz ételek lebontását és csökkenti a puffadást. Rendszeres fogyasztása erősíti az immunrendszert, különösen a téli időszakban, amikor meghűléses betegségek jellemzőek. A gyömbér izzasztó hatása révén segíti a méreganyagok távozását és csökkenti a láz tüneteit. Kutatások szerint a rendszeres gyömbérfogyasztás enyhítheti az ízületi gyulladás okozta fájdalmakat és javíthatja a vérkeringést is.', 'images/krXCxBYmazF2Hobv5FBnt0Qiy7jO69eEwZETFyRW.jpg', 'A gyömbér gyökértörzse az egyik legősibb fűszer- és gyógynövény, amelyet már 5000 évvel ezelőtt is a...', '[\"h\\u00e1nyinger\",\"em\\u00e9szt\\u00e9si zavar\",\"puffad\\u00e1s\",\"megf\\u00e1z\\u00e1s\",\"influenza\",\"\\u00edz\\u00fcleti gyullad\\u00e1s\",\"magas v\\u00e9rnyom\\u00e1s\",\"koleszterinprobl\\u00e9m\\u00e1k\"]', 1, 1, 'admin', 1, '2025-04-02 17:27:48', 'published', '2025-04-02 17:27:48', '2025-04-02 17:27:48', NULL),
(4, 'Tavaszi gyógynövénygyűjtés - A friss hajtások ereje', 'tavaszi-gyogynovenygyujtes-a-friss-hajtasok-ereje', 'A tavasz a természet ébredésének és a megújulásnak az időszaka, amely kiváló lehetőséget kínál a friss gyógynövények gyűjtésére. Ilyenkor a fiatal hajtások különösen gazdag vitamin- és enzimforrások, méregtelenítő hatásuk pedig segít a téli időszak után a szervezet megtisztításában. A csalán március végétől gyűjthető zsenge hajtásai vértisztító hatásúak és remek vitaminforrást jelentenek a téli hónapok után. A gyermekláncfű fiatal levelei nemcsak salátába kiválóak, de támogatják a máj működését és a méregtelenítést. A mezei zsurló tavaszi hajtásai ilyenkor gyűjthetők a leghatékonyabban, amelyek kiváló támogatást nyújtanak a vesék számára. A gyűjtés során mindig ügyeljünk arra, hogy forgalomtól távol eső, szennyezésmentes területen szedjük a növényeket, lehetőleg száraz, napos időben. A frissen szedett gyógynövényeket érdemes azonnal feldolgozni vagy megfelelően szárítani, hogy megőrizzük értékes hatóanyagaikat. Tartsuk szem előtt, hogy a természetben csak annyit gyűjtsünk, amennyire valóban szükségünk van, hogy a növényállomány megmaradjon a következő évekre is.', 'images/ecQ68P3iySGc5ouLr0zwCv7rJK0HFf53Fpdw9FiT.jpg', 'A tavasz a természet ébredésének és a megújulásnak az időszaka, amely kiváló lehetőséget kínál a fri...', '[\"v\\u00e9rszeg\\u00e9nys\\u00e9g\",\"tavaszi f\\u00e1radts\\u00e1g\",\"m\\u00e1jel\\u00e9gtelens\\u00e9g\",\"vesek\\u0151\",\"h\\u00fagy\\u00fati fert\\u0151z\\u00e9sek\",\"ekc\\u00e9ma\",\"reuma\",\"sz\\u00edvel\\u00e9gtelens\\u00e9g\"]', 0, 1, 'admin', 2, '2025-04-02 17:29:37', 'published', '2025-04-02 17:29:37', '2025-04-02 17:29:37', NULL),
(5, 'Őszi gyógynövénykert - Felkészülés a téli időszakra', 'oszi-gyogynovenykert-felkeszules-a-teli-idoszakra', 'Az ősz ideális időszak bizonyos gyógynövények gyűjtésére és a gyógynövénykert felkészítésére a téli hónapokra. A gyökerek és gyökértörzsek ilyenkor tartalmazzák a legtöbb hatóanyagot, mivel a növény ezekben tárolja a tápanyagokat. A ginzeng és az édesgyökér gyökereit érdemes késő ősszel betakarítani, amikor energiatartalmuk a legmagasabb. Az őszi időszakban érnek be a csipkebogyók is, amelyek kiemelkedően magas C-vitamin tartalma segít felkészíteni immunrendszerünket a téli megfázásos időszakra. A bodza fekete bogyói szintén ősszel gyűjthetők, ezekből lekvárt vagy szirupot készíthetünk, amely hatékony lehet influenzás időszakban. A kertünkben növő évelő gyógynövényeket, mint a zsálya vagy a menta, érdemes visszavágni, és a lehullott levelekkel betakarni a töveket, hogy védjük őket a fagytól. Az ősszel betakarított növényi részeket gondosan meg kell tisztítani, feldarabolni és száraz, szellős helyen tárolni. A megfelelően előkészített gyógynövények így egész télen biztosítják számunkra a természetes gyógymódok lehetőségét.', 'images/qcS203pwiy8uw9bnFurkzC2WlI86gi4tBBapI5b8.jpg', 'Az ősz ideális időszak bizonyos gyógynövények gyűjtésére és a gyógynövénykert felkészítésére a téli...', '[\"megf\\u00e1z\\u00e1s\",\"influenza\",\"immungyenges\\u00e9g\",\"torokgyullad\\u00e1s\",\"bronchitis\",\"stressz\",\"kimer\\u00fclts\\u00e9g\",\"f\\u00e1rad\\u00e9konys\\u00e1g\",\"magas v\\u00e9rnyom\\u00e1s\"]', 1, 1, 'admin', 2, '2025-04-02 17:32:44', 'published', '2025-04-02 17:32:44', '2025-04-02 17:32:44', NULL),
(6, 'Immunerősítő teakeverék a téli hónapokra', 'immunerosito-teakeverek-a-teli-honapokra', 'A hideg időszak beköszöntével különösen fontos, hogy támogassuk immunrendszerünk működését természetes módszerekkel. Egy kiváló immunerősítő teakeveréket készíthetünk az alábbi gyógynövények kombinálásával: 3 rész csipkebogyó, 2 rész bodza virág, 1 rész kakukkfű és 1 rész gyömbér. A csipkebogyó rendkívül gazdag C-vitaminban, amely segíti fehérvérsejtjeink működését. A bodzavirág izzasztó hatása révén segíti a szervezet méregtelenítését, míg a kakukkfű erős antibakteriális tulajdonságokkal rendelkezik. A gyömbér hozzáadása melegítő hatást biztosít és fokozza a vérkeringést. A keverékből egy púpozott teáskanálnyit forrázzunk le 2,5 dl vízzel, majd hagyjuk állni 10-15 percig. Naponta 2-3 csészével fogyasszunk ebből a teakeverékből, lehetőleg étkezések között. Ízesítéshez használhatunk mézet, de csak akkor adjuk hozzá, amikor a tea már nem túl forró, hogy a méz értékes enzimjei ne károsodjanak. Ez a teakeverék megelőzésre és a betegség korai szakaszában is kiváló támogatást nyújt.', 'images/TErJgJ1Ll73UrPKSFAjqxs7U4zDy5hKJbCXqQZI4.jpg', 'A hideg időszak beköszöntével különösen fontos, hogy támogassuk immunrendszerünk működését természet...', '[\"megf\\u00e1z\\u00e1s\",\"influenza\",\"torokgyullad\\u00e1s\",\"orrmell\\u00e9k\\u00fcreg-gyullad\\u00e1s\",\"k\\u00f6h\\u00f6g\\u00e9s\",\"immungyenges\\u00e9g\",\"f\\u00e1rad\\u00e9konys\\u00e1g\",\"l\\u00e1z\"]', 1, 1, 'admin', 3, '2025-04-02 17:36:06', 'published', '2025-04-02 17:36:06', '2025-04-02 17:36:06', NULL),
(7, 'Emésztést segítő gyógynövény tinktúra', 'emesztest-segito-gyogynoveny-tinktura', 'Az ünnepek alatt vagy stresszes időszakban gyakran jelentkeznek emésztési panaszok, amelyekre kiváló megoldást nyújthat egy házilag elkészített gyógynövény tinktúra. Az elkészítéséhez szükséges összetevők: 2 evőkanál szárított cickafark, 2 evőkanál szárított borsmenta levél, 1 evőkanál szárított kamilla virág és 1 evőkanál szárított édeskömény mag. Ezeket a gyógynövényeket helyezzük egy sötét színű, jól zárható üvegbe, és öntsük le 400 ml 40%-os vodkával vagy gyógyszerészeti alkohollal. Az üveget 3-4 hétig tároljuk sötét helyen, naponta egyszer rázzuk fel. Ezután szűrjük le a folyadékot, és töltsük kis, sötét színű cseppentős üvegekbe. Az elkészült tinktúrából emésztési problémák esetén naponta 3-szor 20-30 cseppet vegyünk be egy kevés vízzel hígítva, lehetőleg étkezés előtt fél órával. A cickafark enyhíti a gyomornyálkahártya gyulladását, a borsmenta görcsoldó hatású, a kamilla nyugtatja az idegrendszert, az édeskömény pedig csökkenti a puffadást. Ez a tinktúra különösen hatékony lehet ünnepi étkezések során, amikor nehezebb, zsírosabb ételeket fogyasztunk.', 'images/ofF3nSSTCS7EGz9BLcKNEOrRvdeCyLQjgO2mamka.jpg', 'Az ünnepek alatt vagy stresszes időszakban gyakran jelentkeznek emésztési panaszok, amelyekre kiváló...', '[\"gyomorhurut\",\"puffad\\u00e1s\",\"sz\\u00e9kreked\\u00e9s\",\"hasmen\\u00e9s\",\"irrit\\u00e1bilis b\\u00e9l szindr\\u00f3ma\",\"gyomorg\\u00f6rcs\",\"em\\u00e9szt\\u00e9si zavarok\",\"\\u00e9tv\\u00e1gytalans\\u00e1g\",\"epek\\u0151\"]', 0, 1, 'admin', 3, '2025-04-02 17:38:12', 'published', '2025-04-02 17:38:12', '2025-04-02 17:38:12', NULL),
(8, 'Reggeli séta - Az egészség első lépései', 'reggeli-seta-az-egeszseg-elso-lepesei', 'A reggeli séta egy egyszerű, mégis rendkívül hatékony módja az egészséges életmód megalapozásának. A hajnali vagy kora reggeli órákban tett 30 perces séta segít beindítani anyagcserénket és optimalizálja a napi bioritmusunkat. A reggeli napfény elősegíti a D-vitamin termelését, amely kulcsfontosságú a csontok egészségéhez és az immunrendszer megfelelő működéséhez. A mozgás beindítja a vérkeringést, javítja az agy oxigénellátását, így segít az éberség fenntartásában és a koncentrációképesség javításában. Rendszeres reggeli séta esetén tanulmányok szerint csökken a depresszió és a szorongás kockázata, mivel a mozgás során felszabaduló endorfinok természetes hangulatjavítóként működnek. A reggeli testmozgás segíti a vércukorszint stabilizálását is, ami különösen hasznos a cukorbetegség megelőzésében. Próbáljunk meg a séta során tudatosan figyelni a környezetünkre és légzésünkre, így egy kis mindfulness gyakorlatot is becsempészhetünk a rutinba. Nem kell nagy távolságokat megtenni, már napi 15-30 perces séta is jelentős egészségügyi előnyökkel jár.', 'images/Ba8GeXF7gi7qVxYpbJSKngCOborNCsmTZu5wihmN.jpg', 'A reggeli séta egy egyszerű, mégis rendkívül hatékony módja az egészséges életmód megalapozásának. A...', '[\"magas v\\u00e9rnyom\\u00e1s\",\"sz\\u00edvbetegs\\u00e9gek\",\"cukorbetegs\\u00e9g\",\"elh\\u00edz\\u00e1s\",\"depresszi\\u00f3\",\"szorong\\u00e1s\",\"alv\\u00e1szavarok\",\"anyagcserezavarok\"]', 1, 1, 'admin', 4, '2025-04-02 17:41:53', 'published', '2025-04-02 17:41:53', '2025-04-02 17:41:53', NULL),
(9, 'Hidratálás művészete - Több mint csak vízivás', 'hidratalas-muveszete-tobb-mint-csak-vizivas', 'A megfelelő hidratáltság alapvető fontosságú az egészségünk szempontjából, mégis sokan elhanyagolják a napi folyadékbevitelt. Szervezetünk körülbelül 60%-a víz, amely nélkülözhetetlen szerepet játszik az anyagcserében, méregtelenítésben és a testhőmérséklet szabályozásában. A szakértők általában napi 2-2,5 liter folyadék fogyasztását javasolják, de ez változhat az egyéni igények, fizikai aktivitás és az időjárás függvényében. A hidratálás minőségét javíthatjuk különböző gyógynövényekkel gazdagított italokkal. A citromos víz segíti a méregtelenítést és támogatja a máj működését. A mentás víz frissítő hatású és segít az emésztés javításában. A gyömbéres víz serkenti a vérkeringést és támogatja az immunrendszert. Érdemes egy nagyobb üveget megtölteni reggelente, és azt napközben elfogyasztani, így könnyebben nyomon követhetjük a bevitt folyadék mennyiségét. A kávé és az alkoholtartalmú italok vízhajtó hatásúak, ezért ezek fogyasztása után érdemes több vizet inni. Figyeljünk arra is, hogy a víz mellett természetes gyümölcs- és zöldséglevek, valamint levesek is hozzájárulnak a napi folyadékbevitelhez.', 'images/UTvrbl356ifWO3PCVR9w3tG1rRp6MCxHgqTAn509.jpg', 'A megfelelő hidratáltság alapvető fontosságú az egészségünk szempontjából, mégis sokan elhanyagolják...', '\"[\\\"vesek\\u0151\\\",\\\"h\\u00fagy\\u00fati fert\\u0151z\\u00e9sek\\\",\\\"fejf\\u00e1j\\u00e1s\\\",\\\"sz\\u00e9kreked\\u00e9s\\\",\\\"magas v\\u00e9rnyom\\u00e1s\\\",\\\"koncentr\\u00e1ci\\u00f3s zavarok\\\",\\\"b\\u0151rsz\\u00e1razs\\u00e1g\\\",\\\"\\u00edz\\u00fcleti probl\\u00e9m\\u00e1k\\\"]\"', 0, 1, 'admin', 4, '2025-04-02 17:43:48', 'published', '2025-04-02 17:43:48', '2025-04-02 17:50:28', NULL),
(10, 'Tudatos étkezés - A jóllét kulcsa', 'tudatos-etkezes-a-jollet-kulcsa', 'A tudatos étkezés nem csupán diéta, hanem egy teljes szemléletváltás, amely jelentősen hozzájárulhat az egészségünk megőrzéséhez. A lényege, hogy teljes figyelemmel és tudatossággal fordulunk az étkezés felé, megfigyelve az étel ízét, illatát, textúráját és a testünk reakcióit. Ez a gyakorlat segít felismerni a valódi éhségjeleket és megkülönböztetni azokat az érzelmi evéstől. A tudatos étkezés során lassan, alaposan rágjuk meg az ételt, ami nemcsak az emésztést segíti, de a teltségérzet is hamarabb jelentkezik, így kisebb adagokkal is jóllakunk. Érdemes minden étkezés előtt néhány mély lélegzetet venni, hogy a paraszimpatikus idegrendszer aktiválódjon, ami optimalizálja az emésztést. Figyeljünk a tányérunk összeállítására: legyen rajta legalább 50% zöldség, 25% teljes értékű gabona és 25% fehérje. Próbáljuk kerülni a túlzott cukor- és feldolgozott élelmiszer fogyasztását, helyette válasszunk szezonális, helyi alapanyagokat. A tudatos étkezés gyakorlása segít helyreállítani a természetes kapcsolatot az étel és a testünk között, így hosszú távon hozzájárul az egészséges testsúly és az optimális emésztés fenntartásához.', 'images/5wB1d6A6ptkPwta4QKorQKQXHhD0otwcJopax7T9.jpg', 'A tudatos étkezés nem csupán diéta, hanem egy teljes szemléletváltás, amely jelentősen hozzájárulhat...', '\"[\\\"elh\\u00edz\\u00e1s\\\",\\\"cukorbetegs\\u00e9g\\\",\\\"reflux\\\",\\\"irrit\\u00e1bilis b\\u00e9l szindr\\u00f3ma\\\",\\\"magas koleszterinszint\\\",\\\"sz\\u00edv- \\u00e9s \\u00e9rrendszeri betegs\\u00e9gek\\\",\\\"\\u00e9tkez\\u00e9si zavarok\\\",\\\"gyullad\\u00e1sos b\\u00e9lbetegs\\u00e9gek\\\"]\"', 0, 1, 'admin', 4, '2025-04-02 17:46:17', 'published', '2025-04-02 17:46:17', '2025-04-02 17:47:46', NULL),
(11, 'Nagyanyáink hagymaszirup receptje köhögés ellen', 'nagyanyaink-hagymaszirup-receptje-kohoges-ellen', 'A hagyma gyógyító ereje évszázadok óta ismert a népi gyógyászatban, különösen légúti problémák kezelésében. Nagyanyáink hagymasirupja egy egyszerű, mégis hatékony házi gyógymód, amelyet már a középkor óta alkalmaznak köhögés és torokfájás enyhítésére. Az elkészítése rendkívül egyszerű: vágj fel egy közepes méretű vöröshagymát vékony karikákra, majd rétegezd egy üvegbe méz és hagyma váltakozó rétegeivel. Az üveget hagyd állni szobahőmérsékleten legalább 8-12 órán keresztül. Ez idő alatt a hagyma illóolajai és a méz antibakteriális hatóanyagai egyesülnek, létrehozva egy erőteljes gyógyhatású szirupot. A hagyma természetes antibiotikum hatású kéntartalmú vegyületei, az allicin és a quercetin, hatékonyak a légúti fertőzésekkel szemben. A méz pedig nyugtató, gyulladáscsökkentő és antibakteriális tulajdonságokkal rendelkezik. Naponta 3-4 alkalommal egy teáskanálnyi szirup bevétele segíthet a makacs köhögés csillapításában. Gyermekek esetében egy éves kor felett alkalmazható. Érdekesség, hogy régen ezt a szirupot nem csak elfogyasztották, hanem a mellkasra is bedörzsölték, hogy a légutakat még hatékonyabban tisztítsák.', 'images/CmEN4F4mcaaBE92a3vCbposILVuF11Ta3YDYIPZG.jpg', 'A hagyma gyógyító ereje évszázadok óta ismert a népi gyógyászatban, különösen légúti problémák kezel...', '[\"k\\u00f6h\\u00f6g\\u00e9s\",\"bronchitis\",\"torokgyullad\\u00e1s\",\"megf\\u00e1z\\u00e1s\",\"influenza\",\"h\\u00f6rg\\u0151gyullad\\u00e1s\",\"arc\\u00fcreggyullad\\u00e1s\",\"l\\u00e9gcs\\u0151hurut\"]', 1, 1, 'admin', 5, '2025-04-02 17:53:26', 'published', '2025-04-02 17:53:26', '2025-04-02 17:53:26', NULL),
(12, 'Fekete nadálytő kenőcs - A csontkovács növénye', 'fekete-nadalyto-kenocs-a-csontkovacs-novenye', 'A fekete nadálytő az egyik legértékesebb gyógynövény a népi gyógyászatban, amelyet ősidők óta használnak különböző sérülések és mozgásszervi problémák kezelésére. A „csontforrasztó\" vagy „csontkovács növénye\" néven is ismert nadálytő hatóanyaga, az allantoin, serkenti a sejtosztódást és gyorsítja a csontok, szövetek regenerálódását. Nagyszüleink így készítettek házi kenőcsöt belőle: a frissen kiásott nadálytő gyökerét alaposan megtisztították, lereszelték, majd 1:5 arányban sertészsírral vagy vazelinnel keverték. Az így elkészült masszát lassú tűzön melegítették, majd leszűrték és kis tégelyekbe töltötték. A hagyomány szerint ezt a kenőcsöt zúzódások, törések, ficamok, rándulások és ízületi fájdalmak esetén alkalmazták, naponta többször a fájdalmas területre kenve. A népi gyógyászatban különösen nagyra értékelték, hogy a fekete nadálytő nem csak a fájdalmat csillapítja, hanem a mélyebb szövetekbe hatolva gyorsítja a gyógyulási folyamatot. Érdekes történelmi tény, hogy a középkorban a hadszíntéren is használták a katonák sérüléseinek kezelésére. Fontos megjegyezni, hogy a gyökér pirrolizidin alkaloidokat tartalmaz, ezért ma már inkább a kevésbé mérgező levelekből készítik a modern készítményeket, és kizárólag külsőleg alkalmazzák.', 'images/gft59WXarZZRCqCjroTdz7F05S5fkssJzC9ly6Hc.jpg', 'A fekete nadálytő az egyik legértékesebb gyógynövény a népi gyógyászatban, amelyet ősidők óta haszná...', '[\"csontt\\u00f6r\\u00e9s\",\"izomh\\u00faz\\u00f3d\\u00e1s\",\"ficam\",\"\\u00edz\\u00fcleti gyullad\\u00e1s\",\"reuma\",\"k\\u00f6szv\\u00e9ny\",\"gerincs\\u00e9rv\",\"izoml\\u00e1z\",\"bursitis\",\"\\u00ednh\\u00fcvelygyullad\\u00e1s\"]', 0, 1, 'admin', 5, '2025-04-02 17:55:40', 'published', '2025-04-02 17:55:40', '2025-04-02 17:55:40', NULL),
(13, 'Migrénroham természetes csillapítása', 'migrenroham-termeszetes-csillapitasa', 'A migrén több mint egy egyszerű fejfájás – a lüktető fájdalom mellett gyakran jelentkezik émelygés, fény- és hangérzékenység is. Bár az orvosi kezelés sok esetben elengedhetetlen, számos természetes módszer segíthet a tünetek enyhítésében és a rohamok gyakoriságának csökkentésében. A megelőzésben kulcsfontosságú a rendszeres életritmus kialakítása és a migréntriggerek felismerése, mint például bizonyos ételek, stressz vagy hormonális változások. Akut roham esetén a levendula illóolaj belélegzése vagy halántékra való enyhe masszírozása bizonyítottan csökkentheti a migrén intenzitását és időtartamát. A gyömbér fogyasztása – akár frissen, akár teaként – enyhítheti az émelygést és gyulladáscsökkentő hatása révén a fájdalmat is. A hideg borogatás a homlokra vagy tarkóra helyezve összehúzza az ereket és csökkentheti a lüktető érzést. Esténként egy csésze macskagyökér vagy citromfű tea elfogyasztása javíthatja az alvásminőséget, ami szintén fontos a migrénkezelésben. A magnéziumban gazdag étrend (zöld leveles zöldségek, diófélék, teljes kiőrlésű gabonák fogyasztása) hosszú távon csökkentheti a migrénes rohamok gyakoriságát és intenzitását, mivel ez az ásványi anyag fontos szerepet játszik az idegi és izomfunkciók szabályozásában.', 'images/V4s9ItCPXeO2VoZFzwshyHXNBPHeVuTGaVBQ2KtH.jpg', 'A migrén több mint egy egyszerű fejfájás – a lüktető fájdalom mellett gyakran jelentkezik émelygés,...', '[\"migr\\u00e9n\",\"fejf\\u00e1j\\u00e1s\",\"tenzi\\u00f3s fejf\\u00e1j\\u00e1s\",\"stressz\",\"szorong\\u00e1s\",\"alv\\u00e1szavar\",\"hormon\\u00e1lis egyens\\u00falyhi\\u00e1ny\",\"magasv\\u00e9rnyom\\u00e1s\"]', 1, 1, 'admin', 6, '2025-04-02 17:59:14', 'published', '2025-04-02 17:59:14', '2025-04-02 17:59:14', NULL),
(14, 'Gyógynövényekkel az ízületi gyulladás ellen', 'gyogynovenyekkel-az-izuleti-gyulladas-ellen', 'Az ízületi gyulladás milliókat érintő krónikus állapot, amely jelentősen befolyásolhatja az életminőséget. A hagyományos kezelések mellett számos gyógynövény kínál természetes alternatívát a fájdalom és gyulladás csökkentésére. Az ördögkarom gyökere évszázadok óta használt gyógynövény Afrikában, amelynek hatóanyagai, a harpagozidok erős gyulladáscsökkentő hatással rendelkeznek. Napi 600-1200 mg-os dózisban fogyasztva csökkentheti az ízületi fájdalmat és merevséget. A kurkuma aktív vegyülete, a kurkumin szintén potens gyulladáscsökkentő, amely gátolja a gyulladásos folyamatokban részt vevő enzimeket. A fekete bors hozzáadása jelentősen növeli a kurkumin felszívódását, ezért érdemes a két fűszert együtt fogyasztani. A széleskörűen elterjedt fűzfakéreg természetes szalicilátokat tartalmaz, amelyek a modern aszpirin elődjének tekinthetők. Teaként fogyasztva enyhítheti az ízületi fájdalmat és csökkentheti a gyulladást. A táplálékkiegészítőként is népszerű glükózamin és kondroitin segíthet az ízületi porc regenerálódásában, különösen a kopásos jellegű ízületi problémáknál. Külsőleg az árnika, rozmaring vagy borsmenta illóolajjal dúsított masszázsolajok alkalmazása javíthatja a helyi vérkeringést és átmeneti fájdalomcsillapító hatást biztosíthat. Fontos megjegyezni, hogy a gyógynövények alkalmazása előtt érdemes orvossal konzultálni, különösen vérhígító vagy egyéb gyógyszerek szedése esetén.', 'images/SaY4znzR8MEaVqsCHRsQ7TR2hqfLFltX7RfZ6QwK.jpg', 'Az ízületi gyulladás milliókat érintő krónikus állapot, amely jelentősen befolyásolhatja az életminő...', '[\"rheumatoid arthritis\",\"osteoarthritis\",\"k\\u00f6szv\\u00e9ny\",\"\\u00edz\\u00fcleti kop\\u00e1s\",\"fibromyalgia\",\"csontritkul\\u00e1s\",\"sziszt\\u00e9m\\u00e1s lupus\",\"\\u00ednh\\u00fcvelygyullad\\u00e1s\"]', 1, 1, 'admin', 6, '2025-04-02 18:02:08', 'published', '2025-04-02 18:02:08', '2025-04-02 18:02:08', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `post_tag`
--

CREATE TABLE `post_tag` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `latin_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `usage` text NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `unit` varchar(255) NOT NULL DEFAULT 'g',
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `view_count` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `latin_name`, `description`, `usage`, `price`, `discount_price`, `stock_quantity`, `unit`, `is_available`, `is_featured`, `view_count`, `sale_count`, `created_at`, `updated_at`) VALUES
(1, 1, 'Nyugtató álomhozó teakeverék', 'nyugtato-alomhozo-teakeverek', 'Mixtum herbarium calmans', 'A Nyugtató álomhozó teakeverék gondosan válogatott gyógynövények harmonikus kombinációja, amely segíti a nyugodt, pihentető alvást. Összetevői között megtalálható a citromfű (Melissa officinalis), amely enyhe nyugtató hatással rendelkezik, a levendula (Lavandula angustifolia), amely segít oldani a feszültséget, valamint a macskagyökér (Valeriana officinalis), amely évszázadok óta használt természetes alvássegítő. A keveréket kiegészíti a komló (Humulus lupulus) és a cickafark (Achillea millefolium), amelyek hozzájárulnak a szervezet természetes egyensúlyának helyreállításához. Minden összetevőt a legjobb minőségű, ellenőrzött forrásból származó növényekből válogattunk, amelyek kézi szedéssel és kíméletes szárítással kerültek feldolgozásra, hogy megőrizzék értékes hatóanyagaikat.', 'A Nyugtató álomhozó teakeverék kiváló választás alvászavarok, elalvási nehézségek és éjszakai felébredések esetén. Rendszeres fogyasztása enyhítheti a mindennapi stressz okozta idegességet és feszültséget. Különösen ajánlott azoknak, akik szellemileg megterhelő munkát végeznek, vagy akik nyugtalan, felületes alvástól szenvednek. A tea emellett segíthet a szorongás enyhítésében és a napi ritmus szabályozásában is. A legjobb hatás érdekében lefekvés előtt 30-60 perccel fogyasszon egy csészével: egy púpozott teáskanálnyi keveréket forrázzon le 250 ml forró vízzel, hagyja állni 5-10 percig, majd szűrje le. Ízlés szerint mézzel édesíthető. Várandósság és szoptatás idején, valamint gyermekeknél 12 éves kor alatt alkalmazása előtt konzultáljon orvosával.', 1499.00, 1199.00, 40, 'csomag', 1, 1, 2, 0, '2025-04-02 18:49:12', '2025-04-02 18:49:22'),
(2, 1, 'Emésztést serkentő gyógytea', 'emesztest-serkento-gyogytea', 'Mixtum digestivum', 'Az Emésztést serkentő gyógytea egy különleges keverék, amely a tradicionális gyógynövényismeret és a modern kutatások alapján került összeállításra. A keverék fő alkotóeleme a borsmenta (Mentha piperita), amely hatékonyan oldja a görcsöket és segíti az epe termelődését. Az édeskömény (Foeniculum vulgare) magjai természetes karminatív hatással rendelkeznek, csökkentik a bélgázok képződését és enyhítik a puffadást. A gyömbér (Zingiber officinale) serkenti a nyálelválasztást és az emésztőnedvek termelődését, míg a kamilla (Matricaria chamomilla) gyulladáscsökkentő hatással bír a gyomor-bélrendszerben. A keveréket kiegészíti az orvosi angelika (Angelica archangelica), amely fokozza az étvágyat és támogatja a gyomor működését. Minden növényi összetevőt a termesztés során kímélő technológiával, vegyszermentesen termesztettek, hogy a lehető legtisztább formában kerüljenek a teakeverékbe.', 'Az Emésztést serkentő gyógytea kiválóan alkalmazható étkezés utáni teltségérzet, puffadás és enyhe emésztési panaszok esetén. Rendszeres fogyasztása segíthet a krónikus emésztési problémák, mint például az irritábilis bél szindróma tüneteinek enyhítésében. Hasznos lehet nehéz, zsíros ételek fogyasztása után, valamint utazás során jelentkező emésztési nehézségek kezelésében. A tea támogatja a máj és az epe megfelelő működését, így támogathatja a szervezet természetes méregtelenítő folyamatait is. Elkészítése egyszerű: egy teáskanálnyi (kb. 1-2 g) teakeveréket forrázzon le 250 ml forró vízzel, majd hagyja lefedve állni 5-8 percig. Naponta 2-3 alkalommal fogyasztható, ideális esetben étkezések után 15-20 perccel. Gyógyszerek szedése mellett alkalmazás előtt konzultáljon kezelőorvosával, mivel egyes gyógynövények befolyásolhatják bizonyos gyógyszerek felszívódását.', 1799.00, NULL, 1000, 'dkg', 1, 0, 4, 0, '2025-04-02 18:53:56', '2025-04-02 18:54:57'),
(3, 2, 'Echinacea immunerősítő tinktúra', 'echinacea-immunerosito-tinktura', 'Tinctura Echinaceae purpureae', 'Az Echinacea immunerősítő tinktúra a bíbor kasvirág (Echinacea purpurea) friss, virágzó növényi részeiből készül hagyományos hideg perkolációs eljárással. Az Echinacea az egyik legjobban kutatott immunerősítő gyógynövény, amelynek hatóanyagai, köztük alkilamidok, poliszacharidok és echinakozidok, serkentik a fehérvérsejtek működését és támogatják a szervezet természetes védekező rendszerét. Tinktúránk 45%-os alkoholos kivonat, amely biztosítja a hatóanyagok optimális kinyerését és megőrzését. A készítmény nem tartalmaz mesterséges adalékanyagokat, színezékeket vagy tartósítószereket. Minden gyártási tétel laboratóriumi ellenőrzésen esik át, hogy garantáljuk a hatóanyagok megfelelő koncentrációját és a termék tisztaságát. A sötét üvegben való tárolás megóvja a hatóanyagokat a fény károsító hatásától.', 'Az Echinacea tinktúra kiválóan alkalmazható az immunrendszer támogatására a megfázásos, influenzás időszakok kezdetén vagy fokozott fertőzésveszély esetén. Segíthet lerövidíteni a betegség időtartamát és enyhíteni a tüneteket, ha az első jelek (torokkaparás, orrfolyás) észlelésekor kezdjük el fogyasztani. Hatékony lehet visszatérő felső légúti fertőzések, idült mandulagyulladás és elhúzódó köhögés esetén is. Felnőtteknek naponta 3-szor 20-30 csepp ajánlott, amelyet fél pohár vízben vagy gyümölcslében hígítva kell elfogyasztani. Akut esetekben az adagolás az első két napban sűríthető (2 óránként 15 csepp). Kúraszerű alkalmazása 8 hétnél tovább nem javasolt, ezt követően tartsunk legalább 2 hét szünetet. Autoimmun betegségek, immunszuppresszív terápia esetén, valamint várandósság és szoptatás idején alkalmazása előtt feltétlenül konzultáljon kezelőorvosával.', 499.00, 399.00, 2000, 'ml', 1, 1, 2, 0, '2025-04-02 19:00:19', '2025-04-02 19:00:27'),
(4, 2, 'Máriatövis májvédő kivonat', 'mariatovis-majvedo-kivonat', 'Extractum Silybi mariani', 'A Máriatövis májvédő kivonat a máriatövis (Silybum marianum) érett magjaiból előállított prémium minőségű folyékony kivonat. A máriatövis fő hatóanyaga a szilimarin, amely flavonoidok komplex keveréke, különösen gazdag szilibininben. Ezek a vegyületek erőteljes antioxidáns tulajdonságokkal rendelkeznek és segítik a májsejtek regenerálódását. A kivonat ellenőrzött ökológiai gazdálkodásból származó növényi alapanyagokból készül, és speciális extrakciós eljárással dolgozzuk fel, hogy megőrizzük a hatóanyagok teljes spektrumát. Az alkohol-víz kivonófolyadék optimális arányú (60:40), amely biztosítja a szilimarin hatékony extrakcióját. A termék nem tartalmaz glutént, laktózt, mesterséges színezéket vagy tartósítószert. Minden gyártási tételre vonatkozóan hatóanyag-tartalom vizsgálatot végzünk, hogy garantáljuk a termék állandó, magas minőségét.', 'A Máriatövis kivonat elsősorban a máj egészségének támogatására szolgál. Hagyományosan alkalmazzák a máj méregtelenítő funkcióinak segítésére, különösen alkoholfogyasztás, gyógyszerszedés vagy vegyi anyagokkal való érintkezés után. Hatékony lehet zsírmáj, májgyulladás és egyéb májkárosodások kiegészítő kezelésében. Támogathatja a szervezet természetes méregtelenítő folyamatait, és védelmet nyújthat a szabad gyökök okozta oxidatív stressz ellen. A kivonatból naponta 3-szor 30-40 csepp fogyasztása javasolt, kis mennyiségű vízzel hígítva, lehetőleg étkezés előtt 15 perccel. A terápiás hatás kialakulásához legalább 4-6 hetes rendszeres fogyasztás szükséges. Krónikus májbetegség esetén hosszabb távú alkalmazás is lehetséges orvosi felügyelet mellett. Epekövek, epevezeték-elzáródás esetén használata előtt konzultáljon orvosával. Terhesség és szoptatás alatt, valamint 12 éven aluli gyermekek esetében alkalmazása nem javasolt.', 599.00, NULL, 1500, 'ml', 1, 0, 2, 0, '2025-04-02 19:03:57', '2025-04-02 19:04:05'),
(5, 3, 'A termék neve: Körömvirágos regeneráló kenőcs', 'a-termek-neve-koromviragos-regeneralo-kenocs', 'Unguentum Calendulae officinalis', 'A Körömvirágos regeneráló kenőcs a körömvirág (Calendula officinalis) gyógyító erejét hasznosítja egy könnyen felszívódó, bőrbarát alapanyagban. A termék alapját hidegen sajtolt sheavaj és olívaolaj adja, amelyekbe a körömvirág virágzatának teljes hatóanyag-spektrumát infúziós eljárással vittük be. A körömvirág gazdagon tartalmaz flavonoidokat, triterpén-szaponinokat és karotinoidokat, amelyek együttesen erőteljes gyulladáscsökkentő, sebgyógyító és bőrregeneráló hatást fejtenek ki. Kenőcsünk nem tartalmaz ásványi olajokat, mesterséges illatanyagokat, színezékeket vagy parabéneket. A termék 100%-ban természetes összetételű, vegán és állatkísérlet-mentes. Az alapanyagokat ellenőrzött biogazdaságokból szerezzük be, a feldolgozás során pedig kíméletes, alacsony hőmérsékletű eljárásokat alkalmazunk, hogy a hatóanyagok minél nagyobb koncentrációban őrződjenek meg.', 'A Körömvirágos regeneráló kenőcs sokoldalúan használható különböző bőrproblémák kezelésére. Kiválóan alkalmazható kisebb sebek, horzsolások, égési sérülések és rovarcsípések esetén, ahol gyorsítja a sebgyógyulást és csökkenti a gyulladást. Hatékony segítséget nyújt száraz, irritált bőr, ekcéma, dermatitis és pelenkakiütés kezelésében. Rendszeres használata enyhítheti a napégés tüneteit és segítheti a bőr regenerálódását túlzott napozás után. Különösen ajánlott érzékeny bőrűeknek és gyermekeknek is, természetes összetétele miatt. Minden korosztály számára biztonságosan alkalmazható, beleértve a csecsemőket is (3 hónapos kor felett). Használata egyszerű: naponta 2-3 alkalommal vékonyan kenje fel a megtisztított bőrfelületre, és gyengéden masszírozza be. Nyílt sebek esetén előzetesen tisztítsa meg a területet. Szemmel való érintkezés esetén bő vízzel öblítse ki. Ha a tünetek 7 napon belül nem javulnak, vagy rosszabbodnak, forduljon orvoshoz. Ritkán előfordulhat allergiás reakció, ezért első használat előtt végezzen bőrpróbát a csuklón vagy a könyökhajlatban.', 199.00, 149.00, 5000, 'g', 1, 1, 2, 0, '2025-04-02 19:08:08', '2025-04-02 19:08:17'),
(6, 3, 'Ördögkarom ízületi balzsam', 'ordogkarom-izuleti-balzsam', 'Balsamum Harpagophyti procumbens', 'Az Ördögkarom ízületi balzsam egy speciálisan fejlesztett készítmény, amely az afrikai ördögkarom gyökér (Harpagophytum procumbens) kivonatát kombinálja további gyulladáscsökkentő és fájdalomcsillapító hatású gyógynövényekkel. Az ördögkarom hatóanyagai, a harpagozidok bizonyítottan enyhítik az ízületi gyulladást és fájdalmat. A formula további hatóanyagai között szerepel a rozmaring (Rosmarinus officinalis) illóolaja, amely serkenti a helyi vérkeringést, a fekete nadálytő (Symphytum officinale) kivonata, amely gyorsítja a szöveti regenerációt, valamint a mentol és kámfor, amelyek azonnali hűsítő és fájdalomcsillapító hatást biztosítanak. A krém könnyen felszívódó, nem zsíros emulziós alapja biztosítja a hatóanyagok optimális penetrációját a mélyebb szövetekbe. A termék nem tartalmaz szintetikus szteroidokat, parabéneket vagy mesterséges színezékeket. Összetevőit fenntartható forrásokból szerezzük be és fair trade tanúsítvánnyal rendelkeznek.', 'Az Ördögkarom ízületi balzsam elsősorban mozgásszervi panaszok kezelésére ajánlott. Hatékonyan enyhíti az ízületi gyulladás (arthritis), ízületi kopás (arthrosis), reuma, ínhüvelygyulladás és izomfájdalmak okozta kellemetlen tüneteket. Kiválóan alkalmazható sportolás közben szerzett sérülések, húzódások, rándulások és zúzódások kiegészítő kezelésére is. A balzsamot naponta 2-3 alkalommal vékonyan vigye fel a fájdalmas területre, és gyengéden masszírozza be, amíg teljesen felszívódik. A mentol és kámfor miatt alkalmazás után kellemes hűsítő érzés tapasztalható, amely átmenetileg elterelheti a figyelmet a fájdalomról, míg a gyógynövénykivonatok mélyebb hatása kibontakozik. Használat után alaposan mosson kezet. Ne alkalmazza nyílt sebeken, sérült bőrfelületen vagy nyálkahártyán. Szembe ne kerüljön. Terhesség és szoptatás idején, valamint 12 éven aluli gyermekeknél alkalmazása nem javasolt. Ha a panaszok két hét után sem enyhülnek vagy súlyosbodnak, forduljon orvoshoz. Krónikus ízületi problémák esetén a balzsam kiegészítheti, de nem helyettesíti az orvos által előírt terápiát.', 799.00, 699.00, 700, 'ml', 1, 0, 4, 0, '2025-04-02 19:11:40', '2025-04-02 19:11:59'),
(7, 4, 'Levendula prémium illóolaj', 'levendula-premium-illoolaj', 'Oleum aethereum Lavandulae angustifoliae', 'A Levendula prémium illóolaj 100% tisztaságú, terápiás minőségű esszenciális olaj, amely a Lavandula angustifolia virágzó hajtásaiból vízgőz-desztillációval készül. A levendulát Franciaország Provence régiójából, 1000 méter feletti magasságban található biogazdaságokból szerezzük be, ahol a növények optimális körülmények között, vegyszermentes környezetben fejlődnek. Ez a magaslati termesztés biztosítja az illóolaj magas linaloolt és linalil-acetátot tartalmazó, kiegyensúlyozott összetételét, amelynek köszönhetően különösen hatékony a stressz oldásában és a nyugtató hatás kifejtésében. Minden tétel gázkromatográfiás vizsgálaton esik át, amely garantálja a termék autenticitását és minőségét. Az olajat sötét üvegben szállítjuk, amely védi a fény károsító hatásától és megőrzi a hatóanyagok stabilitását. Illata friss, virágos, enyhén fűszeres jegyekkel, amely hosszan tartó aromát biztosít.', 'A Levendula illóolaj az aromaterápia egyik legsokoldalúbb és legbiztonságosabb esszenciális olaja, amely számos módon alkalmazható. Párologtatóba cseppentve (3-5 csepp) nyugtató hatású, segíti az ellazulást, csökkenti a stresszt és támogatja a pihentető alvást, így kiváló választás alvászavarok, szorongás és fejfájás esetén. Bőrápolásban hígítva használható (10 ml hordozóolajhoz 4-5 csepp): enyhíti a bőrirritációt, segíti az apró vágások, horzsolások gyógyulását, valamint hatékony rovarcsípések, napégés és kiütések kezelésére is. Fürdővízhez adva (5-7 csepp) relaxáló fürdőélményt biztosít, oldja az izomfeszültséget. Masszázsolajként alkalmazva (30 ml hordozóolajhoz 10-12 csepp) enyhíti az izomfájdalmat és a fejfájást. Néhány csepp párna sarkára cseppentve vagy zsebkendőre téve segíti az elalvást és a légzést. Természetesen használható lakás illatosítására is. Várandósság alatt csak hígítva, orvosi konzultációt követően alkalmazható. Gyermekek esetében 6 éves kor felett, csak hígított formában használható. Bőrre alkalmazás előtt mindig végezzen allergiatesztet. Közvetlen belső használatra nem alkalmas.', 499.00, NULL, 800, 'ml', 1, 0, 2, 0, '2025-04-02 19:15:30', '2025-04-02 19:15:37'),
(8, 4, 'Aromaterápiás diffúzor szett citrusliget illóolaj-válogatással', 'aromaterapias-diffuzor-szett-citrusliget-illoolaj-valogatassal', 'Miscela olei citrus cum diffusore', 'Az Aromaterápiás diffúzor szett egy prémium minőségű, ultrahangos párologtató készüléket és négy különböző citrus illóolajat tartalmaz (egyenként 10 ml). A modern dizájnú diffúzor világos, természetes fából készült alappal és elegáns üvegburával rendelkezik, amely harmonikusan illeszkedik bármilyen lakberendezési stílushoz. A készülék ultrahangos technológiával működik, amely nem melegíti fel az olajokat, így azok megőrzik eredeti terápiás tulajdonságaikat. A diffúzor állítható párakibocsátással rendelkezik, 30/60/120/180 perces időzítővel és 7 színű, fokozatosan változó vagy fixen beállítható hangulatvilágítással. A szettben található illóolajok: édes narancs (Citrus sinensis), citrom (Citrus limon), grépfrút (Citrus paradisi) és bergamott (Citrus bergamia). Mindegyik olaj 100% tisztaságú, hidegen sajtolt eljárással készült a gyümölcsök héjából, és nem tartalmaz mesterséges adalékanyagokat vagy hígítókat. Az illóolajok tanúsított biogazdaságokból származnak, és mindegyik tételen minőségellenőrzési vizsgálatokat végzünk.', 'A citrus illóolajokat tartalmazó aromaterápiás diffúzor szett sokoldalú megoldást kínál a hangulat és közérzet javítására. A citrusfélék illata általánosan ismert hangulatjavító és energetizáló hatásáról, ezért kiválóan alkalmazható reggelente vagy a délutáni fáradtság leküzdésére. A diffúzorba 100-300 ml víz mellett 5-10 csepp illóolajat cseppegtessen a kívánt intenzitástól függően. Az édes narancs olaj nyugtató és stresszoldó hatással rendelkezik, segít csökkenteni a szorongást és elősegíti a pozitív hangulatot. A citrom illóolaj frissítő és tisztító tulajdonságokkal bír, segíti a koncentrációt és a mentális tisztaságot. A grépfrút illata élénkítő és felvidító hatású, támogatja a testsúlykontrollt és csökkenti az étvágyat. A bergamott egyedi, citrusos-fűszeres aromája különösen hatékony a stressz csökkentésében és a hangulati ingadozások kiegyensúlyozásában. Az olajok keverhetők is egymással egyedi kompozíciók létrehozásához. A diffúzort érdemes napi 1-3 alkalommal, alkalmanként 30-60 percig működtetni. Ne használja a készüléket 24 órán keresztül folyamatosan. Macskák és kis háziállatok jelenlétében óvatosan alkalmazza a citrus illóolajokat, és mindig biztosítson számukra lehetőséget, hogy elhagyhassák a helyiséget. Várandósság esetén konzultáljon szakemberrel az illóolajok használata előtt.', 9990.00, 7990.00, 45, 'db', 1, 1, 1, 0, '2025-04-02 19:18:56', '2025-04-03 11:49:27'),
(9, 5, 'Ashwagandha adaptogén kapszula', 'ashwagandha-adaptogen-kapszula', 'Withania somnifera extractum in capsulis', 'Az Ashwagandha adaptogén kapszula az Indiából származó, tradicionális ajurvédikus gyógynövény, az Ashwagandha (Withania somnifera) standardizált gyökérkivonatát tartalmazza növényi kapszulába zárva. Termékenként 500 mg magas hatóanyag-tartalmú Ashwagandha kivonatot biztosítunk, amely 5% vitanolid tartalomra standardizált. Az Ashwagandha az adaptogén növények közé tartozik, amelyek segítik a szervezetet a stresszhatásokhoz való alkalmazkodásban és a belső egyensúly helyreállításában. A kivonat előállításához organikus termesztésből származó növényeket használunk, amelyeket a növekedési ciklus optimális pontján takarítunk be. A hatóanyagok kinyeréséhez kíméletes, oldószermentes extrakciós technológiát alkalmazunk, hogy megőrizzük a növény teljes hatóanyag-spektrumát. A kapszulahéj növényi eredetű (hidroxipropil-metilcellulóz), így a termék teljesen vegán. Nem tartalmaz glutént, laktózt, mesterséges színezékeket, tartósítószereket vagy GMO összetevőket. Minden gyártási tétel mikrobiológiai és nehézfém vizsgálaton esik át.', 'Az Ashwagandha adaptogén kapszula elsősorban a stresszel szembeni ellenállóképesség növelésére és a mentális egyensúly támogatására szolgál. Rendszeres fogyasztása segíthet csökkenteni a krónikus stressz fizikai és mentális tüneteit, mint a fáradtság, kimerültség, koncentrációs nehézségek és hangulatingadozások. Támogathatja az idegrendszer egészséges működését és hozzájárulhat a jobb alvásminőséghez, anélkül, hogy nappali álmosságot okozna. Kutatások szerint az Ashwagandha pozitívan befolyásolhatja a pajzsmirigy működését és a hormonális egyensúlyt, valamint segítheti a természetes energiaszint fenntartását. Sportolók számára előnyös lehet, mivel támogatja a fizikai teljesítményt, az izomregenerációt és az állóképességet. Javasolt adagolása: naponta 1 kapszula, lehetőleg étkezés közben bevéve. A teljes hatás eléréséhez 2-3 hét rendszeres szedés szükséges, de már az első hét után tapasztalhatóak az előnyös változások. Kúraszerű alkalmazása 2-3 hónapon át javasolt, majd érdemes 1 hónap szünetet tartani. Autoimmun pajzsmirigy-betegségek, várandósság és szoptatás idején, valamint gyógyszerszedés esetén használata előtt konzultáljon orvosával, mivel befolyásolhatja bizonyos gyógyszerek hatását.', 4990.00, 4490.00, 68, 'db', 1, 1, 1, 0, '2025-04-02 19:22:45', '2025-04-02 19:40:47'),
(10, 5, 'Kurkuma + Fekete bors komplex', 'kurkuma-fekete-bors-komplex', 'Curcuma longa et Piper nigrum complexum', 'A Kurkuma + Fekete bors komplex egy innovatív étrend-kiegészítő, amely a kurkuma (Curcuma longa) gyökér kivonatát és fekete bors (Piper nigrum) kivonatot tartalmaz optimális arányban. Minden kapszula 500 mg kurkumakivonatot tartalmaz, amely 95%-ban kurkuminoidokra standardizált, valamint 5 mg fekete bors kivonatot, amely 95% piperint tartalmaz. A kurkuminoidok a kurkuma aktív vegyületei, amelyek erőteljes antioxidáns és gyulladáscsökkentő tulajdonságokkal rendelkeznek. A piperin, a fekete bors aktív összetevője, jelentősen növeli a kurkumin biohasznosulását, akár 2000%-kal javítva annak felszívódását. A termék előállítása során szuperkritikus CO₂ extrakciós technológiát alkalmazunk, amely biztosítja a hatóanyagok maximális koncentrációját és tisztaságát. A kapszulák nem tartalmaznak tartósítószereket, mesterséges színezékeket, glutént, laktózt vagy más allergéneket. A növényi eredetű, enterosolubilis kapszulahéj ellenáll a gyomorsavnak, így a hatóanyagok a vékonybélben szabadulnak fel, ahol a felszívódásuk optimális.', 'A Kurkuma + Fekete bors komplex elsősorban gyulladáscsökkentő és antioxidáns hatásai miatt ajánlott. Különösen hasznos lehet ízületi gyulladások, rheumatoid arthritis és osteoarthritis esetén, ahol enyhítheti a fájdalmat és javíthatja a mozgékonyságot. Rendszeres szedése támogathatja az emésztőrendszer egészséges működését, csökkentheti a gyulladásos folyamatokat a bélrendszerben, és segítheti a zsíremésztést. A kurkumin jótékony hatással lehet a szív- és érrendszerre, hozzájárulhat a normál koleszterinszint és vérnyomás fenntartásához. Antioxidáns tulajdonságai révén védheti a sejteket az oxidatív stressz káros hatásaitól, és támogathatja a máj méregtelenítő funkcióit. Sportolók számára hasznos lehet az edzés utáni regeneráció elősegítésében és az izomfájdalom csökkentésében. Javasolt adagolás: naponta 1 kapszula, étkezés közben vagy után, bőséges folyadékkal. A terápiás hatás eléréséhez napi rendszerességgel, legalább 8-12 héten át javasolt szedni. Véralvadásgátló gyógyszerek szedése esetén konzultáljon orvosával a használat előtt, mivel a kurkumin befolyásolhatja a véralvadási folyamatokat. Epekövesség és epevezeték-elzáródás esetén használata nem ajánlott. Várandósság és szoptatás időszakában csak orvosi javaslatra szedhető.', 5499.00, 4899.00, 32, 'db', 1, 0, 0, 0, '2025-04-02 19:25:21', '2025-04-02 19:25:21'),
(11, 6, 'Szárított citromfű', 'szaritott-citromfu', 'Melissa officinalis', 'A Szárított citromfű premium minőségű, gondosan válogatott és kézi betakarítású Melissa officinalis leveleiből készül. A citromfű friss, kellemes citromos illatát és aromáját a növény magas illóolaj-tartalma (citrál, citroneol, linalool) biztosítja. Termékünket hűvös, napfénytől védett hegyi területeken, vegyszermentes biogazdaságban termesztjük, ahol a növények optimális feltételek között fejlődhetnek. A betakarítást a virágzás előtti időszakban végezzük, amikor a levelek illóolaj-tartalma a legmagasabb. A szárítási folyamat alacsony hőmérsékleten, ellenőrzött körülmények között történik, hogy megőrizzük a növény eredeti aromáját, színét és hatóanyagait. A szárított citromfüvet gondosan megtisztítjuk, válogatjuk és durva vágással dolgozzuk fel, így az értékes levelek épségben maradnak. Termékünk 100% tisztaságú, nem tartalmaz adalékanyagokat, színezékeket vagy tartósítószereket. Légmentesen záródó, újrazárható csomagolásban kínáljuk, amely megóvja a növény minőségét és frissességét.', 'A szárított citromfű sokoldalúan felhasználható a hétköznapokban és különböző egészségügyi problémák természetes kezelésében. Teaként elkészítve (1-2 teáskanál 250 ml forró vízzel leforrázva, 5-10 percig áztatva) kiváló idegnyugtató hatással rendelkezik, enyhíti a stressz és szorongás tüneteit, valamint segíthet az elalvási nehézségek és nyugtalan alvás kezelésében. Rendszeres fogyasztása támogathatja az emésztőrendszer egészséges működését, enyhítheti a puffadást, görcsöket és az irritábilis bél szindróma tüneteit. A citromfű tea hatékony lehet fejfájás, migrén és menstruációs görcsök csillapítására is. Külsőleg alkalmazva (erős teafőzetként borogatásként) enyhítheti a herpesz okozta kellemetlenségeket és gyorsíthatja a sebgyógyulást. Kulináris felhasználása is változatos: frissítő ízesítőként használható gyümölcssalátákhoz, desszertekhez, limonádékhoz vagy jeges teákhoz. Fűszerkeverékekben kiváló kiegészítője lehet halas és szárnyas ételeknek. Fürdővízhez adva relaxáló, bőrnyugtató hatása érvényesül. Várandósság alatt nagy mennyiségben való fogyasztása nem ajánlott, gyógyszerszedés esetén pedig konzultáljon orvosával, mivel a citromfű befolyásolhatja bizonyos nyugtatók és pajzsmirigygyógyszerek hatását.', 199.00, NULL, 9000, 'g', 1, 0, 0, 0, '2025-04-02 19:28:57', '2025-04-02 19:28:57'),
(12, 6, 'Vadrózsa csipkebogyó, egész', 'vadrozsa-csipkebogyo-egesz', 'Rosa canina fructus', 'A Vadrózsa csipkebogyó termékünk a Rosa canina (vadrózsa, gyepűrózsa) gondosan válogatott, egész áltermése, amely vadon termő állományokból, tiszta, szennyezésmentes területekről származik. A csipkebogyókat az optimális érési időszakban, kézzel gyűjtjük, amikor C-vitamin tartalmuk és egyéb értékes hatóanyagaik koncentrációja a legmagasabb. A begyűjtött terméseket gondosan válogatjuk, majd kíméletes, alacsony hőmérsékletű szárítási eljárással kezeljük, hogy megőrizzük rendkívül magas C-vitamin tartalmukat (100g száraz csipkebogyó akár 1700-2000 mg C-vitamint is tartalmazhat, ami a napi ajánlott bevitel többszöröse). A csipkebogyó gazdag flavonoidokban, pektinben, karotinoidokban, szerves savakban és ásványi anyagokban is. Az egész, magokkal együtt szárított csipkebogyó lehetővé teszi, hogy Ön dönthesse el, milyen formában szeretné felhasználni: teakészítéshez feldarabolhatja, vagy különböző készítmények alapanyagaként egészben is használhatja. Termékünk 100% természetes, nem tartalmaz tartósítószereket, adalékanyagokat vagy színezékeket. Aromazáró, újrazárható csomagolásban kínáljuk.', 'A csipkebogyó rendkívül sokoldalúan felhasználható a mindennapi egészségmegőrzésben és a konyhában egyaránt. Immunerősítő teaként elkészítve (2-3 teáskanál összetört csipkebogyót 500 ml hideg vízben áztasson 8-12 órán át, majd melegítse fel, de ne forralja) kiváló természetes C-vitamin forrás, amely támogatja az immunrendszer optimális működését, különösen a téli, megfázásos időszakban. Rendszeres fogyasztása hozzájárulhat a megfázásos betegségek megelőzéséhez és lerövidítheti azok lefolyását. A csipkebogyó gyulladáscsökkentő hatása miatt hatékony lehet ízületi gyulladások és reumás panaszok enyhítésében. Enyhe vízhajtó tulajdonsága révén támogathatja a vesék működését és a szervezet méregtelenítő folyamatait. Kulináris felhasználása is változatos: készíthet belőle lekvárt, szörpöt, mártást vagy akár bort is. Az egész csipkebogyót felhasználhatja saját tinktúrák, olajok vagy kenőcsök készítéséhez is. A csipkebogyóolaj (a magokból hidegen sajtolva) értékes bőrápoló, amely segíthet a hegek, striák halványításában és az érett bőr regenerálásában. Fontos megjegyezni, hogy a csipkebogyó magas C-vitamin tartalma miatt ritkán gyomorirritációt okozhat érzékeny egyéneknél, ilyen esetben csökkentse az adagot. Véralvadásgátló gyógyszerek szedése esetén konzultáljon orvosával a rendszeres fogyasztás előtt, mivel a magas C-vitamin tartalom befolyásolhatja ezek hatékonyságát.', 299.00, 199.00, 5600, 'g', 1, 1, 4, 0, '2025-04-02 19:31:54', '2025-04-02 19:33:02');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `product_categories`
--

CREATE TABLE `product_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Gyógyteák és teakeverékek', 'gyogyteak-es-teakeverekek', 'Különböző gyógynövényekből készült teák, funkcionális keverékek specifikus problémákra', '2025-04-02 18:36:56', '2025-04-02 18:36:56'),
(2, 'Tinktúrák és kivonatok', 'tinkturak-es-kivonatok', 'Alkoholos vagy glicerines gyógynövénykivonatok, koncentrált hatóanyagtartalommal', '2025-04-02 18:37:23', '2025-04-02 18:37:23'),
(3, 'Gyógynövényes krémek és kenőcsök', 'gyogynovenyes-kremek-es-kenocsok', 'Külsőleg alkalmazható készítmények bőrproblémákra, izom- és ízületi fájdalmakra', '2025-04-02 18:37:47', '2025-04-02 18:37:47'),
(4, 'Illóolajok és aromaterápiás termékek', 'illoolajok-es-aromaterapias-termekek', 'Tiszta illóolajok és ezekből készült diffúzorok, párologtatók, roll-on készítmények', '2025-04-02 18:38:09', '2025-04-02 18:38:09'),
(5, 'Étrend-kiegészítők', 'etrend-kiegeszitok', 'Kapszulák, tabletták, porok formájában elérhető koncentrált gyógynövénykészítmények', '2025-04-02 18:38:33', '2025-04-02 18:38:33'),
(6, 'Nyers gyógynövények és fűszerek', 'nyers-gyogynovenyek-es-fuszerek', 'Szárított gyógynövények, fűszernövények saját készítmények elkészítéséhez', '2025-04-02 18:38:58', '2025-04-02 18:38:58');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'products/MSMfw7ZOqunQvyNG57QSpByzYzxCxrFeqlyEEr5J.jpg', 1, 0, '2025-04-02 18:49:12', '2025-04-02 18:49:12'),
(2, 1, 'products/vAlYvRwHUOjVTshnoj0nNKGgBwR4J3M255pYBY7v.jpg', 0, 1, '2025-04-02 18:49:12', '2025-04-02 18:49:12'),
(3, 1, 'products/Zh7X50uirReKVddsAo5Nw4MgJABGnD2VtgxsUxfA.jpg', 0, 2, '2025-04-02 18:49:12', '2025-04-02 18:49:12'),
(4, 1, 'products/l0ABFRPZRByqpv6Y1yFDi7GHGcSs78MVrkDdVa2b.jpg', 0, 3, '2025-04-02 18:49:13', '2025-04-02 18:49:13'),
(5, 2, 'products/7Jjesdi9b4VY2P1jFWEOFF0XiqqTbHw0WUBIv5e3.jpg', 1, 0, '2025-04-02 18:53:56', '2025-04-02 18:54:52'),
(6, 2, 'products/Tw3qK0wEH6rm2TY9TzPnOa262l5alMkCyM1mfrhC.jpg', 0, 1, '2025-04-02 18:53:56', '2025-04-02 18:54:52'),
(7, 2, 'products/35WCr6ZKJjpe76GToA2m9qdw6ORgufek9m6ewSlT.jpg', 0, 2, '2025-04-02 18:53:56', '2025-04-02 18:54:52'),
(8, 2, 'products/9AwEbsEc6sMzbeAWH0OoJHKwTemwyUOndvi8mVyi.jpg', 0, 3, '2025-04-02 18:53:56', '2025-04-02 18:54:52'),
(9, 3, 'products/WRKQ07WNr0VVHrzuVjGRJ1PjPASqsjswBMkVQNef.jpg', 1, 0, '2025-04-02 19:00:19', '2025-04-02 19:00:19'),
(10, 3, 'products/Wm5O7d7SOSqjJUAwEbmiinFMT3RlKkVi0ArGpIUG.jpg', 0, 1, '2025-04-02 19:00:19', '2025-04-02 19:00:19'),
(11, 3, 'products/AP2hKIqQs7J8kbSC671bQ4J1OQxJ93LTjzmcnhih.jpg', 0, 2, '2025-04-02 19:00:19', '2025-04-02 19:00:19'),
(12, 3, 'products/ZOCyoAj8euVosM6dDmP2Wy9NtQ9sjJqAx2Yc8kwu.jpg', 0, 3, '2025-04-02 19:00:19', '2025-04-02 19:00:19'),
(13, 4, 'products/fOGJ5KcqAr7AsPZZ9q4sv0oufxGJmC7RyyupWSHW.jpg', 0, 0, '2025-04-02 19:03:57', '2025-04-02 19:03:57'),
(14, 4, 'products/PH21FVCfDJz09zYFA66nc8x6xT67rUyJkBfnxD8p.jpg', 0, 1, '2025-04-02 19:03:57', '2025-04-02 19:03:57'),
(15, 4, 'products/AXhLPJO7Bgbar0VlsJmgQTUAlL7Yhto3SotMouUs.jpg', 1, 2, '2025-04-02 19:03:57', '2025-04-02 19:03:57'),
(16, 4, 'products/lxvllTiGZdfE8dAg34sIc0mQRcWRykXefaHkZKj5.jpg', 0, 3, '2025-04-02 19:03:57', '2025-04-02 19:03:57'),
(17, 5, 'products/qmPnpCedt2g1hJN7KfvbllyfMswiBNTFkVPnhAYY.jpg', 1, 0, '2025-04-02 19:08:08', '2025-04-02 19:08:08'),
(18, 5, 'products/a3XkV8iQW5oDiQGFk3QNV1qlIOU9Tcu1av6W4ukp.jpg', 0, 1, '2025-04-02 19:08:08', '2025-04-02 19:08:08'),
(19, 5, 'products/YCZ0Eb9ia5YnuSvwetJndhier8JMyX5ZYL9WZPEX.jpg', 0, 2, '2025-04-02 19:08:08', '2025-04-02 19:08:08'),
(20, 5, 'products/vOdPVHZQJMAtmJs73bwZCU7MVQjsYj6mApXt9FGO.jpg', 0, 3, '2025-04-02 19:08:08', '2025-04-02 19:08:08'),
(21, 6, 'products/mbaxXAIjgZDA9S8miKS0L4I6aV2NE75p8asVLVJI.jpg', 0, 0, '2025-04-02 19:11:40', '2025-04-02 19:11:40'),
(22, 6, 'products/XoJ9VtbbBhJAlZba0BWxoLHI1DRTE09XALtH6Mtu.jpg', 0, 1, '2025-04-02 19:11:40', '2025-04-02 19:11:40'),
(23, 6, 'products/7L9VwVncJZUJMEoGF4a7cJVP5vktv8ndy4dP58aH.jpg', 0, 2, '2025-04-02 19:11:40', '2025-04-02 19:11:40'),
(24, 6, 'products/GNZQEihIOYkQkTu1JFiXpDMxse6isrInfYcDR1Mj.jpg', 1, 3, '2025-04-02 19:11:40', '2025-04-02 19:11:40'),
(25, 7, 'products/TwbH7a6hYbWfaLTuowbWJ9visxR4IZN3JfLBnGfH.jpg', 1, 0, '2025-04-02 19:15:30', '2025-04-02 19:15:30'),
(26, 7, 'products/xmvkPA3IN0ZFpGXee1Ib4KOZCGV750mC5WjV6ipf.jpg', 0, 1, '2025-04-02 19:15:30', '2025-04-02 19:15:30'),
(27, 7, 'products/sxYsBGLKCKibAWQJZ1VBcLLhaUJnSuQFQmWsp1E0.jpg', 0, 2, '2025-04-02 19:15:30', '2025-04-02 19:15:30'),
(28, 7, 'products/QEpoa0S4HhJi9nv26QpLT5OVPMq2LaqsH2URtf5w.jpg', 0, 3, '2025-04-02 19:15:30', '2025-04-02 19:15:30'),
(29, 8, 'products/FYKax7pKGnqouQiKRwijwU2xPsycLSBe75RywHkw.jpg', 1, 0, '2025-04-02 19:18:56', '2025-04-02 19:18:56'),
(30, 8, 'products/ED3YyGq0RsQ53JdNxQMlu3oeJ12kF2fDLGwy3kkH.jpg', 0, 1, '2025-04-02 19:18:56', '2025-04-02 19:18:56'),
(31, 8, 'products/vUhXYMCj9miXoHUSX49BbX1mgcq6X1rjMWSoAvZv.jpg', 0, 2, '2025-04-02 19:18:56', '2025-04-02 19:18:56'),
(32, 8, 'products/OhJoJKRYpJLZpBWPsAblCn1Sa9PdB3dB2gxHpvSh.jpg', 0, 3, '2025-04-02 19:18:56', '2025-04-02 19:18:56'),
(33, 9, 'products/NZSkn9s31FICXmjEFljCScxZJiuWJkDQUEXsMXng.jpg', 0, 0, '2025-04-02 19:22:45', '2025-04-02 19:22:45'),
(34, 9, 'products/w7FseOAsMjDfyIPK8j4makrCAWDZyOiyyMHcPCue.jpg', 1, 1, '2025-04-02 19:22:45', '2025-04-02 19:22:45'),
(35, 9, 'products/RY19XpEzPS3tZoDXBOpVf3SpvbT1zMWfFnvEnBoU.jpg', 0, 2, '2025-04-02 19:22:45', '2025-04-02 19:22:45'),
(36, 9, 'products/FVyLSqDczziLGqtXvtzZL8Eqgx07GP7L4P8A3Ewr.jpg', 0, 3, '2025-04-02 19:22:45', '2025-04-02 19:22:45'),
(37, 10, 'products/6ntt30aa0Ep7QfB5myQEFXRe5epQRFTaSfuac2dg.jpg', 1, 0, '2025-04-02 19:25:21', '2025-04-02 19:25:21'),
(38, 10, 'products/Nd5J2xpvxYlNX1zmUTUruFSaN7g1cceqxAY8nQJG.jpg', 0, 1, '2025-04-02 19:25:21', '2025-04-02 19:25:21'),
(39, 10, 'products/VrATwyRadMa0TkH0dCBerfrHAdwzOKP4hCXa8cdi.jpg', 0, 2, '2025-04-02 19:25:21', '2025-04-02 19:25:21'),
(40, 10, 'products/Ny91Qwzp6mTWFXxxFXHqg0g8HS9Yl2j5QE8HENnu.jpg', 0, 3, '2025-04-02 19:25:21', '2025-04-02 19:25:21'),
(41, 11, 'products/cSsztVCoY5y7bBglljb5JhWZPK07dKgNZc3ska0I.jpg', 0, 0, '2025-04-02 19:28:57', '2025-04-02 19:28:57'),
(42, 11, 'products/8hzCVuNQGEDllmudr0Qpia8IBAHLliuK81eiQuhf.jpg', 1, 1, '2025-04-02 19:28:57', '2025-04-02 19:28:57'),
(43, 11, 'products/ORHHDnPKBQBBTU2yoA7tKAgyvkBtvgNslO3ox4QQ.jpg', 0, 2, '2025-04-02 19:28:57', '2025-04-02 19:28:57'),
(44, 11, 'products/JygPwkXcIByCQRYSJKFyCDaQ9cR3nFPiB7zXDM77.jpg', 0, 3, '2025-04-02 19:28:57', '2025-04-02 19:28:57'),
(45, 12, 'products/NLvAkhv5h6rCtv1KvQp09pYPRPUr0WC3X9AuGLjB.jpg', 0, 0, '2025-04-02 19:31:54', '2025-04-02 19:31:54'),
(46, 12, 'products/VkvSOxXPGnUiviwQdzjkt3FpiVSU85J0BIKzk7VG.jpg', 0, 1, '2025-04-02 19:31:54', '2025-04-02 19:31:54'),
(47, 12, 'products/oEUhq3SDIUrORSuvYv8EfIWB54j0ZWBEeeBQzOFi.jpg', 1, 2, '2025-04-02 19:31:54', '2025-04-02 19:31:54'),
(48, 12, 'products/8c33UwsODBgwTObcX4gJGIx6GV2H9ILwAVPgf5gC.jpg', 0, 3, '2025-04-02 19:31:54', '2025-04-02 19:31:54');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `estimated_delivery_days` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `name`, `description`, `cost`, `estimated_delivery_days`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'FoxPost', 'Az Önhöz legközelebb álló FoxPost csomagautomatába kérheti!', 1499.00, 3, 1, '2025-04-02 19:34:57', '2025-04-02 19:34:57'),
(2, 'MPL Postacsomag', 'Akár nagyméretű csomagot is kérhet!', 1299.00, 4, 1, '2025-04-02 19:36:35', '2025-04-02 19:36:35');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- A tábla indexei `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- A tábla indexei `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- A tábla indexei `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`);

--
-- A tábla indexei `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_items_cart_id_foreign` (`cart_id`),
  ADD KEY `cart_items_product_id_foreign` (`product_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`),
  ADD KEY `categories_parent_id_foreign` (`parent_id`);

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_post_id_foreign` (`post_id`),
  ADD KEY `comments_user_id_foreign` (`user_id`);

--
-- A tábla indexei `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_post_id_foreign` (`post_id`);

--
-- A tábla indexei `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `newsletter_subscribers_email_unique` (`email`),
  ADD KEY `newsletter_subscribers_user_id_foreign` (`user_id`);

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_status_id_foreign` (`status_id`),
  ADD KEY `orders_shipping_method_id_foreign` (`shipping_method_id`),
  ADD KEY `orders_payment_method_id_foreign` (`payment_method_id`);

--
-- A tábla indexei `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- A tábla indexei `order_statuses`
--
ALTER TABLE `order_statuses`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `order_status_histories`
--
ALTER TABLE `order_status_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_status_histories_order_id_foreign` (`order_id`),
  ADD KEY `order_status_histories_status_id_foreign` (`status_id`),
  ADD KEY `order_status_histories_user_id_foreign` (`user_id`);

--
-- A tábla indexei `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- A tábla indexei `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `posts_slug_unique` (`slug`),
  ADD KEY `posts_category_id_foreign` (`category_id`);

--
-- A tábla indexei `post_tag`
--
ALTER TABLE `post_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_tag_post_id_foreign` (`post_id`),
  ADD KEY `post_tag_tag_id_foreign` (`tag_id`);

--
-- A tábla indexei `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_categories_slug_unique` (`slug`);

--
-- A tábla indexei `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_foreign` (`product_id`);

--
-- A tábla indexei `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- A tábla indexei `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_slug_unique` (`slug`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT a táblához `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `media`
--
ALTER TABLE `media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `order_statuses`
--
ALTER TABLE `order_statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `order_status_histories`
--
ALTER TABLE `order_status_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `post_tag`
--
ALTER TABLE `post_tag`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT a táblához `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD CONSTRAINT `newsletter_subscribers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_payment_method_id_foreign` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `orders_shipping_method_id_foreign` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`),
  ADD CONSTRAINT `orders_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `order_statuses` (`id`),
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `order_status_histories`
--
ALTER TABLE `order_status_histories`
  ADD CONSTRAINT `order_status_histories_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_status_histories_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `order_statuses` (`id`),
  ADD CONSTRAINT `order_status_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `post_tag`
--
ALTER TABLE `post_tag`
  ADD CONSTRAINT `post_tag_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_tag_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
