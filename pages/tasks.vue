<script setup lang="ts">
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp, deleteDoc, writeBatch, orderBy, query } from "firebase/firestore";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { onMounted, ref, createApp } from "vue";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence } from "firebase/auth";
import { useRouter, createWebHashHistory } from 'vue-router';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6K0raBgmIOLZAWwlCiX9oAZ_8TfaOrDQ",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "test-f053f",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



const router = useRouter()
// let unsubscribe: (() => void) | undefined;

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

const taskName = ref<string>('');
const tasks = ref<Task[]>([]);
const loading = ref(true);

const addTask = () => {
  if (taskName.value === '') {
    return;
  }
  sendData();
  tasks.value.push({ name: taskName.value, date: Timestamp.now(), });
  taskName.value = '';
}

//define sendData
const sendData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user is signed in");
    return;
  }
  try {
    await addDoc(collection(db, `users/${user.uid}/tasks`), {
      name: taskName.value,
      date: Timestamp.now(),
      uid: user.uid,
    });
    console.log("Document written with ID: ");
    taskName.value = '';
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const fetchAllTasksAndFilterLocally = async () => {
  const user = auth.currentUser;
  if (!user) {
    router.push("/signin")
    console.error("No user is signed in");
    return;
  }
  console.log(user);
  // debugger

  try {
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/tasks`));
    tasks.value = querySnapshot.docs
      // .filter(doc => doc.data().uid === user.uid)
      .sort((a, b) => b.data().date.toMillis() - a.data().date.toMillis()) // ローカルで並び替え
      .map(doc => ({
        name: doc.data().name,
        date: doc.data().date,
      }));
  } catch (e) {
    console.error("Error fetching documents: ", e);
  }
};

const completeTask = async (completedTaskName: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No use is signed in");
    return;
  }
  try {
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/tasks`));
    const batch = writeBatch(db);

    querySnapshot.forEach(doc => {
      if (doc.data().name === completedTaskName) {
        batch.delete(doc.ref);

      }
    });
    await batch.commit();
    tasks.value = tasks.value.filter(task => task.name !== completedTaskName);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}




interface Task {
  name: string;
  date: Timestamp;
}





onAuthStateChanged(auth, (user) => {
  console.log("test")
  loading.value = false
  if (user) {
    // サインインしている場合、タスクを取得
    fetchAllTasksAndFilterLocally();
  } else {
    console.log("no user signed in");
    tasks.value = [];
    router.push('/signin')
  }
});


// サインアウト用の関数
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    router.push('\signin');
  } catch (e) {
    console.log("Error signing out", e);
  }
};


</script>


<template>
  <!-- <nuxt-link to="/signin">about.vueへ</nuxt-link> -->
  <div class="mx-11 p-6 ">
    <h1 class="mt-5 text-7xl  font-bold text-blue-700  flex flex-col items-center underline">To Do List</h1>

    <div class="flex justify-end mt-4">
      <button @click="logout" type="button"
        class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 shadow-lg transform transition duration-300 hover:scale-105 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800">
        Log Out
      </button>
    </div>

    <div v-if="!loading" class="mx-7 mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md px-5 py-2">
      <div class="flex flex-col sm:flex-row items-center sm:space-x-4">

        <div class="flex-1 w-full am:w-3/4">
          <label for="first_name" class="block mb-2 text-sm font-medium text-black-700 dark:text-black-500">Add
            task...</label>
          <div class="flex">
            <input v-model="taskName" type="text" id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="write your task here" required />

            <button @click="addTask" type="submit"
              class="mt-2 sm:mt-0 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 h-12 text-center shadow-lg transform transition duration-300 hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 ml-2">Submit</button>
          </div>
        </div>
      </div>



      <div class="mt-6">
        <h2 class="block mb-4 text-sm font-medium text-black-700 dark:text-black-500">TO Do:</h2>


        <div v-for="task in tasks" :key="task.name" class="flex justify-between items-center mb-2">
          <div class="flex-1">
            <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
              <li>{{ task.name }}</li>
            </ul>
          </div>

          <div clas="ml-5">
            <button @click="completeTask(task.name)" type="button" data-drawer-hide="drawer-timepicker"
              class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ml-5 pt-1 pb-1 pl-2 pr-2">Close</button>
          </div>

        </div>

        <div v-if="loading" class="flex justify-center items-center">
          <span class="text-gray-500 dark:text-gray-400">Loading...</span>
        </div>




      </div>
    </div>

  </div>
</template>