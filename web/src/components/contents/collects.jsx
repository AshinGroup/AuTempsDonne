import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Trash2, Map, Truck, Plane, Car, Train } from "lucide-react";
import { format } from "date-fns";

import AddCollectModal from "../modals/addCollectModal";
import handleFetch from "../handleFetch";
import DeleteModal from "../modals/deleteModal";
import SlotsCollectModal from "../modals/slotsCollectModal";
import ShowRoadmapModal from "../modals/showRoadmapModal";

const Collects = () => {
  // Display the collects and Pagination
  const [collects, setCollects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const pageNumbers = [];
  const pagesToShow = 2;
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);

  const [AddModalOpen, AddModalSetOpen] = useState(false);
  const [slectedCollectIdForDelete, setSelectedCollectIdForDelete] =
    useState(null);
  const [SelectedCollectIdForSlots, setSelectedCollectIdForSlots] =
    useState(null);
  const [selectedCollectIdForRM, setSelectedCollectIdForRM] = useState(null);

  const fetchCollects = async () => {
    try {
      const data = await handleFetch("http://127.0.0.1:5000/api/collect");
      if (data) {
        setCollects(data);
        setMaxPages(1);
        // setCollects(data.collects);
        // setMaxPages(data.max_pages);
      }
    } catch (error) {
      console.error("Error fetching collects:", error);
    }
  };

  // Remove a user from the API
  const deleteCollect = async (collectId) => {
    try {
      const response = await handleFetch(
        `http://127.0.0.1:5000/api/collect/${collectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        // Refresh the users list and quit the modal
        fetchCollects();
        setSelectedCollectIdForDelete(null);
      }
    } catch (error) {
      console.error("Error deleting demand:", error);
    }
  };

  // Set the user id to delete
  const handleDeleteClick = (CollectId) => {
    setSelectedCollectIdForDelete(CollectId);
  };

  // Set the user id to show RM
  const handleRMClick = (CollectId) => {
    setSelectedCollectIdForRM(CollectId);
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchCollects();
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
  const handleSlotsClick = (CollectId) => {
    setSelectedCollectIdForSlots(CollectId);
  };

  // Fetch the users when we change Page
  useEffect(() => {
    // fetchEvents();
  }, [currentPage]);

  return (
    <div className={`h-screen p-8 pt-8 ${expanded ? "mx-6" : "mx-1"}`}>
      <div className="flex mb-6 items-center">
        <h1
          className={`${
            expanded ? "text-3xl" : "text-2xl"
          } font-bold flex-grow`}
        >
          <FormattedMessage id="collects.collects" defaultMessage="Collects" />
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
            id="collects.genCollect"
            defaultMessage="+ Generate a Collect"
          />
        </button>
        <AddCollectModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={() => fetchCollects()}
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
                <FormattedMessage id="collects.id" defaultMessage="ID" />
                <br />
                {!expanded && (
                  <span className="font-normal text-center text-sm text-gray-500">
                    <FormattedMessage
                      id="collects.datetime"
                      defaultMessage="Day of Collect"
                    />
                  </span>
                )}
              </th>
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="collects.roadmap"
                  defaultMessage="Roadmap"
                />
              </th>
              {expanded && (
                <th className={` p-4 w-1/12 text-center max-w-xs`}>
                  {" "}
                  <FormattedMessage
                    id="collects.datetime"
                    defaultMessage="Day of Collect"
                  />
                </th>
              )}{" "}
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="collects.assigned"
                  defaultMessage="Assigned"
                />
              </th>
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="collects.vehicle"
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
            {collects.length > 0 &&
              collects.map((collect) => (
                <tr key={collect.id}>
                  {/* ID */}
                  <td className="p-4 text-center">
                    {collect.id}
                    <br />
                    {!expanded && (
                      <span className="text-gray-500 text-sm">
                        {collect.datetime}
                      </span>
                    )}
                  </td>
                  {/* Roadmap */}
                  <td className="p-4 text-center">
                    {/*collect.roadmap ? collect.roadmap : "WIP"*/}
                    <button
                      className=" hover:scale-110 text-AshinBlue"
                      onClick={() => handleRMClick(collect.id)}
                    >
                      <Map size={23} />
                    </button>
                    <ShowRoadmapModal
                      open={selectedCollectIdForRM === collect.id}
                      onClose={() => setSelectedCollectIdForRM(null)}
                      item={collect}
                    />{" "}
                  </td>
                  {/* day of the collect */}

                  {expanded && (
                    <td className="p-4 text-center">{collect.datetime}</td>
                  )}
                  {/* max_slot */}
                  <td
                    className={` py-4 text-center ${
                      !expanded ? "text-sm" : ""
                    }`}
                  >
                    <button
                      className={`bg-gradient-to-tr text-white px-2 py-1 rounded hover:opacity-90 transition self-end  ${
                        collect.user?.length != 0
                          ? "from-green-300 to-green-600"
                          : "from-red-300 to-red-600"
                      } `}
                      onClick={() => handleSlotsClick(collect.id)}
                    >
                      {collect.user?.length}
                    </button>
                    {SelectedCollectIdForSlots === collect.id && (
                      <SlotsCollectModal
                        SlotsModalOpen={
                          SelectedCollectIdForSlots === collect.id
                        }
                        SlotsModalSetOpen={() =>
                          setSelectedCollectIdForSlots(null)
                        }
                        event={collect}
                        fetchUsers={fetchCollects}
                      />
                    )}
                  </td>
                  {/* Licence plate */}
                  <td className="p-4 text-center flex justify-center">
                    {collect.vehicle.license_plate}{" "}
                    <div className="ms-2 pt-1 text-AshinBlue-dark">
                      {collect.vehicle.type == 1 ? (
                        <Truck size={20} />
                      ) : collect.vehicle.type == 2 ? (
                        <Train size={20} />
                      ) : collect.vehicle.type == 3 ? (
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
                      onClick={() => handleDeleteClick(collect.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                    <DeleteModal
                      open={slectedCollectIdForDelete === collect.id}
                      onClose={() => setSelectedCollectIdForDelete(null)}
                      fetchUsers={() => deleteCollect(collect.id)}
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

export default Collects;
