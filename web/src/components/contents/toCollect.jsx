import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";


const ToCollect = () => {
    // Display the events and Pagination
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(0);
    const pageNumbers = [];
    const pagesToShow = 2;
    const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
    const [searchInput, setSearchInput] = useState("");

    const intl = useIntl();
    const searchPlaceholder = intl.formatMessage({
        id: "event.searchPlaceholder",
        defaultMessage: "Search by title ...",
      });
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

    // Fetch the users when we change Page
    useEffect(() => {
        // fetchEvents();
      }, [currentPage]);

      
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.keyCode == 13) {
      fetchEvents();
    }
  };

  const handleClickSearch = (e) => {
    if (e.type == "click" || e.keyCode == 13) fetchEvents();
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
                id="tocollect.transport"
                defaultMessage="Transport Activity"
              />
            </h1>
            <button
              className={`text-base bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 ${
                expanded ? "py-3" : "py-2"
              } rounded transition hover:opacity-90 text-sm`}
            //   onClick={}
            >
              <FormattedMessage
                id="event.addATransportActivity"
                defaultMessage="+ Add a new Transport Activity"
              />
            </button>
            {/* <AddEventModal
              AddModalOpen={AddModalOpen}
              AddModalSetOpen={() => AddModalSetOpen(false)}
              fetchUsers={fetchEvents}
            /> */}
          </div>
          {/* Searchbar */}
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
          {/* List of Users */}
          <div className="overflow-x-auto">
            {/* Table of Users */}
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className={` p-4 w-1/12  max-w-xs`}>
                    {" "}
                    <FormattedMessage id="tocollect.category" defaultMessage="Category" />
                  </th>
                  <th className={` p-4 w-1/12 text-center max-w-xs`}>
                    {" "}
                    <FormattedMessage id="tocollect.stops" defaultMessage="Stops" />
                  </th>
                  {expanded && (
                    <th className="p-4 w-1/12 max-w-xs text-center">
                      {" "}
                      <FormattedMessage id="tocollect.date" defaultMessage="Date" />
                    </th>
                  )}{" "}
                  <th className="p-4 w-1/12 max-w-xs text-center">
                    {" "}
                    <FormattedMessage id="tocollect." defaultMessage="Slots" />
                  </th>
                  <th className="p-4 w-1/6 max-w-xs text-center">
                    {" "}
                    <FormattedMessage
                      id="tocollect.location"
                      defaultMessage="Location"
                    />
                  </th>
                  <th className="w-1/12">
                    {" "}
                    <FormattedMessage id="users.actions" defaultMessage="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                
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
}

export default ToCollect