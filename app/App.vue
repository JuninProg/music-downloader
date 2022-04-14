<template>
  <header></header>
  <main class="app">
    <div>
      <input type="text" v-model="link.url" />
      <button @click="addLink(link.url)">Adicionar</button>
    </div>
    <div>
      <h4>Links:</h4>
      <ul>
        <li v-for="link in links" :key="link.id">
          {{ link.url }}
        </li>
      </ul>
      <button @click="fetchDownload()">Baixar</button>
    </div>
    <div>
      <h4>
        Link de download:
        <a :href="download.url" target="_blank">{{ download.name }}</a>
      </h4>
    </div>
  </main>
  <footer></footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import musicApi from './api';

const links = ref<{ id: number; url: string }[]>([]).value;
const link = ref<{ url: string }>({ url: '' }).value;
const download = ref<{ url: string; name: string }>({
  url: '',
  name: '',
}).value;

function addLink(url: string) {
  url = url.trim();

  if (url.length > 0) {
    const lastLink = links[links.length - 1];
    const lastId = lastLink?.id || 0;
    const newId = lastId + 1;

    links.push({
      id: newId,
      url,
    });

    link.url = '';
  }
}

async function fetchDownload() {
  try {
    const { downloadLink } = await musicApi.download({
      dirs: [
        {
          name: 'musics',
          links: links.map((link) => link.url),
        },
      ],
    });

    const name = downloadLink.split('/').reverse()[0];

    download.url = downloadLink;
    download.name = name;
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'erro desconhecido');
  }
}
</script>

<style>
.app {
  width: 800px;
  height: 500px;
  margin: 0 auto;
  border: 1px black solid;
  padding: 2%;
}
</style>
