if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let n={};const d=e=>a(e,t),r={module:{uri:t},exports:n,require:d};s[t]=Promise.all(c.map((e=>r[e]||d(e)))).then((e=>(i(...e),n)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/195-84c5dd9106dc084b.js",revision:"84c5dd9106dc084b"},{url:"/_next/static/chunks/247-d37ed3a049a759fa.js",revision:"d37ed3a049a759fa"},{url:"/_next/static/chunks/249.5ec9e62df29169ab.js",revision:"5ec9e62df29169ab"},{url:"/_next/static/chunks/422-b205d20d7538010e.js",revision:"b205d20d7538010e"},{url:"/_next/static/chunks/57-8a8c79ccef5e958a.js",revision:"8a8c79ccef5e958a"},{url:"/_next/static/chunks/596-3f18c29d88b986bc.js",revision:"3f18c29d88b986bc"},{url:"/_next/static/chunks/698.16ba223dac9a3b3e.js",revision:"16ba223dac9a3b3e"},{url:"/_next/static/chunks/framework-2c79e2a64abdb08b.js",revision:"2c79e2a64abdb08b"},{url:"/_next/static/chunks/main-d0f8f803b5ca1d95.js",revision:"d0f8f803b5ca1d95"},{url:"/_next/static/chunks/pages/_app-9f68cf16329b68eb.js",revision:"9f68cf16329b68eb"},{url:"/_next/static/chunks/pages/_error-f170ec85fda4fc04.js",revision:"f170ec85fda4fc04"},{url:"/_next/static/chunks/pages/admin/patients/create-4ad31dedf32923d4.js",revision:"4ad31dedf32923d4"},{url:"/_next/static/chunks/pages/admin/patients/edit/%5Bid%5D-6b77ad9621bf6e55.js",revision:"6b77ad9621bf6e55"},{url:"/_next/static/chunks/pages/admin/professionals-6a165e46fcf7cab7.js",revision:"6a165e46fcf7cab7"},{url:"/_next/static/chunks/pages/index-e500d5f9e197f8c0.js",revision:"e500d5f9e197f8c0"},{url:"/_next/static/chunks/pages/login-160ebc4cbcb1c4e0.js",revision:"160ebc4cbcb1c4e0"},{url:"/_next/static/chunks/pages/patients-142621ad5ca16271.js",revision:"142621ad5ca16271"},{url:"/_next/static/chunks/pages/patients/%5Bid%5D/observations-f675985bc79b1893.js",revision:"f675985bc79b1893"},{url:"/_next/static/chunks/pages/patients/%5Bid%5D/profile-567c1abe7485fce2.js",revision:"567c1abe7485fce2"},{url:"/_next/static/chunks/pages/profile/%5Bid%5D-887bea7e377cc477.js",revision:"887bea7e377cc477"},{url:"/_next/static/chunks/pages/profile/edit/%5Bid%5D-cac6d89badfcec44.js",revision:"cac6d89badfcec44"},{url:"/_next/static/chunks/pages/signup-f6857b63891c30fb.js",revision:"f6857b63891c30fb"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-a7cc2ed59ed8ff0b.js",revision:"a7cc2ed59ed8ff0b"},{url:"/_next/static/css/1684053723ad7062.css",revision:"1684053723ad7062"},{url:"/_next/static/css/17e108ceebc6512c.css",revision:"17e108ceebc6512c"},{url:"/_next/static/css/364eb66cb51f6dbf.css",revision:"364eb66cb51f6dbf"},{url:"/_next/static/css/ac6f757ea1449699.css",revision:"ac6f757ea1449699"},{url:"/_next/static/media/aidamLogo.89ca5f41.svg",revision:"87d11a8125bae11c324a481048bea289"},{url:"/_next/static/media/aidamTexto.8726e1cc.svg",revision:"5975c34480008f47e4962578e2d65fba"},{url:"/_next/static/media/arrowLeft.602dd941.svg",revision:"6d88d721d2f7d576f3b3c6bd71ce1c82"},{url:"/_next/static/media/cardIcon.341b1684.svg",revision:"4c98d732dab0c0612e3759f560bbc09c"},{url:"/_next/static/media/dotsMenu.b2fad971.svg",revision:"95042403282a97fe3a6bd847747f2fa7"},{url:"/_next/static/media/emailIcon.b5f891f9.svg",revision:"bf0e447dcfe7b05261894d6fdb7cbbe7"},{url:"/_next/static/media/hamburMenu.16ca2e76.svg",revision:"a62bc7309d70f7f63a6c9ce97e41769d"},{url:"/_next/static/media/licenseIcon.7a88351b.svg",revision:"28255cacda9bd81179415defbdca7d80"},{url:"/_next/static/media/logout-black.fff20b20.svg",revision:"b30555c6891d0037d06b3c6094f76ff1"},{url:"/_next/static/media/logout-white.dd557f95.svg",revision:"f7a55c8c7ebba882df37340eec1c62e7"},{url:"/_next/static/media/ok.5eb3dfe4.svg",revision:"92e72b2a36a711cb6ecae6283cf57d2a"},{url:"/_next/static/media/openEye.d5648dc1.svg",revision:"8310f836a828c376cf2a07d0483d4ad7"},{url:"/_next/static/media/pacientesLogo.ba5b910f.svg",revision:"fdcc7d60db69cb69fcfc4364462b0c43"},{url:"/_next/static/media/pdfIcon2.a4dd1a70.png",revision:"266edf24b1bc26bdf8f75c2fbc84585e"},{url:"/_next/static/media/phoneIcon.a84fcb45.svg",revision:"1f51fee2e273379740821097ce346757"},{url:"/_next/static/media/professionLogo.8536573d.svg",revision:"0fb9824dad3ea76c7c1606cae41f4469"},{url:"/_next/static/media/profileImage.0c5fdde5.svg",revision:"59e6cd31910df0ae07d489d13cbe1d9a"},{url:"/_next/static/media/profileLogo.acc5b5e2.svg",revision:"ca5f8d04be6908feba7c60268e5be997"},{url:"/_next/static/media/rightArrow.d99fab5f.svg",revision:"160695f98d129116023fea66344dee33"},{url:"/_next/static/media/rightCheckbox.332f85ec.svg",revision:"bd9ca1bda69ded81908b64f26b85bdd0"},{url:"/_next/static/media/scheduleIcon.4cd41f40.svg",revision:"9ef283ce26bdbd86e1d6b11495e1ba27"},{url:"/_next/static/media/search.e74bcb0a.svg",revision:"21633248d1c15cd4bce014acd83f4cae"},{url:"/_next/static/media/upload.eb70b895.svg",revision:"2ab59c323dbdb33e358ae6ab685d61e1"},{url:"/_next/static/media/wordIcon.0f975c7d.png",revision:"9ed2372af9a63c5905d5cf745757fbc5"},{url:"/_next/static/media/wrongCheckbox.de885685.svg",revision:"8c36b81faea88e97ad73f697608a2f5b"},{url:"/_next/static/media/x-white.6a770578.svg",revision:"8b4fd6f96ab2e62d9e54a34444ec2fbc"},{url:"/_next/static/media/x.16d2ce3b.svg",revision:"06c679e4a9e6e9530f1027ea1d546542"},{url:"/_next/static/ufGH6Y_RCnvLfoQHnBN54/_buildManifest.js",revision:"358150feb5155bf999a66b9e1c5ee4e5"},{url:"/_next/static/ufGH6Y_RCnvLfoQHnBN54/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/aidamLogo.png",revision:"450424da29a068715921c85d97868762"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/manifest.json",revision:"7347f9ba6514c4987941d5198f583703"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/thirteen.svg",revision:"53f96b8290673ef9d2895908e69b2f92"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
