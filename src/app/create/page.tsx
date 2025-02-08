"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createClient } from "../supabase/client";
import { useRouter } from "next/navigation";

export default function Create() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();
  const supaBase = createClient();
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { data } = await supaBase.storage
      .from("avatars")
      .upload(`public/${Date.now()}.jpg`, e.target.files![0]);
    setAvatar(data!.fullPath);
  };
  const handleSave = async () => {
    const { data, error } = await supaBase.from("users").insert([
      {
        name: name,
        email: email,
        age: age,
        avatar: avatar,
      },
    ]);
    window.location.reload();
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
    setName("");
    setEmail("");
    setAge("");
    setAvatar("");
    router.refresh();
  };

  return (
    <div className="h-[99%] border-3 bg-slate-100 border-black w-[400px] rounded-lg  p-3">
      <h1 className="text-4xl text-center mb-12">add user</h1>
      <div className="mx-auto w-[150px] h-[150px] rounded-full border-4 border-dashed border-black flex justify-center items-center mb-4">
        <label htmlFor="avatar">
          <svg
            className="w-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM13 9V16H11V9H6L12 3L18 9H13Z"></path>
          </svg>
          <input
            onChange={handleUpload}
            id="avatar"
            type="file"
            className="hidden"
          />
        </label>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-control mb-3"
        type="text"
        placeholder="name..."
      />
      <input
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="form-control mb-3"
        type="text"
        placeholder="age..."
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-control mb-3"
        type="text"
        placeholder="email..."
      />
      <button onClick={handleSave} className="btn btn-dark w-full">
        save
      </button>
    </div>
  );
}
