import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faListAlt, faEye, faSpinner } from "@fortawesome/free-solid-svg-icons"
import MainNavigation from "../navigation/MainNavigation";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Album {
  userId: number;
  id: number;
  title: string;
}
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}



const AlbumDetail = () => {
     // Import các hook cần thiết
    const { id } = useParams<{ id: string }>(); // Lấy id từ URL
    const navigate = useNavigate(); // Điều hướng trang

    // State quản lý dữ liệu và trạng thái tải
    const [album, setAlbum] = useState<Album | null>(null);         // Dữ liệu album hiện tại
    const [user, setUser] = useState<User | null>(null);            // Thông tin người dùng của album
    const [photos, setPhotos] = useState<any[]>([]);                // Danh sách ảnh thuộc album
    const [loading, setLoading] = useState(true);                   // Trạng thái tải dữ liệu

    // Cập nhật tiêu đề trang khi có id
    useEffect(() => {
        if (id) {
            document.title = `#${id} Show Album`;
        }
    }, [id]);

    //Lấy dữ liệu từ API khi component được mount hoặc khi id thay đổi
    useEffect(() => {
        if (!id) return;

        const fetchAll = async () => {
            try {
                setLoading(true);

                // Lấy dữ liệu album
                const albumRes = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`);
                const albumData = await albumRes.json();
                setAlbum(albumData);

                // Lấy thông tin người dùng từ album
                const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${albumData.userId}`);
                const userData = await userRes.json();
                setUser(userData);

                // Lấy danh sách ảnh trong album
                const photoRes = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumData.id}/photos`);
                const photoData = await photoRes.json();
                setPhotos(photoData);

                } catch (err) {
                console.error("Failed to fetch data", err);
                } finally {
                setLoading(false);
                }
            };

        fetchAll();
    }, [id]);


    return (
    <MainNavigation>
        <title># {id} Show Albums</title>

        <div className="bg-gray-100 min-h-screen">
            {/* Breadcrumb navigation */}
            <div className="text-sm text-gray-400 mb-2">
            <FontAwesomeIcon icon={faListAlt} />
            <span
                className="hover:bg-gray-200 rounded-md cursor-pointer p-1"
                onClick={() => navigate("/albums")}
            >
                Albums
            </span>
            <span className="text-gray-700"> / Show</span>
            </div>

            {/* Page title and back button */}
            <div className="flex items-center gap-4 mb-4">
            <FontAwesomeIcon
                icon={faArrowLeft}
                className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
                onClick={() => window.history.back()}
            />
            <h1 className="text-xl font-semibold">Show Album</h1>
            </div>

            {/* Main album detail section */}
            <div className="bg-white rounded-lg shadow p-6">
            {loading ? (
                // Loading spinner when data is fetching
                <div className="flex justify-center items-center h-full">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-5xl text-blue-500 animate-spin mb-4"
                />
                </div>
            ) : (
                // Album content when data is ready
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                {/* User information section */}
                <div className="flex gap-4 border-b border-gray-200 pb-4">
                    <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                    )}&background=random`}
                    alt="User Avatar"
                    className="h-8 w-8 object-fill rounded-full cursor-pointer"
                    />
                    <div>
                    <div
                        className="text-lg mb-2 font-medium text-blue-600 hover:text-blue-400 hover:cursor-pointer"
                        onClick={() => navigate(`/users/${user?.id}`)}
                    >
                        {user?.name}
                    </div>
                    <div className="cursor-pointer text-sm my-2 text-blue-600">
                        {user?.email}
                    </div>
                    </div>
                </div>

                {/* Album title */}
                <h2 className="text-xl font-semibold mt-6 mb-4">{album?.title}</h2>

                {/* Photo grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {photos.map((photo) => (
                    <div key={photo.id} className="relative group w-full">
                        <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="w-full h-auto object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 flex items-center justify-center text-white text-sm font-medium rounded transition-opacity duration-200">
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Preview
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}
            </div>
        </div>
    </MainNavigation>
  );
};

export default AlbumDetail;
