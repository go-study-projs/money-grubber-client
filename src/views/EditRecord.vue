<template>
  <div class="wrapper">
    <header class="header">
      <div class="goBack" @click="goBack">
        <Icon name="left" />
        <span class="left">返回</span>
      </div>
      <div class="title">
        <div class="icon-wrapper">
          <Icon :name="record.tag.name" />
        </div>
        <span>{{ record.tag.value }}</span>
      </div>
      <button class="delete" @click="deleteRecord">删除</button>
    </header>
    <main class="content">
      <div class="option">
        <span>类型：</span>
        <input type="text" disabled :value="outputType(record.type)" />
      </div>
      <div class="option">
        <span>金额：</span>
        <input type="number" v-model="record.amount" />
      </div>
      <div class="option">
        <DatePicker
          :original-time="record.createdAt"
          @update:year="updateYear"
          @update:month="updateMonth"
          @update:date="updateDate"
        />
      </div>
      <div class="option">
        <span>备注：</span>
        <input type="text" v-model="record.notes" />
      </div>
    </main>
    <footer class="footer">
      <button class="ok" @click="ok">编辑完成</button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import dayjs from 'dayjs'
// var isLeapYear = require('dayjs/plugin/isLeapYear');
import isLeapYear from 'dayjs/plugin/isLeapYear.js'
import DatePicker from '@/components/EditRecord/DatePicker.vue'

dayjs.extend(isLeapYear)
@Component({
  components: { DatePicker }
})
export default class EditRecord extends Vue {
  record?: RecordItem
  oldAmount = 0

  beforeCreate() {
    this.$store.commit('fetchRecordList')
  }

  created() {
    const id = this.$route.params.id
    const record = this.recordList.filter(t => t.id.toString() === id)[0]
    if (record) {
      this.record = record
      this.oldAmount = record.amount
    } else {
      this.$router.replace('/404')
    }
  }

  get recordList() {
    return (this.$store.state as RootState).recordList
  }

  updateYear(year: number) {
    if (this.record) {
      this.record.createdAt = dayjs(this.record.createdAt)
        .year(year)
        .toDate()
        .toISOString()
    }
  }

  updateMonth(month: number) {
    if (this.record) {
      this.record.createdAt = dayjs(this.record.createdAt)
        .month(month)
        .toDate()
        .toISOString()
    }
  }

  updateDate(date: number) {
    if (this.record) {
      this.record.createdAt = dayjs(this.record.createdAt)
        .date(date)
        .toDate()
        .toISOString()
    }
  }

  goBack() {
    this.$router.push('/statistics')
  }

  outputType(type: string) {
    if (type === '-') {
      return '支出'
    } else if (type === '+') {
      return '收入'
    }
  }

  ok() {
    if (this.record) {
      this.record.amount = parseFloat(this.record.amount.toString())
      this.$store.commit('updateRecord', {
        id: this.record.id,
        record: this.record
      })
      if (this.$store.state.createRecordError) {
        this.record.amount = this.oldAmount
      }
    }
  }

  deleteRecord() {
    const result = window.confirm('确认删除?')
    if (result) {
      if (this.record) {
        this.$store.commit('removeRecord', this.record.id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/helper.scss';

.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $color-highlight;
    position: relative;
    width: 100%;
    padding: 8px 8px;

    .goBack {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      padding-left: 8px;
      display: flex;
      justify-content: center;
      align-items: center;

      > .left {
        padding-left: 4px;
      }

      > .icon {
        width: 24px;
        height: 24px;
      }
    }

    .title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon-wrapper {
        width: 56px;
        height: 56px;
        background-color: whitesmoke;
        border-radius: 50%;
        display: flex;
        align-items: center;
        margin: 8px 0;
        justify-content: center;

        > .icon {
          width: 40px;
          height: 40px;
          color: #333;
        }
      }
    }

    button {
      background-color: #f60;
      border: #f60;
      color: #f5f5f5;
      border-radius: 4px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      padding: 4px 8px;
      margin-right: 8px;
    }
  }

  .content {
    flex-grow: 1;
    /*width:100%;*/
    padding: 8px;
    width: 100%;

    .option {
      border-bottom: 1px solid #ccc;
      padding: 4px;

      > span {
        padding-right: 4px;
      }

      > input {
        border: none;
        background-color: transparent;
        padding: 8px 0;
      }
    }
  }

  .footer {
    width: 100%;

    button {
      @extend %outerShadow;
      width: 100%;
      border: none;
      background-color: #fff;
      padding: 8px 0;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
