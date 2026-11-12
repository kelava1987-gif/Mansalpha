CREATE TABLE `mansalphaWorkspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`data` longtext NOT NULL,
	`revision` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mansalphaWorkspaces_id` PRIMARY KEY(`id`),
	CONSTRAINT `mansalphaWorkspaces_userId_unique` UNIQUE(`userId`)
);
