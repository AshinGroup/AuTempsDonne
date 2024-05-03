CREATE DATABASE IF NOT EXISTS atd;

USE atd;

-- -- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
-- --
-- -- Host: 127.0.0.1    Database: test_pa
-- -- ------------------------------------------------------
-- -- Server version	8.0.32

-- /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
-- /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
-- /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
-- /*!50503 SET NAMES utf8mb4 */;
-- /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
-- /*!40103 SET TIME_ZONE='+00:00' */;
-- /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
-- /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
-- /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- --
-- -- Table structure for table `category`
-- --

-- DROP TABLE IF EXISTS `category`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `category` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `description` text,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `category`
-- --

-- INSERT INTO `category` (`id`, `name`, `description`) VALUES (1,'Category_0','Ceci est une catégorie'),(2,'Category_1','Ceci est une catégorie'),(3,'Category_2','Ceci est une catégorie');

-- --
-- -- Table structure for table `company`
-- --

-- DROP TABLE IF EXISTS `company`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `company` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `description` text,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `company`
-- --

-- INSERT INTO `company` (`id`, `name`, `description`) VALUES (1,'Company_0','Ceci est une entreprise'),(2,'Company_1','Ceci est une entreprise'),(3,'Company_2','Ceci est une entreprise');

-- --
-- -- Table structure for table `event`
-- --

-- DROP TABLE IF EXISTS `event`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `event` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `datetime` datetime DEFAULT NULL,
--   `description` text,
--   `capacity` int DEFAULT NULL,
--   `group` int DEFAULT NULL,
--   `place` varchar(200) DEFAULT NULL,
--   `type_id` int NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `type_id` (`type_id`),
--   CONSTRAINT `event_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `event`
-- --

-- INSERT INTO `event` (`id`, `name`, `datetime`, `description`, `capacity`, `group`, `place`, `type_id`) VALUES (1,'Event_0','2023-12-20 13:00:00','Ceci est un event',20,1,'Chez Franck',1),(2,'Event_1','2023-12-20 13:00:00','Ceci est un event',20,1,'Chez Franck',1),(3,'Event_2','2023-12-20 13:00:00','Ceci est un event',20,1,'Chez Franck',1),(4,'Event_3','2024-10-20 13:00:00','Ceci est un event',25,2,'Chez Fred',2),(5,'Event_4','2024-10-20 13:00:00','Ceci est un event',25,2,'Chez Fred',2),(6,'Event_5','2024-10-20 13:00:00','Ceci est un event',25,2,'Chez Fred',2),(7,'Event_6','2024-05-12 17:05:00','Ceci est un event',5,3,'Chez Gautier',3),(8,'Event_7','2024-05-12 17:05:00','Ceci est un event',5,3,'Chez Gautier',3),(9,'Event_8','2024-05-12 17:05:00','Ceci est un event',5,3,'Chez Gautier',3),(10,'Event_9','2024-05-12 17:05:00','Ceci est un event',5,3,'Chez Gautier',3);

-- --
-- -- Table structure for table `food`
-- --

-- DROP TABLE IF EXISTS `food`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `food` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `description` text,
--   `category_id` int NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `category_id` (`category_id`),
--   CONSTRAINT `food_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `food`
-- --

-- INSERT INTO `food` (`id`, `name`, `description`, `category_id`) VALUES (1,'Food_0','Ceci est de la bouffe',1),(2,'Food_1','Ceci est de la bouffe',1),(3,'Food_2','Ceci est de la bouffe',1),(4,'Food_3','Ceci est de la bouffe',2),(5,'Food_4','Ceci est de la bouffe',2),(6,'Food_5','Ceci est de la bouffe',2),(7,'Food_6','Ceci est de la bouffe',3),(8,'Food_7','Ceci est de la bouffe',3),(9,'Food_8','Ceci est de la bouffe',3),(10,'Food_9','Ceci est de la bouffe',3);

-- --
-- -- Table structure for table `location`
-- --

-- DROP TABLE IF EXISTS `location`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `location` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `address` varchar(100) DEFAULT NULL,
--   `zip_code` varchar(10) DEFAULT NULL,
--   `city` varchar(30) DEFAULT NULL,
--   `country` varchar(30) DEFAULT NULL,
--   `description` text,
--   `latitude` varchar(30) DEFAULT NULL,
--   `longitude` varchar(30) DEFAULT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `location`
-- --

-- INSERT INTO `location` (`id`, `address`, `zip_code`, `city`, `country`, `description`, `latitude`, `longitude`) VALUES (1,'Address_0','75010','Paris','France',NULL,NULL,NULL),(2,'Address_1','75010','Paris','France',NULL,NULL,NULL),(3,'Address_2','75010','Paris','France',NULL,NULL,NULL);

-- --
-- -- Table structure for table `package`
-- --

