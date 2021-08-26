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
-- Table structure for table `non_stock_others`
--

DROP TABLE IF EXISTS `non_stock_others`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `non_stock_others` (
  `id` int NOT NULL AUTO_INCREMENT,
  `other_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `singleCost` double DEFAULT NULL,
  `totalCost` double DEFAULT NULL,
  `details` varchar(255) NOT NULL,
  `supplierId` int NOT NULL,
  `quotationNumber` varchar(255) NOT NULL,
  `materialRequestNumber` varchar(255) NOT NULL,
  `maintenanceReq` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `non_stock_other_id_index` (`id`),
  KEY `non_stock_other_other_name_index` (`other_name`),
  KEY `non_stock_other_quantity_index` (`quantity`),
  KEY `non_stock_other_singleCost_index` (`singleCost`),
  KEY `non_stock_other_totalCost_index` (`totalCost`),
  KEY `non_stock_other_details_index` (`details`),
  KEY `non_stock_other_createdAt_index` (`createdAt`),
  KEY `non_stock_other_updatedAt_index` (`updatedAt`),
  KEY `non_stock_other_supplierId_index` (`supplierId`),
  KEY `non_stock_other_quotationNumber_index` (`quotationNumber`),
  KEY `non_stock_other_materialRequestNumber_index` (`materialRequestNumber`),
  KEY `non_stock_other_maintenanceReq_index` (`maintenanceReq`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `non_stock_others`
--

LOCK TABLES `non_stock_others` WRITE;
/*!40000 ALTER TABLE `non_stock_others` DISABLE KEYS */;
INSERT INTO `non_stock_others` VALUES (3,'Spark Plug',4,2,30,'Testing if this works',1,'N/A','MCM124','TMC6938','2021-08-22 09:49:57','2021-08-22 09:49:57'),(4,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC6938','2021-08-22 11:27:02','2021-08-22 11:27:02'),(5,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC9912','2021-08-22 11:27:49','2021-08-22 11:27:49'),(6,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC9912','2021-08-22 11:27:59','2021-08-22 11:27:59'),(7,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC9912','2021-08-22 11:45:38','2021-08-22 11:45:38'),(8,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC9912','2021-08-22 11:47:32','2021-08-22 11:47:32'),(9,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC9912','2021-08-22 11:48:44','2021-08-22 11:48:44'),(10,'Test',12,34,408,'This si a test',1,'TEST10001','TEST1010','TMC9912','2021-08-22 11:49:54','2021-08-22 11:49:54'),(11,'Test',12,34,408,'This si a test',1,'TEST10001','TEEEST1010','TMC9912','2021-08-22 11:50:28','2021-08-22 11:50:28'),(12,'Test',12,34,408,'This si a test',1,'TEST10001','TEEEST1010','TMC9912','2021-08-22 11:56:17','2021-08-22 11:56:17'),(13,'Test',12,34,408,'This si a test',1,'TEST10001','TEEEST1010','TMC9912','2021-08-25 10:39:06','2021-08-25 10:39:06'),(14,'Test',12,34,408,'This si a test',1,'TEST10001','TEEEST1010','TMC9912','2021-08-25 10:39:27','2021-08-25 10:39:27');
/*!40000 ALTER TABLE `non_stock_others` ENABLE KEYS */;
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
