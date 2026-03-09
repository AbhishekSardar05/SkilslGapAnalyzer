import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard(){

const [users,setUsers] = useState([]);
const navigate = useNavigate();

useEffect(()=>{
 loadUsers();
},[]);

const loadUsers = async ()=>{

 const res = await axios.get(
  "http://localhost:5000/api/profile/admin/users"
 );

 setUsers(res.data);

};

const deleteUser = async (email)=>{

 await axios.delete(
   `http://localhost:5000/api/profile/admin/delete/${email}`
 );

 loadUsers();

};

const changeRole = async (email,role)=>{

 await axios.post(
  "http://localhost:5000/api/profile/admin/role",
  { email,role }
 );

 loadUsers();

};

const logout = ()=>{

 localStorage.clear();
 navigate("/");

};

return(

<div className="flex min-h-screen bg-gray-100">

{/* SIDEBAR */}

<div className="w-64 bg-purple-900 text-white p-6 space-y-6">

<h2 className="text-2xl font-bold">
Admin Panel
</h2>

<div className="space-y-4">

<div
onClick={()=>navigate("/admin")}
className="cursor-pointer hover:bg-purple-700 p-3 rounded"
>
Users
</div>

<div
onClick={()=>navigate("/tpo/students")}
className="cursor-pointer hover:bg-purple-700 p-3 rounded"
>
Students
</div>

</div>

</div>

{/* MAIN */}

<div className="flex-1 p-10">

<div className="flex justify-between mb-10">

<h1 className="text-3xl font-bold text-purple-900">
Admin Dashboard
</h1>

<button
onClick={logout}
className="bg-purple-800 text-white px-4 py-2 rounded-lg"
>
Logout
</button>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-bold mb-6">
All Users
</h2>

<table className="w-full">

<thead>

<tr className="text-left border-b">

<th className="py-3">Name</th>
<th>Email</th>
<th>Role</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{users.map(user=>(
<tr key={user.email} className="border-b">

<td className="py-3">
{user.username}
</td>

<td>
{user.email}
</td>

<td>
{user.role}
</td>

<td className="space-x-2">

<button
onClick={()=>changeRole(user.email,"TPO")}
className="bg-blue-500 text-white px-3 py-1 rounded"
>
Make TPO
</button>

<button
onClick={()=>changeRole(user.email,"Student")}
className="bg-green-500 text-white px-3 py-1 rounded"
>
Make Student
</button>

<button
onClick={()=>deleteUser(user.email)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

</div>

);

}

export default AdminDashboard;