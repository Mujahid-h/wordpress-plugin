import React, { useState, useEffect } from "react";
import { confirmOrder, fetchOrderById } from "../service/orderService";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import PaymentCardComponent from "./Card";

export default function Checkout() {
  const [formData, setFormData] = useState({
    q1: "yes",
    q2: "yes",
    q3: "yes",
    q4: "yes",
  });
  const navigate = useNavigate();

  const [verifiedPayload, setVerifiedPayload] = useState(null);
  // const currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
  const [order, setOrder] = useState();

  function b64urlToUtf8(b64u) {
    // Convert Base64URL → Base64
    const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64 to binary string
    const binary = atob(b64);

    // Convert binary string → Uint8Array
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    // Decode UTF-8 text
    return new TextDecoder().decode(bytes);
  }

  function generateHmac(rawJSON, secret) {
    return CryptoJS.HmacSHA256(rawJSON, secret).toString(CryptoJS.enc.Hex);
  }

  const verifyCheckout = async () => {
    const params = new URLSearchParams(window.location.search);
    const payloadB64 = params.get("payload");
    const sig = params.get("sig");
    const siteId = params.get("site");

    try {
      const rawJSON = b64urlToUtf8(payloadB64);
      console.log("Payload received from woocommerce plugin: ", JSON.parse(rawJSON))
      const hash = generateHmac(rawJSON, import.meta.env.VITE_SITE_SECRET);

      if (hash === sig) {
        setVerifiedPayload(JSON.parse(rawJSON));
      } else {
        console.log("Someting went wrong!");
      }
    } catch (error) {
      console.error("Error verifying checkout:", error);
    }
  };

  useEffect(() => {
    verifyCheckout();
  }, []);

  useEffect(() => {
    const createOrder = async () => {
      if (verifiedPayload && order.order.id !== verifiedPayload.order.id) {
        const res = await confirmOrder(verifiedPayload);
        setOrder(res?.order);
      }
    };

    createOrder();
  }, [verifiedPayload]);

  useEffect(() => {
    const ensureOrder = async () => {
      if (!verifiedPayload) return;

      try {
        // check if order already exists in DB
        const existing = await fetchOrderById(verifiedPayload.order.id);

        if (existing?.order) {
          // ✅ already in DB → just set it
          setOrder(existing.order);
        } else {
          // ❌ not in DB → create it
          const res = await confirmOrder(verifiedPayload);
          setOrder(res?.order);
        }
      } catch (error) {
        console.error("Error ensuring order:", error);
        // fallback → try creating
        // try {
        //   const res = await confirmOrder(verifiedPayload);
        //   setOrder(res?.order);
        // } catch (createErr) {
        //   console.error("Error creating order:", createErr);
        // }
      }
    };

    ensureOrder();
  }, [verifiedPayload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert formData into structured answers array
    const answers = Object.entries(formData).map(([key, value]) => ({
      question: key,
      answer: value,
    }));

    const payload = {
      orderData: verifiedPayload, // original Woo payload
      answers, // questionnaire responses
    };

    try {
      const res = await confirmOrder(payload);

      // console.log("Order confirm response:", res);

      localStorage.setItem("currentOrder", JSON.stringify(res.order));
      setVerifiedPayload(null);
      navigate("/payment");
    } catch (err) {
      console.error("Confirm error", err);
      alert("Error submitting form. Check console for details.");
    }
  };

  return (
    // <form
    //   onSubmit={handleSubmit}
    //   className="p-4 max-w-md mx-auto space-y-4 border rounded-lg"
    // >
    //   <h2 className="text-xl font-bold">Answer the following questions:</h2>
    //   {["q1", "q2", "q3", "q4"].map((q, index) => (
    //     <div key={q}>
    //       <p className="mb-1">Question {index + 1}?</p>
    //       <label className="mr-4">
    //         <input
    //           type="radio"
    //           name={q}
    //           value="Yes"
    //           checked={formData[q] === "Yes"}
    //           onChange={handleChange}
    //           required
    //         />{" "}
    //         Yes
    //       </label>
    //       <label>
    //         <input
    //           type="radio"
    //           name={q}
    //           value="No"
    //           checked={formData[q] === "No"}
    //           onChange={handleChange}
    //           required
    //         />
    //         No
    //       </label>
    //     </div>
    //   ))}
    //   <button
    //     type="submit"
    //     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    //   >
    //     Submit
    //   </button>
    // </form>

    <PaymentCardComponent />
  );
}
