// KO 원본(data-i18n + I18N.en 사전)에서 정적 영문 페이지를 생성:  node tools/build-en.cjs
const fs=require('fs'),path=require('path'),vm=require('vm');
const PAGES=[
  {src:'index.html',out:'en/index.html',canonical:'https://inayou.io/en/',
   title:'INAYOU — AI & data venture studio: brands discovered, people connected',
   desc:'INAYOU plans and runs its own B2B and B2C services with AI and data — brand discovery, reputation and PR, admissions conversion, and taste-based recommendation. Dominus · Presfi · Unimate · NeuPAI · Hansool · K-TravelMate.',
   ogTitle:'INAYOU — AI & data venture studio',ogDesc:'With AI and data, brands get discovered and people get connected.',
   ldDesc:'A venture studio that plans and operates B2B and B2C services with AI and data.',
   links:[['href="/en/" hreflang="en" lang="en">EN</a>','href="/" hreflang="ko" lang="ko">한국어</a>']]}
];
const BS=92,DQ=34;
function extractDict(src){const i=src.indexOf('en: {');if(i<0)throw new Error('I18N.en not found');
  let d=0,j=src.indexOf('{',i),k=j,inStr=false,escN=false;
  for(;k<src.length;k++){const c=src.charCodeAt(k);
    if(inStr){if(escN)escN=false;else if(c===BS)escN=true;else if(c===DQ)inStr=false;continue;}
    if(c===DQ)inStr=true;else if(src[k]==='{')d++;else if(src[k]==='}'){d--;if(d===0)break;}}
  return vm.runInNewContext('('+src.slice(j,k+1)+')');}
for(const pg of PAGES){
  if(!fs.existsSync(pg.src)){console.log('  skip (no src):',pg.src);continue;}
  let s=fs.readFileSync(pg.src,'utf8');const dict=extractDict(s);let hit=0,miss=[];
  for(const [key,val] of Object.entries(dict)){
    const k=key.split('.').join('[.]');
    const re=new RegExp(String.raw`(<([a-z0-9]+)[^>]*? data-i18n="${k}"[^>]*>)([^]*?)(</\2>)`,'g');
    let c=0;s=s.replace(re,(m,open,tag,inner,close)=>{c++;return open+val+close;});
    if(c)hit+=c;else miss.push(key);
  }
  s=s.replace('<html lang="ko">','<html lang="en">')
     .replace(/<title>[^<]*<\/title>/,'<title>'+pg.title+'</title>')
     .replace(/(<meta name="description" content=")[^"]*(")/,'$1'+pg.desc+'$2')
     .replace(/(<meta property="og:title" content=")[^"]*(")/,'$1'+pg.ogTitle+'$2')
     .replace(/(<meta property="og:description" content=")[^"]*(")/,'$1'+pg.ogDesc+'$2')
     .replace(/(<meta name="twitter:title" content=")[^"]*(")/,'$1'+pg.ogTitle+'$2')
     .replace(/(<meta name="twitter:description" content=")[^"]*(")/,'$1'+pg.ogDesc+'$2')
     .replace(/(<link rel="canonical" href=")[^"]*(")/,'$1'+pg.canonical+'$2')
     .replace(/(<meta property="og:url" content=")[^"]*(")/,'$1'+pg.canonical+'$2')
     .replace('<meta property="og:locale" content="ko_KR">','<meta property="og:locale" content="__EN__">')
     .replace('<meta property="og:locale:alternate" content="en_US">','<meta property="og:locale:alternate" content="ko_KR">')
     .replace('__EN__','en_US')
     .replace('"inLanguage": "ko-KR"','"inLanguage": "en-US"')
     .replace(/src="images\//g,'src="/images/');
  if(pg.ldDesc)s=s.replace(/("description": ")[^"]*(")/,'$1'+pg.ldDesc+'$2');
  for(const [a,b] of (pg.links||[])){if(!s.includes(a))console.warn('  ! link not found:',a);s=s.split(a).join(b);}
  fs.mkdirSync(path.dirname(pg.out),{recursive:true});fs.writeFileSync(pg.out,s);
  console.log('✓ '+pg.out+'  ('+hit+' i18n replaced'+(miss.length?', missing: '+miss.join(','):'')+')');
}
