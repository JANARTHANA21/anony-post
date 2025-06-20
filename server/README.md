# folder structure

server/
├── config/               # Environment configs (DB, CORS, etc.)
│   └── db.js
│   └── env.js
│
├── controllers/          # Route handlers (logic only)
│   └── authController.js
│   └── postController.js
│
├── routes/               # Route definitions
│   └── authRoutes.js
│   └── postRoutes.js
│
├── models/               # Mongoose models
│   └── User.js
│   └── Post.js
│
├── middlewares/          # Custom middleware (auth, errors, etc.)
│   └── authMiddleware.js
│   └── errorHandler.js
│
├── services/             # Core business logic (optional layer)
│   └── userService.js
│   └── postService.js
│
├── utils/                # Utility functions (validators, helpers)
│   └── generateId.js
│   └── timeAgo.js
│
├── sockets/              # For Socket.IO logic
│   └── index.js
│
├── constants/            # Constant values like roles, messages
│   └── roles.js
│
├── validators/           # Joi or express-validator schemas
│   └── authValidator.js
│
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── server.js             # Main server file (entry point)
└── README.md