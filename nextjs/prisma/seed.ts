import "dotenv/config";
import {
  PrismaClient,
  VehicleStatus,
  DriverStatus,
  TripStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.trip.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  // ---------------- VEHICLES ----------------

  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        registrationNumber: "OD02AB1234",
        model: "Tata Ace",
        type: "Mini Truck",
        maxLoadCapacity: 500,
        odometer: 12000,
        acquisitionCost: 650000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        registrationNumber: "OD02CD5678",
        model: "Mahindra Bolero Pickup",
        type: "Pickup",
        maxLoadCapacity: 900,
        odometer: 35000,
        acquisitionCost: 950000,
        status: VehicleStatus.ON_TRIP,
      },
      {
        registrationNumber: "OD02EF9012",
        model: "Ashok Leyland Dost",
        type: "Mini Truck",
        maxLoadCapacity: 700,
        odometer: 28000,
        acquisitionCost: 800000,
        status: VehicleStatus.IN_SHOP,
      },
      {
        registrationNumber: "OD02GH3456",
        model: "Tata Intra V30",
        type: "Pickup",
        maxLoadCapacity: 1000,
        odometer: 15000,
        acquisitionCost: 980000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        registrationNumber: "OD02JK7890",
        model: "Eicher Pro 2049",
        type: "Truck",
        maxLoadCapacity: 3500,
        odometer: 56000,
        acquisitionCost: 2150000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        registrationNumber: "OD02LM1122",
        model: "BharatBenz 1217R",
        type: "Truck",
        maxLoadCapacity: 7000,
        odometer: 88000,
        acquisitionCost: 3200000,
        status: VehicleStatus.ON_TRIP,
      },
      {
        registrationNumber: "OD02NP3344",
        model: "Mahindra Furio 7",
        type: "Truck",
        maxLoadCapacity: 6500,
        odometer: 42000,
        acquisitionCost: 2850000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        registrationNumber: "OD02QR5566",
        model: "Tata 407 Gold",
        type: "Truck",
        maxLoadCapacity: 2500,
        odometer: 61000,
        acquisitionCost: 1800000,
        status: VehicleStatus.IN_SHOP,
      },
    ],
  });

  console.log(`Inserted ${vehicles.count} vehicles`);

  // ---------------- DRIVERS ----------------

  const drivers = await prisma.driver.createMany({
    data: [
      {
        name: "Alex",
        licenseNumber: "DL12345",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2030-12-31"),
        contactNumber: "9999999999",
        safetyScore: 94,
        status: DriverStatus.AVAILABLE,
      },
      {
        name: "Rahul",
        licenseNumber: "DL67890",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2031-06-15"),
        contactNumber: "8888888888",
        safetyScore: 89,
        status: DriverStatus.ON_TRIP,
      },
      {
        name: "Priya Sharma",
        licenseNumber: "DL24680",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2029-11-10"),
        contactNumber: "9876543210",
        safetyScore: 97,
        status: DriverStatus.AVAILABLE,
      },
      {
        name: "Amit Verma",
        licenseNumber: "DL13579",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2032-04-18"),
        contactNumber: "9123456780",
        safetyScore: 91,
        status: DriverStatus.OFF_DUTY,
      },
      {
        name: "Rohan Das",
        licenseNumber: "DL11223",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2030-08-21"),
        contactNumber: "9012345678",
        safetyScore: 86,
        status: DriverStatus.AVAILABLE,
      },
      {
        name: "Sneha Patnaik",
        licenseNumber: "DL44556",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2031-01-14"),
        contactNumber: "9988776655",
        safetyScore: 95,
        status: DriverStatus.AVAILABLE,
      },
    ],
  });

  console.log(`Inserted ${drivers.count} drivers`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });