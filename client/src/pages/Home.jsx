import { useEffect } from "react";
import { useSwipe } from "../hooks/useSwipe";
import Loading from "../components/Loading";

const Home = () => {
    /**
     * Algorithm:
     *      user directed to home page
     *      fetch a list of video keys
     *      set session storage for keys
     *      redirect user to /video/[keys[0]]
     *      user clicks for next video
     *      check session storage for keys[current+1], storage as "result"
     *      redirect user to /video/[result]
     *      repeat...
     */

    const { swipe } = useSwipe();

    useEffect(() => {
        swipe("next");
    }, [swipe]);

    return <Loading />;
};

export default Home;
