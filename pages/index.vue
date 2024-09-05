<script setup lang="ts">
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp, deleteDoc,writeBatch,orderBy,query } from "firebase/firestore";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { onMounted,ref } from "vue";



// const taskNameList = ref<string[]>(['vue','Vue3','Nuxt3']);
const taskName = ref<string>('');
const tasks = ref<Task[]>([]);
interface Task {
  name: string;
  date: Timestamp;
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "test-f053f",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};


const addTask = () => {
  if (taskName.value === '') {
    return;
  }
  sendData();
  tasks.value.push({name: taskName.value,date: Timestamp.now(), });
  taskName.value = '';
}

//define sendData
async function sendData() {
  try {
    console.log(taskName.value)
    const docRef = await addDoc(collection(db, "tasks"), {
      name: taskName.value,
      date:Timestamp.now(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}






// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Firestoreからタスクを取得
const fetchTasks = async () => {
  try {
    const q= query(collection(db,"tasks"),orderBy("date","desc"));
    const querySnapshot = await getDocs(q);
    tasks.value = querySnapshot.docs.map(doc => ({
    name:doc.data().name,
    date:doc.data().date}));
  } catch (e) {
    console.error("Error fetching documents: ", e);
  }
};

let unsubscribe: (() => void) | undefined;


// onMounted(() => {
//   fetchTasks();

//   unsubscribe = onSnapshot(
//     query(collection(db, "tasks"), orderBy("date","desc")),
//     tasks.value = snapshot.docs.map(doc => ({
//       name:doc.data().name,
//       date:doc.data().date
//     }));
//   });
// });

onMounted(() => {
  fetchTasks(); 
  unsubscribe = onSnapshot(
    query(collection(db, "tasks"), orderBy("date", "desc")), 
    (snapshot) => {
      tasks.value = snapshot.docs.map(doc => ({
        name: doc.data().name,
        date: doc.data().date
      }));
    },
    (error) => {
      console.error("Error fetching documents: ", error);
    }
  );
});


//When Unmounted
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});


// delete tasks from Firestore
const completeTask = async (completedTaskName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const batch = writeBatch(db);

    querySnapshot.forEach(doc => {
      if (doc.data().name === completedTaskName) {
        batch.delete(doc.ref);

      }
    });
    await batch.commit();
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}



</script>

<template>
  <div>
    <h1>ToDoApp</h1>
    <h2>タスク追加</h2>
    <input v-model="taskName">
    <button @click="addTask"> 追加</button>
    <h2>タスク名</h2>
    <div v-for="task in tasks" :key="task.name">
      {{ task.name }}
      <button @click="completeTask(task.name)">完了</button>

    </div>

    <!-- <input v-model="taskName">
    <p>{{ taskName }}</p> -->
  </div>
</template>
