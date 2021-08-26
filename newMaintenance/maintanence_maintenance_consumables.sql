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
-- Table structure for table `maintenance_consumables`
--

DROP TABLE IF EXISTS `maintenance_consumables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_consumables` (
  `consumable_id` int NOT NULL,
  `consumable_type` varchar(255) NOT NULL,
  `maintenance_req` varchar(255) NOT NULL,
  `consumable_quantity` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `from_stock` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`consumable_id`,`consumable_type`,`maintenance_req`,`from_stock`),
  KEY `maintenance_consumable_id_index` (`consumable_id`),
  KEY `maintenance_consumable_type_index` (`consumable_type`),
  KEY `maintenance_req_index` (`maintenance_req`),
  KEY `maintenance_consumable_quantity_index` (`consumable_quantity`),
  KEY `consumable_createdAt_index` (`createdAt`),
  KEY `consumable_updatedAt_index` (`updatedAt`),
  KEY `consumable_from_stock_index` (`from_stock`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_consumables`
--

LOCK TABLES `maintenance_consumables` WRITE;
/*!40000 ALTER TABLE `maintenance_consumables` DISABLE KEYS */;
INSERT INTO `maintenance_consumables` VALUES (1,'Battery','TMC20198',2,'2021-08-25 10:37:58','2021-08-25 10:37:58',1),(1,'Battery','TMC6938',30,'2021-07-26 12:14:54','2021-08-22 11:05:01',1),(1,'Brake','TMC6938',2,'2021-07-26 12:14:54','2021-08-17 14:18:11',1),(1,'Filter','TMC10293',2,'2021-08-22 12:08:07','2021-08-22 12:08:07',1),(1,'Spark Plug','TMC20198',10,'2021-08-25 10:40:02','2021-08-25 10:40:02',1),(1,'Spark Plug','TMC6938',5,'2021-08-22 10:45:24','2021-08-22 10:46:18',1),(2,'Battery','TMC6938',2,'2021-08-18 14:47:41','2021-08-18 14:49:00',1),(2,'Brake','TMC6938',6,'2021-08-17 14:20:20','2021-08-17 14:23:26',1),(2,'Filter','TMC20199',7,'2021-08-25 10:50:56','2021-08-25 10:50:56',1),(2,'Filter','TMC6938',16,'2021-08-18 16:11:53','2021-08-18 16:11:53',1),(2,'Grease','TMC6938',23,'2021-08-18 16:16:09','2021-08-18 16:16:09',1),(2,'Grease','TMC9912',7,'2021-08-22 11:49:42','2021-08-22 11:49:42',1),(3,'Brake','20193',7,'2021-08-22 16:00:56','2021-08-22 16:00:56',1),(3,'Brake','TMC6938',33,'2021-08-18 16:03:40','2021-08-18 16:03:40',1),(3,'Oil','TMC20193',6,'2021-08-25 10:42:13','2021-08-25 10:42:13',1),(3,'Oil','TMC6938',4,'2021-08-18 16:31:20','2021-08-18 16:31:20',1),(3,'Spark Plug','TMC20198',9,'2021-08-25 10:40:02','2021-08-25 10:40:02',1),(3,'Spark Plug','TMC6938',6,'2021-08-22 09:49:57','2021-08-22 10:41:00',0),(4,'Random Piece','TMC10293',7,'2021-08-22 12:08:17','2021-08-22 12:08:17',1),(4,'Random Piece','TMC20198',7,'2021-08-25 10:40:02','2021-08-25 10:40:02',1),(4,'Random Piece','TMC6938',3,'2021-08-22 11:06:49','2021-08-22 11:06:49',1),(4,'Test','TMC6938',12,'2021-08-22 11:27:02','2021-08-22 11:27:02',0),(5,'Random Piece','TMC20197',12,'2021-08-23 04:37:50','2021-08-23 04:37:50',1),(5,'Random Piece','TMC20198',10,'2021-08-25 10:40:02','2021-08-25 10:40:02',1),(5,'Random Piece','TMC6938',20,'2021-08-22 10:46:37','2021-08-22 10:51:27',1),(5,'Test','TMC9912',12,'2021-08-22 11:27:49','2021-08-22 11:27:49',0),(6,'Battery','TMC6938',43,'2021-08-18 15:26:03','2021-08-18 15:33:52',1),(6,'Test','TMC9912',12,'2021-08-22 11:27:59','2021-08-22 11:27:59',0),(7,'Battery','TMC6938',3,'2021-08-22 11:05:46','2021-08-22 11:05:46',1),(7,'Test','TMC9912',12,'2021-08-22 11:45:38','2021-08-22 11:45:38',0),(8,'Test','TMC9912',12,'2021-08-22 11:47:32','2021-08-22 11:47:32',0),(9,'Test','TMC9912',12,'2021-08-22 11:48:44','2021-08-22 11:48:44',0),(10,'Test','TMC9912',12,'2021-08-22 11:49:54','2021-08-22 11:49:54',0),(11,'Test','TMC9912',12,'2021-08-22 11:50:28','2021-08-22 11:50:28',0),(12,'Test','TMC9912',12,'2021-08-22 11:56:17','2021-08-22 11:56:17',0),(13,'Test','TMC9912',12,'2021-08-25 10:39:06','2021-08-25 10:39:06',0),(14,'Test','TMC9912',12,'2021-08-25 10:39:27','2021-08-25 10:39:27',0);
/*!40000 ALTER TABLE `maintenance_consumables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-26 11:32:05
