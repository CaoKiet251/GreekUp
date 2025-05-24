import React from "react";
import { useState, useEffect } from "react";
import MainNavigation from "../navigation/MainNavigation";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import {  Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faAngleLeft, faAngleRight, faAngleDown, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";

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

const Albums = () => {
  
  // Hook điều hướng
  const navigate = useNavigate();

  // Các tùy chọn phân trang
  const options = [10, 20, 50, 100];

  // STATE QUẢN LÝ UI 
  const [isOpen, setIsOpen] = useState(false);              // Trạng thái mở/đóng dropdown
  const [search, setSearch] = useState('');                 // Trạng thái ô tìm kiếm
  const containerRef = React.useRef<HTMLDivElement>(null); // Ref cho container dropdown

  // STATE LIÊN QUAN ĐẾN URL PARAM 
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy số lượng item trên mỗi trang từ URL hoặc mặc định là 20
  const [selected, setSelected] = useState(() => {
    const fromParams = Number(searchParams.get("pageSize"));
    return fromParams && options.includes(fromParams) ? fromParams : 20;
  });

  // Lấy trang hiện tại từ URL hoặc mặc định là trang 1
  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(searchParams.get("current"));
    return page && page > 0 ? page : 1;
  });

  // CONSTANT PHÂN TRANG 
  const ITEMS_PER_PAGE = selected;
  const totalItems = 100; // Giả định tổng số item là 100
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // STATE DỮ LIỆU 
  const [albums, setAlbums] = useState<Album[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // EFFECT: Đóng dropdown khi click ra ngoài 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // EFFECT: Fetch dữ liệu ban đầu 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumRes = await fetch("https://jsonplaceholder.typicode.com/albums");
        const albumData = await albumRes.json();
        setAlbums(albumData);

        const userRes = await fetch("https://jsonplaceholder.typicode.com/users");
        const userData = await userRes.json();
        setUsers(userData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    updateParams(currentPage, selected); // Cập nhật URL param ngay khi mount
  }, []);

  // HÀM HỖ TRỢ 
  const updateParams = (current: number, pageSize: number = selected) => {
    const params = new URLSearchParams();
    params.append("pageSize", pageSize.toString());
    params.append("current", current.toString());
    setSearchParams(params);
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateParams(page);
  };

  const handleLimitChange = (limit: number) => {
    setSelected(limit);
    setCurrentPage(1); // Reset về page 1 khi thay đổi limit
    updateParams(1, limit);
  };

  // DỮ LIỆU HIỂN THỊ 
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAlbums = albums.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <MainNavigation>
      <title>Albums</title>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <FontAwesomeIcon icon={faSpinner} className="text-5xl text-blue-500 animate-spin mb-4"/></div>
      ):(
       <div>
          <div className=" overflow-hidden rounded-t-lg">
            <Table className=" bg-white shadow-sm ">
              <TableHead>
                <TableRow className=" bg-gray-50 rounded-lg">
                  <TableCell className="w-1/12  ">
                    <p className="w-full text-sm font-semibold border-r border-gray-200">ID</p>
                  </TableCell>
                  <TableCell className="w-6/12">
                    <p className="text-sm font-bold text-gray-900 border-r border-gray-200 ">Title</p>
                  </TableCell>
                  <TableCell className="w-3/12">
                    <p className="text-sm font-bold text-gray-900 border-r border-gray-200">User</p>
                  </TableCell>
                  <TableCell className="w-2/12 ">
                    <p className="text-sm font-bold text-gray-700">Action</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAlbums.map((row) => (
                  <TableRow key={row.id} className=" hover:bg-gray-50">
                    <TableCell className="w-1/12 ">{row.id}</TableCell>
                    <TableCell className="w-6/12">{row.title}</TableCell>
                    <TableCell className="w-3/12">
                      <div className="flex items-center space-x-2">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    users.find((u) => u.id === row.userId)?.name || 'User'
                                  )}&background=random`}
                        alt="User Avatar"
                        className="h-8 w-8 object-fill rounded-full cursor-pointer"/>
                        <span className="text-blue-500 hover:text-blue-400 cursor-pointer"
                          onClick={() => navigate(`/users/${row.userId}`)}
                        > {users.find((u) => u.id === row.userId)?.name}</span>                      
                      </div>
                    </TableCell>

                    <TableCell className="w-2/12 ">
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/albums/${row.id}`)}
                        startIcon={
                          <FontAwesomeIcon icon={faEye} style={{ fontSize: 14 }} /> 
                        }
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
            <div className="flex mt-8 justify-end">
            <button
                onClick={() =>
                  handlePageChange(Math.max(currentPage - 1, 1))
                }
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1 ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:bg-gray-200"
                } relative inline-flex items-center justify-center h-8 w-8 rounded-sm mx-1`}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index} onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center h-8 w-8 mx-1 text-center rounded-sm justify-center text-sm font-medium cursor-pointer ${
                    currentPage === index + 1
                      ? "z-10 bg-blue-50 border border-blue-500 text-blue-700"
                      : " text-black hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`${
                  currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:bg-gray-200"
                } relative inline-flex items-center justify-center h-8 w-8 rounded-sm mx-1`}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>

              <div className="relative w-28" ref={containerRef}>
                <div className="relative">
                  {isOpen ? (
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => {
                        setIsOpen(true);
                        setSearch('');
                      }}
                      placeholder={`${selected} / page`}
                      className="w-full h-8 px-3 text-sm rounded outline outline-gray-400 focus:outline-blue-500 hover:outline-blue-500"
                    />
                  ) : (
                    <p
                      className="flex items-center h-8 px-3 text-sm text-gray-800 rounded outline outline-gray-400 focus:outline-blue-500 hover:outline-blue-500"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      {selected} / page
                    </p>
                  )}
                  <FontAwesomeIcon
                    icon={isOpen ? faSearch : faAngleDown}
                    style={{ fontSize: 12 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
                {isOpen && (
                  <ul className="absolute text-sm py-1 bottom-full mb-1 w-full bg-white rounded-lg shadow-xl border border-gray-50 max-h-60 overflow-auto z-10">
                    {options
                      .filter((o) => o.toString().includes(search))
                      .map((o, i) => (
                        <li
                          key={i}
                        onClick={() => {
                            handleLimitChange(o);
                            setIsOpen(false);
                        }}
                          className={`cursor-pointer rounded-md mx-1 p-2 hover:bg-gray-200 ${
                            selected === o ? 'bg-blue-100 font-semibold' : ''
                          }`}
                        >
                          {o} / page
                        </li>
                      ))}
                  </ul>
                )}
              </div>

            </div>
        </div>)}
    </MainNavigation>

  );
}
export default Albums;