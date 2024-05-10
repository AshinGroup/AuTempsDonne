import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import { Settings, Trash2, CalendarDays } from "lucide-react";

import DeleteModal from "../modals/deleteModal";
import AddPackageModal from "../modals/addStockModal";
import UpdateStockModal from "../modals/updateStockModal";
import handleFetch from "../handleFetch";

const Stock = () => {
  const env_path = process.env.REACT_APP_API_PATH
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

  const intl = useIntl();

  const searchPlaceholder = intl.formatMessage({
    id: "stock.searchPlaceholder",
    defaultMessage: "Search by Food ...",
  });

  // Fetch the stock from the API
  const fetchStock = async () => {
    const url =
      searchInput !== ""
        ? `${env_path}/package/page/${currentPage}/search/${searchInput}`
        : `${env_path}/package/page/${currentPage}`;

    try {
      const data = await handleFetch(url);
      if (data) {
        setStock(data.packages);
        setMaxPages(data.max_pages);
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  };

  // Remove a stock item from the API
  const deleteStock = async (stockId) => {
    const url = `${env_path}/package/${stockId}`;

    try {
      const response = await handleFetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        // Refresh the stock list and quit the modal
        fetchStock();
        setSelectedstockIdForDelete(null);
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
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
            id="stock.stockManagement"
            defaultMessage="stock Management"
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
            id="stock.addANewItem"
            defaultMessage="+ Add a new Item"
          />
        </button>
        <AddPackageModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={() => fetchStock()}
        />
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
              <th className="py-4">
                {" "}
                <FormattedMessage id="stock.foodName" defaultMessage="food" />
              </th>
              {expanded && (
                <th className=" ">
                  {" "}
                  <FormattedMessage id="stock.weight" defaultMessage="weight" />
                </th>
              )}
              <th className=" ">
                {" "}
                <FormattedMessage
                  id="stock.expiration_date"
                  defaultMessage="expiration_date"
                />
              </th>
              <th className=" ">
                {" "}
                <FormattedMessage
                  id="stock.storage_location"
                  defaultMessage="storage_location"
                />
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
              <tr key={sto.id} className="border-b">
                {/* food name & wright */}
                {expanded && (
                  <td className="flex flex-col py-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-normal">{sto.food.name}</span>
                    <span className="font-light text-gray-400">
                      {sto.food.category.name}
                    </span>
                  </td>
                )}{" "}
                {expanded && (
                  <td className="">
                    {sto.weight}{" "}
                    <FormattedMessage id="stock.kg" defaultMessage="Kg" />
                  </td>
                )}
                {!expanded && (
                  <td className="flex flex-col py-4">
                    <span className="font-normal">{sto.food.name}</span>
                    <span className="font-light text-gray-400">
                      {sto.weight}{" "}
                      <FormattedMessage id="stock.kg" defaultMessage="Kg" />
                    </span>
                  </td>
                )}
                <td
                  className={`max-w-xs whitespace-nowrap overflow-hidden text-ellipsis ${isExpired(
                    sto.expiration_date
                  )}`}
                >
                  {new Date(sto.expiration_date).toLocaleDateString("en-US")}
                </td>
                {/* storage location */}
                <td className=" max-w-xs  flex flex-col whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-normal">
                    {" "}
                    {sto.storage.name} {sto.storage.warehouse.name}{" "}
                  </span>
                  <span className="font-light text-gray-400">
                    {sto.storage.warehouse.location.address}{" "}
                    {sto.storage.warehouse.location.zip_code}{" "}
                  </span>
                </td>
                {/* actions */}
                <td>
                  {sto.food.name != null && (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handleUpdateClick(sto.id)}
                      >
                        {<Settings size={20} />}
                      </button>
                      {selectedstockIdForUpdate === sto.id && (
                        <UpdateStockModal
                          UpdateModalOpen={selectedstockIdForUpdate === sto.id}
                          UpdateModalSetOpen={() =>
                            setSelectedstockIdForUpdate(null)
                          }
                          stock={sto}
                          fetchUsers={() => fetchStock()}
                        />
                      )}
                      <button
                        className="text-red-600 hover:text-red-800 mr-2"
                        onClick={() => handleDeleteClick(sto.id)}
                      >
                        {<Trash2 size={20} />}
                      </button>
                      <DeleteModal
                        open={selectedstockIdForDelete === sto.id}
                        onClose={() => setSelectedstockIdForDelete(null)}
                        fetchUsers={() => deleteStock(sto.id)}
                      />{" "}
                    </>
                  )}
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

function isExpired(expiration_date) {
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const expiration = new Date(expiration_date);
  const differenceInDays = Math.round((expiration - today) / oneDay);

  if (differenceInDays > 14) {
    return "text-emerald-400";
  } else if (differenceInDays <= 14 && differenceInDays >= 0) {
    return "text-orange-300";
  } else {
    return "text-red-400";
  }
}

export default Stock;
