import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import handleFetch from "../handleFetch";
import ServiceModal from "../modals/serviceModal";

const Services = () => {
  const env_path = process.env.REACT_APP_API_PATH;
  const [services, setServices] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = sessionStorage.getItem("user_id") || "";

  const intl = useIntl();

  const searchPlaceholder = intl.formatMessage({
    id: "event.searchPlaceholder",
    defaultMessage: "Search by title ...",
  });

  const fetchServices = async () => {
    let url =
      searchInput !== ""
        ? `${env_path}/event/search/${searchInput}`
        : `${env_path}/event`;

    try {
      const data = await handleFetch(url);
      if (data) {
        const currentDateTime = new Date().getTime(); // Get current timestamp
        if (searchInput !== "") {
          setServices(
            data.events.filter(
              (event) =>
                event.group === 1 &&
                new Date(event.datetime).getTime() > currentDateTime
            )
          );
        } else {
          setServices(
            data.filter(
              (event) =>
                event.group === 1 &&
                new Date(event.datetime).getTime() > currentDateTime
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.keyCode === 13) {
      fetchServices();
    }
  };

  const handleClickSearch = (e) => {
    if (e.type === "click" || e.keyCode === 13) fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ouvrir modal
  const openSignUpModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="h-screen p-8 pt-8 mx-6">
        <div className="flex mb-6 items-center">
          <h1 className="text-3xl font-bold flex-grow">
            <FormattedMessage
              id="serviceses.title"
              defaultMessage="Services available"
            />
          </h1>
        </div>
        <div className="flex gap-4 mb-6 items-stretch">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="p-2 border border-gray-300 rounded flex-grow focus:outline-none focus:border-AshinBlue transition"
            onChange={handleSearch}
            onKeyDown={handleClickSearch}
            value={searchInput}
          />
          <button
            className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
            onClick={handleClickSearch}
          >
            <FormattedMessage id="users.search" defaultMessage="Search" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="event.title" defaultMessage="Title" />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="event.type" defaultMessage="Type" />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage
                    id="event.dateTime"
                    defaultMessage="Date & Time"
                  />
                </th>
                <th className="p-4 w-2/5">
                  <FormattedMessage
                    id="event.location"
                    defaultMessage="Location"
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
              {services.map((service) => (
                <tr key={service.id} className="border-b">
                  <td className="p-4">{service.name}</td>
                  <td className="p-4">{service.type.name}</td>
                  <td className="p-4">
                    {format(new Date(service.datetime), "dd/MM/yy HH'H'mm")}
                  </td>
                  <td className="p-4">{service.place}</td>
                  <td className="p-4">
                    <button
                      className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
                      onClick={() => openSignUpModal(service)}
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
          <ServiceModal
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

export default Services;
