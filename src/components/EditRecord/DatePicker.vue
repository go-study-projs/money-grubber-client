<template>
  <div>
    <div class="option">
      <span>日期：</span>
      <div >
        <select  v-model="originYear" name="year" id="year">
          <option v-for="year in yearList" :key="year">{{year}}</option>
        </select>
        <span>年</span>
      </div>
      <div>
        <select  v-model="originMonth" name="month" id="month">
          <option v-for="month in monthList" :key="month" :value="month">
            {{dateFormat(month)}}
          </option>
        </select>
        <span>月</span>
      </div>
      <div>
        <select  v-model="originDate" name="date" id="date">
          <option v-for="date in dateList" :key="date" :value="date">
            {{dateFormat(date)}}
          </option>
        </select>
        <span>日</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import dayjs from 'dayjs';

  @Component
  export default class DatePicker extends Vue {
    @Prop() originalTime?: string;
    originYear = dayjs(this.originalTime).year();
    originMonth = dayjs(this.originalTime).month()+1;
    originDate = dayjs(this.originalTime).date();

    get yearList() {
      const thisYear = dayjs().year();
      let yearBegin = 1996;
      const yearList: number[] = [];
      while (yearBegin <= thisYear) {
        yearList.push(yearBegin);
        yearBegin++;
      }
      return yearList;
    }

    monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    get dateList() {
      const originMonth = this.originMonth.toString();
      const originYear = this.originYear.toString();

      if (dayjs(originYear).isLeapYear() && originMonth === '2') {
        return 29;
      } else if (!dayjs(originYear).isLeapYear() && originMonth === '2') {
        return 28;
      } else if (['1', '3', '5', '7', '8', '10', '12'].indexOf(originMonth) > 0) {
        return 31;
      } else {
        return 30;
      }
    }

    dateFormat(value: number) {
      if (value < 10) {
        return '0' + value.toString();
      } else {
        return value.toString();
      }
    }


    @Watch('originYear')
    onOriginYearChange(originYear: number) {
      this.$emit('update:year', originYear);
    }

    @Watch('originMonth')
    onOriginMonthChange(originMonth: number) {
      this.$emit('update:month', originMonth - 1);
    }

    @Watch('originDate')
    onOriginDateChange(originDate: number) {
      this.$emit('update:date', originDate);
    }


  }
</script>

<style scoped lang="scss">
  .option {
    display: flex;
    align-items: center;
    select {
      border: none;
      outline:none;
      background-color: transparent;
      font-size: 16px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      padding: 8px;
    }
  }
</style>