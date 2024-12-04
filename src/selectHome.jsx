import React, { useState } from "react";
import {
  Plus,
  Grid,
  List,
  MoreVertical,
  ChevronDown,
  Search,
} from "lucide-react";

const GoogleDocsHome = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [ownerFilter, setOwnerFilter] = useState("anyone");

  const recentDocs = [
    { id: 1, title: "Untitled document", lastOpened: "Dec 3, 2024" },
    {
      id: 2,
      title: "AWS Migration & Speed Optimization",
      lastOpened: "Nov 25, 2024",
    },
    { id: 3, title: "PDFSimpli WP Migrate Tasks", lastOpened: "Nov 20, 2024" },
  ];

  const templates = [
    { id: 1, title: "Project proposal", style: "Tropic" },
    { id: 2, title: "Meeting notes", style: "Modern Writer" },
    { id: 3, title: "Brochure", style: "Geometric" },
    { id: 4, title: "Newsletter", style: "Lively" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Start New Document Section */}
        <div className="mb-8">
          <h2 className="text-base mb-4">Start a new document</h2>
          <div className="flex gap-4">
            <div className="w-40 h-52 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col items-center justify-center border">
              <Plus className="w-10 h-10 text-blue-600" />
              <span className="mt-2 text-sm">Blank document</span>
            </div>
            {templates.map((template) => (
              <div
                key={template.id}
                className="w-40 h-52 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer overflow-hidden"
              >
                <div className="h-40 bg-gray-100"></div>
                <div className="p-2">
                  <div className="text-sm truncate">{template.title}</div>
                  <div className="text-xs text-gray-500">{template.style}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base">Recent documents</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Owned by {ownerFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 hover:bg-gray-100 rounded"
              >
                {viewMode === "grid" ? (
                  <Grid className="w-5 h-5" />
                ) : (
                  <List className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`grid ${viewMode === "grid" ? "grid-cols-4" : "grid-cols-1"} gap-4`}
          >
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Opened {doc.lastOpened}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDocsHome;
