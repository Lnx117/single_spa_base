<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getShared } from '@/shared/index';

// Текущая страница, реактивная переменная Vue
const currentPage = ref('/');

const eventBus = getShared('eventBus');

// Обработчик события 'navigate' из eventBus.
// Когда menu отправит eventBus.emit('navigate', '/about'),
// эта функция вызовется с path = '/about'.
function onNavigate(path: string) {
  console.log('onNavigate', path);
  currentPage.value = path;
}

onMounted(() => {
  // Подписываемся на событие 'navigate' при монтировании
  eventBus.on('navigate', onNavigate);
});

onUnmounted(() => {
  // Отписываемся при размонтировании, чтобы не было утечек памяти.
  // Если микрофронт unmount — его callback не должен висеть в eventBus.
  eventBus.off('navigate', onNavigate);
});
</script>

<template>
  <div class="base">
    <div v-if="currentPage === '/'">
      <h1>Главная страница</h1>
      <p>Добро пожаловать в MyBreez!</p>
    </div>
    <div v-else-if="currentPage === '/about'">
      <h1>О нас</h1>
      <p>Мы — команда MyBreez.</p>
    </div>
    <div v-else-if="currentPage === '/contacts'">
      <h1>Контакты</h1>
      <p>Email: hello@mybreez.ru</p>
    </div>
  </div>
</template>

<style scoped>
.base {
  padding: 24px;
  font-family: sans-serif;
}
</style>