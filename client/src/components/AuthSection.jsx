function AuthSection({
  mode,
  signupForm,
  loginForm,
  onSignupChange,
  onLoginChange,
  onSignup,
  onLogin,
  onSwitchMode,
  onSignupFileChange,
  roleOptions,
  submitting
}) {
  const isSignup = mode === "signup";

  return (
    <section className="auth-shell">
      <form className="panel auth-panel" onSubmit={isSignup ? onSignup : onLogin}>
        <h2>{isSignup ? "Create account" : "Welcome back"}</h2>
        <p className="panel-copy">
          {isSignup
            ? "Use this simple form to sign up. The photo is optional and helps make your profile feel personal."
            : "Enter your email and password to continue to your account."}
        </p>

        {isSignup ? (
          <>
            {/* Signup needs a few more details than login, so we keep them visible here. */}
            <label>
              Name
              <input
                name="name"
                value={signupForm.name}
                onChange={onSignupChange}
                placeholder="Your name"
                required
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={signupForm.email}
                onChange={onSignupChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={signupForm.password}
                onChange={onSignupChange}
                placeholder="At least 6 characters"
                required
              />
            </label>

            <label>
              Role
              <select name="role" value={signupForm.role} onChange={onSignupChange}>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Profile photo
              <input type="file" accept="image/*" onChange={onSignupFileChange} />
            </label>
          </>
        ) : (
          <>
            {/* Login is intentionally short and focused on the essentials. */}
            <label>
              Email
              <input
                name="email"
                type="email"
                value={loginForm.email}
                onChange={onLoginChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={onLoginChange}
                placeholder="Your password"
                required
              />
            </label>
          </>
        )}

        <div className="button-row">
          <button type="submit" disabled={submitting}>
            {submitting ? (isSignup ? "Creating..." : "Checking...") : isSignup ? "Create account" : "Login"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
          >
            {isSignup ? "Already have an account?" : "Need an account?"}
          </button>
        </div>

        <p className="helper-text">
          {isSignup
            ? "You can always change your photo later from the profile screen."
            : "Tip: use the same email and password you used while signing up."}
        </p>
      </form>
    </section>
  );
}

export default AuthSection;
