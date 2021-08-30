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
-- Table structure for table `grease_stocks`
--

DROP TABLE IF EXISTS `grease_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grease_stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `greaseSpec` varchar(255) NOT NULL,
  `typeOfGrease` varchar(255) NOT NULL,
  `carBrand` varchar(255) NOT NULL,
  `carYear` varchar(255) NOT NULL,
  `volume` double NOT NULL,
  `minVolume` double NOT NULL,
  `supplierId` int NOT NULL,
  `quotationNumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `price_per_litter` double NOT NULL,
  `totalCost` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `grease_id_index` (`id`),
  KEY `grease_volume_index` (`volume`),
  KEY `grease_minVolume_index` (`minVolume`),
  KEY `grease_greaseSpec_index` (`greaseSpec`),
  KEY `grease_carBrand_index` (`carBrand`),
  KEY `grease_carYear_index` (`carYear`),
  KEY `grease_typeOfGrease_index` (`typeOfGrease`),
  KEY `grease_createdAt_index` (`createdAt`),
  KEY `grease_updatedAt_index` (`updatedAt`),
  KEY `grease_supplierId_index` (`supplierId`),
  KEY `grease_quotationNumber_index` (`quotationNumber`),
  KEY `grease_total_price_index` (`totalCost`),
  KEY `grease_price_per_litter_index` (`price_per_litter`),
  KEY `grease_totalCost_index` (`totalCost`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grease_stocks`
--

LOCK TABLES `grease_stocks` WRITE;
/*!40000 ALTER TABLE `grease_stocks` DISABLE KEYS */;
INSERT INTO `grease_stocks` VALUES (1,'tester','tester','Ford','2020',10,1,1,'N/A','2021-07-26 12:19:43','2021-08-17 13:20:21',10,100),(2,'NEW','NEW','MITSUBISHI','2018',15,10,1,'N/A','2021-08-18 15:49:02','2021-08-22 15:56:27',10,900);
/*!40000 ALTER TABLE `grease_stocks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-26 11:32:04