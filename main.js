const { useState, useEffect } = React;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function validate() {
    const errorsList = [];

    if (!email) {
      errorsList.push("Поле Email повинне бути заповнене.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorsList.push("Поле Email повинне містити дійсну електронну адресу.");
      }
    }

    if (password.length < 8) {
      errorsList.push("Пароль має містити щонайменше 8 символів.");
    }
    if (!/[A-Z]/.test(password)) {
      errorsList.push("Пароль повинен містити хоча б одну велику літеру.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errorsList.push("Пароль повинен містити хоча б один спеціальний символ.");
    }
    if (/[\u0400-\u04FF]/.test(password)) {
      errorsList.push("Пароль не повинен містити кирилиці.");
    }

    return errorsList;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");
    const validationErrors = validate();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const response = await fetch("/form-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Відповідь сервера:", data);

      if (!response.ok) throw new Error("Помилка запиту");

      if (data.status === "OK") {
        setSuccessMessage("Форма успішно відправлена!");
        setEmail("");
        setPassword("");
      } else {
        setErrors(["Невірні дані. Будь ласка, заповніть email і пароль."]);
      }
    } catch (error) {
      setErrors(["Сталася помилка при відправці форми."]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return React.createElement(
    "form",
    {
      onSubmit: handleSubmit,
      noValidate: true,
      style: {
        position: "relative",
        padding: 15,
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "Arial, sans-serif",
        marginBottom: 30,
      },
    },
    React.createElement("img", {
      src: "https://via.placeholder.com/300x120",
      alt: "Placeholder",
      style: { marginBottom: 10, width: 300, height: 120, objectFit: "cover" },
    }),
    errors.length > 0 &&
    React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#FF6C55",
          borderRadius: 6,
          padding: 4,
          color: "white",
          whiteSpace: "pre-line",
        },
      },
      errors.join("\n")
    ),
    successMessage &&
    React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#3FFF5A",
          borderRadius: 6,
          padding: 4,
          color: "black",
          marginBottom: 10,
          textAlign: "center",
        },
      },
      successMessage
    ),
    React.createElement(
      "label",
      { style: { display: "flex", alignItems: "center", gap: 10 } },
      React.createElement("span", { style: { width: "25%" } }, "Email:"),
      React.createElement("input", {
        type: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        style: { width: "75%", padding: 5, borderRadius: 3, border: "1px solid #ccc" },
        required: true,
        disabled: loading,
      })
    ),
    React.createElement(
      "label",
      { style: { display: "flex", alignItems: "center", gap: 10 } },
      React.createElement("span", { style: { width: "25%" } }, "Password:"),
      React.createElement("input", {
        type: "password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        style: { width: "75%", padding: 5, borderRadius: 3, border: "1px solid #ccc" },
        required: true,
        disabled: loading,
      })
    ),
    React.createElement(
      "a",
      { href: "#", style: { textDecoration: "none", color: "blue", fontSize: 14, marginBottom: 10 } },
      "Forgot your password?"
    ),
    React.createElement(
      "button",
      {
        type: "submit",
        disabled: loading,
        style: {
          backgroundColor: "#3FFF5A",
          color: "white",
          fontWeight: "bold",
          padding: "10px 0",
          border: "none",
          borderRadius: 12,
          cursor: loading ? "default" : "pointer",
          width: "100%",
          fontSize: 18,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        },
      },
      loading
        ? React.createElement("span", {
          style: {
            width: 24,
            height: 24,
            border: "3px solid #f3f3f3",
            borderTop: "3px solid white",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 1s linear infinite",
          },
        })
        : "Submit"
    ),
    React.createElement(
      "style",
      null,
      `
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `
    )
  );
}

function App() {
  return React.createElement(LoginForm);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
