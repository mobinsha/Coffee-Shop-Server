-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2024 at 09:39 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coffee-shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` mediumtext NOT NULL,
  `adminId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `content`, `adminId`, `createdAt`, `updatedAt`) VALUES
(1, 'New Seasonal Coffee Blends', 'We are excited to introduce our new seasonal coffee blends! This season, we have curated a selection of rich and aromatic coffees that highlight the best flavors of the season. Visit us to try our new blends and find your new favorite coffee!', 1, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(2, 'Grand Opening of Our New Branch', 'We are thrilled to announce the grand opening of our new branch in downtown! Join us for a special opening day celebration with free coffee samples, live music, and exclusive discounts. We can’t wait to see you there!', 2, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(3, 'Barista Training Workshop', 'Our skilled baristas are hosting a training workshop this weekend. Learn the art of brewing the perfect cup of coffee and discover tips and tricks for making delicious espresso drinks. Reserve your spot today!', 3, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(4, 'Introducing Vegan Options', 'In response to customer feedback, we are now offering a range of vegan options on our menu. From plant-based milk to vegan pastries, we are committed to providing delicious options for everyone.', 4, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(5, 'The History of Coffee: From Bean to Brew', 'Ever wondered about the journey of coffee from its origins to your cup? This blog explores the fascinating history of coffee, including its discovery, cultivation, and how it became the beloved beverage it is today.', 5, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(6, 'Customer Favorite: Cold Brew Coffee', 'Our cold brew coffee has quickly become a customer favorite! With its smooth, rich flavor and low acidity, it’s the perfect refreshing drink for a hot day. Learn more about how we brew our cold brew and why it’s so popular.', 6, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(7, 'Behind the Scenes: Meet Our Roasters', 'Get an exclusive look behind the scenes at our coffee roastery. Meet our talented roasters who work hard to bring you the freshest and most flavorful coffee beans. Discover their process and passion for coffee.', 7, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(8, 'Sustainable Practices at Our Coffee Shop', 'We are committed to sustainability and have implemented several practices to reduce our environmental impact. From compostable cups to ethically sourced coffee beans, learn more about how we are making a difference.', 8, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(9, 'Delicious Recipes to Try at Home', 'Love our coffee and pastries? Try making some of our favorite recipes at home! We’re sharing a selection of recipes for our popular coffee drinks and baked goods so you can enjoy them anytime.', 9, '2024-08-26 17:54:16', '2024-08-26 17:54:16'),
(10, 'Special Offers for Loyalty Members', 'Our loyalty program is now offering special deals and rewards for our members. Enjoy exclusive discounts, free drinks, and more. Sign up today and start earning rewards on your favorite coffee and pastries!', 10, '2024-08-26 17:54:16', '2024-08-26 17:54:16');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `imageAddress` varchar(200) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `shortTitle` varchar(100) DEFAULT NULL,
  `price` int(20) NOT NULL,
  `description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `imageAddress`, `name`, `shortTitle`, `price`, `description`) VALUES
(1, '/src/assets/products/Expresso.png', 'Expresso', 'Rich and strong coffee', 4, 'A rich and strong espresso shot to kickstart your day'),
(2, '/src/assets/products/Cappuccino.png', 'Cappuccino', 'Smooth and creamy', 4, 'A smooth and creamy cappuccino with a perfect blend of espresso, steamed milk, and foam'),
(3, '/src/assets/products/Latte.png', 'Latte', 'Silky and smooth', 5, 'A silky and smooth latte with a blend of espresso and steamed milk, topped with a thin layer of foam'),
(4, '/src/assets/products/Americano.png', 'Americano', 'Bold and robust', 3, 'A bold and robust Americano, made by diluting an espresso shot with hot water'),
(5, '/src/assets/products/Latte.png', 'Mocha', 'Chocolate delight', 5, 'A chocolate delight mocha with a perfect blend of espresso, steamed milk, and rich chocolate syrup'),
(6, '/src/assets/products/Latte.png', 'Blueberry Muffin', 'Sweet and tangy', 3, 'A sweet and tangy blueberry muffin, perfect for a quick snack'),
(7, '/src/assets/products/Latte.png', 'Croissant', 'Flaky and buttery', 3, 'A flaky and buttery croissant, a classic French pastry perfect for breakfast or a light snack');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `imageAddress` varchar(200) DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `imageAddress`, `name`) VALUES
(1, '/src/assets/icons_services/Pastry.png', 'Pastry'),
(2, '/src/assets/icons_services/BeansVariant.png', 'Beans Variant'),
(3, '/src/assets/icons_services/TakeAWay.png', 'Take A Way'),
(4, '/src/assets/icons_services/TypeOfCoffee.png', 'Type Of Coffee'),
(5, '/src/assets/icons_services/Equipment.png', 'Equipment');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(254) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `permission` enum('admin','user') NOT NULL DEFAULT 'user',
  `accountStatus` enum('active','inactive','banned') NOT NULL DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userName`, `password`, `email`, `fullName`, `phoneNumber`, `permission`, `accountStatus`, `createdAt`, `updatedAt`) VALUES
(21, 'Mahwu039u2qe', '$2b$11$UZ9Nup9hXjgiivFOo9MHoeoN6KrTK1sy3meWr4m.e9ZqJbvR0nHei', 'user21@example.com', 'User Twenty-One', '222-333-4444', 'user', 'active', '2024-08-10 13:12:20', '2024-08-19 14:48:33'),
(29, 'user29', 'password29', 'user29@example.com', 'User Twenty-Nine', '000-111-2222', 'user', 'active', '2024-08-10 13:12:20', '2024-08-10 13:12:20'),
(30, 'user30', 'password30', 'user30@example.com', 'User Thirty', '111-222-3333', 'user', 'active', '2024-08-10 13:12:20', '2024-08-10 13:12:20'),
(31, 'admin123', '$2b$11$HHRQ8FAowEUrx15r.Q54e.hWVep1AkmtHwcLtGgeJ07H0ugKy83S.', 'admin1234@gamil.com', 'hadiShakeri', '09155232165', 'admin', 'active', '2024-08-13 15:50:37', '2024-08-13 15:51:47'),
(32, 'Mobinshakeri', '$2b$11$GpcwetQ8BEe2RONotbHQa.L4Q.25KNeYh7W8b2WdZQW39VhTBVXtK', 'Mobinskr13@gamil.com', 'Mobinshakeri', '09155232165', 'user', 'active', '2024-08-13 15:56:00', '2024-08-13 15:56:00'),
(33, 'sajadNR86', '$2b$11$M1AFgu6xIInfc2rf3zpLEuFOHXv6h0DAmx0CZSrBTVdYt1hJrPWci', 'sajadNazari24@gamil.com', 'sajad nazari', '09321546784', 'admin', 'active', '2024-08-13 17:12:54', '2024-08-13 17:23:20'),
(34, 'hadishakeri53', '$2b$11$vbw0WbQvllmtP/8K78skV.bocPHNAVaKFU.z02ORunmXahr1e9yCe', 'hadiShakeri54@gamil.com', 'hadiShakeri', '09155232167', 'user', 'active', '2024-08-13 17:35:09', '2024-08-13 17:35:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
