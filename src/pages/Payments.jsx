import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Payments.css";

const whatsappLink = "https://wa.me/27663331151";
const contactEmail = "info@mabotegroup.co.za";

export default function Payments() {
  const [bankingDetails] = useState(() => {
    try {
      const saved = window.localStorage.getItem("mabote-banking-details");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  });

  const hasConfirmedBankingDetails = [
    "accountHolder",
    "bankName",
    "accountNumber",
    "branchCode",
    "accountType",
  ].every((field) => bankingDetails?.[field]?.trim());

  const printDebitOrderForm = () => window.print();

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
          <p>Use EFT instructions for a bank transfer, request a debit order mandate, or contact us while online payments are being set up.</p>
        </section>

        <section className="payment-grid screen-payment-only">
          <article className="payment-panel">
            <span className="payment-number">01</span>
            <h2>EFT payment</h2>
            <p>Make your transfer using the official MABOTE GROUP PTY(LTD) banking details supplied by an administrator.</p>
            <div className="eft-details">
              <div><span>Account holder</span><strong>{hasConfirmedBankingDetails ? bankingDetails.accountHolder : "MABOTE GROUP PTY(LTD)"}</strong></div>
              <div><span>Bank</span><strong>{hasConfirmedBankingDetails ? bankingDetails.bankName : "To be confirmed by administrator"}</strong></div>
              <div><span>Account number</span><strong>{hasConfirmedBankingDetails ? bankingDetails.accountNumber : "Request from administrator"}</strong></div>
              <div><span>Branch code</span><strong>{hasConfirmedBankingDetails ? bankingDetails.branchCode : "Request from administrator"}</strong></div>
              <div><span>Account type</span><strong>{hasConfirmedBankingDetails ? bankingDetails.accountType : "To be confirmed by administrator"}</strong></div>
              <div><span>Reference</span><strong>Your name + application number</strong></div>
            </div>
            <p className="payment-note">{hasConfirmedBankingDetails ? "Please use the account details above and include your name and application number as the payment reference." : "Please do not pay into an account until the bank details have been confirmed directly by MABOTE GROUP PTY(LTD)."}</p>
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
            <p>Secure online EFT, card and debit-order checkout will be available after our payment provider account is activated.</p>
            <button type="button" className="payment-action disabled-payment" disabled>Pay online - coming soon</button>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="payment-contact">Ask on WhatsApp: 0663331151</a>
          </article>
        </section>

        <section className="debit-order-document printable-payment-document">
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