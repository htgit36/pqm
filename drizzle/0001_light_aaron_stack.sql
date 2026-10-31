CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_name` varchar(255) NOT NULL,
	`author_role_vi` varchar(255),
	`author_role_en` varchar(255),
	`quote_vi` text NOT NULL,
	`quote_en` text,
	`avatar` varchar(500),
	`published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
