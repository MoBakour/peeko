import { format } from "date-fns";
import numeral from "numeral";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Loading from "../components/Loading";
import NotFound from "./NotFound";
import IconAccountCircleOutline from "../icons/IconAccountCircleOutline";
import IconPlay from "../icons/IconPlay";

const Card = ({ value, title, end = false }) => (
    <>
        <div className="flex flex-col justify-center items-center w-20">
            <p className="text-xl font-bold">{numeral(value).format("0a")}</p>
            <p className="text-sm text-fadingWhite">{title}</p>
        </div>
        {!end && <div className="w-[1px] h-[20px] bg-fadingWhite"></div>}
    </>
);

const Profile = () => {
    const { username } = useParams();
    const axios = useAxios();

    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const setCurrent = (index) => {
        sessionStorage.setItem("profileCurrent", index);
    };

    useEffect(() => {
        axios
            .get(`/user/get/${username}`)
            .then(({ data }) => {
                if (data.success) {
                    setUserData(data);

                    const profileVideoKeys = data.videoDocuments.map(
                        (doc) => doc.videoKey
                    );
                    sessionStorage.setItem(
                        "profileVideoKeys",
                        JSON.stringify(profileVideoKeys)
                    );
                    sessionStorage.setItem("profileCurrent", "0");
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [axios, username]);

    if (isLoading) {
        return <Loading />;
    } else if (!userData) {
        return <NotFound />;
    }

    return (
        <div className="bg-primary-3 min-h-screen py-10">
            <div className="text-white pb-10 flex flex-col justify-center items-center">
                <div className="profile-pic">
                    <span className="text-9xl">
                        <IconAccountCircleOutline />
                    </span>
                </div>

                <p className="font-bold text-2xl">{username}</p>

                <p className="text-xs p-2 text-fadingWhite">
                    Since{" "}
                    {format(userData.userDocument.createdAt, "MMMM d, yyyy")}
                </p>

                <div className="flex justify-center items-center p-2">
                    <Card
                        title="Videos"
                        value={userData.videoDocuments.length}
                    />
                    <Card title="Views" value={userData.totalViews} />
                    <Card
                        title="Likes"
                        value={userData.totalLikes}
                        end={true}
                    />
                </div>
            </div>

            <div className="sm:w-full w-5/6 max-w-[880px] mx-auto flex justify-center items-center flex-wrap gap-8">
                {userData.videoDocuments.length ? (
                    userData.videoDocuments.map((vid, index) => (
                        <Link
                            key={vid.videoKey}
                            to={`/profile/${username}/${vid.videoKey}`}
                            onClick={() => setCurrent(index)}
                            className="w-1/3 max-w-[200px] aspect-[2/3] relative rounded-lg overflow-hidden flex justify-center items-center cursor-pointer transition xhover:hover:scale-[.97]"
                        >
                            <img
                                src={`${process.env.REACT_APP_API_URL}/video/streamThumbnail/${vid.videoKey}`}
                                className="w-full"
                                alt="Thumbnail"
                            />

                            <div className="absolute bottom-0 w-full h-[40px] bg-gradient-to-t from-black to-transparent opacity-60"></div>
                            <div className="absolute top-0 w-full h-[40px] bg-gradient-to-b from-black to-transparent opacity-60"></div>

                            <div className="absolute bottom-1 left-1 drop-shadow-3xl text-white flex">
                                <span className="text-2xl">
                                    <IconPlay />
                                </span>
                                <p>{numeral(vid.viewsCount).format("0a")}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-fadingWhite text-xl">
                        No videos yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
