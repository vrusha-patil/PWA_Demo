CREATE DATABASE  IF NOT EXISTS "defaultdb" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `defaultdb`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: storeratingsystemdb-storeratingsystem101.a.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.4.8

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '48224a68-98cc-11f1-8554-ee74abaf472a:1-54,
7fa890da-9997-11f1-ac4e-82c6e01966e3:1-36';

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_store` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (3,7,2,4,'2026-08-15 14:34:06','2026-08-15 14:34:06'),(4,7,3,5,'2026-08-15 14:34:19','2026-08-15 14:34:19'),(5,8,3,2,'2026-08-15 16:36:13','2026-08-16 08:42:44'),(6,8,2,5,'2026-08-15 16:36:19','2026-08-15 16:36:19'),(7,8,1,3,'2026-08-15 16:36:25','2026-08-15 16:36:25'),(8,8,4,5,'2026-08-16 10:11:22','2026-08-16 10:11:22'),(9,7,4,3,'2026-08-16 17:46:25','2026-08-16 17:46:25'),(10,7,1,1,'2026-08-16 17:46:39','2026-08-16 17:46:39'),(13,11,4,5,'2026-08-16 18:07:13','2026-08-16 18:07:13'),(14,11,3,5,'2026-08-16 18:07:20','2026-08-16 18:07:20'),(15,11,2,4,'2026-08-16 18:07:28','2026-08-16 18:07:28'),(16,11,1,4,'2026-08-16 18:07:37','2026-08-16 18:07:37');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `name` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(400) COLLATE utf8mb4_general_ci NOT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk_store_owner` (`owner_id`),
  CONSTRAINT `fk_store_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,12,'Shree Jyotirling Store','jyotirling@gmail.com','Pune,Maharashtra',3.25),(2,6,'Chitale Kirana store 2','chitale@gmail.com','viman nagar , Pune',4.00),(3,9,'Balaji grocery Store','balaji123@gmail.com','Mumbai',4.00),(4,10,'Kusum Patil Grocery Store ','grcerystore@gmail.com','Yedenipani',4.50);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(400) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('System Administrator','Normal User','Store Owner') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Main System Administrator','admin1@gmail.com','$2b$10$ZIzQU2zm8Kgb8zB5mme.Q.xbSv6nym4l/cwqvCNzvgJzz1tJXKGFu','Pune, Maharashtra','System Administrator'),(5,'Vrushali Shamarao Patil','vrusha02@gmail.com','$2b$10$uDsooOZeNW4PAYFgL1ViNOwclTtNp6FpJDO.JgTExJKxpU5YX6fe2','Sangli','Normal User'),(6,'Manoj Kumar Store Owner','manoh123@gmail.com','$2b$10$5Dz40lnPjM8o378tlmFXvuzi..bIjNcaYfE2BVp3dvHMaUYR1UhIm','Gandiabad , Bihar','Store Owner'),(7,'Saniya Umran Mulla New User','saniya20@gmail.com','$2b$10$j8SJ0INeYlaBJYFYYhHA0uPxaPYwd9UK/EwaUYIU2prwdbqayibFW','Yedenipani ','Normal User'),(8,'Jayraj Shamrao Patil','jay123@gmail.com','$2b$10$XtcGvXyfOBpkb3ezEuwF9uNcdIKfSv8xmQQlWZBROB51KihwPonsC','Aurangabad','Normal User'),(9,'Pranaya Ramrao Patil','pranayapatil33@gmail.com','$2b$10$2c5tKmUh.rbBHKhNgugTbuAN.pQDjl4utHTAppHcVQBZDw6ZmSVAu','anjani','Store Owner'),(10,'Kusum Shamrao Patil Store Owner','kusum2312@gmail.com','$2b$10$cHQF5HuF3eptYlMK9tb1YuLYy0OK4hC43hMp9jkSPavQxkq/YpJ6a','Shiroli Kolhapur','Store Owner'),(11,'Viransh Sujit Patil Tambavekar','viransh03@gmail.com','$2b$10$ShCiTZyqaCHa66d5CtqIyOE8B4vccpWmeAtU9.XfR286SENHfzdha','Tambave','Normal User'),(12,'Shamrao Vasant Patil','shamrao01@gmail.com','$2b$10$g3bo0uJrN6JzG.194OA5BeH1heIVlqX9gIq86rbQkNHwUadcgHvDS','Yedenipani, Sangli, Maharashtra','Store Owner');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-17 12:52:52
