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
-- Table structure for table `filter_stocks`
--

DROP TABLE IF EXISTS `filter_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filter_stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plateNumber` varchar(255) NOT NULL,
  `fType` varchar(255) NOT NULL,
  `preferredBrand` varchar(255) NOT NULL,
  `actualBrand` varchar(255) NOT NULL,
  `singleCost` double DEFAULT NULL,
  `totalCost` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `minQuantity` int DEFAULT NULL,
  `supplierId` int NOT NULL,
  `quotationNumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `filter_id_index` (`id`),
  KEY `filter_quantity_index` (`quantity`),
  KEY `filter_plateNumber_index` (`plateNumber`),
  KEY `filter_fType_index` (`fType`),
  KEY `filter_preferredBrand_index` (`preferredBrand`),
  KEY `filter_actualBrand_index` (`actualBrand`),
  KEY `filter_singleCost_index` (`singleCost`),
  KEY `filter_totalCost_index` (`totalCost`),
  KEY `filter_minQuantity_index` (`minQuantity`),
  KEY `filter_createdAt_index` (`createdAt`),
  KEY `filter_updatedAt_index` (`updatedAt`),
  KEY `filter_supplierId_index` (`supplierId`),
  KEY `filter_quotationNumber_index` (`quotationNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filter_stocks`
--

LOCK TABLES `filter_stocks` WRITE;
/*!40000 ALTER TABLE `filter_stocks` DISABLE KEYS */;
INSERT INTO `filter_stocks` VALUES (1,'69512','OIL FILTER','OSK-0-7320 / ME013307','OSK-0-7320 / ME013307',13.65,122.85000000000001,9,2,10,'','2021-09-27 08:05:08','2021-09-27 08:05:08'),(2,'69512','DIESEL FILTER','OSK-F-7320 / ME016823','OSK-F-7320 / ME016823',10.5,42,4,2,10,'','2021-09-27 08:19:54','2021-09-27 08:19:54'),(3,'81955','oil filter','MITSUBISHI MOTORS-MZ690115','MITSUBISHI MOTORS-MZ690115',15.75,110.25,7,2,2,'','2021-09-27 11:37:53','2021-09-27 11:37:53'),(4,'52674','oil filter','KIA GENUINE PARTS-2630035505','KIA GENUINE PARTS-2630035505',12.6,75.6,6,2,2,'','2021-09-27 11:43:08','2021-09-27 11:43:08'),(5,'88342','oil filter','TOYOTA GENIUINE PARTS / 04152-31090','TOYOTA GENIUINE PARTS / 04152-31090',15.75,15.75,1,2,2,'','2021-09-27 11:48:38','2021-09-27 11:48:38'),(6,'28190','oil filter','TOYOTA GENIUINE PARTS / 04152-37010','TOYOTA GENIUINE PARTS / 04152-37010',15.75,78.75,5,2,2,'','2021-09-27 11:49:57','2021-09-27 11:49:57'),(7,'87065','AIR FILTER','QMP / P/NO : 28113-C1100','QMP / P/NO : 28113-C1100',52.5,262.5,5,2,2,'','2021-09-27 12:41:58','2021-09-27 12:41:58'),(8,'52674','A/C FILTER','QMP / P/NO : 97133-C4000','QMP / P/NO : 97133-C4000',78.75,630,8,2,2,'','2021-09-27 12:45:41','2021-09-27 12:45:41'),(9,'1','oil filter','CAT-32A4000400C','CAT-32A4000400C',7.5,52.5,7,3,2,'','2021-09-28 05:42:13','2021-09-28 05:42:13'),(10,'69512','OIL FILTER','OSK-0-7320 / ME013307','OSK-0-7320 / ME013307',10.5,10.5,1,2,10,'','2021-09-30 11:23:05','2021-09-30 11:23:05');
/*!40000 ALTER TABLE `filter_stocks` ENABLE KEYS */;
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
