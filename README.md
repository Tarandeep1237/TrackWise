# TrackWise – Relational Expense Analytics Platform

TrackWise is a full-stack expense analytics platform that helps users track, organize, and analyze financial transactions efficiently. The project focuses on relational database design and analytics-driven insights using SQL queries, structured schemas, and RESTful backend architecture.

## 1. Features

- Expense Tracking (Add, Update, Delete)
- Category-Based Expense Management
- Spending Analytics & Insights
- Date-wise Expense Filtering
- User-Specific Financial Management
- SQL-Based Relational Analysis
- REST API Integration using Spring Boot

## 2. Core Concept

TrackWise is built around **Relational Database Thinking**.

The system demonstrates:

- Database normalization
- Primary and Foreign Key relationships
- SQL JOIN operations
- GROUP BY and aggregate analytics
- Structured financial data analysis

Unlike basic CRUD projects, TrackWise focuses on transforming raw financial data into meaningful insights.

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6) |
| Backend | Spring Boot, Java |
| Database | MySQL |
| API Communication | REST APIs |

## 4. System Architecture

### 4.1 Frontend

Responsible for:

- User Interface
- Form Handling
- Dashboard Rendering
- API Communication

### 4.2 Backend (Spring Boot)

Handles:

- REST API Development
- Business Logic Processing
- Request Handling
- Data Validation
- Database Interaction

### 4.3 Database (MySQL)

Stores:

- Users
- Expenses
- Categories

Supports:

- Relational Schema Design
- Efficient Querying
- SQL-Based Analytics

## 5. Application Workflow

1. User enters expense data through the UI.
2. Frontend sends API requests to the Spring Boot backend.
3. Backend processes business logic.
4. Data is stored in or retrieved from MySQL.
5. SQL queries generate analytics.
6. Results are displayed on the dashboard.

## 6. Project Modules

### 6.1 Authentication Module

- User Login
- Session Management
- User Validation

### 6.2 Expense Module

- Add Expenses
- Update Expenses
- Delete Expenses
- View Expense History

### 6.3 Category Module

- Expense Categorization
- Category Management

### 6.4 Analytics Module

- Monthly Reports
- Spending Trends
- Category-wise Analysis
- Expense Summaries

## 7. SQL Concepts Used

### 7.1 GROUP BY

Used for category-wise analytics.

```sql
SELECT category_id, SUM(amount)
FROM expenses
GROUP BY category_id;
```

### 7.2 JOIN Operations

Used to combine relational tables.

```sql
SELECT users.name, categories.category_name, expenses.amount
FROM expenses
JOIN users ON expenses.user_id = users.user_id
JOIN categories ON expenses.category_id = categories.category_id;
```

### 7.3 Aggregate Functions

- `SUM()`
- `AVG()`
- `MAX()`
- `MIN()`

## 8. Sample Use Cases

- Track monthly spending
- Analyze financial trends
- Identify highest expense category
- Compare expenses across different periods
- Monitor spending behavior

## 9. Why This Project Stands Out

- Full-Stack Development Project
- Spring Boot REST API Integration
- Relational Database Design
- SQL Analytics Implementation
- Real-World Financial Use Case
- Analytics-Oriented Architecture

TrackWise goes beyond traditional CRUD applications by applying relational database concepts and analytics-driven problem solving.

## 10. Future Enhancements

- Interactive Charts using Chart.js
- JWT Authentication
- Improved Mobile Responsiveness
- Budget Alerts and Notifications
- AI-Based Expense Prediction
- Cloud Deployment Support

## 11. Conclusion

TrackWise is a practical implementation of:

- Full-Stack Development
- Spring Boot Backend Architecture
- Relational Database Design
- SQL-Based Analytics

The project emphasizes structured thinking, efficient querying, and meaningful financial analysis to build an intelligent expense analytics platform.

## 12. Author

**Tarandeep Singh**

AI/ML Engineering Student

Developed as a full-stack expense analytics project to demonstrate relational database design, Spring Boot REST API development, and SQL-based financial analysis for transforming transaction data into meaningful insights.
