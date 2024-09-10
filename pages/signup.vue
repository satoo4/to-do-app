 <script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const signupEmail = ref('');
const signupPassword = ref('');
const router = useRouter();
const auth = getAuth();

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
</script>

<template>
  <div class="mt-5">
    <h2 class="text-2xl text-blue-700">Sign Up</h2>
    <input v-model="signupEmail" type="email" placeholder="Enter your email" class="border p-2 rounded-lg" />
    <input v-model="signupPassword" type="password" placeholder="Enter your password"
      class="border p-2 rounded-lg ml-2" />
    <button @click="handleSignUp"
      class="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center mt-3">
      Sign Up
    </button>
  </div>
</template>
