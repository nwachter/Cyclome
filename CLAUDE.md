# Cyclome files and ressources

# Schema / MCD

// =============================================================================
// CYCLÔME : schéma de données
//
// Transcription directe du MCD. Chaque modèle et chaque champ porte un @map
// vers le nom exact du MCD : la base physique est donc identique au script SQL
// du dossier de conception, ce qui rend la correspondance vérifiable à l'oral.
//
// Trois conventions de traduction :
// CURRENCY -> Decimal(10, 2)
// LOGICAL -> Boolean
// GEOGRAPHY(POINT|POLYGON) -> Json au format GeoJSON
// Le cahier des charges technique écarte l'extension PostGIS : les tracés
// sont stockés en GeoJSON et lus directement par Turf.js.
//
// Les tables Session, Account et Verification ne figurent pas au MCD : elles
// sont générées et maintenues par Better Auth. Account porte le hachage du mot
// de passe (providerId = "credential"), ce qui explique son absence de User_.
// Régénérez ce bloc avec `npm run auth:generate` après une montée de version.
// =============================================================================

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

// enms
enum UserRole {
CLIENT @map("CLIENT")
ADMIN @map("ADMIN")
TECHNICIAN @map("TECHNICIAN")

@@map("user_role")
}

enum CycleType {
MECHANICAL
ELECTRICAL

@@map("cycle_type")
}

enum PictureStage {
AT_BOOKING
BEFORE_WORK
AFTER_WORK

@@map("picture_stage")
}

enum InterventionStatus {
PENDING
IN_PROGRESS
COMPLETED
CANCELLED

@@map("intervention_status")
}

model User {
id String @id @map("user_id") @db.VarChar(50)
email String @unique @map("user_email") @db.VarChar(300)
name String @map("user_name") @db.VarChar(300)
role UserRole? @default(CLIENT) @map("user_role")
image String? @map("user_image_url") @db.VarChar(150)
//also delete Session lines for deactivated / deconnected users
status String @default("ACTIVE") @map("user_status") @db.VarChar(20)
emailVerified Boolean @default(false) @map("user_email_verified")
createdAt DateTime @default(now()) @map("user_created_at")
updatedAt DateTime @updatedAt @map("user_updated_at")

client Client?
technician Technician?
pictures Picture[]
cancelledInterventions Intervention[] @relation("CancelledBy")
sessions Session[]
accounts Account[]

@@map("user_")
}

// tables Better Auth

model Session {
id String @id @db.VarChar(50)
userId String @map("id_user") @db.VarChar(50)
token String @unique @db.VarChar(255)
expiresAt DateTime
ipAddress String? @db.VarChar(45)
userAgent String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@map("session")
@@index([userId])
}

model Account {
id String @id @db.VarChar(50)
userId String @map("id_user") @db.VarChar(50)
accountId String @db.VarChar(255)
providerId String @db.VarChar(50)
/// Hachage du mdp pour le fournisseur "credential"
password String? @db.VarChar(255)
accessToken String?
refreshToken String?
accessTokenExpiresAt DateTime?
refreshTokenExpiresAt DateTime?
scope String?
idToken String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@map("account")
@@index([userId])
}

model Verification {
id String @id @db.VarChar(50)
identifier String @db.VarChar(300)
value String @db.VarChar(255)
expiresAt DateTime
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@map("verification")
@@index([identifier])
}

// profils

model Client {
id Int @id @default(autoincrement()) @map("client_id")
lastname String @map("client_lastname") @db.VarChar(30)
firstname String @map("client_firstname") @db.VarChar(30)
address String @map("client_address") @db.VarChar(100)
phone String? @map("client_phone") @db.VarChar(15)
postalCode String @map("client_postal_code") @db.VarChar(10)
city String @map("client_city") @db.VarChar(30)
// Point GeoJSON : { "type": "Point", "coordinates": [lng, lat] }
location Json? @map("client_location")
userId String @unique @map("id_user") @db.VarChar(50)

user User @relation(fields: [userId], references: [id])
cycles Cycle[]
interventions Intervention[]

@@map("client")
}

model Technician {
id Int @id @default(autoincrement()) @map("technician_id") @db.SmallInt
phone String? @map("technician_phone") @db.VarChar(15)
//Dernière position connue, alimentée pendant une intervention
location Json? @map("technician_location")
userId String @unique @map("id_user") @db.VarChar(50)

user User @relation(fields: [userId], references: [id])
zones Zone[]
interventions Intervention[]

@@map("technician")
}

// vélos

model Cycle {
id Int @id @default(autoincrement()) @map("cycle_id")
type CycleType @map("cycle_type")
/// Usage : Ville, VTC, VTT, Route, Pliant, Cargo
category String? @map("cycle_category") @db.VarChar(30)
brand String @map("cycle_brand") @db.VarChar(50)
model String @map("cycle_model") @db.VarChar(50)
year Int @map("cycle_year") @db.SmallInt
motorisation String? @map("cycle_motorisation") @db.VarChar(60)
status String @map("cycle_status") @db.VarChar(15)
clientId Int @map("id_client")

client Client @relation(fields: [clientId], references: [id])
interventions Intervention[]

@@index([clientId])
@@map("cycle_")
}

model OperationType {
id Int @id @default(autoincrement()) @map("operation_type_id")
name String @map("operation_type_name") @db.VarChar(50)
description String? @map("operation_type_description") @db.VarChar(500)

packages Package[]

@@map("operation_type")
}

