CREATE TABLE `agendaVotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agendaId` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`voteType` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agendaVotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leaderId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leaderId` int,
	`agendaId` int,
	`userId` varchar(255) NOT NULL,
	`userName` varchar(255),
	`commentText` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderVotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leaderId` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`voteType` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderVotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`bio` text,
	`manifesto` text,
	`photoUrl` varchar(500),
	`affiliation` varchar(255),
	`region` varchar(255),
	`verified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaders_id` PRIMARY KEY(`id`)
);
