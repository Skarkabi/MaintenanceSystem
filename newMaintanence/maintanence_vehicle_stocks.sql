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
-- Table structure for table `vehicle_stocks`
--

DROP TABLE IF EXISTS `vehicle_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_stocks` (
  `dateAdded` varchar(200) NOT NULL,
  `category` varchar(200) NOT NULL,
  `brand` varchar(200) NOT NULL,
  `model` varchar(200) NOT NULL,
  `year` varchar(200) NOT NULL,
  `plate` varchar(200) NOT NULL,
  `chassis` varchar(200) NOT NULL,
  `kmDriven` double DEFAULT NULL,
  `kmForOilChange` double DEFAULT NULL,
  `oilType` varchar(200) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`plate`,`chassis`),
  KEY `vehicle_dateAdded_index` (`dateAdded`),
  KEY `vehicle_category_index` (`category`),
  KEY `vehicle_brand_index` (`brand`),
  KEY `vehicle_model_index` (`model`),
  KEY `vehicle_year_index` (`year`),
  KEY `vehicle_plat_index` (`plate`),
  KEY `vehicle_chassis_index` (`chassis`),
  KEY `vehicle_kmDriven_index` (`kmDriven`),
  KEY `vehicle_kmForOilChange_index` (`kmForOilChange`),
  KEY `vehicle_oilType_index` (`oilType`),
  KEY `user_createdAt_index` (`createdAt`),
  KEY `user_updatedAt_index` (`updatedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_stocks`
--

LOCK TABLES `vehicle_stocks` WRITE;
/*!40000 ALTER TABLE `vehicle_stocks` DISABLE KEYS */;
INSERT INTO `vehicle_stocks` VALUES ('20/06/2019','TRAILER TROLLY','EMIRATES','TROLLY FOR 78197','2013','15204','FB441',0,10000,'',NULL,NULL),('20/06/2019','TRAILER','INTERNATIONAL','INTERNATIONAL','2008','15224','1HSWYAHR78J666135',0,10000,'',NULL,NULL),('28/05/2019','3 TON PICKUP','MITSUBISHI','CANTER','2007','16063','JL7BCE1J1K026130',0,10000,'',NULL,NULL),('22/06/2019','BUS','HYUNDAI','COUNTY 36 P','2009','16880','KMJHD17F09C041998',0,10000,'',NULL,NULL),('28/05/2019','CAR','KIA','CERATO','2012','16976','KNAFT4117C5948318',0,10000,'',NULL,NULL),('10/06/2019','CAR','MITSUBISHI','LANCER','2017','19089','JMYSRCY1AUG749793',0,10000,'',NULL,NULL),('10/06/2019','CAR','MITSUBISHI','LANCER','2017','19092','JMYSRCY1AGU752660',0,10000,'',NULL,NULL),('10/06/2019','CAR','MITSUBISHI','LANCER','2017','19093','JMYSRCY1AGU752670',0,10000,'',NULL,NULL),('22/06/2019','BUS','HYUNDAI','HYUNDAI 36 P','2005','22568','KMJHD17F85C025414',0,10000,'',NULL,NULL),('20/06/2019','4X4','FORD','EXPEDITION','2013','22612','1FMJU1G5XDEF26267',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2007','23251','JL7BCE1J57K026129',0,10000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2008','24328','JL7BCE1J58K030683',0,10000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2008','24329','JL7BCE1J38K030682',0,10000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2016','25094','JL7B6E1P8GK005268',0,10000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','MITSUBISHI','DOUBLE CABIN','2016','25203','MMBJNKJ30GH039738',0,8000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2015','25204','JL7B6E1P5FK019885',0,10000,'',NULL,NULL),('30/05/2019','CAR','TOYOTA','COROLLA','2014','25827','RKLBB9HE8E5011266',0,10000,'',NULL,NULL),('10/06/2019','CAR','TOYOTA','COROLLA','2014','28190','RKLBB9HE3E5015113',0,10000,'',NULL,NULL),('10/06/2019','CAR','TOYOTA','COROLLA','2014','28646','RKLBB9HE7E5015163',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2008','28763','KNAGE222485216116',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','RIO','2009','29631','KNADE221X96439721',0,10000,'',NULL,NULL),('22/06/2019','BUS','TATA','TATA 84 P','2014','29804','MAT449253E0L00935',0,10000,'',NULL,NULL),('10/06/2019','CAR','TOYOTA','COROLLA','2014','30370','RKLBB9HE3E5015306',0,10000,'',NULL,NULL),('29/05/2019','CAR','TOYOTA','COROLLA','2014','31811','RKLBB9HE8E5011221',0,10000,'',NULL,NULL),('22/06/2019','TRAILER TROLLY','EMIRATES','TROLLY FOR 80228','2009','31857','UAE2S0109A008948',0,0,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2012','33069','KNAGM4121C5181303',0,10000,'',NULL,NULL),('10/06/2019','CAR','TOYOTA','COROLLA','2014','33173','RKLBB9HE8E5010358',0,10000,'',NULL,NULL),('30/05/2019','CAR','TOYOTA','COROLLA','2014','33486','RKLBB9HE3E5015466',0,10000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','ISUZU','D-MAX','2005','34891','MPADL34C25H508632',0,8000,'',NULL,NULL),('20/06/2019','TRAILER TROLLY','EMIRATES','TROLLY FOR 15224','2008','35610','1163300200813',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2007','40314','JL7BCE1J37K017283',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','RIO','2010','41503','KNADG4115A6617871',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2007','48674','JL7BCE1JX7K019368',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2006','52674','KNAGE224865077431',0,10000,'',NULL,NULL),('30/05/2019','CAR','TOYOTA','CAMRY','2015','52765','6T1BF9FK7FX577418',0,10000,'',NULL,NULL),('30/05/2019','CAR','TOYOTA','CAMRY','2015','52816','6T1BF9FKXFX576229',0,10000,'',NULL,NULL),('30/05/2019','CAR','TOYOTA','CAMRY','2015','52860','6T1BF9FK8FX581980',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2012','53659','KNAGM4122C5244926',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2006','53791','JL7BCE1J16K018785',0,10000,'',NULL,NULL),('10/06/2019','CAR','BMW','750Li','2017','54672','WBA7F2109HG781334',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2006','56068','JL7BCE1J66K013632',0,10000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2006','56236','Jl7BCE1JX6K018784',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2011','57965','KNAGM4122B5147417',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2011','59040','KNAGM4124B5147418',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2006','59719','JL7BCE1J36K018786',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','CERATO','2013','60495','KNAFK4119D5806752',0,10000,'',NULL,NULL),('10/06/2019','CAR','CHEVROLET','SPARK','2012','60765','KL1CJ6B13CC639924',0,10000,'',NULL,NULL),('22/06/2019','BUS','MITSUBISHI','MITSUBISHI 36 P','2004','61181','JL5B3J6P04PD01311',0,10000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2016','63493','JL6B6E6P3GK015669',0,10000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','MITSUBISHI','DOUBLE CABIN','2016','63494','MMBJNKJ30GH046484',0,8000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2016','63495','JL6B6E6P2GK015632',0,10000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','MITSUBISHI','DOUBLE CABIN','2009','64153','MMBJNKB409F005214',0,8000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','ISUZU','D-MAX','2007','67574','MPAEL39C87H565191',0,8000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2006','69512','JL7BCE1J46K007425',0,10000,'',NULL,NULL),('22/06/2019','BUS','MAXUS','MAXUS 15 P','2017','75470','LSKG5GC19HA043913',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2009','77659','KNAGE227295276523',0,10000,'',NULL,NULL),('20/06/2019','TRAILER','TATA','DAEWOO','2013','78197','KL4M2S6F1DK001714',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2013','78206','KNAGM4129E5393174',0,10000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','MITSUBISHI','L200 DOUBLE CABIN','2016','80226','MMBJNKL30GH065935',0,8000,'',NULL,NULL),('22/06/2019','TRAILER','TATA','DAEWOO','2016','80228','KL4M2S6F1GK001960',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2008','80860','JL7BCE1J98K030721',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2008','80907','JL7BCE1JX8K030730',0,10000,'',NULL,NULL),('10/06/2019','CAR','MITSUBISHI','LANCER','2015','81955','JMYSTCY4AFU740510',0,10000,'',NULL,NULL),('29/05/2019','CAR','KIA','OPTIMA','2012','83936','KNAGM4121C5181320',0,10000,'',NULL,NULL),('20/06/2019','4X4','FORD','EXPEDITION','2017','85028','1FMJU1GTXHEA17557',0,10000,'',NULL,NULL),('20/06/2019','4X4','MITSUBISHI','ASX','2017','85912','JE4LP21U4JZ701942',0,10000,'',NULL,NULL),('20/06/2019','4X4','MITSUBISHI','ASX','2017','86264','JE4LP21U7HZ701217',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2008','86312','KNAGE222685240675',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2017','86962','KNAGT414XH5137490',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','CERATO','2017','86973','KNAFJ4113H5951456',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','CERATO','2017','86980','KNAFJ4112H5951432',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','CERATO','2017','86982','KNAFJ4117H5951457',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','CERATO','2017','86991','KNAFJ4114H5951433',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','CERATO','2017','87042','KNAFJ114H5951464',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2017','87065','KNAGT4143H5137198',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2017','87074','KNAGT414XH5137327',0,10000,'',NULL,NULL),('10/06/2019','CAR','KIA','OPTIMA','2017','87103','KNAGT4148H5137472',0,10000,'',NULL,NULL),('30/05/2019','CAR','KIA','OPTIMA','2017','87113','KNAGT4145H5137557',0,10000,'',NULL,NULL),('10/06/2019','CAR','TOYOTA','CAMRY','2009','88342','6T1BE42K59X544031',0,10000,'',NULL,NULL),('22/06/2019','1 TON PICKUP','TATA','DOUBLE CABIN','2014','89766','MAT464753ESL00252',0,8000,'',NULL,NULL),('30/05/2019','CAR','TOYOTA','CAMRY','2015','90135','6T1BF9FK3FX584057',0,10000,'',NULL,NULL),('29/05/2019','CAR','TOYOTA','CAMRY','2015','90617','6T1BF9FK3FX581482',0,10000,'',NULL,NULL),('22/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2015','95967','JL7B6E1P6FK017093',0,10000,'',NULL,NULL),('20/06/2019','3 TON PICKUP','MITSUBISHI','CANTER','2015','96012','JL7B6E1P7FK011643',0,10000,'',NULL,NULL),('22/06/2019','BUS','ASHOK LEYLAND','FALCON 84 P','2007','99723','SFH114100',0,10000,'',NULL,NULL);
/*!40000 ALTER TABLE `vehicle_stocks` ENABLE KEYS */;
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
