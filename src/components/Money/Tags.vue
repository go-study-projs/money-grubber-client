<template>
  <div class="tags">
    <ul class="list">
      <li
        v-for="tag in tagList"
        :key="tag.name"
        :class="{ selected: selectedTag.name === tag.name }"
        @click="toggle(tag)"
      >
        <Icon :name="tag.name" />
        <span>{{ tag.value }}</span>
      </li>
      <li v-if="expense" @click="add">
        <Icon name="setting"></Icon>
        <span>添加</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Tags extends Vue {
  @Prop() readonly tagList!: TagItem[]
  @Prop() readonly expense!: boolean
  @Prop() readonly selectedTag!: TagItem

  toggle(tag: TagItem) {
    this.$emit('update:selected-tag', tag)
  }
  add() {
    this.$router.push('/addtag')
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/helper.scss';
.tags {
  font-size: 12px;
  padding: 16px;
  flex-grow: 1;
  overflow: auto;
  > .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > li {
      width: 25%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 8px 10px;
      .icon {
        height: 50px;
        width: 50px;
        background-color: #e8e8e8;
        padding: 5px;
        border-radius: 50%;
      }
      &.selected {
        .icon {
          background-color: $color-highlight;
        }
      }
    }
  }
}
</style>
