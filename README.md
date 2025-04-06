
# Marketspace API

Marketspace API is a RESTful backend service developed with Node.js and TypeScript. It is designed to power a front-end application that enables users to advertise and browse products for sale. The API is built with a modular approach for scalability and maintainability, making it easy to extend with new features as your project grows.

## Features

-   **Product Management:**  
    Create, retrieve, update, and delete product listings. This allows sellers to manage their advertised products and buyers to view available listings.
    
-   **User Authentication & Management:**  
    Secure endpoints for user registration and login. The API uses JWT-based authentication to protect routes and ensure that only authenticated users can perform certain actions. Authentication methods are through credentials (e-mail and password), Google provider and Github provider.
    
-   **Category Organization:**  
    Organize products by categories, helping users easily filter and search for products based on specific interests or product types.
    
-   **Data Validation & Error Handling:**  
    Built-in validation middleware ensures the data received by the API is correct, while centralized error handling improves the API's robustness.
    
-   **Scalable Architecture:**  
    Using modern libraries and a modular code structure, the API is designed based on SOLID concepts to be easily extended and maintained over time.
    

## Technologies & Libraries

-   **Node.js & TypeScript:**  
    The core of the API is built with Node.js for the runtime and TypeScript for static type-checking and improved code reliability.
    
-   **Fastify:**  
    Utilized as the primary framework to set up routing and middleware for the RESTful API.
    
-   **JWT (jsonwebtoken):**  
    Provides secure, token-based authentication for protecting private endpoints.
    
-   **Prisma:**  
    ORM for managing database connections and transactions.
    
-   **Cors:**  
    Enables Cross-Origin Resource Sharing, allowing the front-end application to communicate with the API without issues.
    
-   **Swagger:**  
    Swagger-based API documentation.
    
-   **Vitest:**  
    Unit and E2E testing using Vitest.
    

## Getting Started

### Prerequisites

-   **Node.js:** v18 or later
    
-   **pnpm**, **npm** or **yarn**
    

### Installation

1.  **Clone the Repository:**
    
    ```bash
    git clone https://github.com/yourusername/marketspace-api.git 
    cd marketspace-api
    ``` 
    
2.  **Install Dependencies:**
    `npm install `
    
3.  **Configure Environment Variables:**  
  Create a `.env` file based on the example file `.env.example`. Adjust these values to suit your development environment.
    
4.  **Run the Application:**
    
    `npm run dev` 
    
    The API should now be running on http://localhost:3333.

**Note:** The API uses Firebase Storage to manage file uploads. In this case, you need to create an account in the storage and generate a .json file to make the connection.
    

## Documentation

You can access the API routes documentation at http://localhost:3333/docs

## License

This project is licensed under the MIT License. See the LICENSE file for details.