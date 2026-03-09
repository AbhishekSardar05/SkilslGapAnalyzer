import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TPOStudents() {

  const [students,setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    loadStudents();
  },[]);

  const loadStudents = async ()=>{

    const res = await axios.get(
      "http://localhost:5000/api/profile/students/list"
    );

    setStudents(res.data);
  };

  return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Students
</h1>

<div className="grid md:grid-cols-3 gap-6">

{students.map((student)=>(
<div
key={student.email}
onClick={()=>navigate(`/tpo/student/${student.email}`)}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-xl"
>

<h2 className="text-xl font-bold">
{student.username}
</h2>

<p className="text-gray-500">
{student.email}
</p>

</div>
))}

</div>

</div>

  );
}

export default TPOStudents;