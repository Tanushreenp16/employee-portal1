document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!res.ok || !data.token) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ Save auth data
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    alert("Login successful!");

    // ✅ Role-based redirect
    if (data.role === "Employee") {
      window.location.href = "employee-dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Please try again.");
  }
});
