import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import { Settings, Trash2, CalendarDays } from "lucide-react";

import DeleteModal from "../modals/deleteModal";
import AddShopModal from "../modals/addShopModal";
import UpdateShopModal from "../modals/updateShopModal";

const Stock = () => {
  const [stock, setStock] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const pageNumbers = [];
  const pagesToShow = 2;
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
  const [searchInput, setSearchInput] = useState("");

  const [selectedstockIdForDelete, setSelectedstockIdForDelete] =
    useState(null);
  const [AddModalOpen, AddModalSetOpen] = useState(false);
  const [selectedstockIdForUpdate, setSelectedstockIdForUpdate] =
    useState(null);

  // Fetch the users from the API
  const fetchStock = () => {
    // let url =
    //   searchInput != ""
    //     ? `http://127.0.0.1:5000/api/package/page/${currentPage}/search/${searchInput}`
    //     : `http://127.0.0.1:5000/api/package/page/${currentPage}`;
    let url = "http://127.0.0.1:5000/api/package";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setStock(data);
        // setMaxPages(data.max_pages);
        setMaxPages(1);
      })
      .catch((error) => {
        console.error("Error fetching stock:", error);
      });
  };

  // Remove a user from the API
  const deleteStock = (stockId) => {
    fetch(`http://127.0.0.1:5000/api/stock/${stockId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Refresh the users list and quit the modal
      fetchStock();
      setSelectedstockIdForDelete(null);
    });
  };

  // Set the Shop id to delete
  const handleDeleteClick = (stockId) => {
    setSelectedstockIdForDelete(stockId);
  };

  // Set the user id to update
  const handleUpdateClick = (stockId) => {
    setSelectedstockIdForUpdate(stockId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.keyCode == 13) {
      fetchStock();
    }
  };

  const handleClickSearch = (e) => {
    if (e.type == "click" || e.keyCode == 13) fetchStock();
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchStock();
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
          <FormattedMessage
            id="shops.shopsManagement"
            defaultMessage="Shops Management"
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
            id="shops.addANewShop"
            defaultMessage="+ Add a new Shop"
          />
        </button>
        <AddShopModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={fetchStock}
        />
      </div>
      {/* Searchbar */}
      <div className="flex gap-4 mb-6 items-stretch">
        <input
          type="text"
          // placeholder={searchPlaceholder}
          placeholder={"SearchPlacehodler"}
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
              <th className="py-4 ">
                {" "}
                <FormattedMessage id="shops.shopName" defaultMessage="Shop" />
              </th>
              {expanded && (
                <th>
                  {" "}
                  <FormattedMessage
                    id="shops.companyName"
                    defaultMessage="Company"
                  />
                </th>
              )}
              <th className="ps-3 ">
                {" "}
                <FormattedMessage id="shops.address" defaultMessage="Address" />
              </th>
              <th>
                {" "}
                <FormattedMessage id="users.actions" defaultMessage="actions" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* For each Shop ... */}
            {stock.map((sto) => (
              <tr key={sto.id}>{sto.food.name}</tr>
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

export default Stock;
