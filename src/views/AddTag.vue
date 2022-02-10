<template>
  <div class="tag">
    <div class="header">
      <button @click="back" class="back">
        <Icon name="left" />
      </button>
      <span>添加支出类别</span>
      <button class="ok" @click="ok">添加</button>
    </div>
    <div class="select">
      <Icon :name="selectedTag.name" />
      <span>{{ selectedTag.value }}</span>
    </div>
    <div class="contents">
      <div class="content">
        <div class="caption">饮食</div>
        <ul class="tags">
          <li
            v-for="tag in foodTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="caption">生活</div>
        <ul class="tags">
          <li
            v-for="tag in homeTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="caption">购物</div>
        <ul class="tags">
          <li
            v-for="tag in shoppingTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="caption">娱乐</div>
        <ul class="tags">
          <li
            v-for="tag in entertainmentTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="caption">交通</div>
        <ul class="tags">
          <li
            v-for="tag in trafficTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="caption">社交</div>
        <ul class="tags">
          <li
            v-for="tag in societyTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="caption">其他</div>
        <ul class="tags">
          <li
            v-for="tag in otherTags"
            :key="tag.name"
            @click="toggle(tag)"
            :class="{ selected: selectedTag.name === tag.name }"
          >
            <Icon :name="tag.name" />
            <span>{{ tag.value }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import {
  defaultEntertainmentTags,
  defaultFoodTags,
  defaultHomeTags,
  defaultShoppingTags,
  defaultSocietyTags,
  defaultOtherTags,
  defaultTrafficTags
} from '@/defaultTags'

const map: { [key: string]: string } = {
  'duplicated tag': '标签已存在'
}

@Component
export default class AddTag extends Vue {
  foodTags = defaultFoodTags
  shoppingTags = defaultShoppingTags
  trafficTags = defaultTrafficTags
  homeTags = defaultHomeTags
  entertainmentTags = defaultEntertainmentTags
  societyTags = defaultSocietyTags
  otherTags = defaultOtherTags

  selectedTag: TagItem = { name: 'food', value: '餐饮' }

  toggle(tag: TagItem) {
    this.selectedTag = tag
  }

  back() {
    this.$router.push('/money')
  }

  ok() {
    this.$store.commit('addTag', this.selectedTag)
    if (this.$store.state.addTagError) {
      window.alert(map[this.$store.state.addTagError.message] || '未知错误')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/helper.scss';

.tag {
  padding-bottom: 30px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: $color-highlight;
    font-size: 18px;

    > .ok {
      font-size: 14px;
      border: 0;
      background-color: transparent;
    }

    > .back {
      border: 0;
      background-color: transparent;
    }
  }

  .select {
    padding: 16px 16px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .icon {
      height: 40px;
      width: 40px;
      background-color: $color-highlight;
      padding: 5px;
      border-radius: 50%;
    }
  }

  .contents {
    overflow: auto;
    padding: 20px 8px 0 8px;

    .content {
      font-size: 18px;
      padding: 8px 0;

      .caption {
        text-align: center;
        margin: 5px;
      }

      .tags {
        display: flex;
        font-size: 14px;
        flex-wrap: wrap;

        li {
          width: 20%;
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 10px 0;

          .icon {
            height: 40px;
            width: 40px;
            background-color: #e8e8e8;
            padding: 5px;
            border-radius: 50%;
          }

          > span {
            padding-top: 5px;
          }

          &.selected {
            .icon {
              background-color: $color-highlight;
            }
          }
        }
      }
    }
  }
}
</style>
