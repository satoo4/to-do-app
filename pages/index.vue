<script setup lang="ts">
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp, deleteDoc, writeBatch, orderBy, query } from "firebase/firestore";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { onMounted, ref, createApp } from "vue";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6K0raBgmIOLZAWwlCiX9oAZ_8TfaOrDQ",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "test-f053f",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const router = useRouter()
// let unsubscribe: (() => void) | undefined;

const taskName = ref<string>('');
const tasks = ref<Task[]>([]);

interface Task {
  name: string;
  date: Timestamp;
}

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const signUp = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up");
  } catch (e) {
    console.log("Error signed up", e);
  }
};

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
      .sort((a, b) => b.data().date - a.data().date) // ローカルで並び替え
      .map(doc => ({
        name: doc.data().name,
        date: doc.data().date,
      }));
  } catch (e) {
    console.error("Error fetching documents: ", e);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // サインインしている場合、タスクを取得
    fetchAllTasksAndFilterLocally();
  } else {
    // サインアウトしている場合、タスクをクリア
    tasks.value = [];
  }
});


onMounted(() => {
  fetchAllTasksAndFilterLocally();
});


// delete tasks from Firestore
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchAllTasksAndFilterLocally();
  } else {
    tasks.value = [];
  }
});

const signIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in");
  } catch (e) {
    console.log("Error signing in:", e);
  }
};

// サインアウト用の関数
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (e) {
    console.log("Error signing out", e);
  }
};

const signupEmail = ref('');
const signupPassword = ref('');
const signinEmail = ref('');
const signinPassword = ref('');

const handleSignUp = async () => {
  try {
    await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
    console.log('User signed up');
  } catch (e) {
    console.error('Error signing up', e);
  }
};

// Handle Sign In
const handleSignIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, signinEmail.value, signinPassword.value);
    console.log('User signed in');
  } catch (e) {
    console.error('Error signing in', e);
  }
};




</script>

<!-- <style>

#title{
  color:green;
  text-align: center;
  margin-top: 2em;
  font-size: 1.5em;
  text-decoration: underline;

}
</style> -->

<template>
  <!-- <nuxt-link to="/signin">about.vueへ</nuxt-link> -->
  <div class="mx-11">
    <h1 class="mt-5 text-7xl text-green-700  flex flex-col items center items-center underline">To Do App</h1>

    <div class="mt-5">
      <h2 class="text-2xl text-blue-700">Sign Up</h2>
      <input v-model="signupEmail" type="email" placeholder="Enter your email" class="border p-2 rounded-lg" />
      <input v-model="signupPassword" type="password" placeholder="Enter your password"
        class="border p-2 rounded-lg ml-2" />
      <button @click="handleSignUp"
        class="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center mt-3">Sign
        Up</button>
    </div>

    <div class="mt-5">
      <h2 class="text-2xl text-blue-700">Sign In</h2>
      <input v-model="signinEmail" type="email" placeholder="Enter your email" class="border p-2 rounded-lg" />
      <input v-model="signinPassword" type="password" placeholder="Enter your password"
        class="border p-2 rounded-lg ml-2" />
      <button @click="handleSignIn"
        class="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center mt-3">Sign
        In</button>
      <button @click="logout"
        class="ml-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center mt-3">Logout</button>
    </div>

    <div class="mx-7">
      <div class="flex">

        <div class="flex-1">
          <label for="first_name" class="block mb-2 text-sm font-medium text-green-700 dark:text-green-500">Add
            task...</label>
          <input v-model="taskName" type="text" id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="write your task here" required />
        </div>
        <!-- <button @click="addTask"> 追加</button> -->
        <button @click="addTask" type="submit"
          class="ml-4 flex-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-0.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-7">Submit</button>
      </div>



      <div class="">
        <h2 class="block mb-2 text-sm font-medium text-green-700 dark:text-green-500">TO Do:</h2>


        <div v-for="task in tasks" :key="task.name" class="flex">
          <div>
            <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
              <li>{{ task.name }}</li>
            </ul>
          </div>

          <div>
            <button @click="completeTask(task.name)" type="button" data-drawer-hide="drawer-timepicker"
              class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ml-5 pt-1 pb-1 pl-2 pr-2">Close</button>
          </div>

        </div>




      </div>
    </div>

    <!-- <input v-model="taskName">
    <p>{{ taskName }}</p> -->
  </div>
</template>
