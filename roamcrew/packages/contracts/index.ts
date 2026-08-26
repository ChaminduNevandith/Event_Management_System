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
export const CreateDestinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  googlePlaceId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
export type CreateDestinationRequest = z.infer<typeof CreateDestinationSchema>;

// --- EXPENSES ---
export const CreateExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  date: z.string().datetime().optional(),
  category: z.enum(["TRANSPORT", "ACCOMMODATION", "FOOD", "ACTIVITIES", "SHOPPING", "OTHER"]).default("OTHER"),
  payerId: z.string().uuid("Invalid payer ID"),
  splits: z.array(z.object({
    userId: z.string().uuid(),
    amount: z.number().positive(),
  })).min(1, "At least one split is required"),
});
export type CreateExpenseRequest = z.infer<typeof CreateExpenseSchema>;
