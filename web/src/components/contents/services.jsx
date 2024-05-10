import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import handleFetch from "../handleFetch";
import ServiceModal from "../modals/serviceModal";
import Footer from "../footer1";

const Services = () => {
    const env_path = process.env.REACT_APP_API_PATH
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(0);
    const pageNumbers = [];
    const pagesToShow = 2;
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
                ? `${env_path}/event/page/${currentPage}/search/${searchInput}`
                : `${env_path}/event/page/${currentPage}`;

        try {
            const data = await handleFetch(url);
            if (data) {
                setServices(data.events.filter(event => event.group === 3));
                setMaxPages(data.max_pages);
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
    }, [currentPage]);

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
                                <th className="p-4 w-1/5"><FormattedMessage id="event.actions" defaultMessage="Actions" /></th>
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
                <div className="flex justify-center mt-4">
                    {pageNumbers.map((pageNum, index) =>
                        pageNum === "..." ? (
                            <span key={index} className="mx-1 px-4 py-2">
                                ...
                            </span>
                        ) : (
                            <button
                                key={pageNum}
                                className={`mx-1 px-4 py-2  bg-gray-200 rounded bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark hover:text-white`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        )
                    )}
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
            <Footer />
        </>
    );
};

export default Services;

/*

        -> search by 'type' ?

*/
