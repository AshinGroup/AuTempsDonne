import React, { useState, useEffect } from "react";
import handleFetch from "../components/handleFetch";
import atd_logo_typo from "../resources/atd_logo_typo.png";
import error404 from "../resources/404.png";
import { useNavigate } from "react-router-dom";

const ReceiptQR = () => {
  // Get the params of the URL
  // Template : http://localhost:3000/receiptQrCode?packages=[{'food_id':%201,%20'weight':%202,%20'description':%20'Coucou',%20'expiration_date':%20'2022-12-12'},%20{'food_id':%201,%20'weight':%202,%20'description':%20'Coucou',%20'expiration_date':%20'2022-12-12'}]&demand_id=1
  const [demand, setDemand] = useState({});
  const [collect, setCollect] = useState({});
  const [foods, setFoods] = useState([]);

  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const queryParameter = new URLSearchParams(window.location.search);
  const packages = queryParameter.get("packages");
  const demand_id = queryParameter.get("demand_id");
  const env_path = process.env.REACT_APP_API_PATH;

  const packagesDecoded = decodeURIComponent(packages);
  const packagesReplaced = packagesDecoded.replace(/'/g, '"');
  const packagesJson = JSON.parse(packagesReplaced);

  const navigate = useNavigate();

  const fetchDemand = async () => {
    try {
      const data = await handleFetch(`${env_path}/demand/${demand_id}`);
      if (data) {
        setDemand(data);
        setCollect(data.collect);
      }
    } catch (error) {
      console.error("Error fetching the demand:", error);
    }
  };

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await handleFetch(`${env_path}/food`);
        if (data) {
          setFoods(data);
        }
      } catch (error) {
        console.error("Error fetching the demand:", error);
      }
    };

    fetchFood();
    fetchDemand();
  }, []);

  const submitPackages = async () => {
    try {
      const response = await handleFetch(`${env_path}/package/qrcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storage_id: collect?.storage?.id,
          demand_id: demand.id,
          packages: packagesJson.map((packageItem) => ({
            food_id: packageItem.food_id,
            weight: packageItem.weight,
            description: `From demand ${demand.id} and collect ${collect.id}`,
            expiration_date: packageItem.expiration_date,
          })),
        }),
      });

      if (!response) {
        setResponseMessage(
          "An error occurred, please try again later or contact an admin."
        );
        setIsErrorMessage(false);
      } else {
        setResponseMessage("Packages successfully submitted!");
        setIsErrorMessage(true);
      }

      fetchDemand();
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseMessage("An error occurred, please contact a dev.");
      setIsErrorMessage(true);
    }
  };

  return (
    <div className="w-screen pt-20">
      <div className="flex flex-col w-full h-full justify-center items-center">
        <button className=" w-1/2 mb-10" onClick={() => navigate("/")}>
          <img
            className="hover:scale-105 transform transition duration-200 ease-in-out"
            src={atd_logo_typo}
            alt="Logo Typo"
          />
        </button>
        {!demand.id && (
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold">
              Unexpected Error, QR not recognized in our database, please try
              again later or contact an admin if the problem persists.
            </p>
            <img className="w-1/2" src={error404} alt="404_IMAGE" />
          </div>
        )}
        {demand.id && !collect?.id && (
          <div>
            <p className="text-center text-lg mb-5">
              <b>Demand is not assigned to a collect yet</b>
            </p>
            <p>
              <b>Additional informations :</b>{" "}
              {demand.additional
                ? demand.additional
                : "No additional informations"}
            </p>

            <button
              className="p-2 rounded bg-gray-500 text-white w-full mt-5 cursor-not-allowed"
              disabled
            >
              Package submission unavailable
            </button>

            <p className="mt-5 mb-2">
              <b>Packages :</b>
            </p>
            <ul className="border-2 border-AshinBlue ">
              {packagesJson.map((packageItem, index) => {
                const foodItem = foods.find(
                  (food) => food.id == packageItem.food_id
                );
                return (
                  <li
                    key={index}
                    className="pt-1 pb-2 ps-2 border-b-2 border-t-2 border-AshinBlue border-collapse"
                  >
                    <p>
                      <b>Food :</b>{" "}
                      {foodItem ? foodItem.name : "Couldn't Load Food Name"}
                    </p>
                    <p>
                      <b>Weight :</b> {packageItem.weight} Kg
                    </p>
                    <p>
                      <b>Expiration date :</b> {packageItem.expiration_date}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {demand.id && collect?.id && (
          <div>
            {responseMessage && (
              <p
                className={`text-center font-semibold pb-2 ${
                  isErrorMessage ? "text-green-400" : "text-red-400"
                }`}
              >
                {responseMessage}
              </p>
            )}
            <p className="text-center text-lg mb-5">
              <b>
                Demand assigned to collect n°{collect.id} {collect.datetime}
              </b>
            </p>
            <p>
              <b>Storage Location :</b> {collect.storage.name} ,{" "}
              {collect.storage.warehouse.name},{" "}
              {collect.storage.warehouse.location.address}{" "}
              {collect.storage.warehouse.location.postal_code}{" "}
              {collect.storage.warehouse.location.zip_code}
            </p>
            <p>
              <b>Vehicle :</b> {collect.vehicle.brand} -{" "}
              {collect.vehicle.license_plate}
            </p>
            <p>
              <b>Additional informations :</b>{" "}
              {demand.additional == null
                ? demand.additional
                : "No additional informations"}
            </p>
            {!demand.status ? (
              <button
                className="p-2 rounded bg-AshinBlue text-white w-full mt-5 hover:bg-AshinBlue-dark hover:scale-105 transform transition duration-200 ease-in-out"
                onClick={submitPackages}
              >
                Submit the packages
              </button>
            ) : (
              <button
                className="p-2 rounded bg-gray-500 text-white w-full mt-5 cursor-not-allowed"
                disabled
              >
                Packages already submitted
              </button>
            )}

            <p className="mt-5 mb-2">
              <b>Packages :</b>
            </p>
            <ul className="border-2 border-AshinBlue ">
              {packagesJson?.map((packageItem, index) => {
                const foodItem = foods.find(
                  (food) => food.id === packageItem.food_id
                );
                return (
                  <li
                    key={index}
                    className="pt-1 pb-2 ps-2 border-b-2 border-t-2 border-AshinBlue border-collapse"
                  >
                    <p>
                      <b>Food :</b> {foodItem ? foodItem.name : "Loading..."}
                    </p>
                    <p>
                      <b>Weight :</b> {packageItem.weight} Kg
                    </p>
                    <p>
                      <b>Expiration date :</b> {packageItem.expiration_date}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptQR;
