import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import handleFetch from "../handleFetch";
import CollectsAndDeliveriesModal from "../modals/collectsAndDeliveriesModal";

const CollectsAndDeliveries = () => {
  const env_path = process.env.REACT_APP_API_PATH;
  const userId = sessionStorage.getItem("user_id") || "";

  const [collects, setCollects] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCollects = async () => {
    try {
      const data = await handleFetch(`${env_path}/collect`);
      if (data) {
        const currentDateTime = new Date().getTime();

        const filteredCollects = data.filter((collect) => {
          const parts = collect.datetime.split("/");
          if (parts.length !== 3) {
            return false;
          }

          const collectDay = parseInt(parts[0], 10);
          const collectMonth = parseInt(parts[1], 10) - 1;
          const collectYear = parseInt(parts[2], 10);

          const collectDate = new Date(
            collectYear,
            collectMonth,
            collectDay
          ).getTime();
          return collectDate > currentDateTime;
        });

        setCollects(filteredCollects);
      }
    } catch (error) {
      console.error("Error fetching collects:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const data = await handleFetch(`${env_path}/delivery`);
      if (data) {
        const currentDateTime = new Date().getTime(); // Get current timestamp
        setDeliveries(
          data.filter(
            (delivery) =>
              new Date(delivery.datetime).getTime() > currentDateTime
          )
        );
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  useEffect(() => {
    fetchCollects();
    fetchDeliveries();
  }, []);

  // ouvrir modal
  const openSignUpModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen p-8 pt-8 mx-6">
        <div className="flex mb-6 items-center">
          <h1 className="text-3xl font-bold flex-grow">
            <FormattedMessage
              id="cad.title"
              defaultMessage="Collects and Deliveries"
            />
          </h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="event.id" defaultMessage="ID" />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="event.type" defaultMessage="Type" />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="cad.date" defaultMessage="Date" />
                </th>
                <th className="p-4 w-2/5">
                  <FormattedMessage
                    id="cad.location"
                    defaultMessage="start location"
                  />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage
                    id="event.actions"
                    defaultMessage="Actions"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={`c-${delivery.id}`} className="border-b">
                  <td className="p-4">{delivery.id}</td>
                  <td className="p-4 ">
                    <p className="bg-blue-500 text-white rounded p-2 w-fit">
                      Delivery
                    </p>
                  </td>
                  <td className="p-4">
                    {format(new Date(delivery.datetime), "dd/MM/yyyy")}
                  </td>
                  <td className="p-4">
                    {delivery.locations[0].address}{" "}
                    {delivery.locations[0].zip_code}
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
                      onClick={() => openSignUpModal(delivery)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
              {collects.map((collect) => (
                <tr key={`c-${collect.id}`} className="border-b">
                  <td className="p-4">{collect.id}</td>
                  <td className="p-4">
                    <p className="bg-orange-500 text-white rounded p-2 w-fit">
                      Collect
                    </p>
                  </td>
                  <td className="p-4">{collect.datetime}</td>
                  <td className="p-4">
                    {collect.storage.warehouse.location.address}{" "}
                    {collect.storage.warehouse.location.zip_code}
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
                      onClick={() => openSignUpModal(collect)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedService && (
          <CollectsAndDeliveriesModal
            service={selectedService}
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            userId={userId}
          />
        )}
      </div>
    </>
  );
};

export default CollectsAndDeliveries;
