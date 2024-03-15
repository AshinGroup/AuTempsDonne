import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import { Settings, Trash2 } from "lucide-react";
import DeleteModal from "../modals/deleteModal";
import AddCourseModal from "../modals/addCourseModal";
import UpdateCourseModal from "../modals/updateCourseModal";
import SlotsCourseModal from "../modals/slotsCourseModal";

const Courses = () => {
  // Display the courses and Pagination
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const pageNumbers = [];
  const pagesToShow = 2;
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
  const [searchInput, setSearchInput] = useState("");

  // Handle all the modals
  const [slectedCourseIdForDelete, setSelectedCourseIdForDelete] =
    useState(null);
  const [AddModalOpen, AddModalSetOpen] = useState(false);
  const [SelectedCourseIdForUpdate, setSelectedCourseIdForUpdate] =
    useState(null);
  const [SelectedCourseIdForSlots, setSelectedCourseIdForSlots] =
    useState(null);
  const intl = useIntl();

  const searchPlaceholder = intl.formatMessage({
    id: "courses.searchPlaceholder",
    defaultMessage: "Search by title ...",
  });

  // Fetch the users from the API
  const fetchCourses = () => {
    // let url =
    //   searchInput != ""
    //     ? `http://127.0.0.1:5000/user/page/${currentPage}/search/${searchInput}`
    //     : `http://127.0.0.1:5000/user/page/${currentPage}`;
    // fetch(url)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setUsers(data.users);
    //     const usersLength = data.users.length;
    //     for (let i = 0; i < 10 - usersLength; i++) {
    //       data.users.push({
    //         id: `placeholder-${i}`,
    //         first_name: "",
    //         last_name: "",
    //         email: "",
    //         status: null,
    //         role: [],
    //       });
    //     }
    //     setMaxPages(data.max_pages);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching users:", error);
    //   });

    let courses_json = [
      {
        id: 1,
        title: "Introduction to Programming",
        description:
          "Learn the basics of programming with Python, covering variables, loops, and functions.",
        dateTime: "2024-03-20T10:00:00",
        maxSlot: 30,
        location: "Room 101, Tech Building",
        users: [
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
          {
            email: "alice@example.com",
            id: 1,
          },
          {
            email: "bob@example.com",
            id: 2,
          },
        ],
      },
      {
        id: 2,
        title: "Advanced Web Development",
        description:
          "Dive deep into web technologies with this course on React, Node.js, and MongoDB.",
        dateTime: "2024-03-22T14:00:00",
        maxSlot: 25,
        location: "Room 202, Tech Building",
        users: [
          {
            email: "alice@example.com",
            id: 3,
          },
          {
            email: "bob@example.com",
            id: 4,
          },
        ],
      },
      {
        id: 3,
        title: "Game Development",
        description:
          "Create your own games with Unity, covering 2D and 3D game development.",
        dateTime: "2024-01-25T17:20:00",
        maxSlot: 3,
        location: "Room 201, ARK Building",
        users: [
          {
            email: "freddy@example.com",
            id: 5,
          },
          {
            email: "Cait@example.com",
            id: 6,
          },
          {
            email: "Vi@example.com",
            id: 7,
          },
        ],
      },
    ];

    setCourses(courses_json);
    const coursesLength = courses.length;
    for (let i = 0; i < 10 - coursesLength; i++) {
      courses.push({
        id: coursesLength + i, // Assuming numerical IDs for simplicity
        title: `Placeholder Course ${i}`,
        description: "",
        dateTime: "",
        maxSlot: 0,
        location: "",
        users: [], // Keeping users array to match structure
      });
    }
    setMaxPages(1);

    console.log(courses);
  };

  // Remove a user from the API
  const deleteUser = (courseId) => {
    // fetch(`http://127.0.0.1:5000/user/${courseId}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((response) => {
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    // Refresh the users list and quit the modal
    fetchCourses();
    setSelectedCourseIdForDelete(null);
    // });
  };

  // Set the user id to delete
  const handleDeleteClick = (courseId) => {
    setSelectedCourseIdForDelete(courseId);
  };

  // Set the user id to update
  const handleUpdateClick = (courseId) => {
    setSelectedCourseIdForUpdate(courseId);
  };

  // Set the user id to update
  const handleSlotsClick = (courseId) => {
    setSelectedCourseIdForSlots(courseId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.keyCode == 13) {
      fetchCourses;
    }
  };

  const handleClickSearch = (e) => {
    if (e.type == "click" || e.keyCode == 13) fetchCourses();
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 740);
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
            id="courses.coursesManagement"
            defaultMessage="Courses Management"
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
            id="courses.addANewCourse"
            defaultMessage="+ Add a new course"
          />
        </button>
        <AddCourseModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={fetchCourses}
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
              <th className={` p-4 w-1/4  max-w-xs`}>
                {" "}
                <FormattedMessage id="courses.title" defaultMessage="Title" />
              </th>
              {expanded && (
                <th className="p-4 w-1/4 max-w-xs text-center">
                  {" "}
                  <FormattedMessage
                    id="courses.dateTime"
                    defaultMessage="Date & Time"
                  />
                </th>
              )}{" "}
              <th className="p-4 w-1/12 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="courses.maxSlots"
                  defaultMessage="Slots"
                />
              </th>
              <th className="p-4 w-1/4 max-w-xs text-center">
                {" "}
                <FormattedMessage
                  id="courses.location"
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
            {/* For each user ... */}
            {courses.map((course) => (
              <tr key={course.id} className="border-b">
                {/* title & dataTime */}
                {expanded && (
                  <td className="p-4 w-1/6 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    {course.title}
                  </td>
                )}{" "}
                {expanded && (
                  <td className={`text-center`}>
                    {" "}
                    {format(new Date(course.dateTime), "yy/MM/dd HH'H'mm ")}
                  </td>
                )}{" "}
                {!expanded && (
                  <td className="text-sm">
                    {course.title}
                    <br></br>
                    <span className="text-slate-500">
                      {" "}
                      {format(new Date(course.dateTime), "yy/MM/dd HH'H'mm ")}
                    </span>
                  </td>
                )}{" "}
                {/* max_slot */}
                <td
                  className={` py-4 text-center ${!expanded ? "text-sm" : ""}`}
                >
                  <button
                    className={`bg-gradient-to-tr text-white px-2 py-1 rounded hover:opacity-90 transition self-end  ${
                      course.users.length != course.maxSlot
                        ? "from-green-300 to-green-600"
                        : "from-red-300 to-red-600"
                    } `}
                    onClick={() => handleSlotsClick(course.id)}
                  >
                    {course.users.length}/{course.maxSlot}
                  </button>
                  {SelectedCourseIdForSlots === course.id && (
                    <SlotsCourseModal
                      SlotsModalOpen={SelectedCourseIdForSlots === course.id}
                      SlotsModalSetOpen={() =>
                        setSelectedCourseIdForSlots(null)
                      }
                      course={course}
                      fetchUsers={fetchCourses}
                    />
                  )}
                </td>
                {/* location */}
                <td
                  className={`py-4 text-center ${!expanded ? "text-sm" : ""}`}
                >
                  {course.location}
                </td>
                {/* actions */}
                <td>
                  {course.title != null && (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handleUpdateClick(course.id)}
                      >
                        {<Settings size={20} />}
                      </button>
                      {SelectedCourseIdForUpdate === course.id && (
                        <UpdateCourseModal
                          UpdateModalOpen={
                            SelectedCourseIdForUpdate === course.id
                          }
                          UpdateModalSetOpen={() =>
                            setSelectedCourseIdForUpdate(null)
                          }
                          course={course}
                          fetchUsers={fetchCourses}
                        />
                      )}
                      <button
                        className="text-red-600 hover:text-red-800 mr-2"
                        onClick={() => handleDeleteClick(course.id)}
                      >
                        {<Trash2 size={20} />}
                      </button>
                      <DeleteModal
                        open={slectedCourseIdForDelete === course.id}
                        onClose={() => setSelectedCourseIdForDelete(null)}
                        fetchUsers={() => deleteUser(course.id)}
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

export default Courses;
