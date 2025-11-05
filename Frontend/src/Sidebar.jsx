// import "./Sidebar.css";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import {v1 as uuidv1} from "uuid";

// function Sidebar() {
//     const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

//     const getAllThreads = async () => {
//         try {
//             const response = await fetch("http://localhost:8080/api/thread");
//             const res = await response.json();
//             const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
//             //console.log(filteredData);
//             setAllThreads(filteredData);
//         } catch(err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId])


//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt("");
//         setReply(null);
//         setCurrThreadId(uuidv1());
//         setPrevChats([]);
//     }

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);

//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
//             const res = await response.json();
//             console.log(res);
//             setPrevChats(res);
//             setNewChat(false);
//             setReply(null);
//         } catch(err) {
//             console.log(err);
//         }
//     }   

//     const deleteThread = async (threadId) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
//             const res = await response.json();
//             console.log(res);

//             //updated threads re-render
//             setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//             if(threadId === currThreadId) {
//                 createNewChat();
//             }

//         } catch(err) {
//             console.log(err);
//         }
//     }

//     return (
//         <section className="sidebar">
//             <button onClick={createNewChat}>
//                 <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
//                 <span><i className="fa-solid fa-pen-to-square"></i></span>
//             </button>


//             <ul className="history">
//                 {
//                     allThreads?.map((thread, idx) => (
//                         <li key={idx} 
//                             onClick={(e) => changeThread(thread.threadId)}
//                             className={thread.threadId === currThreadId ? "highlighted": " "}
//                         >
//                             {thread.title}
//                             <i className="fa-solid fa-trash"
//                                 onClick={(e) => {
//                                     e.stopPropagation(); //stop event bubbling
//                                     deleteThread(thread.threadId);
//                                 }}
//                             ></i>
//                         </li>
//                     ))
//                 }
//             </ul>
 
//             <div className="sign">
//                 <p>By Winstar &hearts;</p>
//             </div>
//         </section>
//     )
// }

// export default Sidebar;




// src/Sidebar.jsx
import React, { useContext, useEffect } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { apiFetch } from "./api.js";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const res = await apiFetch("/api/thread");
      // apiFetch returns parsed JSON or text
      const filteredData = Array.isArray(res)
        ? res.map((thread) => ({ threadId: thread.threadId, title: thread.title }))
        : [];
      setAllThreads(filteredData);
    } catch (err) {
      console.error("getAllThreads error:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const res = await apiFetch(`/api/thread/${newThreadId}`);
      // res expected to be an array of messages
      setPrevChats(Array.isArray(res) ? res : []);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("changeThread error:", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const res = await apiFetch(`/api/thread/${threadId}`, { method: "DELETE" });
      console.log("deleteThread response:", res);

      // Update local thread list
      setAllThreads((prev) => prev.filter((thread) => thread.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("deleteThread error:", err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat} className="new-chat-btn">
        <img src="/src/assets/blacklogo.png" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={thread.threadId || idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By ApnaCollege &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
