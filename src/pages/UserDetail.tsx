import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faArrowLeft,
  faCircleUser,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import MainNavigation from "../navigation/MainNavigation";
import logo from "../assets/GeekUp_Logo.jpg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //  State 
  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  //  Set Document Title 
  useEffect(() => {
    if (id) {
      document.title = `#${id} Show User`;
    }
  }, [id]);

  //  Fetch User & Albums 
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);

        const [userRes, albumRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
          fetch("https://jsonplaceholder.typicode.com/albums"),
        ]);

        const userData = await userRes.json();
        const albumData = await albumRes.json();

        setUser(userData);
        setAlbums(albumData);
      } catch (err) {
        console.error("Failed to fetch user or albums", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);


  return (
    <MainNavigation>
      <div className="bg-gray-100 min-h-screen">
        {/*  Breadcrumb  */}
        <div className="text-sm text-gray-400 mb-2">
          <FontAwesomeIcon icon={faCircleUser} />{" "}
          <span
            className="hover:bg-gray-200 rounded-md cursor-pointer p-1"
            onClick={() => navigate("/users")}
          >
            Users
          </span>{" "}
          <span className="text-gray-700">/ Show</span>
        </div>

        {/*  Title & Back Button  */}
        <div className="flex items-center gap-4 mb-4">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-xl font-semibold">Show User</h1>
        </div>

        {/*  Card Container  */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-5xl text-blue-500 animate-spin mb-4"
              />
            </div>
          ) : (
            <div className="flex flex-col border border-gray-200 rounded-lg p-6 gap-4">
              {/*  User Info  */}
              <div className="flex gap-4 border-b border-gray-200 pb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user?.name || 'User'
                                  )}&background=random`}
                  alt="User Avatar"
                  className="h-8 w-8 object-fill rounded-full cursor-pointer"
                />
                <div>
                  <div className="text-lg mb-2 font-medium">{user?.name}</div>
                  <div className="cursor-pointer text-sm my-2 text-blue-600">
                    {user?.email}
                  </div>
                </div>
              </div>

              {/*  Album Table  */}
              <h2 className="text-xl font-semibold mt-3">Albums</h2>
              <div className="overflow-hidden rounded-t-lg">
                <Table className="overflow-x-hidden rounded-lg">
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="w-1/12">
                        <p className="text-sm font-semibold border-r border-gray-200">
                          ID
                        </p>
                      </TableCell>
                      <TableCell className="w-6/12">
                        <p className="text-sm font-bold text-gray-900 border-r border-gray-200">
                          Title
                        </p>
                      </TableCell>
                      <TableCell className="w-2/12">
                        <p className="text-sm font-bold text-gray-700">
                          Action
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {albums
                      .filter((album) => album.userId === user?.id)
                      .map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => navigate(`/albums/${row.id}`)}
                              variant="outlined"
                              startIcon={
                                <FontAwesomeIcon
                                  icon={faEye}
                                  style={{ fontSize: 14 }}
                                />
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
            </div>
          )}
        </div>
      </div>
    </MainNavigation>
  );
};

export default UserDetail;
