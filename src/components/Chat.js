// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// const socket = io("http://localhost:1337", {
//   withCredentials: true,
//   transports: ["websocket"],
// });

// function Chat() {
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   // Fetch user-specific messages from API
//   const fetchMessages = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:1337/api/messages?filters[user][id][$eq]=${userId}&pagination[pageSize]=1000&populate=user`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await response.json();
//       console.log("Fetched messages:", data);

//       if (data.data) {
//         const formattedMessages = data.data.map((msg) => ({
//           id: msg.id,
//           text: msg.text,
//           user: msg?.isFromServer ? "Server" : msg?.user?.username,
//           userId: msg?.user?.id,
//           timestamp: msg.createdAt,
//         }));
//         console.log("formatted msg", formattedMessages);
//         setReceivedMessages(formattedMessages);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   useEffect(() => {
//     // Listen for real-time messages
//     socket.on(
//       "response",
//       (newMsg) => {
//         console.log("Received from server:", newMsg);

//         if (newMsg) {
//           setReceivedMessages((prev) => [
//             ...prev,
//             {
//               id: newMsg.serverResponse.id,
//               text: newMsg.serverResponse.text,
//               user: newMsg.serverResponse.user || "Unknown",
//               userId: newMsg.serverResponse.userId,
//               timestamp:
//                 newMsg.serverResponse.timestamp || new Date().toISOString(),
//             },
//           ]);
//         } else {
//           console.error("Received malformed message:", newMsg);
//         }
//       },
//       []
//     );

//     socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });

//     return () => {
//       socket.off("response");
//       socket.off("connect_error");
//     };
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim() && userId) {
//       const msgObject = {
//         message: message, // Ensure 'text' matches backend expected key
//         userId: userId,
//         user: username || "Anonymous",
//         // timestamp: new Date().toISOString(),
//       };
//       const msgObjectList = {
//         text: message, // Ensure 'text' matches backend expected key
//         userId: userId,
//         user: username || "Anonymous",
//         timestamp: new Date().toISOString(),
//       };

//       console.log("Sending message:", msgObject);

//       socket.emit("message", msgObject); // Ensure backend listens to "message" event

//       setReceivedMessages((prev) => [...prev, msgObjectList]); // Optimistic update
//       setMessage(""); // Clear input field
//     }
//   };

//   // const handleSignOut = () => {
//   //   // Clear local storage and redirect to login page
//   //   localStorage.removeItem("userId");
//   //   localStorage.removeItem("token");
//   //   localStorage.removeItem("username");
//   //   navigate("/login");
//   // };

//   if (isLoading) {
//     return <div>Loading messages...</div>;
//   }

//   return (
//     <div>
//       <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
//         <div
//           style={{
//             height: "500px",
//             overflowY: "auto",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             padding: "20px",
//             marginBottom: "20px",
//           }}
//         >
//           {receivedMessages.map((msg) => (
//             <div
//               key={msg.id}
//               style={{
//                 padding: "12px",
//                 borderRadius: "8px",
//                 margin: "8px 0",
//                 backgroundColor: msg.user !== "Server" ? "#e3f2fd" : "#f5f5f5",
//                 maxWidth: "80%",
//                 marginLeft: msg.user !== "Server" ? "auto" : "0",
//               }}
//             >
//               <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
//                 {msg?.user}
//               </div>
//               <div>{msg.text}</div>
//               <div style={{ fontSize: "0.8em", color: "#666" }}>
//                 {new Date(msg.timestamp).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </div>

//         <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//             style={{
//               flex: 1,
//               padding: "10px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#1976d2",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Chat;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:1337", {
  withCredentials: true,
  transports: ["websocket"],
});

function Chat() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/messages?filters[user][id][$eq]=${userId}&pagination[pageSize]=1000&populate=user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.data) {
        const formattedMessages = data.data.map((msg) => ({
          id: msg.id,
          text: msg.text,
          user: msg?.isFromServer ? "Server" : msg?.user?.username,
          userId: msg?.user?.id,
          timestamp: msg.createdAt,
        }));
        setReceivedMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("response", (newMsg) => {
      if (newMsg) {
        setReceivedMessages((prev) => [
          ...prev,
          {
            id: newMsg.serverResponse.id,
            text: newMsg.serverResponse.text,
            user: newMsg.serverResponse.user || "Unknown",
            userId: newMsg.serverResponse.userId,
            timestamp:
              newMsg.serverResponse.timestamp || new Date().toISOString(),
          },
        ]);
      }
    });

    return () => {
      socket.off("response");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && userId) {
      const msgObject = {
        message: message,
        userId: userId,
        user: username || "Anonymous",
      };
      const msgObjectfrontend = {
        text: message,
        userId: userId,
        user: username || "Anonymous",
      };
      socket.emit("message", msgObject);
      setReceivedMessages((prev) => [
        ...prev,
        { ...msgObjectfrontend, timestamp: new Date().toISOString() },
      ]);
      setMessage("");
    }
  };

  const handleSignOut = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Sign Out Button Fixed at Top Right */}
      <button
        onClick={handleSignOut}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>

      {/* Chat Box Centered */}
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          height: "90vh",
          border: "10px 10px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Chat</h2>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {receivedMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: "10px",
                borderRadius: "8px",
                margin: "8px 0",
                backgroundColor: msg.user !== "Server" ? "#e3f2fd" : "#f5f5f5",
                maxWidth: "80%",
                marginLeft: msg.user !== "Server" ? "auto" : "0",
                textAlign: msg.user !== "Server" ? "right" : "left",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "2px",
                  fontSize: "small",
                }}
              >
                {msg?.user}
              </div>
              <div>{msg.text}</div>
              <div style={{ fontSize: "0.6em", color: "#666" }}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "10px", paddingTop: "10px" }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
