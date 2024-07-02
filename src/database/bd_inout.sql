-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: bd_inout
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `batch_location_infos`
--

DROP TABLE IF EXISTS `batch_location_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_location_infos` (
  `batchLocationInfo_id` int NOT NULL AUTO_INCREMENT,
  `batch_id` int NOT NULL,
  `warehouseLocation_id` int NOT NULL,
  `quantity` varchar(45) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`batchLocationInfo_id`),
  KEY `fk_batch_warehouseLocation_idx` (`warehouseLocation_id`),
  KEY `fk_batch_location_idx` (`batch_id`),
  CONSTRAINT `fk_batch_location` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`),
  CONSTRAINT `fk_batch_warehouseLocation` FOREIGN KEY (`warehouseLocation_id`) REFERENCES `warehouse_locations` (`warehouseLocation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_location_infos`
--

LOCK TABLES `batch_location_infos` WRITE;
/*!40000 ALTER TABLE `batch_location_infos` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_location_infos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batches` (
  `batch_id` int NOT NULL,
  `element_id` int NOT NULL,
  `batch_serial` varchar(45) DEFAULT NULL,
  `expiration` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`batch_id`),
  KEY `fk_batch_element_idx` (`element_id`),
  CONSTRAINT `fk_batch_element` FOREIGN KEY (`element_id`) REFERENCES `elements` (`element_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batches`
--

LOCK TABLES `batches` WRITE;
/*!40000 ALTER TABLE `batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `element_types`
--

DROP TABLE IF EXISTS `element_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `element_types` (
  `elementType_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`elementType_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element_types`
--

LOCK TABLES `element_types` WRITE;
/*!40000 ALTER TABLE `element_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `element_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elements`
--

DROP TABLE IF EXISTS `elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elements` (
  `element_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `elementType_id` int NOT NULL,
  `category_id` int NOT NULL,
  `measurementUnit_id` int DEFAULT NULL,
  `packageType_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`element_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_element_type_idx` (`elementType_id`),
  KEY `fk_element_category_idx` (`category_id`),
  KEY `fk_element_unit_idx` (`measurementUnit_id`),
  KEY `fk_element_package_idx` (`packageType_id`),
  CONSTRAINT `fk_element_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `fk_element_package` FOREIGN KEY (`packageType_id`) REFERENCES `package_types` (`packageType_id`),
  CONSTRAINT `fk_element_type` FOREIGN KEY (`elementType_id`) REFERENCES `element_types` (`elementType_id`),
  CONSTRAINT `fk_element_unit` FOREIGN KEY (`measurementUnit_id`) REFERENCES `measurement_units` (`measurementUnit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elements`
--

LOCK TABLES `elements` WRITE;
/*!40000 ALTER TABLE `elements` DISABLE KEYS */;
/*!40000 ALTER TABLE `elements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_statuses`
--

DROP TABLE IF EXISTS `loan_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_statuses` (
  `loanStatus_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`loanStatus_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_statuses`
--

LOCK TABLES `loan_statuses` WRITE;
/*!40000 ALTER TABLE `loan_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `measurement_units`
--

DROP TABLE IF EXISTS `measurement_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `measurement_units` (
  `measurementUnit_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ENUM('0','1')` varchar(45) NOT NULL DEFAULT '1',
  PRIMARY KEY (`measurementUnit_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `measurement_units`
--

LOCK TABLES `measurement_units` WRITE;
/*!40000 ALTER TABLE `measurement_units` DISABLE KEYS */;
/*!40000 ALTER TABLE `measurement_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movement_details`
--

DROP TABLE IF EXISTS `movement_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movement_details` (
  `movementDetail_id` int NOT NULL AUTO_INCREMENT,
  `movement_id` int NOT NULL,
  `element_id` int NOT NULL,
  `batch_id` int NOT NULL,
  `quantity` int DEFAULT '0',
  `remarks` text,
  `user_receiving` int DEFAULT NULL,
  `user_returning` int DEFAULT NULL,
  `loanStatus_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updates_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movementDetail_id`),
  KEY `fk_movement_detail_idx` (`movement_id`),
  KEY `fk_movement_element_idx` (`element_id`),
  KEY `fk_mevement_batch_idx` (`batch_id`),
  KEY `fk_movement_userreceiving_idx` (`user_receiving`),
  KEY `fk_movement_userreturning_idx` (`user_returning`),
  KEY `fk_movementdetail_loanstatus_idx` (`loanStatus_id`),
  CONSTRAINT `fk_movementdetail_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`),
  CONSTRAINT `fk_movementdetail_element` FOREIGN KEY (`element_id`) REFERENCES `elements` (`element_id`),
  CONSTRAINT `fk_movementdetail_loanstatus` FOREIGN KEY (`loanStatus_id`) REFERENCES `loan_statuses` (`loanStatus_id`),
  CONSTRAINT `fk_movementdetail_movement` FOREIGN KEY (`movement_id`) REFERENCES `movements` (`movement_id`),
  CONSTRAINT `fk_movementdetail_userreceiving` FOREIGN KEY (`user_receiving`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_movementdetail_userreturning` FOREIGN KEY (`user_returning`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movement_details`
--

LOCK TABLES `movement_details` WRITE;
/*!40000 ALTER TABLE `movement_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `movement_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `movement_details_BEFORE_INSERT` BEFORE INSERT ON `movement_details` FOR EACH ROW BEGIN
	DECLARE v_movementType_id INT;

    -- Obtener el movementType_id correspondiente al movement_id proporcionado
    SELECT movementType_id INTO v_movementType_id
    FROM movements
    WHERE id = NEW.movement_id;

    -- Verificar si el movementType_id es 3 y si loanStatus_id es NULL
    IF v_movementType_id = 3 AND NEW.loanStatus_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El campo loanStatus_id no puede ser nulo para préstamos';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `movement_details_BEFORE_UPDATE` BEFORE UPDATE ON `movement_details` FOR EACH ROW BEGIN
	DECLARE v_movementType_id INT;

    -- Obtener el movementType_id correspondiente al movement_id proporcionado
    SELECT movementType_id INTO v_movementType_id
    FROM movements
    WHERE id = NEW.movement_id;

    -- Verificar si el movementType_id es 3 y si loanStatus_id es NULL
    IF v_movementType_id = 3 AND NEW.loanStatus_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El campo loanStatus_id no puede ser nulo para préstamos';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `movement_types`
--

DROP TABLE IF EXISTS `movement_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movement_types` (
  `movementType_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`movementType_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movement_types`
--

LOCK TABLES `movement_types` WRITE;
/*!40000 ALTER TABLE `movement_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `movement_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movements`
--

DROP TABLE IF EXISTS `movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movements` (
  `movement_id` int NOT NULL AUTO_INCREMENT,
  `movementType_id` int NOT NULL,
  `user_manager` int DEFAULT NULL,
  `user_application` int DEFAULT NULL,
  `user_receiving` int DEFAULT NULL,
  `user_returning` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estimated_return` timestamp NULL DEFAULT NULL,
  `actual_return` timestamp NULL DEFAULT NULL,
  `movementLoan_status` int DEFAULT NULL,
  PRIMARY KEY (`movement_id`),
  KEY `fk_movement_loanstatus_idx` (`movementLoan_status`),
  KEY `fk_movement_usermanager` (`user_manager`),
  KEY `fk_movement_userapplication_idx` (`user_application`),
  KEY `fk_movement_userreceiving_idx` (`user_receiving`),
  KEY `fk_movement_userreturning_idx` (`user_returning`),
  KEY `fk_mevement_type_idx` (`movementType_id`),
  CONSTRAINT `fk_movement_loanstatus` FOREIGN KEY (`movementLoan_status`) REFERENCES `loan_statuses` (`loanStatus_id`),
  CONSTRAINT `fk_movement_type` FOREIGN KEY (`movementType_id`) REFERENCES `movement_types` (`movementType_id`),
  CONSTRAINT `fk_movement_userapplication` FOREIGN KEY (`user_application`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_movement_usermanager` FOREIGN KEY (`user_manager`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_movement_userreceiving` FOREIGN KEY (`user_receiving`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_movement_userreturning` FOREIGN KEY (`user_returning`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movements`
--

LOCK TABLES `movements` WRITE;
/*!40000 ALTER TABLE `movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `movements` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `movements_BEFORE_INSERT` BEFORE INSERT ON `movements` FOR EACH ROW BEGIN
	IF NEW.movementType_id = 3 AND NEW.movementLoan_status IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo movementLoan_status no puede ser nulo para préstamos';
    END IF;
END;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `movements_BEFORE_UPDATE` BEFORE UPDATE ON `movements` FOR EACH ROW BEGIN
	IF NEW.movementType_id = 3 AND NEW.movementLoan_status IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo movementLoan_status no puede ser nulo para préstamos';
    END IF;
END;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `package_types`
--

DROP TABLE IF EXISTS `package_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `package_types` (
  `packageType_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`packageType_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `package_types`
--

LOCK TABLES `package_types` WRITE;
/*!40000 ALTER TABLE `package_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `package_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `position_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`position_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'aprendiz','2024-06-29 02:58:43','2024-06-29 02:58:43','1'),(2,'instructor','2024-06-29 02:58:43','2024-06-29 02:58:43','1'),(3,'operario','2024-06-29 02:58:43','2024-06-29 02:58:43','1'),(4,'coordinador','2024-06-29 02:58:43','2024-06-29 02:58:43','1');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'administradorcito','2024-06-29 02:48:44','2024-06-29 02:53:03','1'),(2,'encargado','2024-06-29 02:49:29','2024-06-29 02:49:29','1');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `phone` varchar(45) DEFAULT 'Not phone',
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `identification` varchar(45) NOT NULL,
  `role_id` int NOT NULL,
  `position_id` int NOT NULL,
  `course_id` int DEFAULT NULL,
  `creation_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`) /*!80000 INVISIBLE */,
  UNIQUE KEY `identification_UNIQUE` (`identification`),
  KEY `role_id_idx` (`role_id`) /*!80000 INVISIBLE */,
  KEY `fk_position_user_idx` (`position_id`),
  CONSTRAINT `fk_position_user` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_role_user` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `users_BEFORE_INSERT` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
	IF NEW.position_id = 1 AND NEW.course_id IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo course_id no puede ser nulo para aprendices';
    END IF;
END;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `users_BEFORE_UPDATE` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
	IF NEW.position_id = 1 AND NEW.course_id IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo course_id no puede ser nulo para aprendices';
    END IF;
END;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `warehouse_locations`
--

DROP TABLE IF EXISTS `warehouse_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_locations` (
  `warehouseLocation_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `warehouse_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`warehouseLocation_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_warehouse_location_idx` (`warehouse_id`),
  CONSTRAINT `fk_warehouse_location` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_locations`
--

LOCK TABLES `warehouse_locations` WRITE;
/*!40000 ALTER TABLE `warehouse_locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehouse_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `warehouse_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`warehouse_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehouses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bd_inout'
--

--
-- Dumping routines for database 'bd_inout'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-29 11:32:36
