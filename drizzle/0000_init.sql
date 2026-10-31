CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo` varchar(500),
	`url` varchar(500),
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`email` varchar(255),
	`company` varchar(255),
	`service` varchar(255),
	`event_date` varchar(64),
	`message` text,
	`locale` varchar(8) NOT NULL DEFAULT 'vi',
	`status` varchar(16) NOT NULL DEFAULT 'new',
	`note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title_vi` varchar(255) NOT NULL,
	`title_en` varchar(255) NOT NULL DEFAULT '',
	`excerpt_vi` text,
	`excerpt_en` text,
	`body_vi` mediumtext,
	`body_en` mediumtext,
	`cover_image` varchar(500),
	`published_at` datetime NOT NULL,
	`published` boolean NOT NULL DEFAULT true,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title_vi` varchar(255) NOT NULL,
	`title_en` varchar(255) NOT NULL DEFAULT '',
	`client` varchar(255),
	`category` varchar(64) NOT NULL DEFAULT 'event',
	`kind` varchar(16) NOT NULL DEFAULT 'photo',
	`year` int,
	`cover_image` varchar(500),
	`video_url` varchar(500),
	`external_url` varchar(500),
	`gallery` json,
	`summary_vi` text,
	`summary_en` text,
	`body_vi` mediumtext,
	`body_en` mediumtext,
	`featured` boolean NOT NULL DEFAULT false,
	`published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title_vi` varchar(255) NOT NULL,
	`title_en` varchar(255) NOT NULL DEFAULT '',
	`summary_vi` text,
	`summary_en` text,
	`body_vi` mediumtext,
	`body_en` mediumtext,
	`cover_image` varchar(500),
	`featured` boolean NOT NULL DEFAULT false,
	`published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
