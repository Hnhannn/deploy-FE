import React from 'react';

function Role() {
    return (
        <div className="flex px-5">
            {/* Sidebar */}
            <div className="w-64">{/* Nội dung của sidebar */}</div>

            {/* Main content */}
            <div className="flex-1 mt-6">
                {/* Form input user */}
                <h2 className="text-xl font-semibold mb-4">Phân quyền</h2>
                <div className="bg-gray-800 p-6">
                    <form className="space-y-4" >
                        <div>
                            <p className="block text-white">Vai trò</p>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="true"
                                        className="mr-2"
                                    />
                                    Admin
                                </label>
                                <label className="ms-4">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="false"
                                        className="mr-2"
                                    />
                                    User
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4">
                            Cấp quyền
                        </button>
                    </form>
                </div>
            </div>
            <div className="bg-gray-800 p-6 mt-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Tên người dùng</th>
                            <th className="px-4 py-2 text-left">Vai trò</th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 text-left">User 1</td>
                            <td className="px-4 py-2 text-left">User</td>
                            <td>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                                    Sửa
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Role;