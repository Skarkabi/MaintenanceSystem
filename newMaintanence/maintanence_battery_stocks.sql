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
-- Table structure for table `battery_stocks`
--

DROP TABLE IF EXISTS `battery_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `battery_stocks` (
  `batSpec` varchar(20) NOT NULL,
  `carBrand` varchar(20) NOT NULL,
  `carYear` varchar(20) NOT NULL,
  `quantity` int NOT NULL,
  `minQuantity` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `battery_id_index` (`id`),
  KEY `battery_quantity_index` (`quantity`),
  KEY `battery_batSpec_index` (`batSpec`),
  KEY `battery_carBrand_index` (`carBrand`),
  KEY `battery_carYear_index` (`carYear`),
  KEY `battery_minQuantity_index` (`minQuantity`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`),
  KEY `battery_createdAt_index` (`createdAt`),
  KEY `battery_updatedAt_index` (`updatedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battery_stocks`
--

LOCK TABLES `battery_stocks` WRITE;
/*!40000 ALTER TABLE `battery_stocks` DISABLE KEYS */;
INSERT INTO `battery_stocks` VALUES ('85 AH ','0','0',0,1,8,NULL,'2021-06-15 05:46:44'),('70 AH','0','0',15,2,9,NULL,NULL),('225 AH','0','0',58,22,10,NULL,NULL),('110 AH','0','0',5,2,11,NULL,'2021-06-13 11:55:19'),('110 AH','KIA','2019',0,5,12,'2021-06-13 12:06:44','2021-06-13 12:53:51'),('70 AH','FORD','2020',153,10,13,'2021-06-14 07:46:56','2021-06-15 05:42:26');
/*!40000 ALTER TABLE `battery_stocks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-15 11:24:17
