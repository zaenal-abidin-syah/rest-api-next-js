-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `author` VARCHAR(150) NOT NULL,
    `publisher` VARCHAR(150) NULL,
    `isbn` VARCHAR(20) NULL,
    `stock` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `published_year` YEAR NULL,
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `books_isbn_key`(`isbn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loans` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `status` ENUM('borrowed', 'returned', 'overdue') NOT NULL DEFAULT 'borrowed',
    `book_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `due_date` DATE NOT NULL,
    `loan_date` DATE NOT NULL DEFAULT (curdate()),
    `return_date` DATE NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    INDEX `loans_user_id_idx`(`user_id`),
    INDEX `loans_book_id_idx`(`book_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_limits` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `endpoint` VARCHAR(255) NOT NULL,
    `windowStart` DATETIME(0) NOT NULL,
    `requestCount` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `rate_limits_user_id_key`(`user_id`),
    UNIQUE INDEX `rate_limits_user_id_windowStart_endpoint_key`(`user_id`, `windowStart`, `endpoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `tokens_token_key`(`token`),
    UNIQUE INDEX `tokens_user_id_key`(`user_id`),
    INDEX `tokens_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
