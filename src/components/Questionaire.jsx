import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Checkout() {
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const [orderId, setOrderId] = useState("");
  const [orderKey, setOrderKey] = useState("");
  const [verifiedPayload, setVerifiedPayload] = useState(null);

  useEffect(() => {
    const verifyCheckout = async () => {
      const params = new URLSearchParams(window.location.search);
      const payloadB64 = params.get("payload");
      const sig = params.get("sig");
      const siteId = params.get("site");

      if (payloadB64 && sig && siteId) {
        try {
          const res = await axios.post(
            "http://localhost:8080/api/checkout/verifycheckout",
            { payloadB64, sig, siteId }
          );

          setVerifiedPayload(res.data.payload);
          setOrderId(res.data.payload?.order?.id);
          setOrderKey(res.data.payload?.order?.key);

          console.log("Verification result:", res.data.payload);
          // If valid, you can store orderId/orderKey from res.data.payload
        } catch (error) {
          console.error("Error verifying checkout:", error);
        }
      }
    };

    verifyCheckout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log("Order Id:", orderId);
      // console.log("Order Key:", orderKey);
      // console.log("Call Back Url:", verifiedPayload.callback_url);
      // console.log("Redirect Url:", verifiedPayload.return_url);
      const res = await axios.post("http://localhost:8080/api/order/confirm", {
        orderId,
        orderKey,
        callback_url: verifiedPayload?.callback_url,
        redirect_url: verifiedPayload.return_url,
        answers: formData,
      });

      console.log(res);
      // if (res.data?.ok && res.data.redirect) {
      //   window.location.href = res.data.redirect;
      // } else {
      //   alert("Failed to confirm order: " + JSON.stringify(res.data));
      // }
    } catch (err) {
      console.error("Confirm error", err);
      alert("Error confirming order. See console.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto space-y-4 border rounded-lg"
    >
      {orderId && orderKey && (
        <div>
          <h2 className="text-lg font-bold">Order Details</h2>
          <p>Order ID: {orderId}</p>
          <p>Order Key: {orderKey}</p>
        </div>
      )}
      <h2 className="text-xl font-bold">Answer the following questions:</h2>
      {["q1", "q2", "q3", "q4"].map((q, index) => (
        <div key={q}>
          <p className="mb-1">Question {index + 1}?</p>
          <label className="mr-4">
            <input
              type="radio"
              name={q}
              value="Yes"
              checked={formData[q] === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={q}
              value="No"
              checked={formData[q] === "No"}
              onChange={handleChange}
              required
            />{" "}
            No
          </label>
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
