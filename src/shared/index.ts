// То же хранилище shared, что и в menu.
// Каждый микрофронт — отдельный проект, поэтому у каждого своя копия этого файла.
// Но все они хранят ссылку на ОДИН И ТОТ ЖЕ объект eventBus,
// переданный из root config.
const shared: Record<string, any> = {};

export const setShared = (key: string, value: any) => {
  shared[key] = value;
};

export const getShared = (key: string) => {
  return shared[key];
};