
export const MOCK_PROJECTS = [
  {
    id: "proj_1",
    name: "E-commerce Platform",
    description: "Core database schema for the main online store logic including users, products, and orders.",
    updatedAt: "2023-10-25T14:30:00Z",
    entityCount: 12,
  },
  {
    id: "proj_2",
    name: "CRM System",
    description: "Customer relationship management data structure for tracking leads and interactions.",
    updatedAt: "2023-11-02T09:15:00Z",
    entityCount: 8,
  },
  {
    id: "proj_3",
    name: "Analytics Pipeline",
    description: "Data warehouse schema for event tracking and aggregations.",
    updatedAt: "2023-11-10T16:45:00Z",
    entityCount: 5,
  }
];

export const MOCK_ENTITIES = [
  {
    id: "ent_users",
    projectId: "proj_1",
    name: "users",
    description: "Stores customer authentication and profile information.",
    tags: ["SQL", "Core", "PII"],
    fields: [
      {
        id: "f_id",
        name: "id",
        type: "UUID",
        required: true,
        unique: true,
        indexed: true,
        default: "uuid_generate_v4()",
        description: "Primary key for the user.",
        validation: "",
        enum: null,
        example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        notes: "Immutable after creation."
      },
      {
        id: "f_email",
        name: "email",
        type: "VARCHAR(255)",
        required: true,
        unique: true,
        indexed: true,
        default: null,
        description: "User's email address for login and contact.",
        validation: "Must be a valid email format.",
        enum: null,
        example: "alice@example.com",
        notes: "Verified via email link."
      },
      {
        id: "f_role",
        name: "role",
        type: "ENUM",
        required: true,
        unique: false,
        indexed: true,
        default: "'customer'",
        description: "Authorization role.",
        validation: "",
        enum: ["admin", "customer", "moderator"],
        example: "customer",
        notes: "Admins have full access."
      }
    ]
  },
  {
    id: "ent_orders",
    projectId: "proj_1",
    name: "orders",
    description: "Transactional records of customer purchases.",
    tags: ["SQL", "Transactional"],
    fields: [
      {
        id: "f_id",
        name: "id",
        type: "UUID",
        required: true,
        unique: true,
        indexed: true,
        default: "uuid_generate_v4()",
        description: "Order ID.",
        validation: null,
        enum: null,
        example: "b2f...",
        notes: ""
      },
      {
        id: "f_user_id",
        name: "user_id",
        type: "UUID",
        required: true,
        unique: false,
        indexed: true,
        default: null,
        description: "Reference to the user who placed the order.",
        validation: "Foreign Key -> users.id",
        enum: null,
        example: "a0eebc...",
        notes: ""
      },
      {
        id: "f_status",
        name: "status",
        type: "VARCHAR(50)",
        required: true,
        unique: false,
        indexed: true,
        default: "'pending'",
        description: "Current state of the order.",
        validation: "",
        enum: ["pending", "paid", "shipped", "cancelled", "returned"],
        example: "paid",
        notes: ""
      }
    ]
  }
];
