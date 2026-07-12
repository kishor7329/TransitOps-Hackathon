import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"]),
});

export const vehicleSchema = z.object({
    registrationNo: z.string().min(3),
    name: z.string().min(1),
    model: z.string().optional(),
    type: z.string().min(1),
    maxLoadKg: z.coerce.number().int().positive(),
    odometerKm: z.coerce.number().int().nonnegative(),
    acquisitionCost: z.coerce.number().nonnegative(),
    status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]).default("AVAILABLE"),
    region: z.string().min(1),
});

export const driverSchema = z.object({
    name: z.string().min(1),
    licenseNo: z.string().min(3),
    licenseCategory: z.string().min(1),
    licenseExpiryDate: z.coerce.date(),
    contactNumber: z.string().min(5),
    safetyScore: z.coerce.number().int().min(0).max(100),
    tripCompletionPct: z.coerce.number().int().min(0).max(100),
    status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]).default("AVAILABLE"),
});

export const createTripSchema = z.object({
    tripNo: z.string().min(3),
    source: z.string().min(1),
    destination: z.string().min(1),
    vehicleId: z.string().min(1),
    driverId: z.string().min(1),
    cargoWeightKg: z.coerce.number().int().positive(),
    plannedDistanceKm: z.coerce.number().int().positive(),
    revenue: z.coerce.number().nonnegative().default(0),
});

export const completeTripSchema = z.object({
    actualDistanceKm: z.coerce.number().int().positive(),
    finalOdometerKm: z.coerce.number().int().positive(),
    fuelLiters: z.coerce.number().positive().optional(),
    fuelCost: z.coerce.number().nonnegative().optional(),
});

export const maintenanceSchema = z.object({
    vehicleId: z.string().min(1),
    serviceType: z.string().min(1),
    cost: z.coerce.number().nonnegative(),
    notes: z.string().optional(),
});
