import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import MenuBar from "./TopVar.jsx";

// Styles remain the same...

const PAGE_HEIGHT = 1056; // Standard US Letter size in pixels
const PAGE_PADDING = 60;

const SideBar = ({ pages, currentPage }) => (
  <div
    className="sidebar"
    style={{
      width: "250px",
      backgroundColor: "#f8f9fa",
      borderRight: "1px solid #e0e0e0",
      padding: "20px",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      marginTop: "80px",
    }}
  >
    {pages.map((page, index) => (
      <div
        key={index}
        style={{
          padding: "10px",
          backgroundColor: currentPage === index ? "#e8f0fe" : "transparent",
          borderRadius: "4px",
          marginBottom: "8px",
          cursor: "pointer",
        }}
      >
        Page {index + 1}
      </div>
    ))}
  </div>
);

const Editor = () => {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();
  const [pages, setPages] = useState([{ content: "" }]);
  const [currentPage, setCurrentPage] = useState(0);

  // Previous socket and effect code remains the same...

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;
      wrapper.innerHTML = "";

      // Create container for pages
      const pagesContainer = document.createElement("div");
      pagesContainer.className = "pages-container";
      wrapper.append(pagesContainer);

      // Create first page
      const page = document.createElement("div");
      page.className = "page";
      page.style.height = `${PAGE_HEIGHT}px`;
      page.style.padding = `${PAGE_PADDING}px`;
      page.style.backgroundColor = "white";
      page.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";
      page.style.marginBottom = "20px";
      pagesContainer.append(page);

      const q = new Quill(page, {
        theme: "snow",
        modules: {
          toolbar: {
            container: TOOLBAR_OPTIONS,
            handlers: {
              undo: function () {
                this.quill.history.undo();
              },
              redo: function () {
                this.quill.history.redo();
              },
            },
          },
          history: {
            delay: 50,
            maxStack: 1000,
            userOnly: true,
          },
        },
        scrollingContainer: wrapper,
        bounds: page,
      });

      // Handle text overflow to create new pages
      q.on("text-change", () => {
        const content = q.getContents();
        const textLength = content.length();

        // Calculate if we need new pages based on content height
        const textHeight = q.scroll.height();
        const pagesNeeded = Math.ceil(
          textHeight / (PAGE_HEIGHT - PAGE_PADDING * 2),
        );

        if (pagesNeeded > pages.length) {
          setPages((prev) => [...prev, { content: "" }]);
        }
      });

      q.disable();
      q.setText("Loading...");
      setQuill(q);
    },
    [pages.length],
  );

  const containerStyles = {
    marginLeft: "250px",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    marginTop: "80px",
  };

  return (
    <>
      <MenuBar />
      <SideBar pages={pages} currentPage={currentPage} />
      <div style={containerStyles}>
        <div className="container" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default Editor;
