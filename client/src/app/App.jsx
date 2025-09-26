import { BrowserRouter } from "react-router-dom";

import { AppProviders } from "./providers/AppProviders.jsx";
import { AppRoutes } from "./routes.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <AppProviders>
                <AppRoutes />
            </AppProviders>
        </BrowserRouter>
    );
};

export default App;