model Package {
id Int @id @default(autoincrement()) @map("package_id")
name String? @map("package_name") @db.VarChar(100)
// Durée en minutes
duration Int @map("package_duration")
price Decimal @map("package_price") @db.Decimal(10, 2)
description String? @map("package_description")
active Boolean @default(true) @map("package_active")
operationTypeId Int @map("id_operation_type")

operationType OperationType @relation(fields: [operationTypeId], references: [id])
interventions Intervention[]

@@index([operationTypeId])
@@map("package")
}

model Product {
id Int @id @default(autoincrement()) @map("product_id")
name String? @map("product_name") @db.VarChar(100)
reference String @unique @map("product_reference") @db.VarChar(30)
price Decimal @map("product_price") @db.Decimal(10, 2)
description String? @map("product_description") @db.VarChar(1000)
status String @map("product_status") @db.VarChar(15)

contains Contain[]

@@map("product")
}

// zones, disponibilités, créneaux

model Zone {
id Int @id @default(autoincrement()) @map("zone_id")
name String @map("zone_name") @db.VarChar(30)
// Polygone GeoJSON lu directement par Turfjs
boundary Json @map("zone_boundary")
description String? @map("zone_description") @db.VarChar(500)
color String? @map("zone_color") @db.VarChar(20)
active Boolean @default(true) @map("zone_active")
technicianId Int? @map("id_technician") @db.SmallInt

technician Technician? @relation(fields: [technicianId], references: [id])
availabilities Availability[]

@@index([technicianId])
@@map("zone")
}

model Availability {
id Int @id @default(autoincrement()) @map("availability_id")
startDate DateTime @map("availability_start_date")
endDate DateTime @map("availability_end_date")
zoneId Int @map("id_zone")

zone Zone @relation(fields: [zoneId], references: [id], onDelete: Cascade)
slots Slot[]

@@index([zoneId, startDate])
@@map("availability")
}

// 1 créneau = max une intervention Intervention.slotId). un forfait plus long démarre sur l'un d'eux et marque `booked` ceux qu'il recouvre (transaction de réservation)
model Slot {
id Int @id @default(autoincrement()) @map("slot_id")
startDate DateTime @map("slot_start_date")
endDate DateTime @map("slot_end_date")
booked Boolean @default(false) @map("slot_booked")
availabilityId Int @map("id_availability")

availability Availability @relation(fields: [availabilityId], references: [id], onDelete: Cascade)
intervention Intervention?

@@unique([availabilityId, startDate])
@@index([startDate, booked])
@@map("slot")
}

// interventions

model Intervention {
id Int @id @default(autoincrement()) @map("intervention_id")
// Problème signalé par le client à la réservation
description String @map("intervention_description") @db.VarChar(1000)
address String @map("intervention_address") @db.VarChar(150)
addressComplement String? @map("intervention_address_complement") @db.VarChar(150)
postalCode String @map("intervention_postal_code") @db.VarChar(15)
city String @map("intervention_city") @db.VarChar(30)
// Point GeoJSON de l'adresse d'intervention
location Json @map("intervention_location")
totalPrice Decimal @map("intervention_total_price") @db.Decimal(10, 2)
date DateTime @map("intervention_date")
// Durée du forfait à la réservation
duration Int @map("intervention_duration")
status InterventionStatus @map("intervention_status")
startedAt DateTime? @map("intervention_started_at")
completedAt DateTime? @map("intervention_completed_at")
cancelledAt DateTime? @map("intervention_cancelled_at")
cancellationReason String? @map("intervention_cancellation_reason") @db.VarChar(1000)
technicianComment String? @map("intervention_technician_comment")

cancelledById String? @map("id_cancelled_by") @db.VarChar(50)
cycleId Int @map("id_cycle")
packageId Int @map("id_package")
slotId Int @unique @map("id_slot")
technicianId Int @map("id_technician") @db.SmallInt
clientId Int @map("id_client")

cancelledBy User? @relation("CancelledBy", fields: [cancelledById], references: [id])
cycle Cycle @relation(fields: [cycleId], references: [id])
package Package @relation(fields: [packageId], references: [id])
slot Slot @relation(fields: [slotId], references: [id])
technician Technician @relation(fields: [technicianId], references: [id])
client Client @relation(fields: [clientId], references: [id])

pictures Picture[]
contains Contain[]

@@index([date, status])
@@index([technicianId, date])
@@index([clientId])
@@map("intervention")
}

/// Le moment de la prise de vue est porté par `stage`, l'auteur par la clé étrangère vers l'utilisateur. rôle de l'auteur déduit via jointure
model Picture {
id Int @id @default(autoincrement()) @map("picture_id")
url String @map("picture_url") @db.VarChar(150)
mimeType String @map("picture_mime_type") @db.VarChar(30)
stage PictureStage @map("picture_stage")
createdAt DateTime @default(now()) @map("picture_created_at")
userId String @map("id_user") @db.VarChar(50)
interventionId Int @map("id_intervention")

user User @relation(fields: [userId], references: [id])
intervention Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)

@@index([interventionId, stage])
@@map("picture")
}

