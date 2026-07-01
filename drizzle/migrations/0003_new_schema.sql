-- Drop old tables
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `ical_feeds`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `cottages`;

-- Create new properties table (replaces cottages)
CREATE TABLE `properties` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `slug` varchar(64) NOT NULL UNIQUE,
  `nameFr` varchar(128) NOT NULL,
  `nameEn` varchar(128) NOT NULL,
  `nameNl` varchar(128) NOT NULL,
  `descriptionFr` text,
  `descriptionEn` text,
  `descriptionNl` text,
  `maxGuests` int NOT NULL DEFAULT 12,
  `bedrooms` int NOT NULL DEFAULT 4,
  `bathrooms` int NOT NULL DEFAULT 2,
  `basePriceWeeknight` decimal(10, 2) NOT NULL DEFAULT 300.00,
  `basePriceWeekend` decimal(10, 2) NOT NULL DEFAULT 400.00,
  `basePriceWeek` decimal(10, 2) NOT NULL DEFAULT 1900.00,
  `cleaningFee` decimal(10, 2) NOT NULL DEFAULT 150.00,
  `minimumStayNights` int NOT NULL DEFAULT 2,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create amenities table
CREATE TABLE `amenities` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `propertyId` int NOT NULL,
  `categoryFr` varchar(128) NOT NULL,
  `categoryEn` varchar(128) NOT NULL,
  `categoryNl` varchar(128) NOT NULL,
  `items` json NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE CASCADE
);

-- Create bookings table (updated for propertyId)
CREATE TABLE `bookings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `propertyId` int NOT NULL,
  `guestName` varchar(256) NOT NULL,
  `guestEmail` varchar(320) NOT NULL,
  `guestPhone` varchar(64),
  `guestCount` int NOT NULL DEFAULT 6,
  `checkIn` date NOT NULL,
  `checkOut` date NOT NULL,
  `totalAmount` decimal(10, 2) NOT NULL,
  `cleaningFee` decimal(10, 2) NOT NULL DEFAULT 150.00,
  `status` enum('pending', 'confirmed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  `stripePaymentIntentId` varchar(256),
  `stripeSessionId` varchar(256),
  `specialRequests` text,
  `gdprConsent` boolean NOT NULL DEFAULT false,
  `source` enum('direct', 'ical_import') NOT NULL DEFAULT 'direct',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE CASCADE
);

-- Create property_photos table
CREATE TABLE `property_photos` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `propertyId` int NOT NULL,
  `url` text NOT NULL,
  `caption` text,
  `displayOrder` int NOT NULL DEFAULT 0,
  `isHeroImage` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE CASCADE
);

-- Create ical_feeds table (updated for propertyId)
CREATE TABLE `ical_feeds` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `propertyId` int NOT NULL,
  `name` varchar(128) NOT NULL,
  `url` text NOT NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  `lastSyncedAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE CASCADE
);

-- Update enquiries table to use propertyId
ALTER TABLE `enquiries` CHANGE COLUMN `cottageId` `propertyId` int;
ALTER TABLE `enquiries` ADD FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE SET NULL;

-- Update blog_posts table to add Dutch columns
ALTER TABLE `blog_posts` ADD COLUMN `titleNl` varchar(256) AFTER `titleEn`;
ALTER TABLE `blog_posts` ADD COLUMN `descriptionNl` text AFTER `descriptionEn`;
ALTER TABLE `blog_posts` ADD COLUMN `contentNl` text AFTER `contentEn`;
ALTER TABLE `blog_posts` ADD COLUMN `categoryNl` varchar(64) DEFAULT 'Algemeen' AFTER `categoryEn`;

-- Insert the single property (Sève & Bois Escapes)
INSERT INTO `properties` (
  `slug`, `nameFr`, `nameEn`, `nameNl`, 
  `descriptionFr`, `descriptionEn`, `descriptionNl`,
  `maxGuests`, `bedrooms`, `bathrooms`,
  `basePriceWeeknight`, `basePriceWeekend`, `basePriceWeek`,
  `cleaningFee`, `minimumStayNights`, `isActive`
) VALUES (
  'seve-bois-escapes',
  'Sève & Bois Escapes',
  'Sève & Bois Escapes',
  'Sève & Bois Escapes',
  'Deux cottages écologiques luxueux dans les Ardennes belges, loués ensemble pour accueillir jusqu''à 12 hôtes.',
  'Two eco-luxury cottages in the Belgian Ardennes, rented together to accommodate up to 12 guests.',
  'Twee eco-luxe cottages in de Belgische Ardennen, samen verhuurd voor tot 12 gasten.',
  12, 4, 2,
  300.00, 400.00, 1900.00,
  150.00, 2, true
);

-- Insert amenities for the property
INSERT INTO `amenities` (`propertyId`, `categoryFr`, `categoryEn`, `categoryNl`, `items`) VALUES
(1, 'Équipements', 'Amenities', 'Voorzieningen', JSON_ARRAY(
  JSON_OBJECT('nameFr', 'WiFi', 'nameEn', 'WiFi', 'nameNl', 'WiFi', 'icon', 'wifi'),
  JSON_OBJECT('nameFr', 'Cuisine équipée', 'nameEn', 'Full Kitchen', 'nameNl', 'Volledig uitgeruste keuken', 'icon', 'utensils'),
  JSON_OBJECT('nameFr', 'Chauffage', 'nameEn', 'Heating', 'nameNl', 'Verwarming', 'icon', 'fire'),
  JSON_OBJECT('nameFr', 'Espace extérieur', 'nameEn', 'Outdoor Space', 'nameNl', 'Buitenruimte', 'icon', 'trees')
)),
(1, 'Enfants', 'Kids', 'Kinderen', JSON_ARRAY(
  JSON_OBJECT('nameFr', 'Jeux de société', 'nameEn', 'Board Games', 'nameNl', 'Bordspellen', 'icon', 'gamepad2'),
  JSON_OBJECT('nameFr', 'Espace jeux', 'nameEn', 'Play Area', 'nameNl', 'Speelruimte', 'icon', 'smile')
)),
(1, 'Bébé', 'Baby', 'Baby', JSON_ARRAY(
  JSON_OBJECT('nameFr', 'Lit pliant', 'nameEn', 'Foldable Cot', 'nameNl', 'Opvouwbaar bedje', 'icon', 'bed'),
  JSON_OBJECT('nameFr', 'Chaise haute pliante', 'nameEn', 'Foldable High Chair', 'nameNl', 'Opvouwbare kinderstoel', 'icon', 'chair')
));
