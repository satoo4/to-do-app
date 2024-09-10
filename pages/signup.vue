<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6K0raBgmIOLZAWwlCiX9oAZ_8TfaOrDQ",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "test-f053f",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

const signupEmail = ref('');
const signupPassword = ref('');
const router = useRouter();
const auth = getAuth(app);

const handleSignUp = async () => {
  try {
    await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
    console.log('User signed up');
    router.push('/signin');  // サインアップ後にタスクページに遷移
  } catch (e: any) {
    // エラーのタイプに基づいてエラーメッセージを表示
    if (e.code === 'auth/email-already-in-use') {
      console.error('The email address is already in use.');
    } else if (e.code === 'auth/weak-password') {
      console.error('The password is too weak.');
    } else {
      console.error('Error signing up:', e.message);
    }
  }
};

const handleSignIn = () => {
  router.push('/signin');
}
</script>


<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
    <h2 class="text-3xl text-blue-700 font-bold mb-6">Sign Up</h2>
    <form class="w-full max-w-sm space-y-4 bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
      <div>
        <label for="signupEmail" class="block text-sm font-medium text-gray-900 dark:text-gray-300">Email
          Address</label>
        <input v-model="signupEmail" type="email" id="signupEmail" placeholder="Enter your email"
          class="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500" />
      </div>
      <div>
        <label for="signupPassword" class="block text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
        <input v-model="signupPassword" type="password" id="signupPassword" placeholder="Enter your password"
          class="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500" />
      </div>
      <div class="flex gap-4">
        <button @click="handleSignUp"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-transform transform hover:scale-105">Sign
          Up</button>
        <button @click="handleSignIn" type="button"
          class="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-transform transform hover:scale-105">Go
          Back</button>
      </div>
    </form>
  </div>
</template>
