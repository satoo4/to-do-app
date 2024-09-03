<template>
  <div>
    <h1>ToDoApp</h1>
    <h2>タスク追加</h2>
    <input v-model="taskName">
    <button @click="addTask()"> 追加</button>
    <h2>タスク名</h2>
    <div v-for="task in taskNames" :key="task">
      {{ task }}
      <button @click="completeTask(task)">完了</button>
    </div>

    <!-- <input v-model="taskName">
    <p>{{ taskName }}</p> -->
  </div>
</template>

<script setup lang="ts">
// const taskNameList = ref<string[]>(['vue','Vue3','Nuxt3']);
const taskName = ref<string>('');
const taskNames = ref<string[]>([]);
const addTask = () => {
  if (taskName.value === '') {
    return;
  }
  //  taskNameList.value.push(taskName.value);
  taskNames.value.push(taskName.value);
  taskName.value = '';
}

const completeTask = (completedTaskName: string) => {
  taskNames.value = taskNames.value.filter((task: string) => {
    return completedTaskName !== task
  });
}


</script>
