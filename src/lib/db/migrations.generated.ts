// Tự sinh bởi scripts/embed-migrations.mjs — không sửa tay.
export const migrations: { tag: string; statements: string[] }[] = [
  {
    "tag": "0000_init",
    "statements": [
      "CREATE TABLE `clients` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`name` varchar(255) NOT NULL,\n\t`logo` varchar(500),\n\t`url` varchar(500),\n\t`sort_order` int NOT NULL DEFAULT 0,\n\tCONSTRAINT `clients_id` PRIMARY KEY(`id`)\n);",
      "CREATE TABLE `leads` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`name` varchar(255) NOT NULL,\n\t`phone` varchar(64) NOT NULL,\n\t`email` varchar(255),\n\t`company` varchar(255),\n\t`service` varchar(255),\n\t`event_date` varchar(64),\n\t`message` text,\n\t`locale` varchar(8) NOT NULL DEFAULT 'vi',\n\t`status` varchar(16) NOT NULL DEFAULT 'new',\n\t`note` text,\n\t`created_at` timestamp NOT NULL DEFAULT (now()),\n\tCONSTRAINT `leads_id` PRIMARY KEY(`id`)\n);",
      "CREATE TABLE `posts` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`slug` varchar(191) NOT NULL,\n\t`title_vi` varchar(255) NOT NULL,\n\t`title_en` varchar(255) NOT NULL DEFAULT '',\n\t`excerpt_vi` text,\n\t`excerpt_en` text,\n\t`body_vi` mediumtext,\n\t`body_en` mediumtext,\n\t`cover_image` varchar(500),\n\t`published_at` datetime NOT NULL,\n\t`published` boolean NOT NULL DEFAULT true,\n\t`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,\n\tCONSTRAINT `posts_id` PRIMARY KEY(`id`),\n\tCONSTRAINT `posts_slug_unique` UNIQUE(`slug`)\n);",
      "CREATE TABLE `projects` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`slug` varchar(191) NOT NULL,\n\t`title_vi` varchar(255) NOT NULL,\n\t`title_en` varchar(255) NOT NULL DEFAULT '',\n\t`client` varchar(255),\n\t`category` varchar(64) NOT NULL DEFAULT 'event',\n\t`kind` varchar(16) NOT NULL DEFAULT 'photo',\n\t`year` int,\n\t`cover_image` varchar(500),\n\t`video_url` varchar(500),\n\t`external_url` varchar(500),\n\t`gallery` json,\n\t`summary_vi` text,\n\t`summary_en` text,\n\t`body_vi` mediumtext,\n\t`body_en` mediumtext,\n\t`featured` boolean NOT NULL DEFAULT false,\n\t`published` boolean NOT NULL DEFAULT true,\n\t`sort_order` int NOT NULL DEFAULT 0,\n\t`created_at` timestamp NOT NULL DEFAULT (now()),\n\t`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,\n\tCONSTRAINT `projects_id` PRIMARY KEY(`id`),\n\tCONSTRAINT `projects_slug_unique` UNIQUE(`slug`)\n);",
      "CREATE TABLE `services` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`slug` varchar(191) NOT NULL,\n\t`title_vi` varchar(255) NOT NULL,\n\t`title_en` varchar(255) NOT NULL DEFAULT '',\n\t`summary_vi` text,\n\t`summary_en` text,\n\t`body_vi` mediumtext,\n\t`body_en` mediumtext,\n\t`cover_image` varchar(500),\n\t`featured` boolean NOT NULL DEFAULT false,\n\t`published` boolean NOT NULL DEFAULT true,\n\t`sort_order` int NOT NULL DEFAULT 0,\n\t`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,\n\tCONSTRAINT `services_id` PRIMARY KEY(`id`),\n\tCONSTRAINT `services_slug_unique` UNIQUE(`slug`)\n);",
      "CREATE TABLE `settings` (\n\t`key` varchar(100) NOT NULL,\n\t`value` text NOT NULL,\n\tCONSTRAINT `settings_key` PRIMARY KEY(`key`)\n);"
    ]
  },
  {
    "tag": "0001_light_aaron_stack",
    "statements": [
      "CREATE TABLE `testimonials` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`author_name` varchar(255) NOT NULL,\n\t`author_role_vi` varchar(255),\n\t`author_role_en` varchar(255),\n\t`quote_vi` text NOT NULL,\n\t`quote_en` text,\n\t`avatar` varchar(500),\n\t`published` boolean NOT NULL DEFAULT true,\n\t`sort_order` int NOT NULL DEFAULT 0,\n\tCONSTRAINT `testimonials_id` PRIMARY KEY(`id`)\n);"
    ]
  },
  {
    "tag": "0002_striped_wonder_man",
    "statements": [
      "CREATE TABLE `page_views` (\n\t`id` int AUTO_INCREMENT NOT NULL,\n\t`created_at` timestamp NOT NULL DEFAULT (now()),\n\t`ip` varchar(64) NOT NULL,\n\t`session_id` varchar(40),\n\t`path` varchar(500) NOT NULL,\n\t`locale` varchar(8) NOT NULL DEFAULT 'vi',\n\t`referrer` varchar(500),\n\t`source` varchar(100) NOT NULL DEFAULT 'Truy cập trực tiếp',\n\t`medium` varchar(16) NOT NULL DEFAULT 'direct',\n\t`utm_campaign` varchar(191),\n\t`device` varchar(16) NOT NULL DEFAULT 'desktop',\n\t`browser` varchar(32),\n\t`os` varchar(32),\n\t`country` varchar(64),\n\t`city` varchar(100),\n\t`user_agent` varchar(400),\n\tCONSTRAINT `page_views_id` PRIMARY KEY(`id`)\n);",
      "CREATE INDEX `page_views_created_idx` ON `page_views` (`created_at`);",
      "CREATE INDEX `page_views_ip_idx` ON `page_views` (`ip`);"
    ]
  }
];
