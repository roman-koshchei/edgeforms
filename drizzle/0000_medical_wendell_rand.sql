CREATE TABLE `fields` (
	`key` text NOT NULL,
	`validation` blob NOT NULL,
	`form_id` text NOT NULL,
	PRIMARY KEY(`form_id`, `key`),
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `forms` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submission_fields` (
	`submission_id` text NOT NULL,
	`field_key` text NOT NULL,
	`values` blob NOT NULL,
	PRIMARY KEY(`field_key`, `submission_id`),
	FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`field_key`) REFERENCES `fields`(`key`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `submission_files` (
	`key` text PRIMARY KEY NOT NULL,
	`bucket` text NOT NULL,
	`provider` text NOT NULL,
	`submission_id` text NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE cascade ON DELETE cascade
);
