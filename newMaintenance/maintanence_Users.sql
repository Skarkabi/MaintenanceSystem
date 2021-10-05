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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userType` varchar(45) NOT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `user_id_index` (`id`),
  KEY `user_firstName_index` (`firstName`),
  KEY `user_lastName_index` (`lastName`),
  KEY `user_userName_index` (`username`),
  KEY `user_password_index` (`password`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`),
  KEY `user_userType_index` (`userType`),
  KEY `user_profilePicture_index` (`profilePicture`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('100933847','Saleem','Karkabi','saleemAdmin','$2b$10$jbt7GvSBG3Mo32Ad5MyNvOGRFhvWTxAu.tKQ6798aM4TW8CkZhWlW','2021-06-10 04:55:52','2021-07-18 12:42:07','admin','saleemAdmin.jpeg'),('G30530','Zaheer','Sherif','zsherif','$2b$10$u60X5m8neDwGCvHZI2K.LebrbYkmGlLalN0ApZy6kqR//HDtJi6pW','2021-08-26 09:35:48','2021-08-26 10:10:26','admin','zsherif.jpeg'),('T11538','Wissam','Hnein','whnein','$2b$10$yw9fvTzxFuqVX93Il4JWFuWddSDWyxSBGxTqtjrjmrHnyjSBBGiSu','2021-08-26 09:24:24','2021-08-26 09:25:18','admin','whnein.jpeg'),('V8024','MOHAMMED','UH','mhameed','$2b$10$d.OHQmVwVGK00qGCYwbgjOpctI27ltr8NMmCUYi0tEOhJ7LYkPNKW','2021-09-08 07:41:05','2021-09-19 07:11:08','employee','mhameed.jpeg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
