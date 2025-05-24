import MainNavigation from "../navigation/MainNavigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

const Users = () => {
  // State
  const [users, setUsers] = useState<User[]>([]); // Danh sách người dùng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const navigate = useNavigate(); // Điều hướng

  // Effect: Fetch users khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUsers(data); // Cập nhật danh sách người dùng
      } catch (err) {
        console.error("Failed to fetch users", err); // Xử lý lỗi khi fetch
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchUsers(); // Gọi hàm fetch khi component mount
  }, []); // Chạy effect chỉ khi component mount 

  // Hàm điều hướng tới chi tiết người dùng
  const handleUserClick = (userId: number) => {
    navigate(`/users/${userId}`); // Điều hướng tới trang chi tiết người dùng
  };

  return (
    <MainNavigation>
      {/* Đặt tiêu đề trang */}
      <title>Users</title>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <FontAwesomeIcon icon={faSpinner} className="text-5xl text-blue-500 animate-spin mb-4" />
        </div>
      ) : (
        // Main content when not loading
        <div className="overflow-x-auto">
          <h1 className="text-2xl font-bold mb-4">Users</h1>

          {/* Bảng người dùng */}
          <div className="overflow-hidden rounded-t-lg">
            <Table className="overflow-x-hidden bg-white shadow-sm">
              <TableHead>
                <TableRow className=" bg-gray-50 rounded-lg">
                    <TableCell className="w-1/12  ">
                      <p className="w-full text-sm font-semibold border-r border-gray-200">ID</p>
                    </TableCell>
                    <TableCell className="w-1/12">
                      <p className="text-sm font-bold text-gray-900 border-r border-gray-200 ">Avatar</p>
                    </TableCell>
                    <TableCell className="w-2/12">
                      <p className="text-sm font-bold text-gray-900 border-r border-gray-200 ">Name</p>
                    </TableCell>
                    <TableCell className="w-3/12">
                      <p className="text-sm font-bold text-gray-900 border-r border-gray-200 ">Email</p>
                    </TableCell>
                    <TableCell className="w-3/12">
                      <p className="text-sm font-bold text-gray-900 border-r border-gray-200 ">Phone</p>
                    </TableCell>
                    <TableCell className="w-1/12">
                      <p className="text-sm font-bold text-gray-900 border-r border-gray-200">Website</p>
                    </TableCell>
                    <TableCell className="w-1/12 ">
                      <p className="text-sm font-bold text-gray-700">Action</p>
                    </TableCell>
                  </TableRow>
              </TableHead>

              <TableBody>
                {users.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {/* ID */}
                    <TableCell>{row.id}</TableCell>

                    {/* Avatar */}
                    <TableCell>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`}
                        alt="User Avatar"
                        className="h-8 w-8 object-fill rounded-full cursor-pointer"
                      />
                    </TableCell>

                    {/* Name */}
                    <TableCell>{row.name}</TableCell>

                    {/* Email */}
                    <TableCell>
                      <p className="cursor-pointer text-blue-500 hover:text-blue-400">{row.email}</p>
                    </TableCell>

                    {/* Phone - mở app gọi điện nếu có hỗ trợ */}
                    <TableCell>
                      <p
                        className="cursor-pointer text-blue-500 hover:text-blue-400"
                        onClick={() => window.open(`tel:${row.phone}`, "_blank", "noopener,noreferrer")}
                      >
                        {row.phone}
                      </p>
                    </TableCell>

                    {/* Website - mở trang web */}
                    <TableCell>
                      <p
                        className="cursor-pointer text-blue-500 hover:text-blue-400"
                        onClick={() => window.open(`http://${row.website}`, "_blank", "noopener,noreferrer")}
                      >
                        {row.website}
                      </p>
                    </TableCell>

                    {/* Actions - nút Show */}
                    <TableCell>
                      <Button
                        onClick={() => handleUserClick(row.id)}
                        variant="outlined"
                        startIcon={<FontAwesomeIcon icon={faEye} style={{ fontSize: 14 }} />}
                        sx={{
                          minHeight: 28,
                          paddingY: 0.3,
                          paddingX: 1.2,
                          fontSize: 12,
                          backgroundColor: "white",
                          color: "black",
                          borderColor: "#d1d5dc",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#4096ff",
                            borderColor: "#4096ff",
                          },
                        }}
                      >
                        Show
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </MainNavigation>

  );
};

export default Users;
