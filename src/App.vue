<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getShared } from '@/shared/index';
import { useCentralStore } from '@/http/centralStore';

const currentPage = ref('/');
const eventBus = getShared('eventBus');

/** Локальная копия для шаблона; обновляется из CentralStore через watchPath */
const demoCounter = ref(0);
let unsubscribeCentral: (() => void) | undefined;

function onNavigate(path: string) {
  currentPage.value = path;
}

onMounted(() => {
  eventBus.on('navigate', onNavigate);

  const central = useCentralStore();
  demoCounter.value = (central.getPath('demo.counter') as number) ?? 0;
  // Подписка на путь в глобальном сторе — без eventBus
  unsubscribeCentral = central.watchPath('demo.counter', (value) => {
    demoCounter.value = typeof value === 'number' ? value : 0;
  });
});

onUnmounted(() => {
  eventBus.off('navigate', onNavigate);
  unsubscribeCentral?.();
});
</script>

<template>
  <div class="base">
    <div v-if="currentPage === '/'">
      <h1>Главная страница</h1>
      <p>Добро пожаловать в MyBreez!</p>
      <p class="base__central">
        Счётчик из CentralStore (обновляется из menu):
        <strong>{{ demoCounter }}</strong>
      </p>
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

.base__central {
  margin-top: 16px;
  padding: 12px;
  background: #f0f4f8;
  border-radius: 8px;
}
</style>