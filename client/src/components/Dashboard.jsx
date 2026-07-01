import { useState } from "react";
import api from "../api.js";

const routes = [
  {
    label: "Student Route",
    path: "/auth/student-area",
    allowedRoles: ["student", "teacher", "admin"],
    description: "Any logged-in user can open this route."
  },
  {
    label: "Teacher Route",
    path: "/auth/teacher-area",
    allowedRoles: ["teacher", "admin"],
    description: "Only teacher and admin users can open this route."
  },
  {
    label: "Admin Route",
    path: "/auth/admin-area",
    allowedRoles: ["admin"],
    description: "Only admin users can open this route."
  }
];

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

function Dashboard({
  user,
  profileForm,
  onProfileChange,
  onProfileFileChange,
  onProfileSubmit,
  onLogout,
  roleLabels,
  roleOptions,
  setMessage,
  setError,
  submitting
}) {
  const [routeResult, setRouteResult] = useState(null);

  const handleRouteCheck = async (route) => {
    setMessage("");
    setError("");

    try {
      const { data } = await api.get(route.path);
      setRouteResult({
        route: route.label,
        success: true,
        data
      });
      setMessage(data.message);
    } catch (error) {
      setRouteResult({
        route: route.label,
        success: false,
        data: { message: getErrorMessage(error) }
      });
      setError(getErrorMessage(error));
    }
  };

  return (
    <section className="simple-dashboard">
      {/* The main profile card is shown first so the user immediately sees who is logged in. */}
      <article className="panel profile-summary">
        <div className="profile-header">
          {user.profileImage ? (
            <img className="avatar" src={user.profileImage} alt={user.name} />
          ) : (
            <div className="avatar placeholder">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className={`role-badge role-${user.role}`}>
              {roleLabels[user.role]}
            </span>
          </div>
        </div>

        <p className="panel-copy">
          You are signed in. This page is now simpler, so it is easier to understand what you can change.
        </p>

        <button className="secondary-button" onClick={onLogout}>
          Logout
        </button>
      </article>

      {/* The profile form stays visible and basic, with only the most important fields. */}
      <form className="panel profile-form" onSubmit={onProfileSubmit}>
        <h2>Update your profile</h2>
        <p className="panel-copy">Change your name, add a short bio, choose a role, or upload a new photo.</p>

        <label>
          Name
          <input name="name" value={profileForm.name} onChange={onProfileChange} required />
        </label>

        <label>
          Bio
          <textarea
            name="bio"
            value={profileForm.bio}
            onChange={onProfileChange}
            placeholder="Tell us something about yourself"
            rows="4"
          />
        </label>

        <label>
          Role
          <select name="role" value={profileForm.role} onChange={onProfileChange}>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Profile photo
          <input type="file" accept="image/*" onChange={onProfileFileChange} />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save profile"}
        </button>
      </form>

      {/* This small section brings back the role-based access demo without making the page feel busy. */}
      <article className="panel role-demo">
        <h2>Role access demo</h2>
        <p className="panel-copy">This shows how the backend checks access for each protected route.</p>

        <div className="route-list">
          {routes.map((route) => {
            const hasAccess = route.allowedRoles.includes(user.role);

            return (
              <div key={route.path} className="route-card">
                <div className="route-card-header">
                  <div>
                    <h3>{route.label}</h3>
                    <p className="panel-copy">{route.description}</p>
                  </div>
                  <span className={hasAccess ? "access-ok" : "access-no"}>
                    {hasAccess ? "You have access" : "Access denied"}
                  </span>
                </div>

                <p className="route-meta">
                  Allowed roles: {route.allowedRoles.map((role) => roleLabels[role]).join(", ")}
                </p>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleRouteCheck(route)}
                >
                  Check this route
                </button>
              </div>
            );
          })}
        </div>

        <pre className="result-box">
          {routeResult
            ? JSON.stringify(routeResult, null, 2)
            : "Choose a route to see the response."}
        </pre>
      </article>
    </section>
  );
}

export default Dashboard;
