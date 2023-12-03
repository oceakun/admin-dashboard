"use client";

import React, { useState, useEffect } from "react";
import Paginator from "@/components/paginator";
import ToggleSwitch from "../../components/themeToggler";
import axios from "axios";
import { DeleteIcon } from "@/components/icons";
import { EditIcon } from "@/components/icons";
import { PersonIcon } from "@/components/icons";
import { SearchIcon } from "@/components/icons";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserTable = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(1);
  const [editedUser, setEditedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        )
        .then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data);
          setTotalUsers(res.data.length);
          setTotalPages(Math.ceil(res.data.length / 10));
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    console.log("page: ", page);
    setCurrentPage(page);
  };

  const handleSearch = () => {
    handlePageChange(1);
    const filterValue = filter.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(filterValue) ||
        user.email.toLowerCase().includes(filterValue) ||
        user.role.toLowerCase().includes(filterValue)
      );
    });
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / 10));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(
        filteredUsers
          .slice((currentPage - 1) * 10, currentPage * 10)
          .map((user) => user.id)
      );
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const deleteSelectedRecords = () => {
    const updatedUserList = filteredUsers.filter(
      (user) => !selectedUsers.includes(user.id)
    );

    setFilteredUsers(updatedUserList);
    setTotalPages(Math.ceil(updatedUserList.length / 10));
    setSelectedUsers([]);

    if (currentPage > Math.ceil(updatedUserList.length / 10)) {
      setCurrentPage(Math.ceil(updatedUserList.length / 10));
    }
  };

  const deleteRecord = (userId: string) => {
    const updatedUserList = filteredUsers.filter((user) => user.id !== userId);
    setFilteredUsers(updatedUserList);
    setTotalPages(Math.ceil(updatedUserList.length / 10));

    if (currentPage > Math.ceil(updatedUserList.length / 10)) {
      setCurrentPage(Math.ceil(updatedUserList.length / 10));
    }
  };

  const editRecord = (userId: string) => {
    const userToEdit = filteredUsers.find((user) => user.id === userId);
    if (userToEdit) {
      setEditedUser(userToEdit);
    }
    setEditingUserId(editingUserId === userId ? null : userId);
  };

  const saveChanges = (userId: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          name: editedUser.name,
          email: editedUser.email,
          role: editedUser.role,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditingUserId(null);
    setEditedUser({ id: "", name: "", email: "", role: "" });
  };

  const areAllPagesSelected = () => {
    const usersOnPage = filteredUsers.slice(
      (currentPage - 1) * 10,
      currentPage * 10
    );

    return usersOnPage.every((user) => selectedUsers.includes(user.id));
  };

  return (
    <div className="container mx-auto my-8 w-full px-4 pb-[60px]">
      {/* <div className=" flex flex-row justify-end items-center gap-4">
        <ToggleSwitch />
        <span className="rounded-full border-[#818cf8] border-[2px] ">
          <PersonIcon />
        </span>
      </div> */}

      {filteredUsers.length != 0 ? (
        <div className="my-8 md:flex-col flex flex-row md:justify-start md:items-center justify-between items-start md:gap-4">
          <div className="w-full flex flex-row justify-between items-center border rounded ">
            <input
              type="text"
              placeholder="Search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full focus:outline-none px-4 py-2 border-none rounded-md"
            />
            <button
              onClick={handleSearch}
              className="search-icon hover:bg-gray-50 px-4 py-2 border-none rounded-md bg-gray-100"
            >
              <SearchIcon />
            </button>
          </div>

          <div className="w-full flex md:flex-row-reverse md:justify-start md:items-center md:gap-4 flex-col justify-start items-end ">
            <button
              className="border-2 border-red-200 text-red-300 hover:border-red-400 hover:text-red-500 rounded px-2 py-[9px] text-[12px]"
              onClick={deleteSelectedRecords}
            >
              Delete Selected
            </button>

            <p className=" text-sm text-gray-400">
              ({selectedUsers.length} rows of {filteredUsers.length} selected)
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-y-auto w-full">
        {filteredUsers.length != 0 ? (
          <table className="rounded min-w-full shadow-xl border-b min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={areAllPagesSelected()}
                  />
                </th>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                  Name
                </th>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                  Email
                </th>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                  Role
                </th>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredUsers
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((user) => (
                  <tr
                    key={user.id}
                    className={`border-[1px] hover:bg-gray-50  ${
                      selectedUsers.includes(user.id) ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          className="p-2"
                          value={
                            editingUserId === user.id
                              ? editedUser.name
                              : user.name
                          }
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingUserId === user.id ? (
                        <input
                          type="email"
                          className="p-2"
                          value={
                            editingUserId === user.id
                              ? editedUser.email
                              : user.email
                          }
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          className="p-2"
                          value={
                            editingUserId === user.id
                              ? editedUser.role
                              : user.role
                          }
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              role: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.role
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {editingUserId != user.id && (
                        <button
                          className="edit shadow p-[4px] rounded mr-[20px]"
                          onClick={() => editRecord(user.id)}
                        >
                          <EditIcon />
                        </button>
                      )}
                      {editingUserId != user.id && (
                        <button
                          className="delete shadow p-[4px] rounded "
                          onClick={() => deleteRecord(user.id)}
                        >
                          <DeleteIcon />
                        </button>
                      )}

                      {editingUserId === user.id && (
                        <button
                          className="save border-[#22c55e] border-[1px] text-[#22c55e] rounded p-[2px] px-[6px] text-[14px]"
                          onClick={() => saveChanges(user.id)}
                        >
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 ">No records left</div>
        )}
      </div>

      <span className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
      {totalPages > 1 && (
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UserTable;
