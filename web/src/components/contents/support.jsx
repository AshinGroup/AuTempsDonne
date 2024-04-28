import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import handleFetch from "../handleFetch";

const Support = () => {
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState(
    "Waiting for server status..."
  );

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await handleFetch("http://127.0.0.1:5000/api/type/1");
        //127.0.0.1:5000/api/protected
        http: if (response) {
          setServerStatus("Online");
        } else {
          setServerStatus("Offline");
        }
      } catch (error) {
        console.error(
          "Error checking server status. Server may be offline.",
          error
        );
        setServerStatus("Offline");
      }
    };
    checkServerStatus();
  }, []);

  return (
    <>
      <section className="flex justify-center items-center h-screen bg-cover bg-no-repeat bg-center bg-[url('https://media.istockphoto.com/id/656898392/fr/photo/amis-amiti%C3%A9-fist-togetherness-concept.jpg?s=1024x1024&w=is&k=20&c=tCERIp7922ElulLsmSxuKq9i7Arpg1AUBsAfRjSdsWw=')]">
        <div className="flex flex-col w-4/6 items-center bg-white justify-center h-screen ">
          <h1 className="text-4xl mb-6 font-bold text-AshinBlue underline decoration-4">
            <FormattedMessage
              id="support.supportAuTempsDonne"
              defaultMessage="Support de Au Temps Donné"
            />
          </h1>

          {/* État du serveur */}
          <div className="mt-6">
            <p className="text-lg text-gray-700 font-bold flex">
              <FormattedMessage
                id="support.serverstatus"
                defaultMessage="API Server Status:"
              />
              <span
                className={`flex ms-2 ${
                  serverStatus == "Online"
                    ? "text-green-400"
                    : serverStatus == "Offline"
                    ? "text-red-400"
                    : "text-orange-400"
                }`}
              >
                {serverStatus == "Online" ? (
                  <FormattedMessage
                    id="support.online"
                    defaultMessage="online"
                  />
                ) : serverStatus == "Offline" ? (
                  <FormattedMessage
                    id="support.offline"
                    defaultMessage="offline"
                  />
                ) : (
                  <FormattedMessage
                    id="support.maintenance"
                    defaultMessage="maintenance"
                  />
                )}
              </span>
            </p>
          </div>
          {/* Mes requêtes */}
          <button
            onClick={() => navigate("/myTickets")}
            className="mt-8 mb-5 w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <FormattedMessage
              id="support.mytickets"
              defaultMessage="My Tickets"
            />
          </button>
          {/* Formulaire */}
          <SupportForm />
        </div>
      </section>
    </>
  );
};

const SupportForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-8">
      <div className="mb-4">
        <label
          htmlFor="requestType"
          className="block text-gray-700 font-bold mb-2"
        >
          <FormattedMessage
            id="support.typeRequest"
            defaultMessage="Choose a request type:"
          />
        </label>
        <select
          id="requestType"
          {...register("requestType", { required: true })}
          className="appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">
            <FormattedMessage
              id="support.selectRequest"
              defaultMessage="Select a request type:"
            />
          </option>
          <option value="recovery">
            <FormattedMessage
              id="support.accountRecovery"
              defaultMessage="Account Recovery"
            />
          </option>
          <option value="technical">
            <FormattedMessage
              id="support.techIssues"
              defaultMessage="Technical Issues (crash, error message)"
            />
          </option>
          <option value="account">
            <FormattedMessage
              id="support.accountManagement"
              defaultMessage="
              Account Management (deletion request)"
            />
          </option>
        </select>
        {errors.requestType && (
          <p className="text-red-500 text-sm mt-1">
            <FormattedMessage
              id="support.selectRequest"
              defaultMessage="Select a request type:"
            />{" "}
          </p>
        )}
      </div>

      {/* Sujet */}
      <div className="mb-4">
        <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">
          <FormattedMessage id="support.subject" defaultMessage="Subject:" />
        </label>
        <input
          id="subject"
          {...register("subject", { required: true })}
          type="text"
          className="appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1">
            {" "}
            <FormattedMessage
              id="support.asksubject"
              defaultMessage="Subject cannot be empty:"
            />
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          <FormattedMessage
            id="support.description"
            defaultMessage="Description"
          />
        </label>
        <textarea
          id="description"
          {...register("description", { required: true })}
          className="appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            <FormattedMessage
              id="support.askdescription"
              defaultMessage="Description cannot be empty:"
            />
          </p>
        )}
      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white  w-2/6  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <FormattedMessage
            id="support.submitRequest"
            defaultMessage="Submit Request"
          />
        </button>
      </div>
    </form>
  );
};

export default Support;
