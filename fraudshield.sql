-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2026 at 07:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fraudshield`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `activity`, `created_at`) VALUES
(1, 4, 'Created transaction ID: 6 with status: suspicious', '2026-05-09 10:51:43'),
(2, 4, 'Updated transaction ID: 6 status to: reviewed', '2026-05-09 11:05:21'),
(3, 4, 'Created category ID: 2', '2026-05-09 11:30:24'),
(4, 7, 'Created transaction ID: 7 with status: suspicious', '2026-05-09 11:33:48'),
(5, 4, 'Created investigation ID: 1 for transaction ID: 7', '2026-05-09 12:09:16'),
(6, 7, 'Created transaction ID: 8 with status: suspicious', '2026-05-09 12:15:59'),
(7, 8, 'Created investigation ID: 2 for transaction ID: 8', '2026-05-09 12:31:48'),
(8, 4, 'Created category ID: 3', '2026-05-09 13:20:41'),
(9, 4, 'Created category ID: 4', '2026-05-09 13:20:59'),
(10, 4, 'Created category ID: 5', '2026-05-09 13:21:11'),
(11, 4, 'Created fraud rule ID: 1', '2026-05-09 13:37:07'),
(12, 4, 'Updated fraud rule ID: 1', '2026-05-09 13:48:10'),
(13, 4, 'Created fraud rule ID: 2', '2026-05-09 13:49:29'),
(14, 4, 'Deleted fraud rule ID: 1', '2026-05-09 13:49:53'),
(15, 4, 'Deleted transaction ID: 8', '2026-05-09 14:12:20'),
(16, 4, 'Created transaction ID: 9 with status: suspicious', '2026-05-09 14:19:57'),
(17, 8, 'Created investigation ID: 3 for transaction ID: 9', '2026-05-09 14:20:23');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Transfer', 'Transfer Dana'),
(2, 'Transfer', 'Transfer antar rekening'),
(3, 'Withdrawal', 'Penarikan uang tunai'),
(4, 'QRIS Payment', 'Pembayaran menggunakan QRIS'),
(5, 'Online Payment', 'Pembayaran online');

-- --------------------------------------------------------

--
-- Table structure for table `fraud_rules`
--

CREATE TABLE `fraud_rules` (
  `id` int(11) NOT NULL,
  `rule_name` varchar(255) NOT NULL,
  `condition_type` varchar(255) NOT NULL,
  `risk_point` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fraud_rules`
--

INSERT INTO `fraud_rules` (`id`, `rule_name`, `condition_type`, `risk_point`, `created_at`) VALUES
(2, 'Login Luar Jawa', 'location', 60, '2026-05-09 13:49:29');

-- --------------------------------------------------------

--
-- Table structure for table `investigations`
--

CREATE TABLE `investigations` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `analyst_id` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `review_status` enum('pending','resolved','escalated') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `investigations`
--

INSERT INTO `investigations` (`id`, `transaction_id`, `analyst_id`, `note`, `review_status`, `created_at`) VALUES
(3, 9, 8, 'Transaksi di atas limit jam malam, indikasi kartu dicuri.', 'pending', '2026-05-09 14:20:23');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `transaction_time` datetime NOT NULL,
  `risk_score` int(11) DEFAULT 0,
  `status` enum('normal','suspicious','blocked','reviewed') DEFAULT 'normal',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `category_id`, `amount`, `location`, `transaction_time`, `risk_score`, `status`, `created_at`) VALUES
(9, 4, 1, 20000000.00, 'Singapore', '2024-03-24 02:30:00', 50, 'reviewed', '2026-05-09 14:19:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','analyst','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Admin', 'admin@fraudshield.com', '$2b$10$2FakJdvKecx5VHGZ/nmuXuLakjyKfr9J0fnxhxAxRj27JKMC37Iea', 'admin', '2026-05-02 11:41:37'),
(3, 'Analis', 'analisRiri@fraudshield.com', '$2b$10$r08zfZvt16ktUbjDM4D9luugShP4BDZ6MH.wjn14YZjmhlouWX9Ua', 'analyst', '2026-05-02 12:02:31'),
(4, 'AdminRisma', 'adminrisma@fraudshield.com', '$2b$10$Hj4cPOtEL3mttwRrScD/4e/Uh.PZyIdonbmKq6HrOGK6cWBaGY9Xe', 'admin', '2026-05-02 12:06:48'),
(5, 'Rashya Alfarizi Putra', 'rashyaalfariziputra@fraudshield.com', '$2b$10$JntXTP4c4eAw/3sw2o0sWeel.gCyH1bic/uJ2srWx.mVIaoNAGzPm', 'admin', '2026-05-02 12:29:36'),
(6, 'Sinta', 'sinta@gmail.com', '$2b$10$gfaOs6Jlo.eFCV2q72Ef8.U0k2eEgvVa6rJT3gcal6lF/.16NmPCq', 'user', '2026-05-09 11:20:39'),
(7, 'Nana', 'nana@gmail.com', '$2b$10$mqPrYx1mbCIHDu69z7EFm.h1y.8jTOQx7Qmd0paNN8PRJmGYqfHO2', 'user', '2026-05-09 11:21:09'),
(8, 'Analis', 'analis@fraudshield.com', '$2b$10$Zl3a75jI7XTukxuabZGQMuHW/Q8/pcgQWYuog5ZBMQPc.XDRkruei', 'analyst', '2026-05-09 11:53:57'),
(9, 'Lala', 'lala@gmail.com', '$2b$10$J/SniHxyOjBM3ppAPRPQ0uyPtA7DTXZUSm47LQP5Cjfhvbn7q.Ff2', 'user', '2026-05-09 13:04:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fraud_rules`
--
ALTER TABLE `fraud_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investigations`
--
ALTER TABLE `investigations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `analyst_id` (`analyst_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fraud_rules`
--
ALTER TABLE `fraud_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `investigations`
--
ALTER TABLE `investigations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `investigations`
--
ALTER TABLE `investigations`
  ADD CONSTRAINT `investigations_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `investigations_ibfk_2` FOREIGN KEY (`analyst_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
