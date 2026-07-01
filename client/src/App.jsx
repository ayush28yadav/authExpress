import { useEffect, useState } from "react";
import AuthSection from "./components/AuthSection.jsx";
import Dashboard from "./components/Dashboard.jsx";
import api from "./api.js";

// These labels are shown in the signup form and in the profile area.
const roleOptions = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" }
];

const roleLabels = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin"
};

// These objects hold the default values for each form.
const signupStart = {
  name: "",
  email: "",
  password: "",
  role: "student",
  profileImage: null
};

const loginStart = {
  email: "",
  password: ""
};

const profileStart = {
  name: "",
  bio: "",
  role: "student",
  profileImage: null
};

// Small helper so the profile form always starts from the current user data.
const getProfileValues = (user) => ({
  name: user?.name || "",
  bio: user?.bio || "",
  role: user?.role || "student",
  profileImage: null
});

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signup");
  const [signupForm, setSignupForm] = useState(signupStart);
  const [loginForm, setLoginForm] = useState(loginStart);
  const [profileForm, setProfileForm] = useState(profileStart);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check whether the browser already has a valid auth cookie.
    const loadUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        setProfileForm(getProfileValues(data.user));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  // This one handler keeps text and select fields short and easy to read.
  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  };

  // The signup page needs a file field, so this helper stores the chosen image.
  const handleSignupFile = (event) => {
    const file = event.target.files?.[0] || null;
    setSignupForm((current) => ({ ...current, profileImage: file }));
  };

  // The profile screen also lets the user change the photo later.
  const handleProfileFile = (event) => {
    const file = event.target.files?.[0] || null;
    setProfileForm((current) => ({ ...current, profileImage: file }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    clearStatus();
    setSubmitting(true);

    try {
      // FormData is used because the signup form now sends an image file too.
      const formData = new FormData();
      formData.append("name", signupForm.name);
      formData.append("email", signupForm.email);
      formData.append("password", signupForm.password);
      formData.append("role", signupForm.role);

      if (signupForm.profileImage) {
        formData.append("profileImage", signupForm.profileImage);
      }

      const { data } = await api.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setUser(data.user);
      setSignupForm(signupStart);
      setProfileForm(getProfileValues(data.user));
      setMessage(data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    clearStatus();
    setSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", loginForm);
      setUser(data.user);
      setLoginForm(loginStart);
      setProfileForm(getProfileValues(data.user));
      setMessage(data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    clearStatus();

    try {
      const { data } = await api.post("/auth/logout");
      setUser(null);
      setProfileForm(profileStart);
      setMode("login");
      setMessage(data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    clearStatus();
    setSubmitting(true);

    try {
      // The profile update also uses FormData so the image can be sent with the text fields.
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("bio", profileForm.bio);
      formData.append("role", profileForm.role);

      if (profileForm.profileImage) {
        formData.append("profileImage", profileForm.profileImage);
      }

      const { data } = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setUser(data.user);
      setProfileForm(getProfileValues(data.user));
      setMessage(data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="hero-card">
        <h1>Simple Auth Demo</h1>
        <p className="hero-copy">
          Create an account, sign in, and add a profile photo from one simple screen.
        </p>
      </section>

      {message ? <p className="notice success">{message}</p> : null}
      {error ? <p className="notice error">{error}</p> : null}

      {loading ? (
        <section className="panel">
          <p>Loading your account...</p>
        </section>
      ) : user ? (
        <Dashboard
          onLogout={handleLogout}
          onProfileChange={handleChange(setProfileForm)}
          onProfileFileChange={handleProfileFile}
          onProfileSubmit={handleProfileSubmit}
          profileForm={profileForm}
          roleLabels={roleLabels}
          roleOptions={roleOptions}
          setError={setError}
          setMessage={setMessage}
          submitting={submitting}
          user={user}
        />
      ) : (
        <AuthSection
          loginForm={loginForm}
          mode={mode}
          onLogin={handleLogin}
          onLoginChange={handleChange(setLoginForm)}
          onSignup={handleSignup}
          onSignupChange={handleChange(setSignupForm)}
          onSignupFileChange={handleSignupFile}
          onSwitchMode={setMode}
          roleOptions={roleOptions}
          signupForm={signupForm}
          submitting={submitting}
        />
      )}
    </main>
  );
}

export default App;
