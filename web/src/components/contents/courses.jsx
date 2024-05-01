import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import handleFetch from "../handleFetch";
import CourseModal from "../modals/courseModal";
import Footer from "../footer1";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(0);
    const pageNumbers = [];
    const pagesToShow = 2;
    const [searchInput, setSearchInput] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const intl = useIntl();

    const searchPlaceholder = intl.formatMessage({
        id: "event.searchPlaceholder",
        defaultMessage: "Search by title ...",
    });

    const fetchCourses = async () => {
        let url =
            searchInput !== ""
                ? `http://127.0.0.1:5000/api/event/page/${currentPage}/search/${searchInput}`
                : `http://127.0.0.1:5000/api/event/page/${currentPage}`;

        try {
            const data = await handleFetch(url);
            if (data) {
                setCourses(data.events.filter(event => event.group === 2));
                setMaxPages(data.max_pages);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
        if (e.keyCode === 13) {
            fetchCourses();
        }
    };

    const handleClickSearch = (e) => {
        if (e.type === "click" || e.keyCode === 13) fetchCourses();
    };

    useEffect(() => {
        fetchCourses();
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
    const openSignUpModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="h-screen p-8 pt-8 mx-6">
                <div className="flex mb-6 items-center">
                    <h1 className="text-3xl font-bold flex-grow">
                        <FormattedMessage
                            id="courses.title"
                            defaultMessage="Courses available"
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
                                <th className="p-4 w-1/3">
                                    <FormattedMessage id="event.title" defaultMessage="Title" />
                                </th>
                                <th className="p-4 w-1/3">
                                    <FormattedMessage id="event.type" defaultMessage="Type" />
                                </th>
                                <th className="p-4 w-1/3">
                                    <FormattedMessage
                                        id="event.dateTime"
                                        defaultMessage="Date & Time"
                                    />
                                </th>
                                <th className="p-4 w-1/3">
                                    <FormattedMessage
                                        id="event.location"
                                        defaultMessage="Location"
                                    />
                                </th>
                                <th className="p-4 w-1/3"><FormattedMessage id="event.actions" defaultMessage="Actions" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id} className="border-b">
                                    <td className="p-4">{course.name}</td>
                                    <td className="p-4">{course.type.name}</td>
                                    <td className="p-4">
                                        {format(new Date(course.datetime), "dd/MM/yy HH'H'mm")}
                                    </td>
                                    <td className="p-4">{course.place}</td>
                                    <td className="p-4">
                                        <button
                                            className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
                                            onClick={() => openSignUpModal(course)}
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
                {selectedCourse && (
                    <CourseModal
                    course={selectedCourse}
                        modalOpen={isModalOpen}
                        setModalOpen={setIsModalOpen}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default Courses;



/*
        -> update le front -> notamment location pas assez large

        -> implémenter le post pour s'inscrire a une course (formation / cours)

        -> bouton pr s'inscrire et autre bouton pr se désinscrire

        -> search by 'type' ?

        -> vérification ds la modal + les langues

*/