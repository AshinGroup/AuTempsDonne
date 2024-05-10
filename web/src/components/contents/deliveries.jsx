import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Trash2, Map, Truck, Plane, Car, Train } from "lucide-react";
import { format } from "date-fns";

import AddDeliveryModal from "../modals/addDeliveryModal";
import handleFetch from "../handleFetch";
import DeleteModal from "../modals/deleteModal";
import SlotsDeliveryModal from "../modals/slotsDeliveryModal";
import ShowRoadmapModal from "../modals/showRoadmapModal";


const Deliveries = () => {
  const env_path = process.env.REACT_APP_API_PATH
  // Display the deliveries and Pagination
  const [deliveries, setDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const pageNumbers = [];
  const pagesToShow = 2;
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);

  const [AddModalOpen, AddModalSetOpen] = useState(false);
  const [slectedDeliveryIdForDelete, setSelectedDeliveryIdForDelete] =
    useState(null);
  const [SelectedDeliveryIdForSlots, setSelectedDeliveryIdForSlots] =
    useState(null);
  const [selectedDeliveryIdForRM, setSelectedDeliveryIdForRM] = useState(null);

  const fetchDeliveries = async () => {
    try {
      const data = await handleFetch(`${env_path}/delivery`);
      if (data) {
        setDeliveries(data);
        setMaxPages(1);
        // setDeliveries(data.deliveries);
        // setMaxPages(data.max_pages);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  // Remove a user from the API
  const deleteDelivery = async (deliveryId) => {
    try {
      const response = await handleFetch(
        `${env_path}/delivery/${deliveryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        // Refresh the users list and quit the modal
        fetchDeliveries();
        setSelectedDeliveryIdForDelete(null);
      }
    } catch (error) {
      console.error("Error deleting demand:", error);
    }
  };

  // Set the user id to delete
  const handleDeleteClick = (DeliveryId) => {
    setSelectedDeliveryIdForDelete(DeliveryId);
  };

  // Set the user id to show RM
  const handleRMClick = (DeliveryId) => {
    setSelectedDeliveryIdForRM(DeliveryId);
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchDeliveries();
  }, [currentPage]);

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 980);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  // Array of pagination [1,2,3,...,maxPages]
  let startPage = Math.max(currentPage - pagesToShow, 1);
  let endPage = Math.min(currentPage + pagesToShow, maxPages);
  if (startPage !== 1) {
    pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("...");
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < maxPages) {
    if (endPage < maxPages - 1) pageNumbers.push("...");
    pageNumbers.push(maxPages);
  }

  // Set the user id to update
  const handleSlotsClick = (DeliveryId) => {
    setSelectedDeliveryIdForSlots(DeliveryId);
  };

  return (
    <div className={`h-screen p-8 pt-8 ${expanded ? "mx-6" : "mx-1"}`}>
      <div className="flex mb-6 items-center">
        <h1
          className={`${
            expanded ? "text-3xl" : "text-2xl"
          } font-bold flex-grow`}
        >
          <FormattedMessage
            id="deliveries.deliveries"
            defaultMessage="Deliveries"
          />
        </h1>
        <button
          className={`text-base bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 ${
            expanded ? "py-3" : "py-2"
          } rounded transition hover:opacity-90 text-sm`}
          onClick={() => {
            AddModalSetOpen(true);
          }}
        >
          <FormattedMessage
            id="deliveries.genDelivery"
            defaultMessage="+ Generate a Delivery"
          />
        </button>
        <AddDeliveryModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={() => fetchDeliveries()}
        />
      </div>
      {/* List of Users */}
      <div className="overflow-x-auto">
        {/* Table of Users */}
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className={` p-4 w-1/12  max-w-xs text-center`}>
                {" "}
                <FormattedMessage id="deliveries.id" defaultMessage="ID" />
                <br />
                {!expanded && (
                  <span className="font-normal text-center text-sm text-gray-500">
                    <FormattedMessage
                      id="deliveries.datetime"
                      defaultMessage="Day of Delivery"
                    />
                  </span>
                )}
              </th>
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="deliveries.roadmap"
                  defaultMessage="Roadmap"
                />
              </th>
              {expanded && (
                <th className={` p-4 w-1/12 text-center max-w-xs`}>
                  {" "}
                  <FormattedMessage
                    id="deliveries.datetime"
                    defaultMessage="Day of Delivery"
                  />
                </th>
              )}{" "}
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="deliveries.assigned"
                  defaultMessage="Assigned"
                />
              </th>
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="deliveries.vehicle"
                  defaultMessage="Vehicle"
                />
              </th>
              <th className="w-1/12 text-center">
                {" "}
                <FormattedMessage id="users.actions" defaultMessage="Actions" />
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length > 0 &&
              deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  {/* ID */}
                  <td className="p-4 text-center">
                    {delivery.id}
                    <br />
                    {!expanded && (
                      <span className="text-gray-500 text-sm">
                        {format(new Date(delivery.datetime), "dd/MM/yyyy")}
                      </span>
                    )}
                  </td>

                  {/* Roadmap */}
                  <td className="p-4 text-center">
                    {/*delivery.roadmap ? delivery.roadmap : "WIP"*/}
                    <button
                      className=" hover:scale-110 text-AshinBlue"
                      onClick={() => handleRMClick(delivery.id)}
                    >
                      <Map size={23} />
                    </button>
                    <ShowRoadmapModal
                      open={selectedDeliveryIdForRM === delivery.id}
                      onClose={() => setSelectedDeliveryIdForRM(null)}
                      item={delivery}
                    />{" "}
                  </td>
                  {/* day of the delivery */}

                  {expanded && (
                    <td className="p-4 text-center">{delivery.datetime}</td>
                  )}
                  {/* max_slot */}
                  <td
                    className={` py-4 text-center ${
                      !expanded ? "text-sm" : ""
                    }`}
                  >
                    <button
                      className={`bg-gradient-to-tr text-white px-2 py-1 rounded hover:opacity-90 transition self-end  ${
                        delivery.user?.length != 0
                          ? "from-green-300 to-green-600"
                          : "from-red-300 to-red-600"
                      } `}
                      onClick={() => handleSlotsClick(delivery.id)}
                    >
                      {delivery.user?.length}
                    </button>
                    {SelectedDeliveryIdForSlots === delivery.id && (
                      <SlotsDeliveryModal
                        SlotsModalOpen={
                          SelectedDeliveryIdForSlots === delivery.id
                        }
                        SlotsModalSetOpen={() =>
                          setSelectedDeliveryIdForSlots(null)
                        }
                        event={delivery}
                        fetchUsers={fetchDeliveries}
                      />
                    )}
                  </td>
                  {/* Licence plate */}
                  <td className="p-4 text-center flex justify-center">
                    {delivery.vehicle.license_plate}{" "}
                    <div className="ms-2 pt-1 text-AshinBlue-dark">
                      {delivery.vehicle.type == 1 ? (
                        <Truck size={20} />
                      ) : delivery.vehicle.type == 2 ? (
                        <Train size={20} />
                      ) : delivery.vehicle.type == 3 ? (
                        <Car size={20} />
                      ) : (
                        <Plane size={20} />
                      )}
                    </div>
                  </td>
                  {/* Trash */}
                  <td className="p-4 text-center">
                    <button
                      className=" hover:scale-110 text-red-500"
                      onClick={() => handleDeleteClick(delivery.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                    <DeleteModal
                      open={slectedDeliveryIdForDelete === delivery.id}
                      onClose={() => setSelectedDeliveryIdForDelete(null)}
                      fetchUsers={() => deleteDelivery(delivery.id)}
                    />{" "}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {pageNumbers.map((pageNum, index) =>
          pageNum === "..." ? (
            <span key={index} className="mx-1 px-4 py-2">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              className={`mx-1 px-4 py-2  bg-gray-200 rounded bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark hover:text-white ${
                currentPage === pageNum
                  ? "from-AshinBlue-light to-AshinBlue-dark text-white"
                  : ""
              }`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Deliveries;
