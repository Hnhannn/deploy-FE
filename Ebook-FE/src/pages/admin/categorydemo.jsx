// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from "axios";
// import { getAllCategory } from "../../service/API_Category_Service.jsx";


function Category() {
    const [categorys, setCategorys] = useState([]);
    const CATEGORY_URL = "http://localhost:8080/rest/category";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(CATEGORY_URL);
                const listCategorys = response.data;
                console.log("Giá trị của publishers respose:", response.data);
                if (listCategorys && Array.isArray(listCategorys)) {
                    setCategorys(listCategorys);
                } else {
                    console.warn("API không trả về danh sách nhà xuất bản hợp lệ.");
                }
            } catch (error) {
                console.error("Error fetching publishers:", error);
            }
        };
        fetchData();
    }, []);



    return (
        <div className="flex px-5">
            {/* Sidebar */}
            <div className="w-64">{/* Nội dung của sidebar */}</div>

            {/* Main content */}
            <div className="flex-1 mt-6">
                {/* Form input user */}
                <h2 className="text-xl font-semibold mb-4">Quản lý thể loại</h2>
                <div className="bg-gray-800 p-6">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-white">Tên thể loại</label>
                            <input type="text" placeholder="Nhập tên..." className="w-full p-2 bg-gray-700 border border-gray-300 rounded mt-1"/>
                        </div>

                        {/* <div>*/}
                        {/*   */}
                        {/*  <label className="block text-white">Tìm kiếm</label>*/}
                        {/*  <input type="text" placeholder="Nhập..." className=" p-2 bg-gray-700 border border-gray-300 rounded mt-1" />*/}
                        {/*  <button type="submit"  className="bi bi-search-heart"></button>*/}
                        {/*  */}
                        {/*</div>*/}


                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Thêm
                        </button>
                    </form>
                </div>

                {/* Table for listing users */}
                <div className="bg-gray-800 p-6 mt-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Danh sách thể loại</h2>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="">
                            <th className="px-4 py-2 text-left">Tên thể loại</th>
                            <th className="px-4 py-2 text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {categorys && categorys.length > 0 ? (
                            categorys.map((category, index) => (
                                <tr className="border-t" key={category.id || index}>
                                    <td className="px-4 py-2">{category.categoryName}</td>
                                    <td className="px-4 py-2 text-center">
                                        {/*<link*/}
                                        {/*    to="/publishers/${publisher.id}/edit"*/}
                                        {/*    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">*/}
                                        {/*  Sửa*/}
                                        {/*</link>*/}
                                        <button
                                            // onClick={() => handleDeletePublisher(publisher.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Author() {

    const [authors, setAuthors] = useState([]);
    const [newAuthor, setNewAuthor] = useState({ authorName: ''});
    const [editingAuthorID, setEditingAuthorID] = useState(null);
    const [error, setError] = useState("");


    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const data = await fetchAuthors();
                setAuthors(data);
                console.log(data); // Check the structure of the data
            } catch (error) {
                console.error('Error fetching authots:', error);
            }
        };

        loadAuthors();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAuthor({ ...newAuthor, [name]: value });
        setError("")
    };

    console.log(newAuthor)

    const handleaddOrUpdateAuthor = async (e) => {
        e.preventDefault();
        if (!name || name.trim() === "") {
            setError("Tên nhà xuất bản không được để trống.");
            return;
        }

        // Kiểm tra ký tự đặc biệt và số
        const regex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!regex.test(name)) {
            setError("Tên nhà xuất bản chỉ được chứa chữ cái và không được chứa số hoặc ký tự đặc biệt.");
            return;
        }

        // Kiểm tra trùng tên nhà xuất bản
        const isDuplicate = authors.some(
            (author) => author.authorName.toLowerCase() === name.trim().toLowerCase()
        );
        if (isDuplicate) {
            setError("Tên nhà xuất bản đã tồn tại. Vui lòng nhập tên khác.");
            return;
        }

        setError(""); // Xóa lỗi khi không có lỗi
        try {
            const data = await addOrUpdateAuthor(newAuthor, editingAuthorID);
            if (editingAuthorID) {
                setAuthors(authors.map(author => (author.authorID === editingAuthorID ? data : author)));
                toast.success('Cập nhật tác giả thành công!');
            } else {
                setAuthors([...authors, data]);
                toast.success('Thêm tác giả thành công!');
            }
            setEditingAuthorID(null);
        } catch (error) {
            console.error('Error adding or updating plan:', error);
            toast.error('Có lỗi xảy ra khi thêm hoặc cập nhật tác giả.');
        }
    };

    const handleEditAuthor   = (author) => {
        setNewAuthor({ authorName: author.authorName.toString() });
        setEditingAuthorID(author.authorID);
    };

    const handleDeleteAuthor = async (authorID) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa tác giả này không?');
        if (confirmDelete) {
            try {
                await deleteAuthor(authorID);
                setAuthors(authors.filter(author => author.authorID !== authorID));
                toast.success('Xóa tác giả thành công!');
            } catch (error) {
                console.error('Error deleting plan:', error);
                toast.error('Có lỗi xảy ra khi xóa gói cước.');
            }
        }
    };
    return (
        <div className="flex px-5">
            {/* Sidebar */}
            <div className="w-64">{/* Nội dung của sidebar */}</div>

            {/* Main content */}
            <div className="flex-1 mt-6">
                {/* Form input user */}
                <h2 className="text-xl font-semibold mb-4">Quản lý tác giả</h2>
                <div className="bg-gray-800 p-6">
                    <form className="space-y-4" onSubmit={handleaddOrUpdateAuthor}>
                        <div>
                            <label className="block text-white">Tên tác giả</label>
                            <input type="text" placeholder="Nhập tên tác giả"
                                   className={`w-full p-2 bg-gray-700 border border-gray-300 rounded mt-1 ${editingAuthorID !== null ? 'bg-gray-500' : 'bg-gray-700'}`}
                                   value={newAuthor.authorName}
                                   name="authorName"
                                   onChange={handleInputChange}
                                // required
                            />
                            {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {editingAuthorID ? 'Cập nhật tác giả' : 'Thêm tác giả'}
                        </button>

                    </form>
                </div>

                {/* Table for listing users */}
                <div className="bg-gray-800 p-6 mt-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Danh sách tác giả</h2>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="">
                            <th className="px-4 py-2 text-left">Tên tác giả</th>
                            <th className="px-4 py-2 text-center"></th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-600">
                        {authors.map((author) => (
                            <tr key={author.authorID}>

                                <td className="px-2 py-2 text-white">{author.authorName}</td>
                                <td className="px-2 py-2 text-white">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => handleEditAuthor(author)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDeleteAuthor(author.authorID)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Category;
