<template>
  <div>
    <Layout class-prefix="layout">
      <NumberPad :value.sync="record.amount" @submit="saveRecord"/>
      <Notes :value.sync="record.notes"/>
      <Tags v-if="record.type==='-'" :selected-tag.sync="record.tag" :expense="true" :tag-list="expenseTagList"/>
      <Tags v-else-if="record.type==='+'" :selected-tag.sync="record.tag" :tag-list="incomeTagList"/>
      <Types :value.sync="record.type" class-prefix="money" :cancelButton="true" :display-word="displayWord"
             :option-list="optionList"/>
    </Layout>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import NumberPad from '@/components/Money/NumberPad.vue';
  import Notes from '@/components/Money/Notes.vue';
  import Tags from '@/components/Money/Tags.vue';
  import Types from '@/components/Money/Types.vue';
  import {defaultIncomeTags} from '@/defaultTags';

  @Component({
    components: {Types, Tags, Notes, NumberPad},
  })
  export default class Money extends Vue {
    incomeTagList: TagItem[] = defaultIncomeTags;
    record = this.initRecord();
    displayWord = ['支出', '收入'];
    optionList = ['-', '+'];

    created() {
      this.$store.commit('fetchRecordList');
      this.$store.commit('fetchTagList');
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    get expenseTagList() {
      return (this.$store.state as RootState).tagList;
    }

    initRecord() {
      return {tag: {name: 'food', value: '餐饮'}, notes: '', type: '-', amount: 0};
    }

    saveRecord() {
      this.$store.commit('createRecord', this.record);
      if(this.$store.state.createRecordError === null){
        window.alert('记录成功！');
        this.record.notes = '';
        this.$router.push('/statistics')
      }
    }

    @Watch('record.type')
    onRecordTypeChange(type: string) {
      if (type === '-') {
        this.record.tag = {name: 'food', value: '餐饮'};
      } else if (type === '+') {
        this.record.tag = {name: 'salary', value: '工资'};
      }
    }
  }
</script>

<style lang="scss">
  .layout-content {
    display: flex;
    flex-direction: column-reverse;
  }
</style>
<style lang="scss" scoped>
  ::v-deep .money-item {
    padding: 15px 20px 10px;
  }
</style>