model Contain {
interventionId Int @map("id_intervention")
productId Int @map("id_product")
quantity Int @map("quantity") @db.SmallInt
//Prix figé au moment de la commande
unitPrice Decimal @map("unit_price") @db.Decimal(10, 2)

intervention Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
product Product @relation(fields: [productId], references: [id])

@@id([interventionId, productId])
@@map("contain")
}

// société

model Society {
id Int @id @default(autoincrement()) @map("society_id")
name String @map("society_name") @db.VarChar(50)
phone String @map("society_phone") @db.VarChar(15)
description String? @map("society_description") @db.VarChar(1000)
logoUrl String? @map("society_logo_url") @db.VarChar(500)
address String @map("society_address") @db.VarChar(200)

@@map("society")
}

## Cahier des charges fonctionnel

Concepteur développeur d’Applications

Ce projet réalisé en cours de formation est destiné à permettre la validation de l’intégralité des compétences du référentiel de certification.

Ce projet peut être présenté à l’examen de certification et s’intégrer dans le Dossier Professionnel.

Il pourra être étendu avec des fonctionnalités utilisant l’intelligence artificielle (compétences non évaluées dans le référentiel).

Compétences à valider :

Installer et configurer son environnement de travail en fonction du projet

Développer des interfaces utilisateur

Développer des composants métier

Contribuer à la gestion d’un projet informatique

Analyser les besoins et maquetter une application

Définir l’architecture logicielle d’une application

Concevoir et mettre en place une base de données relationnelle

Développer des composants d’accès aux données SQL et NoSQL

Préparer et exécuter les plans de tests d’une application

Préparer et documenter le déploiement d’une application

Contribuer à la mise en production dans une démarche DevOps

HomeCycl’Home

Réparation et entretien de vélos à domicile

L’entreprise LeCycleLyonnais fort de ses 68 ans d'expérience dans la vente et l’entretien de bicyclette souhaite mettre en place un service de réparation et d’entretien à domicile de bicyclettes et bicyclettes électriques (VAE). La vente additionnelle de produits dédiés sera aussi proposée.

Besoin:

Une application permettant de proposer des créneaux de rendez-vous pour de la maintenance qui seront attribués aux techniciens en fonction de leur zone géographique.

Les administrateurs établissent des disponibilités d'interventions par zone géographique. La durée de l'intervention, et donc du créneau prévu, dépend du temps nécessaire à l'intervention, déterminé selon un forfait préétabli dans l'application.

Lorsque le client accède à l'application, il est invité à entrer son adresse ou à se connecter s'il possède déjà un compte. Dans ce dernier cas, son adresse lui sera suggérée.

Dans le cas contraire, l'application lui propose une adresse validée par un service dédié (comme Google Maps ?).

Des informations concernant le modèle, l'année et le type de cycle sont requises.

Le client sélectionne une opération de maintenance.

