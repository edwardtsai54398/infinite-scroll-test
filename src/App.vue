<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'


const repoUser = 'yyx990803'
const MY_TOKEN = 'YOUR_GITHUB_TOKEN_HERE' // Replace with your GitHub token

const tableRef = ref()
const lastItemEl = ref(null)
const data = ref([])
let isLoadDone = false
const isLoading = ref(false)
const getRepo = async (offset, reqNum = 10) => {
  const page = (offset / reqNum) + 1
  isLoading.value = true
  const api = `https://api.github.com/users/${repoUser}/repos?per_page=10&page=${page}`
  try {
    const response = await axios({
      method: 'get',
      url: api,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${MY_TOKEN}`
      }
    })

    if (response.status !== 200) {
      console.error(response.data.message);
      return
    }
    if (response.data.length === 0) {
      isLoadDone = true
      return
    }

    // const newData = fakeData.slice(offset, offset + reqNum)
    const newData = response.data
    unobserve(lastItemEl.value)

    data.value = data.value.concat(newData)
    isLoading.value = false
    if (newData.length < reqNum) {
      isLoadDone = true
    }
    nextTick(() => {
      lastItemEl.value = document.getElementById(`target-${data.value[data.value.length - 1]?.id
        }`)
      obverve(lastItemEl.value)
    })

  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }

}

const reload = () => {
  data.value = []
  isLoadDone = false
  getRepo(0)
}

let observer = null


const obverve = (el) => {
  if (observer && el) {
    observer.observe(el)
  }
}
const unobserve = (el) => {
  if (observer && el) {
    observer.unobserve(el)
  }
}

onMounted(() => {
  getRepo(0)
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isLoading.value && !isLoadDone) {
        getRepo(data.value.length)
      }
    })
  }, {
    root: tableRef.value?.$el.querySelector('.el-table__body-wrapper'),
    threshold: 1
  })
})

</script>

<template>
  <div>
    <h2>GitHub Repositories of {{ repoUser }}</h2>
  </div>
  <div>
    <ElButton
      type="primary"
      :icon="Refresh"
      circle
      :disabled="isLoading"
      @click="reload"
    />
    <ElTable
      ref="tableRef"
      :data="data"
      height="500"
    >
      <ElTableColumn
        prop="title"
        label="Title"
        width="150"
      >
        <template #default="{ row }">
          <span :id="`target-${row.id}`">{{ row.name }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="description"
        label="Description"
        width="150"
      />
      <ElTableColumn
        prop="link"
        label="Link"
        width="250"
      >
        <template #default="{ row }">
          <a
            :href="row.svn_url"
            target="_blank"
          >{{ row.svn_url }}</a>
        </template>
      </ElTableColumn>
      <template
        v-if="data.length"
        #append
      >
        <div style="padding: 10px 0px;">
          {{ isLoading ? 'Loading...' : 'No more data' }}
        </div>
      </template>
      <template #empty>
        {{ isLoading ? 'Loading data...' : 'No data' }}
      </template>
    </ElTable>
  </div>
</template>

<style scoped lang="scss"></style>
