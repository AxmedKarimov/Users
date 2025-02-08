"use client";  
import React, { useEffect, useState, ChangeEvent } from "react";  
import { createClient } from "../supabase/client";  
import Image from "next/image";  

interface User {  
  id: number;  
  name: string;  
  email: string;  
  age: string;  
  avatar: string;  
}  

export default function Users() {  
  const [users, setUsers] = useState<User[]>([]);  
  const [editingUser, setEditingUser] = useState<User | null>(null);  
  const supaBase = createClient();  

  const fetchData = async () => {  
    const { data, error } = await supaBase.from("users").select("*");  
    if (error) {  
      console.error("Error fetching data:", error.message);  
    } else {  
      setUsers(data as User[]);  
    }  
  };  

  useEffect(() => {  
    fetchData();  
  }, []);  

  const handleDelete = async (id: number) => {  
    const { error } = await supaBase.from("users").delete().eq("id", id);  
    if (error) {  
      console.error("Error deleting user:", error.message);  
    } else {  
      fetchData();  
    }  
  };  

  const handleEdit = (user: User) => {  
    setEditingUser(user);  
  };  

  const handleUpdate = async () => {  
    if (!editingUser) return;  
    const { id, name, email, age, avatar } = editingUser;  
    const { error } = await supaBase  
      .from("users")  
      .update({ name, email, age, avatar })  
      .eq("id", id);  
    if (error) {  
      console.error("Error updating user:", error.message);  
    } else {  
      setEditingUser(null);  
      fetchData();  
    }  
  };  

  const handleEditUpload = async (e: ChangeEvent<HTMLInputElement>) => {  
    const file = e.target.files?.[0];  
    if (!file || !editingUser) return;  

    const fileName = `public/avatar${Date.now()}.jpg`; // unique file name  
    const { error } = await supaBase.storage  
      .from("avatars")  
      .upload(fileName, file);  
      
    if (error) {  
      console.error("Error uploading file:", error.message);  
      return;  
    }  
    
    const { data: publicUrlData } = supaBase.storage  
      .from("avatars")  
      .getPublicUrl(fileName);  
      
    if (publicUrlData) {  
      const avatarUrl = publicUrlData.publicUrl;  
      setEditingUser({ ...editingUser, avatar: avatarUrl });  
    }  
  };  

  return (  
    <div className="border-3 bg-slate-100 border-black rounded-lg h-[99%] w-full p-3 overflow-auto">  
      <table className="table table-striped table-zebra w-full table-dark table-hover">  
        <thead>  
          <tr>  
            <th>№</th>  
            <th>Avatar</th>  
            <th>Name</th>  
            <th>Age</th>  
            <th>Email</th>  
            <th>Actions</th>  
          </tr>  
        </thead>  
        <tbody>  
          {users.map((user, i) =>  
            editingUser && editingUser.id === user.id ? (  
              <tr key={user.id}>  
                <td>{i + 1}</td>  
                <td>  
                  {editingUser.avatar && (  
                    <Image  
                      src={editingUser.avatar}  
                      alt="avatar"  
                      className="w-10 h-10 rounded-full"  
                      width={100}  
                      height={100}  
                    />  
                  )}  
                  <label className="btn btn-secondary btn-sm">  
                    Change Avatar  
                    <input  
                      type="file"  
                      onChange={handleEditUpload}  
                      className="d-none"  
                    />  
                  </label>  
                </td>  
                <td>  
                  <input  
                    type="text"  
                    className="form-control"  
                    value={editingUser.name}  
                    onChange={(e) =>  
                      setEditingUser({ ...editingUser, name: e.target.value })  
                    }  
                  />  
                </td>  
                <td>  
                  <input  
                    type="text"  
                    className="form-control"  
                    value={editingUser.age}  
                    onChange={(e) =>  
                      setEditingUser({ ...editingUser, age: e.target.value })  
                    }  
                  />  
                </td>  
                <td>  
                  <input  
                    type="email"  
                    className="form-control"  
                    value={editingUser.email}  
                    onChange={(e) =>  
                      setEditingUser({ ...editingUser, email: e.target.value })  
                    }  
                  />  
                </td>  
                <td>  
                  <button  
                    className="btn btn-sm btn-primary me-2"  
                    onClick={handleUpdate}  
                  >  
                    Update  
                  </button>  
                  <button  
                    className="btn btn-sm btn-secondary"  
                    onClick={() => setEditingUser(null)}  
                  >  
                    Cancel  
                  </button>  
                </td>  
              </tr>  
            ) : (  
              <tr key={user.id}>  
                <td>{i + 1}</td>  
                <td>  
                  <img  
                    src={user.avatar}  
                    alt="avatar"  
                    className="w-10 h-10 rounded-full"  
                  />  
                </td>  
                <td>{user.name}</td>  
                <td>{user.age}</td>  
                <td>{user.email}</td>  
                <td>  
                  <button  
                    className="btn btn-sm btn-primary me-2"  
                    onClick={() => handleEdit(user)}  
                  >  
                    Edit  
                  </button>  
                  <button  
                    className="btn btn btn-sm btn-danger"  
                    onClick={() => handleDelete(user.id)}  
                  >  
                    Delete  
                  </button>  
                </td>  
              </tr>  
            )  
          )}  
        </tbody>  
      </table>  
    </div>  
  );  
}