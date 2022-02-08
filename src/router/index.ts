import Vue from 'vue';
import VueRouter from 'vue-router';
import Money from '@/views/Money.vue';
import Labels from '@/views/Labels.vue';
import Chart from '@/views/Chart.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue';
import EditRecord from '@/views/EditRecord.vue';
import AddTag from '@/views/AddTag.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/statistics'
  },
  {
    path: '/money',
    component: Money
  },
  {
    path: '/labels',
    component: Labels
  },
  {
    path: '/chart',
    component: Chart
  },
  {
    path: '/statistics',
    component: Statistics
  },
  {
    path: '/record/edit/:id',
    component: EditRecord
  },
  {
    path: '/addtag',
    component: AddTag
  },
  {
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes
});

export default router;
