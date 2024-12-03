import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const materialIconsCDN = document.createElement("link");
materialIconsCDN.rel = "stylesheet";
materialIconsCDN.href =
  "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(materialIconsCDN);

const nunitoFont = document.createElement("link");
nunitoFont.rel = "stylesheet";
nunitoFont.href =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap";
document.head.appendChild(nunitoFont);

const MenuBar = () => (
  <div
    id="top-bar"
    className="menu-bar"
    style={{
      padding: "5px 10px",
      display: "flex",
      gap: "20px",
    }}
  >
    <span>File</span>
    <span>Edit</span>
    <span>View</span>
    <span>Insert</span>
    <span>Format</span>
    <span>Tools</span>
    <span>Extensions</span>
    <span>Help</span>
  </div>
);

// Update the styles
const customStyles = `
  #top-bar{
  background-color: #f8f9fa;
  border-bottom: none;
  }

  .ql-toolbar button.ql-undo:before {
      font-family: 'Material Icons';
      content: 'undo';
  }
  .ql-toolbar button.ql-redo:before {
      font-family: 'Material Icons';
      content: 'redo';
  }



  .menu-bar span {
    font-family: 'Nunito', sans-serif;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    color: #444;

  }

  .menu-bar span:hover {
    color: #1a73e8;
  }
  .ql-toolbar.ql-snow {
    box-shadow: none;
    border-top: none;
  }


`;

const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  ["undo", "redo"],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["link", "image", "video", "formula"],
  [{ header: "1" }, { header: "2" }],
  ["clean"],
  ["code"],
  [{ table: [] }],
  ["emoji"],
];

export default function Editor() {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
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
          stackType: "user",
        },
        table: true,
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true,
      },
      debug: "info",
      bounds: editor,
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return (
    <div>
      <MenuBar />
    </div>
  );
}
