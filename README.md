# Project Overview

This project is a simple e-commerce web application where users can browse products, add them to a cart, and place orders. Users can register and log in to the system, and each user can see their own order history. The application manages product stock and validates the shopping cart on the backend to avoid incorrect purchases. The goal of the project is to demonstrate a complete web system with a frontend and a backend connected through a REST API.


# Live URLs

The application is deployed and available online at the following URLs:

- **Frontend:** web-systems-ecommerce.vercel.app
                web-systems-ecommerce-git-main-carlitosvy12s-projects.vercel.app
                web-systems-ecommerce-5n0iu4953-carlitosvy12s-projects.vercel.app  
- **Backend:** https://ecommerce-backend-l9dy.onrender.com 

-**Github** https://github.com/carlitosvy12/web-systems-ecommerce




# Running the Project Locally

To run the project locally, the backend and the frontend must be started separately.

### Backend

Requirements:
- Python 3.10 or higher
- FastAPI installed
- Virtual environment (recommended)

Commands:

cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install "fastapi[standard]"
fastapi dev app/main.py

### Frontend

Commands:
cd frontend/ecommerce
yarn install
yarn dev



# Backend 

## main.py

The main.py file is the entry point of the backend application. In this file, the FastAPI application is created and configured. A lifespan function is defined to execute initialization logic when the server starts. During startup, the database tables are created if they do not exist, and demo products are inserted into the database if it is empty. This ensures that the application can be tested immediately without manual data insertion.

This file also configures CORS middleware to allow requests from the frontend application, both in local development and in production on Vercel. Finally, all routers are included in the application, registering the API endpoints for health checks, authentication, products, checkout, and orders.


## dependencies.py

The dependencies.py file defines shared dependencies used across the backend. The most important dependency is the database session injection, which allows each API request to automatically receive a database session without manually creating or closing it. This file centralizes common logic that can be reused in different routes, helping to avoid duplicated code and improving consistency across the application.



## db.py

The db.py file is responsible for database configuration and session management. It defines how the backend connects to the database depending on the environment. If a DATABASE_URL is provided, the application connects to a PostgreSQL database in Supabase. Otherwise, it uses a local SQLite database for development.

This file also includes a function to create all database tables at startup and a session generator that provides a database session for each request. This guarantees that database connections are handled correctly and safely.



## core/config.py

The config.py file centralizes all configuration values of the backend. It loads environment variables such as the database URL, JWT secret key, token expiration time, and CORS settings. By using a configuration file, sensitive values are not hardcoded in the source code, and the application can be easily adapted to different environments without changing the logic.



## core/security.py

The security.py file implements all authentication and security logic. It handles password hashing and verification using secure hashing algorithms, ensuring that user passwords are never stored in plain text. This file also creates JWT access tokens when users log in and validates tokens when protected endpoints are accessed.

The token includes the user identifier and an expiration time, allowing the backend to authenticate users without storing sessions on the server. A helper function decodes the token and retrieves the corresponding user from the database.

## models/user.py

The user.py file defines the user data model. It specifies how users are stored in the database, including fields such as email, password hash, admin flag, and creation date. Different schemas are defined for different purposes, such as user creation input and public user output, ensuring that sensitive information like passwords is never exposed through the API.


## routes/auth.py

The auth.py file defines the authentication routes of the backend. It includes endpoints for user registration, user login, and retrieving the current authenticated user. During registration, the backend validates input data and stores the user securely. During login, credentials are verified and a JWT token is returned. Protected routes use the token provided in the Authorization header to identify the user making the request.




## models/product.py

The product.py file defines the product data model. Products include information such as title, description, slug, price in cents, currency, stock, and timestamps. The price is stored in cents to avoid floating point precision issues. Multiple schemas are defined to separate database representation, creation input, update input, and public API output.



## routes/products.py


The products.py file implements the public product catalog endpoints. It allows clients to retrieve a list of products with optional text search and pagination, as well as retrieve individual products by their slug. The file also includes a helper function that inserts demo products into the database if no products exist, ensuring that the application always has sample data available.


