<template>
  <div>
    <Layout notMoney="true" class-prefix="chart">
      <div class="chart-wrapper">
        <Types
          class-prefix="chart"
          :value.sync="selectedOption"
          :display-word="displayWord"
          :option-list="optionList"
        />
        <div class="result-wrapper" v-if="currentMonthRecordList.length > 0">
          <div class="chart">
            <div class="caption">
              <div class="expense">
                <span>总收入：{{ totalAmount[1] }}</span>
                <span>平均值：{{ averageAmount[1] }}</span>
              </div>
              <div class="income">
                <span>总支出：{{ totalAmount[0] }}</span>
                <span>平均值：{{ averageAmount[0] }}</span>
              </div>
            </div>
            <div
              id="content"
              class="content"
              style="width: 100%; height: 200px"
            ></div>
          </div>
          <div class="rankedListCaption">支出排行榜</div>
          <ul class="rankedList">
            <li class="content" v-for="item in kindRank" :key="item[0]">
              <div class="icon-wrapper">
                <Icon :name="item[0]" />
                <span>{{ item[1][0] }}</span>
                <span>{{ item[1][1] }}</span>
              </div>
              <div
                class="bar"
                :style="{
                  transition: 'all .3s',
                  height: '5px',
                  width: item[1][1],
                  backgroundColor: '#ffdb00',
                  borderRadius: '4px'
                }"
              />
            </li>
          </ul>
        </div>
        <div v-else class="noResult">
          <span class="noResult-message">还没有记录哦，赶紧记一笔吧~</span>
          <icon class="noResult-icon" name="nothing" />
        </div>
      </div>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Types from '@/components/Money/Types.vue'
import dayjs from 'dayjs'
import echarts from 'echarts'
import 'zrender/lib/svg/svg'
import retainDecimal from '@/lib/retainDecimal'
import clone from '@/lib/clone'
import TimeHelper from '@/mixins/timeHelper'

@Component({
  components: { Types }
})
export default class Chart extends mixins(TimeHelper) {
  selectedOption = 'month'
  displayWord = ['按年', '按月']
  optionList = ['year', 'month']

  // 当月天数
  get day() {
    const dayList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (dayjs(this.year).isLeapYear() && this.month === 2) {
      return 29
    } else {
      return dayList[this.month - 1]
    }
  }

  beforeCreate() {
    this.$store.commit('fetchRecordList')
  }

  mounted() {
    if (this.currentMonthRecordList.length > 0) {
      this.makeChart()
    }
  }

  // 当年记录
  get currentYearRecordList() {
    const { recordList } = this
    const result: RecordItem[] = []
    for (let i = 0; i < recordList.length; i++) {
      if (dayjs(recordList[i].createdAt).year() === this.year) {
        result.push(recordList[i])
      }
    }
    return result
  }

  // type筛选器
  typeFilter(recordList: RecordItem[], type: string): RecordItem[] {
    const result: RecordItem[] = []
    for (let i = 0; i < recordList.length; i++) {
      if (recordList[i].type === type) {
        result.push(recordList[i])
      }
    }
    return result
  }

  // 支出列表
  get expenseList() {
    if (this.selectedOption === 'year') {
      return this.typeFilter(this.currentYearRecordList, '-')
    } else {
      return this.typeFilter(this.currentMonthRecordList, '-')
    }
  }

  // 收入列表
  get incomeList() {
    if (this.selectedOption === 'year') {
      return this.typeFilter(this.currentYearRecordList, '+')
    } else {
      return this.typeFilter(this.currentMonthRecordList, '+')
    }
  }

  // 支出分类列表
  get kindList() {
    const { expenseList } = this
    const result: string[] = []
    for (let i = 0; i < expenseList.length; i++) {
      result.push(expenseList[i].tag.name)
    }
    return Array.from(new Set(result))
  }

  // 排行榜数据计算器
  get kindMap() {
    const { kindList, expenseList } = this
    type mapValue = [string, number]
    const result = new Map<string, mapValue>()
    for (let i = 0; i < kindList.length; i++) {
      result.set(kindList[i], ['', 0])
    }
    for (const record of expenseList) {
      const key = record.tag.name
      const amount = result.get(key) as mapValue
      result.set(key, [record.tag.value, amount[1] + record.amount])
    }
    result.forEach((value, key) => {
      const value2 = [
        value[0],
        (value[1] / parseFloat(this.totalAmount[0])) * 100
      ] as mapValue
      result.set(key, value2)
    })
    return result
  }

  // 排序
  get kindRank() {
    const { kindMap } = this
    const kindList = Array.from(kindMap)
    return clone(kindList)
      .sort((a, b) => b[1][1] - a[1][1])
      .map(item => [item[0], [item[1][0], retainDecimal(item[1][1]) + '%']])
  }

  // 计算Map数据 [横坐标,纵坐标]
  intervalMap(recordList: RecordItem[]) {
    const result = new Map<string, number>()
    if (this.selectedOption === 'year') {
      const keys = [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ]
      for (const month of keys) {
        result.set(month, 0)
      }
      for (const record of recordList) {
        const key = keys[dayjs(record.createdAt).month()]
        const amount = result.get(key) as number
        result.set(key, amount + record.amount)
      }
    } else {
      for (let i = 0; i < this.day; i++) {
        result.set((i + 1).toString(), 0)
      }
      for (const record of recordList) {
        const key = dayjs(record.createdAt)
          .date()
          .toString()
        const amount = result.get(key) as number
        result.set(key, amount + record.amount)
      }
    }
    return result
  }

