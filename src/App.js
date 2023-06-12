import { Routes, Route, BrowserRouter } from "react-router-dom";
import CoolMarksLayout, { NoMatch } from "./Pages/Layout";
import LinksPage from "./Pages/LinksPage";
import BulkAddPage from "./Pages/BulkAddPage";
import LoginPage from "./Pages/LoginPage";
import { useAPI } from "./api/apiClient";
import { useEffect } from "react";
import { linkSchema } from "./schema";

function App() {
  const { useResource, isLoggedIn, login } = useAPI("http://localhost:8000");
  const linksResource = useResource("links", linkSchema);

  useEffect(() => {
    if (isLoggedIn) {
      linksResource.refreshLinkStore();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage login={login} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoolMarksLayout />}>
            <Route
              index
              element={<LinksPage linksResource={linksResource} />}
            />
            <Route
              path="bulk_add"
              element={<BulkAddPage linksResource={linksResource} />}
            />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