## routes/checkout.py

The checkout.py file handles shopping cart validation. It defines an endpoint that receives the cart items from the frontend and validates them against the database. The backend checks that products exist, verifies available stock, calculates subtotals for each item, and computes the total price. This step ensures that all pricing and validation logic is controlled by the backend before an order is created.


## models/order.py

The order.py file defines the order data model. An order represents a purchase made by a user and stores information such as the user ID, total price, currency, status, and creation date. Orders do not store products directly, which keeps the model simple and scalable.



## models/order_item.py

The order_item.py file defines the order item data model, which links orders and products. Each order item represents a specific product included in an order, storing the product ID, order ID, unit price at the time of purchase, and quantity. This design allows an order to contain multiple products and preserves historical prices even if product prices change later.



## routes/orders.py

The orders.py file implements order-related endpoints and requires user authentication. It includes an endpoint to retrieve the order history of the logged-in user and another endpoint to create a new order. When creating an order, the backend validates the cart, calculates the total price, creates the order record, creates the associated order items, and updates product stock. Error handling is included to ensure database consistency.






# Frontend 

## index.html

This file is the main HTML entry of the frontend and it is the first file loaded by the browser when the application starts. Here I only keep the basic structure of the page and a root div where React will render the whole application. I do not put logic here because all the logic is managed by React and TypeScript.


## src/main.tsx

This file is the real entry point of the React application. Here I connect React with the HTML root element and wrap the app with the router and global providers. From this file the whole frontend application starts.

## src/routes.tsx

In this file I define all the routes of the application using React Router. Each route is linked to a page component like catalog, product detail, login or orders. This file controls navigation without reloading the page.

## src/api/client.ts

This file centralizes the HTTP client configuration. I define the base URL of the backend and common settings for requests. All other API files use this client so the communication with the backend is consistent.

## src/api/products.ts

This file contains the functions to get products from the backend. It calls the product endpoints and returns the data to be used in the catalog and product detail pages.

## src/api/auth.ts

This file manages authentication requests like login and register. It sends user credentials to the backend and receives the authentication response, which is then stored in the frontend state.

## src/api/orders.ts

This file handles requests related to user orders. It is used to get the order history and show it in the orders page.

## src/api/checkout.ts

This file is responsible for sending checkout information to the backend. It is used when the user finishes the purchase and confirms the order.

## src/components/Header.tsx

This component renders the top navigation bar of the application. It includes links to main sections like catalog, cart, login or orders and changes depending on whether the user is logged in.

## src/components/Layout.tsx

This component defines the general layout of the application. It wraps all pages with common elements like the header and ensures a consistent structure across the site.

## src/components/ProductCard.tsx

This component displays a single product in the catalog. It shows the image, name and price and allows navigation to the product detail page.

## src/pages/Catalog.tsx

This page shows the list of available products. It loads data from the backend and uses the ProductCard component to display each product.

## src/pages/ProductDetail.tsx

This page shows detailed information about one product. It loads the product by id from the backend and allows the user to add it to the cart.

## src/pages/Cart.tsx

This page displays the shopping cart. It shows selected products, quantities and total price and allows the user to proceed to checkout.

## src/pages/Checkout.tsx

This page handles the checkout process. It sends the cart data to the backend and confirms the order.

## src/pages/Login.tsx

This page allows users to log into the application. It connects with the authentication API and updates the global auth state.

## src/pages/Register.tsx

This page allows new users to create an account. It sends the registration data to the backend and then allows login.

## src/pages/Orders.tsx

This page shows the order history of the logged-in user. It loads data from the backend and displays past orders.

## src/store/auth.ts

This file manages the authentication state of the application. It stores the user login status and token so it can be used across the frontend.

## src/store/cart.ts

This file manages the shopping cart state. It stores products added to the cart and handles add, remove and clear actions.

## src/styles/app.css

This file contains the global styles of the application. It defines basic layout, colors and spacing to keep a simple and clean design.
