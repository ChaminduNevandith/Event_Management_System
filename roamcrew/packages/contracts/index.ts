import { z } from "zod";

// --- AUTHENTICATION ---
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
export type RegisterRequest = z.infer<typeof RegisterSchema>;

// --- TRIPS ---
export const CreateTripSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  coverImageUrl: z.string().url("Must be a valid URL").optional(),
  status: z.enum(["PLANNING", "UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  timezone: z.string().default("UTC"),
});
export type CreateTripRequest = z.infer<typeof CreateTripSchema>;

export const UpdateTripSchema = CreateTripSchema.partial();
export type UpdateTripRequest = z.infer<typeof UpdateTripSchema>;

// --- MEMBERS ---
export const InviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});
export type InviteMemberRequest = z.infer<typeof InviteMemberSchema>;

// --- DESTINATIONS ---
export const DestinationStatusSchema = z.enum(["PROPOSED", "APPROVED", "REJECTED"]);

export const CreateDestinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  googlePlaceId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
export type CreateDestinationRequest = z.infer<typeof CreateDestinationSchema>;

export const UpdateDestinationSchema = CreateDestinationSchema.partial().extend({
  status: DestinationStatusSchema.optional(),
  orderIndex: z.number().int().min(0).optional(),
});
export type UpdateDestinationRequest = z.infer<typeof UpdateDestinationSchema>;

export const DestinationVoteSchema = z.object({
  voteType: z.enum(["UP", "DOWN"]),
});
export type DestinationVoteRequest = z.infer<typeof DestinationVoteSchema>;

// --- PLACES (Saved Places) ---
export const PlaceCategorySchema = z.enum([
  "ACCOMMODATION",
  "FOOD",
  "ATTRACTION",
  "ACTIVITY",
  "TRANSPORT",
  "OTHER",
]);

export const CreatePlaceSchema = z.object({
  destinationId: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  googlePlaceId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  category: PlaceCategorySchema.optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});
export type CreatePlaceRequest = z.infer<typeof CreatePlaceSchema>;

export const UpdatePlaceSchema = CreatePlaceSchema.partial();
export type UpdatePlaceRequest = z.infer<typeof UpdatePlaceSchema>;

// Polls / Decision Room
export const CreatePollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isMultipleChoice: z.boolean().default(false),
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required"),
    imageUrl: z.string().url().optional(),
  })).min(2, "At least two options are required"),
  deadline: z.string().datetime().optional(),
});
export type CreatePollRequest = z.infer<typeof CreatePollSchema>;

export const PollVoteSchema = z.object({
  optionId: z.string().uuid(),
});
export type PollVoteRequest = z.infer<typeof PollVoteSchema>;

export const PollCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});
export type PollCommentRequest = z.infer<typeof PollCommentSchema>;





// --- EXPENSES ---
export const ExpenseCategorySchema = z.enum([
  "TRANSPORT",
  "ACCOMMODATION",
  "FOOD",
  "ACTIVITIES",
  "SHOPPING",
  "OTHER",
]);

export const CreateExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  date: z.string().datetime().optional(),
  category: ExpenseCategorySchema.optional(),
  payerId: z.string().uuid("Invalid payer ID"),
  splits: z.array(z.object({
    userId: z.string().uuid(),
    amount: z.number().positive(),
  })).min(1, "At least one split is required"),
});

export type CreateExpenseRequest = z.infer<typeof CreateExpenseSchema>;

// --- Itinerary Item Schemas ---
export const ItemTypeSchema = z.enum([
  "FLIGHT",
  "TRANSPORT",
  "ACCOMMODATION",
  "ACTIVITY",
  "DINING",
  "NOTE",
]);
export type ItemType = z.infer<typeof ItemTypeSchema>;

export const CreateItineraryItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: ItemTypeSchema.default("ACTIVITY"),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  isAllDay: z.boolean().optional(),
  destinationId: z.string().uuid(),
});

export type CreateItineraryItemRequest = z.infer<typeof CreateItineraryItemSchema>;

export const UpdateItineraryItemSchema = CreateItineraryItemSchema.partial();
export type UpdateItineraryItemRequest = z.infer<typeof UpdateItineraryItemSchema>;
