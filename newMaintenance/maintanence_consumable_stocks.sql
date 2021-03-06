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
-- Table structure for table `consumable_stocks`
--

DROP TABLE IF EXISTS `consumable_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumable_stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `quantity` double DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consumable_id_index` (`id`),
  KEY `consumable_category_index` (`category`),
  KEY `consumable_quantity_index` (`quantity`),
  KEY `consumable_createdAt_index` (`createdAt`),
  KEY `consumable_updatedAt_index` (`updatedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumable_stocks`
--

LOCK TABLES `consumable_stocks` WRITE;
/*!40000 ALTER TABLE `consumable_stocks` DISABLE KEYS */;
INSERT INTO `consumable_stocks` VALUES (2,'filter',53,'2021-09-27 08:05:09','2021-09-30 11:23:05'),(4,'REFRIGERANT GAS',1,'2021-09-27 12:35:53','2021-09-27 12:35:53'),(5,'CANTER AC COMPRESSOR',5,'2021-09-27 12:38:14','2021-09-27 12:38:14'),(7,'grease',12,'2021-09-28 06:08:54','2021-09-28 06:08:54'),(8,'oil',239,'2021-09-28 07:59:11','2021-09-28 08:18:47'),(9,'battery',3,'2021-09-28 07:59:11','2021-10-03 06:32:02'),(10,'brake',1,'2021-09-29 11:37:49','2021-09-29 11:37:49');
/*!40000 ALTER TABLE `consumable_stocks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-05 10:56:01
