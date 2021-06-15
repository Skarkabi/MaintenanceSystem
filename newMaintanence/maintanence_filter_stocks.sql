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
  `fType` varchar(50) NOT NULL,
  `carBrand` varchar(200) NOT NULL,
  `carModel` varchar(200) NOT NULL,
  `carYear` varchar(50) NOT NULL,
  `quantity` int NOT NULL,
  `minQuantity` int NOT NULL,
  `preferredBrand` varchar(200) NOT NULL,
  `category` varchar(200) NOT NULL,
  `singleCost` double NOT NULL,
  `totalCost` double NOT NULL,
  `actualBrand` varchar(200) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consumable_id_index` (`id`),
  KEY `consumable_quantity_index` (`quantity`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`),
  KEY `filter_singleCost_index` (`singleCost`),
  KEY `filter_totalCost_index` (`totalCost`),
  KEY `filter_minQuantity_index` (`minQuantity`),
  KEY `filter_createdAt_index` (`createdAt`),
  KEY `filter_updatedAt_index` (`updatedAt`),
  KEY `filter_id_index` (`id`),
  KEY `filter_quantity_index` (`quantity`),
  KEY `filter_carBrand_index` (`carBrand`),
  KEY `filter_carYear_index` (`carYear`),
  KEY `filter_carModel_index` (`carModel`),
  KEY `filter_fType_index` (`fType`),
  KEY `filter_preferredBrand_index` (`preferredBrand`),
  KEY `filter_actualBrand_index` (`actualBrand`),
  KEY `filter_category_index` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filter_stocks`
--

LOCK TABLES `filter_stocks` WRITE;
/*!40000 ALTER TABLE `filter_stocks` DISABLE KEYS */;
INSERT INTO `filter_stocks` VALUES (43,'fuel','Mitsdf','asx','2013',30,10,'orig','car',10,300,'tes',NULL,NULL),(44,'fuel','MITSUBISHI','CANTER','2013',4,3,'OSK','3 TON',40,160,'GENUINE PARTS',NULL,NULL),(45,'Oil','KIA','KIA','ALL',3,3,'Genuine parts','car',10,30,'Genuine parts',NULL,NULL),(46,'fuel','KIA','asx','2013',2,2,'GENUINE PARTS','car',10,20,'kkk',NULL,NULL),(47,'Oil','FORD','MUSTANG','2020',11,5,'Genuine parts','car',2.3,23,'GENUINE PARTS','2021-06-15 05:58:21','2021-06-15 06:05:32');
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

-- Dump completed on 2021-06-15 11:24:17
