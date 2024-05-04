import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Video from "./pages/Video";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import useAuthStore from "./store/authStore";

const App = () => {
    const { authorized } = useAuthStore();

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/auth"
                        element={!authorized ? <Auth /> : <Navigate to="/" />}
                    />
                    <Route path="/video" element={<Home />} />
                    <Route path="/video/:videoKey" element={<Video />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route
                        path="/profile/:username/:videoKey"
                        element={<Video />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
