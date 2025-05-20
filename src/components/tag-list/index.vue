<template>
  <div ref="tagsContainer" class="tags-container">
    <t-tag v-for="(item, index) in props.tags" :key="index" class="tag-item dia-tag" theme="primary" variant="light">{{
      item
    }}</t-tag>
    <div v-if="isWrapped" class="more-btn-mask">
      <t-popup trigger="hover">
        <span class="more-btn" @click.stop>全部</span>
        <template #content>
          <div class="more-tags-container">
            <div class="tag-title">标签</div>
            <div class="more-tags">
              <t-tag
                v-for="(item, index) in props.tags"
                :key="index"
                class="tag-item dia-tag"
                theme="primary"
                variant="light"
                >{{ item }}</t-tag
              >
            </div>
          </div>
        </template>
      </t-popup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';

const props = defineProps<{
  tags: string[];
}>();

onMounted(() => {
  dealWrap();
});
onUpdated(() => {
  dealWrap();
});

const tagsContainer = ref<HTMLElement>(null);
const isWrapped = ref(false);

function dealWrap() {
  const container = tagsContainer.value;
  const tags = container.querySelectorAll('.tag-item') as NodeListOf<HTMLElement>;
  if (tags.length === 0) {
    isWrapped.value = false;
    return;
  }

  const previousTop = tags[0].offsetTop;

  for (let i = 1; i < tags.length; i++) {
    if (tags[i].offsetTop !== previousTop) {
      isWrapped.value = true;
      break;
    }
  }
}
</script>

<style scoped lang="less">
.tags-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  height: 24px;
  overflow: hidden;
  width: 100%;

  .more-btn-mask {
    // margin-left: 8px;
    position: absolute;
    background: linear-gradient(
      to right,
      rgb(255 255 255 / 0%) 0%,
      rgb(255 255 255 / 100%) 30px,
      rgb(255 255 255 / 100%) 100%
    );
    right: 0;
    height: 24px;
    cursor: pointer;
    padding-left: 30px;

    .more-btn {
      line-height: 24px;
      padding: 0 3px;
      font-size: 12px;
      color: var(--td-brand-color);
    }
  }
}

.more-tags {
  max-width: 300px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.more-tags-container {
  padding: 10px;

  .tag-title {
    border-left: 2px solid var(--td-brand-color);
    padding-left: 16px;
    margin-bottom: 16px;
  }
}
</style>
