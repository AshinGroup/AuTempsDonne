import React, { useState, useEffect } from "react";
import { Trash2, PenLine, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import DeleteModal from "../modals/deleteModal";
import PlanningUserModal from "../modals/planningUserModal";
import handleFetch from "../handleFetch";

const Planning = () => {
    const env_path = process.env.REACT_APP_API_PATH
    const [user, setUser] = useState([]);
    const [slectedEventIdForDelete, setSelectedEventIdForDelete] = useState(null);
    const [selectedUserIdForPlanning, setSelectedUserIdForPlanning] = useState(null);
    const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);

    const userId = sessionStorage.getItem("user_id") || "";

    const fetchUser = async () => {
        const url = `${env_path}/user/${userId}`;

        try {
            const data = await handleFetch(url);
            if (data) {
                setUser(data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const deleteEvent = async (eventId) => {
        const url = `${env_path}/user/${user.id}/event/${eventId}`;

        try {
            const response = await handleFetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response) {
                fetchUser();
                setSelectedEventIdForDelete(null);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleDeleteClick = (eventId) => {
        setSelectedEventIdForDelete(eventId);
    };

    const handlePlanningClick = (userId) => {
        setSelectedUserIdForPlanning(userId);
        setIsPlanningModalOpen(true);
    };

    // Refresh page when close planning modal
    useEffect(() => {
        if (!isPlanningModalOpen) {
            fetchUser();
        }
    }, [isPlanningModalOpen]);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <div className="flex justify-center w-full bg-gradient-to-t from-AshinBlue-light to-AshinBlue-dark mb-24">
                <main className="w-full bg-white">
                    <h1 className="text-3xl flex items-center justify-center my-2 mt-24 mb-4">
                        <FormattedMessage
                            id="planning.title"
                            defaultMessage="See My Planning"
                        />
                    </h1>
                    <div className="w-32 h-0.5 bg-black mx-auto mb-8"></div>
                    <div className="flex items-center justify-center px-5 py-4 mt-16">
                        <div className="flex items-center mr-8">
                            <div className="bg-gray-200 rounded-full p-4">
                                <span className="text-gray-800 font-semibold">
                                    <p><FormattedMessage
                                        id="planning.bubleTitle"
                                        defaultMessage="To see your planning, it's just here ..."
                                    /></p>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center ml-8">
                            <button
                                className="text-blue-500 hover:text-blue-800"
                                onClick={() => handlePlanningClick(userId)}
                            >
                                {<CalendarDays size={100} />}
                            </button>
                        </div>
                    </div>
                    <section className="pb-20 mt-40 mx-20">
                        <h3 className="text-3xl flex items-center my-5 ms-5">
                            <FormattedMessage
                                id="updateProfileModal.events"
                                defaultMessage="List of your events :"
                            />
                        </h3>
                        <div className="flex flex-col mt-5 border-b-4">
                            <ul className="flex flex-col text-xl">
                                <li className="py-2 mx-5">
                                    {user.events ? (
                                        <ul>
                                            {user.events.map((event, index) => (
                                                <li
                                                    key={index}
                                                    className="bg-AshinBlue p-2 border-0 rounded mb-4"
                                                >
                                                    <div className="font-bold text-xl pb-2 mb-2 border-b-2 border-white flex items-center justify-between text-white">
                                                        <span>{event.name}</span>
                                                        <button
                                                            className="me-5"
                                                            onClick={() => handleDeleteClick(event.id)}
                                                        >
                                                            <Trash2 size={30} className="hover:scale-110" />
                                                        </button>{" "}
                                                    </div>
                                                    <DeleteModal
                                                        open={slectedEventIdForDelete === event.id}
                                                        onClose={() => setSelectedEventIdForDelete(null)}
                                                        fetchUsers={() => deleteEvent(event.id)}
                                                    />{" "}
                                                    <p className="text-white">
                                                        <span className="font-semibold">
                                                            {" "}
                                                            <FormattedMessage
                                                                id="updateProfileModal.place"
                                                                defaultMessage="Place :"
                                                            />
                                                        </span>{" "}
                                                        <span className="italic"> {event.place}</span>
                                                    </p>
                                                    <p className="text-white">
                                                        <span className="font-semibold">
                                                            {" "}
                                                            <FormattedMessage
                                                                id="updateProfileModal.datetime"
                                                                defaultMessage="DateTime :"
                                                            />
                                                        </span>{" "}
                                                        <span className="italic"> {event.datetime}</span>
                                                    </p>
                                                    <p className="text-white">
                                                        <span className="font-semibold">
                                                            <FormattedMessage
                                                                id="updateProfileModal.description"
                                                                defaultMessage="Description :"
                                                            />
                                                        </span>{" "}
                                                        <span className="italic"> {event.description}</span>
                                                    </p>
                                                    <p className="text-white">
                                                        <span className="font-semibold">
                                                            <FormattedMessage
                                                                id="updateProfileModal.group"
                                                                defaultMessage="group :"
                                                            />
                                                        </span>{" "}
                                                        <span className="italic">
                                                            {" "}
                                                            {event.group === 1 ? (
                                                                <FormattedMessage
                                                                    id="event.activity"
                                                                    defaultMessage="Activity"
                                                                />
                                                            ) : event.group === 2 ? (
                                                                <FormattedMessage
                                                                    id="event.course"
                                                                    defaultMessage="Course"
                                                                />
                                                            ) : (
                                                                <FormattedMessage
                                                                    id="event.service"
                                                                    defaultMessage="Service"
                                                                />
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="text-white">
                                                        <span className="font-semibold">
                                                            <FormattedMessage
                                                                id="updateProfileModal.type"
                                                                defaultMessage="type :"
                                                            />
                                                        </span>{" "}
                                                        <span className="italic"> {event.type.name}</span>
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No events found</p>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </section>
                </main>
                {selectedUserIdForPlanning && (
                    <PlanningUserModal
                        PlanningModalOpen={selectedUserIdForPlanning === userId}
                        PlanningModalSetOpen={() => {
                            setSelectedUserIdForPlanning(null);
                            setIsPlanningModalOpen(false);
                        }}
                        user={user}
                        expanded={expanded}
                    />
                )}
            </div>
        </>
    );
};

export default Planning;
