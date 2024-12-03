const PageEditor = () => {
  const [pages, setPages] = useState([{ id: 1, content: "" }]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="document-container">
      <div className="pages-sidebar">
        <div className="sidebar-header">
          <span>Document tabs</span>
          <button
            onClick={() =>
              setPages([...pages, { id: pages.length + 1, content: "" }])
            }
          >
            +
          </button>
        </div>
        {pages.map((page) => (
          <div
            key={page.id}
            className={`page-tab ${currentPage === page.id ? "active" : ""}`}
            onClick={() => setCurrentPage(page.id)}
          >
            <span className="tab-icon">📄</span>
            Tab {page.id}
          </div>
        ))}
      </div>
      <div className="editor-section">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`editor-page ${currentPage === page.id ? "visible" : "hidden"}`}
          >
            <QuillEditor pageId={page.id} />
          </div>
        ))}
      </div>
    </div>
  );
};
