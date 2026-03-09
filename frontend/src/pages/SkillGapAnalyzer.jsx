import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

/* Typing Animation */

function TypingText({ text, speed = 12 }) {

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {

    if (!text) return;

    let i = 0;

    const interval = setInterval(() => {

      setDisplayText(text.substring(0, i + 1));
      i++;

      if (i >= text.length) clearInterval(interval);

    }, speed);

    return () => clearInterval(interval);

  }, [text]);

  return (
    <p className="whitespace-pre-wrap leading-relaxed">
      {displayText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

export default function SkillGapAnalyzer() {

  const [userSkills, setUserSkills] = useState("");
  const [jobSkills, setJobSkills] = useState("");

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {

    const saved = localStorage.getItem("skillgap_chats");

    if (saved) setHistory(JSON.parse(saved));

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "skillgap_chats",
      JSON.stringify(history)
    );

  }, [history]);

  /* NEW CHAT */

  const startNewChat = () => {

    if (messages.length > 0) {

      const firstUser = messages.find(m => m.role === "user");

      let title = "Skill Gap Chat";

      if (firstUser) {

        title = `${firstUser.userSkills} → ${firstUser.jobSkills}`
          .slice(0,40);

      }

      const chatData = {
        id: Date.now(),
        title,
        messages
      };

      setHistory(prev => [chatData, ...prev]);
    }

    setMessages([]);
    setCurrentChatId(null);
  };

  /* LOAD CHAT */

  const loadChat = (chat) => {

    setMessages(chat.messages);
    setCurrentChatId(chat.id);

  };

  /* DELETE CHAT */

  const deleteChat = (id) => {

    const updated = history.filter(c => c.id !== id);

    setHistory(updated);

  };

  /* ANALYZE */

  const analyzeSkills = async () => {

    if (!userSkills || !jobSkills) return;

    const userMsg = {
      role: "user",
      userSkills,
      jobSkills
    };

    setMessages(prev => [...prev, userMsg]);

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/skillgap",
        { userSkills, jobSkills }
      );

      const aiMsg = {
        role: "assistant",
        content: res.data
      };

      setMessages(prev => [...prev, aiMsg]);

      setUserSkills("");
      setJobSkills("");

    } catch (err) {

      console.log(err);

    }

    setLoading(false);
  };

  const handleKey = (e) => {

    if (e.key === "Enter") analyzeSkills();

  };

  return (

    <div className={`h-screen flex ${
      darkMode
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-gray-900"
    }`}>

      {/* Sidebar */}

      <div className={`w-72 border-r p-4 ${
        darkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-300"
      }`}>

        <div className="flex justify-between mb-4">

          <button
            onClick={startNewChat}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            + New Chat
          </button>

          <button
            onClick={()=>setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? <FaSun/> : <FaMoon/>}
          </button>

        </div>

        <h2 className="font-bold mb-3">
          Chat History
        </h2>

        <div className="space-y-2 overflow-y-auto h-[80vh]">

          {history.map(chat => (

            <div
              key={chat.id}
              onClick={()=>loadChat(chat)}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >

              <span className="truncate">
                {chat.title}
              </span>

              <button
                onClick={(e)=>{
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="text-red-500"
              >
                ✕
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* Chat Area */}

      <div className="flex flex-col flex-1">

        <div className="p-4 border-b text-xl font-semibold">
          AI Skill Gap Analyzer
        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.map((msg,index)=>(

            <motion.div
              key={index}
              initial={{opacity:0,y:10}}
              animate={{opacity:1,y:0}}
            >

              {msg.role==="user" && (

                <div className="bg-purple-600 text-white p-3 rounded ml-auto max-w-lg">

                  <div>
                    <b>Your Skills:</b> {msg.userSkills}
                  </div>

                  <div>
                    <b>Required Skills:</b> {msg.jobSkills}
                  </div>

                </div>

              )}

              {msg.role==="assistant" && msg.content && (

                <div className={`p-4 rounded max-w-xl ${
                  darkMode
                    ? "bg-gray-800"
                    : "bg-white border"
                }`}>

                  {/* Summary */}

                  {msg.content.summary && (

                    <div className="mb-4">

                      <h3 className="font-bold text-lg">
                        Summary
                      </h3>

                      <TypingText text={msg.content.summary}/>

                    </div>

                  )}

                  {/* Matched Skills */}

                  <h3 className="font-bold">
                    Matched Skills
                  </h3>

                  {msg.content.matchedSkills?.map((s,i)=>(
                    <div key={i} className="mb-2">

                      <span className="bg-green-600 px-2 py-1 rounded text-xs">
                        {s.skill}
                      </span>

                      <TypingText text={s.explanation}/>

                    </div>
                  ))}

                  {/* Missing Skills */}

                  <h3 className="font-bold mt-4">
                    Missing Skills
                  </h3>

                  {msg.content.missingSkills?.map((skill,i)=>(

                    <div key={i} className="mt-4">

                      <h4 className="font-bold text-lg">
                        {skill.skill}
                      </h4>

                      <TypingText text={skill.description}/>

                      <div className="text-sm mt-1">
                        <b>Importance:</b>
                        <TypingText text={skill.importance}/>
                      </div>

                      <div className="text-sm">
                        <b>Difficulty:</b> {skill.difficulty}
                      </div>

                      <div className="text-sm">
                        <b>Learning Time:</b> {skill.estimatedLearningTime}
                      </div>

                      <div className="mt-2">

                        <b>Roadmap:</b>

                        <ul className="list-disc ml-5">

                          {skill.roadmap?.map((step,i)=>(
                            <li key={i}>
                              <TypingText text={step}/>
                            </li>
                          ))}

                        </ul>

                      </div>

                      <div className="mt-2">

                        <b>Projects:</b>

                        <ul className="list-disc ml-5">

                          {skill.projects?.map((p,i)=>(
                            <li key={i}>
                              <TypingText text={p}/>
                            </li>
                          ))}

                        </ul>

                      </div>

                      <div className="mt-2">

                        <b>Resources:</b>

                        <ul className="list-disc ml-5">

                          {skill.resources?.documentation && (
                            <li>{skill.resources.documentation}</li>
                          )}

                          {skill.resources?.courses?.map((c,i)=>(
                            <li key={i}>{c}</li>
                          ))}

                          {skill.resources?.youtube?.map((y,i)=>(
                            <li key={i}>{y}</li>
                          ))}

                        </ul>

                      </div>

                    </div>

                  ))}

                  {/* Career Advice */}

                  {msg.content.careerAdvice && (

                    <div className="mt-5">

                      <h3 className="font-bold text-lg">
                        Career Advice
                      </h3>

                      <ul className="list-disc ml-5">

                        {msg.content.careerAdvice.map((tip,i)=>(
                          <li key={i}>
                            <TypingText text={tip}/>
                          </li>
                        ))}

                      </ul>

                    </div>

                  )}

                </div>

              )}

            </motion.div>

          ))}

          {loading && (
            <div className="animate-pulse text-gray-400">
              AI analyzing skills...
            </div>
          )}

        </div>

        {/* Input */}

        <div className="p-4 border-t flex gap-3">

          <input
            placeholder="Your Skills"
            value={userSkills}
            onChange={(e)=>setUserSkills(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 p-3 rounded bg-gray-800 text-white"
          />

          <input
            placeholder="Required Skills"
            value={jobSkills}
            onChange={(e)=>setJobSkills(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 p-3 rounded bg-gray-800 text-white"
          />

          <button
            onClick={analyzeSkills}
            className="bg-purple-600 text-white px-6 rounded"
          >
            Analyze
          </button>

        </div>

      </div>

    </div>
  );
}