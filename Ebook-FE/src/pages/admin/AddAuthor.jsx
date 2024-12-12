// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const AddAuthor = () => {
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic thêm tác giả
    const newAuthor = {
      name: authorName,
      bio: authorBio,
      avatar: authorAvatar,
    };
    console.log("Thêm tác giả:", newAuthor);
    // Reset form
    setAuthorName("");
    setAuthorBio("");
    setAuthorAvatar("");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Thêm tác giả mới
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Tên tác giả */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tên tác giả *
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Nhập tên tác giả"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Mô tả tác giả */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mô tả ngắn
          </label>
          <textarea
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            placeholder="Mô tả ngắn về tác giả"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
          />
        </div>

        {/* Hình ảnh đại diện */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Link ảnh đại diện
          </label>
          <input
            type="text"
            value={authorAvatar}
            onChange={(e) => setAuthorAvatar(e.target.value)}
            placeholder="Nhập link ảnh đại diện"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Nút Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm tác giả
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAuthor;
