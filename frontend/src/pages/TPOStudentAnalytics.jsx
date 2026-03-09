import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";

function TPOStudentAnalytics(){

const { email } = useParams();
const [resume,setResume] = useState([]);

useEffect(()=>{
 loadData();
},[]);

const loadData = async ()=>{

 const res = await axios.get(
   `http://localhost:5000/api/resume/student/${email}`
 );

 setResume(res.data);

};

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Student Report
</h1>

{resume.map((item)=>(
<div
key={item._id}
className="bg-white p-6 rounded-xl shadow mb-4"
>

<h2 className="font-bold">
Score : {item.score}
</h2>

<p>
ATS Score : {item.feedback.atsScore}
</p>

<p>
Role : {item.feedback.detectedRole}
</p>

</div>
))}

</div>

);

}

export default TPOStudentAnalytics;