import Vue from 'vue'
import Component from 'vue-class-component'
import dayjs from 'dayjs'

@Component
export class TimeHelper extends Vue {
  year = dayjs().year()
  month = dayjs().month() + 1
  get recordList() {
    return (this.$store.state as RootState).recordList
  }
  get yearList() {
    const thisYear = dayjs().year()
    let yearBegin = 1996
    const yearList: number[] = []
    while (yearBegin <= thisYear) {
      yearList.push(yearBegin)
      yearBegin++
    }
    return yearList
  }
  get currentMonthRecordList() {
    const { recordList } = this
    const result: RecordItem[] = []
    for (let i = 0; i < recordList.length; i++) {
      if (
        dayjs(recordList[i].createdAt).year() === this.year &&
        dayjs(recordList[i].createdAt).month() + 1 === this.month
      ) {
        result.push(recordList[i])
      }
    }
    return result
  }
}

export default TimeHelper
