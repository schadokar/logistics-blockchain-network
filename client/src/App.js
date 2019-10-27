import React from "react";
import "./App.css";
import { Container } from "semantic-ui-react";
import Header from "./components/Header/index";
import Sidebar from "./components/Sidebar/index";

function App() {
  return (
    <Container>
      <Header></Header>
      <Sidebar></Sidebar>
    </Container>
  );
}

export default App;
