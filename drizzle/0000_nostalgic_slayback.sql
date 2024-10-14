CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text,
	`done` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text
);
