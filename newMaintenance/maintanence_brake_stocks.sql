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
-- Table structure for table `brake_stocks`
--

DROP TABLE IF EXISTS `brake_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brake_stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `carBrand` varchar(255) NOT NULL,
  `carYear` varchar(255) NOT NULL,
  `bBrand` varchar(255) NOT NULL,
  `preferredBrand` varchar(255) NOT NULL,
  `chassis` varchar(255) NOT NULL,
  `singleCost` double DEFAULT NULL,
  `totalCost` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `supplierId` int NOT NULL,
  `quotationNumber` varchar(255) NOT NULL,
  `minQuantity` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `brake_id_index` (`id`),
  KEY `brake_quantity_index` (`quantity`),
  KEY `brake_carBrand_index` (`carBrand`),
  KEY `brake_carYear_index` (`carYear`),
  KEY `brake_chassis_index` (`chassis`),
  KEY `brake_bBrand_index` (`bBrand`),
  KEY `brake_preferredBrand_index` (`preferredBrand`),
  KEY `brake_singleCost_index` (`singleCost`),
  KEY `brake_totalCost_index` (`totalCost`),
  KEY `brake_minQuantity_index` (`minQuantity`),
  KEY `brake_createdAt_index` (`createdAt`),
  KEY `brake_updatedAt_index` (`updatedAt`),
  KEY `brake_supplierId_index` (`supplierId`),
  KEY `brake_quotationNumber_index` (`quotationNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brake_stocks`
--

LOCK TABLES `brake_stocks` WRITE;
/*!40000 ALTER TABLE `brake_stocks` DISABLE KEYS */;
INSERT INTO `brake_stocks` VALUES (1,'CAR','FORD','2020','FORD','FORD','KNAGT414XH5137348',11,110,9,1,'10192837',1,'2021-07-26 12:14:54','2021-08-17 14:18:11'),(2,'CAR','KIA','2017','FORD','NSK','KNAGT414XH5137348',1,10,1,1,'N/A',4,'2021-07-26 12:17:15','2021-08-17 14:23:26'),(3,'CAR','KIA','2020','KIA','NSK','KNAGT414XH513734834',12,1200,60,1,'N/A',12,'2021-08-18 15:36:32','2021-08-22 16:00:56'),(4,'CAR','Mitsubishi','2020','MITSUBISHI','NSK','KNAGT414XH5137490	',1,23,23,1,'N/A',2,'2021-08-18 15:37:30','2021-08-18 15:37:30');
/*!40000 ALTER TABLE `brake_stocks` ENABLE KEYS */;
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
