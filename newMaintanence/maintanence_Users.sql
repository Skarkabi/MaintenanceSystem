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
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userType` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `user_id_index` (`id`),
  KEY `user_firstName_index` (`firstName`),
  KEY `user_lastName_index` (`lastName`),
  KEY `user_userName_index` (`username`),
  KEY `user_password_index` (`password`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`),
  KEY `user_userType_index` (`userType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('1','first','seconf','fdsg','$2b$10$bcG24BSft0GbDzQ9rkUhtO9Z21l4SgxT4aL5yWE7NpUZQpxS0MyWS','2021-06-09 06:46:51','2021-06-09 06:46:51',''),('10','Myw','Newe','MyTester3','$2b$10$yAR.QkAkO3o86Mi/tzrdGu.pqdKhzNc0S8RqxiCrX/NGO37ZsSBc6','2021-06-08 08:58:30','2021-06-08 08:58:30',''),('100','dsffds','fdsfvdsf','dsdfsdfsdf','$2b$10$gRLVVFmr6eB6BN40x.macuSRuGKCWWC4nwixSBBxKuRRexgCCP7A.','2021-06-09 06:41:11','2021-06-09 06:41:11',''),('100299384','Suha','Khoury','skhoury','$2b$10$elCe.xjL35iFGffNIr8mA.enR6mWjZs.qqlyPymbIrpw6fNEeclea','2021-06-07 11:27:56','2021-06-07 11:27:56',''),('100933847','Saleem','Karkabi','saleemAdmin','$2b$10$jbt7GvSBG3Mo32Ad5MyNvOGRFhvWTxAu.tKQ6798aM4TW8CkZhWlW','2021-06-10 04:55:52','2021-06-10 04:55:52','admin'),('100944632','Saleem2','Karkabi2','skarkabi2','123456789','2021-06-07 12:12:43','2021-06-07 12:12:43',''),('1009446392','Saleem3','Karkabi3','skarkabi3','$2b$10$Gl5HWsv9gPLU/Agaf10jJ.LabnSx0lVUyawjoWdKfxlMMFa6GL1yC','2021-06-07 12:31:08','2021-06-07 12:31:08',''),('100944655','Saleem','Karkabi','skarkabi','$2b$10$rpmSo.Xgo93rGKVMBm9fM.g/SAtAD8FqiNxlyZwxoATAGdsv51jwW','2021-06-07 11:20:47','2021-06-07 11:20:47',''),('100944656','Carla','Honien','chonien','$2b$10$nUcNIUcvNNPdkZiSPoh7Yep2mmy1cDT47z1mDKMVwYBFQrvj4bCnW','2021-06-07 11:22:13','2021-06-07 11:22:13',''),('101293821','tester2','tester2','wwewe2','$2b$10$UbDlqpw01KVmFjA6dbp44.zGP2YEEJBImJRtwsO1.XKIYQ5foKSI6','2021-06-07 12:33:37','2021-06-07 12:33:37',''),('10129387','tester','tester','wwewe','$2b$10$nVfcNb0VYepawtsKc.FCdOYnOv1984JMZacDKKcMpjCL1E3a1whp2','2021-06-07 12:31:46','2021-06-07 12:31:46',''),('102938271','new','new','nTest','$2b$10$j0LEl1yX3zDlTxesKcmno.GHBa5mmvLbmGS6vQrylG8cZxsoc6iM2','2021-06-07 12:43:11','2021-06-07 12:43:11',''),('103947568','Johnnie','Karkabi','jkarkabi','$2b$10$/qt.Fi7Tr2BKQEmLEqqjdub/C4C98/I5DOteZew7CAsS.JoH9/QHW','2021-06-07 11:23:59','2021-06-07 11:23:59',''),('11','Myw','Newe','MyTester9','$2b$10$AH.NrqitVwE2k8izNjommOeUC5KKv2owquO286Xg4oN.a2.vtojJa','2021-06-08 09:55:16','2021-06-08 09:55:16',''),('123382717','fName','Name','fName','$2b$10$/Zw0X3vvPNMqTcbgsMOWqenfN4j2Htfo34Xk01xARTzFafigjr9RG','2021-06-08 11:54:11','2021-06-08 11:54:11',''),('1923928','N','n','dsfsdfsf','dsfsdfdsf','2021-06-07 12:31:08','2021-06-07 12:31:08','test'),('30039487','Zeina','Karkabi','zkarkabi','$2b$10$F1MsdxzZnO/2ykefwNdulu4XMDCZODBukK2RWObSzSamTjFcrGa3O','2021-06-07 11:25:04','2021-06-07 11:25:04',''),('300948577','Maya','Karkabi','mkarkabi','$2b$10$E7IomCccFOdINz4B7E/Oa.du5TBcR9cyQQGdnpl02wzCi5ac9Jqwm','2021-06-07 11:25:58','2021-06-07 11:25:58',''),('33994028','Bassam','Honien','bhonien','$2b$10$/S8UtGIC7Q2joNetZrH8k.9c.y6A583SCEKkT7z492GUPrDU/eqt6','2021-06-07 11:31:28','2021-06-07 11:31:28',''),('4','newester','Testerer','newTestering','$2b$10$krXH/SmuMBUG.LtYO3wLXu90PZVY0MAaqjJSdAjE.76v5CvOymO1i','2021-06-08 07:21:11','2021-06-08 07:21:11',''),('5','Sally','Klark','sklark','$2b$10$cJBjCN9foUD7DW/y4GFt8.QTKOtKjRU/B1YeJyghzlr0BJ1suz73G','2021-06-08 07:22:07','2021-06-08 07:22:07',''),('6','Sallyer','Klark','sklarker','$2b$10$rJNVUX5BoO3G346SofTU8.FNHp1rBi73JnMcHVZXbXnls3zZF/QMe','2021-06-08 07:22:53','2021-06-08 07:22:53',''),('7','Sallyer','Klark','sklarkererf','$2b$10$90iwQhX46UdNQNl9uzzTEehGJfw4i05vAnU3eQP6BQ474b8OoIjfa','2021-06-08 07:23:50','2021-06-08 07:23:50',''),('8','My','Ne','MyTester','$2b$10$6cdkiuSGG3D1DyIScqK9KujRE8Y1PNgxtDNsgXqocevJhLvm6vMKW','2021-06-08 07:30:12','2021-06-08 07:30:12',''),('9','My','Ne','MyTester2','$2b$10$tvu7Kkhwf/x2wgnypSmu3OSOyv.ps2QeVTWCgKY9ueoFYpOaOOKWm','2021-06-08 07:30:59','2021-06-08 07:30:59',''),('91','tess','tess','testst','$2b$10$aHZ6aZ/m11P92.BbYKt4qu3q2tNU.maVhnh760GrgksW857NP.nRa','2021-06-09 06:31:15','2021-06-09 06:31:15',''),('92','tess','tess','teststerer','$2b$10$8NVsqFyJqvxz/0tEmiipteJw1qJUL1dD26zL3p4u8xAbVs9bKCg5a','2021-06-09 06:38:37','2021-06-09 06:38:37',''),('96','TTTTT','TTTTT','TTTTT','$2b$10$cOAS0W4l5SEN.zS5VRzlb.4I4uxYp7qqJN7xUTl6PnFm1gT6pm7Be','2021-06-09 06:39:29','2021-06-09 06:39:29',''),('992837','Maya','Karkabi','Mkay','$2b$10$nAkBda41ynCjR/JBt9NdReikr8tqt5744Iyczh0BEdb2l0FFRwfc6','2021-06-08 14:21:30','2021-06-08 14:21:30',''),('T11538','Wissam','Hnein','whnein','$2b$10$uirdDWVPR8qdMT9DaVA70u6X3lTnDvyPHp22YCzEJCpZNYH5fFY36','2021-06-15 07:23:32','2021-06-15 07:23:32','admin');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
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
