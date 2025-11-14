<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const fakeData = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1
  return {
    id,
    title: `User ${id}`,
    description: `A description for user ${id}`,
    link: `https://example.com/user${id}`
  }
})

const reqNum = 10

const tableRef = ref()
const data = ref([])
let isLoadDone = false
const isLoading = ref(false)
const getRepo = async (offset, reqNum = 10) => {
  console.log('getRepo called with offset:', offset);

  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newData = fakeData.slice(offset, offset + reqNum)
  unobserve(document.getElementById(`target-${data.value[data.value.length - 1]?.id}`))

  data.value = data.value.concat(newData)
  isLoading.value = false
  if (newData.length < reqNum) {
    isLoadDone = true
  }
  nextTick(() => {
    const lastItem = document.getElementById(`target-${data.value[data.value.length - 1]?.id
      }`)
    obverve(lastItem)
  })
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
        console.log('entry:', entry);
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
    <ElButton
      type="primary"
      :icon="Refresh"
      circle
      :disabled="isLoading"
      @click="reload"
    />
    <ElTable
      ref="tableRef"
      v-loading="isLoading && data.length === 0"
      :data="data"
      height="500"
    >
      <ElTableColumn
        prop="title"
        label="Title"
        width="150"
      >
        <template #default="{ row }">
          <span :id="`target-${row.id}`">{{ row.title }}</span>
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
            :href="row.link"
            target="_blank"
          >{{ row.link }}</a>
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
    </ElTable>
  </div>
</template>

<style scoped lang="scss"></style>
