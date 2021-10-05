-- MySQL dump 10.13  Distrib 8.0.25, for macos11 (x86_64)
--
-- Host: localhost    Database: maintanence
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id_index` (`id`),
  KEY `supplier_name_index` (`name`),
  KEY `supplier_phone_index` (`phone`),
  KEY `supplier_email_index` (`email`),
  KEY `supplier_category_index` (`category`),
  KEY `supplier_brand_index` (`brand`),
  KEY `supplier_createdAt_index` (`createdAt`),
  KEY `supplier_updatedAt_index` (`updatedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'SWAIDAN TRADING CO . LLC','056-879-8278','hew.stc@alnadoodah.com','BUS','MAXSUS','2021-09-05 06:07:24','2021-09-05 06:07:24'),(2,'TMI STOCK','056-684-7422','maintenance@tmico.ae','ALL','ALL','2021-09-06 09:27:15','2021-09-06 09:27:15'),(3,'AL MOUHEIRY ','056-684-7422','whnein@tmico.ae','ALL','ALL','2021-09-08 12:28:08','2021-09-08 12:28:08'),(4,'PUBLIC SPARE PARTS','052-909-2127','branch03@publicspares.com','car','kia cerato','2021-09-11 06:39:28','2021-09-11 06:39:28'),(5,'GREEN HOUSE TYRE REPAIRS','050-248-1893','zaheersherif@gmail.com','car','kia cerato','2021-09-11 07:33:01','2021-09-11 07:33:01'),(6,'MEMORY SPARE PARTS','050-327-3565','maintenance@tmico.ae','car','kia cerato','2021-09-11 08:38:41','2021-09-11 08:38:41'),(7,'MURREE TRADING CO','020-555-9385','muree@emirates.net.ae','BUS','MITSUBISHI','2021-09-16 09:59:59','2021-09-16 09:59:59'),(8,'AL SAQAF AUTO PARTS','020-558-5966','alsaqafatoprts@gmail.com','car','optima','2021-09-16 10:31:15','2021-09-16 10:31:15'),(9,'AL-SHAMS FASTENERS','002-554-4016','adnan.vahla@hotmail.com','general','ALL','2021-09-19 04:51:26','2021-09-19 04:51:26'),(10,'AL SHAAB NEW SPARE PARTS SHOP','002-555-3310','alshaabspare@gmail.com','ALL','ALL','2021-09-27 08:01:39','2021-09-27 08:01:39');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-05 10:56:02
