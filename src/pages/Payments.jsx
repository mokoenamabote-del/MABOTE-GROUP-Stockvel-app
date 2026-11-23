import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bankingDetails from "../lib/bankingDetails";
import PrintableBrand from "../components/PrintableBrand";
import { apiRequest } from "../lib/api";
import "./Payments.css";

const whatsappLink = "https://wa.me/27663331151";
const contactEmail = "info@mabote-group.co.za";

export default function Payments() {
  const printDebitOrderForm = () => window.print();
  const [paymentConfig, setPaymentConfig] = useState({ configured: false });
  const [checkout, setCheckout] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    name: "",
    email: "",
    purpose: "Registration fee",
    amount: 80,
  });

  useEffect(() => {
    apiRequest("/api/payments/config")
      .then(setPaymentConfig)
      .catch(() => setPaymentConfig({ configured: false }));

    const payment = new URLSearchParams(window.location.search).get("payment");
    if (payment === "success") setPaymentStatus("Payment submitted successfully. Confirmation will be recorded after PayFast verifies it.");
    if (payment === "cancelled") setPaymentStatus("Payment was cancelled.");
  }, []);

  const startOnlinePayment = async (event) => {
    event.preventDefault();
    setPaymentError("");
    setCheckout(null);

    try {
      const created = await apiRequest("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify(paymentForm),
      });
      const form = document.createElement("form");
      form.method = "POST";
      form.action = created.redirectUrl;
      Object.entries(created.fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  return (
    <div className="payments-page">
      <header className="payments-header screen-payment-only">
        <div className="payments-container payments-nav">
          <Link to="/" className="payments-logo"><img src="/mabote-logo.svg" alt="MABOTE GROUP PTY(LTD)" /></Link>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/membership">Membership</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <Link to="/register" className="payments-join">Join Now</Link>
        </div>
      </header>

      <main className="payments-container">
        <section className="payments-intro screen-payment-only">
          <p className="payments-eyebrow">MEMBERSHIP PAYMENTS</p>
          <h1>Choose how you would like to pay.</h1>
          <p>Use EFT instructions for a bank transfer, request a debit order mandate, or pay securely online.</p>
        </section>

        <section className="payment-grid screen-payment-only">
          <article className="payment-panel">
            <span className="payment-number">01</span>
            <h2>EFT payment</h2>
            <p>Make your transfer using the official MABOTE GROUP banking details below.</p>
            <div className="eft-details">
              <div><span>Account holder</span><strong>{bankingDetails.accountHolder}</strong></div>
              <div><span>Bank</span><strong>{bankingDetails.bankName}</strong></div>
              <div><span>Account number</span><strong>{bankingDetails.accountNumber}</strong></div>
              <div><span>Branch code</span><strong>{bankingDetails.branchCode}</strong></div>
              <div><span>Account type</span><strong>{bankingDetails.accountType}</strong></div>
              <div><span>Reference</span><strong>{bankingDetails.paymentReference}</strong></div>
            </div>
            <p className="payment-note">Use N/A as the payment reference if your banking app requires one.</p>
          </article>

          <article className="payment-panel">
            <span className="payment-number">02</span>
            <h2>Debit order</h2>
            <p>Complete the mandate below and send it to the MABOTE GROUP PTY(LTD) administrator for verification and processing.</p>
            <button type="button" className="payment-action" onClick={printDebitOrderForm}>Print debit-order form</button>
            <p className="payment-note">The debit order will only be activated after the mandate is reviewed and approved.</p>
          </article>

          <article className="payment-panel online-panel">
            <span className="payment-number">03</span>
            <h2>Pay online</h2>
            {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
            {paymentConfig.configured ? (
              <>
                {!checkout ? (
                  <form className="online-payment-form" onSubmit={startOnlinePayment}>
                    <label>Full name
                      <input
                        required
                        value={paymentForm.name}
                        onChange={(event) => setPaymentForm((current) => ({ ...current, name: event.target.value }))}
                      />
                    </label>
                    <label>Email
                      <input
                        required
                        type="email"
                        value={paymentForm.email}
                        onChange={(event) => setPaymentForm((current) => ({ ...current, email: event.target.value }))}
                      />
                    </label>
                    <label>Payment
                      <select
                        value={`${paymentForm.purpose}|${paymentForm.amount}`}
                        onChange={(event) => {
                          const [purpose, amount] = event.target.value.split("|");
                          setPaymentForm((current) => ({ ...current, purpose, amount: Number(amount) }));
                        }}
                      >
                        <option value="Registration fee|80">Registration fee - R80</option>
                        <option value="Plan A contribution|300">Plan A - R300</option>
                        <option value="Plan B contribution|350">Plan B - R350</option>
                        <option value="Plan C contribution|450">Plan C - R450</option>
                      </select>
                    </label>
                    {paymentError && <p className="payment-error">{paymentError}</p>}
                    <button type="submit" className="payment-action">Continue to secure payment</button>
                  </form>
                ) : (
                  <div className="payfast-payment-widget">
                    <p>Redirecting securely to PayFast...</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>Secure online EFT, card and debit-order checkout is being prepared.</p>
                <button type="button" className="payment-action disabled-payment" disabled>Online payments unavailable</button>
              </>
            )}
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="payment-contact">Ask on WhatsApp: 0663331151</a>
          </article>
        </section>

        <section className="debit-order-document printable-payment-document">
          <PrintableBrand compact subtitle="Debit order mandate" />
          <div className="debit-order-heading">
            <div>
              <p className="payments-eyebrow">MABOTE GROUP PTY(LTD)</p>
              <h2>Debit Order Request Form</h2>
              <p>Stockvel & funeral grocery scheme</p>
            </div>
            <div className="mandate-reference">Mandate reference<br /><span></span></div>
          </div>

          <div className="mandate-section">
            <h3>1. Member details</h3>
            <div className="mandate-fields">
              {['Full name', 'Surname', 'ID number', 'Application / member number', 'Cellphone', 'Email address'].map((field) => <label key={field}>{field}<span></span></label>)}
            </div>
          </div>

          <div className="mandate-section">
            <h3>2. Bank account details</h3>
            <div className="mandate-fields">
              {['Account holder', 'Bank name', 'Account number', 'Branch code', 'Account type'].map((field) => <label key={field}>{field}<span></span></label>)}
            </div>
            <p className="mandate-note">Do not write or attach card CVV details. This debit-order mandate uses your bank account information only.</p>
          </div>

          <div className="mandate-section">
            <h3>3. Debit-order authorisation</h3>
            <p>I authorise MABOTE GROUP PTY(LTD) to submit debit-order instructions to my bank for the agreed membership contribution and registration fee where applicable. I understand that this instruction is subject to verification and acceptance by my bank.</p>
            <div className="mandate-fields amount-fields">
              <label>Monthly amount (R)<span></span></label>
              <label>First collection date<span></span></label>
            </div>
          </div>

          <div className="mandate-signatures">
            <div>Account holder signature<span></span></div>
            <div>Date<span></span></div>
          </div>
          <p className="mandate-footer">Submit the completed form to {contactEmail} or WhatsApp 0663331151.</p>
        </section>
      </main>
    </div>
  );
}