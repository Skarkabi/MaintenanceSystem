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
-- Table structure for table `maintenance_orders`
--

DROP TABLE IF EXISTS `maintenance_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `req` varchar(255) NOT NULL,
  `division` varchar(255) NOT NULL,
  `plate` varchar(255) NOT NULL,
  `material_request` varchar(255) DEFAULT NULL,
  `discription` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `hour_cost` double DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `completedAt` date DEFAULT NULL,
  `work_hours` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_order_req_index` (`req`),
  KEY `maintenance_order_division_index` (`division`),
  KEY `maintenance_order_plate_index` (`plate`),
  KEY `maintenance_order_discription_index` (`discription`),
  KEY `maintenance_order_remarks_index` (`remarks`),
  KEY `maintenance_order_hour_cost_index` (`hour_cost`),
  KEY `consumable_createdAt_index` (`createdAt`),
  KEY `consumable_updatedAt_index` (`updatedAt`),
  KEY `maintenance_order_material_request_index` (`material_request`),
  KEY `consumable_completedAt_index` (`completedAt`),
  KEY `maintenance_work_hours_cost_index` (`work_hours`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_orders`
--

LOCK TABLES `maintenance_orders` WRITE;
/*!40000 ALTER TABLE `maintenance_orders` DISABLE KEYS */;
INSERT INTO `maintenance_orders` VALUES (1,'TMC6938','Metal Doors','68734','MCM124','Second Discription','Second Remark',12,'2021-07-25 11:54:18','2021-08-22 05:59:52',NULL,4),(2,'TMC9912','C.M.S.','68734','12134','Second Test','Second Remark',10,'2021-07-25 11:54:18','2021-08-15 13:22:32','2021-07-15',NULL),(3,'TMC10293','Mesh','68734','MCM223','Third Test','Third Remark',9,'2021-07-25 11:54:18','2021-08-09 12:36:26',NULL,NULL),(4,'TMC20193','Shelving','68734','MCM09284','Fourth Test','Fourth Test',3,'2021-07-25 11:54:18','2021-08-25 10:42:04',NULL,NULL),(5,'20193','MESH','19092',NULL,NULL,NULL,NULL,'2021-08-22 15:35:55','2021-08-22 15:35:55',NULL,NULL),(6,'TMC20194','METAL DOORS','24329',NULL,'Testing for a repair job',NULL,NULL,'2021-08-22 16:07:46','2021-08-22 16:07:46',NULL,NULL),(7,'TMC20195','METAL DOORS','68734',NULL,'Testing a preventative maintenance job',NULL,NULL,'2021-08-22 16:18:01','2021-08-22 16:18:01',NULL,NULL),(10,'TMC20197','MESH','23251','MCM9837','Repair and preventative test',NULL,NULL,'2021-08-22 16:20:52','2021-08-23 04:38:06','2021-07-23',NULL),(11,'TMC20198','OPERATION','90135',NULL,'I am changing the order for wissam how to make a new maintenance request',NULL,NULL,'2021-08-25 10:29:47','2021-08-25 10:40:21',NULL,10),(12,'TMC20199','OPERATIONS','19093','MCM09384,MCM827','New Test',NULL,NULL,'2021-08-25 10:50:03','2021-08-25 10:51:05','2021-07-25',NULL);
/*!40000 ALTER TABLE `maintenance_orders` ENABLE KEYS */;
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
