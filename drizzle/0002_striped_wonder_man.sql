CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`ip` varchar(64) NOT NULL,
	`session_id` varchar(40),
	`path` varchar(500) NOT NULL,
	`locale` varchar(8) NOT NULL DEFAULT 'vi',
	`referrer` varchar(500),
	`source` varchar(100) NOT NULL DEFAULT 'Truy cập trực tiếp',
	`medium` varchar(16) NOT NULL DEFAULT 'direct',
	`utm_campaign` varchar(191),
	`device` varchar(16) NOT NULL DEFAULT 'desktop',
	`browser` varchar(32),
	`os` varchar(32),
	`country` varchar(64),
	`city` varchar(100),
	`user_agent` varchar(400),
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `page_views_created_idx` ON `page_views` (`created_at`);--> statement-breakpoint
CREATE INDEX `page_views_ip_idx` ON `page_views` (`ip`);