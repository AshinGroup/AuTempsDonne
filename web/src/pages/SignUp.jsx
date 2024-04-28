import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import atd_logo_typo from "../resources/atd_logo_typo.png";
import handleFetch from "../components/handleFetch";
import Footer from "../components/footer2";

const SignUp = () => {
  const navigate = useNavigate();
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
          } mt-5 py-2 items-center bg-white justify-center border-2 border-gray-300 rounded`}
        >
          <div className="p-4 pb-2 relative flex flex-col justify-between items-center">
            <Link to="/">
              <img
                src={atd_logo_typo}
                alt="ATD Logo Typo"
                className="max-w-80"
              />
            </Link>
            <h2 className="font-semibold text-2xl mt-5">Sign Up</h2>
            <SignUpForm />
          </div>
        </div>
        {/* No Account */}
        <div
          className={`flex ${
            expanded ? "w-1/4" : "w-3/4"
          } h-24 mt-5  items-center bg-white justify-center border-2 border-gray-300 rounded`}
        >
          Already have an account ? &nbsp;
          <Link to="/LogIn">
            <span className="text-AshinBlue hover:underline"> Log In </span>
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

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await handleFetch("http://127.0.0.1:5000/api/role");
        if (response) {
          setRoles(response);
          if (response.length > 0) {
            setSelectedRoles([response[0].id]);
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    register("roles");
  }, [register]);

  // Change the roles and set the value in the form
  const toggleRoleSelection = (roleId) => {
    // Minimum 1 role
    if (selectedRoles.length === 1 && selectedRoles.includes(roleId)) {
      return;
    }

    const currentIndex = selectedRoles.indexOf(roleId);
    const newSelectedRoles = [...selectedRoles];

    if (currentIndex === -1) {
      newSelectedRoles.push(roleId);
    } else {
      newSelectedRoles.splice(currentIndex, 1);
    }

    setSelectedRoles(newSelectedRoles);
  };

  // POST
  const onSubmit = async (data) => {
    console.log(data);
    const firstRoleId = selectedRoles[0];
    const additionalRoleIds = selectedRoles.slice(1);

    if (data.password !== data.confirmPassword) {
      setResponseMessage("Passwords do not match.");
      setIsErrorMessage(false);
      return;
    } else {
      delete data.confirmPassword;
    }
    delete data.roles;

    try {
      // First Request
      const newUserResponse = await handleFetch(
        "http://localhost:5000/api/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            role_id: firstRoleId,
            status: 0,
          }),
        }
      );

      if (!newUserResponse.ok) {
        setResponseMessage(newUserResponse.message);
        setIsErrorMessage(false);
        return;
      }

      const newUser = newUserResponse.user;

      // Request for each role
      for (const roleId of additionalRoleIds) {
        const response = await handleFetch(
          `http://localhost:5000/api/user/${newUser.user_id}/role/${roleId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Problem assigning role ${roleId} to user`);
        }
      }

      setResponseMessage(newUserResponse.message);
      setIsErrorMessage(true);

      fetchUsers();
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const intl = useIntl();

  const emailPlaceholder = intl.formatMessage({
    id: "addUserModal.email",
    defaultMessage: "Email",
  });

  const emailRequired = intl.formatMessage({
    id: "addUserModal.emailRequired",
    defaultMessage: "Email is required.",
  });
  const emailValid = intl.formatMessage({
    id: "addUserModal.emailValid",
    defaultMessage: "Please enter a valid email address.",
  });

  const firstNamePlaceholder = intl.formatMessage({
    id: "addUserModal.firstName",
    defaultMessage: "First Name",
  });
  const firstNameRequired = intl.formatMessage({
    id: "addUserModal.firstNameRequired",
    defaultMessage: "First Name is required.",
  });
  const firstNameValidPattern = intl.formatMessage({
    id: "addUserModal.firstNameValidPattern",
    defaultMessage: "First Name should contain characters only.",
  });
  const firstNameValidLength = intl.formatMessage({
    id: "addUserModal.firstNameValidPattern",
    defaultMessage: "First Name must be less than 30 characters.",
  });

  const lastNamePlaceholder = intl.formatMessage({
    id: "addUserModal.lastName",
    defaultMessage: "Last Name",
  });
  const lastNameRequired = intl.formatMessage({
    id: "addUserModal.lastNameRequired",
    defaultMessage: "Last Name is required.",
  });
  const lastNameValidPattern = intl.formatMessage({
    id: "addUserModal.lastNameValidPattern",
    defaultMessage: "Last Name should contain characters only.",
  });
  const lastNameValidLength = intl.formatMessage({
    id: "addUserModal.lastNameValidPattern",
    defaultMessage: "Last Name must be less than 30 characters.",
  });

  const phonePlaceholder = intl.formatMessage({
    id: "addUserModal.phone",
    defaultMessage: "+123456789",
  });
  const phoneRequired = intl.formatMessage({
    id: "addUserModal.phoneRequired",
    defaultMessage: "Phone is required.",
  });
  const phoneValidPattern = intl.formatMessage({
    id: "addUserModal.phoneValidPattern",
    defaultMessage:
      "Phone should be in international format and contain at least 6 numbers.",
  });

  const passwordPlaceholder = intl.formatMessage({
    id: "addUserModal.password",
    defaultMessage: "Password",
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mt-8 flex flex-col items-center  justify-center"
    >
      <p
        className={` mb-2 font-medium ${
          isErrorMessage ? "text-green-500" : "text-red-500"
        }`}
      >
        {responseMessage}
      </p>
      {/* Email Selection  */}
      <input
        type="email"
        placeholder={emailPlaceholder}
        {...register("email", {
          required: emailRequired,
          pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: emailValid,
          },
        })}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {/*First Name and Last Name  */}
      <input
        type="text"
        placeholder={firstNamePlaceholder}
        {...register("first_name", {
          required: firstNameRequired,
          pattern: {
            value:
              /^(?=[a-zA-ZÀ-ÿ\u4e00-\u9fa5]{1,50}$)[a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+(?: [a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+)*$/,
            message: firstNameValidPattern,
          },
          maxLength: {
            value: 30,
            message: firstNameValidLength,
          },
        })}
        className="p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.first_name && (
        <p className="text-red-500">{errors.first_name.message}</p>
      )}
      <input
        type="text"
        placeholder={lastNamePlaceholder}
        {...register("last_name", {
          required: lastNameRequired,
          pattern: {
            value:
              /^(?=[a-zA-ZÀ-ÿ\u4e00-\u9fa5]{1,50}$)[a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+(?: [a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+)*$/,
            message: lastNameValidPattern,
          },
          maxLength: {
            value: 30,
            message: lastNameValidLength,
          },
        })}
        className="p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.last_name && (
        <p className="text-red-500">{errors.last_name.message}</p>
      )}
      {/* Tel Selection */}
      <input
        type="tel"
        placeholder={phonePlaceholder}
        {...register("phone", {
          required: phoneRequired,
          pattern: {
            value: /^\d{6,}$/,
            message: phoneValidPattern,
          },
        })}
        className="p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      {/* Password Selection */}
      <input
        type="password"
        placeholder={passwordPlaceholder}
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
        className="p-2  mt-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      {/* confirmPassword Selection */}
      <input
        type="password"
        placeholder={"Confirm Password"}
        {...register("confirmPassword", {
          required: "Confirm Password",
          minLength: {
            value: 8,
            message: "Confirm Password",
          },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: "Confirm Password",
          },
        })}
        className="p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{errors.confirmPassword.message}</p>
      )}
      {/* Roles Pills */}
      <div className="flex justify-center flex-col mt-2">
        <label className="font-bold text-gray-500 text-center">
          <FormattedMessage id="addUserModal.roles" defaultMessage="Roles" />:
        </label>
        <div className="flex flex-wrap gap-2 my-3 justify-center">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => toggleRoleSelection(role.id)}
              className={`px-4 py-1 border transition-all ${
                selectedRoles.includes(role.id)
                  ? "border-white bg-AshinBlue text-white"
                  : "border-gray-300 bg-gray-200 text-gray-400"
              } rounded-full focus:outline-none`}
            >
              {role.name}
            </button>
          ))}
        </div>
      </div>
      {errors.roles && <p className="text-red-500">{errors.roles.message}</p>}

      {/* Bouton de soumission */}
      <button
        type="submit"
        className="bg-AshinBlue hover:bg-AshinBlue-dark text-white mt-4 w-5/6 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        <FormattedMessage id="sign.register" defaultMessage="Register" />
      </button>
    </form>
  );
};

export default SignUp;
