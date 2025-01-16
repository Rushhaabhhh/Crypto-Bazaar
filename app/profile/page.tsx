"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../_components/navbar';
import { Pencil } from 'lucide-react';

interface User {
  username: string;
  image: string;
  created_at: string;
  assets: { _id: string; title: string }[];
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
//   const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
//     return localStorage.getItem('backgroundImage');
//   });
// const [backgroundImage, setBackgroundImage] = useState<string | null>};
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isNameHovered, setIsNameHovered] = useState(false);
//   const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
//   const walletAddress = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') || '' : '';


const userId = typeof window !== 'undefined' ? "" : '';
const walletAddress = typeof window !== 'undefined' ? "" : '';


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setNewUsername(data.username);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setProfileImage(base64Image);

        try {
          const response = await fetch(`/api/update/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image, walletAddress }),
          });
          if (!response.ok) {
            throw new Error('Failed to update profile image.');
          }
        } catch (error) {
          console.error('Error updating profile image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        // setBackgroundImage(base64Image);
        localStorage.setItem('backgroundImage', base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = async () => {
    try {
      const response = await fetch(`/api/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername }),
      });
      if (!response.ok) {
        throw new Error('Failed to update username.');
      }
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleNameMouseEnter = () => setIsNameHovered(true);
  const handleNameMouseLeave = () => setIsNameHovered(false);

  if (!user) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="relative top-24">
        <div
          className="h-64 bg-cover bg-center relative group"
        //   style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <label htmlFor="background-input" className="cursor-pointer">
            <Pencil className="absolute inset-0 m-auto text-white cursor-pointer opacity-0 group-hover:opacity-80" size={40} />
          </label>
          <input
            id="background-input"
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            className="hidden"
          />
        </div>

        <div className="absolute top-28 left-8 flex flex-col items-center">
          <div className="relative group">
            <img
              src={profileImage || user.image}
              alt={`${user.username}'s profile`}
              className="h-44 w-44 rounded-full border-4 border-gray-900 shadow-lg"
            />
            <label htmlFor="profile-input" className="cursor-pointer">
              <Pencil className="absolute inset-0 m-auto text-white cursor-pointer opacity-0 group-hover:opacity-80" size={40} />
            </label>
            <input
              id="profile-input"
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
          </div>

          <div
            className="mt-2 text-white"
            onMouseEnter={handleNameMouseEnter}
            onMouseLeave={handleNameMouseLeave}
          >
            {isEditingName ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-gray-700 text-white rounded p-1 text-2xl font-bold"
                />
                <button
                  onClick={handleUsernameChange}
                  className="ml-2 text-green-400"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <h1 className="text-4xl font-bold">{newUsername}</h1>
                {isNameHovered && (
                  <Pencil
                    className="ml-2 text-white cursor-pointer"
                    size={20}
                    onClick={() => setIsEditingName(true)}
                  />
                )}
              </div>
            )}

            <div className="flex items-center space-x-6 mt-2">
              <p className="text-white text-lg">
                {walletAddress.slice(0, 5)}...{walletAddress.slice(-4)}
              </p>
              <p className="text-gray-400 text-lg">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-64 mx-4">
        <h2 className="text-lg font-semibold text-white">Assets Owned</h2>
        <div className="mt-2 bg-gray-800 rounded-lg p-4 shadow-lg">
          {user.assets.length > 0 ? (
            <ul className="list-disc list-inside text-white">
              {user.assets.map((asset) => (
                <li key={asset._id} className="mt-2">{asset.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No assets owned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
