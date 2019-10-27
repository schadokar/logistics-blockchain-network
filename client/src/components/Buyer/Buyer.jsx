import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import axios from "axios";
import { serverURL } from "../../config.json";

export default class Buyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipmentList: []
    };

    this.buyerConsent = this.buyerConsent.bind(this);
    this.createTableRows = this.createTableRows.bind(this);
  }

  componentDidMount() {
    // get all the shipments

    this.getShiments();
  }

  async getShiments() {
    const shipments = (await axios.get(
      `${serverURL}/queries/getShipmentsForBuyer`
    )).data;

    let list = await Promise.all(
      shipments.map(async shipment => {
        const sellerId = shipment.seller.split("#")[1];
        const sellerLocation = (await axios.get(
          `${serverURL}/Seller/${sellerId}`
        )).data.location;

        const buyerId = shipment.buyer.split("#")[1];
        const buyerLocation = (await axios.get(`${serverURL}/Buyer/${buyerId}`))
          .data.location;
        // console.log(sellerId, sellerLocation, buyerId, buyerLocation);

        return {
          shipmentId: shipment.shipmentId,
          sellerLocation: sellerLocation,
          sellerId: sellerId,
          logisticsId: shipment.logistics.split("#")[1],
          status: shipment.status,
          buyerId: buyerId,
          buyerLocation: buyerLocation,
          tempBreach: "No",
          button: "Primary"
        };
      })
    );

    this.setState({
      shipmentList: list
    });
  }

  createTableRows() {
    return this.state.shipmentList.map((shipment, index) => {
      var b = true;
      if (shipment.status === "Delivered") {
        b = false;
      }
      return (
        <Table.Row key={index}>
          <Table.Cell>{shipment.shipmentId}</Table.Cell>
          <Table.Cell>{shipment.sellerLocation}</Table.Cell>
          <Table.Cell>{shipment.logisticsId}</Table.Cell>
          <Table.Cell>{shipment.status}</Table.Cell>
          <Table.Cell>{shipment.buyerId}</Table.Cell>
          <Table.Cell>{shipment.buyerLocation}</Table.Cell>
          <Table.Cell>temp</Table.Cell>
          <Table.Cell>
            <Button.Group>
              <Button
                positive
                disabled={b}
                onClick={() => this.buyerConsent(index, "Accepted_by_buyer")}
              >
                Accept
              </Button>
              <Button.Or />
              <Button
                negative
                disabled={b}
                onClick={() => this.buyerConsent(index, "Rejected_by_buyer")}
              >
                Reject
              </Button>
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  buyerConsent(index, consent) {
    const shipment = this.state.shipmentList[index];
    // console.log(index, this.state.shipmentList[index]);

    axios
      .post(`${serverURL}/transferOwnership`, {
        shipment: `${shipment.shipmentId}`,
        to: `org.logistics.network.Buyer#${shipment.buyerId}`,
        status: consent
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Success");
          this.getShiments();
        }
      });
  }

  render() {
    return (
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Shipment</Table.HeaderCell>
            <Table.HeaderCell>Seller Location</Table.HeaderCell>
            <Table.HeaderCell>Logistics ID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Buyer ID</Table.HeaderCell>
            <Table.HeaderCell>Buyer Location</Table.HeaderCell>
            <Table.HeaderCell>Temperature Breach</Table.HeaderCell>
            <Table.HeaderCell>Change Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.createTableRows()}</Table.Body>
      </Table>
    );
  }
}
