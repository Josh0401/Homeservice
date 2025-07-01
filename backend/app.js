const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import routes
const routes = require('./routes/routes'); // Adjust path to your main routes file

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/home-maintenance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Function to display all available routes
const displayRoutes = () => {
  const routesList = {
    "🏠 HOME MAINTENANCE PLATFORM API ROUTES": {
      "description": "Complete API documentation for the home maintenance platform",
      "baseURL": "http://localhost:5000",
      "version": "1.0.0"
    },

    "🔐 AUTHENTICATION ROUTES": {
      "base": "/api/auth",
      "routes": {
        "POST /api/auth/register": {
          "description": "Register new user (homeowner or professional)",
          "access": "Public",
          "body": "{ fullName, email, password, phone, userType, address, businessName?, services?, hourlyRate? }"
        },
        "POST /api/auth/login": {
          "description": "User login with email and password",
          "access": "Public",
          "body": "{ email, password }"
        },
        "GET /api/auth/me": {
          "description": "Get current user profile from token",
          "access": "Private (Any authenticated user)",
          "headers": "Authorization: Bearer <token>"
        },
        "GET /api/auth/profile/:userId": {
          "description": "Get user profile by ID",
          "access": "Private (Authenticated users)",
          "headers": "Authorization: Bearer <token>"
        },
        "PUT /api/auth/profile/:userId": {
          "description": "Update user profile",
          "access": "Private (Authenticated users)",
          "headers": "Authorization: Bearer <token>"
        },
        "GET /api/auth/professionals": {
          "description": "Get all professionals with optional filters",
          "access": "Public",
          "query": "?service=plumbing&city=NewYork"
        }
      }
    },

    "📂 CATEGORY ROUTES": {
      "base": "/api/categories",
      "routes": {
        "GET /api/categories": {
          "description": "Get all service categories",
          "access": "Public",
          "query": "?isActive=true&sortBy=name"
        },
        "GET /api/categories/:id": {
          "description": "Get single category by ID",
          "access": "Public"
        },
        "POST /api/categories": {
          "description": "Create new category",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>",
          "body": "{ name, description, icon?, sortOrder? }"
        },
        "POST /api/categories/bulk": {
          "description": "Create multiple categories at once",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>",
          "body": "{ categories: [{ name, description, icon?, sortOrder? }] }"
        },
        "PUT /api/categories/:id": {
          "description": "Update category",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>"
        },
        "DELETE /api/categories/:id": {
          "description": "Soft delete category (mark as inactive)",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>"
        },
        "DELETE /api/categories/:id/hard": {
          "description": "Permanently delete category",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>"
        }
      }
    },

    "🛠️ SERVICE ROUTES": {
      "base": "/api/services",
      "routes": {
        "GET /api/services": {
          "description": "Get all services with filters and pagination",
          "access": "Public",
          "query": "?category=id&priceMin=50&priceMax=100&city=NewYork&sortBy=rating&page=1&limit=10"
        },
        "GET /api/services/search": {
          "description": "Search services by text",
          "access": "Public",
          "query": "?q=plumbing&category=id&city=NewYork"
        },
        "GET /api/services/:id": {
          "description": "Get single service details",
          "access": "Public"
        },
        "POST /api/services": {
          "description": "Create new service",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>",
          "body": "{ title, description, category, pricing, duration, availability, serviceArea, features? }"
        },
        "GET /api/services/my/services": {
          "description": "Get my services",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>",
          "query": "?status=active"
        },
        "PUT /api/services/:id": {
          "description": "Update service (owner only)",
          "access": "Private (Service owner)",
          "headers": "Authorization: Bearer <token>"
        },
        "DELETE /api/services/:id": {
          "description": "Delete service (owner only)",
          "access": "Private (Service owner)",
          "headers": "Authorization: Bearer <token>"
        }
      }
    },

    "📋 BOOKING ROUTES": {
      "base": "/api/bookings",
      "routes": {
        "POST /api/bookings": {
          "description": "Apply for a service (create booking)",
          "access": "Private (Homeowner only)",
          "headers": "Authorization: Bearer <homeowner-token>",
          "body": "{ serviceId, title, description, preferredDate, preferredTime, location, urgency?, images? }"
        },
        "GET /api/bookings/my-applications": {
          "description": "Get all my applications (homeowner view)",
          "access": "Private (Homeowner only)",
          "headers": "Authorization: Bearer <homeowner-token>",
          "query": "?status=pending&page=1&limit=10"
        },
        "GET /api/bookings/my-applications/summary": {
          "description": "Get application summary for dashboard",
          "access": "Private (Homeowner only)",
          "headers": "Authorization: Bearer <homeowner-token>"
        },
        "GET /api/bookings/incoming-requests": {
          "description": "Get all incoming service requests",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>",
          "query": "?status=pending&sortBy=urgent&page=1&limit=10"
        },
        "GET /api/bookings/pending-count": {
          "description": "Get pending requests count (for notifications)",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>"
        },
        "GET /api/bookings/stats": {
          "description": "Get booking statistics for professional",
          "access": "Private (Professional only)",
          "headers": "Authorization: Bearer <professional-token>"
        },
        "GET /api/bookings/:id": {
          "description": "Get single booking details",
          "access": "Private (Customer or Professional involved)",
          "headers": "Authorization: Bearer <token>"
        },
        "PATCH /api/bookings/:id/status": {
          "description": "Update booking status (accept, reject, complete, etc.)",
          "access": "Private (Customer or Professional involved)",
          "headers": "Authorization: Bearer <token>",
          "body": "{ status, note?, scheduledDate?, scheduledTime?, finalCost? }"
        },
        "POST /api/bookings/:id/messages": {
          "description": "Add message to booking conversation",
          "access": "Private (Customer or Professional involved)",
          "headers": "Authorization: Bearer <token>",
          "body": "{ message }"
        },
        "PATCH /api/bookings/:id/messages/read": {
          "description": "Mark messages as read",
          "access": "Private (Customer or Professional involved)",
          "headers": "Authorization: Bearer <token>"
        },
        "POST /api/bookings/:id/rate": {
          "description": "Rate and review completed booking",
          "access": "Private (Customer or Professional involved)",
          "headers": "Authorization: Bearer <token>",
          "body": "{ rating, review? }"
        }
      }
    },

    "🔧 UTILITY ROUTES": {
      "base": "/api",
      "routes": {
        "GET /api/health": {
          "description": "Health check - verify server is running",
          "access": "Public"
        }
      }
    },

    "📊 USER TYPES & ACCESS LEVELS": {
      "homeowner": {
        "description": "Regular users who need home maintenance services",
        "permissions": [
          "View services and professionals",
          "Apply for services (create bookings)",
          "Manage their own applications",
          "Message with professionals",
          "Rate and review services"
        ]
      },
      "professional": {
        "description": "Service providers who offer home maintenance services",
        "permissions": [
          "Create and manage services",
          "Manage categories",
          "View and respond to booking requests",
          "Message with customers",
          "View booking statistics",
          "Rate customers"
        ]
      }
    },

    "🔑 AUTHENTICATION": {
      "type": "JWT (JSON Web Token)",
      "header": "Authorization: Bearer <your-jwt-token>",
      "expiration": "30 days",
      "note": "Include token in Authorization header for protected routes"
    },

    "📱 STATUS CODES": {
      "200": "Success",
      "201": "Created successfully",
      "400": "Bad request / Validation error",
      "401": "Unauthorized / Invalid token",
      "403": "Forbidden / Insufficient permissions",
      "404": "Not found",
      "500": "Server error"
    },

    "🚀 BOOKING WORKFLOW": {
      "1": "Homeowner browses services (GET /api/services)",
      "2": "Homeowner applies for service (POST /api/bookings)",
      "3": "Professional receives request (GET /api/bookings/incoming-requests)",
      "4": "Professional accepts/rejects (PATCH /api/bookings/:id/status)",
      "5": "Both parties communicate (POST /api/bookings/:id/messages)",
      "6": "Service is completed (PATCH /api/bookings/:id/status)",
      "7": "Both parties rate each other (POST /api/bookings/:id/rate)"
    }
  };

  return routesList;
};

