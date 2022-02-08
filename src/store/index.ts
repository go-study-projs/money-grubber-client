import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import router from '@/router';
import {defaultExpenseTags} from '@/defaultTags';
import createId from '@/lib/createId';
import retainDecimal from '@/lib/retainDecimal';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      recordList: [],
      tagList: [],
      createRecordError: null,
      addTagError: null
    } as RootState,
    mutations: {
      fetchTagList(state) {
        state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '0' ) || defaultExpenseTags;
      },
      addTag(state, payload: { name: string; value: string }) {
        state.addTagError = null;
        const {name, value} = payload;
        const nameList = state.tagList.map(item => item.name);
        if (nameList.indexOf(name) >= 0) {
          state.addTagError = new Error('duplicated tag');
          return;
        }
        state.tagList.push(payload);
        store.commit('saveTag');
        window.alert('添加成功');
        router.back();
      },
      saveTag(state) {
        window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
      },
      fetchRecordList(state) {
        state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
      },
      createRecord(state, record) {
        state.createRecordError = null;
        if (record.amount === 0) {
          state.createRecordError = new Error('Missing amount input!');
          window.alert('请输入金额');
          return;
        }
        const record2: RecordItem = clone(record);
        record2.createdAt = new Date().toISOString();
        record2.id = createId();
        state.recordList.push(record2);
        store.commit('saveRecord');
      },
      saveRecord(state) {
        window.localStorage.setItem('recordList',
          JSON.stringify(state.recordList));
      },
      updateRecord(state, payload: { id: number; record: RecordItem }) {
        state.createRecordError = null;
        const {id, record} = payload;
        if (parseFloat(retainDecimal(record.amount)) <= 0 || isNaN(record.amount)) {
          state.createRecordError = new Error('Missing amount input!');
          window.alert('请输入正确的金额');
          return;
        }
        for (let i = 0; i < state.recordList.length; i++) {
          if (state.recordList[i].id === id) {
            record.amount = parseFloat(retainDecimal(record.amount));
            state.recordList[i] = record;
          }
        }
        store.commit('saveRecord');
        window.alert('更改成功');
        router.back();
      },
      removeRecord(state, id: number) {
        let index = -1;
        for (let i = 0; i < state.recordList.length; i++) {
          if (state.recordList[i].id === id) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          state.recordList.splice(index, 1);
          store.commit('saveRecord');
          router.back();
        } else {
          window.alert('删除失败');
        }
      }
    }
  })
;

export default store;