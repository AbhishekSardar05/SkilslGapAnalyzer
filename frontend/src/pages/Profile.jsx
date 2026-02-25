import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProfile, updateProfile } from "../services/profile";
import Swal from "sweetalert2";

function Profile() {
  const email = localStorage.getItem("email");

  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getProfile(email);
    setUser(res.data);
    setPreview(res.data.avatar);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", user.username);
    formData.append("bio", user.bio);
    if (image) formData.append("profilePic", image);

    await updateProfile(formData);

    Swal.fire({
      title: "Profile Updated",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    loadProfile();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/30 backdrop-blur-xl rounded-3xl p-10 w-[500px] shadow-2xl"
      >

        <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={preview}
            className="w-36 h-36 rounded-full object-cover shadow-xl border-4 border-white"
          />

          <label className="mt-4 cursor-pointer bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800">
            Change Photo
            <input type="file" hidden onChange={handleImage} />
          </label>
        </div>

        {/* Username */}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          value={user.username || ""}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="input"
          placeholder="Username"
        />

        {/* Bio */}
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          value={user.bio || ""}
          onChange={(e) => setUser({ ...user, bio: e.target.value })}
          className="input h-24"
          placeholder="Write something about yourself..."
        />

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpdate}
          className="w-full mt-4 bg-purple-800 text-white p-3 rounded-xl font-semibold hover:bg-purple-900"
        >
          Save Changes
        </motion.button>

      </motion.div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.75);
          margin-bottom: 14px;
          outline: none;
        }
      `}</style>

    </div>
  );
}

export default Profile;