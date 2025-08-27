import React from "react";
import Questionaire from "./components/Questionaire";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Payment from "./components/Payment";
import Success from "./components/Success";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Questionaire />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
