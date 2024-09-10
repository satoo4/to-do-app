<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD6K0raBgmIOLZAWwlCiX9oAZ_8TfaOrDQ",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "test-f053f",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const email = ref('');
const password = ref('');
const router = useRouter();
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const handleSignIn = async (event: Event) => {
  console.log("loigin");
  event.preventDefault();
  try {
    console.log("サインイン前")
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('User signed in');
    router.push('/tasks');  // サインイン後にタスクページに遷移
  }
  catch (error) {
    console.error('Error signing in:', error);
  }
};

const handleSignUp = () => {
  router.push('/signup');
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <form class="max-w-sm w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
      <label for="email" class="mb-2 text-sm font-medium text-gray-900 dark:text-white">e-mail address:</label>
      <div class="flex items-center mt-2">
        <div class="relative w-full">
          <input v-model="email" type="email" id="email-input" aria-describedby="helper-text-explanation"
            class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="******@gmail.com" required />
        </div>
      </div>
      <div class="mt-4">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
        <input type="password" v-model="password" id="password" placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          required />
      </div>
      <div class="flex items-center mt-4 mb-4">
        <label for="terms" class="text-gray-500 dark:text-gray-300 ms-2 text-sm"> <a @click="handleSignUp"
            class="font-medium text-blue-600 hover:underline dark:text-blue-500">Register here</a></label>
      </div>
      <button @click="handleSignIn" type="button"
        class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign
        In</button>
    </form>
  </div>
</template>