Pour une maintenance, le client choisit un forfait (plusieurs options de forfaits d'entretien sont disponibles) puis un créneau horaire conforme au type de forfait dans sa zone géographique. Il peut également ajouter des photos depuis son smartphone pour fournir plus d'informations. De plus, le client a la possibilité d'ajouter des articles (produits). Une fois le rendez-vous validé, il est invité à créer un compte s'il n'en a pas encore.

À la fin de chaque intervention, le technicien prend une ou plusieurs photos du travail réalisé et peut apporter des modifications au dossier du client. Il procède au paiement.

Plusieurs types d’utilisateurs:

Administrateur de l’application

Techniciens en charge de la réparation, maintenance des cycles

Clients

Fonctionnalités:

Administrateurs:

Gérer les informations de la société affichées sur l’application

Lister les clients et modifier les informations liées

Lister les interventions, modifier, ajouter et supprimer

Afficher le planning (calendrier) par technicien

Afficher, modifier et ajouter des utilisateurs de l’application (techniciens, admin, client). Désactiver (ne pas supprimer)

Afficher, modifier, supprimer une intervention (une intervention supprimée libère/ajoute un créneau du planning)

Afficher, modifier et ajouter des produits additionnelles

Afficher, modifier et ajouter les prix des interventions

Afficher, modifier et ajouter des zones géographiques affectées aux techniciens

Afficher, modifier et ajouter des modèle de planifications (option)

Techniciens:

Listes les interventions passés

Listes des interventions de la journée

Listes des interventions des jours suivants

Afficher les détails des interventions

Afficher les détails des clients dans les interventions

Modifier les intervention,

Déposer des photos dans les interventions

Ajouter des commentaires dans les interventions

Marquer les interventions comme faites.

Annuler une intervention.

Clients:

Créer un compte / se connecter

Lister les interventions passées

Réserver un créneau pour une intervention

Annuler une intervention

Voir ses cycles et pouvoir les modifier.

Voir sa fiche et pouvoir modifier

Livrables :

Déterminer collégialement les livrables.

Cahier des charges fonctionnel

Cahier des charges techniques

Macro-planning

Backlog / sprint / release

Infrastructure (VPS ou IAAS)

Maquettage

Modélisation

Application(s)

Déploiement en mode Devops

Tests (unitaires, fonctionnels)

Documentation

Conseil:

Établir un user Story Mapping afin de prioriser le développement en fonction des Compétences à valider lors du module.

EPICS - US

Epic - Mise en place

En tant que développeur, je veux conteneuriser l'application avec Docker afin de portabiliser et déployer le code à la fin du développement

En tant que développeur, je veux mettre en place une pipeline CI/CD afin d'automatiser les tests et le déploiement à chaque push/pull request

En tant que développeur, je veux mettre en place mes plans de tests (unitaires et fonctionnels) afin de tester les fonctionnalités de mon application et mon code

En tant que développeur, je veux mettre en place la BDD afin de persister les données enregistrées

En tant que développeur, je veux concevoir le MCD / MLD afin de définir la structure relationnelle de la BDD

En tant que développeur, je veux mettre en place mon environnement de développement front afin de développer mon front (tests compris)

En tant que développeur, je veux mettre en place mon environnement de développement back afin de pouvoir développer mon backend (tests compris)

En tant que développeur, je veux créer un fichier README afin de documenter l'installation du projet

En tant que développeur, je veux mettre en place un dépôt Git avec un système de branches afin de versionner mon code

Epic : Authentification & Sécurité

En tant qu'administrateur, je veux pouvoir me connecter à l'application de manière sécurisée afin d'accéder à mon espace d'administration

En tant qu'administrateur, je veux pouvoir avoir accès à une page "mot de passe oublié" afin de pouvoir récupérer l'accès à mon compte en cas de mot de passe oublié

En tant que technicien, je veux pouvoir me connecter à l'application afin d'accéder à l'application et aux interventions

En tant que technicien, je veux pouvoir changer mon mot de passe afin de pouvoir me connecter à mon compte

En tant que client, je veux pouvoir créer un compte afin de sauvegarder mes informations et accéder à l'application

En tant que client, je veux me connecter à mon compte afin d'accéder à mes données personnelles et à mes interventions

En tant que client, je veux pouvoir me rendre sur une page « mdp oublié » afin de changer mon mdp si je l'ai oublié

En tant que client, je veux que mes données soient protégées afin de garantir la confidentialité et la sécurité de mes informations personnelles (exemple mdp haché)

En tant que client, je veux avoir accès à une page m'indiquant comment sont traitées mes données afin de m'assurer que les règles de confidentialité et de modification/suppression des données soient respectées

Epic : Gestion des utilisateurs

En tant qu'administrateur, je veux pouvoir lister tous les utilisateurs (clients, techniciens, admins) afin d'avoir une vue d'ensemble des différents utilisateurs.

En tant qu'administrateur, je veux pouvoir afficher les administrateurs de l'application afin de consulter la liste des administrateurs de l'application.

En tant qu'administrateur, je veux pouvoir créer un utilisateur (technicien, admin, client) afin de lui donner accès à l'application.

En tant qu'administrateur, je veux pouvoir modifier les informations d'un utilisateur afin de les tenir à jour.

En tant qu'administrateur, je veux pouvoir désactiver un utilisateur afin de lui retirer l'accès sans perdre son historique.

Epic : Gestion du profil et des vélos

En tant que client, je veux pouvoir accéder à mes informations personnelles afin de consulter mes informations enregistrées sur l'application.

En tant que client, je veux pouvoir modifier ma fiche client afin de mettre à jour les informations relatives aux interventions.

En tant que client, je veux pouvoir consulter la liste de mes vélos afin de voir mes vélos enregistrés.

En tant que client, je veux pouvoir modifier mes vélos afin de mettre à jour leurs informations.

Option - En tant que client, je veux pouvoir supprimer (désactiver) un vélo enregistré afin d'indiquer que ce vélo n'est plus utilisé

Option - En tant que client, je veux pouvoir ajouter un vélo (modèle, année, type) afin que les techniciens connaissent le matériel à entretenir.

(Non présent dans CDC : En tant que technicien, je veux pouvoir consulter ma fiche technicien afin de consulter les informations relatives à mon profil.)

(Non présent dans CDC : En tant que technicien, je veux pouvoir modifier ma fiche technicien afin de mettre à jour mes informations personnelles.)

Epic : Réservation d'une intervention

En tant que client, je veux pouvoir entrer mon adresse (ou mon code postal) afin que l'application puisse me géolocaliser.

En tant que client, je veux que mon adresse soit validée par un service externe afin d'éviter de saisir une adresse incorrecte.

En tant que client, je veux que mon adresse soit pré-remplie quand je suis déjà inscrit lors d'une réservation afin de gagner du temps.

En tant que client, je veux sélectionner un type d'opération afin de me voir proposer les forfaits adaptés

En tant que client, je veux pouvoir sélectionner un de mes vélos enregistrés lors d'une réservation afin de gagner du temps

En tant que client, lors de la prise de RDV, je veux pouvoir spécifier le modèle, l'année et le type de mon vélo afin de faciliter l'intervention.

En tant que client, je veux pouvoir sélectionner un forfait afin d'avoir accès au type d'intervention adapté à mon besoin.

En tant que client, je veux voir les créneaux disponibles correspondant à mon forfait et à ma zone afin de choisir un horaire qui me convient.

En tant que client, je veux pouvoir réserver un créneau horaire parmi une liste de créneaux disponibles afin de planifier l'intervention.

En tant que client, je veux pouvoir ajouter des photos afin de fournir plus d'informations pour une réservation.

En tant que client je souhaite pouvoir consulter la liste d'articles additionnels disponibles afin de ajouter les articles dont j'aurais besoin en plus de l'intervention.

En tant que client, je veux pouvoir ajouter des articles additionnels dans le cadre d'une intervention afin d'acheter les produits dont j'ai besoin.

En tant que client, je veux créer un compte après la validation de ma réservation afin de ne pas être bloqué pour réserver.

En tant que client, je veux pouvoir accéder a une option permettant d'annuler une intervention afin de signaler que l'intervention n'est plus d'actualité.

Option - En tant que client, je veux pouvoir modifier une intervention jusqu'à 48h avant afin de pouvoir corriger certains détails de l’intervention ou signaler une situation particulière.

Epic : Gestion des interventions

En tant que client, je veux pouvoir afficher mes interventions passées afin d'avoir un historique.

Option - En tant que client, je veux pouvoir afficher la liste de mes interventions prévues afin de vérifier la date et les informations des interventions

En tant qu'administrateur, je veux pouvoir afficher la liste des interventions afin d'avoir une vue d'ensemble des interventions passées et prévues.

En tant qu'administrateur, je veux pouvoir afficher une intervention afin d'en consulter les détails (dont son prix).

En tant qu'administrateur, je veux pouvoir modifier une intervention (dont son prix) afin de mettre à jour les prestations et tarifs proposées par mon entreprise.

En tant qu'administrateur, je veux pouvoir supprimer une intervention (dont son prix) afin de retirer les interventions qui ne sont plus d'actualité.

En tant qu'administrateur, je veux pouvoir afficher le planning (calendrier) par technicien pour avoir une vue des interventions prévues pour chaque technicien.

En tant que technicien, je veux avoir accès à une liste de mes interventions de la journée afin de pouvoir organiser ma journée.

En tant que technicien, je veux avoir accès à une liste de mes interventions futures afin de pouvoir anticiper et organiser ma semaine.

En tant que technicien, je veux avoir accès à une liste de mes interventions passées afin d'avoir une vue d'ensemble sur le travail que j'ai accompli.

En tant que technicien, je veux pouvoir voir les détails de chacune de mes interventions (adresse, forfait, vélo, client) pour avoir les informations nécessaires me permettant de réaliser mes interventions.

En tant que technicien, je veux pouvoir afficher les détails des clients dans les interventions afin de consulter les informations relatives aux clients liés a l'intervention.

En tant que technicien, je veux modifier les informations d'une intervention afin de corriger ou compléter un dossier.

En tant que technicien, je veux pouvoir ajouter des photos dans les interventions afin de consigner plus d'informations sur l'état du vélo avant/après l'intervention.

En tant que technicien, je veux pouvoir ajouter des commentaires a chaque intervention afin de conserver les informations importantes concernant l'intervention.

En tant que technicien, je veux pouvoir marquer une intervention comme étant terminée afin de mettre à jour son statut sur l’application.

En tant que technicien, je veux pouvoir annuler une intervention (sous justification) afin de signaler une intervention comme étant caduque.

(Annulé - En tant que technicien, je veux pouvoir procéder au paiement de l'intervention (CB, chèque, espèces).)

Epic : Gestion des zones géographiques

En tant qu'administrateur, je veux pouvoir afficher les zones géographiques affectées aux techniciens afin d'avoir une vue d'ensemble de la couverture des interventions.

En tant qu'administrateur, je veux pouvoir ajouter des zones géographiques affectées aux techniciens afin d'étendre la couverture des interventions à de nouveaux secteurs.

En tant qu'administrateur, je veux pouvoir modifier les zones géographiques affectées aux techniciens afin de réorganiser la répartition des secteurs d'intervention.

En tant qu'administrateur, je veux pouvoir supprimer une zone géographique affecté aux techniciens afin de retirer les zones géographiques qui ne sont plus d'actualité.

En tant qu'administrateur, je veux pouvoir affecter un technicien à une zone géographique afin de pouvoir répartir les techniciens dans les différentes zone.

SI PAS MODELE PLANIFICATION - En tant qu'administrateur, je veux pouvoir définir des disponibilités d'intervention par zone géographique afin de contrôler les créneaux proposés aux clients.

Epic : Forfaits et produits additionnels

En tant qu'administrateur, je veux pouvoir afficher la liste des forfaits afin d'avoir une vue d'ensemble des offres disponibles

En tant qu'administrateur, je veux pouvoir créer un forfait (inclus dans une intervention) afin d'enrichir la liste des forfaits disponibles.

En tant qu'administrateur, je veux pouvoir modifier un forfait afin de mettre à jour ses informations.

En tant qu'administrateur je veux pouvoir supprimer un forfait afin de retirer de l'application les forfaits qui ne sont plus d'actualité.

En tant qu'administrateur, je veux pouvoir afficher la liste des produits additionnels afin d'avoir une vue d'ensemble des articles disponibles à la vente.

En tant qu'administrateur, je veux pouvoir ajouter un produit additionnel afin d'enrichir le catalogue de produits.

En tant qu'administrateur, je veux pouvoir modifier un produit additionnel afin de mettre à jour les informations des produits.

En tant qu'administrateur, je veux pouvoir supprimer un produit additionnel afin de retirer les articles qui ne sont plus disponibles.

Epic : Gestion des informations de la société

En tant qu'administrateur, je veux pouvoir ajouter les informations de la société afin de pouvoir rendre disponibles les détails de ma société.

En tant qu'administrateur, je veux pouvoir modifier les informations de la société afin de mettre à jour les détails de ma société consultables par les utilisateurs.

En tant qu'administrateur, je veux pouvoir consulter les informations de ma société afin d'avoir un aperçu des informations consultables par mes clients.

Epic Optionnel : Gestion des modèles de planification

Option - En tant qu'administrateur, je veux pouvoir afficher les modèles de planifications afin d'avoir une vue d'ensemble des configurations de créneaux et matériels de chaque journée (ex : lundi/mardi matin interventions courtes - créneaux 15mn - matériel léger ; jeudi/vendredi intervention longues - créneaux 45min - matériel + cher).

Option - En tant qu'administrateur, je veux pouvoir ajouter un modèle de planification afin de définir de nouvelles configurations de créneaux horaires adaptées aux différents types d'interventions.

Option - En tant qu'administrateur, je veux pouvoir modifier un modèle de planification afin de pouvoir ajuster les créneaux, le type d'interventions ou le matériel associé selon les cas.

Option - En tant qu'administrateur, je veux pouvoir supprimer un modèle de planification afin de retirer les configurations de créneaux qui ne sont plus utilisées.

## Cahier des charges technique

Introduction & Ressources

Voici le Cahier des Charges Technique de l'application HomeCycl'Home, conçu autour de la stack TypeScript Next.js front & back.

La Stack Technique

Front-end

Next.js (App Router) & React : Framework React assurant le rendu hybride (SSR / Client) pour une application rapide et accessible. Idéal pour le tableau de bord d'administration sur ordinateur tout en proposant une interface fluide installable en PWA (Progressive Web App) sur mobile pour les techniciens sur le terrain.

Leaflet & React-Leaflet : Moteur cartographique permettant d'afficher le fond de carte d'OpenStreetMap (zone de Lyon et métropole).

Leaflet-Geoman (leaflet-geoman-free) : Extension cartographique intégrée à Leaflet. Elle permet à l'administrateur dessiner, modifier, déplacer et supprimer des polygones à la souris afin de délimiter les zones d'intervention.

React Hook Form et TanStack Query : React Hook Form gère les formulaires du site pour éviter les ralentissements pendant la saisie. TanStack Query s'occupe de récupérer les données du serveur, de les mettre en cache pour éviter les chargements inutiles, et de recharger la carte dès qu'une zone est ajoutée ou modifiée.

Calcul Spatial & Géolocalisation

Turf.js (@turf/turf) : Moteur de calcul géospatial exécuté côté serveur (API Routes Node.js/Next.js) et côté client. Il exploite les données au format standard GeoJSON pour :

Exécuter booleanPointInPolygon : Vérifier si l'adresse GPS du client est située dans le périmètre d'un technicien.

Exécuter booleanIntersects : Détecter instantanément les chevauchements et conflits entre deux zones géographiques lors du traçage admin.

Offrir des métriques d'analyse (calcul de superficie avec area).

API Adresse (Base Adresse Nationale - BAN) : Service de géocodage externe utilisé lors du parcours client pour valider la saisie de l'adresse à Lyon et la convertir en coordonnées GPS [Longitude, Latitude].

Back-end, Sécurité, Documentation

API Routes Next.js : Architecture d'API REST structurée (ex: /api/zones, /api/interventions) séparant la logique métier du rendu visuel.

Zod : Librairie de validation de schémas. Zod valide la structure de toutes les requêtes entrantes (champs formulaires, objets GeoJSON des zones) avant tout traitement métier ou écriture en base de données.

Better Auth : Solution d'authentification open source robuste et auto-hébergée. Elle gère la sécurité des sessions, le hachage des mots de passe et le contrôle d'accès basé sur les rôles (Admin, Technicien, Client).

Swagger (OpenAPI) : Documentation dynamique de l'API REST générée automatiquement et consultable sur /api-docs pour tester les endpoints en direct.

La Base de données

PostgreSQL & Prisma ORM : PostgreSQL garantit la persistance, l'intégrité relationnelle et l'isolation des transactions (verrouillage des créneaux de réservation contre le surbooking).

Stockage GeoJSON : Les polygones créés via Leaflet-Geoman sont enregistrés sous forme d'objets GeoJSON dans une colonne Json via Prisma (schema.prisma). Ce format est lu nativement par Turf.js sans nécessiter d'extension pour Postgre (extension PostGIS).

Tests

Jest : Cet outil sert à l'écriture des tests unitaires. Il vérifie des morceaux de code isolés du reste du système. Il permet par exemple de tester l'algorithme qui valide si l'adresse d'un client à Lyon tombe bien à l'intérieur du polygone dessiné pour un technicien.

Playwright : C'est une librairie qui ouvre un navigateur automatisé pour exécuter des tests de bout en bout. Il simule le parcours complet d'un utilisateur réel : connexion à l'application, navigation sur la carte, dessin d'une zone et vérification que la zone est bien enregistrée puis visible à l'écran.

Versioning, infrastructure, déploiement

GitHub : Gestionnaire de version permettant d’héberger le code source du projet. Le travail est organisé par branches (feature/*, dev, main).

GitHub Actions (CI/CD) : C'est le système qui automatise toute la chaîne de déploiement et de tests. Dès que le code est poussé sur la branche principale de GitHub, ce système vérifie que l'application compile sans erreur, lance les tests Jest et Playwright, puis déploie automatiquement la nouvelle version sur le VPS.

Docker et Docker Compose : Docker permet d'isoler l'application Next.js et la base de données PostgreSQL dans des conteneurs. De cette manière, le projet fonctionne exactement de la même manière sur l'ordinateur de développement et sur le serveur VPS en production.

Contraintes Identifiées

Mobilité et Réseau (Techniciens) : L'interface technicien sera principalement utilisée sur smartphone. L'UX doit être Mobile-First, épurée, et capable de gérer des baisses de connexion réseau sur le terrain (PWA mobile)

Géolocalisation et Cartographie : La validation de l'adresse du client et le découpage des zones d'intervention nécessitent l'intégration d'une API externe (l'API Gouvernementale FR BAN).

Réservations Concurrentes : Pour éviter une double-réservation pour un technicien, l'API doit verrouiller les créneaux horaires en temps réel lors d'une réservation (transactions isolées au niveau de la base de données).

Stockage et Traitement des Médias : Les techniciens et clients uploadent des photos d'interventions. Un système d'optimisation (redimensionnement, compression) et de stockage externe (ici, volume Docker sécurisé, librairie de compression à définir style browser-image-compression pour éviter coté client les photos 12 Megapixels) est indispensable pour préserver le serveur.

Architecture du Système

Ce document décrit l'architecture globale, la circulation des données, les choix d'infrastructure et les mécanismes de sécurité mis en place pour l'application HomeCycl’Home.

1. Vue d'Ensemble de l'Architecture (Global Architecture)

L'application repose sur une architecture Monolithe Modulaire (Next.js App Router) conteneurisée avec Docker, facilitant la parité dev/prod tout en maintenant un déploiement simple sur VPS.

2. Modèle de Données et base de données (Prisma / PostgreSQL)

Le stockage cartographique s'appuie sur le format natif GeoJSON stocké sous forme de type JSON dans PostgreSQL, sans dépendance à l'extension PostGIS.

Modèle Relationnel (schema.prisma)

//Ceci n'est qu'un exemple de schema.prisma, la version en prod peut etre différente
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

generator client {
provider = "prisma-client-js"
}

//Enums

enum UserRole {
client
admin
technician
}

enum CycleType {
normal
VAE
}

enum PictureSource {
client
technician
}

enum PictureType {
client
before
after
}

//Entités
model User {
id Int @id @default(autoincrement()) @map("user_id") @db.SmallInt
email String @unique @map("user_email") @db.VarChar(300)
password String @map("user_password") @db.VarChar(255) // Augmentt pour hachage
username String? @map("user_username") @db.VarChar(50)
role UserRole? @map("user_role")
status String @map("user_status") @db.VarChar(20)

client Client?
technician Technician?

@@map("user_")
}

model Client {
id Int @id @default(autoincrement()) @map("client_id")
lastname String @map("client_lastname") @db.VarChar(30)
firstname String @map("client_firstname") @db.VarChar(30)
address String @map("client_address") @db.VarChar(100)
phone String? @map("client_phone") @db.VarChar(15)
postalCode String @map("client_postal_code") @db.VarChar(10)
city String @map("client_city") @db.VarChar(30)
location Json? @map("client_location") // Point GeoJSON [lng, lat]
userId Int @unique @map("id_user") @db.SmallInt

user User @relation(fields: [userId], references: [id])
cycles Cycle[]
interventions Intervention[]
}

model Technician {
id Int @id @default(autoincrement()) @map("technician_id") @db.SmallInt
phone String? @map("technician_phone") @db.VarChar(15)
userId Int @unique @map("id_user") @db.SmallInt

user User @relation(fields: [userId], references: [id])
zones Zone[]
interventions Intervention[]
}

model Zone {
id Int @id @default(autoincrement()) @map("zone_id")
name String @map("zone_name") @db.VarChar(30)
boundary Json @map("zone_boundary") // GeoJSON Polygon
description String? @map("zone_description") @db.VarChar(500)
active Boolean? @map("zone_active")
technicianId Int @map("id_technician") @db.SmallInt

technician Technician @relation(fields: [technicianId], references: [id])
availabilities Availability[]
}

model Availability {
id Int @id @default(autoincrement()) @map("availability_id")
startDate DateTime @map("availability_start_date")
endDate DateTime @map("availability_end_date")
zoneId Int @map("id_zone")

zone Zone @relation(fields: [zoneId], references: [id])
slots Slot[]
}

model Slot {
id Int @id @default(autoincrement()) @map("slot_id")
startDate DateTime @map("slot_start_date")
endDate DateTime @map("slot_end_date")
booked Boolean @map("slot_booked")
availabilityId Int @map("id_availability")

availability Availability @relation(fields: [availabilityId], references: [id])
intervention Intervention?
}

model OperationType {
id Int @id @default(autoincrement()) @map("operation_type_id")
name String @map("operation_type_name") @db.VarChar(50)
description String? @map("operation_type_description") @db.VarChar(500)

packages Package[]
}

model Package {
id Int @id @default(autoincrement()) @map("package_id")
name String? @map("package_name") @db.VarChar(100)
duration Int @map("package_duration") // en minutes
price Decimal @map("package_price") @db.Decimal(10, 2)
description String? @map("package_description") @db.Text
operationTypeId Int @map("id_operation_type")

operationType OperationType @relation(fields: [operationTypeId], references: [id])
interventions Intervention[]
}

model Product {
id Int @id @default(autoincrement()) @map("product_id")
name String? @map("product_name") @db.VarChar(100)
price Decimal @map("product_price") @db.Decimal(10, 2)
description String? @map("product_description") @db.VarChar(1000)
status String @map("product_status") @db.VarChar(15)

contains Contain[]
}

model Cycle {
id Int @id @default(autoincrement()) @map("cycle_id")
type CycleType @map("cycle_type")
year Int @map("cycle_year") @db.SmallInt
model String @map("cycle_model") @db.VarChar(50)
status String @map("cycle_status") @db.VarChar(15)
clientId Int @map("id_client")

client Client @relation(fields: [clientId], references: [id])
interventions Intervention[]

@@map("cycle_")
}

model Intervention {
id Int @id @default(autoincrement()) @map("intervention_id")
description String? @map("intervention_description") @db.VarChar(50)
address String? @map("intervention_address") @db.VarChar(50)
postalCode String? @map("intervention_postal_code") @db.VarChar(10)
city String? @map("intervention_city") @db.VarChar(30)
location Json? @map("intervention_location") // Point GeoJSON [lng, lat]
price Decimal @map("intervention_price") @db.Decimal(10, 2)
date DateTime? @map("intervention_date")
status String @map("intervention_status") @db.VarChar(20)
cancellationReason String? @map("intervention_cancellation_reason") @db.Text
technicianComment String? @map("intervention_technician_comment") @db.Text
clientComment String? @map("intervention_client_comment") @db.Text

cycleId Int @map("id_cycle")
packageId Int @map("id_package")
slotId Int @unique @map("id_slot")
technicianId Int @map("id_technician") @db.SmallInt
clientId Int @map("id_client")

cycle Cycle @relation(fields: [cycleId], references: [id])
package Package @relation(fields: [packageId], references: [id])
slot Slot @relation(fields: [slotId], references: [id])
technician Technician @relation(fields: [technicianId], references: [id])
client Client @relation(fields: [clientId], references: [id])

pictures Picture[]
contains Contain[]
}

model Picture {
id Int @id @default(autoincrement()) @map("picture_id")
link String @map("picture_link") @db.VarChar(150)
extension String @map("picture_extension") @db.VarChar(5)
source PictureSource @map("picture_source")
type PictureType @map("picture_type")
interventionId Int @map("id_intervention")

intervention Intervention @relation(fields: [interventionId], references: [id])
}

model Contain {
interventionId Int @map("id_intervention")
productId Int @map("id_product")
quantity Int @map("quantity") @db.SmallInt
unitPrice Decimal @map("unit_price") @db.Decimal(10, 2)

intervention Intervention @relation(fields: [interventionId], references: [id])
product Product @relation(fields: [productId], references: [id])

@@id([interventionId, productId])
}

model Society {
id Int @id @default(autoincrement()) @map("society_id")
name String @map("society_name") @db.VarChar(50)
address String @map("society_address") @db.VarChar(200)
phone String @map("society_phone") @db.VarChar(15)
description String? @map("society_description") @db.VarChar(1000)
logoUrl String? @map("society_logo_url") @db.VarChar(500)
}

4. Architecture Sécurité & Authentification

Authentification (Better Auth) : Sessions sécurisées avec cookies HttpOnly, SameSite=Lax, et hachage fort des mots de passe (bcrypt).

Contrôle d'Accès basé sur les Rôles (RBAC) :

ADMIN : Accès complet aux endpoints /api/admin/*, modification des prix, gestion des zones et des utilisateurs.

TECHNICIAN : Lecture seule sur son planning, écriture limitée à la mise à jour des interventions qui lui sont assignées (IN_PROGRESS, photos, commentaires).

CLIENT : Accès restreint à ses propres vélos, ses réservations et son profil.

Prévention de Double-Réservation : Les créneaux horaires sont réservés en BDD via une transaction PostgreSQL isolée (prisma.$transaction) empêchant deux clients de réserver la même plage horaire du même technicien simultanément.

5. Infrastructure & Pipeline DevOps (CI/CD & Docker)

Architecture des Conteneurs (docker-compose.yaml)

L'application est contenue dans 2 conteneurs légers communicant via un réseau interne Docker isolé.

//CECI n'est qu'un exemple possible de docker-compose, la version en prod peut etre différente

version: '3.8'

services:
app:
build: .
ports: - "3000:3000"
environment: - DATABASE_URL=postgresql://cyclo:enrouelibre@db:5432/cyclome
depends_on: - db

db:
image: postgres:16-alpine
restart: always
environment:
POSTGRES_USER: cyclo
POSTGRES_PASSWORD: enrouelibre
POSTGRES_DB: cyclome
volumes: - postgres_data:/var/lib/postgresql/data

volumes:
postgres_data:

Pipeline de Déploiement Continu (GitHub Actions)

6. Stratégie de Stockage Média et Optimisation Client

Pour respecter les contraintes de mobilité du technicien sur le terrain :

Compression Côté Client : Utilisation de la librairie browser-image-compression avant tout envoi pour réduire la taille des photos d'interventions de ~10 Mo à < 500 Ko.

Stockage : Enregistrement des fichiers optimisés sur un volume persistant Docker, avec stockage de l'URL dans la table Intervention.

## Design System

TailwindCSS est utilisé pour le design, utilisant des tokens conçus pour le projet. Se référer UNIQUEMENT aux tokens présent dans cyclome.tokens.json pour réaliser les designs.
