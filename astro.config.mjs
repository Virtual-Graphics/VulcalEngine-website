// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://virtual-graphics.github.io',
	base: '/VulcalEngine-website',
	integrations: [
		starlight({
			title: 'VulcalEngine Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Virtual-Graphics/VulcalEngine' }],
			// sidebar: [
			// 	{
			// 		label: 'Guides',
			// 		items: [
			// 			// Each item here is one entry in the navigation menu.
			// 			{ label: 'Example Guide', slug: 'guides/example' },
			// 		],
			// 	},
			// 	{
			// 		label: 'Reference',
			// 		items: [{ autogenerate: { directory: 'reference' } }],
			// 	},
			// ],
		}),
	],
});
