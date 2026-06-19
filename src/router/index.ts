import { createRouter, createWebHashHistory } from 'vue-router'
// @ts-ignore
import LuckyWheel from '../views/LuckyWheel.vue'
// @ts-ignore
import LuckyWheelAdmin from '../views/LuckyWheelAdmin.vue'

const router = createRouter({
  // Vẫn giữ WebHashHistory để GitHub Pages không bị lỗi 404
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LuckyWheel, // Gắn giao diện thí sinh vào link gốc
    },
    {
      path: '/admin-quay-tai-cho', // TẠO ĐƯỜNG LINK BÍ MẬT Ở ĐÂY
      name: 'admin',
      component: LuckyWheelAdmin, // Gắn giao diện vô hạn vào link bí mật
    },
  ],
})

export default router