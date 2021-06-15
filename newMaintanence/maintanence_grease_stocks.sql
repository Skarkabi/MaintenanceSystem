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
  `greaseSpec` varchar(200) NOT NULL,
  `typeOfGrease` varchar(200) NOT NULL,
  `carBrand` varchar(200) NOT NULL,
  `carYear` varchar(200) NOT NULL,
  `volume` varchar(200) NOT NULL,
  `minVolume` varchar(200) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `grease_id_index` (`id`),
  KEY `grease_volume_index` (`volume`),
  KEY `grease_minVolume_index` (`minVolume`),
  KEY `grease_greaseSpec_index` (`greaseSpec`),
  KEY `grease_carBrand_index` (`carBrand`),
  KEY `grease_carYear_index` (`carYear`),
  KEY `battery_typeOfGrease_index` (`typeOfGrease`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`),
  KEY `grease_typeOfGrease_index` (`typeOfGrease`),
  KEY `grease_createdAt_index` (`createdAt`),
  KEY `grease_updatedAt_index` (`updatedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grease_stocks`
--

LOCK TABLES `grease_stocks` WRITE;
/*!40000 ALTER TABLE `grease_stocks` DISABLE KEYS */;
INSERT INTO `grease_stocks` VALUES (1,'tester','tester','Ford','2020','10','5',NULL,NULL);
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

-- Dump completed on 2021-06-15 11:24:16
