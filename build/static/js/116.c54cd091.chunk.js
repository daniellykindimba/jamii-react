"use strict";(self.webpackChunkJamii=self.webpackChunkJamii||[]).push([[116],{79116:function(e,t,n){n.r(t),n.d(t,{ControlHome:function(){return x}});var a=n(74165),r=n(15861),i=n(29439),o=n(68886),s=n(72791),l=n(6343),c=n(31425),u=n(80184),d=function(e){var t=(0,s.useState)([]),n=(0,i.Z)(t,2),o=(n[0],n[1]),d=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){var t,n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.Z.custom({url:c.Z.apiUrl+"/weekly/billing/payments/analytics",method:"get"}).then((function(e){return e})).catch((function(e){return{data:null}}));case 2:t=e.sent,n=t.data,console.log(n),n&&o(n.data);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,s.useEffect)((function(){d()}),[]),(0,u.jsx)(u.Fragment,{})},f=n(43110),Z=n(66106),p=n(30914),h=n(21985),v=n(1429),m=function(e){var t=(0,s.useState)([]),n=(0,i.Z)(t,2),o=(n[0],n[1]),d=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){var t,n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.Z.custom({url:c.Z.apiUrl+"/weekly/vikoba/contributions/analytics",method:"get"}).then((function(e){return e})).catch((function(e){return{data:null}}));case 2:t=e.sent,n=t.data,console.log(n),n&&o(n.data);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,s.useEffect)((function(){d()}),[]),(0,u.jsx)(u.Fragment,{})},x=function(e){var t=(0,s.useState)(!1),n=(0,i.Z)(t,2),x=n[0],j=n[1],y=(0,s.useState)({totalUsers:0,totalVikoba:0,totalVikobaMembers:0,totalDonations:0}),b=(0,i.Z)(y,2),k=b[0],g=b[1],w=(0,o.RU)(),S=(0,o.kS)({v3LegacyAuthProviderCompatible:Boolean(null===w||void 0===w?void 0:w.isLegacy)}).data,U=f.ZP.useBreakpoint(),V="undefined"!==typeof U.lg&&!U.lg,T=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){var t,n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return j(!0),e.next=3,l.Z.custom({url:c.Z.apiUrl+"/dashboard/analytics",method:"get"}).then((function(e){return e})).catch((function(e){return{data:null}}));case 3:t=e.sent,(n=t.data)&&g(n.data),j(!1);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,s.useEffect)((function(){!1===((null===S||void 0===S?void 0:S.isAdmin)||(null===S||void 0===S?void 0:S.isStaff))&&(window.location.href="/"),T()}),[]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(Z.Z,{children:[(0,u.jsx)(p.Z,{span:V?12:4,children:(0,u.jsx)(h.Z,{bordered:!1,size:"small",children:(0,u.jsx)(v.Z,{title:"Total Users",loading:x,value:k.totalUsers,precision:0,valueStyle:{color:"#3f8600"}})})}),(0,u.jsx)(p.Z,{span:V?12:4,children:(0,u.jsx)(h.Z,{bordered:!1,size:"small",children:(0,u.jsx)(v.Z,{title:"Total Vikoba",loading:x,value:k.totalVikoba,precision:0,valueStyle:{color:"#3f8600"}})})}),(0,u.jsx)(p.Z,{span:V?12:4,children:(0,u.jsx)(h.Z,{bordered:!1,size:"small",children:(0,u.jsx)(v.Z,{title:"Total Vikoba Members",loading:x,value:k.totalVikobaMembers,precision:0,valueStyle:{color:"#3f8600"}})})}),(0,u.jsx)(p.Z,{span:V?12:4,children:(0,u.jsx)(h.Z,{bordered:!1,size:"small",children:(0,u.jsx)(v.Z,{title:"Total Donations",loading:x,value:k.totalDonations,precision:0,valueStyle:{color:"#3f8600"}})})})]}),(0,u.jsxs)(Z.Z,{children:[(0,u.jsx)(p.Z,{span:V?24:12,style:{marginTop:5},children:(0,u.jsx)(h.Z,{title:"Weekly Service Payments",children:(0,u.jsx)(d,{})})}),(0,u.jsx)(p.Z,{span:V?24:12,style:{marginTop:5},children:(0,u.jsx)(h.Z,{title:"Weekly Vikoba Payments Collections",children:(0,u.jsx)(m,{})})})]})]})}}}]);
//# sourceMappingURL=116.c54cd091.chunk.js.map