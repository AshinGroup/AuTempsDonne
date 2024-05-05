CREATE DATABASE IF NOT EXISTS atd;

USE atd;


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : ven. 03 mai 2024 à 16:05
-- Version du serveur : 8.4.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `atd`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name`, `description`) VALUES
(1, 'Confiserie', 'Bonbons, chocolats etc.'),
(2, 'Légume', 'Les légumes c\'est bien'),
(3, 'Fruit', 'Les fruits c\'est biennnnnnnn'),
(4, 'Boisson', 'Boire, c\'et important');

-- --------------------------------------------------------

--
-- Structure de la table `collect`
--

CREATE TABLE `collect` (
  `id` int NOT NULL,
  `datetime` datetime DEFAULT NULL,
  `roadmap` varchar(200) DEFAULT NULL,
  `vehicle_id` int NOT NULL,
  `storage_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `collect`
--

INSERT INTO `collect` (`id`, `datetime`, `roadmap`, `vehicle_id`, `storage_id`) VALUES
(1, '2023-12-10 10:00:00', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `collects_demand`
--

CREATE TABLE `collects_demand` (
  `demand_id` int NOT NULL,
  `collect_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `company`
--

CREATE TABLE `company` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `company`
--

INSERT INTO `company` (`id`, `name`, `description`) VALUES
(1, 'Metro', 'Entreprise Metro'),
(2, 'Leclerc', 'Entreprise Leclerc'),
(3, 'Intermarché', 'Entreprise Intermaché');

-- --------------------------------------------------------

--
-- Structure de la table `delivers_to_location`
--

CREATE TABLE `delivers_to_location` (
  `location_id` int NOT NULL,
  `delivery_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `delivers_to_location`
--

INSERT INTO `delivers_to_location` (`location_id`, `delivery_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(1, 2),
(2, 2),
(6, 2),
(7, 2);

-- --------------------------------------------------------

--
-- Structure de la table `delivery`
--

CREATE TABLE `delivery` (
  `id` int NOT NULL,
  `datetime` datetime DEFAULT NULL,
  `roadmap` varchar(200) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `vehicle_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `delivery`
--

INSERT INTO `delivery` (`id`, `datetime`, `roadmap`, `status`, `vehicle_id`) VALUES
(1, '2023-12-10 10:00:00', NULL, 0, 1),
(2, '2023-12-10 10:00:00', NULL, 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `demand`
--

CREATE TABLE `demand` (
  `id` int NOT NULL,
  `submitted_datetime` datetime DEFAULT NULL,
  `limit_datetime` datetime DEFAULT NULL,
  `status` int DEFAULT NULL,
  `additional` text,
  `collect_id` int DEFAULT NULL,
  `shop_id` int NOT NULL,
  `qr_code` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `demand`
--

INSERT INTO `demand` (`id`, `submitted_datetime`, `limit_datetime`, `status`, `additional`, `collect_id`, `shop_id`, `qr_code`) VALUES
(1, '2024-05-03 15:59:24', '2023-12-10 10:00:00', 0, 'blabla', 1, 1, 'https://s3.eu-west-2.wasabisys.com/au-temps-donnee/qrcode/qr-code_2024-05-03_15_59_060478.png'),
(2, '2024-05-03 15:59:49', '2023-10-10 10:00:00', 0, 'blabla', 1, 2, 'https://s3.eu-west-2.wasabisys.com/au-temps-donnee/qrcode/qr-code_2024-05-03_15_59_318559.png');

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `description` text,
  `capacity` int DEFAULT NULL,
  `group` int DEFAULT NULL,
  `place` varchar(200) DEFAULT NULL,
  `type_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `event` (`id`, `name`, `datetime`, `description`, `capacity`, `group`, `place`, `type_id`) VALUES
(1, 'Rencontre avec les personnes en difficulté', '2023-10-12 13:00:00', 'Rencontre avec les personnes en difficulté', 15, 1, '100 Avenue de la Douane, 75012 Paris', 1),
(2, 'Apprendre à parler aux gens', '2024-05-20 10:00:00', 'Cours afin d\'apprendre à mieux parler aux gens', 30, 2, '93 Boulevard de la Honte, 75001 Paris', 2),
(3, 'Transport de Meubles', '2024-05-25 10:00:00', 'Aider une famille à transporter des meubles', 5, 1, '12 Rue de la Poule, 75017 Paris', 1);

-- --------------------------------------------------------

--
-- Structure de la table `food`
--

CREATE TABLE `food` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `food`
--

INSERT INTO `food` (`id`, `name`, `description`, `category_id`) VALUES
(1, 'Dragibus Haribot', 'Dragibus Haribot Waw OMG TROP BON', 1),
(2, 'Kinder Bueno', 'Kinder Bueno c\'est la vie', 1),
(3, 'B-Ready Nutella', 'Hmmmmmmmm les barres de b-ready', 1),
(4, 'Coca Cola Canettes', 'A consommer avec modération', 4),
(5, 'Ice Tea', 'Vive le thé', 4),
(6, 'Eau Evian', 'L\'eau c\'est trop bon', 4),
(7, 'Carottes', 'Les carottes', 2),
(8, 'Aubergines', 'Les auau', 2),
(9, 'Pomme', 'Pommeuuuuuuuu', 3),
(10, 'Banane', 'BANANA !!!!', 3);

-- --------------------------------------------------------

--
-- Structure de la table `location`
--

CREATE TABLE `location` (
  `id` int NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `country` varchar(30) DEFAULT NULL,
  `description` text,
  `latitude` varchar(30) DEFAULT NULL,
  `longitude` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `location`
--

INSERT INTO `location` (`id`, `address`, `zip_code`, `city`, `country`, `description`, `latitude`, `longitude`) VALUES
(1, 'Parc des Buttes de Chaumont', '75019', 'Paris', 'France', 'Botzaris - Parc des Buttes Chaumont, Rue Botzaris, Quartier du Combat, 19th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75019, France', '48.8779502', '2.3814623'),
(2, '28 Boulevard de Magenta', '75019', 'Paris', 'France', '28, Boulevard de Magenta, Quartier de la Porte-Saint-Martin, 10th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75010, France', '48.8705439', '2.3614407'),
(3, '69 Avenue de France', '75019', 'Paris', 'France', '69, Avenue de France, Quartier de la Gare, 13th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75013, France', '48.8296403', '2.3775887'),
(4, 'Ranelagh', '75016', 'Paris', 'France', 'Ranelagh, Rue du Ranelagh, Quartier de la Muette, 16th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75016, France', '48.8555764', '2.2702166'),
(5, 'Paris La défense Arena', '92000', 'Nanterre', 'France', 'Paris La Défense Arena, 99, Rue des Longues Raies, La Défense 7, Quartier du Parc Nord, Nanterre, Arrondissement of Nanterre, Hauts-de-Seine, Ile-de-France, Metropolitan France, 92000, France', '48.89567665', '2.229658055848475'),
(6, 'Gennevilliers', '92230', 'Gennevilliers', 'France', 'Gennevilliers, Avenue du Général de Gaulle, Le Village, Gennevilliers, Arrondissement of Nanterre, Hauts-de-Seine, Ile-de-France, Metropolitan France, 92230, France', '48.9336452', '2.3075935'),
(7, '3 Rue Meissonnier', '93500', 'Pantin', 'France', 'Cartel de Belleville, 3, Rue Meissonnier, Cité des Auteurs, Église, Pantin, Bobigny, Seine-Saint-Denis, Ile-de-France, Metropolitan France, 93500, France', '48.8886553', '2.4130258'),
(8, '17 Rue Yves Toudic', '75010', 'Paris', 'France', 'Lycée Bossuet Notre-Dame, 17, Rue Yves Toudic, Quartier de la Porte-Saint-Martin, 10th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75010, France', '48.8703401', '2.3630653870564453');

-- --------------------------------------------------------

--
-- Structure de la table `package`
--

CREATE TABLE `package` (
  `id` int NOT NULL,
  `weight` float DEFAULT NULL,
  `description` text,
  `expiration_date` datetime DEFAULT NULL,
  `food_id` int NOT NULL,
  `storage_id` int NOT NULL,
  `delivery_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `package`
--

INSERT INTO `package` (`id`, `weight`, `description`, `expiration_date`, `food_id`, `storage_id`, `delivery_id`) VALUES
(1, 500, 'Paquet', '2025-10-12 00:00:00', 1, 1, 1),
(2, 2500, 'Paquet', '2025-10-10 00:00:00', 3, 10, 1),
(3, 500, 'Paquet', '2025-10-12 00:00:00', 1, 1, 1),
(4, 500, 'Paquet', '2025-10-12 00:00:00', 1, 1, 1),
(5, 2500, 'Paquet', '2025-10-12 00:00:00', 2, 2, 2),
(6, 2500, 'Paquet', '2025-10-12 00:00:00', 2, 2, 2),
(7, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 2, 2),
(8, 2500, 'Paquet', '2025-10-12 00:00:00', 5, 2, 2),
(9, 2500, 'Paquet', '2025-10-12 00:00:00', 4, 2, NULL),
(10, 2500, 'Paquet', '2025-10-12 00:00:00', 4, 3, NULL),
(11, 2500, 'Paquet', '2025-10-12 00:00:00', 4, 4, NULL),
(12, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 4, NULL),
(13, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 5, NULL),
(14, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 8, NULL),
(15, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 8, NULL),
(16, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 8, NULL),
(17, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 9, NULL),
(18, 2500, 'Paquet', '2025-10-12 00:00:00', 3, 10, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Volontaire'),
(3, 'Bénéficiaire'),
(4, 'Commerçant');

-- --------------------------------------------------------

--
-- Structure de la table `shop`
--

CREATE TABLE `shop` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `company_id` int NOT NULL,
  `location_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `shop`
--

INSERT INTO `shop` (`id`, `name`, `company_id`, `location_id`) VALUES
(1, 'Intermarché Magenta', 3, 2),
(2, 'Intermarché XX', 3, 3),
(3, 'Intermarché XX', 3, 7),
(4, 'Intermarché XX', 3, 8);

-- --------------------------------------------------------

--
-- Structure de la table `storage`
--

CREATE TABLE `storage` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `warehouse_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `storage`
--

INSERT INTO `storage` (`id`, `name`, `warehouse_id`) VALUES
(1, 'Rangement A', 1),
(2, 'Rangement B', 1),
(3, 'Rangement C', 1),
(4, 'Rangement D', 1),
(5, 'Rangement E', 1),
(6, 'Rangement A', 2),
(7, 'Rangement B', 2),
(8, 'Rangement C', 2),
(9, 'Rangement D', 2),
(10, 'Rangement E', 2);

-- --------------------------------------------------------

--
-- Structure de la table `type`
--

CREATE TABLE `type` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `type`
--

INSERT INTO `type` (`id`, `name`) VALUES
(1, 'Aide'),
(2, 'Apprentissage'),
(3, 'Manque d\'inspi'),
(4, 'Rencontre');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `shop_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `phone`, `password`, `status`, `shop_id` ) VALUES
(1, 'Admin', 'Admin', 'admin@atd.com', '00000000', '$5$A5bRoRfHWyvxSSsz$BidD44Qfi3GXV3sEoU5szwHYa4fCh/lPIwX4TVGwEL.', 1, NULL),
(2, 'Volontaire', 'Volontaire', 'volontaire@atd.com', '00000000', '$5$gljAzkQyhK8lSSXt$6bUjWBIX5GdLtSQ2EJeTI2QROaFrxP9wc5laZaRDCR6', 1, NULL),
(3, 'Commercant', 'Commercant', 'commercant@atd.com', '00000000', '$5$C7QRhTR4KAgf9mGl$sMp1BumVFRdTeFIZ2jl14lexuIu88i7EYxUoxHZz6P0', 1, NULL),
(4, 'Beneficiaire', 'Beneficiaire', 'beneficiaire@atd.com', '00000000', '$5$glu9CRjugSMXQM2q$F4lrVrPEtLe/9RcCAmKsQnSf5Qk0Y/dhA8.JrfS1BD8', 1, NULL),
(5, 'Fredoudou', 'Doux', 'fredoudou@atd.com', '00000000', '$5$QKfEPlY6E31psNXi$VWTJZYOHGluNOHBQO2gDOVxOrNIifOlt9ECsYrFgIK5', 1, NULL),
(6, 'Goat', 'Yié', 'goat@atd.com', '00000000', '$5$D3udawwqJRFNrp48$RT7wOce99C4rUcXHhXjc4gzPE5xLITX3zRqq.DGpZn7', 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_collects`
--

CREATE TABLE `user_collects` (
  `user_id` int NOT NULL,
  `collect_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_delivers`
--

CREATE TABLE `user_delivers` (
  `user_id` int NOT NULL,
  `delivery_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_is_role`
--

CREATE TABLE `user_is_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_is_role`
--

INSERT INTO `user_is_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2),
(5, 2),
(6, 2),
(4, 3),
(3, 4);

-- --------------------------------------------------------

--
-- Structure de la table `user_participates_event`
--

CREATE TABLE `user_participates_event` (
  `user_id` int NOT NULL,
  `event_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_participates_event`
--

INSERT INTO `user_participates_event` (`user_id`, `event_id`) VALUES
(2, 1),
(5, 1),
(6, 1),
(2, 2),
(5, 2),
(6, 2),
(2, 3),
(5, 3),
(6, 3);

-- --------------------------------------------------------

--
-- Structure de la table `vehicle`
--

CREATE TABLE `vehicle` (
  `id` int NOT NULL,
  `license_plate` varchar(15) DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `type` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `vehicle`
--

INSERT INTO `vehicle` (`id`, `license_plate`, `brand`, `type`) VALUES
(1, 'GV-365-OO', 'Mercedes-Benz', 1),
(2, 'TZ-132-ZZ', 'Mercedes-Benz', 1),
(3, 'SZ-921-IU', 'Peugeot', 1),
(4, 'TR-921-IU', 'Peugeot', 1),
(5, 'TV-212-XU', 'Yamaha', 2),
(6, 'CE-472-KX', 'Citroen', 3),
(7, 'BT-731-AC', 'Citroen', 3);

-- --------------------------------------------------------

--
-- Structure de la table `warehouse`
--

CREATE TABLE `warehouse` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `location_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `warehouse`
--

INSERT INTO `warehouse` (`id`, `name`, `location_id`) VALUES
(1, 'Laon', 4),
(2, 'Saint-Quentin', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `collect`
--
ALTER TABLE `collect`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `storage_id` (`storage_id`);

--
-- Index pour la table `collects_demand`
--
ALTER TABLE `collects_demand`
  ADD PRIMARY KEY (`demand_id`,`collect_id`),
  ADD KEY `collect_id` (`collect_id`);

--
-- Index pour la table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `delivers_to_location`
--
ALTER TABLE `delivers_to_location`
  ADD PRIMARY KEY (`location_id`,`delivery_id`),
  ADD KEY `delivery_id` (`delivery_id`);

--
-- Index pour la table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Index pour la table `demand`
--
ALTER TABLE `demand`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collect_id` (`collect_id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`);

--
-- Index pour la table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Index pour la table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `package`
--
ALTER TABLE `package`
  ADD PRIMARY KEY (`id`),
  ADD KEY `food_id` (`food_id`),
  ADD KEY `storage_id` (`storage_id`),
  ADD KEY `delivery_id` (`delivery_id`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Index pour la table `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Index pour la table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Index pour la table `user_collects`
--
ALTER TABLE `user_collects`
  ADD PRIMARY KEY (`user_id`,`collect_id`),
  ADD KEY `collect_id` (`collect_id`);

--
-- Index pour la table `user_delivers`
--
ALTER TABLE `user_delivers`
  ADD PRIMARY KEY (`user_id`,`delivery_id`),
  ADD KEY `delivery_id` (`delivery_id`);

--
-- Index pour la table `user_is_role`
--
ALTER TABLE `user_is_role`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Index pour la table `user_participates_event`
--
ALTER TABLE `user_participates_event`
  ADD PRIMARY KEY (`user_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Index pour la table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `collect`
--
ALTER TABLE `collect`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `company`
--
ALTER TABLE `company`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `demand`
--
ALTER TABLE `demand`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `food`
--
ALTER TABLE `food`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `location`
--
ALTER TABLE `location`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `package`
--
ALTER TABLE `package`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `shop`
--
ALTER TABLE `shop`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `storage`
--
ALTER TABLE `storage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `type`
--
ALTER TABLE `type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `collect`
--
ALTER TABLE `collect`
  ADD CONSTRAINT `collect_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`id`),
  ADD CONSTRAINT `collect_ibfk_2` FOREIGN KEY (`storage_id`) REFERENCES `storage` (`id`);

--
-- Contraintes pour la table `collects_demand`
--
ALTER TABLE `collects_demand`
  ADD CONSTRAINT `collects_demand_ibfk_1` FOREIGN KEY (`demand_id`) REFERENCES `demand` (`id`),
  ADD CONSTRAINT `collects_demand_ibfk_2` FOREIGN KEY (`collect_id`) REFERENCES `collect` (`id`);

--
-- Contraintes pour la table `delivers_to_location`
--
ALTER TABLE `delivers_to_location`
  ADD CONSTRAINT `delivers_to_location_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  ADD CONSTRAINT `delivers_to_location_ibfk_2` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`);

--
-- Contraintes pour la table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`id`);

--
-- Contraintes pour la table `demand`
--
ALTER TABLE `demand`
  ADD CONSTRAINT `demand_ibfk_1` FOREIGN KEY (`collect_id`) REFERENCES `collect` (`id`),
  ADD CONSTRAINT `demand_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`);

--
-- Contraintes pour la table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`);

--
-- Contraintes pour la table `food`
--
ALTER TABLE `food`
  ADD CONSTRAINT `food_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Contraintes pour la table `package`
--
ALTER TABLE `package`
  ADD CONSTRAINT `package_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
  ADD CONSTRAINT `package_ibfk_2` FOREIGN KEY (`storage_id`) REFERENCES `storage` (`id`),
  ADD CONSTRAINT `package_ibfk_3` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`);

--
-- Contraintes pour la table `shop`
--
ALTER TABLE `shop`
  ADD CONSTRAINT `shop_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  ADD CONSTRAINT `shop_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`);

--
-- Contraintes pour la table `storage`
--
ALTER TABLE `storage`
  ADD CONSTRAINT `storage_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`);

--
-- Contraintes pour la table `user_collects`
--
ALTER TABLE `user_collects`
  ADD CONSTRAINT `user_collects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_collects_ibfk_2` FOREIGN KEY (`collect_id`) REFERENCES `collect` (`id`);

--
-- Contraintes pour la table `user_delivers`
--
ALTER TABLE `user_delivers`
  ADD CONSTRAINT `user_delivers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_delivers_ibfk_2` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`);

--
-- Contraintes pour la table `user_is_role`
--
ALTER TABLE `user_is_role`
  ADD CONSTRAINT `user_is_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_is_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Contraintes pour la table `user_participates_event`
--
ALTER TABLE `user_participates_event`
  ADD CONSTRAINT `user_participates_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_participates_event_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`);

--
-- Contraintes pour la table `warehouse`
--
ALTER TABLE `warehouse`
  ADD CONSTRAINT `warehouse_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
