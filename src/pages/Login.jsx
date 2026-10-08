import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Login() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isRequestingReset, setIsRequestingReset] = useState(false);
	const [resetMessage, setResetMessage] = useState("");
	const [resetError, setResetError] = useState(false);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const result = await apiRequest("/api/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: email.trim(),
					password,
				}),
			});

			localStorage.setItem("maboteAuthToken", result.token);
			localStorage.setItem("maboteAccount", JSON.stringify(result.account));

			navigate(result.account.role === "Member" ? "/client-portal" : "/admin");
		} catch (error) {
			if (error.status === 401) {
				alert("We could not log you in. Check your email and password, or create an account first.");
			} else {
				alert(error.message || "Unable to log in. Please try again.");
			}
		}
	};

	const handlePasswordReset = async () => {
		const requestedEmail = email.trim();
		setResetMessage("");
		setResetError(false);

		if (!requestedEmail) {
			setResetMessage("Enter your account email address first.");
			setResetError(true);
			return;
		}

		setIsRequestingReset(true);
		try {
			const result = await apiRequest("/api/auth/password-reset-requests", {
				method: "POST",
				body: JSON.stringify({ email: requestedEmail }),
			});
			setResetMessage(result.message);
		} catch (error) {
			setResetMessage(error.message || "Unable to request a password reset.");
			setResetError(true);
		} finally {
			setIsRequestingReset(false);
		}
	};

	return (
		<section className="login-container">
			<div className="login-box">
				<h1>MABOTE GROUP HOLDINGS</h1>
				<h2>Login</h2>

				<form onSubmit={handleLogin}>
					<label htmlFor="email">Email Address</label>
					<input
						id="email"
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						autoComplete="email"
						required
					/>

					<label htmlFor="password">Password</label>
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="Enter your password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						autoComplete="current-password"
						required
					/>

					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginTop: "8px",
							cursor: "pointer",
						}}
					>
						<input
							type="checkbox"
							checked={showPassword}
							onChange={(event) => setShowPassword(event.target.checked)}
						/>
						Show Password
					</label>

					<button type="submit">LOGIN</button>
				</form>

				<button
					type="button"
					onClick={handlePasswordReset}
					disabled={isRequestingReset}
				>
					{isRequestingReset ? "SENDING RESET LINK..." : "FORGOT PASSWORD?"}
				</button>

				{resetMessage && (
					<p
						className={resetError ? "login-error-message" : "login-help-message"}
						role={resetError ? "alert" : "status"}
					>
						{resetMessage}
					</p>
				)}

				<p>Don't have an account?</p>
				<button type="button" onClick={() => navigate("/register")}>
					CREATE ACCOUNT
				</button>
			</div>
		</section>
	);
}
