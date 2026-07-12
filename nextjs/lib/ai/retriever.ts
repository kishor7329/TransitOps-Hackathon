// import { prisma } from "@/lib/prisma";

// export async function retrieveContext(question: string) {

//     const vehicles = await prisma.vehicle.findMany();

//     return JSON.stringify(vehicles);
// }

export async function retrieveContext(question: string) {
  return `
Fleet Database

Vehicles

1.
Registration: OD02AB1234
Model: Tata Ace
Type: Mini Truck
Capacity: 500 kg
Status: AVAILABLE

2.
Registration: OD02CD5678
Model: Mahindra Bolero Pickup
Type: Pickup
Capacity: 900 kg
Status: ON_TRIP

3.
Registration: OD02EF9012
Model: Ashok Leyland Dost
Type: Mini Truck
Capacity: 700 kg
Status: IN_SHOP

4.
Registration: OD02GH3456
Model: Tata Intra V30
Type: Pickup
Capacity: 1000 kg
Status: AVAILABLE

Drivers

Alex
Safety Score: 94
Status: AVAILABLE

Rahul
Safety Score: 89
Status: ON_TRIP

Priya
Safety Score: 97
Status: AVAILABLE

Current Trips

Trip 1
Source: Bhubaneswar
Destination: Cuttack
Cargo: 450 kg
Vehicle: Tata Ace
Driver: Alex
Status: DISPATCHED

Trip 2
Source: Bhubaneswar
Destination: Puri
Cargo: 700 kg
Vehicle: Mahindra Bolero Pickup
Driver: Rahul
Status: ON_TRIP
`;
}