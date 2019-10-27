/**
* Transfer Ownership Transaction
* @param {org.logistics.network.TransferOwnership} ownershipTx - Shipment Ownership transfer transaction
* @transaction
*/

async function transferOwnership(ownershipTx) {
  
  const shipment = ownershipTx.shipment;

  shipment.owner = ownershipTx.to;
  shipment.status = ownershipTx.status;
  const shipmentRegistry = await getAssetRegistry('org.logistics.network.Shipment');
  await shipmentRegistry.update(shipment);
  
}

/**
* Shipment Temperature Update Transaction
* @param {org.logistics.network.ShipmentTempUpdate} updateTempTx - Shipment Temp Update transaction
* @transaction
*/
async function shipmentTempUpdate(updateTempTx) {
	const shipment = updateTempTx.shipment;
  	shipment.temperatureReadings.push(updateTempTx.temperature);
  
  	const shipmentRegistry = await getAssetRegistry('org.logistics.network.Shipment');
  	await shipmentRegistry.update(shipment);
  
}

/**
* Shipment Temperature Update Transaction
* @param {org.logistics.network.SetupDemo} setupTx - Setup Demo
* @transaction
*/

async function setupDemo(setupDemo) {
  const factory = getFactory();
  const NS = "org.logistics.network"

  // create all the participants

  let locations = [
    "Bangalore",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Delhi",

    "Mumbai",
    "Nagpur",
    "Indore",
    "Kolkata",
    "Bhubaneswar",

    "Lucknow",
    "Agra",
    "Ahmedabad",
    "Bhopal",
    "Mangalore"
  ]
  let temperatureReadings = [
    [12,13,14,15,16,17,18,19,13,14,16],
    [20,21,15,11,25,12,12,15,15,20],
    [23,23,26,27,12,12,15,15,16,19,20],
    [20,20,19,18,17,10,18,16,19,17],
    [12,28,20,31,30,31,29,28,29,39]
  ];
  let sellers = [];
  let buyers = [];
  let logistics = [];
  let shipments = [];

  for(let i = 0; i < 5; i++) {
    let seller = factory.newResource(NS, "Seller", `Seller${i+1}`);
    seller.location = locations[i];

    let logistic = factory.newResource(NS, "Logistics", `Logistic${i+1}`);
    logistic.location = locations[i + 5]; 

    let buyer = factory.newResource(NS, "Buyer", `Buyer${i+1}`);
    buyer.location = locations[i + 10]; 

    let shipment = factory.newResource(NS, "Shipment", `Shipment${i+1}`);

    shipment.seller = factory.newRelationship(NS, "Seller", `Seller${i+1}`);

    shipment.logistics = factory.newRelationship(NS, "Logistics", `Logistic${i+1}`);
  
    shipment.buyer = factory.newRelationship(NS, "Buyer", `Buyer${i+1}`);
  
    shipment.owner = factory.newRelationship(NS, "Seller", `Seller${i+1}`);
  
    shipment.temperatureReadings = temperatureReadings[i]

    shipment.status = "With_Seller";

    sellers.push(seller);
    logistics.push(logistic);
    buyers.push(buyer);
    shipments.push(shipment);
  }

  const sellerRegistry = await getParticipantRegistry(NS+".Seller");
  await sellerRegistry.addAll(sellers);

  const logisticsRegistry = await getParticipantRegistry(NS+".Logistics");
  await logisticsRegistry.addAll(logistics);

  const buyerRegistry = await getParticipantRegistry(NS+".Buyer");
  await buyerRegistry.addAll(buyers);

  const shipmentRegistry = await getAssetRegistry(NS+".Shipment");
  await shipmentRegistry.addAll(shipments);

}