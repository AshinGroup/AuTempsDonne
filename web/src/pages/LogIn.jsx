import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import atd_logo_typo from "../resources/atd_logo_typo.png";



const LogIn = () => {
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
      <section className="flex flex-col justify-center h-screen w-screen items-center">
        {/* Sign In */}
        <div className={`flex flex-col ${expanded ? 'w-1/4' : 'w-3/4'} h-4/6 mt-5  items-center bg-white justify-center border-2 border-gray-300 rounded`}>
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
              <span className="text-AshinBlue hover:underline"> Forgot Password ? </span>
            </Link>
          </div>
        </div>
        {/* No Account */}
        <div className={`flex ${expanded ? 'w-1/4' : 'w-3/4'} h-24 mt-5  items-center bg-white justify-center border-2 border-gray-300 rounded`}>
          No account yet ? &nbsp;
          <Link to="/SignUp">
            <span className="text-AshinBlue hover:underline"> Sign Up </span>
          </Link>
        </div>
        {/* Download Android App */}
        <Link className="flex justify-center mt-10" to="https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo&hl=fr&gl=US" target="_blank">
          <img className="w-2/6" alt="Téléchargez-le dans Google Play" src="https://static.cdninstagram.com/rsrc.php/v3/yr/r/093c-DX36-y.png"></img>
        </Link>
      </section>
      {/* Footer */}
      <div className="flex flex-col w-full h-56 mt-10 items-center bg-white justify-center border-2 border-green-400 bg-green-600">
          Footer (Different from the homepage (Need to set credits, links to the homepage and Languages modifications))
      </div>
    </>
  );
};

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-8 flex flex-col items-center">
      {/* email */}
        <input
          id="email"
          placeholder="E-mail" // A DYNAMISER
          {...register("email", { required: true })}
          type="text"
          className="appearance-none border-2 border-gray-300 rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {" "}
            <FormattedMessage
              id="sign.email"
              defaultMessage="email cannot be empty:"
            />
          </p>
        )}

      {/* password */}
      <input
          id="password"
          placeholder="Password" // A DYNAMISER
          {...register("password", { required: true })}
          type="password"
          className="appearance-none border-2 mt-2 border-gray-300 rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {" "}
            <FormattedMessage
              id="sign.password"
              defaultMessage="password cannot be empty:"
            />
          </p>
        )}

      {/* Bouton de soumission */}
        <button
          type="submit"
          className="bg-AshinBlue hover:bg-AshinBlue-dark text-white mt-4 w-5/6 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <FormattedMessage
            id="sign.login"
            defaultMessage="Log In"
          />
        </button>
    </form>
  );
};

export default LogIn;

