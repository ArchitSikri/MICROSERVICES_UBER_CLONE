# 🚖 Uber Clone — Microservices Architecture

A ride-hailing application inspired by Uber, built using a **microservices architecture**. The system is divided into independent services for ride management, captain management, and user management, with an API Gateway handling incoming client requests.

The services communicate using **synchronous and asynchronous communication patterns**, with **RabbitMQ** used for message-based communication between services.

## 🚀 Key Features

- **Microservices Architecture:** Independent services for users, captains, rides, and API Gateway.
- **API Gateway:** Central entry point for routing client requests to the appropriate microservice.
- **Synchronous Communication:** Direct service-to-service communication for operations requiring an immediate response.
- **Asynchronous Communication:** Event-driven communication to process tasks without blocking the requesting service.
- **RabbitMQ Integration:** Message broker for asynchronous messaging between microservices.
- **Separation of Concerns:** Each service manages its own business logic and responsibilities.
- **Scalable Architecture:** Services can be developed, deployed, and scaled independently.

## 🏗️ Architecture

```text
                 Client Application
                         |
                         v
                   API Gateway
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     User Service   Captain Service  Ride Service
          |              |              |
          +--------------+--------------+
                         |
                 RabbitMQ Message Broker
                         |
              Asynchronous Event Processing
```

*Note: This is a conceptual overview. Actual communication paths depend on the service implementation.*

## 🧩 Microservices

### 1. API Gateway
- Acts as the entry point for incoming client requests.
- Routes requests to the appropriate microservice.
- Provides a centralized layer for client-to-service communication.

### 2. User Service
- Handles user-related operations.
- Manages user information and user-specific business logic.
- Communicates with other services when required.

### 3. Captain Service
- Handles captain-related operations.
- Manages captain information and captain-specific business logic.
- Supports ride-related workflows through inter-service communication.

### 4. Ride Service
- Handles ride-related operations and business logic.
- Coordinates with user and captain services as required.
- Participates in event-driven workflows using asynchronous messaging.

## 🔄 Communication Between Services

### Synchronous Communication
Services communicate directly when an immediate response is required.

**Example workflow:**
1. A client sends a request to the API Gateway.
2. The gateway forwards the request to the relevant service.
3. The service processes the request and may call another service.
4. The response travels back to the client through the gateway.

### Asynchronous Communication with RabbitMQ
RabbitMQ enables services to exchange messages without requiring the sender to wait for the consumer to finish processing.

**Example workflow:**
1. A service publishes an event or message.
2. RabbitMQ routes the message to the configured queue.
3. The consuming service processes the message independently.
4. The publishing service can continue its work without waiting for that processing to complete.

This approach helps reduce direct dependencies between services and supports event-driven workflows.

## 🛠️ Tech Stack

- **Architecture:** Microservices
- **Backend:** Node.js / Express.js
- **Message Broker:** RabbitMQ
- **Communication:** Synchronous APIs and asynchronous messaging
- **Database:** Add the database used by each service
- **API Routing:** API Gateway

*Update the technology list to match the exact tools and libraries used in your implementation.*

## 📁 Project Structure

```text
uber-clone/
├── gateway/
├── user/
├── captain/
├── ride/
└── README.md
```

Each service contains its own application code and configuration.

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- RabbitMQ
- The database or databases configured for the services
- Git

### Installation

**1. Clone the repository**

```bash
git clone <your-repository-url>
cd uber-clone
```

**2. Install dependencies**

Navigate to each service directory and install its dependencies:

```bash
cd user
npm install
```

Repeat for `captain`, `ride`, and `gateway`.

**3. Configure environment variables**

Create the required `.env` files for each service. Configure service ports, database connection strings, RabbitMQ connection details, and other required settings.

Never commit credentials or production secrets to GitHub.

**4. Start RabbitMQ**

Ensure RabbitMQ is running and that the configured connection details match those
