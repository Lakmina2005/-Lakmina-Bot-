<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  // ඔබගේ Firebase Config එක මෙතැනට දාන්න
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const messagesCol = collection(db, 'messages');

  // 1. පණිවිඩයක් යැවීම (Post Message)
  const sendBtn = document.querySelector('.btn-send');
  const textArea = document.querySelector('textarea');

  sendBtn.addEventListener('click', async () => {
    const text = textArea.value.trim();
    if (text === "") return;

    try {
      await addDoc(messagesCol, {
        username: "Anon-" + Math.random().toString(36).substring(7), // Random නමක් දීමට
        message: text,
        timestamp: serverTimestamp()
      });
      textArea.value = ""; // Text box එක clear කරන්න
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  // 2. පණිවිඩ කියවීම සහ පෙන්වීම (Read & Display)
  const messageContainer = document.querySelector('.container');
  const q = query(messagesCol, orderBy('timestamp', 'desc'));

  onSnapshot(q, (snapshot) => {
    // දැනට තියෙන messages ටික අයින් කරලා අලුත් ඒවා දාන්න (Input box එක තියලා)
    const existingMessages = document.querySelectorAll('.message-card:not(.input-box)');
    existingMessages.forEach(msg => msg.remove());

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : "Just now";
      
      const msgHTML = `
        <div class="message-card">
            <div class="user-info">
                <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
                <div class="user-details">
                    <span class="username">${data.username}</span>
                    <span class="date">${date}</span>
                </div>
            </div>
            <div class="message-content">${data.message}</div>
            <div class="message-footer">
                <button><i class="far fa-thumbs-up"></i> 0</button>
                <button><i class="far fa-thumbs-down"></i> 0</button>
                <button><i class="fas fa-reply"></i> Reply</button>
            </div>
        </div>`;
      messageContainer.insertAdjacentHTML('beforeend', msgHTML);
    });
  });
</script>
