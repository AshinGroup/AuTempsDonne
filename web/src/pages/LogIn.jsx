import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import atd_logo_typo from "../resources/atd_logo_typo.png";
import Footer from "../components/footer2";

const LogIn = () => {
  const [expanded, setExpanded] = useState(() => window.innerWidth > 1200);

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  return (
    <>
      {/* Page Section */}
      <section className="flex flex-col justify-center h-screen w-full items-center">
        {/* Sign In */}
        <div
          className={`flex flex-col ${
            expanded ? "w-1/4" : "w-3/4"
          } h-4/6 mt-5  items-center bg-white justify-center border-2 border-gray-300 rounded`}
        >
          <div className="p-4 pb-2 relative flex flex-col justify-between items-center">
            <Link to="/">
              <img
                src={atd_logo_typo}
                alt="ATD Logo Typo"
                className="max-w-80"
              />
            </Link>
            <h2 className="font-semibold text-2xl mt-5">Log In</h2>
            <LogInForm />
            <Link to="/" className="mt-2">
              <span className="text-AshinBlue hover:underline">
                {" "}
                Forgot Password ?{" "}
              </span>
            </Link>
          </div>
        </div>
        {/* No Account */}
        <div
          className={`flex ${
            expanded ? "w-1/4" : "w-3/4"
          } h-24 mt-5  items-center bg-white justify-center border-2 border-gray-300 rounded`}
        >
          No account yet ? &nbsp;
          <Link to="/SignUp">
            <span className="text-AshinBlue hover:underline"> Sign Up </span>
          </Link>
        </div>
        {/* Download Android App */}
        <Link
          className="flex justify-center mt-10"
          to="https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo&hl=fr&gl=US"
          target="_blank"
        >
          <img
            className="w-2/6"
            alt="Téléchargez-le dans Google Play"
            src="https://static.cdninstagram.com/rsrc.php/v3/yr/r/093c-DX36-y.png"
          ></img>
        </Link>
      </section>
      <Footer />
    </>
  );
};

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const navigate = useNavigate();

  const intl = useIntl();

  const emailRequired = intl.formatMessage({
    id: "addUserModal.emailRequired",
    defaultMessage: "Email is required.",
  });
  const emailValid = intl.formatMessage({
    id: "addUserModal.emailValid",
    defaultMessage: "Please enter a valid email address.",
  });
  const passwordRequired = intl.formatMessage({
    id: "addUserModal.passwordRequired",
    defaultMessage: "Password is required.",
  });
  const passwordValidPattern = intl.formatMessage({
    id: "addUserModal.passwordValidPattern",
    defaultMessage:
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
  });
  const passwordValidLength = intl.formatMessage({
    id: "addUserModal.passwordValidLength",
    defaultMessage: "Password must be at least 8 characters.",
  });

  const onSubmit = (adata) => {
    fetch(`http://127.0.0.1:5000/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: adata.email,
        password: adata.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (adata.keepLogged) {
          localStorage.setItem("refresh_token", data?.refresh_token);
        } else {
          sessionStorage.setItem("refresh_token", data?.refresh_token);
        }
        sessionStorage.setItem("access_token", data?.access_token);
        navigate("/");
      })
      .catch((error) => {
        setResponseMessage(error.message);
        setIsErrorMessage(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mt-8 flex flex-col items-center"
    >
      <p
        className={` mb-2 font-medium ${
          isErrorMessage ? "text-green-500" : "text-red-500"
        }`}
      >
        {responseMessage}
      </p>
      {/* email */}
      <input
        id="email"
        placeholder="E-mail" // A DYNAMISER
        {...register("email", {
          required: emailRequired,
          pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: emailValid,
          },
        })}
        type="text"
        className="appearance-none border-2 border-gray-300 rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}

      {/* password */}
      <input
        id="password"
        placeholder="Password" // A DYNAMISER
        {...register("password", {
          required: passwordRequired,
          minLength: {
            value: 8,
            message: passwordValidLength,
          },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: passwordValidPattern,
          },
        })}
        type="password"
        className="appearance-none border-2 mt-2 border-gray-300 rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}
      {/* Keep logged */}
      <div className="self-start ms-8 mt-5">
        <input
          id="keepLogged"
          {...register("keepLogged")}
          type="checkbox"
          name="keepLogged"
        />
        <label for="keepLogged" className="text-AshinBlue">
          {" "}
          Maintain connexion
        </label>
      </div>
      {errors.checkbox && (
        <p className="text-red-500 text-sm mt-1">
          {" "}
          <FormattedMessage
            id="sign.checkbox"
            defaultMessage="checkbox cannot be empty:"
          />
        </p>
      )}
      {/* Bouton de soumission */}
      <button
        type="submit"
        className="bg-AshinBlue hover:bg-AshinBlue-dark text-white mt-4 w-5/6 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        <FormattedMessage id="sign.login" defaultMessage="Log In" />
      </button>
    </form>
  );
};

export default LogIn;
