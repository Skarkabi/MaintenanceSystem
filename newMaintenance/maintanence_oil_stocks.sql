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
-- Table structure for table `oil_stocks`
--

DROP TABLE IF EXISTS `oil_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oil_stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `oilSpec` varchar(255) NOT NULL,
  `typeOfOil` varchar(255) NOT NULL,
  `volume` double NOT NULL,
  `minVolume` double NOT NULL,
  `preferredBrand` varchar(255) NOT NULL,
  `oilPrice` double NOT NULL,
  `totalCost` double NOT NULL,
  `supplierId` int NOT NULL,
  `quotationNumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `oil_id_index` (`id`),
  KEY `oil_volume_index` (`volume`),
  KEY `oil_minVolume_index` (`minVolume`),
  KEY `oil_oilSpec_index` (`oilSpec`),
  KEY `oil_typeOfOil_index` (`typeOfOil`),
  KEY `oil_oilPrice_index` (`oilPrice`),
  KEY `oil_totalCost_index` (`totalCost`),
  KEY `oil_createdAt_index` (`createdAt`),
  KEY `oil_updatedAt_index` (`updatedAt`),
  KEY `oil_supplierId_index` (`supplierId`),
  KEY `oil_quotationNumber_index` (`quotationNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oil_stocks`
--

LOCK TABLES `oil_stocks` WRITE;
/*!40000 ALTER TABLE `oil_stocks` DISABLE KEYS */;
INSERT INTO `oil_stocks` VALUES (1,'20W50','PETROL ENGINE OIL',140,30,'NATIONAL LUBE',10.13,1418.2,2,'NA','2021-09-28 07:59:10','2021-09-28 07:59:10'),(2,'15W40','DIESEL ENGINE OIL',110,100,'WURTH',10.13,1013.0000000000001,2,'NA','2021-09-28 08:08:37','2021-09-28 08:18:47');
/*!40000 ALTER TABLE `oil_stocks` ENABLE KEYS */;
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
