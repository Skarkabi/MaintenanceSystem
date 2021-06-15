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
  `category` varchar(20) NOT NULL,
  `carBrand` varchar(200) NOT NULL,
  `carYear` varchar(20) NOT NULL,
  `chassis` varchar(200) NOT NULL,
  `bBrand` varchar(200) NOT NULL,
  `preferredBrand` varchar(200) NOT NULL,
  `singleCost` double NOT NULL,
  `totalCost` double NOT NULL,
  `quantity` int NOT NULL,
  `minQuantity` int NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
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
  KEY `battery_minQuantity_index` (`minQuantity`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`),
  KEY `brake_minQuantity_index` (`minQuantity`),
  KEY `brake_createdAt_index` (`createdAt`),
  KEY `brake_updatedAt_index` (`updatedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brake_stocks`
--

LOCK TABLES `brake_stocks` WRITE;
/*!40000 ALTER TABLE `brake_stocks` DISABLE KEYS */;
INSERT INTO `brake_stocks` VALUES (9,'CAR','KIA','2017','KNAGT414XH5137490	','OPTIMA','NSK',20,100,5,2,NULL,NULL),(10,'CAR','FORD','2020','KNAGT414XH5137348','FORD','FORD',1.2,12,25,5,'2021-06-14 09:49:57','2021-06-14 10:05:07');
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

-- Dump completed on 2021-06-15 11:24:17
