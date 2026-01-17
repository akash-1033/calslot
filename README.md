# CalSlot – Scheduling Platform (Calendly Clone)

A full-stack scheduling and booking web application inspired by **Calendly**.  
The platform allows users to create event types, configure weekly availability, and let others book time slots via a public booking page, with full backend enforcement of scheduling rules.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18-green.svg)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
---

## Overview

CalSlot is a scheduling platform that replicates the **core workflows and UX patterns of Calendly**, focusing on correctness, simplicity, and clean architecture.

The system enables:
- Admin users to define meeting types and availability
- Public users to book meetings via shareable links
- Automatic prevention of double bookings
- Clear separation of upcoming and past meetings

This project emphasizes **backend correctness** and **simple frontend design** over heavy abstractions.

---

## Key Features

### Core Features

- **Event Types Management**
  - Create, edit, and delete event types
  - Define duration and unique URL slug
  - Shareable public booking links

- **Availability Settings**
  - Weekly availability configuration (Mon–Fri)
  - Custom start and end times per day
  - Timezone-aware scheduling

- **Public Booking Page**
  - Month calendar view (custom built, no libraries)
  - Date-based slot fetching
  - Real-time slot availability
  - Booking form with name and email
  - Backend-enforced double booking prevention
  - Booking confirmation screen

- **Meetings Page**
  - View upcoming meetings
  - View past meetings
  - Cancel meetings (slot becomes available again)

### UI & UX

- Clean, white UI inspired by Calendly
- Left sidebar navigation
- Card-based layouts
- Simple blue accent color
- Desktop-first responsive design

---

## System Architecture

### Technology Stack

**Frontend**
- React 18 (functional components)
- React Router / Next.js App Router
- Tailwind CSS
- shadcn/ui (Button, Card, Dialog, Input, Tabs)
- Fetch API for HTTP requests

**Backend**
- Node.js 18
- Express.js
- RESTful API architecture
- Prisma ORM

**Database**
- PostgreSQL (Neon)

### High-Level Flow

## High-Level Flow

Frontend (React)  
↓  
API Layer (fetch)  
↓  
Express Routes  
↓  
Business Logic  
↓  
Prisma ORM  
↓  
PostgreSQL  

---

## Database Design

### Core Models

#### EventType
- name
- duration
- slug (unique)

#### Availability
- weekday (0–6)
- startTime
- endTime
- timezone

#### Booking
- eventTypeId (FK)
- inviteeName
- inviteeEmail
- startTime
- endTime
- status (CONFIRMED / CANCELLED)

---

### Constraints
- Unique slug per event type
- Time overlap checks to prevent double booking
- Cascading relationships between event types and bookings
- Server-side validation for all critical operations

## Usage

### Admin Flow
- Create event types (name, duration, slug)
- Configure weekly availability
- Share booking links

### Public Booking Flow
- Open booking link (`/book/:slug`)
- Select date
- Select available time slot
- Enter name and email
- Confirm booking

### Meetings Management
- View upcoming meetings
- View past meetings
- Cancel meetings if required

---

## API Overview

### Event Types
Management of different meeting configurations (e.g., "15-minute check-in").

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/event-types` | Retrieve all event types |
| **POST** | `/event-types` | Create a new event type |
| **PUT** | `/event-types/:id` | Update an existing event type |
| **DELETE** | `/event-types/:id` | Remove an event type |

### Availability
Manage the weekly recurring schedule for the admin user.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/availability` | Fetch current weekly availability |
| **POST** | `/availability` | Set or update weekly availability |

### Slots
Dynamic calculation of available times based on existing bookings.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/slots` | Get available slots for a specific date and event type |
| **Query Params** | `?eventTypeId=1&date=YYYY-MM-DD` | Required parameters for slot calculation |

### Bookings
Handling of confirmed appointments and cancellations.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/bookings` | List all bookings (Upcoming/Past) |
| **POST** | `/bookings` | Create a new booking (Double-booking checked) |
| **DELETE** | `/bookings/:id` | Cancel a booking and free up the slot |

## Project Structure

### Backend
The server-side logic, database management, and API routes.

```text
backend/
├── prisma/             # Database schema and migration files
│   ├── schema.prisma   # Single source of truth for DB models
│   └── migrations/     # SQL migration history
├── routes/             # Express API endpoints
│   ├── eventTypes.js   # CRUD for meeting types
│   ├── availability.js # Weekly schedule management
│   ├── slots.js        # Availability calculation logic
│   └── bookings.js     # Booking creation and cancellation
├── utils/              # Helper functions
│   └── slotGenerator.js # Core logic for generating time slots
└── index.js            # Entry point of the application
```

### Frontend
The client-side React application built with Next.js.

```text
frontend/
├── lib/api/            # Modular fetch functions for API calls
│   ├── event-types.js
│   ├── availability.js
│   ├── slots.js
│   └── bookings.js
├── components/         # Reusable UI components
│   ├── sidebar.jsx      # Main navigation
│   ├── event-type-card.jsx
│   ├── calendar.jsx     # Custom-built month view
│   └── time-slots.jsx   # List of available times
├── app/                # Next.js App Router (Pages & Layouts)
│   ├── page.jsx         # Dashboard / Home
│   ├── event-types/     # Event management page
│   ├── availability/    # Schedule settings page
│   ├── meetings/        # Bookings overview page
│   └── book/[slug]/     # Public-facing booking page (Dynamic)
└── main.jsx            # React root and global providers
```
## ✍️ Author

**Akash Kumar** *Backend-focused Full Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akash-1033)

---
