"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[7918,9166],{37918:(e,t,o)=>{o.r(t),o.d(t,{default:()=>p});var n=o(2756),s=o(92681),a=o(64145),r=o(28845),c=o(14931);const i={id:"@jupyter-notebook/console-extension:opener",requires:[n.IRouter],autoStart:!0,description:"A plugin to open consoles in a new tab",activate:(e,t)=>{const{commands:o}=e,n=new RegExp("/consoles/(.*)"),s="router:console";o.addCommand(s,{execute:e=>{const t=e.path.match(n);if(!t)return;const[,s]=t;if(!s)return;const a=decodeURIComponent(s);o.execute("console:create",{path:a})}}),t.register({command:s,pattern:n})}},d={id:"@jupyter-notebook/console-extension:redirect",requires:[s.IConsoleTracker],optional:[r.INotebookPathOpener],autoStart:!0,description:"Open consoles in a new tab",activate:(e,t,o)=>{const n=a.PageConfig.getBaseUrl(),s=null!=o?o:r.defaultNotebookPathOpener;t.widgetAdded.connect((async(t,o)=>{const{sessionContext:r}=o;await r.ready,(0,c.find)(e.shell.widgets("main"),(e=>e.id===o.id))||(s.open({prefix:a.URLExt.join(n,"consoles"),path:r.path,target:"_blank"}),o.dispose())}))}},p=[i,d]}}]);
//# sourceMappingURL=7918.57ec121.js.map