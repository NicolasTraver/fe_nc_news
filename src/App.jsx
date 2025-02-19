import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ArticleDetail from "./Pages/ArticleDetail";
import ArticleList from "./pages/ArticleList";
import Homepage from "./pages/Homepage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      {" "}
      {/*manage the history and navigation of your app, allowing you to control the browser's URL without reloading the page.*/}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:article_id" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
