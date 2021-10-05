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
  `user_id` varchar(255) NOT NULL,
  `discription` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `hour_cost` double DEFAULT NULL,
  `work_hours` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_order_req_index` (`req`),
  KEY `maintenance_order_division_index` (`division`),
  KEY `maintenance_user_id_index` (`user_id`),
  KEY `maintenance_order_plate_index` (`plate`),
  KEY `maintenance_order_discription_index` (`discription`),
  KEY `maintenance_order_remarks_index` (`remarks`),
  KEY `maintenance_order_hour_cost_index` (`hour_cost`),
  KEY `maintenance_work_hours_cost_index` (`work_hours`),
  KEY `consumable_createdAt_index` (`createdAt`),
  KEY `consumable_updatedAt_index` (`updatedAt`),
  KEY `consumable_completedAt_index` (`completedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_orders`
--

LOCK TABLES `maintenance_orders` WRITE;
/*!40000 ALTER TABLE `maintenance_orders` DISABLE KEYS */;
INSERT INTO `maintenance_orders` VALUES (2,'TMC000001','OPERATIONS','31811','G30530','COOLING SYSTEM',NULL,NULL,NULL,'2021-09-21 11:00:49','2021-09-21 11:00:49',NULL),(3,'TMC2','OPERATIONS','80228','G30530','A/C SYSTEM',NULL,NULL,NULL,'2021-09-21 11:01:28','2021-09-21 11:01:28',NULL),(4,'TMC3','OPERATIONS','87065','G30530','TRANSMISSION',NULL,NULL,NULL,'2021-09-21 11:02:10','2021-09-21 11:02:10',NULL),(5,'TMC4','OPERATIONS','52765','G30530','A/C SYSTEM',NULL,NULL,NULL,'2021-09-21 11:03:11','2021-09-21 11:03:11',NULL),(6,'TMC5','OPERATIONS','67574','G30530','TRANSMISSION',NULL,NULL,NULL,'2021-09-21 11:03:47','2021-09-21 11:03:47',NULL),(7,'TMC6','OPERATIONS','64153','G30530','A/C SYSTEM',NULL,NULL,NULL,'2021-09-21 11:11:29','2021-09-21 11:11:29',NULL),(8,'TMC7','OPERATIONS','29631','G30530','BATTERY',NULL,NULL,NULL,'2021-09-21 11:12:01','2021-09-21 11:12:01',NULL),(9,'TMC8','OPERATIONS','25204','G30530','A/C SYSTEM',NULL,NULL,NULL,'2021-09-21 11:16:42','2021-09-21 11:16:42',NULL),(10,'TMC9','OPERATIONS','78197','G30530','ELECTRICAL SYSTEM, RENEWAL, ',NULL,NULL,NULL,'2021-09-21 11:17:04','2021-09-29 04:48:34',NULL),(11,'TMC10','OPERATIONS','34891','G30530','BATTERY',NULL,NULL,NULL,'2021-09-21 11:17:21','2021-09-22 07:03:30',NULL),(12,'TMC11','OPERATIONS','24328','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:21:43','2021-09-27 08:21:43',NULL),(13,'TMC12','OPERATIONS','53791','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:22:05','2021-09-27 08:22:05',NULL),(14,'TMC13','OPERATIONS','56068','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:22:22','2021-09-27 08:22:22',NULL),(15,'TMC14','OPERATIONS','24329','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:22:43','2021-09-27 08:22:43',NULL),(16,'TMC15','OPERATIONS','40314','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:23:01','2021-09-27 08:23:01',NULL),(17,'TMC16','OPERATIONS','23251','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:23:15','2021-09-27 08:23:15',NULL),(18,'TMC17','OPERATIONS','16063','V8024','BATTERY',NULL,NULL,NULL,'2021-09-27 08:23:31','2021-09-27 08:23:31',NULL),(19,'TMC18','OPERATIONS','57965','V8024','BREAKING SYSTEM, A/C SYSTEM, ','CHANGING BRAKE PAD FRONT\r\nGAS REFILLING',75,2,'2021-09-28 07:14:30','2021-09-28 07:28:51','2021-08-28 00:00:00'),(20,'TMC19','OPERATIONS','61181','V8024','ENGINE',NULL,NULL,NULL,'2021-09-28 08:11:31','2021-09-28 08:11:31',NULL),(21,'TMC20','OPERATIONS','34891','V8024','OIL SERVICE','EXTRA 1 LITER\r\n',5,1,'2021-09-28 08:16:56','2021-09-28 08:23:06','2021-08-28 00:00:00'),(22,'TMC21','OPERATIONS','33486','T11538','COOLING SYSTEM',NULL,NULL,NULL,'2021-09-29 04:47:22','2021-09-29 04:47:22',NULL),(23,'TMC22','OPERATIONS','95967','T11538','RENEWAL',NULL,NULL,NULL,'2021-09-29 04:49:35','2021-09-29 04:49:35',NULL),(24,'TMC23','OPERATIONS','96012','T11538','RENEWAL',NULL,NULL,NULL,'2021-09-29 04:50:26','2021-09-29 04:50:26',NULL),(25,'TMC24','OPERATIONS','69512','T11538','RENEWAL',NULL,NULL,NULL,'2021-09-29 04:50:44','2021-09-29 04:50:44',NULL);
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

-- Dump completed on 2021-10-05 10:56:02