-- DROP TABLE IF EXISTS `package`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `package` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `weight` float DEFAULT NULL,
--   `description` text,
--   `expiration_date` datetime DEFAULT NULL,
--   `food_id` int NOT NULL,
--   `storage_id` int NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `food_id` (`food_id`),
--   KEY `storage_id` (`storage_id`),
--   CONSTRAINT `package_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
--   CONSTRAINT `package_ibfk_2` FOREIGN KEY (`storage_id`) REFERENCES `storage` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `package`
-- --

-- INSERT INTO `package` (`id`, `weight`, `description`, `expiration_date`, `food_id`, `storage_id`) VALUES (1,100,'Ceci est un paquet','2023-02-02 17:05:00',1,1),(2,100,'Ceci est un paquet','2023-02-02 17:05:00',2,1),(3,100,'Ceci est un paquet','2023-02-02 17:05:00',3,1),(4,250,'Ceci est un paquet','2026-10-18 17:05:00',4,2),(5,250,'Ceci est un paquet','2026-10-18 17:05:00',5,2),(6,250,'Ceci est un paquet','2026-10-18 17:05:00',6,2),(7,1000,'Ceci est un paquet','2025-03-30 17:05:00',7,3),(8,1000,'Ceci est un paquet','2025-03-30 17:05:00',8,3),(9,1000,'Ceci est un paquet','2025-03-30 17:05:00',9,3),(10,1000,'Ceci est un paquet','2025-03-30 17:05:00',10,3);

-- --
-- -- Table structure for table `role`
-- --

-- DROP TABLE IF EXISTS `role`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `role` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(15) DEFAULT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `role`
-- --

-- INSERT INTO `role` (`id`, `name`) VALUES (1,'Admin'),(2,'Volunteer'),(3,'Beneficiary');

-- --
-- -- Table structure for table `shop`
-- --

-- DROP TABLE IF EXISTS `shop`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `shop` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `company_id` int NOT NULL,
--   `location_id` int NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `company_id` (`company_id`),
--   KEY `location_id` (`location_id`),
--   CONSTRAINT `shop_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
--   CONSTRAINT `shop_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `shop`
-- --

-- INSERT INTO `shop` (`id`, `name`, `company_id`, `location_id`) VALUES (1,'Shop_1',1,1),(2,'Shop_2',2,2),(3,'Shop_3',3,3);

-- --
-- -- Table structure for table `storage`
-- --

-- DROP TABLE IF EXISTS `storage`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `storage` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `warehouse_id` int NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `warehouse_id` (`warehouse_id`),
--   CONSTRAINT `storage_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `storage`
-- --

-- INSERT INTO `storage` (`id`, `name`, `warehouse_id`) VALUES (1,'Storage_1',1),(2,'Storage_2',2),(3,'Storage_3',3);

-- --
-- -- Table structure for table `type`
-- --

-- DROP TABLE IF EXISTS `type`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `type` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `type`
-- --

-- INSERT INTO `type` (`id`, `name`) VALUES (1,'Fête'),(2,'Random'),(3,'RandomPlus');

-- --
-- -- Table structure for table `user`
-- --

-- DROP TABLE IF EXISTS `user`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `user` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `first_name` varchar(30) DEFAULT NULL,
--   `last_name` varchar(30) DEFAULT NULL,
--   `email` varchar(320) DEFAULT NULL,
--   `phone` varchar(50) DEFAULT NULL,
--   `password` varchar(64) DEFAULT NULL,
--   `status` int DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `email` (`email`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `user`
-- --

-- INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `phone`, `password`, `status`) VALUES (1,'Fred_0','Doux','fred0@gmail.com','0650505050','@Fredoudou123',1),(2,'Fred_1','Doux','fred1@gmail.com','0650505050','@Fredoudou123',1),(3,'Fred_2','Doux','fred2@gmail.com','0650505050','@Fredoudou123',1),(4,'Fred_3','Doux','fred3@gmail.com','0650505050','@Fredoudou123',0),(5,'Fred_4','Doux','fred4@gmail.com','0650505050','@Fredoudou123',0),(6,'Fred_5','Doux','fred5@gmail.com','0650505050','@Fredoudou123',0),(7,'Fred_6','Doux','fred6@gmail.com','0650505050','@Fredoudou123',0),(8,'Fred_7','Doux','fred7@gmail.com','0650505050','@Fredoudou123',0),(9,'Fred_8','Doux','fred8@gmail.com','0650505050','@Fredoudou123',0),(10,'Fred_9','Doux','fred9@gmail.com','0650505050','@Fredoudou123',0);

-- --
-- -- Table structure for table `user_is_role`
-- --

-- DROP TABLE IF EXISTS `user_is_role`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `user_is_role` (
--   `user_id` int NOT NULL,
--   `role_id` int NOT NULL,
--   PRIMARY KEY (`user_id`,`role_id`),
--   KEY `role_id` (`role_id`),
--   CONSTRAINT `user_is_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
--   CONSTRAINT `user_is_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `user_is_role`
-- --

-- INSERT INTO `user_is_role` (`user_id`, `role_id`) VALUES (1,1),(2,1),(3,1),(4,2),(5,2),(6,2),(7,3),(8,3),(9,3),(10,3);

-- --
-- -- Table structure for table `user_participates_event`
-- --

-- DROP TABLE IF EXISTS `user_participates_event`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `user_participates_event` (
--   `user_id` int NOT NULL,
--   `event_id` int NOT NULL,
--   PRIMARY KEY (`user_id`,`event_id`),
--   KEY `event_id` (`event_id`),
--   CONSTRAINT `user_participates_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
--   CONSTRAINT `user_participates_event_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `user_participates_event`
-- --

-- INSERT INTO `user_participates_event` (`user_id`, `event_id`) VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10);

-- --
-- -- Table structure for table `warehouse`
-- --

-- DROP TABLE IF EXISTS `warehouse`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `warehouse` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) DEFAULT NULL,
--   `location_id` int NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `location_id` (`location_id`),
--   CONSTRAINT `warehouse_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `warehouse`
-- --

-- INSERT INTO `warehouse` (`id`, `name`, `location_id`) VALUES (1,'Warehouse_1',1),(2,'Warehouse_2',2),(3,'Warehouse_3',3);
-- /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

-- /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
-- /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
-- /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
-- /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
-- /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
-- /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- -- Dump completed on 2024-04-18 22:45:43