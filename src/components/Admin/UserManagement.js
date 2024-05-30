import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, blockUser, unblockUser, deleteUser } from '../../firebase/services/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await updateUserRole(userId, !isAdmin);
      setUsers(users.map(user => user.id === userId ? { ...user, isAdmin: !isAdmin } : user));
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      setUsers(users.map(user => user.id === userId ? { ...user, isBlocked: true } : user));
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await unblockUser(userId);
      setUsers(users.map(user => user.id === userId ? { ...user, isBlocked: false } : user));
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">User Management</h2>
      <ul className="list-group">
        {users.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center mb-2">
            <span>
              {user.email} - {user.isAdmin ? 'Admin' : 'User'}
              {user.isBlocked && ' (Blocked)'}
            </span>
            <div>
              <button className="btn btn-primary mr-2" onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              {user.isBlocked ? (
                <button className="btn btn-warning mr-2" onClick={() => handleUnblockUser(user.id)}>Unblock</button>
              ) : (
                <button className="btn btn-danger mr-2" onClick={() => handleBlockUser(user.id)}>Block</button>
              )}
              <button className="btn btn-secondary" onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;