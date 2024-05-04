import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import useDataStore from "../store/dataStore";
import IconAccountCircleOutline from "../icons/IconAccountCircleOutline";

const VideoStamps = ({ viewMode }) => {
    const { uploaderUsername, timestamp } = useDataStore();

    return (
        <div
            className={`flex justify-center items-center gap-2 ${
                viewMode === "view-mode" ? "absolute bottom-3 left-3" : ""
            }`}
        >
            <Link to={`/profile/${uploaderUsername}`}>
                <span className="drop-shadow-3xl text-5xl select-none">
                    <IconAccountCircleOutline />
                </span>
            </Link>

            <div>
                <Link to={`/profile/${uploaderUsername}`}>
                    <p className="font-bold text-lg drop-shadow-3xl">
                        {uploaderUsername}
                    </p>
                </Link>

                <p className="text-sm text-fadingWhite drop-shadow-3xl">
                    {formatDistanceToNow(new Date(timestamp), {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </div>
    );
};

export default VideoStamps;
