import React, { Component } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";
import Seller from "../Seller/index";
import Logistics from "../Logistics/index";
import Buyer from "../Buyer/index";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "seller"
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  actor = () => {
    switch (this.state.activeItem) {
      case "seller":
        return <Seller></Seller>;
      case "logistics":
        return <Logistics></Logistics>;
      case "buyer":
        return <Buyer></Buyer>;
      default:
        return <Seller></Seller>;
    }
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Grid>
        <Grid.Column width={2}>
          <Menu fluid vertical tabular>
            <Menu.Item
              name="seller"
              active={activeItem === "seller"}
              onClick={this.handleItemClick}
            ></Menu.Item>
            <Menu.Item
              name="logistics"
              active={activeItem === "logistics"}
              onClick={this.handleItemClick}
            ></Menu.Item>
            <Menu.Item
              name="buyer"
              active={activeItem === "buyer"}
              onClick={this.handleItemClick}
            ></Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={14}>
          <Segment>{this.actor()}</Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
