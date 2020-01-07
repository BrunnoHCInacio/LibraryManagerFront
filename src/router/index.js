import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/components/dashboard/Dashboard'
import Login from '@/components/login/Login'

import BooksListing from '@/components/Books/BooksListing'
import BooksRegister from '@/components/Books/BooksRegister'

import PeoplesRegister from '@/components/Peoples/PeoplesRegister'
import PeoplesListing from '@/components/Peoples/PeoplesListing'

import LoansRegister from '@/components/Loans/LoansRegister'
import LoansListing from '@/components/Loans/LoansListing'
import Loansdevolution from '@/components/Loans/LoansReturn'

Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/',
			redirect: 'auth/dashboard',
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/auth',
			name: 'Layout',
			component: Layout,
			meta: {
				requireAuth: true,
			},
			children: [
				{
					path: 'dashboard',
					name: 'Dashboard',
					component: Dashboard
				},
				{
					name: 'BooksRegister',
					path: 'livros/cadastrar',
					component: BooksRegister
				},
				{
					name: 'BooksListing',
					path: 'livros/consultar',
					component: BooksListing
				},
				{
					name: 'PeoplesRegister',
					path: 'pessoas/cadastrar',
					component: PeoplesRegister
				},
				{
					name: 'PeoplesListing',
					path: 'pessoas/consultar',
					component: PeoplesListing
				},
				{
					name: 'LoansRegister',
					path: 'emprestimos/cadastrar',
					component: LoansRegister
				},
				{
					name: 'LoansListing',
					path: 'emprestimos/consultar',
					component: LoansListing
				},
			
			]
		},
		{
			path: '*',
			redirect: 'auth/dashboard',
		}
	]
});

router.beforeEach((to, from, next) => {
	let isDelegated = false;

	for (let matched = (to.matched || []), i = matched.length; i--;) {
		const route = matched[i];

		if (route.beforeEnter) {
			isDelegated = true;
			route.beforeEnter(to, from, next);
		}
	}

	!isDelegated && next();
	
	const lsToken = localStorage.getItem('token');
			
	if (lsToken && to.fullPath === '/login') {
		next('/auth/dashboard');
	}
	if (to.matched.some(record => record.meta.requireAuth)) {
		if (!lsToken && to.fullPath !== '/login') {
			next('/login?q=unauthenticated');
		} else {
			next();
		}
	} else {
		next();
	}
});



export default router;