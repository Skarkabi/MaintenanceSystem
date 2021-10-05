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
  `id` int NOT NULL AUTO_INCREMENT,
  `batSpec` varchar(255) NOT NULL,
  `minQuantity` varchar(255) NOT NULL,
  `singleCost` double DEFAULT NULL,
  `totalCost` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `supplierId` int NOT NULL,
  `quotationNumber` varchar(255) NOT NULL,
  `serialNumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `battery_id_index` (`id`),
  KEY `battery_quantity_index` (`quantity`),
  KEY `battery_batSpec_index` (`batSpec`),
  KEY `battery_minQuantity_index` (`minQuantity`),
  KEY `brake_singleCost_index` (`singleCost`),
  KEY `brake_totalCost_index` (`totalCost`),
  KEY `battery_createdAt_index` (`createdAt`),
  KEY `battery_updatedAt_index` (`updatedAt`),
  KEY `battery_supplierId_index` (`supplierId`),
  KEY `battery_serialNumber_index` (`serialNumber`),
  KEY `battery_quotationNumber_index` (`quotationNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battery_stocks`
--

LOCK TABLES `battery_stocks` WRITE;
/*!40000 ALTER TABLE `battery_stocks` DISABLE KEYS */;
INSERT INTO `battery_stocks` VALUES (1,'110 AH','4',2,2,1,2,'N/A','TEST','2021-09-27 08:05:08','2021-09-27 08:05:08'),(2,'110 AH','4',2,2,1,1,'N/A','TEST','2021-09-27 08:05:08','2021-09-27 08:05:08'),(6,'110 AH','4',2,2,1,2,'N/A','B1','2021-10-03 06:32:02','2021-10-03 06:32:02'),(7,'536 AH','1',52.5,52.5,1,2,'N/A','B2','2021-10-03 06:32:02','2021-10-03 06:32:02');
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

-- Dump completed on 2021-10-05 10:56:02