// Use routes
app.use('/', routes);

// Route to display all API routes
app.get('/api/routes', (req, res) => {
  res.status(200).json(displayRoutes());
});

// Route to display routes in HTML format (for browser viewing)
app.get('/routes', (req, res) => {
  const routesList = displayRoutes();
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Home Maintenance API Routes</title>
        <style>
            body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 20px; 
                background: #f5f5f5;
            }
            .container { 
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { 
                color: #2c3e50; 
                text-align: center; 
                border-bottom: 3px solid #3498db; 
                padding-bottom: 10px;
            }
            h2 { 
                color: #34495e; 
                background: #ecf0f1; 
                padding: 10px; 
                border-radius: 5px; 
                margin-top: 25px;
            }
            h3 { 
                color: #2980b9; 
                margin-top: 15px;
            }
            .route { 
                background: #f8f9fa; 
                margin: 10px 0; 
                padding: 15px; 
                border-left: 4px solid #3498db; 
                border-radius: 5px;
            }
            .method { 
                font-weight: bold; 
                color: #e74c3c; 
                font-family: monospace;
            }
            .description { 
                color: #555; 
                margin: 5px 0;
            }
            .access { 
                color: #27ae60; 
                font-size: 0.9em; 
                font-weight: bold;
            }
            .body, .query, .headers { 
                background: #2c3e50; 
                color: white; 
                padding: 8px; 
                border-radius: 3px; 
                font-family: monospace; 
                font-size: 0.85em; 
                margin: 5px 0;
                word-break: break-all;
            }
            .workflow { 
                background: #e8f5e8; 
                padding: 15px; 
                border-radius: 5px; 
                margin: 10px 0;
            }
            .status-codes { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 10px;
            }
            .status-code { 
                background: #f1c40f; 
                padding: 10px; 
                border-radius: 5px; 
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏠 Home Maintenance Platform API</h1>
  `;

  Object.keys(routesList).forEach(section => {
    html += `<h2>${section}</h2>`;
    
    const sectionData = routesList[section];
    
    if (sectionData.routes) {
      Object.keys(sectionData.routes).forEach(route => {
        const routeData = sectionData.routes[route];
        html += `
          <div class="route">
            <div class="method">${route}</div>
            <div class="description">${routeData.description}</div>
            <div class="access">Access: ${routeData.access}</div>
            ${routeData.body ? `<div class="body">Body: ${routeData.body}</div>` : ''}
            ${routeData.query ? `<div class="query">Query: ${routeData.query}</div>` : ''}
            ${routeData.headers ? `<div class="headers">Headers: ${routeData.headers}</div>` : ''}
          </div>
        `;
      });
    } else if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
      Object.keys(sectionData).forEach(key => {
        if (typeof sectionData[key] === 'object') {
          html += `<h3>${key}</h3>`;
          if (Array.isArray(sectionData[key])) {
            html += '<ul>';
            sectionData[key].forEach(item => {
              html += `<li>${item}</li>`;
            });
            html += '</ul>';
          } else {
            Object.keys(sectionData[key]).forEach(subKey => {
              html += `<div class="workflow"><strong>${subKey}:</strong> ${sectionData[key][subKey]}</div>`;
            });
          }
        } else {
          html += `<div class="workflow"><strong>${key}:</strong> ${sectionData[key]}</div>`;
        }
      });
    }
  });

  html += `
        </div>
    </body>
    </html>
  `;

  res.send(html);
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : error.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 View API documentation at: http://localhost:${PORT}/routes`);
  console.log(`📊 API routes JSON at: http://localhost:${PORT}/api/routes`);
});

module.exports = app;