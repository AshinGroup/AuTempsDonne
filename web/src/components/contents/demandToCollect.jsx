import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import { Trash2, QrCode } from "lucide-react";

import AddDemandModal from "../modals/addDemandModal";
import handleFetch from "../handleFetch";
import DeleteModal from "../modals/deleteModal";
import ShowQrModal from "../modals/showQrModal";

const DemandToCollect = () => {
  // Display the events and Pagination
  const [demands, setDemands] = useState([]);
  const [shopData, setShopData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const pageNumbers = [];
  const pagesToShow = 2;
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);

  const [AddModalOpen, AddModalSetOpen] = useState(false);
  const [selectedDemandIdForQR, setSelectedDemandIdForQR] = useState(null);

  const fetchDemands = async () => {
    const user_id = sessionStorage.getItem("user_id");
    const url = `http://127.0.0.1:5000/api/user/${user_id}`;
    try {
      const data = await handleFetch(url);
      if (data) {
        setShopData(data.shop);
        setDemands(data.shop.demands);
        setMaxPages(1);
        // setDemands(data.demands);
        // setMaxPages(data.max_pages);
      }
    } catch (error) {
      console.error("Error fetching demands:", error);
    }
  };

  // Set the user id to show QR
  const handleQRClick = (DemandId) => {
    setSelectedDemandIdForQR(DemandId);
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchDemands();
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

  return (
    <div className={`h-screen p-8 pt-8 ${expanded ? "mx-6" : "mx-1"}`}>
      <div className="flex mb-6 items-center">
        <h1
          className={`${
            expanded ? "text-3xl" : "text-2xl"
          } font-bold flex-grow`}
        >
          {shopData.name}{" "}
          <span className="text-gray-400">
            {shopData?.location?.address} {shopData?.location?.zip_code}
          </span>
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
            id="demands.addADemand"
            defaultMessage="+ Add a new demand"
          />
        </button>
        <AddDemandModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={() => fetchDemands()}
          shopData={shopData}
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
                <FormattedMessage id="demands.name" defaultMessage="ID" />
                <br />
                {!expanded && (
                  <span className="font-normal text-center text-sm text-gray-500">
                    <FormattedMessage
                      id="demands.limitDate"
                      defaultMessage="Limited Date"
                    />
                  </span>
                )}
              </th>
              {expanded && (
                <th className={` p-4 w-1/12 text-center max-w-xs`}>
                  {" "}
                  <FormattedMessage
                    id="demands.limitDate"
                    defaultMessage="Limited Date"
                  />
                  <br />
                  <span className="font-normal text-sm text-gray-500">
                    <FormattedMessage
                      id="demands.submittedDate"
                      defaultMessage="Submitted Date"
                    />
                  </span>
                </th>
              )}{" "}
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="demands.additional"
                  defaultMessage="Additional"
                />
              </th>
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage id="demands.status" defaultMessage="Status" />
              </th>
            </tr>
          </thead>
          <tbody>
            {demands?.map((demand) => (
              <tr key={demand.id}>
                <td className="p-4 text-center">
                  {demand.id}
                  <br />
                  {!expanded && (
                    <span className="text-gray-500 text-sm">
                      {format(new Date(demand.limit_datetime), "dd/MM/yyyy")}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {format(new Date(demand.limit_datetime), "dd/MM/yyyy")}
                  <br />
                  <span className="text-gray-500 text-sm">
                    {format(new Date(demand.submitted_datetime), "dd/MM/yyyy")}
                  </span>
                </td>
                <td className="p-4 text-center">{demand.additional}</td>
                {/* QR Code et Status */}
                <td className={`p-4 text-center`}>
                  <button
                    className={`hover:opacity-60 ${
                      demand.collect
                        ? demand.status
                          ? "text-green-500"
                          : "text-orange-500"
                        : "text-red-500"
                    }`}
                    onClick={() => handleQRClick(demand.id)}
                  >
                    <QrCode size={23} />
                  </button>
                  <ShowQrModal
                    open={selectedDemandIdForQR === demand.id}
                    onClose={() => setSelectedDemandIdForQR(null)}
                    item={demand}
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

export default DemandToCollect;