  // 图表数据计算器
  get calculateChartData(): Map<string, number>[] {
    const expenseMap = this.intervalMap(this.expenseList)
    const incomeMap = this.intervalMap(this.incomeList)
    return [expenseMap, incomeMap]
  }

  // 计算总值 string
  get totalAmount() {
    let sum1 = 0
    let sum2 = 0
    let totalExpenseAmount = '0'
    let totalIncomeAmount = '0'
    const { calculateChartData: result } = this
    const totalExpenseList = [...result[0].values()]
    const totalIncomeList = [...result[1].values()]
    for (let i = 0; i < totalExpenseList.length; i++) {
      sum1 += totalExpenseList[i]
      totalExpenseAmount = retainDecimal(sum1)
    }
    for (let i = 0; i < totalIncomeList.length; i++) {
      sum2 += totalIncomeList[i]
      totalIncomeAmount = retainDecimal(sum2)
    }
    return [totalExpenseAmount, totalIncomeAmount]
  }

  // 计算均值 string
  get averageAmount() {
    let averageExpense
    let averageIncome
    let passTime
    if (this.selectedOption === 'year') {
      passTime = this.month
    } else {
      passTime = dayjs().date()
    }
    averageExpense = parseFloat(this.totalAmount[0]) / passTime
    averageIncome = parseFloat(this.totalAmount[1]) / passTime
    averageIncome = retainDecimal(averageIncome)
    averageExpense = retainDecimal(averageExpense)
    return [averageExpense, averageIncome]
  }

  makeChart() {
    const content = echarts.init(
      document.getElementById('content') as HTMLDivElement,
      undefined,
      { renderer: 'svg' }
    )
    const { calculateChartData } = this
    const x = [...calculateChartData[0].keys()]
    const expenseY = [...calculateChartData[0].values()]
    const incomeY = [...calculateChartData[1].values()]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const option: any = {
      grid: {
        top: '20%',
        bottom: '10%',
        left: '15%',
        right: '15%'
      },
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ['line', 'bar'] }
        }
      },
      legend: {
        data: ['收入', '支出']
      },
      xAxis: {
        data: x,
        splitLine: {
          show: false
        },
        axisTick: {
          lineStyle: {
            opacity: 0
          }
        },
        axisLabel: {
          interval: x.length > 12 ? 1 : 0,
          fontSize: 10
        }
      },
      yAxis: {
        axisTick: {
          lineStyle: {
            opacity: 0.5
          }
        },
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '支出',
          type: 'bar',
          color: '#3cb2ef',
          data: expenseY,
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          },
          animationDelay: function(idx: number) {
            return idx * 10
          }
        },
        {
          name: '收入',
          type: 'bar',
          color: '#ffdb00',
          data: incomeY,
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          },
          animationDelay: function(idx: number) {
            return idx * 10 + 100
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function(idx: number) {
        return idx * 5
      }
    }
    content.setOption(option)
  }

  @Watch('selectedOption')
  onSelectedOptionChange() {
    if (
      this.currentMonthRecordList.length > 0 ||
      this.currentYearRecordList.length > 0
    ) {
      this.makeChart()
    } else {
      return
    }
  }
}
</script>

<style lang="scss">
.chart-content {
  display: flex;
  flex-direction: column;
}
</style>

<style scoped lang="scss">
@import '~@/assets/styles/helper.scss';

::v-deep .chart-item {
  border: 1px solid #333;
  margin: 16px 0 16px 0;
  font-size: 16px;
  padding: 8px 56px;

  &:nth-child(1) {
    border-radius: 10px 0 0 10px;
  }

  &:nth-child(2) {
    border-radius: 0 10px 10px 0;
  }

  &.selected {
    background-color: #333333;
    color: $color-highlight;

    &::after {
      display: none;
    }
  }
}

.chart-wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;

  .result-wrapper {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    overflow: auto;

    .chart {
      padding: 8px 16px;

      .caption {
        padding: 8px 0;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
        color: #888;
        margin-bottom: 8px;

        > .expense,
        .income {
          padding-bottom: 4px;
          display: flex;
          align-items: center;

          > span:first-child {
            padding: 0 4px;
          }

          > span:last-child {
            padding-left: 8px;
            font-size: 12px;
          }
        }
      }
    }

    .rankedListCaption {
      color: #666;
      padding: 8px 0 0 0;
      border-top: 1px solid #ccc;
      margin: 8px 16px;
      font-size: 16px;
    }

    .rankedList {
      color: #666;
      flex-grow: 1;
      overflow: auto;
      padding: 0 16px;
      font-size: 14px;

      .content {
        padding-bottom: 8px;

        .icon-wrapper {
          padding: 8px 0;
          display: flex;
          align-items: center;

          > .icon {
            border: 1px solid red;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            padding: 4px;
            text-align: center;
          }

          > * {
            margin-right: 8px;
          }
        }
      }
    }
  }

  .noResult {
    flex-grow: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-message {
      padding: 30px;
    }

    .noResult-icon {
      width: 128px;
      height: 128px;
    }
  }
}
</style>
