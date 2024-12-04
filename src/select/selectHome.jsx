import React from "react";
import {
  MoreVertical,
  Plus,
  Grid,
  TextQuote,
  Layout,
  ChevronDown,
} from "lucide-react";

const GoogleDocsPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl">Start a new document</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2">
            Template gallery <ChevronDown size={16} />
          </button>
          <MoreVertical />
        </div>
      </div>

      {/* Document Templates */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer">
          <div className="h-32 flex items-center justify-center border-b mb-4">
            <Plus className="text-blue-500" size={32} />
          </div>
          <p className="text-center">Blank document</p>
        </div>

        {[
          { title: "Project proposal", subtitle: "Tropic" },
          { title: "Project proposal", subtitle: "Spearmint" },
          { title: "Meeting notes", subtitle: "Modern Writer" },
          { title: "Brochure", subtitle: "Geometric" },
          { title: "Newsletter", subtitle: "Lively" },
          { title: "Business letter", subtitle: "Geometric" },
        ].map((template, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
          >
            <div className="h-32 bg-gray-100 mb-4"></div>
            <p className="font-medium">{template.title}</p>
            <p className="text-gray-500 text-sm">{template.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium">Recent documents</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2">
              Owned by anyone <ChevronDown size={16} />
            </button>
            <div className="flex gap-2">
              <Grid size={20} />
              <TextQuote size={20} />
              <Layout size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <div className="h-32 bg-gray-100 mb-4"></div>
              <p className="font-medium">Untitled document</p>
              <p className="text-gray-500 text-sm">Opened Dec 3, 2024</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleDocsPage;
