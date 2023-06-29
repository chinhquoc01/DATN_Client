import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue')
		},
		{
			path: '/signup',
			name: 'signup',
			component: () => import('../views/SignUpView.vue')
		},
		{
			path: '/404',
			name: '404',
			component: () => import('../views/system/404.vue')
		},
		{
			path: '/403',
			name: '403',
			component: () => import('../views/system/403.vue')
		},
		
		{
			path: '/client',
			children: [
				{
					path: '',
					name: 'clientView',
					component: () => import('../views/client/ClientView.vue'),
				},
				{
					path: 'new-post',
					name: 'newPost',
					component: () => import('../views/client/NewPostView.vue')
				},
				{
					path: 'edit-post',
					name: 'editPost',
					component: () => import('../views/client/EditPostView.vue')
				},
				{
					path: 'work-detail/:workId',
					name: 'postDetail',
					component: () => import('../views/client/WorkDetailViewClient.vue')
				},
				{
					path: 'chat',
					name: 'chatClient',
					component: () => import('../components/ChatBox.vue')
				},
				{
					path: 'new-contract',
					name: 'newContract',
					component: () => import('../views/client/NewContractView.vue')
				},
			]
		},
		{
			path: '/freelancer',
			children: [
				{
					path: '',
					name: 'freelancerView',
					component: () => import('../views/freelancer/FreelancerView.vue')
				},
				{
					path: 'work/:workId',
					name: 'workDetail',
					component: () => import('../views/freelancer/WorkDetail.vue')
				},
				{
					path: 'chat',
					name: 'chatFreelancer',
					component: () => import('../components/ChatBox.vue')
				},
				{
					path: 'proposals',
					name: 'proposalList',
					component: () => import('../views/freelancer/ProposalListView.vue')
				},
				{
					path: 'contracts',
					name: 'contractList',
					component: () => import('../views/freelancer/ContractListView.vue')
				},
			]
		}
	]
})

router.beforeEach(async (to) => {
	const authStore = useAuthStore();

	// redirect to login page if not logged in and trying to access a restricted page
	const publicPages = ['/', '/login', '/signup', '/chat'];
	const authRequired = !publicPages.includes(to.path);

	const clientPages = ['client']
	const freelancerPages = ['freelancer']
	const bigPath = to.path.split('/')[1]

	const isClientPage = clientPages.includes(bigPath)
	const isFreelancerPage = freelancerPages.includes(bigPath)

	if (authRequired && !authStore.loggedIn) {
		authStore.returnUrl = to.fullPath;
		return '/login';
	}
	if ((isClientPage && !authStore.isClient()) || (isFreelancerPage && !authStore.isFreelancer())) {
		return '/403'
	}
});

export default router
